import argparse
import os
import time
import asyncio
import edge_tts

# Define phrases by day and category

# Day 1: Basic Greetings & Common Phrases
day1_phrases = {
    "Basic Greetings & Common Phrases": [
        {
            "zh": "你好",
            "pinyin": "Nǐ hǎo",
            "en": "Hello"
        },
        {
            "zh": "早上好",
            "pinyin": "Zǎoshang hǎo",
            "en": "Good morning"
        },
        {
            "zh": "下午好",
            "pinyin": "Xiàwǔ hǎo",
            "en": "Good afternoon"
        },
        {
            "zh": "晚上好",
            "pinyin": "Wǎnshang hǎo",
            "en": "Good evening"
        },
        {
            "zh": "再见",
            "pinyin": "Zàijiàn",
            "en": "Goodbye"
        }
    ],
    "Self Introduction": [
        {
            "zh": "我叫...",
            "pinyin": "Wǒ jiào...",
            "en": "My name is..."
        },
        {
            "zh": "很高兴认识你",
            "pinyin": "Hěn gāoxìng rènshi nǐ",
            "en": "Nice to meet you"
        },
        {
            "zh": "我是美国人",
            "pinyin": "Wǒ shì měiguó rén",
            "en": "I am American"
        },
        {
            "zh": "你呢？",
            "pinyin": "Nǐ ne?",
            "en": "And you?"
        }
    ],
    "Basic Questions": [
        {
            "zh": "你好吗？",
            "pinyin": "Nǐ hǎo ma?",
            "en": "How are you?"
        },
        {
            "zh": "你是哪国人？",
            "pinyin": "Nǐ shì nǎ guó rén?",
            "en": "What is your nationality?"
        },
        {
            "zh": "你会说英语吗？",
            "pinyin": "Nǐ huì shuō yīngyǔ ma?",
            "en": "Do you speak English?"
        },
        {
            "zh": "你懂中文吗？",
            "pinyin": "Nǐ dǒng zhōngwén ma?",
            "en": "Do you understand Chinese?"
        }
    ]
}

# Day 2: Numbers and Counting
day2_phrases = {
    "Numbers 0-10": [
        {
            "zh": "零",
            "pinyin": "líng",
            "en": "zero"
        },
        {
            "zh": "一",
            "pinyin": "yī",
            "en": "one"
        },
        {
            "zh": "二",
            "pinyin": "èr",
            "en": "two"
        },
        {
            "zh": "三",
            "pinyin": "sān",
            "en": "three"
        },
        {
            "zh": "四",
            "pinyin": "sì",
            "en": "four"
        },
        {
            "zh": "五",
            "pinyin": "wǔ",
            "en": "five"
        },
        {
            "zh": "六",
            "pinyin": "liù",
            "en": "six"
        },
        {
            "zh": "七",
            "pinyin": "qī",
            "en": "seven"
        },
        {
            "zh": "八",
            "pinyin": "bā",
            "en": "eight"
        },
        {
            "zh": "九",
            "pinyin": "jiǔ",
            "en": "nine"
        },
        {
            "zh": "十",
            "pinyin": "shí",
            "en": "ten"
        }
    ],
    "Basic Counting Phrases": [
        {
            "zh": "多少？",
            "pinyin": "duōshao?",
            "en": "How many/much?"
        },
        {
            "zh": "一共",
            "pinyin": "yīgòng",
            "en": "in total"
        },
        {
            "zh": "第一",
            "pinyin": "dì-yī",
            "en": "first"
        },
        {
            "zh": "第二",
            "pinyin": "dì-èr",
            "en": "second"
        }
    ]
}

