#!/usr/bin/env python3
"""
Test script for the Mandarin Pathways Social Media Automation script.

This script performs basic tests on the main components of the social_media_automation.py
script to ensure that everything is working correctly.
"""

import os
import sys
import unittest
from pathlib import Path
from unittest.mock import patch, MagicMock

# Add the current directory to the path so we can import the main script
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Import components from the main script
from social_media_automation import (
    ContentManager,
    ImageGenerator,
    PlatformManager,
    ScheduleManager
)

class TestContentManager(unittest.TestCase):
    """Tests for the ContentManager class."""
    
    def setUp(self):
        """Set up test fixtures."""
        # Create a test CSV file
        self.test_csv = 'test_content.csv'
        with open(self.test_csv, 'w') as f:
            f.write("""Date,Platform,Post Type,Post Text,Hashtags,Image Prompt,Link
5/6/25,TikTok,Test Post,This is a test post,#Test,Test image,https://example.com
5/7/25,Instagram,Test Post,Another test post,#Test,Test image,https://example.com
5/7/25,Facebook,Test Post,A third test post,#Test,Test image,https://example.com
""")
    
    def tearDown(self):
        """Tear down test fixtures."""
        # Remove the test CSV file
        if os.path.exists(self.test_csv):
            os.remove(self.test_csv)
    
    def test_load_content(self):
        """Test loading content from a CSV file."""
        content_manager = ContentManager(self.test_csv)
        self.assertIsNotNone(content_manager.content_df)
        self.assertEqual(len(content_manager.content_df), 3)
    
    def test_get_content_for_date(self):
        """Test getting content for a specific date."""
        content_manager = ContentManager(self.test_csv)
        date_content = content_manager.get_content_for_date('5/6/25')
        self.assertEqual(len(date_content), 1)
        self.assertEqual(date_content[0]['Platform'], 'TikTok')
    
    def test_get_content_for_platform(self):
        """Test getting content for a specific platform."""
        content_manager = ContentManager(self.test_csv)
        platform_content = content_manager.get_content_for_platform('Instagram')
        self.assertEqual(len(platform_content), 1)
        self.assertEqual(platform_content[0]['Date'], '5/7/25')
    
    def test_get_all_content(self):
        """Test getting all content."""
        content_manager = ContentManager(self.test_csv)
        all_content = content_manager.get_all_content()
        self.assertEqual(len(all_content), 3)


class TestImageGenerator(unittest.TestCase):
    """Tests for the ImageGenerator class."""
    
    def setUp(self):
        """Set up test fixtures."""
        # Create a test output directory
        self.test_output_dir = 'test_images'
        if not os.path.exists(self.test_output_dir):
            os.makedirs(self.test_output_dir)
    
    def tearDown(self):
        """Tear down test fixtures."""
        # Remove the test output directory and its contents
        for file in os.listdir(self.test_output_dir):
            os.remove(os.path.join(self.test_output_dir, file))
        os.rmdir(self.test_output_dir)
    
    def test_generate_placeholder_image(self):
        """Test generating a placeholder image."""
        image_generator = ImageGenerator(self.test_output_dir)
        prompt = "Test image prompt"
        filename = "test_image.png"
        image_path = image_generator.generate_placeholder_image(prompt, filename)
        
        self.assertIsNotNone(image_path)
        self.assertTrue(os.path.exists(image_path))
    
    @patch('social_media_automation.ImageGenerator.generate_image_with_openai')
    def test_generate_image(self, mock_generate):
        """Test generating an image."""
        # Mock the OpenAI image generation
        mock_generate.return_value = os.path.join(self.test_output_dir, "test_image.png")
        
        image_generator = ImageGenerator(self.test_output_dir)
        # Set openai_available to True for testing
        image_generator.openai_available = True
        
        prompt = "Test image prompt"
        platform = "TikTok"
        post_type = "Test Post"
        date = "5/6/25"
        
        image_path = image_generator.generate_image(prompt, platform, post_type, date)
        
        self.assertIsNotNone(image_path)
        mock_generate.assert_called_once()


