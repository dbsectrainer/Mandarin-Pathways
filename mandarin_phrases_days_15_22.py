import argparse
import os
import time
import asyncio
import edge_tts

# Define phrases by day and category

# Day 15: Family Members
day15_phrases = {
    "Immediate Family": [
        {
            "zh": "爸爸",
            "pinyin": "bàba",
            "en": "father"
        },
        {
            "zh": "妈妈",
            "pinyin": "māma",
            "en": "mother"
        },
        {
            "zh": "哥哥",
            "pinyin": "gēge",
            "en": "older brother"
        },
        {
            "zh": "姐姐",
            "pinyin": "jiějie",
            "en": "older sister"
        },
        {
            "zh": "弟弟",
            "pinyin": "dìdi",
            "en": "younger brother"
        },
        {
            "zh": "妹妹",
            "pinyin": "mèimei",
            "en": "younger sister"
        },
        {
            "zh": "儿子",
            "pinyin": "érzi",
            "en": "son"
        },
        {
            "zh": "女儿",
            "pinyin": "nǚ'ér",
            "en": "daughter"
        }
    ],
    "Extended Family": [
        {
            "zh": "爷爷",
            "pinyin": "yéye",
            "en": "paternal grandfather"
        },
        {
            "zh": "奶奶",
            "pinyin": "nǎinai",
            "en": "paternal grandmother"
        },
        {
            "zh": "外公",
            "pinyin": "wàigōng",
            "en": "maternal grandfather"
        },
        {
            "zh": "外婆",
            "pinyin": "wàipó",
            "en": "maternal grandmother"
        },
        {
            "zh": "叔叔",
            "pinyin": "shūshu",
            "en": "uncle (father's younger brother)"
        },
        {
            "zh": "阿姨",
            "pinyin": "āyí",
            "en": "aunt (mother's sister)"
        },
        {
            "zh": "堂兄弟",
            "pinyin": "táng xiōngdì",
            "en": "male paternal cousin"
        },
        {
            "zh": "表兄弟",
            "pinyin": "biǎo xiōngdì",
            "en": "male maternal cousin"
        }
    ]
}

# Day 16: Social Interactions
day16_phrases = {
    "Greetings and Farewells": [
        {
            "zh": "你最近怎么样？",
            "pinyin": "nǐ zuìjìn zěnme yàng?",
            "en": "How have you been lately?"
        },
        {
            "zh": "好久不见",
            "pinyin": "hǎojiǔ bú jiàn",
            "en": "Long time no see"
        },
        {
            "zh": "认识你很高兴",
            "pinyin": "rènshi nǐ hěn gāoxìng",
            "en": "Nice to meet you"
        },
        {
            "zh": "回头见",
            "pinyin": "huítóu jiàn",
            "en": "See you later"
        },
        {
            "zh": "保重",
            "pinyin": "bǎozhòng",
            "en": "Take care"
        }
    ],
    "Social Phrases": [
        {
            "zh": "打扰了",
            "pinyin": "dǎrǎo le",
            "en": "Excuse me/Sorry to bother you"
        },
        {
            "zh": "没关系",
            "pinyin": "méi guānxi",
            "en": "It's okay/No problem"
        },
        {
            "zh": "祝你好运",
            "pinyin": "zhù nǐ hǎo yùn",
            "en": "Good luck to you"
        },
        {
            "zh": "干杯",
            "pinyin": "gānbēi",
            "en": "Cheers (when drinking)"
        },
        {
            "zh": "随便",
            "pinyin": "suíbiàn",
            "en": "Whatever/It doesn't matter"
        }
    ]
}

