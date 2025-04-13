from googleapiclient.discovery import build
import json
import os
import time

YOUTUBE_API_KEY = os.getenv('YOUTUBE_API_KEY')

def init_youtube():
    """Initialize YouTube API client"""
    return build('youtube', 'v3', developerKey=YOUTUBE_API_KEY)

def get_topic(identifier, content_type="day"):
    """Get search topics based on content type and identifier"""
    if content_type == "day":
        topics = {
            # Foundations (Days 1-7)
            1: "pinyin system pronunciation practice",
            2: "numbers counting practice",
            3: "time expressions practice",
            4: "basic verbs actions practice",
            5: "basic adjectives practice",
            6: "question words practice",
            7: "basic characters radicals practice",

            # Essential Daily Phrases (Days 8-14)
            8: "shopping transportation practice",
            9: "dining restaurant practice",
            10: "directions navigation practice",
            11: "basic grammar patterns practice",
            12: "travel survival phrases practice",
            13: "public transport practice",
            14: "daily communication practice",

            # Cultural Context & Daily Life (Days 15-22)
            15: "family relationships practice",
            16: "social interactions practice",
            17: "chinese etiquette practice",
            18: "festivals traditions practice",
            19: "home life practice",
            20: "public places practice",
            21: "cultural customs practice",
            22: "social norms practice",

            # Professional Communication (Days 23-30)
            23: "workplace vocabulary practice",
            24: "business etiquette practice",
            25: "online meetings practice",
            26: "remote work practice",
            27: "email writing practice",
            28: "presentations practice",
            29: "technical terms practice",
            30: "professional conduct practice",

            # Advanced Fluency (Days 31-40)
            31: "chinese idioms practice",
            32: "formal expressions practice",
            33: "casual slang practice",
            34: "debate discussion practice",
            35: "storytelling practice",
            36: "persuasive speech practice",
            37: "advanced dialogue practice",
            38: "role play scenarios practice",
            39: "complex conversations practice",
            40: "fluent communication practice"
        }
        return topics.get(identifier, "language practice conversation")
    else:  # supplementary content
        topics = {
            'education': "academic chinese learning practice",
            'hobbies': "chinese hobbies interests practice",
            'emotions': "expressing emotions chinese practice",
            'daily_life': "daily life chinese practice",
            'comparisons': "making comparisons chinese practice"
        }
        return topics.get(identifier, "supplementary chinese practice")

def search_youtube_video(youtube, query, max_results=3):
    """Search for a Mandarin video matching criteria"""
    try:
        # Add Mandarin-specific terms to query
        full_query = f"中文母语者 {query}"
        
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
        duration_request = youtube.videos().list(
            part='contentDetails,statistics',
            id=','.join(video_ids)
        )
        duration_response = duration_request.execute()
        
        # Find best video (between 3-10 minutes, most views)
        best_video = None
        max_views = 0
        
        for video in duration_response['items']:
            duration = parse_duration(video['contentDetails']['duration'])
            views = int(video['statistics']['viewCount'])
            
            # Videos between 3-10 minutes
            if 180 <= duration <= 600 and views > max_views:
                best_video = video['id']
                max_views = views
        
        return best_video or video_ids[0]  # Fallback to first result if no ideal video found
        
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