class TestPlatformManager(unittest.TestCase):
    """Tests for the PlatformManager class."""
    
    @patch('social_media_automation.PlatformManager._init_tiktok')
    @patch('social_media_automation.PlatformManager._init_instagram')
    @patch('social_media_automation.PlatformManager._init_facebook')
    @patch('social_media_automation.PlatformManager._init_twitter')
    @patch('social_media_automation.PlatformManager._init_linkedin')
    def test_init(self, mock_linkedin, mock_twitter, mock_facebook, mock_instagram, mock_tiktok):
        """Test initializing the PlatformManager."""
        # Mock the platform initialization methods
        mock_tiktok.return_value = None
        mock_instagram.return_value = "PLACEHOLDER"
        mock_facebook.return_value = "PLACEHOLDER"
        mock_twitter.return_value = "PLACEHOLDER"
        mock_linkedin.return_value = "PLACEHOLDER"
        
        platform_manager = PlatformManager()
        
        # Check that the platforms were initialized
        self.assertEqual(platform_manager.platforms['TikTok'], None)
        self.assertEqual(platform_manager.platforms['Instagram'], "PLACEHOLDER")
        self.assertEqual(platform_manager.platforms['Facebook'], "PLACEHOLDER")
        self.assertEqual(platform_manager.platforms['X'], "PLACEHOLDER")
        self.assertEqual(platform_manager.platforms['LinkedIn'], "PLACEHOLDER")
        
        # Check the available platforms
        self.assertFalse(platform_manager.available_platforms['TikTok'])
        self.assertTrue(platform_manager.available_platforms['Instagram'])
        self.assertTrue(platform_manager.available_platforms['Facebook'])
        self.assertTrue(platform_manager.available_platforms['X'])
        self.assertTrue(platform_manager.available_platforms['LinkedIn'])
    
    @patch('social_media_automation.PlatformManager._post_to_instagram')
    def test_post_to_platform(self, mock_post):
        """Test posting to a platform."""
        # Mock the platform-specific posting method
        mock_post.return_value = True
        
        # Create a PlatformManager with mocked platforms
        platform_manager = PlatformManager()
        platform_manager.platforms = {
            'TikTok': None,
            'Instagram': "PLACEHOLDER",
            'Facebook': "PLACEHOLDER",
            'X': "PLACEHOLDER",
            'LinkedIn': "PLACEHOLDER"
        }
        platform_manager.available_platforms = {
            'TikTok': False,
            'Instagram': True,
            'Facebook': True,
            'X': True,
            'LinkedIn': True
        }
        
        # Test posting to Instagram
        content = {
            'Platform': 'Instagram',
            'Post Text': 'Test post',
            'Hashtags': '#Test',
            'Link': 'https://example.com'
        }
        image_path = 'test_image.png'
        
        result = platform_manager.post_to_platform('Instagram', content, image_path)
        
        self.assertTrue(result)
        mock_post.assert_called_once_with(content, image_path)
        
        # Test posting to an unavailable platform
        result = platform_manager.post_to_platform('TikTok', content, image_path)
        self.assertFalse(result)