# Day 3: Time Expressions
day3_phrases = {
    "Time Words": [
        {
            "zh": "现在",
            "pinyin": "xiànzài",
            "en": "now"
        },
        {
            "zh": "今天",
            "pinyin": "jīntiān",
            "en": "today"
        },
        {
            "zh": "明天",
            "pinyin": "míngtiān",
            "en": "tomorrow"
        },
        {
            "zh": "昨天",
            "pinyin": "zuótiān",
            "en": "yesterday"
        },
        {
            "zh": "上午",
            "pinyin": "shàngwǔ",
            "en": "morning"
        },
        {
            "zh": "下午",
            "pinyin": "xiàwǔ",
            "en": "afternoon"
        },
        {
            "zh": "晚上",
            "pinyin": "wǎnshang",
            "en": "evening"
        }
    ],
    "Asking Time": [
        {
            "zh": "几点了？",
            "pinyin": "jǐ diǎn le?",
            "en": "What time is it?"
        },
        {
            "zh": "现在是三点",
            "pinyin": "xiànzài shì sān diǎn",
            "en": "It's 3 o'clock now"
        },
        {
            "zh": "什么时候？",
            "pinyin": "shénme shíhou?",
            "en": "When?"
        },
        {
            "zh": "星期几？",
            "pinyin": "xīngqī jǐ?",
            "en": "What day of the week?"
        }
    ]
}

# Day 4: Basic Verbs and Actions
day4_phrases = {
    "Common Verbs": [
        {
            "zh": "是",
            "pinyin": "shì",
            "en": "to be"
        },
        {
            "zh": "有",
            "pinyin": "yǒu",
            "en": "to have"
        },
        {
            "zh": "想",
            "pinyin": "xiǎng",
            "en": "to want/to think"
        },
        {
            "zh": "去",
            "pinyin": "qù",
            "en": "to go"
        },
        {
            "zh": "来",
            "pinyin": "lái",
            "en": "to come"
        },
        {
            "zh": "吃",
            "pinyin": "chī",
            "en": "to eat"
        },
        {
            "zh": "喝",
            "pinyin": "hē",
            "en": "to drink"
        },
        {
            "zh": "说",
            "pinyin": "shuō",
            "en": "to speak/to say"
        }
    ],
    "Simple Sentences": [
        {
            "zh": "我想去那里",
            "pinyin": "wǒ xiǎng qù nàlǐ",
            "en": "I want to go there"
        },
        {
            "zh": "你有时间吗？",
            "pinyin": "nǐ yǒu shíjiān ma?",
            "en": "Do you have time?"
        },
        {
            "zh": "我们去吃饭吧",
            "pinyin": "wǒmen qù chīfàn ba",
            "en": "Let's go eat"
        },
        {
            "zh": "我不知道",
            "pinyin": "wǒ bù zhīdào",
            "en": "I don't know"
        }
    ]
}

# Day 5: Basic Adjectives
day5_phrases = {
    "Common Adjectives": [
        {
            "zh": "好",
            "pinyin": "hǎo",
            "en": "good"
        },
        {
            "zh": "坏",
            "pinyin": "huài",
            "en": "bad"
        },
        {
            "zh": "大",
            "pinyin": "dà",
            "en": "big"
        },
        {
            "zh": "小",
            "pinyin": "xiǎo",
            "en": "small"
        },
        {
            "zh": "多",
            "pinyin": "duō",
            "en": "many/much"
        },
        {
            "zh": "少",
            "pinyin": "shǎo",
            "en": "few/little"
        },
        {
            "zh": "热",
            "pinyin": "rè",
            "en": "hot"
        },
        {
            "zh": "冷",
            "pinyin": "lěng",
            "en": "cold"
        },
        {
            "zh": "新",
            "pinyin": "xīn",
            "en": "new"
        },
        {
            "zh": "旧",
            "pinyin": "jiù",
            "en": "old (for objects)"
        }
    ],
    "Descriptive Phrases": [
        {
            "zh": "很好",
            "pinyin": "hěn hǎo",
            "en": "very good"
        },
        {
            "zh": "太贵了",
            "pinyin": "tài guì le",
            "en": "too expensive"
        },
        {
            "zh": "非常漂亮",
            "pinyin": "fēicháng piàoliang",
            "en": "very beautiful"
        },
        {
            "zh": "不太远",
            "pinyin": "bú tài yuǎn",
            "en": "not too far"
        }
    ]
}

