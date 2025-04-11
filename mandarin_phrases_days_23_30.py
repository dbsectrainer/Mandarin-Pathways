import argparse
import os
import time
import asyncio
import edge_tts

# Define phrases by day and category

# Day 23: Workplace Vocabulary
day23_phrases = {
    "Job Titles": [
        {
            "zh": "经理",
            "pinyin": "jīnglǐ",
            "en": "manager"
        },
        {
            "zh": "老板",
            "pinyin": "lǎobǎn",
            "en": "boss"
        },
        {
            "zh": "同事",
            "pinyin": "tóngshì",
            "en": "colleague"
        },
        {
            "zh": "秘书",
            "pinyin": "mìshū",
            "en": "secretary"
        },
        {
            "zh": "工程师",
            "pinyin": "gōngchéngshī",
            "en": "engineer"
        },
        {
            "zh": "销售",
            "pinyin": "xiāoshòu",
            "en": "sales"
        },
        {
            "zh": "人力资源",
            "pinyin": "rénlì zīyuán",
            "en": "human resources"
        }
    ],
    "Office Items": [
        {
            "zh": "电脑",
            "pinyin": "diànnǎo",
            "en": "computer"
        },
        {
            "zh": "打印机",
            "pinyin": "dǎyìnjī",
            "en": "printer"
        },
        {
            "zh": "文件",
            "pinyin": "wénjiàn",
            "en": "document"
        },
        {
            "zh": "会议室",
            "pinyin": "huìyì shì",
            "en": "meeting room"
        },
        {
            "zh": "办公室",
            "pinyin": "bàngōngshì",
            "en": "office"
        },
        {
            "zh": "名片",
            "pinyin": "míngpiàn",
            "en": "business card"
        }
    ]
}

# Day 24: Business Etiquette
day24_phrases = {
    "Meeting Etiquette": [
        {
            "zh": "准时",
            "pinyin": "zhǔnshí",
            "en": "on time"
        },
        {
            "zh": "自我介绍",
            "pinyin": "zìwǒ jièshào",
            "en": "self-introduction"
        },
        {
            "zh": "握手",
            "pinyin": "wòshǒu",
            "en": "handshake"
        },
        {
            "zh": "交换名片",
            "pinyin": "jiāohuàn míngpiàn",
            "en": "exchange business cards"
        },
        {
            "zh": "尊重",
            "pinyin": "zūnzhòng",
            "en": "respect"
        }
    ],
    "Business Phrases": [
        {
            "zh": "很荣幸认识您",
            "pinyin": "hěn róngxìng rènshi nín",
            "en": "It's an honor to meet you"
        },
        {
            "zh": "请多关照",
            "pinyin": "qǐng duō guānzhào",
            "en": "Please take care of me (business context)"
        },
        {
            "zh": "合作愉快",
            "pinyin": "hézuò yúkuài",
            "en": "Happy cooperation"
        },
        {
            "zh": "期待与您再次见面",
            "pinyin": "qīdài yǔ nín zàicì jiànmiàn",
            "en": "Looking forward to seeing you again"
        },
        {
            "zh": "打扰了",
            "pinyin": "dǎrǎo le",
            "en": "Sorry to disturb you"
        }
    ]
}

# Day 25: Remote Work
day25_phrases = {
    "Remote Work Terms": [
        {
            "zh": "远程工作",
            "pinyin": "yuǎnchéng gōngzuò",
            "en": "remote work"
        },
        {
            "zh": "在家工作",
            "pinyin": "zài jiā gōngzuò",
            "en": "work from home"
        },
        {
            "zh": "灵活工作时间",
            "pinyin": "línghuó gōngzuò shíjiān",
            "en": "flexible working hours"
        },
        {
            "zh": "视频会议",
            "pinyin": "shìpín huìyì",
            "en": "video conference"
        },
        {
            "zh": "网络连接",
            "pinyin": "wǎngluò liánjiē",
            "en": "internet connection"
        }
    ],
    "Remote Work Phrases": [
        {
            "zh": "我的麦克风没有声音",
            "pinyin": "wǒ de màikèfēng méiyǒu shēngyīn",
            "en": "My microphone has no sound"
        },
        {
            "zh": "你能听到我说话吗？",
            "pinyin": "nǐ néng tīng dào wǒ shuōhuà ma?",
            "en": "Can you hear me speaking?"
        },
        {
            "zh": "我的网络不太稳定",
            "pinyin": "wǒ de wǎngluò bú tài wěndìng",
            "en": "My internet is not very stable"
        },
        {
            "zh": "我们可以开始了吗？",
            "pinyin": "wǒmen kěyǐ kāishǐ le ma?",
            "en": "Can we start now?"
        },
        {
            "zh": "请分享你的屏幕",
            "pinyin": "qǐng fēnxiǎng nǐ de píngmù",
            "en": "Please share your screen"
        }
    ]
}