# Day 17: Chinese Etiquette
day17_phrases = {
    "Polite Expressions": [
        {
            "zh": "请",
            "pinyin": "qǐng",
            "en": "please"
        },
        {
            "zh": "谢谢",
            "pinyin": "xièxie",
            "en": "thank you"
        },
        {
            "zh": "不客气",
            "pinyin": "bú kèqi",
            "en": "you're welcome"
        },
        {
            "zh": "对不起",
            "pinyin": "duìbùqǐ",
            "en": "sorry"
        },
        {
            "zh": "没关系",
            "pinyin": "méi guānxi",
            "en": "it's okay"
        }
    ],
    "Cultural Etiquette": [
        {
            "zh": "入乡随俗",
            "pinyin": "rù xiāng suí sú",
            "en": "When in Rome, do as the Romans do"
        },
        {
            "zh": "敬茶",
            "pinyin": "jìng chá",
            "en": "to serve tea (as a sign of respect)"
        },
        {
            "zh": "送礼物",
            "pinyin": "sòng lǐwù",
            "en": "to give gifts"
        },
        {
            "zh": "尊老爱幼",
            "pinyin": "zūn lǎo ài yòu",
            "en": "respect the elderly and care for the young"
        },
        {
            "zh": "谦虚",
            "pinyin": "qiānxū",
            "en": "modesty/humility"
        }
    ]
}

# Day 18: Chinese Festivals
day18_phrases = {
    "Major Festivals": [
        {
            "zh": "春节",
            "pinyin": "Chūnjié",
            "en": "Spring Festival/Chinese New Year"
        },
        {
            "zh": "中秋节",
            "pinyin": "Zhōngqiū jié",
            "en": "Mid-Autumn Festival"
        },
        {
            "zh": "端午节",
            "pinyin": "Duānwǔ jié",
            "en": "Dragon Boat Festival"
        },
        {
            "zh": "清明节",
            "pinyin": "Qīngmíng jié",
            "en": "Tomb Sweeping Day"
        },
        {
            "zh": "元宵节",
            "pinyin": "Yuánxiāo jié",
            "en": "Lantern Festival"
        }
    ],
    "Festival Traditions": [
        {
            "zh": "红包",
            "pinyin": "hóngbāo",
            "en": "red envelope (with money)"
        },
        {
            "zh": "饺子",
            "pinyin": "jiǎozi",
            "en": "dumplings"
        },
        {
            "zh": "月饼",
            "pinyin": "yuèbǐng",
            "en": "mooncake"
        },
        {
            "zh": "粽子",
            "pinyin": "zòngzi",
            "en": "rice dumpling"
        },
        {
            "zh": "舞龙舞狮",
            "pinyin": "wǔ lóng wǔ shī",
            "en": "dragon and lion dance"
        },
        {
            "zh": "放鞭炮",
            "pinyin": "fàng biānpào",
            "en": "set off firecrackers"
        }
    ]
}

# Day 19: Home and Living
day19_phrases = {
    "Rooms and Areas": [
        {
            "zh": "客厅",
            "pinyin": "kètīng",
            "en": "living room"
        },
        {
            "zh": "卧室",
            "pinyin": "wòshì",
            "en": "bedroom"
        },
        {
            "zh": "厨房",
            "pinyin": "chúfáng",
            "en": "kitchen"
        },
        {
            "zh": "浴室",
            "pinyin": "yùshì",
            "en": "bathroom"
        },
        {
            "zh": "阳台",
            "pinyin": "yángtái",
            "en": "balcony"
        },
        {
            "zh": "花园",
            "pinyin": "huāyuán",
            "en": "garden"
        }
    ],
    "Household Items": [
        {
            "zh": "桌子",
            "pinyin": "zhuōzi",
            "en": "table"
        },
        {
            "zh": "椅子",
            "pinyin": "yǐzi",
            "en": "chair"
        },
        {
            "zh": "床",
            "pinyin": "chuáng",
            "en": "bed"
        },
        {
            "zh": "沙发",
            "pinyin": "shāfā",
            "en": "sofa"
        },
        {
            "zh": "电视",
            "pinyin": "diànshì",
            "en": "television"
        },
        {
            "zh": "冰箱",
            "pinyin": "bīngxiāng",
            "en": "refrigerator"
        },
        {
            "zh": "空调",
            "pinyin": "kòngtiáo",
            "en": "air conditioner"
        }
    ]
}

