#!/usr/bin/env python3
"""
translate_files.py

This script translates YAML and Markdown files from an English directory to other language directories.
It uses OpenAI's o3-mini model for translation and preserves the directory structure.
Translations are processed in parallel (up to 10 concurrent requests) to improve performance.

Usage:
    python translate_files.py [--path /path/to/en]

Prerequisites:
    - Python 3.6 or higher
    - OpenAI API key (set in .env file or as environment variable OPENAI_API_KEY)
    - Required packages: openai, tqdm, python-dotenv

Examples:
    # Basic usage (will use ../content/en/ relative to the script location)
    python translate_files.py
    
    # With explicit path
    python translate_files.py --path /Users/username/documents/en
    
    # With API key as environment variable
    export OPENAI_API_KEY="your-api-key"
    python translate_files.py

Directory Structure:
    The script expects a directory structure like:
    /parent_directory/
    ├── en/                  # Source English directory
    │   ├── file1.md         # Files to translate
    │   ├── file2.yaml
    │   └── subdirectory/    # Subdirectories are processed recursively
    ├── fr/                  # Target French directory (will be created if it doesn't exist)
    ├── es/                  # Target Spanish directory
    └── de/                  # Target German directory
    
    The script will automatically detect target language directories as siblings of the 'en' directory.
"""

import os
import sys
import argparse
import openai
import concurrent.futures
import time
from pathlib import Path
from tqdm import tqdm
from dotenv import load_dotenv

# Load environment variables from .env file
script_dir = os.path.dirname(os.path.abspath(__file__))
env_path = os.path.join(script_dir, '.env')
if os.path.exists(env_path):
    print(f"Loading environment variables from {env_path}")
    load_dotenv(env_path)
else:
    print("No .env file found, using environment variables if available")

# Set your OpenAI API key from environment variable
openai.api_key = os.getenv("OPENAI_API_KEY")
if not openai.api_key:
    print("Error: OPENAI_API_KEY not found in environment variables or .env file")
    print("Please set the OPENAI_API_KEY environment variable or add it to the .env file")
    sys.exit(1)

# Map of folder names to full language names
LANGUAGE_MAP = {
    # ISO 639-1 language codes
    'af': 'Afrikaans',
    'ar': 'Arabic',
    'bg': 'Bulgarian',
    'bn': 'Bengali',
    'ca': 'Catalan',
    'cs': 'Czech',
    'da': 'Danish',
    'de': 'German',
    'el': 'Greek',
    'en': 'English',
    'es': 'Spanish',
    'et': 'Estonian',
    'fa': 'Persian',
    'fi': 'Finnish',
    'fr': 'French',
    'he': 'Hebrew',
    'hi': 'Hindi',
    'hr': 'Croatian',
    'hu': 'Hungarian',
    'id': 'Indonesian',
    'is': 'Icelandic',
    'it': 'Italian',
    'ja': 'Japanese',
    'ko': 'Korean',
    'lt': 'Lithuanian',
    'lv': 'Latvian',
    'ms': 'Malay',
    'nl': 'Dutch',
    'no': 'Norwegian',
    'pl': 'Polish',
    'pt': 'Portuguese',
    'ro': 'Romanian',
    'ru': 'Russian',
    'sk': 'Slovak',
    'sl': 'Slovenian',
    'sq': 'Albanian',
    'sr': 'Serbian',
    'sv': 'Swedish',
    'sw': 'Swahili',
    'ta': 'Tamil',
    'th': 'Thai',
    'tr': 'Turkish',
    'uk': 'Ukrainian',
    'ur': 'Urdu',
    'vi': 'Vietnamese',
    'zh': 'Chinese',
    'us': 'American English',
    
    # Country-specific language codes
    'pt-br': 'Brazilian Portuguese',
    'zh-cn': 'Simplified Chinese',
    'zh-tw': 'Traditional Chinese',
    'en-gb': 'British English',
    'en-us': 'American English',
    'es-mx': 'Mexican Spanish',
    
    # Special cases that might be confused
    'ch': 'Swiss German',  # Not Chinese, but Swiss domain/German dialect
    'cy': 'Welsh',  # Not Cypriot
    'gl': 'Galician',  # Not Greenlandic
    'mt': 'Maltese',  # Not Montenegrin
    'eu': 'Basque',  # Not European Union
}

def translate_text(text, target_lang):
    """
    Translate text using OpenAI's o3-mini model
    
    Args:
        text (str): The text to translate
        target_lang (str): The target language code
        
    Returns:
        str: The translated text
    """
    try:
        # Get the full language name from the map, fallback to the code if not found
        language_name = LANGUAGE_MAP.get(target_lang.lower(), target_lang)
        
        response = openai.chat.completions.create(
            model="o3-mini",
            messages=[
                {"role": "system", "content": "You are a translation assistant. Translate the text to the target language while preserving the format."},
                {"role": "user", "content": f"Translate this to {language_name}:\n\n{text}"}
            ]
        )
        return response.choices[0].message.content
    except Exception as e:
        print(f"Translation error for {target_lang}: {str(e)}")
        # Add a small delay on error to prevent overwhelming the API
        time.sleep(1)
        return text  # Return original text on error

def translate_file(file_path, content, target_lang, target_file):
    """
    Translate a single file to a target language and save it
    
    Args:
        file_path (Path): Path to the source file
        content (str): Content of the source file
        target_lang (str): Target language code
        target_file (Path): Path to save the translated file
        
    Returns:
        tuple: (target_file, success_flag)
    """
    try:
        translated_content = translate_text(content, target_lang)
        
        # Write translated content to target file
        with open(target_file, 'w', encoding='utf-8') as f:
            f.write(translated_content)
            
        return (target_file, True)
    except Exception as e:
        print(f"Error translating {file_path} to {target_lang}: {str(e)}")
        return (target_file, False)
    