# Day 26: Online Meetings
day26_phrases = {
    "Meeting Vocabulary": [
        {
            "zh": "议程",
            "pinyin": "yìchéng",
            "en": "agenda"
        },
        {
            "zh": "会议记录",
            "pinyin": "huìyì jìlù",
            "en": "meeting minutes"
        },
        {
            "zh": "讨论",
            "pinyin": "tǎolùn",
            "en": "discussion"
        },
        {
            "zh": "决定",
            "pinyin": "juédìng",
            "en": "decision"
        },
        {
            "zh": "参与者",
            "pinyin": "cānyùzhě",
            "en": "participant"
        },
        {
            "zh": "主持人",
            "pinyin": "zhǔchí rén",
            "en": "host/moderator"
        }
    ],
    "Meeting Phrases": [
        {
            "zh": "我们开始吧",
            "pinyin": "wǒmen kāishǐ ba",
            "en": "Let's begin"
        },
        {
            "zh": "有什么问题吗？",
            "pinyin": "yǒu shénme wèntí ma?",
            "en": "Are there any questions?"
        },
        {
            "zh": "我有一个问题",
            "pinyin": "wǒ yǒu yī gè wèntí",
            "en": "I have a question"
        },
        {
            "zh": "我同意",
            "pinyin": "wǒ tóngyì",
            "en": "I agree"
        },
        {
            "zh": "我不同意",
            "pinyin": "wǒ bù tóngyì",
            "en": "I disagree"
        },
        {
            "zh": "下次会议是什么时候？",
            "pinyin": "xià cì huìyì shì shénme shíhou?",
            "en": "When is the next meeting?"
        }
    ]
}

# Day 27: Email Communication
day27_phrases = {
    "Email Vocabulary": [
        {
            "zh": "电子邮件",
            "pinyin": "diànzǐ yóujiàn",
            "en": "email"
        },
        {
            "zh": "收件人",
            "pinyin": "shōujiàn rén",
            "en": "recipient"
        },
        {
            "zh": "发件人",
            "pinyin": "fājiàn rén",
            "en": "sender"
        },
        {
            "zh": "主题",
            "pinyin": "zhǔtí",
            "en": "subject"
        },
        {
            "zh": "附件",
            "pinyin": "fùjiàn",
            "en": "attachment"
        },
        {
            "zh": "抄送",
            "pinyin": "chāosòng",
            "en": "CC (carbon copy)"
        }
    ],
    "Email Phrases": [
        {
            "zh": "尊敬的先生/女士",
            "pinyin": "zūnjìng de xiānsheng/nǚshì",
            "en": "Dear Sir/Madam"
        },
        {
            "zh": "感谢您的邮件",
            "pinyin": "gǎnxiè nín de yóujiàn",
            "en": "Thank you for your email"
        },
        {
            "zh": "请查收附件",
            "pinyin": "qǐng chá shōu fùjiàn",
            "en": "Please check the attachment"
        },
        {
            "zh": "期待您的回复",
            "pinyin": "qīdài nín de huífù",
            "en": "Looking forward to your reply"
        },
        {
            "zh": "此致",
            "pinyin": "cǐ zhì",
            "en": "Sincerely"
        },
        {
            "zh": "敬上",
            "pinyin": "jìng shàng",
            "en": "Regards"
        }
    ]
}

# Day 28: Presentations
day28_phrases = {
    "Presentation Vocabulary": [
        {
            "zh": "演讲",
            "pinyin": "yǎnjiǎng",
            "en": "speech/presentation"
        },
        {
            "zh": "幻灯片",
            "pinyin": "huàndēng piàn",
            "en": "slides"
        },
        {
            "zh": "图表",
            "pinyin": "túbiǎo",
            "en": "chart"
        },
        {
            "zh": "数据",
            "pinyin": "shùjù",
            "en": "data"
        },
        {
            "zh": "结论",
            "pinyin": "jiélùn",
            "en": "conclusion"
        },
        {
            "zh": "问答环节",
            "pinyin": "wèn dá huánjié",
            "en": "Q&A session"
        }
    ],
    "Presentation Phrases": [
        {
            "zh": "今天我要讲的是...",
            "pinyin": "jīntiān wǒ yào jiǎng de shì...",
            "en": "Today I will talk about..."
        },
        {
            "zh": "首先",
            "pinyin": "shǒuxiān",
            "en": "firstly"
        },
        {
            "zh": "其次",
            "pinyin": "qícì",
            "en": "secondly"
        },
        {
            "zh": "最后",
            "pinyin": "zuìhòu",
            "en": "finally"
        },
        {
            "zh": "总结一下",
            "pinyin": "zǒngjié yīxià",
            "en": "to summarize"
        },
        {
            "zh": "有什么问题吗？",
            "pinyin": "yǒu shénme wèntí ma?",
            "en": "Are there any questions?"
        }
    ]
}