# Day 20: Public Places
day20_phrases = {
    "Common Places": [
        {
            "zh": "医院",
            "pinyin": "yīyuàn",
            "en": "hospital"
        },
        {
            "zh": "学校",
            "pinyin": "xuéxiào",
            "en": "school"
        },
        {
            "zh": "图书馆",
            "pinyin": "túshūguǎn",
            "en": "library"
        },
        {
            "zh": "公园",
            "pinyin": "gōngyuán",
            "en": "park"
        },
        {
            "zh": "银行",
            "pinyin": "yínháng",
            "en": "bank"
        },
        {
            "zh": "邮局",
            "pinyin": "yóujú",
            "en": "post office"
        },
        {
            "zh": "餐厅",
            "pinyin": "cāntīng",
            "en": "restaurant"
        }
    ],
    "Public Communication": [
        {
            "zh": "这里可以拍照吗？",
            "pinyin": "zhèlǐ kěyǐ pāizhào ma?",
            "en": "Can I take photos here?"
        },
        {
            "zh": "请问洗手间在哪里？",
            "pinyin": "qǐngwèn xǐshǒujiān zài nǎlǐ?",
            "en": "Where is the restroom?"
        },
        {
            "zh": "这里有WiFi吗？",
            "pinyin": "zhèlǐ yǒu WiFi ma?",
            "en": "Is there WiFi here?"
        },
        {
            "zh": "营业时间是几点到几点？",
            "pinyin": "yíngyè shíjiān shì jǐ diǎn dào jǐ diǎn?",
            "en": "What are the business hours?"
        },
        {
            "zh": "我需要帮助",
            "pinyin": "wǒ xūyào bāngzhù",
            "en": "I need help"
        }
    ]
}

# Day 21: Chinese Traditions
day21_phrases = {
    "Cultural Concepts": [
        {
            "zh": "面子",
            "pinyin": "miànzi",
            "en": "face (reputation/dignity)"
        },
        {
            "zh": "关系",
            "pinyin": "guānxi",
            "en": "relationships/connections"
        },
        {
            "zh": "孝顺",
            "pinyin": "xiàoshùn",
            "en": "filial piety"
        },
        {
            "zh": "和谐",
            "pinyin": "héxié",
            "en": "harmony"
        },
        {
            "zh": "中庸之道",
            "pinyin": "zhōngyōng zhī dào",
            "en": "the doctrine of the mean (moderation)"
        }
    ],
    "Traditional Arts": [
        {
            "zh": "书法",
            "pinyin": "shūfǎ",
            "en": "calligraphy"
        },
        {
            "zh": "国画",
            "pinyin": "guóhuà",
            "en": "traditional Chinese painting"
        },
        {
            "zh": "太极拳",
            "pinyin": "tàijíquán",
            "en": "tai chi"
        },
        {
            "zh": "京剧",
            "pinyin": "jīngjù",
            "en": "Beijing opera"
        },
        {
            "zh": "剪纸",
            "pinyin": "jiǎnzhǐ",
            "en": "paper cutting"
        },
        {
            "zh": "中医",
            "pinyin": "zhōngyī",
            "en": "traditional Chinese medicine"
        }
    ]
}

