import argparse
import os
import time
import asyncio
import edge_tts

# Define reading activities by level and topic

# Beginner Level
beginner_readings = {
    "Self Introduction": {
        "text_zh": "我叫李明。我是学生。我今年二十岁。我喜欢学习中文。我也喜欢听音乐和看电影。",
        "text_pinyin": "Wǒ jiào Lǐ Míng. Wǒ shì xuésheng. Wǒ jīnnián èrshí suì. Wǒ xǐhuan xuéxí zhōngwén. Wǒ yě xǐhuan tīng yīnyuè hé kàn diànyǐng.",
        "text_en": "My name is Li Ming. I am a student. I am twenty years old. I like learning Chinese. I also like listening to music and watching movies.",
        "vocabulary": [
            {"zh": "我", "pinyin": "wǒ", "en": "I, me"},
            {"zh": "叫", "pinyin": "jiào", "en": "to be called"},
            {"zh": "学生", "pinyin": "xuésheng", "en": "student"},
            {"zh": "今年", "pinyin": "jīnnián", "en": "this year"},
            {"zh": "岁", "pinyin": "suì", "en": "years old"},
            {"zh": "喜欢", "pinyin": "xǐhuan", "en": "to like"},
            {"zh": "学习", "pinyin": "xuéxí", "en": "to study"},
            {"zh": "中文", "pinyin": "zhōngwén", "en": "Chinese language"},
            {"zh": "也", "pinyin": "yě", "en": "also"},
            {"zh": "听", "pinyin": "tīng", "en": "to listen"},
            {"zh": "音乐", "pinyin": "yīnyuè", "en": "music"},
            {"zh": "看", "pinyin": "kàn", "en": "to watch"},
            {"zh": "电影", "pinyin": "diànyǐng", "en": "movie"}
        ],
        "questions": [
            {"question": "李明是谁？", "pinyin": "Lǐ Míng shì shéi?", "en": "Who is Li Ming?", "answer": "他是学生。"},
            {"question": "李明多大？", "pinyin": "Lǐ Míng duō dà?", "en": "How old is Li Ming?", "answer": "他二十岁。"},
            {"question": "李明喜欢什么？", "pinyin": "Lǐ Míng xǐhuan shénme?", "en": "What does Li Ming like?", "answer": "他喜欢学习中文、听音乐和看电影。"}
        ]
    },
    "Daily Routine": {
        "text_zh": "我每天早上六点起床。我七点吃早饭。八点去学校。中午十二点吃午饭。下午三点下课。晚上六点吃晚饭。晚上十点睡觉。",
        "text_pinyin": "Wǒ měitiān zǎoshang liù diǎn qǐchuáng. Wǒ qī diǎn chī zǎofàn. Bā diǎn qù xuéxiào. Zhōngwǔ shí'èr diǎn chī wǔfàn. Xiàwǔ sān diǎn xiàkè. Wǎnshang liù diǎn chī wǎnfàn. Wǎnshang shí diǎn shuìjiào.",
        "text_en": "I get up at 6:00 every morning. I eat breakfast at 7:00. I go to school at 8:00. I eat lunch at 12:00 noon. I finish class at 3:00 in the afternoon. I eat dinner at 6:00 in the evening. I go to bed at 10:00 at night.",
        "vocabulary": [
            {"zh": "每天", "pinyin": "měitiān", "en": "every day"},
            {"zh": "早上", "pinyin": "zǎoshang", "en": "morning"},
            {"zh": "起床", "pinyin": "qǐchuáng", "en": "to get up"},
            {"zh": "吃", "pinyin": "chī", "en": "to eat"},
            {"zh": "早饭", "pinyin": "zǎofàn", "en": "breakfast"},
            {"zh": "去", "pinyin": "qù", "en": "to go"},
            {"zh": "学校", "pinyin": "xuéxiào", "en": "school"},
            {"zh": "中午", "pinyin": "zhōngwǔ", "en": "noon"},
            {"zh": "午饭", "pinyin": "wǔfàn", "en": "lunch"},
            {"zh": "下午", "pinyin": "xiàwǔ", "en": "afternoon"},
            {"zh": "下课", "pinyin": "xiàkè", "en": "to finish class"},
            {"zh": "晚上", "pinyin": "wǎnshang", "en": "evening"},
            {"zh": "晚饭", "pinyin": "wǎnfàn", "en": "dinner"},
            {"zh": "睡觉", "pinyin": "shuìjiào", "en": "to sleep"}
        ],
        "questions": [
            {"question": "几点起床？", "pinyin": "Jǐ diǎn qǐchuáng?", "en": "What time do they get up?", "answer": "早上六点起床。"},
            {"question": "几点去学校？", "pinyin": "Jǐ diǎn qù xuéxiào?", "en": "What time do they go to school?", "answer": "八点去学校。"},
            {"question": "几点睡觉？", "pinyin": "Jǐ diǎn shuìjiào?", "en": "What time do they go to bed?", "answer": "晚上十点睡觉。"}
        ]
    }
}

