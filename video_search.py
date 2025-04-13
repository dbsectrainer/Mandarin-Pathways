from googleapiclient.discovery import build
import json
import os
import time
import re

YOUTUBE_API_KEY = os.getenv('YOUTUBE_API_KEY')

def init_youtube():
    """Initialize YouTube API client"""
    return build('youtube', 'v3', developerKey=YOUTUBE_API_KEY)

def get_topic(identifier, content_type="day"):
    """Get search topics based on content type and identifier"""
    if content_type == "day":
        topics = {
            # Foundations (Days 1-7)
            1: "mandarin pinyin pronunciation lesson tutorial",
            2: "mandarin numbers counting lesson tutorial",
            3: "mandarin time expressions lesson tutorial",
            4: "mandarin basic verbs actions lesson tutorial",
            5: "mandarin basic adjectives lesson tutorial",
            6: "mandarin question words lesson tutorial",
            7: "mandarin basic characters radicals lesson tutorial",

            # Essential Daily Phrases (Days 8-14)
            8: "mandarin shopping transportation phrases lesson tutorial",
            9: "mandarin dining restaurant phrases lesson tutorial",
            10: "mandarin directions navigation phrases lesson tutorial",
            11: "mandarin basic grammar patterns lesson tutorial",
            12: "mandarin travel survival phrases lesson tutorial",
            13: "mandarin public transport phrases lesson tutorial",
            14: "mandarin daily communication phrases lesson tutorial",

            # Cultural Context & Daily Life (Days 15-22)
            15: "mandarin family relationships vocabulary lesson tutorial",
            16: "mandarin social interactions phrases lesson tutorial",
            17: "chinese etiquette culture lesson tutorial",
            18: "chinese festivals traditions lesson tutorial",
            19: "mandarin home life vocabulary lesson tutorial",
            20: "mandarin public places vocabulary lesson tutorial",
            21: "chinese cultural customs lesson tutorial",
            22: "chinese social norms lesson tutorial",

            # Professional Communication (Days 23-30)
            23: "mandarin workplace vocabulary lesson tutorial",
            24: "chinese business etiquette lesson tutorial",
            25: "mandarin online meetings phrases lesson tutorial",
            26: "mandarin remote work vocabulary lesson tutorial",
            27: "mandarin email writing phrases lesson tutorial",
            28: "mandarin presentations phrases lesson tutorial",
            29: "mandarin technical terms vocabulary lesson tutorial",
            30: "chinese professional conduct lesson tutorial",

            # Advanced Fluency (Days 31-40)
            31: "chinese idioms expressions lesson tutorial",
            32: "mandarin formal expressions lesson tutorial",
            33: "mandarin casual slang lesson tutorial",
            34: "mandarin debate discussion phrases lesson tutorial",
            35: "mandarin storytelling phrases lesson tutorial",
            36: "mandarin persuasive speech lesson tutorial",
            37: "mandarin advanced dialogue lesson tutorial",
            38: "mandarin role play scenarios lesson tutorial",
            39: "mandarin complex conversations lesson tutorial",
            40: "mandarin fluent communication lesson tutorial"
        }
        return topics.get(identifier, "mandarin chinese lesson tutorial")
    else:  # supplementary content
        topics = {
            'education': "mandarin academic vocabulary lesson tutorial",
            'hobbies': "mandarin hobbies interests vocabulary lesson tutorial",
            'emotions': "mandarin expressing emotions vocabulary lesson tutorial",
            'daily_life': "mandarin daily life vocabulary lesson tutorial",
            'comparisons': "mandarin making comparisons grammar lesson tutorial"
        }
        return topics.get(identifier, "mandarin supplementary lesson tutorial")

# List of preferred Mandarin learning channels
PREFERRED_CHANNELS = [
    "Yoyo Chinese",
    "ChineseFor.Us",
    "Everyday Chinese",
    "Mandarin Corner",
    "Talk Taiwanese Mandarin with Abby",
    "Li Ziqi",
    "Xiaomanyc",
    "小马在纽约",  # Xiaomanyc's Chinese channel name
    "Chinese with Jessie",
    "Mandarin Blueprint",
    "Chinese Zero to Hero",
    "Peggy Lee Chinese"
]