# Day 6: Question Words
day6_phrases = {
    "Question Words": [
        {
            "zh": "什么",
            "pinyin": "shénme",
            "en": "what"
        },
        {
            "zh": "谁",
            "pinyin": "shuí/shéi",
            "en": "who"
        },
        {
            "zh": "哪里",
            "pinyin": "nǎlǐ",
            "en": "where"
        },
        {
            "zh": "为什么",
            "pinyin": "wèishénme",
            "en": "why"
        },
        {
            "zh": "怎么",
            "pinyin": "zěnme",
            "en": "how"
        },
        {
            "zh": "多少",
            "pinyin": "duōshao",
            "en": "how many/how much"
        }
    ],
    "Common Questions": [
        {
            "zh": "这是什么？",
            "pinyin": "zhè shì shénme?",
            "en": "What is this?"
        },
        {
            "zh": "那是谁？",
            "pinyin": "nà shì shuí?",
            "en": "Who is that?"
        },
        {
            "zh": "你叫什么名字？",
            "pinyin": "nǐ jiào shénme míngzi?",
            "en": "What is your name?"
        },
        {
            "zh": "这个多少钱？",
            "pinyin": "zhège duōshao qián?",
            "en": "How much is this?"
        },
        {
            "zh": "洗手间在哪里？",
            "pinyin": "xǐshǒujiān zài nǎlǐ?",
            "en": "Where is the bathroom?"
        }
    ]
}

# Day 7: Basic Characters and Radicals
day7_phrases = {
    "Common Radicals": [
        {
            "zh": "人",
            "pinyin": "rén",
            "en": "person radical"
        },
        {
            "zh": "口",
            "pinyin": "kǒu",
            "en": "mouth radical"
        },
        {
            "zh": "女",
            "pinyin": "nǚ",
            "en": "woman radical"
        },
        {
            "zh": "水",
            "pinyin": "shuǐ",
            "en": "water radical"
        },
        {
            "zh": "木",
            "pinyin": "mù",
            "en": "tree/wood radical"
        },
        {
            "zh": "火",
            "pinyin": "huǒ",
            "en": "fire radical"
        },
        {
            "zh": "心",
            "pinyin": "xīn",
            "en": "heart radical"
        }
    ],
    "Character Components": [
        {
            "zh": "好 = 女 + 子",
            "pinyin": "hǎo = nǚ + zǐ",
            "en": "good = woman + child"
        },
        {
            "zh": "明 = 日 + 月",
            "pinyin": "míng = rì + yuè",
            "en": "bright = sun + moon"
        },
        {
            "zh": "休 = 人 + 木",
            "pinyin": "xiū = rén + mù",
            "en": "rest = person + tree"
        },
        {
            "zh": "男 = 田 + 力",
            "pinyin": "nán = tián + lì",
            "en": "man = field + strength"
        },
        {
            "zh": "森 = 木 + 木 + 木",
            "pinyin": "sēn = mù + mù + mù",
            "en": "forest = tree + tree + tree"
        }
    ]
}

# Dictionary mapping day numbers to phrase dictionaries
all_phrases = {
    1: day1_phrases,
    2: day2_phrases,
    3: day3_phrases,
    4: day4_phrases,
    5: day5_phrases,
    6: day6_phrases,
    7: day7_phrases
}

def generate_text_file(day, format_type):
    """Generate a text file with all phrases for a specific day"""
    print(f"Generating Day {day} {format_type} text file...")
    
    phrases_dict = all_phrases[day]
    
    # Ensure the text_files directory exists
    os.makedirs("text_files", exist_ok=True)
    
    with open(f"text_files/day{day}_{format_type}.txt", "w", encoding="utf-8") as f:
        for category, phrase_list in phrases_dict.items():
            f.write(f"\n{category}\n")
            f.write("-" * len(category) + "\n")
            for phrase in phrase_list:
                if format_type == "zh":
                    f.write(f"{phrase['zh']}\n")
                elif format_type == "pinyin":
                    f.write(f"{phrase['pinyin']}\n")
                else:  # English
                    f.write(f"{phrase['en']}\n")
    
    print(f"✓ Saved to text_files/day{day}_{format_type}.txt")