# Intermediate Level
intermediate_readings = {
    "At the Restaurant": {
        "text_zh": "昨天晚上，我和朋友去了一家中国餐厅。这家餐厅很有名，菜很好吃。我们点了北京烤鸭、宫保鸡丁和蛋炒饭。服务员推荐我们尝试他们的特色茶。饭后，我们还吃了甜点。这顿饭总共花了三百元。",
        "text_pinyin": "Zuótiān wǎnshang, wǒ hé péngyou qùle yī jiā zhōngguó cāntīng. Zhè jiā cāntīng hěn yǒumíng, cài hěn hǎochī. Wǒmen diǎnle běijīng kǎoyā, gōngbǎo jīdīng hé dàn chǎofàn. Fúwùyuán tuījiàn wǒmen chángshì tāmen de tèsè chá. Fàn hòu, wǒmen hái chīle tiándiǎn. Zhè dùn fàn zǒnggòng huāle sānbǎi yuán.",
        "text_en": "Last night, my friend and I went to a Chinese restaurant. This restaurant is famous, and the food is delicious. We ordered Peking duck, Kung Pao chicken, and egg fried rice. The waiter recommended that we try their special tea. After the meal, we also had dessert. This meal cost a total of 300 yuan.",
        "vocabulary": [
            {"zh": "昨天", "pinyin": "zuótiān", "en": "yesterday"},
            {"zh": "朋友", "pinyin": "péngyou", "en": "friend"},
            {"zh": "餐厅", "pinyin": "cāntīng", "en": "restaurant"},
            {"zh": "有名", "pinyin": "yǒumíng", "en": "famous"},
            {"zh": "菜", "pinyin": "cài", "en": "dish, food"},
            {"zh": "好吃", "pinyin": "hǎochī", "en": "delicious"},
            {"zh": "点", "pinyin": "diǎn", "en": "to order"},
            {"zh": "北京烤鸭", "pinyin": "běijīng kǎoyā", "en": "Peking duck"},
            {"zh": "宫保鸡丁", "pinyin": "gōngbǎo jīdīng", "en": "Kung Pao chicken"},
            {"zh": "蛋炒饭", "pinyin": "dàn chǎofàn", "en": "egg fried rice"},
            {"zh": "服务员", "pinyin": "fúwùyuán", "en": "waiter"},
            {"zh": "推荐", "pinyin": "tuījiàn", "en": "to recommend"},
            {"zh": "特色", "pinyin": "tèsè", "en": "special, characteristic"},
            {"zh": "饭后", "pinyin": "fàn hòu", "en": "after meal"},
            {"zh": "甜点", "pinyin": "tiándiǎn", "en": "dessert"},
            {"zh": "总共", "pinyin": "zǒnggòng", "en": "in total"},
            {"zh": "花", "pinyin": "huā", "en": "to spend (money)"},
            {"zh": "元", "pinyin": "yuán", "en": "yuan (Chinese currency)"}
        ],
        "questions": [
            {"question": "他们去了什么地方？", "pinyin": "Tāmen qùle shénme dìfang?", "en": "Where did they go?", "answer": "他们去了一家中国餐厅。"},
            {"question": "他们点了什么菜？", "pinyin": "Tāmen diǎnle shénme cài?", "en": "What dishes did they order?", "answer": "他们点了北京烤鸭、宫保鸡丁和蛋炒饭。"},
            {"question": "这顿饭花了多少钱？", "pinyin": "Zhè dùn fàn huāle duōshao qián?", "en": "How much did the meal cost?", "answer": "这顿饭总共花了三百元。"}
        ]
    },
    "Weekend Plans": {
        "text_zh": "这个周末我有很多计划。星期六上午，我要去图书馆学习中文。中午，我和同学一起吃午饭。下午，我们打算去看电影。晚上，我要参加朋友的生日聚会。星期天，我想在家休息，可能会看书或者听音乐。",
        "text_pinyin": "Zhège zhōumò wǒ yǒu hěnduō jìhuà. Xīngqíliù shàngwǔ, wǒ yào qù túshūguǎn xuéxí zhōngwén. Zhōngwǔ, wǒ hé tóngxué yìqǐ chī wǔfàn. Xiàwǔ, wǒmen dǎsuàn qù kàn diànyǐng. Wǎnshang, wǒ yào cānjiā péngyou de shēngrì jùhuì. Xīngqítiān, wǒ xiǎng zài jiā xiūxi, kěnéng huì kàn shū huòzhě tīng yīnyuè.",
        "text_en": "I have many plans for this weekend. Saturday morning, I will go to the library to study Chinese. At noon, I will have lunch with my classmates. In the afternoon, we plan to go watch a movie. In the evening, I will attend my friend's birthday party. On Sunday, I want to rest at home, maybe read books or listen to music.",
        "vocabulary": [
            {"zh": "周末", "pinyin": "zhōumò", "en": "weekend"},
            {"zh": "计划", "pinyin": "jìhuà", "en": "plan"},
            {"zh": "星期六", "pinyin": "xīngqíliù", "en": "Saturday"},
            {"zh": "上午", "pinyin": "shàngwǔ", "en": "morning"},
            {"zh": "图书馆", "pinyin": "túshūguǎn", "en": "library"},
            {"zh": "同学", "pinyin": "tóngxué", "en": "classmate"},
            {"zh": "一起", "pinyin": "yìqǐ", "en": "together"},
            {"zh": "打算", "pinyin": "dǎsuàn", "en": "to plan"},
            {"zh": "参加", "pinyin": "cānjiā", "en": "to attend"},
            {"zh": "生日", "pinyin": "shēngrì", "en": "birthday"},
            {"zh": "聚会", "pinyin": "jùhuì", "en": "party"},
            {"zh": "星期天", "pinyin": "xīngqítiān", "en": "Sunday"},
            {"zh": "休息", "pinyin": "xiūxi", "en": "to rest"},
            {"zh": "可能", "pinyin": "kěnéng", "en": "maybe"},
            {"zh": "或者", "pinyin": "huòzhě", "en": "or"}
        ],
        "questions": [
            {"question": "星期六上午要做什么？", "pinyin": "Xīngqíliù shàngwǔ yào zuò shénme?", "en": "What will they do on Saturday morning?", "answer": "星期六上午要去图书馆学习中文。"},
            {"question": "星期六下午的计划是什么？", "pinyin": "Xīngqíliù xiàwǔ de jìhuà shì shénme?", "en": "What is the plan for Saturday afternoon?", "answer": "星期六下午打算去看电影。"},
            {"question": "星期天要做什么？", "pinyin": "Xīngqítiān yào zuò shénme?", "en": "What will they do on Sunday?", "answer": "星期天想在家休息，可能会看书或者听音乐。"}
        ]
    }
}

