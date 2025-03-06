#!/bin/bash

# Script to create necessary files for multi-domain setup
# This will create domain-specific directories and CNAME files

# Create directories for each domain
mkdir -p domains/www.confoot.cz
mkdir -p domains/www.confoot.sk
mkdir -p domains/www.confoot.de
mkdir -p domains/www.confoot.eu
mkdir -p domains/www.confoot.co.uk
mkdir -p domains/www.confoot.gr
mkdir -p domains/www.confoot.hr
mkdir -p domains/www.confoot.lt
mkdir -p domains/www.confoot.ru
mkdir -p domains/www.confoot.lv
mkdir -p domains/www.confoot.si
mkdir -p domains/www.confoot.ro
mkdir -p domains/www.confoot.li
mkdir -p domains/www.confoot.at
mkdir -p domains/www.confoot.ch
mkdir -p domains/www.confoot.pt

# Create CNAME files for each domain
echo "www.confoot.cz" > domains/www.confoot.cz/CNAME
echo "www.confoot.sk" > domains/www.confoot.sk/CNAME
echo "www.confoot.de" > domains/www.confoot.de/CNAME
echo "www.confoot.eu" > domains/www.confoot.eu/CNAME
echo "www.confoot.co.uk" > domains/www.confoot.co.uk/CNAME
echo "www.confoot.gr" > domains/www.confoot.gr/CNAME
echo "www.confoot.hr" > domains/www.confoot.hr/CNAME
echo "www.confoot.lt" > domains/www.confoot.lt/CNAME
echo "www.confoot.ru" > domains/www.confoot.ru/CNAME
echo "www.confoot.lv" > domains/www.confoot.lv/CNAME
echo "www.confoot.si" > domains/www.confoot.si/CNAME
echo "www.confoot.ro" > domains/www.confoot.ro/CNAME
echo "www.confoot.li" > domains/www.confoot.li/CNAME
echo "www.confoot.at" > domains/www.confoot.at/CNAME
echo "www.confoot.ch" > domains/www.confoot.ch/CNAME
echo "www.confoot.pt" > domains/www.confoot.pt/CNAME

echo "Domain directories and CNAME files created successfully."
