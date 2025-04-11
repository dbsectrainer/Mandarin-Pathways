import argparse
import os
import time
import asyncio
import edge_tts

# Define phrases by day and category

# Day 31: Chinese Idioms (Chengyu)
day31_phrases = {
    "Common Idioms": [
        {
            "zh": "一举两得",
            "pinyin": "yī jǔ liǎng dé",
            "en": "kill two birds with one stone"
        },
        {
            "zh": "入乡随俗",
            "pinyin": "rù xiāng suí sú",
            "en": "when in Rome, do as the Romans do"
        },
        {
            "zh": "守株待兔",
            "pinyin": "shǒu zhū dài tù",
            "en": "wait for opportunities without making effort"
        },
        {
            "zh": "画蛇添足",
            "pinyin": "huà shé tiān zú",
            "en": "add unnecessary details (lit: draw a snake and add feet)"
        },
        {
            "zh": "对牛弹琴",
            "pinyin": "duì niú tán qín",
            "en": "cast pearls before swine (lit: play the lute to a cow)"
        },
        {
            "zh": "塞翁失马",
            "pinyin": "sài wēng shī mǎ",
            "en": "a blessing in disguise"
        }
    ],
    "Using Idioms": [
        {
            "zh": "这个方法一举两得",
            "pinyin": "zhège fāngfǎ yī jǔ liǎng dé",
            "en": "This method kills two birds with one stone"
        },
        {
            "zh": "我们应该入乡随俗",
            "pinyin": "wǒmen yīnggāi rù xiāng suí sú",
            "en": "We should follow local customs"
        },
        {
            "zh": "不要守株待兔",
            "pinyin": "bùyào shǒu zhū dài tù",
            "en": "Don't just wait for opportunities"
        },
        {
            "zh": "这是画蛇添足",
            "pinyin": "zhè shì huà shé tiān zú",
            "en": "This is adding unnecessary details"
        }
    ]
}

# Day 32: Modern Slang
day32_phrases = {
    "Internet Slang": [
        {
            "zh": "666",
            "pinyin": "liù liù liù",
            "en": "awesome/skilled (gaming slang)"
        },
        {
            "zh": "打call",
            "pinyin": "dǎ call",
            "en": "to cheer for someone"
        },
        {
            "zh": "萌萌哒",
            "pinyin": "méng méng dā",
            "en": "super cute"
        },
        {
            "zh": "宅男",
            "pinyin": "zhái nán",
            "en": "homebody/geek (male)"
        },
        {
            "zh": "宅女",
            "pinyin": "zhái nǚ",
            "en": "homebody/geek (female)"
        },
        {
            "zh": "吃瓜群众",
            "pinyin": "chī guā qúnzhòng",
            "en": "bystander/onlooker (lit: melon-eating masses)"
        }
    ],
    "Youth Expressions": [
        {
            "zh": "厉害了",
            "pinyin": "lìhai le",
            "en": "awesome/amazing"
        },
        {
            "zh": "没谱",
            "pinyin": "méi pǔ",
            "en": "uncertain/no idea"
        },
        {
            "zh": "给力",
            "pinyin": "gěi lì",
            "en": "awesome/powerful"
        },
        {
            "zh": "累觉不爱",
            "pinyin": "lèi jué bù ài",
            "en": "too tired to care anymore"
        },
        {
            "zh": "佛系",
            "pinyin": "fó xì",
            "en": "laid-back/whatever will be, will be"
        },
        {
            "zh": "扎心了",
            "pinyin": "zhā xīn le",
            "en": "that hurt (emotionally)"
        }
    ]
}