# Advanced Level
advanced_readings = {
    "Environmental Protection": {
        "text_zh": "近年来，环境保护已经成为全球关注的重要话题。随着工业化和城市化的发展，空气污染、水污染和土壤污染等环境问题日益严重。许多国家开始采取措施减少碳排放，发展可再生能源，如太阳能和风能。个人也可以通过减少使用塑料袋、节约用水和用电、使用公共交通工具等方式为环保做出贡献。保护环境不仅是政府的责任，也是每个公民的义务。",
        "text_pinyin": "Jìn niánlái, huánjìng bǎohù yǐjīng chéngwéi quánqiú guānzhù de zhòngyào huàtí. Suízhe gōngyèhuà hé chéngshìhuà de fāzhǎn, kōngqì wūrǎn, shuǐ wūrǎn hé tǔrǎng wūrǎn děng huánjìng wèntí rìyì yánzhòng. Xǔduō guójiā kāishǐ cǎiqǔ cuòshī jiǎnshǎo tàn pái fàng, fāzhǎn kě zàishēng néngyuán, rú tàiyángnéng hé fēngnéng. Gèrén yě kěyǐ tōngguò jiǎnshǎo shǐyòng sùliào dài, jiéyuē yòngshuǐ hé yòngdiàn, shǐyòng gōnggòng jiāotōng gōngjù děng fāngshì wèi huánbǎo zuò chū gòngxiàn. Bǎohù huánjìng bùjǐn shì zhèngfǔ de zérèn, yěshì měi gè gōngmín de yìwù.",
        "text_en": "In recent years, environmental protection has become an important topic of global concern. With the development of industrialization and urbanization, environmental problems such as air pollution, water pollution, and soil pollution are becoming increasingly serious. Many countries have begun to take measures to reduce carbon emissions and develop renewable energy sources such as solar and wind energy. Individuals can also contribute to environmental protection by reducing the use of plastic bags, conserving water and electricity, using public transportation, and other methods. Protecting the environment is not only the responsibility of the government but also the duty of every citizen.",
        "vocabulary": [
            {"zh": "环境保护", "pinyin": "huánjìng bǎohù", "en": "environmental protection"},
            {"zh": "全球", "pinyin": "quánqiú", "en": "global"},
            {"zh": "关注", "pinyin": "guānzhù", "en": "to pay attention to"},
            {"zh": "话题", "pinyin": "huàtí", "en": "topic"},
            {"zh": "工业化", "pinyin": "gōngyèhuà", "en": "industrialization"},
            {"zh": "城市化", "pinyin": "chéngshìhuà", "en": "urbanization"},
            {"zh": "发展", "pinyin": "fāzhǎn", "en": "development"},
            {"zh": "空气污染", "pinyin": "kōngqì wūrǎn", "en": "air pollution"},
            {"zh": "水污染", "pinyin": "shuǐ wūrǎn", "en": "water pollution"},
            {"zh": "土壤污染", "pinyin": "tǔrǎng wūrǎn", "en": "soil pollution"},
            {"zh": "日益", "pinyin": "rìyì", "en": "increasingly"},
            {"zh": "严重", "pinyin": "yánzhòng", "en": "serious"},
            {"zh": "采取措施", "pinyin": "cǎiqǔ cuòshī", "en": "to take measures"},
            {"zh": "减少", "pinyin": "jiǎnshǎo", "en": "to reduce"},
            {"zh": "碳排放", "pinyin": "tàn pái fàng", "en": "carbon emissions"},
            {"zh": "可再生能源", "pinyin": "kě zàishēng néngyuán", "en": "renewable energy"},
            {"zh": "太阳能", "pinyin": "tàiyángnéng", "en": "solar energy"},
            {"zh": "风能", "pinyin": "fēngnéng", "en": "wind energy"},
            {"zh": "塑料袋", "pinyin": "sùliào dài", "en": "plastic bag"},
            {"zh": "节约", "pinyin": "jiéyuē", "en": "to conserve"},
            {"zh": "公共交通工具", "pinyin": "gōnggòng jiāotōng gōngjù", "en": "public transportation"},
            {"zh": "贡献", "pinyin": "gòngxiàn", "en": "contribution"},
            {"zh": "责任", "pinyin": "zérèn", "en": "responsibility"},
            {"zh": "公民", "pinyin": "gōngmín", "en": "citizen"},
            {"zh": "义务", "pinyin": "yìwù", "en": "duty"}
        ],
        "questions": [
            {"question": "环境保护为什么成为重要话题？", "pinyin": "Huánjìng bǎohù wèishénme chéngwéi zhòngyào huàtí?", "en": "Why has environmental protection become an important topic?", "answer": "因为随着工业化和城市化的发展，环境问题日益严重。"},
            {"question": "国家采取了哪些措施保护环境？", "pinyin": "Guójiā cǎiqǔle nǎxiē cuòshī bǎohù huánjìng?", "en": "What measures have countries taken to protect the environment?", "answer": "减少碳排放，发展可再生能源，如太阳能和风能。"},
            {"question": "个人如何为环保做贡献？", "pinyin": "Gèrén rúhé wèi huánbǎo zuò gòngxiàn?", "en": "How can individuals contribute to environmental protection?", "answer": "减少使用塑料袋、节约用水和用电、使用公共交通工具等。"}
        ]
    }
}

