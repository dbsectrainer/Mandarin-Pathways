# Mandarin Pathways Social Media Automation Guide

This guide provides detailed instructions for using the `social_media_automation.py` script to automate social media content creation and posting for the Mandarin Pathways language learning application.

## Overview

The social media automation script provides the following capabilities:

- **Content Management**: Reads social media content from a CSV file
- **Image Generation**: Creates images based on prompts (using OpenAI's DALL-E or placeholder images)
- **Multi-Platform Support**: Posts to TikTok, Instagram, Facebook, X (Twitter), and LinkedIn
- **Scheduling**: Schedules posts based on dates in the CSV
- **Tracking**: Records posting history and generates reports

## Prerequisites

Before using the script, ensure you have:

1. Python 3.7 or higher installed
2. Required Python packages (install using `pip install -r requirements.txt`)
3. API keys and credentials for the social media platforms you want to use
4. OpenAI API key if you want to generate images using DALL-E (optional)

## Setup

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. Create Environment File

Run the script with the `--setup` flag to create a template `.env` file:

```bash
python social_media_automation.py --setup
```

This will create a `.env` file with placeholders for all required API keys and credentials.

### 3. Add Your Credentials

Edit the `.env` file and add your actual API keys and credentials:

```
# OpenAI for image generation
OPENAI_API_KEY=your_openai_api_key_here

# Twitter/X
TWITTER_API_KEY=your_twitter_api_key_here
TWITTER_API_SECRET=your_twitter_api_secret_here
TWITTER_ACCESS_TOKEN=your_twitter_access_token_here
TWITTER_ACCESS_SECRET=your_twitter_access_secret_here

# Facebook
FACEBOOK_ACCESS_TOKEN=your_facebook_access_token_here

# Instagram
INSTAGRAM_USERNAME=your_instagram_username_here
INSTAGRAM_PASSWORD=your_instagram_password_here

# LinkedIn
LINKEDIN_USERNAME=your_linkedin_username_here
LINKEDIN_PASSWORD=your_linkedin_password_here
```

## Content CSV Format

The script reads content from a CSV file with the following columns:

- `Date`: The date to post (format: MM/DD/YY)
- `Platform`: The platform to post to (TikTok, Instagram, Facebook, X, LinkedIn)
- `Post Type`: The type of post (e.g., App Introduction, Flashcard Feature)
- `Post Text`: The text content of the post
- `Hashtags`: Hashtags to include with the post
- `Image Prompt`: Description for generating an image
- `Link`: URL to include with the post

Example:
```csv
Date,Platform,Post Type,Post Text,Hashtags,Image Prompt,Link
5/6/25,TikTok,App Introduction,"Discover Mandarin Pathways, a free interactive app to learn Mandarin through games, flashcards, and quizzes. Start your journey today!",#LearnMandarin #LanguageLearning #MandarinPathways,Screenshot of Mandarin Pathways app homepage on a smartphone,https://mandarinpathways.com
```

## Usage

### Basic Usage

To process all posts in the CSV file:

```bash
python social_media_automation.py
```

### Specify a Different CSV File

```bash
python social_media_automation.py --csv path/to/your/content.csv
```

### Schedule Posts for a Specific Date

```bash
python social_media_automation.py --date 5/6/25
```

### Perform a Dry Run (No Actual Posting)

```bash
python social_media_automation.py --dry-run
```

## Output

The script generates the following outputs:

1. **Generated Images**: Stored in the `generated_images` directory
2. **Post History**: Saved as `post_history.json`
3. **Logs**: Detailed logs in `social_media_automation.log`

## Platform-Specific Notes

### TikTok

TikTok doesn't have an official API, so the script uses placeholder functionality. For actual TikTok posting, you may need to implement browser automation or use unofficial APIs.

### Instagram

The script uses the `instabot` library for Instagram posting. Note that Instagram's API policies change frequently, so you may need to update the implementation.

### Facebook

Facebook posting requires a Page Access Token with appropriate permissions.

### Twitter/X

Twitter posting uses the `tweepy` library and requires API keys and access tokens from the Twitter Developer Portal.

### LinkedIn

LinkedIn posting uses the `linkedin-api` library, which is an unofficial API wrapper.

## Troubleshooting

### Common Issues

1. **Authentication Errors**: Ensure your API keys and credentials are correct in the `.env` file.
2. **Rate Limiting**: Social media platforms have rate limits. If you're posting many items, you may hit these limits.
3. **Image Generation Failures**: If OpenAI API is unavailable or fails, the script will fall back to placeholder images.

### Logs

Check the `social_media_automation.log` file for detailed error messages and debugging information.

## Extending the Script

The script is designed to be modular and extensible. To add support for additional platforms or features:

1. Create a new method in the `PlatformManager` class for your platform
2. Implement the authentication and posting logic
3. Update the `post_to_platform` method to call your new method

## License

This script is provided for use with the Mandarin Pathways project.