# Day 33: Formal Expressions
day33_phrases = {
    "Formal Greetings": [
        {
            "zh": "敬爱的",
            "pinyin": "jìng'ài de",
            "en": "respected/dear"
        },
        {
            "zh": "尊敬的各位",
            "pinyin": "zūnjìng de gèwèi",
            "en": "respected ladies and gentlemen"
        },
        {
            "zh": "承蒙关照",
            "pinyin": "chéngméng guānzhào",
            "en": "thank you for your care/support"
        },
        {
            "zh": "久仰大名",
            "pinyin": "jiǔyǎng dàmíng",
            "en": "I've long heard of your reputation"
        },
        {
            "zh": "荣幸之至",
            "pinyin": "róngxìng zhī zhì",
            "en": "it's my greatest honor"
        }
    ],
    "Formal Phrases": [
        {
            "zh": "在下",
            "pinyin": "zàixià",
            "en": "I/me (humble)"
        },
        {
            "zh": "鄙人",
            "pinyin": "bǐrén",
            "en": "I/me (humble)"
        },
        {
            "zh": "敝公司",
            "pinyin": "bì gōngsī",
            "en": "my/our company (humble)"
        },
        {
            "zh": "贵公司",
            "pinyin": "guì gōngsī",
            "en": "your company (respectful)"
        },
        {
            "zh": "恭候佳音",
            "pinyin": "gōng hòu jiāyīn",
            "en": "looking forward to your good news"
        },
        {
            "zh": "不胜感激",
            "pinyin": "bùshèng gǎnjī",
            "en": "extremely grateful"
        }
    ]
}

# Day 34: Debate and Discussion
day34_phrases = {
    "Discussion Terms": [
        {
            "zh": "观点",
            "pinyin": "guāndiǎn",
            "en": "viewpoint"
        },
        {
            "zh": "论点",
            "pinyin": "lùndiǎn",
            "en": "argument/point"
        },
        {
            "zh": "证据",
            "pinyin": "zhèngjù",
            "en": "evidence"
        },
        {
            "zh": "反驳",
            "pinyin": "fǎnbó",
            "en": "refute/rebut"
        },
        {
            "zh": "辩论",
            "pinyin": "biànlùn",
            "en": "debate"
        },
        {
            "zh": "立场",
            "pinyin": "lìchǎng",
            "en": "stance/position"
        }
    ],
    "Discussion Phrases": [
        {
            "zh": "我认为",
            "pinyin": "wǒ rènwéi",
            "en": "I think/believe"
        },
        {
            "zh": "根据我的经验",
            "pinyin": "gēnjù wǒ de jīngyàn",
            "en": "based on my experience"
        },
        {
            "zh": "我不同意，因为...",
            "pinyin": "wǒ bù tóngyì, yīnwèi...",
            "en": "I disagree because..."
        },
        {
            "zh": "有一点我想补充",
            "pinyin": "yǒu yīdiǎn wǒ xiǎng bǔchōng",
            "en": "there's one point I'd like to add"
        },
        {
            "zh": "让我们换个角度思考",
            "pinyin": "ràng wǒmen huàn gè jiǎodù sīkǎo",
            "en": "let's think from another perspective"
        },
        {
            "zh": "总结一下",
            "pinyin": "zǒngjié yīxià",
            "en": "to summarize"
        }
    ]
}

# Day 35: Storytelling
day35_phrases = {
    "Narrative Elements": [
        {
            "zh": "故事",
            "pinyin": "gùshi",
            "en": "story"
        },
        {
            "zh": "人物",
            "pinyin": "rénwù",
            "en": "character"
        },
        {
            "zh": "情节",
            "pinyin": "qíngjié",
            "en": "plot"
        },
        {
            "zh": "背景",
            "pinyin": "bèijǐng",
            "en": "background/setting"
        },
        {
            "zh": "主题",
            "pinyin": "zhǔtí",
            "en": "theme"
        },
        {
            "zh": "结局",
            "pinyin": "jiéjú",
            "en": "ending"
        }
    ],
    "Storytelling Phrases": [
        {
            "zh": "从前有一个...",
            "pinyin": "cóngqián yǒu yī gè...",
            "en": "once upon a time there was..."
        },
        {
            "zh": "有一天",
            "pinyin": "yǒu yī tiān",
            "en": "one day"
        },
        {
            "zh": "突然",
            "pinyin": "tūrán",
            "en": "suddenly"
        },
        {
            "zh": "接下来",
            "pinyin": "jiē xià lái",
            "en": "next/then"
        },
        {
            "zh": "最后",
            "pinyin": "zuìhòu",
            "en": "finally/in the end"
        },
        {
            "zh": "故事的寓意是",
            "pinyin": "gùshi de yùyì shì",
            "en": "the moral of the story is"
        }
    ]
}