# Dictionary mapping levels to reading dictionaries
all_readings = {
    "beginner": beginner_readings,
    "intermediate": intermediate_readings,
    "advanced": advanced_readings
}

def generate_reading_file(level, topic, format_type):
    """Generate a text file with reading content for a specific level and topic"""
    print(f"Generating {level} level {topic} {format_type} reading file...")
    
    readings_dict = all_readings[level]
    if topic not in readings_dict:
        print(f"Topic {topic} not found in {level} level readings")
        return
    
    reading_content = readings_dict[topic]
    
    # Ensure the reading_files directory exists
    os.makedirs("reading_files", exist_ok=True)
    
    with open(f"reading_files/{level}_{topic.lower().replace(' ', '_')}_{format_type}.txt", "w", encoding="utf-8") as f:
        # Write the main text
        if format_type == "zh":
            f.write(f"阅读练习\n")
            f.write("-" * 10 + "\n\n")
            f.write(reading_content["text_zh"] + "\n\n")
        elif format_type == "pinyin":
            f.write(f"Reading Exercise (Pinyin)\n")
            f.write("-" * 20 + "\n\n")
            f.write(reading_content["text_pinyin"] + "\n\n")
        elif format_type == "en":
            f.write(f"Reading Exercise\n")
            f.write("-" * 15 + "\n\n")
            f.write(reading_content["text_en"] + "\n\n")
        
        # Write vocabulary section with improved formatting
        f.write(f"生词表 / Vocabulary\n")
        f.write("-" * 20 + "\n\n")
        
        for word in reading_content["vocabulary"]:
            if format_type == "zh":
                f.write(f"• {word['zh']} ({word['pinyin']}) - {word['en']}\n")
            elif format_type == "pinyin":
                f.write(f"• {word['pinyin']} ({word['zh']}) - {word['en']}\n")
            elif format_type == "en":
                f.write(f"• {word['en']} ({word['pinyin']}) - {word['zh']}\n")
        
        f.write("\n\n")
        
        # Write questions section with improved formatting
        f.write(f"理解问题 / Comprehension Questions\n")
        f.write("-" * 30 + "\n\n")
        
        for i, question in enumerate(reading_content["questions"], 1):
            if format_type == "zh":
                f.write(f"【问题 {i}】 {question['question']}\n")
                f.write(f"答案: {question['answer']}\n\n")
            elif format_type == "pinyin":
                f.write(f"【Question {i}】 {question['pinyin']}\n")
                f.write(f"Answer: {question['answer']}\n\n")
            elif format_type == "en":
                f.write(f"【Question {i}】 {question['en']}\n")
                f.write(f"Answer: {question['answer']}\n\n")

