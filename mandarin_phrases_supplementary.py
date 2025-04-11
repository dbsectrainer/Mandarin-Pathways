import argparse
import os
import time
import asyncio
import edge_tts

# Define supplementary phrases by category

# Education & Academic Life
education_phrases = {
    "School Subjects": [
        {
            "zh": "数学",
            "pinyin": "shùxué",
            "en": "mathematics"
        },
        {
            "zh": "物理",
            "pinyin": "wùlǐ",
            "en": "physics"
        },
        {
            "zh": "化学",
            "pinyin": "huàxué",
            "en": "chemistry"
        },
        {
            "zh": "生物",
            "pinyin": "shēngwù",
            "en": "biology"
        },
        {
            "zh": "历史",
            "pinyin": "lìshǐ",
            "en": "history"
        },
        {
            "zh": "地理",
            "pinyin": "dìlǐ",
            "en": "geography"
        },
        {
            "zh": "文学",
            "pinyin": "wénxué",
            "en": "literature"
        }
    ],
    "Classroom Phrases": [
        {
            "zh": "请举手",
            "pinyin": "qǐng jǔshǒu",
            "en": "please raise your hand"
        },
        {
            "zh": "我不明白",
            "pinyin": "wǒ bù míngbai",
            "en": "I don't understand"
        },
        {
            "zh": "能再解释一遍吗？",
            "pinyin": "néng zài jiěshì yībiàn ma?",
            "en": "Can you explain again?"
        },
        {
            "zh": "下课了",
            "pinyin": "xià kè le",
            "en": "class is over"
        },
        {
            "zh": "考试",
            "pinyin": "kǎoshì",
            "en": "exam"
        }
    ]
}

# Hobbies & Interests
hobbies_phrases = {
    "Sports": [
        {
            "zh": "足球",
            "pinyin": "zúqiú",
            "en": "football/soccer"
        },
        {
            "zh": "篮球",
            "pinyin": "lánqiú",
            "en": "basketball"
        },
        {
            "zh": "游泳",
            "pinyin": "yóuyǒng",
            "en": "swimming"
        },
        {
            "zh": "网球",
            "pinyin": "wǎngqiú",
            "en": "tennis"
        },
        {
            "zh": "跑步",
            "pinyin": "pǎobù",
            "en": "running"
        }
    ],
    "Arts & Entertainment": [
        {
            "zh": "看电影",
            "pinyin": "kàn diànyǐng",
            "en": "watch movies"
        },
        {
            "zh": "听音乐",
            "pinyin": "tīng yīnyuè",
            "en": "listen to music"
        },
        {
            "zh": "画画",
            "pinyin": "huàhuà",
            "en": "painting"
        },
        {
            "zh": "摄影",
            "pinyin": "shèyǐng",
            "en": "photography"
        },
        {
            "zh": "弹钢琴",
            "pinyin": "tán gāngqín",
            "en": "play piano"
        }
    ],
    "Reading & Literature": [
        {
            "zh": "小说",
            "pinyin": "xiǎoshuō",
            "en": "novel"
        },
        {
            "zh": "诗歌",
            "pinyin": "shīgē",
            "en": "poetry"
        },
        {
            "zh": "杂志",
            "pinyin": "zázhì",
            "en": "magazine"
        },
        {
            "zh": "漫画",
            "pinyin": "mànhuà",
            "en": "comics"
        },
        {
            "zh": "科幻小说",
            "pinyin": "kēhuàn xiǎoshuō",
            "en": "science fiction"
        }
    ]
}