# Day 36: Persuasive Speech
day36_phrases = {
    "Persuasion Techniques": [
        {
            "zh": "说服",
            "pinyin": "shuōfú",
            "en": "persuade"
        },
        {
            "zh": "影响",
            "pinyin": "yǐngxiǎng",
            "en": "influence"
        },
        {
            "zh": "吸引",
            "pinyin": "xīyǐn",
            "en": "attract"
        },
        {
            "zh": "强调",
            "pinyin": "qiángdiào",
            "en": "emphasize"
        },
        {
            "zh": "建议",
            "pinyin": "jiànyì",
            "en": "suggest"
        },
        {
            "zh": "说明",
            "pinyin": "shuōmíng",
            "en": "explain"
        }
    ],
    "Persuasive Phrases": [
        {
            "zh": "我强烈建议",
            "pinyin": "wǒ qiángliè jiànyì",
            "en": "I strongly suggest"
        },
        {
            "zh": "毫无疑问",
            "pinyin": "háo wú yíwèn",
            "en": "without a doubt"
        },
        {
            "zh": "请考虑一下",
            "pinyin": "qǐng kǎolǜ yīxià",
            "en": "please consider"
        },
        {
            "zh": "最重要的是",
            "pinyin": "zuì zhòngyào de shì",
            "en": "most importantly"
        },
        {
            "zh": "众所周知",
            "pinyin": "zhòng suǒ zhōu zhī",
            "en": "as everyone knows"
        },
        {
            "zh": "事实证明",
            "pinyin": "shìshí zhèngmíng",
            "en": "facts prove that"
        }
    ]
}

# Day 37: Practice Dialogue - Restaurant
day37_phrases = {
    "Restaurant Dialogue 1": [
        {
            "zh": "服务员：您好，几位？",
            "pinyin": "Fúwùyuán: Nín hǎo, jǐ wèi?",
            "en": "Waiter: Hello, how many people?"
        },
        {
            "zh": "顾客：两位，谢谢。",
            "pinyin": "Gùkè: Liǎng wèi, xièxie.",
            "en": "Customer: Two people, thank you."
        },
        {
            "zh": "服务员：请跟我来。",
            "pinyin": "Fúwùyuán: Qǐng gēn wǒ lái.",
            "en": "Waiter: Please follow me."
        },
        {
            "zh": "顾客：有菜单吗？",
            "pinyin": "Gùkè: Yǒu càidān ma?",
            "en": "Customer: Do you have a menu?"
        },
        {
            "zh": "服务员：给您，请慢用。",
            "pinyin": "Fúwùyuán: Gěi nín, qǐng màn yòng.",
            "en": "Waiter: Here you are, please take your time."
        }
    ],
    "Restaurant Dialogue 2": [
        {
            "zh": "顾客：我想点菜。",
            "pinyin": "Gùkè: Wǒ xiǎng diǎn cài.",
            "en": "Customer: I'd like to order."
        },
        {
            "zh": "服务员：您想点什么？",
            "pinyin": "Fúwùyuán: Nín xiǎng diǎn shénme?",
            "en": "Waiter: What would you like to order?"
        },
        {
            "zh": "顾客：我要一份宫保鸡丁和一碗米饭。",
            "pinyin": "Gùkè: Wǒ yào yī fèn gōngbǎo jīdīng hé yī wǎn mǐfàn.",
            "en": "Customer: I want one Kung Pao Chicken and a bowl of rice."
        },
        {
            "zh": "服务员：好的，还需要什么吗？",
            "pinyin": "Fúwùyuán: Hǎo de, hái xūyào shénme ma?",
            "en": "Waiter: OK, anything else?"
        },
        {
            "zh": "顾客：再来一杯茶，谢谢。",
            "pinyin": "Gùkè: Zài lái yī bēi chá, xièxie.",
            "en": "Customer: Also a cup of tea, thank you."
        }
    ]
}

