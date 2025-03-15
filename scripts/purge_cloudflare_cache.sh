#!/bin/bash

# Cloudflare Cache Purge Script
# This script purges the cache for all domains in all zones associated with your Cloudflare account

# Load environment variables from .env file if it exists
ENV_FILE="$(dirname "$0")/.env"
if [ -f "$ENV_FILE" ]; then
    echo "Loading configuration from $ENV_FILE"
    source "$ENV_FILE"
else
    echo "No .env file found at $ENV_FILE"
fi

# Configuration
# You can set these variables in the .env file or as environment variables
CF_EMAIL=${CF_EMAIL:-""}
CF_API_KEY=${CF_API_KEY:-""}

# Optional: Specify a single zone ID to purge (leave empty to fetch all zones)
CF_ZONE_ID=${CF_ZONE_ID:-""}

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

# Check if credentials are set
if [[ -z "$CF_EMAIL" || -z "$CF_API_KEY" ]]; then
    echo -e "${RED}Error: Cloudflare credentials not set${NC}"
    echo -e "Please set CF_EMAIL and CF_API_KEY in one of the following ways:"
    echo -e "1. Create a .env file in the same directory as this script with the following content:"
    echo -e "   CF_EMAIL=\"your-email@example.com\""
    echo -e "   CF_API_KEY=\"your-global-api-key\""
    echo -e "2. Set environment variables before running the script:"
    echo -e "   export CF_EMAIL=\"your-email@example.com\""
    echo -e "   export CF_API_KEY=\"your-global-api-key\""
    echo -e "   ./$(basename "$0")"
    exit 1
fi

# Function to purge cache for a specific zone
purge_zone_cache() {
    local zone_id=$1
    local zone_name=$2
    
    echo -e "${YELLOW}Purging cache for zone: ${zone_name} (${zone_id})${NC}"
    
    # API call to purge everything using Global API Key
    purge_result=$(curl -s -X POST "https://api.cloudflare.com/client/v4/zones/${zone_id}/purge_cache" \
        -H "X-Auth-Email: ${CF_EMAIL}" \
        -H "X-Auth-Key: ${CF_API_KEY}" \
        -H "Content-Type: application/json" \
        --data '{"purge_everything":true}')
    
    # Check if the purge was successful
    success=$(echo "$purge_result" | grep -o '"success":\s*true')
    
    if [[ -n "$success" ]]; then
        echo -e "${GREEN}✓ Successfully purged cache for ${zone_name}${NC}"
    else
        error_msg=$(echo "$purge_result" | grep -o '"message":"[^"]*"' | sed 's/"message":"//;s/"$//')
        echo -e "${RED}✗ Failed to purge cache for ${zone_name}: ${error_msg}${NC}"
        echo -e "${YELLOW}Full response:${NC}"
        echo "$purge_result"
    fi
}

# If a specific zone ID is provided, only purge that zone
if [[ -n "$CF_ZONE_ID" ]]; then
    echo -e "${YELLOW}Purging cache for specified zone ID: ${CF_ZONE_ID}${NC}"
    purge_zone_cache "$CF_ZONE_ID" "Specified Zone"
    exit 0
fi

# Get all zones using Global API Key
echo -e "${YELLOW}Fetching all zones from Cloudflare...${NC}"
zones_result=$(curl -s -X GET "https://api.cloudflare.com/client/v4/zones?per_page=100" \
    -H "X-Auth-Email: ${CF_EMAIL}" \
    -H "X-Auth-Key: ${CF_API_KEY}" \
    -H "Content-Type: application/json")

# Check if zones were fetched successfully
success=$(echo "$zones_result" | grep -o '"success":\s*true')

if [[ -z "$success" ]]; then
    error_msg=$(echo "$zones_result" | grep -o '"message":"[^"]*"' | sed 's/"message":"//;s/"$//')
    echo -e "${RED}Failed to fetch zones: ${error_msg}${NC}"
    echo -e "${YELLOW}Full response:${NC}"
    echo "$zones_result"
    echo -e "${YELLOW}Please check your Cloudflare credentials.${NC}"
    echo -e "${YELLOW}For Global API Key, go to: https://dash.cloudflare.com/profile/api-tokens and view your Global API Key${NC}"
    exit 1
fi

# Extract zone IDs and names
zone_ids=$(echo "$zones_result" | grep -o '"id":"[^"]*"' | sed 's/"id":"//;s/"$//')
zone_names=$(echo "$zones_result" | grep -o '"name":"[^"]*"' | sed 's/"name":"//;s/"$//')

# Convert to arrays
IFS=$'\n' read -d '' -ra zone_id_array <<< "$zone_ids"
IFS=$'\n' read -d '' -ra zone_name_array <<< "$zone_names"

# Count zones
zone_count=${#zone_id_array[@]}

if [[ $zone_count -eq 0 ]]; then
    echo -e "${RED}No zones found in your Cloudflare account.${NC}"
    exit 1
fi

echo -e "${GREEN}Found ${zone_count} zones in your Cloudflare account.${NC}"

# Filter out zones that don't match confoot domains
echo -e "${YELLOW}Filtering to only include confoot domains...${NC}"
filtered_zone_ids=()
filtered_zone_names=()

for ((i=0; i<${#zone_id_array[@]}; i++)); do
    zone_name="${zone_name_array[$i]}"
    zone_id="${zone_id_array[$i]}"
    
    # Only include confoot domains and exclude account names and free websites
    if [[ "$zone_name" == *"confoot"* && "$zone_name" != *"Account"* && "$zone_name" != *"Free Website"* ]]; then
        filtered_zone_ids+=("$zone_id")
        filtered_zone_names+=("$zone_name")
    fi
done

filtered_count=${#filtered_zone_ids[@]}
echo -e "${GREEN}Filtered to ${filtered_count} confoot domains.${NC}"

# Purge cache for each filtered zone
for ((i=0; i<${#filtered_zone_ids[@]}; i++)); do
    purge_zone_cache "${filtered_zone_ids[$i]}" "${filtered_zone_names[$i]}"
done

echo -e "${GREEN}Cache purge operation completed for all confoot domains.${NC}"
