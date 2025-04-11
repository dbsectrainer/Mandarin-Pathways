import argparse
import os
import time
import asyncio
import edge_tts

# Define phrases by day and category

# Day 8: Shopping Vocabulary
day8_phrases = {
    "Shopping Places": [
        {
            "zh": "商店",
            "pinyin": "shāngdiàn",
            "en": "store"
        },
        {
            "zh": "超市",
            "pinyin": "chāoshì",
            "en": "supermarket"
        },
        {
            "zh": "市场",
            "pinyin": "shìchǎng",
            "en": "market"
        },
        {
            "zh": "百货商店",
            "pinyin": "bǎihuò shāngdiàn",
            "en": "department store"
        },
        {
            "zh": "购物中心",
            "pinyin": "gòuwù zhōngxīn",
            "en": "shopping mall"
        }
    ],
    "Shopping Phrases": [
        {
            "zh": "多少钱？",
            "pinyin": "duōshao qián?",
            "en": "How much money?"
        },
        {
            "zh": "太贵了",
            "pinyin": "tài guì le",
            "en": "Too expensive"
        },
        {
            "zh": "便宜一点",
            "pinyin": "piányi yīdiǎn",
            "en": "A little cheaper"
        },
        {
            "zh": "我要这个",
            "pinyin": "wǒ yào zhège",
            "en": "I want this one"
        },
        {
            "zh": "我只是看看",
            "pinyin": "wǒ zhǐshì kànkan",
            "en": "I'm just looking"
        }
    ]
}

# Day 9: Transportation
day9_phrases = {
    "Transportation Types": [
        {
            "zh": "公共汽车",
            "pinyin": "gōnggòng qìchē",
            "en": "bus"
        },
        {
            "zh": "地铁",
            "pinyin": "dìtiě",
            "en": "subway"
        },
        {
            "zh": "出租车",
            "pinyin": "chūzū chē",
            "en": "taxi"
        },
        {
            "zh": "火车",
            "pinyin": "huǒchē",
            "en": "train"
        },
        {
            "zh": "飞机",
            "pinyin": "fēijī",
            "en": "airplane"
        },
        {
            "zh": "自行车",
            "pinyin": "zìxíngchē",
            "en": "bicycle"
        }
    ],
    "Transportation Phrases": [
        {
            "zh": "去机场怎么走？",
            "pinyin": "qù jīchǎng zěnme zǒu?",
            "en": "How do I get to the airport?"
        },
        {
            "zh": "公共汽车站在哪里？",
            "pinyin": "gōnggòng qìchē zhàn zài nǎlǐ?",
            "en": "Where is the bus stop?"
        },
        {
            "zh": "请带我去这个地址",
            "pinyin": "qǐng dài wǒ qù zhège dìzhǐ",
            "en": "Please take me to this address"
        },
        {
            "zh": "一张票多少钱？",
            "pinyin": "yī zhāng piào duōshao qián?",
            "en": "How much is one ticket?"
        },
        {
            "zh": "下一班车什么时候来？",
            "pinyin": "xià yī bān chē shénme shíhou lái?",
            "en": "When does the next bus come?"
        }
    ]
}

# Day 10: Dining and Food
day10_phrases = {
    "Food Items": [
        {
            "zh": "米饭",
            "pinyin": "mǐfàn",
            "en": "rice"
        },
        {
            "zh": "面条",
            "pinyin": "miàntiáo",
            "en": "noodles"
        },
        {
            "zh": "鸡肉",
            "pinyin": "jīròu",
            "en": "chicken"
        },
        {
            "zh": "牛肉",
            "pinyin": "niúròu",
            "en": "beef"
        },
        {
            "zh": "猪肉",
            "pinyin": "zhūròu",
            "en": "pork"
        },
        {
            "zh": "蔬菜",
            "pinyin": "shūcài",
            "en": "vegetables"
        },
        {
            "zh": "水果",
            "pinyin": "shuǐguǒ",
            "en": "fruit"
        }
    ],
    "Restaurant Phrases": [
        {
            "zh": "菜单",
            "pinyin": "càidān",
            "en": "menu"
        },
        {
            "zh": "我想点菜",
            "pinyin": "wǒ xiǎng diǎn cài",
            "en": "I'd like to order"
        },
        {
            "zh": "服务员",
            "pinyin": "fúwùyuán",
            "en": "waiter/waitress"
        },
        {
            "zh": "买单",
            "pinyin": "mǎidān",
            "en": "check please"
        },
        {
            "zh": "这个好吃吗？",
            "pinyin": "zhège hǎochī ma?",
            "en": "Is this delicious?"
        },
        {
            "zh": "我要一杯水",
            "pinyin": "wǒ yào yī bēi shuǐ",
            "en": "I want a glass of water"
        }
    ]
}