class TestScheduleManager(unittest.TestCase):
    """Tests for the ScheduleManager class."""
    
    def setUp(self):
        """Set up test fixtures."""
        # Create a test CSV file
        self.test_csv = 'test_content.csv'
        with open(self.test_csv, 'w') as f:
            f.write("""Date,Platform,Post Type,Post Text,Hashtags,Image Prompt,Link
5/6/25,TikTok,Test Post,This is a test post,#Test,Test image,https://example.com
5/7/25,Instagram,Test Post,Another test post,#Test,Test image,https://example.com
5/7/25,Facebook,Test Post,A third test post,#Test,Test image,https://example.com
""")
        
        # Create a test output directory for images
        self.test_output_dir = 'test_images'
        if not os.path.exists(self.test_output_dir):
            os.makedirs(self.test_output_dir)
    
    def tearDown(self):
        """Tear down test fixtures."""
        # Remove the test CSV file
        if os.path.exists(self.test_csv):
            os.remove(self.test_csv)
        
        # Remove the test output directory and its contents
        if os.path.exists(self.test_output_dir):
            for file in os.listdir(self.test_output_dir):
                os.remove(os.path.join(self.test_output_dir, file))
            os.rmdir(self.test_output_dir)
        
        # Remove the post history file if it exists
        if os.path.exists('post_history.json'):
            os.remove('post_history.json')
    
    @patch('social_media_automation.PlatformManager.post_to_platform')
    @patch('social_media_automation.ImageGenerator.generate_image')
    def test_schedule_posts_for_date(self, mock_generate_image, mock_post):
        """Test scheduling posts for a specific date."""
        # Mock the image generation and posting methods
        mock_generate_image.return_value = 'test_image.png'
        mock_post.return_value = True
        
        # Create the components
        content_manager = ContentManager(self.test_csv)
        image_generator = ImageGenerator(self.test_output_dir)
        platform_manager = PlatformManager()
        
        # Mock the platform manager's available platforms
        platform_manager.available_platforms = {
            'TikTok': True,
            'Instagram': True,
            'Facebook': True,
            'X': True,
            'LinkedIn': True
        }
        
        # Create the schedule manager
        schedule_manager = ScheduleManager(content_manager, image_generator, platform_manager)
        
        # Schedule posts for a specific date
        schedule_manager.schedule_posts_for_date('5/6/25')
        
        # Check that the post history was updated
        self.assertEqual(len(schedule_manager.post_history), 1)
        self.assertEqual(schedule_manager.post_history[0]['platform'], 'TikTok')
        self.assertEqual(schedule_manager.post_history[0]['success'], True)
        
        # Check that the image generation and posting methods were called
        mock_generate_image.assert_called_once()
        mock_post.assert_called_once()
    
    def test_save_post_history(self):
        """Test saving post history to a file."""
        # Create the components
        content_manager = ContentManager(self.test_csv)
        image_generator = ImageGenerator(self.test_output_dir)
        platform_manager = PlatformManager()
        
        # Create the schedule manager
        schedule_manager = ScheduleManager(content_manager, image_generator, platform_manager)
        
        # Add some post history
        schedule_manager.post_history = [
            {
                'date': '5/6/25',
                'platform': 'TikTok',
                'post_type': 'Test Post',
                'success': True,
                'timestamp': '2025-05-06T12:00:00'
            }
        ]
        
        # Save the post history
        result = schedule_manager.save_post_history()
        
        # Check that the file was created and the result is True
        self.assertTrue(result)
        self.assertTrue(os.path.exists('post_history.json'))


def run_tests():
    """Run the tests."""
    loader = unittest.TestLoader()
    suite = unittest.TestSuite()
    
    # Add the test cases
    suite.addTests(loader.loadTestsFromTestCase(TestContentManager))
    suite.addTests(loader.loadTestsFromTestCase(TestImageGenerator))
    suite.addTests(loader.loadTestsFromTestCase(TestPlatformManager))
    suite.addTests(loader.loadTestsFromTestCase(TestScheduleManager))
    
    # Run the tests
    runner = unittest.TextTestRunner(verbosity=2)
    result = runner.run(suite)
    
    return result.wasSuccessful()


if __name__ == "__main__":
    print("\nRunning tests for Mandarin Pathways Social Media Automation...\n")
    success = run_tests()
    
    if success:
        print("\nAll tests passed! The social media automation script is working correctly.")
    else:
        print("\nSome tests failed. Please check the output above for details.")
    
    sys.exit(0 if success else 1)
