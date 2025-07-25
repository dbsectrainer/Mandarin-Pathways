#!/usr/bin/env python3
"""
Example usage of the Mandarin Pathways Social Media Automation script.

This script demonstrates how to use the social_media_automation.py script
to schedule posts for a specific date and generate a report.
"""

import os
import json
from datetime import datetime, timedelta
import logging

# Import components from the main script
from social_media_automation import (
    ContentManager,
    ImageGenerator,
    PlatformManager,
    ScheduleManager,
    setup_env_file
)

# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

def schedule_posts_for_tomorrow():
    """Schedule all posts for tomorrow's date."""
    # Ensure environment file exists
    if not os.path.exists('.env'):
        logger.info("Creating environment file template...")
        setup_env_file()
        logger.info("Please edit the .env file with your API keys and credentials before continuing.")
        return

    # Calculate tomorrow's date in MM/DD/YY format
    tomorrow = datetime.now() + timedelta(days=1)
    tomorrow_str = tomorrow.strftime("%m/%d/%y")
    
    logger.info(f"Scheduling posts for {tomorrow_str}")
    
    # Initialize components
    content_manager = ContentManager('high_frequency_mandarin_pathways_social_content.csv')
    image_generator = ImageGenerator()
    platform_manager = PlatformManager()
    schedule_manager = ScheduleManager(content_manager, image_generator, platform_manager)
    
    # Schedule posts for tomorrow
    schedule_manager.schedule_posts_for_date(tomorrow_str)
    
    # Save post history
    schedule_manager.save_post_history(f"post_history_{tomorrow_str.replace('/', '-')}.json")
    
    # Print summary
    post_history = schedule_manager.get_post_history()
    successful_posts = sum(1 for post in post_history if post['success'])
    failed_posts = len(post_history) - successful_posts
    
    logger.info(f"Scheduled {len(post_history)} posts for {tomorrow_str}")
    logger.info(f"Successful: {successful_posts}, Failed: {failed_posts}")
    
    return post_history

def generate_weekly_report():
    """Generate a report of posts scheduled for the next 7 days."""
    # Initialize content manager
    content_manager = ContentManager('high_frequency_mandarin_pathways_social_content.csv')
    
    # Calculate date range for the next 7 days
    today = datetime.now()
    dates = [(today + timedelta(days=i)).strftime("%m/%d/%y") for i in range(7)]
    
    # Get posts for each date
    weekly_posts = []
    for date in dates:
        posts = content_manager.get_content_for_date(date)
        weekly_posts.extend(posts)
    
    # Count posts by platform
    platform_counts = {}
    for post in weekly_posts:
        platform = post['Platform']
        platform_counts[platform] = platform_counts.get(platform, 0) + 1
    
    # Count posts by type
    type_counts = {}
    for post in weekly_posts:
        post_type = post['Post Type']
        type_counts[post_type] = type_counts.get(post_type, 0) + 1
    
    # Generate report
    report = {
        'date_range': f"{dates[0]} to {dates[-1]}",
        'total_posts': len(weekly_posts),
        'posts_by_platform': platform_counts,
        'posts_by_type': type_counts,
        'posts_by_date': {date: len(content_manager.get_content_for_date(date)) for date in dates}
    }
    
    # Save report to file
    report_file = f"weekly_report_{today.strftime('%Y-%m-%d')}.json"
    with open(report_file, 'w') as f:
        json.dump(report, f, indent=2)
    
    logger.info(f"Weekly report generated and saved to {report_file}")
    logger.info(f"Total posts for the next 7 days: {len(weekly_posts)}")
    for platform, count in platform_counts.items():
        logger.info(f"  {platform}: {count} posts")
    
    return report

def main():
    """Main function demonstrating different usage examples."""
    print("\nMandarin Pathways Social Media Automation - Example Usage\n")
    print("1. Schedule posts for tomorrow")
    print("2. Generate weekly report")
    print("3. Exit")
    
    choice = input("\nEnter your choice (1-3): ")
    
    if choice == '1':
        schedule_posts_for_tomorrow()
    elif choice == '2':
        generate_weekly_report()
    else:
        print("Exiting...")

if __name__ == "__main__":
    main()