# Day 11: Directions
day11_phrases = {
    "Direction Words": [
        {
            "zh": "左边",
            "pinyin": "zuǒbiān",
            "en": "left side"
        },
        {
            "zh": "右边",
            "pinyin": "yòubiān",
            "en": "right side"
        },
        {
            "zh": "前面",
            "pinyin": "qiánmiàn",
            "en": "in front"
        },
        {
            "zh": "后面",
            "pinyin": "hòumiàn",
            "en": "behind"
        },
        {
            "zh": "上面",
            "pinyin": "shàngmiàn",
            "en": "above"
        },
        {
            "zh": "下面",
            "pinyin": "xiàmiàn",
            "en": "below"
        },
        {
            "zh": "里面",
            "pinyin": "lǐmiàn",
            "en": "inside"
        },
        {
            "zh": "外面",
            "pinyin": "wàimiàn",
            "en": "outside"
        }
    ],
    "Asking for Directions": [
        {
            "zh": "请问，银行在哪里？",
            "pinyin": "qǐngwèn, yínháng zài nǎlǐ?",
            "en": "Excuse me, where is the bank?"
        },
        {
            "zh": "怎么去火车站？",
            "pinyin": "zěnme qù huǒchēzhàn?",
            "en": "How do I get to the train station?"
        },
        {
            "zh": "直走",
            "pinyin": "zhí zǒu",
            "en": "go straight"
        },
        {
            "zh": "往左拐",
            "pinyin": "wǎng zuǒ guǎi",
            "en": "turn left"
        },
        {
            "zh": "往右拐",
            "pinyin": "wǎng yòu guǎi",
            "en": "turn right"
        },
        {
            "zh": "走多远？",
            "pinyin": "zǒu duō yuǎn?",
            "en": "How far to walk?"
        }
    ]
}

# Day 12: Basic Sentence Patterns
day12_phrases = {
    "Subject-Verb-Object": [
        {
            "zh": "我吃饭",
            "pinyin": "wǒ chī fàn",
            "en": "I eat rice"
        },
        {
            "zh": "他喝水",
            "pinyin": "tā hē shuǐ",
            "en": "He drinks water"
        },
        {
            "zh": "我们学中文",
            "pinyin": "wǒmen xué zhōngwén",
            "en": "We learn Chinese"
        },
        {
            "zh": "她看书",
            "pinyin": "tā kàn shū",
            "en": "She reads a book"
        }
    ],
    "Question Patterns": [
        {
            "zh": "你是学生吗？",
            "pinyin": "nǐ shì xuésheng ma?",
            "en": "Are you a student?"
        },
        {
            "zh": "你喜欢中国菜吗？",
            "pinyin": "nǐ xǐhuan zhōngguó cài ma?",
            "en": "Do you like Chinese food?"
        },
        {
            "zh": "你会说英语吗？",
            "pinyin": "nǐ huì shuō yīngyǔ ma?",
            "en": "Can you speak English?"
        },
        {
            "zh": "这是什么？",
            "pinyin": "zhè shì shénme?",
            "en": "What is this?"
        }
    ],
    "Negation Patterns": [
        {
            "zh": "我不是中国人",
            "pinyin": "wǒ bú shì zhōngguó rén",
            "en": "I am not Chinese"
        },
        {
            "zh": "他没有时间",
            "pinyin": "tā méiyǒu shíjiān",
            "en": "He doesn't have time"
        },
        {
            "zh": "我不喜欢咖啡",
            "pinyin": "wǒ bù xǐhuan kāfēi",
            "en": "I don't like coffee"
        },
        {
            "zh": "她不会游泳",
            "pinyin": "tā bú huì yóuyǒng",
            "en": "She can't swim"
        }
    ]
}