# Emotions & Feelings
emotions_phrases = {
    "Basic Emotions": [
        {
            "zh": "高兴",
            "pinyin": "gāoxìng",
            "en": "happy"
        },
        {
            "zh": "伤心",
            "pinyin": "shāngxīn",
            "en": "sad"
        },
        {
            "zh": "生气",
            "pinyin": "shēngqì",
            "en": "angry"
        },
        {
            "zh": "害怕",
            "pinyin": "hàipà",
            "en": "afraid"
        },
        {
            "zh": "紧张",
            "pinyin": "jǐnzhāng",
            "en": "nervous"
        },
        {
            "zh": "兴奋",
            "pinyin": "xīngfèn",
            "en": "excited"
        }
    ],
    "Complex Feelings": [
        {
            "zh": "失望",
            "pinyin": "shīwàng",
            "en": "disappointed"
        },
        {
            "zh": "骄傲",
            "pinyin": "jiāo'ào",
            "en": "proud"
        },
        {
            "zh": "感动",
            "pinyin": "gǎndòng",
            "en": "moved/touched"
        },
        {
            "zh": "困惑",
            "pinyin": "kùnhuò",
            "en": "confused"
        },
        {
            "zh": "担心",
            "pinyin": "dānxīn",
            "en": "worried"
        }
    ],
    "Expressing Feelings": [
        {
            "zh": "我觉得很...",
            "pinyin": "wǒ juéde hěn...",
            "en": "I feel very..."
        },
        {
            "zh": "让我很开心",
            "pinyin": "ràng wǒ hěn kāixīn",
            "en": "makes me happy"
        },
        {
            "zh": "我有点儿...",
            "pinyin": "wǒ yǒu diǎnr...",
            "en": "I'm a bit..."
        },
        {
            "zh": "心情不好",
            "pinyin": "xīnqíng bù hǎo",
            "en": "in a bad mood"
        }
    ]
}

# Weather & Daily Life
daily_life_phrases = {
    "Weather Conditions": [
        {
            "zh": "晴天",
            "pinyin": "qíngtiān",
            "en": "sunny day"
        },
        {
            "zh": "下雨",
            "pinyin": "xiàyǔ",
            "en": "raining"
        },
        {
            "zh": "多云",
            "pinyin": "duōyún",
            "en": "cloudy"
        },
        {
            "zh": "刮风",
            "pinyin": "guāfēng",
            "en": "windy"
        },
        {
            "zh": "下雪",
            "pinyin": "xiàxuě",
            "en": "snowing"
        },
        {
            "zh": "潮湿",
            "pinyin": "cháoshī",
            "en": "humid"
        }
    ],
    "Daily Routines": [
        {
            "zh": "起床",
            "pinyin": "qǐchuáng",
            "en": "get up"
        },
        {
            "zh": "刷牙",
            "pinyin": "shuāyá",
            "en": "brush teeth"
        },
        {
            "zh": "洗澡",
            "pinyin": "xǐzǎo",
            "en": "take a shower"
        },
        {
            "zh": "吃早饭",
            "pinyin": "chī zǎofàn",
            "en": "eat breakfast"
        },
        {
            "zh": "上班",
            "pinyin": "shàngbān",
            "en": "go to work"
        },
        {
            "zh": "下班",
            "pinyin": "xiàbān",
            "en": "get off work"
        }
    ],
    "Shopping Types": [
        {
            "zh": "服装店",
            "pinyin": "fúzhuāng diàn",
            "en": "clothing store"
        },
        {
            "zh": "书店",
            "pinyin": "shūdiàn",
            "en": "bookstore"
        },
        {
            "zh": "药店",
            "pinyin": "yàodiàn",
            "en": "pharmacy"
        },
        {
            "zh": "面包店",
            "pinyin": "miànbāo diàn",
            "en": "bakery"
        },
        {
            "zh": "水果店",
            "pinyin": "shuǐguǒ diàn",
            "en": "fruit store"
        }
    ]
}

# Comparison Structures
comparison_phrases = {
    "Basic Comparisons": [
        {
            "zh": "比...更",
            "pinyin": "bǐ... gèng",
            "en": "more... than"
        },
        {
            "zh": "没有...那么",
            "pinyin": "méiyǒu... nàme",
            "en": "not as... as"
        },
        {
            "zh": "跟...一样",
            "pinyin": "gēn... yīyàng",
            "en": "same as..."
        },
        {
            "zh": "最...",
            "pinyin": "zuì...",
            "en": "the most..."
        }
    ],
    "Example Sentences": [
        {
            "zh": "这个比那个贵",
            "pinyin": "zhège bǐ nàge guì",
            "en": "this is more expensive than that"
        },
        {
            "zh": "今天没有昨天热",
            "pinyin": "jīntiān méiyǒu zuótiān rè",
            "en": "today is not as hot as yesterday"
        },
        {
            "zh": "这两个一样好",
            "pinyin": "zhè liǎng ge yīyàng hǎo",
            "en": "these two are equally good"
        },
        {
            "zh": "这是最好的选择",
            "pinyin": "zhè shì zuì hǎo de xuǎnzé",
            "en": "this is the best choice"
        }
    ]
}