async def generate_audio(level, topic, format_type="zh", voice=None):
    """Generate audio file for reading content"""
    print(f"Generating {level} level {topic} {format_type} audio file...")
    
    readings_dict = all_readings[level]
    if topic not in readings_dict:
        print(f"Topic {topic} not found in {level} level readings")
        return
    
    reading_content = readings_dict[topic]
    
    # Select text based on format type
    if format_type == "zh":
        text = reading_content["text_zh"]
        if not voice:
            voice = "zh-CN-XiaoxiaoNeural"
    elif format_type == "en":
        text = reading_content["text_en"]
        if not voice:
            voice = "en-US-AriaNeural"
    else:
        print(f"Audio generation not supported for {format_type}")
        return
    
    # Ensure the audio_files/reading directory exists
    os.makedirs("audio_files/reading", exist_ok=True)
    
    output_file = f"audio_files/reading/{level}_{topic.lower().replace(' ', '_')}_{format_type}.mp3"
    
    communicate = edge_tts.Communicate(text, voice)
    await communicate.save(output_file)
    
    print(f"Audio saved to {output_file}")

async def main():
    parser = argparse.ArgumentParser(description="Generate reading activity files")
    parser.add_argument("--level", choices=["beginner", "intermediate", "advanced"], default="all", help="Reading level")
    parser.add_argument("--topic", default="all", help="Reading topic")
    parser.add_argument("--format", choices=["zh", "pinyin", "en", "all"], default="all", help="Output format")
    parser.add_argument("--audio", action="store_true", help="Generate audio files")
    
    args = parser.parse_args()
    
    levels = list(all_readings.keys()) if args.level == "all" else [args.level]
    
    for level in levels:
        topics = list(all_readings[level].keys()) if args.topic == "all" else [args.topic]
        
        for topic in topics:
            if topic not in all_readings[level]:
                print(f"Topic {topic} not found in {level} level readings")
                continue
                
            formats = ["zh", "pinyin", "en"] if args.format == "all" else [args.format]
            
            for format_type in formats:
                generate_reading_file(level, topic, format_type)
                
                if args.audio and format_type in ["zh", "en"]:
                    await generate_audio(level, topic, format_type)

if __name__ == "__main__":
    asyncio.run(main())