# Day 13: Survival Mandarin for Travelers
day13_phrases = {
    "Emergency Phrases": [
        {
            "zh": "救命！",
            "pinyin": "jiùmìng!",
            "en": "Help! (emergency)"
        },
        {
            "zh": "我需要帮助",
            "pinyin": "wǒ xūyào bāngzhù",
            "en": "I need help"
        },
        {
            "zh": "我迷路了",
            "pinyin": "wǒ mílù le",
            "en": "I'm lost"
        },
        {
            "zh": "我生病了",
            "pinyin": "wǒ shēngbìng le",
            "en": "I'm sick"
        },
        {
            "zh": "请叫医生",
            "pinyin": "qǐng jiào yīshēng",
            "en": "Please call a doctor"
        },
        {
            "zh": "请叫警察",
            "pinyin": "qǐng jiào jǐngchá",
            "en": "Please call the police"
        }
    ],
    "Hotel Phrases": [
        {
            "zh": "我有预订",
            "pinyin": "wǒ yǒu yùdìng",
            "en": "I have a reservation"
        },
        {
            "zh": "我想要一个房间",
            "pinyin": "wǒ xiǎng yào yī gè fángjiān",
            "en": "I would like a room"
        },
        {
            "zh": "房间钥匙",
            "pinyin": "fángjiān yàoshi",
            "en": "room key"
        },
        {
            "zh": "退房",
            "pinyin": "tuìfáng",
            "en": "check out"
        },
        {
            "zh": "行李",
            "pinyin": "xíngli",
            "en": "luggage"
        }
    ]
}

# Day 14: Useful Travel Expressions
day14_phrases = {
    "Travel Documents": [
        {
            "zh": "护照",
            "pinyin": "hùzhào",
            "en": "passport"
        },
        {
            "zh": "签证",
            "pinyin": "qiānzhèng",
            "en": "visa"
        },
        {
            "zh": "机票",
            "pinyin": "jīpiào",
            "en": "airplane ticket"
        },
        {
            "zh": "登机牌",
            "pinyin": "dēngjī pái",
            "en": "boarding pass"
        },
        {
            "zh": "海关",
            "pinyin": "hǎiguān",
            "en": "customs"
        }
    ],
    "Useful Expressions": [
        {
            "zh": "我不明白",
            "pinyin": "wǒ bù míngbai",
            "en": "I don't understand"
        },
        {
            "zh": "请再说一遍",
            "pinyin": "qǐng zài shuō yībiàn",
            "en": "Please say it again"
        },
        {
            "zh": "请说慢一点",
            "pinyin": "qǐng shuō màn yīdiǎn",
            "en": "Please speak more slowly"
        },
        {
            "zh": "你会说英语吗？",
            "pinyin": "nǐ huì shuō yīngyǔ ma?",
            "en": "Do you speak English?"
        },
        {
            "zh": "谢谢你的帮助",
            "pinyin": "xièxie nǐ de bāngzhù",
            "en": "Thank you for your help"
        },
        {
            "zh": "没关系",
            "pinyin": "méi guānxi",
            "en": "It doesn't matter/It's OK"
        }
    ]
}

# Dictionary mapping day numbers to phrase dictionaries
all_phrases = {
    8: day8_phrases,
    9: day9_phrases,
    10: day10_phrases,
    11: day11_phrases,
    12: day12_phrases,
    13: day13_phrases,
    14: day14_phrases
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
    parser.add_argument("--day", "-d", type=int, choices=[8, 9, 10, 11, 12, 13, 14], default=None,
                        help="Day number to generate (8-14). If not specified, generates all days.")
    parser.add_argument("--text-only", "-t", action="store_true", 
                        help="Generate only text files (no audio)")
    parser.add_argument("--voice", "-v", type=str, default="zh-CN-XiaoxiaoNeural",
                        help="Voice to use for audio generation (default: zh-CN-XiaoxiaoNeural)")
    args = parser.parse_args()
    
    # Determine which days to process
    days_to_process = [args.day] if args.day else [8, 9, 10, 11, 12, 13, 14]
    
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
    print("  - Generate text files only: python mandarin_phrases_days_08_14.py --text-only")
    print("  - Generate files for just Day 8: python mandarin_phrases_days_08_14.py --day 8")
    print("  - Generate with different voice: python mandarin_phrases_days_08_14.py --voice zh-CN-YunxiNeural")
    print("\nAvailable voices:")
    print("  - zh-CN-XiaoxiaoNeural (Default, female)")
    print("  - zh-CN-YunxiNeural (Male)")
    print("  - zh-CN-XiaoyiNeural (Female)")
    print("  - zh-CN-YunyangNeural (Male)")

if __name__ == "__main__":
    asyncio.run(main())