# Day 38: Practice Dialogue - Shopping
day38_phrases = {
    "Shopping Dialogue 1": [
        {
            "zh": "顾客：这件衣服多少钱？",
            "pinyin": "Gùkè: Zhè jiàn yīfu duōshao qián?",
            "en": "Customer: How much is this piece of clothing?"
        },
        {
            "zh": "店员：两百元。",
            "pinyin": "Diànyuán: Liǎng bǎi yuán.",
            "en": "Clerk: 200 yuan."
        },
        {
            "zh": "顾客：太贵了，能便宜一点吗？",
            "pinyin": "Gùkè: Tài guì le, néng piányi yīdiǎn ma?",
            "en": "Customer: That's too expensive. Can you make it cheaper?"
        },
        {
            "zh": "店员：一百八十元，不能再低了。",
            "pinyin": "Diànyuán: Yī bǎi bā shí yuán, bù néng zài dī le.",
            "en": "Clerk: 180 yuan, can't go any lower."
        },
        {
            "zh": "顾客：好吧，我买了。",
            "pinyin": "Gùkè: Hǎo ba, wǒ mǎi le.",
            "en": "Customer: OK, I'll take it."
        }
    ],
    "Shopping Dialogue 2": [
        {
            "zh": "顾客：请问，试衣间在哪里？",
            "pinyin": "Gùkè: Qǐngwèn, shì yī jiān zài nǎlǐ?",
            "en": "Customer: Excuse me, where is the fitting room?"
        },
        {
            "zh": "店员：在那边，右转。",
            "pinyin": "Diànyuán: Zài nàbiān, yòu zhuǎn.",
            "en": "Clerk: Over there, turn right."
        },
        {
            "zh": "顾客：这件有没有大一点的尺码？",
            "pinyin": "Gùkè: Zhè jiàn yǒu méiyǒu dà yīdiǎn de chǐmǎ?",
            "en": "Customer: Do you have this in a larger size?"
        },
        {
            "zh": "店员：让我看看。有的，这是XL号的。",
            "pinyin": "Diànyuán: Ràng wǒ kànkan. Yǒu de, zhè shì XL hào de.",
            "en": "Clerk: Let me check. Yes, here's an XL."
        },
        {
            "zh": "顾客：谢谢，我试试看。",
            "pinyin": "Gùkè: Xièxie, wǒ shì shìkan.",
            "en": "Customer: Thanks, I'll try it on."
        }
    ]
}

# Day 39: Practice Dialogue - Business Meeting
day39_phrases = {
    "Business Meeting Dialogue 1": [
        {
            "zh": "李先生：早上好，感谢各位来参加今天的会议。",
            "pinyin": "Lǐ xiānsheng: Zǎoshang hǎo, gǎnxiè gèwèi lái cānjiā jīntiān de huìyì.",
            "en": "Mr. Li: Good morning, thank you all for attending today's meeting."
        },
        {
            "zh": "王女士：我们今天要讨论什么？",
            "pinyin": "Wáng nǚshì: Wǒmen jīntiān yào tǎolùn shénme?",
            "en": "Ms. Wang: What are we discussing today?"
        },
        {
            "zh": "李先生：我们需要讨论新项目的进展。",
            "pinyin": "Lǐ xiānsheng: Wǒmen xūyào tǎolùn xīn xiàngmù de jìnzhǎn.",
            "en": "Mr. Li: We need to discuss the progress of the new project."
        },
        {
            "zh": "张先生：我已经准备好了报告。",
            "pinyin": "Zhāng xiānsheng: Wǒ yǐjīng zhǔnbèi hǎo le bàogào.",
            "en": "Mr. Zhang: I have prepared the report."
        },
        {
            "zh": "李先生：太好了，请开始吧。",
            "pinyin": "Lǐ xiānsheng: Tài hǎo le, qǐng kāishǐ ba.",
            "en": "Mr. Li: Great, please begin."
        }
    ],
    "Business Meeting Dialogue 2": [
        {
            "zh": "张先生：根据数据，我们的销售增长了20%。",
            "pinyin": "Zhāng xiānsheng: Gēnjù shùjù, wǒmen de xiāoshòu zēngzhǎng le 20%.",
            "en": "Mr. Zhang: According to the data, our sales have increased by 20%."
        },
        {
            "zh": "王女士：这是个好消息，但我们的成本也增加了。",
            "pinyin": "Wáng nǚshì: Zhè shì gè hǎo xiāoxi, dàn wǒmen de chéngběn yě zēngjiā le.",
            "en": "Ms. Wang: That's good news, but our costs have also increased."
        },
        {
            "zh": "李先生：我们需要找到降低成本的方法。",
            "pinyin": "Lǐ xiānsheng: Wǒmen xūyào zhǎodào jiàngdī chéngběn de fāngfǎ.",
            "en": "Mr. Li: We need to find ways to reduce costs."
        },
        {
            "zh": "张先生：我有几个建议。",
            "pinyin": "Zhāng xiānsheng: Wǒ yǒu jǐ gè jiànyì.",
            "en": "Mr. Zhang: I have several suggestions."
        },
        {
            "zh": "李先生：请说。",
            "pinyin": "Lǐ xiānsheng: Qǐng shuō.",
            "en": "Mr. Li: Please go ahead."
        }
    ]
}