# Day 22: Everyday Communication
day22_phrases = {
    "Daily Expressions": [
        {
            "zh": "早安",
            "pinyin": "zǎo'ān",
            "en": "good morning"
        },
        {
            "zh": "晚安",
            "pinyin": "wǎn'ān",
            "en": "good night"
        },
        {
            "zh": "辛苦了",
            "pinyin": "xīnkǔ le",
            "en": "you've worked hard"
        },
        {
            "zh": "慢走",
            "pinyin": "màn zǒu",
            "en": "take care (when someone is leaving)"
        },
        {
            "zh": "开玩笑",
            "pinyin": "kāi wánxiào",
            "en": "just kidding"
        },
        {
            "zh": "别担心",
            "pinyin": "bié dānxīn",
            "en": "don't worry"
        }
    ],
    "Communication Strategies": [
        {
            "zh": "我听不懂",
            "pinyin": "wǒ tīng bù dǒng",
            "en": "I don't understand"
        },
        {
            "zh": "请再说一遍",
            "pinyin": "qǐng zài shuō yībiàn",
            "en": "please say it again"
        },
        {
            "zh": "你能说慢一点吗？",
            "pinyin": "nǐ néng shuō màn yīdiǎn ma?",
            "en": "can you speak more slowly?"
        },
        {
            "zh": "这个用中文怎么说？",
            "pinyin": "zhège yòng zhōngwén zěnme shuō?",
            "en": "how do you say this in Chinese?"
        },
        {
            "zh": "我正在学中文",
            "pinyin": "wǒ zhèngzài xué zhōngwén",
            "en": "I'm learning Chinese"
        }
    ]
}

# Dictionary mapping day numbers to phrase dictionaries
all_phrases = {
    15: day15_phrases,
    16: day16_phrases,
    17: day17_phrases,
    18: day18_phrases,
    19: day19_phrases,
    20: day20_phrases,
    21: day21_phrases,
    22: day22_phrases
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

async def generate_audio(day, voice="zh-CN-XiaoxiaoNeural"):
    """Generate audio file for a specific day using edge-tts"""
    print(f"\nGenerating Day {day} audio file...")
    start_time = time.time()
    
    phrases_dict = all_phrases[day]
    
    # Generate text for Mandarin phrases
    text = ""
    for category, phrase_list in phrases_dict.items():
        for phrase in phrase_list:
            text += phrase['zh'] + "。"  # Add proper Chinese punctuation
    
    # Ensure the audio_files directory exists
    os.makedirs("audio_files", exist_ok=True)
    
    # Configure edge-tts
    communicate = edge_tts.Communicate(text, voice)
    
    # Generate audio
    await communicate.save(f"audio_files/day{day}_zh.mp3")
    
    elapsed = time.time() - start_time
    print(f"✓ Saved to audio_files/day{day}_zh.mp3 ({elapsed:.2f}s)")

async def main():
    parser = argparse.ArgumentParser(description="Generate Mandarin learning files")
    parser.add_argument("--day", "-d", type=int, choices=[15, 16, 17, 18, 19, 20, 21, 22], default=None,
                        help="Day number to generate (15-22). If not specified, generates all days.")
    parser.add_argument("--text-only", "-t", action="store_true", 
                        help="Generate only text files (no audio)")
    parser.add_argument("--voice", "-v", type=str, default="zh-CN-XiaoxiaoNeural",
                        help="Voice to use for audio generation (default: zh-CN-XiaoxiaoNeural)")
    args = parser.parse_args()
    
    # Determine which days to process
    days_to_process = [args.day] if args.day else [15, 16, 17, 18, 19, 20, 21, 22]
    
    # Process each day
    for day in days_to_process:
        print(f"\n=== Processing Day {day} ===")
        
        # Generate text files for Chinese characters, Pinyin, and English
        generate_text_file(day, "zh")
        generate_text_file(day, "pinyin")
        generate_text_file(day, "en")
        
        # Generate audio files if not text-only mode
        if not args.text_only:
            await generate_audio(day, args.voice)
    
    print("\nAll files generated successfully!")
    print("\nUsage examples:")
    print("  - Generate text files only: python mandarin_phrases_days_15_22.py --text-only")
    print("  - Generate files for just Day 15: python mandarin_phrases_days_15_22.py --day 15")
    print("  - Generate with different voice: python mandarin_phrases_days_15_22.py --voice zh-CN-YunxiNeural")
    print("\nAvailable voices:")
    print("  - zh-CN-XiaoxiaoNeural (Default, female)")
    print("  - zh-CN-YunxiNeural (Male)")
    print("  - zh-CN-XiaoyiNeural (Female)")
    print("  - zh-CN-YunyangNeural (Male)")

if __name__ == "__main__":
    asyncio.run(main())