# Day 29: Technical Phrases
day29_phrases = {
    "Technical Vocabulary": [
        {
            "zh": "软件",
            "pinyin": "ruǎnjiàn",
            "en": "software"
        },
        {
            "zh": "硬件",
            "pinyin": "yìngjiàn",
            "en": "hardware"
        },
        {
            "zh": "程序",
            "pinyin": "chéngxù",
            "en": "program"
        },
        {
            "zh": "数据库",
            "pinyin": "shùjùkù",
            "en": "database"
        },
        {
            "zh": "网络",
            "pinyin": "wǎngluò",
            "en": "network"
        },
        {
            "zh": "云计算",
            "pinyin": "yún jìsuàn",
            "en": "cloud computing"
        },
        {
            "zh": "人工智能",
            "pinyin": "réngōng zhìnéng",
            "en": "artificial intelligence"
        }
    ],
    "Technical Phrases": [
        {
            "zh": "系统崩溃了",
            "pinyin": "xìtǒng bēngkuì le",
            "en": "The system crashed"
        },
        {
            "zh": "需要更新",
            "pinyin": "xūyào gēngxīn",
            "en": "Need to update"
        },
        {
            "zh": "备份数据",
            "pinyin": "bèifèn shùjù",
            "en": "Backup data"
        },
        {
            "zh": "重启电脑",
            "pinyin": "chóngqǐ diànnǎo",
            "en": "Restart the computer"
        },
        {
            "zh": "下载文件",
            "pinyin": "xiàzài wénjiàn",
            "en": "Download files"
        },
        {
            "zh": "上传文件",
            "pinyin": "shàngchuán wénjiàn",
            "en": "Upload files"
        }
    ]
}

# Day 30: Business Negotiations
day30_phrases = {
    "Negotiation Terms": [
        {
            "zh": "谈判",
            "pinyin": "tánpàn",
            "en": "negotiation"
        },
        {
            "zh": "合同",
            "pinyin": "hétong",
            "en": "contract"
        },
        {
            "zh": "条款",
            "pinyin": "tiáokuǎn",
            "en": "terms"
        },
        {
            "zh": "协议",
            "pinyin": "xiéyì",
            "en": "agreement"
        },
        {
            "zh": "价格",
            "pinyin": "jiàgé",
            "en": "price"
        },
        {
            "zh": "折扣",
            "pinyin": "zhékòu",
            "en": "discount"
        },
        {
            "zh": "合作伙伴",
            "pinyin": "hézuò huǒbàn",
            "en": "partner"
        }
    ],
    "Negotiation Phrases": [
        {
            "zh": "我们可以讨论一下价格吗？",
            "pinyin": "wǒmen kěyǐ tǎolùn yīxià jiàgé ma?",
            "en": "Can we discuss the price?"
        },
        {
            "zh": "这个条件我们可以接受",
            "pinyin": "zhège tiáojiàn wǒmen kěyǐ jiēshòu",
            "en": "We can accept this condition"
        },
        {
            "zh": "我们需要再考虑一下",
            "pinyin": "wǒmen xūyào zài kǎolǜ yīxià",
            "en": "We need to think about it more"
        },
        {
            "zh": "这是我们的最终报价",
            "pinyin": "zhè shì wǒmen de zuìzhōng bàojià",
            "en": "This is our final offer"
        },
        {
            "zh": "双赢",
            "pinyin": "shuāng yíng",
            "en": "win-win"
        },
        {
            "zh": "签署合同",
            "pinyin": "qiānshǔ hétong",
            "en": "sign the contract"
        }
    ]
}

# Dictionary mapping day numbers to phrase dictionaries
all_phrases = {
    23: day23_phrases,
    24: day24_phrases,
    25: day25_phrases,
    26: day26_phrases,
    27: day27_phrases,
    28: day28_phrases,
    29: day29_phrases,
    30: day30_phrases
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
    parser.add_argument("--day", "-d", type=int, choices=[23, 24, 25, 26, 27, 28, 29, 30], default=None,
                        help="Day number to generate (23-30). If not specified, generates all days.")
    parser.add_argument("--text-only", "-t", action="store_true", 
                        help="Generate only text files (no audio)")
    parser.add_argument("--voice", "-v", type=str, default="zh-CN-XiaoxiaoNeural",
                        help="Voice to use for audio generation (default: zh-CN-XiaoxiaoNeural)")
    args = parser.parse_args()
    
    # Determine which days to process
    days_to_process = [args.day] if args.day else [23, 24, 25, 26, 27, 28, 29, 30]
    
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
    print("  - Generate text files only: python mandarin_phrases_days_23_30.py --text-only")
    print("  - Generate files for just Day 23: python mandarin_phrases_days_23_30.py --day 23")
    print("  - Generate with different voice: python mandarin_phrases_days_23_30.py --voice zh-CN-YunxiNeural")
    print("\nAvailable voices:")
    print("  - zh-CN-XiaoxiaoNeural (Default, female)")
    print("  - zh-CN-YunxiNeural (Male)")
    print("  - zh-CN-XiaoyiNeural (Female)")
    print("  - zh-CN-YunyangNeural (Male)")

if __name__ == "__main__":
    asyncio.run(main())