async def generate_audio(day, format_type="zh", voice=None):
    """Generate audio file for a specific day using edge-tts"""
    # Set default voice based on language
    if voice is None:
        voice = "zh-CN-XiaoxiaoNeural" if format_type == "zh" else "en-US-JennyNeural"
    
    print(f"\nGenerating Day {day} {format_type} audio file...")
    start_time = time.time()
    
    phrases_dict = all_phrases[day]
    
    # Generate text for phrases
    text = ""
    for category, phrase_list in phrases_dict.items():
        for phrase in phrase_list:
            # Add appropriate punctuation based on language
            if format_type == "zh":
                text += phrase['zh'] + "。"
            else:
                text += phrase['en'] + ". "
    
    # Ensure the audio_files directory exists
    os.makedirs("audio_files", exist_ok=True)
    
    # Configure edge-tts
    communicate = edge_tts.Communicate(text, voice)
    
    # Generate audio
    await communicate.save(f"audio_files/day{day}_{format_type}.mp3")
    
    elapsed = time.time() - start_time
    print(f"✓ Saved to audio_files/day{day}_{format_type}.mp3 ({elapsed:.2f}s)")

async def main():
    parser = argparse.ArgumentParser(description="Generate Mandarin and English learning files")
    parser.add_argument("--day", "-d", type=int, choices=[1, 2, 3, 4, 5, 6, 7], default=None,
                        help="Day number to generate (1-7). If not specified, generates all days.")
    parser.add_argument("--text-only", "-t", action="store_true", 
                        help="Generate only text files (no audio)")
    parser.add_argument("--voice", "-v", type=str,
                        help="Voice to use for audio generation")
    parser.add_argument("--language", "-l", type=str, choices=["zh", "en", "both"], default="both",
                        help="Language to generate audio for (zh=Chinese, en=English, both=Both languages)")
    args = parser.parse_args()
    
    # Determine which days to process
    days_to_process = [args.day] if args.day else [1, 2, 3, 4, 5, 6, 7]
    
    # Process each day
    for day in days_to_process:
        print(f"\n=== Processing Day {day} ===")
        
        # Generate text files for Chinese characters, Pinyin, and English
        generate_text_file(day, "zh")
        generate_text_file(day, "pinyin")
        generate_text_file(day, "en")
        
        # Generate audio files if not text-only mode
        if not args.text_only:
            if args.language in ["zh", "both"]:
                await generate_audio(day, "zh", args.voice)
            if args.language in ["en", "both"]:
                await generate_audio(day, "en", args.voice)
    
    print("\nAll files generated successfully!")
    print("\nUsage examples:")
    print("  - Generate text files only: python mandarin_phrases_days_01_07.py --text-only")
    print("  - Generate files for just Day 1: python mandarin_phrases_days_01_07.py --day 1")
    print("  - Generate Chinese audio only: python mandarin_phrases_days_01_07.py --language zh")
    print("  - Generate English audio only: python mandarin_phrases_days_01_07.py --language en")
    print("  - Generate with different voice: python mandarin_phrases_days_01_07.py --voice en-US-JennyNeural")
    print("\nAvailable voices:")
    print("Chinese voices:")
    print("  - zh-CN-XiaoxiaoNeural (Default female)")
    print("  - zh-CN-YunxiNeural (Male)")
    print("  - zh-CN-XiaoyiNeural (Female)")
    print("  - zh-CN-YunyangNeural (Male)")
    print("\nEnglish voices:")
    print("  - en-US-JennyNeural (Default female)")
    print("  - en-US-GuyNeural (Male)")
    print("  - en-US-AriaNeural (Female)")
    print("  - en-US-DavisNeural (Male)")

if __name__ == "__main__":
    asyncio.run(main())