def search_youtube_video(youtube, query, max_results=10):
    """Search for a Mandarin video matching criteria"""
    try:
        # Add educational terms to query
        full_query = f"learn {query} 学习中文"
        
        print(f"Searching for: {full_query}")
        
        request = youtube.search().list(
            q=full_query,
            part='snippet',
            type='video',
            videoDefinition='high',
            videoEmbeddable='true',
            relevanceLanguage='zh',
            maxResults=max_results
        )
        response = request.execute()
        
        # Get video durations to filter
        video_ids = [item['id']['videoId'] for item in response['items']]
        if not video_ids:
            print("No videos found in search results")
            return None
            
        duration_request = youtube.videos().list(
            part='contentDetails,statistics,snippet',
            id=','.join(video_ids)
        )
        duration_response = duration_request.execute()
        
        # First, check for videos from preferred channels
        preferred_videos = []
        other_videos = []
        
        for i, video in enumerate(duration_response['items']):
            duration = parse_duration(video['contentDetails']['duration'])
            views = int(video['statistics']['viewCount'])
            channel_title = video['snippet']['channelTitle']
            
            # Check if video is from a preferred channel
            is_preferred = any(re.search(channel, channel_title, re.IGNORECASE) for channel in PREFERRED_CHANNELS)
            
            # Videos between 3-10 minutes
            if 180 <= duration <= 600:
                if is_preferred:
                    preferred_videos.append((video['id'], views, channel_title))
                else:
                    other_videos.append((video['id'], views, channel_title))
        
        # Sort preferred videos by views (descending)
        preferred_videos.sort(key=lambda x: x[1], reverse=True)
        other_videos.sort(key=lambda x: x[1], reverse=True)
        
        # Print information about found videos
        if preferred_videos:
            print(f"Found {len(preferred_videos)} videos from preferred channels:")
            for i, (video_id, views, channel) in enumerate(preferred_videos[:3], 1):
                print(f"  {i}. {channel} - {views} views - https://youtube.com/watch?v={video_id}")
            
            # Return the preferred video with the most views
            return preferred_videos[0][0]
        elif other_videos:
            print(f"No videos from preferred channels found. Using other videos:")
            for i, (video_id, views, channel) in enumerate(other_videos[:3], 1):
                print(f"  {i}. {channel} - {views} views - https://youtube.com/watch?v={video_id}")
            
            # Return the video with the most views
            return other_videos[0][0]
        else:
            print("No suitable videos found (3-10 minutes duration)")
            # If no videos match our criteria, return the first video from the search results
            return video_ids[0] if video_ids else None
        
    except Exception as e:
        print(f"Error searching YouTube: {e}")
        return None

def parse_duration(duration):
    """Convert YouTube duration format to seconds"""
    import re
    match = re.match(r'PT(\d+H)?(\d+M)?(\d+S)?', duration)
    if not match:
        return 0
    
    hours = int(match.group(1)[:-1]) if match.group(1) else 0
    minutes = int(match.group(2)[:-1]) if match.group(2) else 0
    seconds = int(match.group(3)[:-1]) if match.group(3) else 0
    
    return hours * 3600 + minutes * 60 + seconds

def update_videos_json(videos):
    """Update videos.json with new video IDs"""
    try:
        with open('videos.json', 'w') as f:
            json.dump(videos, f, indent=2)
        print("Successfully updated videos.json")
        return True
    except Exception as e:
        print(f"Error updating videos.json: {e}")
        return False

def update_supplementary_videos_json(videos):
    """Update videos_supplementary.json with new video IDs"""
    try:
        with open('videos_supplementary.json', 'w') as f:
            json.dump(videos, f, indent=2)
        print("Successfully updated videos_supplementary.json")
        return True
    except Exception as e:
        print(f"Error updating videos_supplementary.json: {e}")
        return False

def main():
    if not YOUTUBE_API_KEY:
        print("Error: YOUTUBE_API_KEY environment variable not set")
        return
    
    youtube = init_youtube()
    
    # Process daily content
    try:
        videos = {}
        if os.path.exists('videos.json'):
            with open('videos.json', 'r') as f:
                videos = json.load(f)
        
        for day in range(1, 41):  # Process 40 days as per README
            print(f"\nProcessing Day {day}...")
            topic = get_topic(day, "day")
            
            # Skip if we already have this video with a non-empty ID
            if f"day{day}" in videos and videos[f"day{day}"]:
                print(f"Already have video for day {day}")
                continue
            elif f"day{day}" in videos and not videos[f"day{day}"]:
                print(f"Empty video ID for day {day}, searching for a new one...")
                
            print(f"Searching for Mandarin videos...")
            video_id = search_youtube_video(youtube, topic)
            if video_id:
                videos[f'day{day}'] = video_id
                print(f"Found video: https://youtube.com/watch?v={video_id}")
                # Save progress
                update_videos_json(videos)
            else:
                print("No suitable video found")
            
            # Respect YouTube API quotas
            time.sleep(1)
    except Exception as e:
        print(f"Error processing daily content: {e}")
    
    # Process supplementary content
    try:
        supp_videos = {}
        if os.path.exists('videos_supplementary.json'):
            with open('videos_supplementary.json', 'r') as f:
                supp_videos = json.load(f)
        
        categories = ['education', 'hobbies', 'emotions', 'daily_life', 'comparisons']
        for category in categories:
            print(f"\nProcessing category: {category}")
            topic = get_topic(category, "supplementary")
            
            # Skip if we already have this video with a non-empty ID
            if category in supp_videos and supp_videos[category]:
                print(f"Already have video for category {category}")
                continue
            elif category in supp_videos and not supp_videos[category]:
                print(f"Empty video ID for category {category}, searching for a new one...")
                
            print(f"Searching for Mandarin videos...")
            video_id = search_youtube_video(youtube, topic)
            if video_id:
                supp_videos[category] = video_id
                print(f"Found video: https://youtube.com/watch?v={video_id}")
                # Save progress
                update_supplementary_videos_json(supp_videos)
            else:
                print("No suitable video found")
            
            # Respect YouTube API quotas
            time.sleep(1)
    except Exception as e:
        print(f"Error processing supplementary content: {e}")

if __name__ == "__main__":
    main()