# Dictionary mapping categories to phrase dictionaries
supplementary_phrases = {
    "education": education_phrases,
    "hobbies": hobbies_phrases,
    "emotions": emotions_phrases,
    "daily_life": daily_life_phrases,
    "comparisons": comparison_phrases
}

def generate_text_file(category, format_type):
    """Generate a text file with all phrases for a specific category"""
    print(f"Generating {category} {format_type} text file...")
    
    phrases_dict = supplementary_phrases[category]
    
    # Ensure the text_files directory exists
    os.makedirs("text_files/supplementary", exist_ok=True)
    
    with open(f"text_files/supplementary/{category}_{format_type}.txt", "w", encoding="utf-8") as f:
        for subcategory, phrase_list in phrases_dict.items():
            f.write(f"\n{subcategory}\n")
            f.write("-" * len(subcategory) + "\n")
            for phrase in phrase_list:
                if format_type == "zh":
                    f.write(f"{phrase['zh']}\n")
                elif format_type == "pinyin":
                    f.write(f"{phrase['pinyin']}\n")
                else:  # English
                    f.write(f"{phrase['en']}\n")
    
    print(f"✓ Saved to text_files/supplementary/{category}_{format_type}.txt")

async def generate_audio(category, format_type="zh", voice=None):
    """Generate audio file for a specific category using edge-tts"""
    # Set default voice based on language
    if voice is None:
        voice = "zh-CN-XiaoxiaoNeural" if format_type == "zh" else "en-US-JennyNeural"
    
    print(f"\nGenerating {category} {format_type} audio file...")
    start_time = time.time()
    
    phrases_dict = supplementary_phrases[category]
    
    # Generate text for phrases
    text = ""
    for subcategory, phrase_list in phrases_dict.items():
        for phrase in phrase_list:
            # Add appropriate punctuation based on language
            if format_type == "zh":
                text += phrase['zh'] + "。"
            else:
                text += phrase['en'] + ". "
    
    # Ensure the audio_files directory exists
    os.makedirs("audio_files/supplementary", exist_ok=True)
    
    # Configure edge-tts
    communicate = edge_tts.Communicate(text, voice)
    
    # Generate audio
    await communicate.save(f"audio_files/supplementary/{category}_{format_type}.mp3")
    
    elapsed = time.time() - start_time
    print(f"✓ Saved to audio_files/supplementary/{category}_{format_type}.mp3 ({elapsed:.2f}s)")

async def main():
    parser = argparse.ArgumentParser(description="Generate supplementary Mandarin and English learning files")
    parser.add_argument("--category", "-c", type=str, 
                        choices=["education", "hobbies", "emotions", "daily_life", "comparisons"],
                        default=None,
                        help="Category to generate. If not specified, generates all categories.")
    parser.add_argument("--text-only", "-t", action="store_true", 
                        help="Generate only text files (no audio)")
    parser.add_argument("--voice", "-v", type=str,
                        help="Voice to use for audio generation")
    parser.add_argument("--language", "-l", type=str, choices=["zh", "en", "both"], default="both",
                        help="Language to generate audio for (zh=Chinese, en=English, both=Both languages)")
    args = parser.parse_args()
    
    # Determine which categories to process
    categories_to_process = [args.category] if args.category else supplementary_phrases.keys()
    
    # Process each category
    for category in categories_to_process:
        print(f"\n=== Processing {category} ===")
        
        # Generate text files for Chinese characters, Pinyin, and English
        generate_text_file(category, "zh")
        generate_text_file(category, "pinyin")
        generate_text_file(category, "en")
        
        # Generate audio files if not text-only mode
        if not args.text_only:
            if args.language in ["zh", "both"]:
                await generate_audio(category, "zh", args.voice)
            if args.language in ["en", "both"]:
                await generate_audio(category, "en", args.voice)
    
    print("\nAll supplementary files generated successfully!")
    print("\nUsage examples:")
    print("  - Generate text files only: python mandarin_phrases_supplementary.py --text-only")
    print("  - Generate files for just education: python mandarin_phrases_supplementary.py --category education")
    print("  - Generate Chinese audio only: python mandarin_phrases_supplementary.py --language zh")
    print("  - Generate English audio only: python mandarin_phrases_supplementary.py --language en")
    print("  - Generate with different voice: python mandarin_phrases_supplementary.py --voice en-US-JennyNeural")
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
