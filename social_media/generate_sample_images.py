#!/usr/bin/env python3
"""
Generate sample images for Mandarin Pathways social media posts.

This script demonstrates how to use the OpenAI API to generate images
based on prompts from the social media content CSV file.
"""

import os
import csv
import argparse
import logging
from pathlib import Path
from dotenv import load_dotenv

# Import the ImageGenerator class from the main script
from social_media_automation import ImageGenerator

# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

# Load environment variables from .env file
load_dotenv()

def read_csv_file(csv_file):
    """Read content from a CSV file."""
    posts = []
    try:
        with open(csv_file, 'r') as f:
            reader = csv.DictReader(f)
            for row in reader:
                posts.append(row)
        logger.info(f"Successfully loaded {len(posts)} posts from {csv_file}")
        return posts
    except Exception as e:
        logger.error(f"Error reading CSV file: {e}")
        return []

def generate_sample_images(csv_file, num_samples=3, output_dir="sample_images"):
    """Generate sample images for a few posts from the CSV file."""
    # Create the output directory if it doesn't exist
    Path(output_dir).mkdir(parents=True, exist_ok=True)
    
    # Read the CSV file
    posts = read_csv_file(csv_file)
    if not posts:
        logger.error("No posts found in the CSV file")
        return
    
    # Limit the number of samples
    samples = posts[:min(num_samples, len(posts))]
    
    # Initialize the image generator
    image_generator = ImageGenerator(output_dir)
    
    # Check if OpenAI API key is available
    if not image_generator.openai_available:
        logger.warning("OpenAI API key not found. Will generate placeholder images.")
        logger.info("To use OpenAI for image generation, set the OPENAI_API_KEY environment variable.")
    
    # Generate images for each sample
    generated_images = []
    for i, post in enumerate(samples):
        logger.info(f"Generating image {i+1}/{len(samples)} for {post['Platform']} post: {post['Post Type']}")
        
        # Extract the image prompt
        prompt = post.get('Image Prompt', '')
        if not prompt:
            logger.warning(f"No image prompt found for post {i+1}. Skipping.")
            continue
        
        # Generate the image
        date_str = post['Date'].replace('/', '-')
        platform = post['Platform']
        post_type = post['Post Type'].replace(' ', '_')
        filename = f"{date_str}_{platform}_{post_type}.png"
        
        image_path = image_generator.generate_image(prompt, platform, post_type, post['Date'])
        if image_path:
            generated_images.append({
                'post': post,
                'image_path': image_path
            })
            logger.info(f"Generated image saved to {image_path}")
        else:
            logger.error(f"Failed to generate image for post {i+1}")
    
    # Print summary
    logger.info(f"Generated {len(generated_images)} sample images")
    for i, item in enumerate(generated_images):
        logger.info(f"{i+1}. {item['post']['Platform']} - {item['post']['Post Type']}: {item['image_path']}")
    
    return generated_images

def main():
    """Main function to run the script."""
    parser = argparse.ArgumentParser(description='Generate sample images for Mandarin Pathways social media posts')
    parser.add_argument('--csv', type=str, default='high_frequency_mandarin_pathways_social_content.csv',
                        help='Path to the CSV file containing social media content')
    parser.add_argument('--samples', type=int, default=3,
                        help='Number of sample images to generate (default: 3)')
    parser.add_argument('--output-dir', type=str, default='sample_images',
                        help='Directory to save the generated images (default: sample_images)')
    
    args = parser.parse_args()
    
    # Check if the CSV file exists
    if not os.path.exists(args.csv):
        logger.error(f"CSV file not found: {args.csv}")
        return
    
    # Generate sample images
    generate_sample_images(args.csv, args.samples, args.output_dir)

if __name__ == "__main__":
    main()