def is_yaml_file(file_path):
    """Check if a file is a YAML file based on extension"""
    return file_path.suffix.lower() in ['.yaml', '.yml']

def is_markdown_file(file_path):
    """Check if a file is a Markdown file based on extension"""
    return file_path.suffix.lower() in ['.md', '.markdown']

def get_target_languages(en_dir):
    """
    Find all sibling directories of the English directory
    
    Args:
        en_dir (Path): Path to the English directory
        
    Returns:
        list: List of target language directory names
    """
    parent_dir = en_dir.parent
    target_langs = []
    
    for item in parent_dir.iterdir():
        if item.is_dir() and item.name != "en":
            target_langs.append(item.name)
            
    return target_langs

def process_files(en_dir, target_langs, max_concurrent=10):
    """
    Process all YAML and Markdown files in the English directory
    Only translate files that don't exist in the target language directories
    
    Args:
        en_dir (Path): Path to the English directory
        target_langs (list): List of target language directory names
        max_concurrent (int): Maximum number of concurrent translation requests
    """
    # Find all YAML and Markdown files in the English directory
    yaml_files = []
    md_files = []
    
    for root, _, files in os.walk(en_dir):
        for file in files:
            file_path = Path(root) / file
            if is_yaml_file(file_path):
                yaml_files.append(file_path)
            elif is_markdown_file(file_path):
                md_files.append(file_path)
    
    total_files = len(yaml_files) + len(md_files)
    print(f"Found {len(yaml_files)} YAML files and {len(md_files)} Markdown files")
    
    if total_files == 0:
        print("No YAML or Markdown files found in the English directory")
        return
    
    # Create a list of all translation tasks
    translation_tasks = []
    files_already_exist = 0
    
    for file_path in yaml_files + md_files:
        # Read the content of the file
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Get the relative path from the English directory
        rel_path = file_path.relative_to(en_dir)
        
        # For each target language, create a translation task
        for target_lang in target_langs:
            target_dir = en_dir.parent / target_lang
            target_file = target_dir / rel_path
            
            # Create the target directory if it doesn't exist
            os.makedirs(target_file.parent, exist_ok=True)
            
            # Skip if the target file already exists (regardless of content)
            if target_file.exists():
                files_already_exist += 1
                continue
            
            # Add the translation task to the list
            translation_tasks.append((file_path, content, target_lang, target_file))
    
    # Process the translation tasks in parallel
    with concurrent.futures.ThreadPoolExecutor(max_workers=max_concurrent) as executor:
        # Submit all translation tasks
        future_to_file = {
            executor.submit(translate_file, file_path, content, target_lang, target_file): (file_path, target_lang)
            for file_path, content, target_lang, target_file in translation_tasks
        }
        
        # Track progress
        files_translated = 0
        files_failed = 0
        
        # Process the results as they complete
        with tqdm(total=len(translation_tasks), desc="Translating files") as progress_bar:
            for future in concurrent.futures.as_completed(future_to_file):
                file_path, target_lang = future_to_file[future]
                try:
                    target_file, success = future.result()
                    if success:
                        files_translated += 1
                    else:
                        files_failed += 1
                except Exception as e:
                    print(f"Error processing {file_path} to {target_lang}: {str(e)}")
                    files_failed += 1
                
                progress_bar.update(1)
    
    # Print summary
    print("\nTranslation Summary:")
    print(f"Files translated: {files_translated}")
    print(f"Files failed: {files_failed}")
    print(f"Files skipped (already exist): {files_already_exist}")
    print(f"Total target files: {files_already_exist + files_translated + files_failed}")

def main():
    """Main function to parse arguments and process files"""
    parser = argparse.ArgumentParser(
        description="Translate YAML and Markdown files using OpenAI's o3-mini model with parallel processing",
        epilog="""
Examples:
  python translate_files.py
  python translate_files.py --path /path/to/en
  
Directory Structure:
  The script expects a directory structure where the 'en' directory has sibling directories
  for target languages (e.g., fr, es, de). The script will translate files from the 'en'
  directory and create translated versions in each target language directory, preserving
  the original directory structure.
  
Requirements:
  - OpenAI API key (set in .env file or as environment variable OPENAI_API_KEY)
  - Internet connection to access the OpenAI API
        """,
        formatter_class=argparse.RawDescriptionHelpFormatter
    )
    
    # Default path is ../content/en/ relative to the script location
    default_path = os.path.normpath(os.path.join(script_dir, "..", "content", "en"))
    
    parser.add_argument(
        "--path",
        help="Path to the English directory containing YAML and Markdown files (default: %(default)s)",
        default=default_path
    )
    parser.add_argument(
        "--max-concurrent",
        help="Maximum number of concurrent translation requests (default: %(default)s)",
        type=int,
        default=10
    )
    
    args = parser.parse_args()
    
    # Convert to Path object
    en_dir = Path(args.path)
    
    # Check if the directory exists
    if not en_dir.exists() or not en_dir.is_dir():
        print(f"Error: Directory not found: {en_dir}")
        sys.exit(1)
    
    # Get target languages
    target_langs = get_target_languages(en_dir)
    
    if not target_langs:
        print("No target language directories found. Please create at least one target language directory.")
        sys.exit(1)
    
    print(f"Source directory: {en_dir}")
    print(f"Target languages: {', '.join(target_langs)}")
    print(f"Maximum concurrent requests: {args.max_concurrent}")
    
    # Process files
    process_files(en_dir, target_langs, args.max_concurrent)
    
    print("Translation completed successfully!")

if __name__ == "__main__":
    main()