# Day 40: Practice Dialogue - Travel
day40_phrases = {
    "Travel Dialogue 1": [
        {
            "zh": "游客：请问，怎么去长城？",
            "pinyin": "Yóukè: Qǐngwèn, zěnme qù Chángchéng?",
            "en": "Tourist: Excuse me, how do I get to the Great Wall?"
        },
        {
            "zh": "当地人：你可以坐地铁到北京北站，然后换乘916路公交车。",
            "pinyin": "Dāngdì rén: Nǐ kěyǐ zuò dìtiě dào Běijīng běi zhàn, ránhòu huànchéng 916 lù gōngjiāo chē.",
            "en": "Local: You can take the subway to Beijing North Station, then transfer to bus route 916."
        },
        {
            "zh": "游客：大概需要多长时间？",
            "pinyin": "Yóukè: Dàgài xūyào duō cháng shíjiān?",
            "en": "Tourist: Approximately how long will it take?"
        },
        {
            "zh": "当地人：大约两个小时。",
            "pinyin": "Dāngdì rén: Dàyuē liǎng gè xiǎoshí.",
            "en": "Local: About two hours."
        },
        {
            "zh": "游客：谢谢您的帮助！",
            "pinyin": "Yóukè: Xièxiè nín de bāngzhù!",
            "en": "Tourist: Thank you for your help!"
        }
    ],
    "Travel Dialogue 2": [
        {
            "zh": "游客：这个景点几点关门？",
            "pinyin": "Yóukè: Zhège jǐngdiǎn jǐ diǎn guānmén?",
            "en": "Tourist: What time does this attraction close?"
        },
        {
            "zh": "工作人员：我们晚上八点关门。",
            "pinyin": "Gōngzuò rényuán: Wǒmen wǎnshang bā diǎn guānmén.",
            "en": "Staff: We close at 8 PM."
        },
        {
            "zh": "游客：门票多少钱？",
            "pinyin": "Yóukè: Ménpiào duōshao qián?",
            "en": "Tourist: How much is the admission ticket?"
        },
        {
            "zh": "工作人员：成人票一百元，学生票半价。",
            "pinyin": "Gōngzuò rényuán: Chéngrén piào yī bǎi yuán, xuésheng piào bàn jià.",
            "en": "Staff: Adult tickets are 100 yuan, student tickets are half price."
        },
        {
            "zh": "游客：我是学生，这是我的学生证。",
            "pinyin": "Yóukè: Wǒ shì xuésheng, zhè shì wǒ de xuésheng zhèng.",
            "en": "Tourist: I'm a student, here's my student ID."
        }
    ]
}

# Dictionary mapping day numbers to phrase dictionaries
all_phrases = {
    31: day31_phrases,
    32: day32_phrases,
    33: day33_phrases,
    34: day34_phrases,
    35: day35_phrases,
    36: day36_phrases,
    37: day37_phrases,
    38: day38_phrases,
    39: day39_phrases,
    40: day40_phrases
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
    parser.add_argument("--day", "-d", type=int, choices=[31, 32, 33, 34, 35, 36, 37, 38, 39, 40], default=None,
                        help="Day number to generate (31-40). If not specified, generates all days.")
    parser.add_argument("--text-only", "-t", action="store_true", 
                        help="Generate only text files (no audio)")
    parser.add_argument("--voice", "-v", type=str,
                        help="Voice to use for audio generation")
    parser.add_argument("--language", "-l", type=str, choices=["zh", "en", "both"], default="both",
                        help="Language to generate audio for (zh=Chinese, en=English, both=Both languages)")
    args = parser.parse_args()
    
    # Determine which days to process
    days_to_process = [args.day] if args.day else [31, 32, 33, 34, 35, 36, 37, 38, 39, 40]
    
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
    print("  - Generate text files only: python mandarin_phrases_days_31_40.py --text-only")
    print("  - Generate files for just Day 31: python mandarin_phrases_days_31_40.py --day 31")
    print("  - Generate Chinese audio only: python mandarin_phrases_days_31_40.py --language zh")
    print("  - Generate English audio only: python mandarin_phrases_days_31_40.py --language en")
    print("  - Generate with different voice: python mandarin_phrases_days_31_40.py --voice en-US-JennyNeural")
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
