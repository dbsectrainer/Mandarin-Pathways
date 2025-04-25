import argparse
import os
import time
import asyncio
import edge_tts

# Define writing activities by level and type

# Character Practice
character_practice = {
    "Basic Strokes": {
        "title": "基本笔画 / Basic Strokes",
        "description": "Practice the fundamental strokes used in Chinese characters",
        "hasAudio": True,
        "characters": [
            {
                "character": "一",
                "pinyin": "yī",
                "meaning": "one",
                "stroke_count": 1,
                "stroke_order": "horizontal"
            },
            {
                "character": "丨",
                "pinyin": "gǔn",
                "meaning": "vertical stroke",
                "stroke_count": 1,
                "stroke_order": "vertical"
            },
            {
                "character": "丿",
                "pinyin": "piě",
                "meaning": "slash",
                "stroke_count": 1,
                "stroke_order": "slash"
            },
            {
                "character": "丶",
                "pinyin": "diǎn",
                "meaning": "dot",
                "stroke_count": 1,
                "stroke_order": "dot"
            },
            {
                "character": "乙",
                "pinyin": "yǐ",
                "meaning": "second",
                "stroke_count": 1,
                "stroke_order": "hook"
            }
        ],
        "practice_template": "Write each character 5 times, paying attention to stroke order:\n\n{character}: _ _ _ _ _"
    },
    "Common Radicals": {
        "title": "常用部首 / Common Radicals",
        "description": "Practice common radicals that form the building blocks of Chinese characters",
        "hasAudio": True,
        "characters": [
            {
                "character": "口",
                "pinyin": "kǒu",
                "meaning": "mouth",
                "stroke_count": 3,
                "stroke_order": "top, right, bottom-left"
            },
            {
                "character": "木",
                "pinyin": "mù",
                "meaning": "tree",
                "stroke_count": 4,
                "stroke_order": "vertical, horizontal, left diagonal, right diagonal"
            },
            {
                "character": "水",
                "pinyin": "shuǐ",
                "meaning": "water",
                "stroke_count": 4,
                "stroke_order": "left dot, right dot, left diagonal, right diagonal"
            },
            {
                "character": "火",
                "pinyin": "huǒ",
                "meaning": "fire",
                "stroke_count": 4,
                "stroke_order": "dot, left diagonal, right diagonal, vertical"
            },
            {
                "character": "人",
                "pinyin": "rén",
                "meaning": "person",
                "stroke_count": 2,
                "stroke_order": "left diagonal, right diagonal"
            }
        ],
        "practice_template": "Write each radical 5 times, paying attention to stroke order:\n\n{character}: _ _ _ _ _"
    },
    "Numbers": {
        "title": "数字 / Numbers",
        "description": "Practice writing Chinese numbers",
        "hasAudio": True,
        "characters": [
            {
                "character": "一",
                "pinyin": "yī",
                "meaning": "one",
                "stroke_count": 1,
                "stroke_order": "horizontal"
            },
            {
                "character": "二",
                "pinyin": "èr",
                "meaning": "two",
                "stroke_count": 2,
                "stroke_order": "top horizontal, bottom horizontal"
            },
            {
                "character": "三",
                "pinyin": "sān",
                "meaning": "three",
                "stroke_count": 3,
                "stroke_order": "top horizontal, middle horizontal, bottom horizontal"
            },
            {
                "character": "四",
                "pinyin": "sì",
                "meaning": "four",
                "stroke_count": 5,
                "stroke_order": "left horizontal, top horizontal, right vertical, middle horizontal, bottom box"
            },
            {
                "character": "五",
                "pinyin": "wǔ",
                "meaning": "five",
                "stroke_count": 4,
                "stroke_order": "horizontal, vertical, left horizontal, right horizontal"
            }
        ],
        "practice_template": "Write each number 5 times, paying attention to stroke order:\n\n{character}: _ _ _ _ _"
    },
    # Complete Radicals (organized in groups)
    "Complete Radicals - Group 1": {
        "title": "完整部首 - 第一组 / Complete Radicals - Group 1",
        "description": "Practice common radicals (1-30 of 214 Kangxi radicals)",
        "hasAudio": True,
        "characters": [
            {
                "character": "一",
                "pinyin": "yī",
                "meaning": "one",
                "stroke_count": 1,
                "stroke_order": "horizontal",
                "frequency_rank": 1,
                "example_words": "一个 (yī gè, one), 一起 (yī qǐ, together)"
            },
            {
                "character": "丨",
                "pinyin": "gǔn",
                "meaning": "vertical line",
                "stroke_count": 1,
                "stroke_order": "vertical",
                "frequency_rank": 2,
                "example_words": "中 (zhōng, middle), 丽 (lì, beautiful)"
            },
            {
                "character": "丶",
                "pinyin": "diǎn",
                "meaning": "dot",
                "stroke_count": 1,
                "stroke_order": "dot",
                "frequency_rank": 3,
                "example_words": "主 (zhǔ, master), 玉 (yù, jade)"
            },
            {
                "character": "丿",
                "pinyin": "piě",
                "meaning": "slash",
                "stroke_count": 1,
                "stroke_order": "slash",
                "frequency_rank": 4,
                "example_words": "人 (rén, person), 入 (rù, enter)"
            },
            {
                "character": "乙",
                "pinyin": "yǐ",
                "meaning": "second, twist",
                "stroke_count": 1,
                "stroke_order": "hook",
                "frequency_rank": 5,
                "example_words": "乙方 (yǐ fāng, party B), 乙醇 (yǐ chún, ethanol)"
            },
            {
                "character": "亅",
                "pinyin": "jué",
                "meaning": "hook",
                "stroke_count": 1,
                "stroke_order": "hook",
                "frequency_rank": 6,
                "example_words": "了 (le, particle), 事 (shì, matter)"
            },
            {
                "character": "二",
                "pinyin": "èr",
                "meaning": "two",
                "stroke_count": 2,
                "stroke_order": "top horizontal, bottom horizontal",
                "frequency_rank": 7,
                "example_words": "二月 (èr yuè, February), 二手 (èr shǒu, second-hand)"
            },
            {
                "character": "亠",
                "pinyin": "tóu",
                "meaning": "lid",
                "stroke_count": 2,
                "stroke_order": "horizontal, vertical",
                "frequency_rank": 8,
                "example_words": "京 (jīng, capital), 亡 (wáng, die)"
            },
            {
                "character": "人",
                "pinyin": "rén",
                "meaning": "person",
                "stroke_count": 2,
                "stroke_order": "left diagonal, right diagonal",
                "frequency_rank": 9,
                "example_words": "人民 (rén mín, people), 人口 (rén kǒu, population)"
            },
            {
                "character": "儿",
                "pinyin": "ér",
                "meaning": "legs",
                "stroke_count": 2,
                "stroke_order": "left diagonal, right diagonal",
                "frequency_rank": 10,
                "example_words": "兄 (xiōng, elder brother), 元 (yuán, origin)"
            }
        ],
        "practice_template": "Write each radical 5 times, paying attention to stroke order:\n\n{character}: _ _ _ _ _"
    },
    "Complete Radicals - Group 2": {
        "title": "完整部首 - 第二组 / Complete Radicals - Group 2",
        "description": "Practice common radicals (31-60 of 214 Kangxi radicals)",
        "hasAudio": True,
        "characters": [
            {
                "character": "入",
                "pinyin": "rù",
                "meaning": "enter",
                "stroke_count": 2,
                "stroke_order": "left diagonal, right diagonal",
                "frequency_rank": 11,
                "example_words": "入口 (rù kǒu, entrance), 入学 (rù xué, enter school)"
            },
            {
                "character": "八",
                "pinyin": "bā",
                "meaning": "eight",
                "stroke_count": 2,
                "stroke_order": "left diagonal, right diagonal",
                "frequency_rank": 12,
                "example_words": "八月 (bā yuè, August), 八卦 (bā guà, Eight Trigrams)"
            },
            {
                "character": "冂",
                "pinyin": "jiōng",
                "meaning": "down box",
                "stroke_count": 2,
                "stroke_order": "top horizontal, vertical with bottom horizontal",
                "frequency_rank": 13,
                "example_words": "冈 (gāng, ridge), 冉 (rǎn, gradually)"
            },
            {
                "character": "冖",
                "pinyin": "mì",
                "meaning": "cover",
                "stroke_count": 2,
                "stroke_order": "top horizontal, vertical with bottom horizontal",
                "frequency_rank": 14,
                "example_words": "写 (xiě, write), 军 (jūn, army)"
            },
            {
                "character": "冫",
                "pinyin": "bīng",
                "meaning": "ice",
                "stroke_count": 2,
                "stroke_order": "left dot, right dot",
                "frequency_rank": 15,
                "example_words": "冰 (bīng, ice), 冷 (lěng, cold)"
            },
            {
                "character": "几",
                "pinyin": "jī",
                "meaning": "table",
                "stroke_count": 2,
                "stroke_order": "horizontal, curved hook",
                "frequency_rank": 16,
                "example_words": "几乎 (jī hū, almost), 机 (jī, machine)"
            },
            {
                "character": "凵",
                "pinyin": "kǎn",
                "meaning": "open box",
                "stroke_count": 2,
                "stroke_order": "left vertical, right vertical with bottom horizontal",
                "frequency_rank": 17,
                "example_words": "凶 (xiōng, fierce), 出 (chū, exit)"
            },
            {
                "character": "刀",
                "pinyin": "dāo",
                "meaning": "knife",
                "stroke_count": 2,
                "stroke_order": "horizontal, curved hook",
                "frequency_rank": 18,
                "example_words": "刀子 (dāo zi, knife), 分 (fēn, divide)"
            },
            {
                "character": "力",
                "pinyin": "lì",
                "meaning": "power",
                "stroke_count": 2,
                "stroke_order": "left diagonal, right hook",
                "frequency_rank": 19,
                "example_words": "力量 (lì liàng, strength), 努力 (nǔ lì, try hard)"
            },
            {
                "character": "勹",
                "pinyin": "bāo",
                "meaning": "wrap",
                "stroke_count": 2,
                "stroke_order": "dot, curved hook",
                "frequency_rank": 20,
                "example_words": "包 (bāo, package), 勺 (sháo, spoon)"
            }
        ],
        "practice_template": "Write each radical 5 times, paying attention to stroke order:\n\n{character}: _ _ _ _ _"
    },
    "Complete Radicals - Group 3": {
        "title": "完整部首 - 第三组 / Complete Radicals - Group 3",
        "description": "Practice common radicals (61-90 of 214 Kangxi radicals)",
        "hasAudio": True,
        "characters": [
            {
                "character": "匕",
                "pinyin": "bǐ",
                "meaning": "spoon",
                "stroke_count": 2,
                "stroke_order": "horizontal, vertical hook",
                "frequency_rank": 21,
                "example_words": "化 (huà, change), 比 (bǐ, compare)"
            },
            {
                "character": "匚",
                "pinyin": "fāng",
                "meaning": "right open box",
                "stroke_count": 2,
                "stroke_order": "top horizontal, vertical with bottom horizontal",
                "frequency_rank": 22,
                "example_words": "区 (qū, area), 医 (yī, medicine)"
            },
            {
                "character": "匸",
                "pinyin": "xì",
                "meaning": "hiding enclosure",
                "stroke_count": 2,
                "stroke_order": "top horizontal, vertical with bottom horizontal",
                "frequency_rank": 23,
                "example_words": "匿 (nì, hide), 匹 (pǐ, measure word)"
            },
            {
                "character": "十",
                "pinyin": "shí",
                "meaning": "ten",
                "stroke_count": 2,
                "stroke_order": "horizontal, vertical",
                "frequency_rank": 24,
                "example_words": "十月 (shí yuè, October), 十分 (shí fēn, very)"
            },
            {
                "character": "卜",
                "pinyin": "bǔ",
                "meaning": "divination",
                "stroke_count": 2,
                "stroke_order": "dot, vertical",
                "frequency_rank": 25,
                "example_words": "占卜 (zhān bǔ, fortune telling), 卦 (guà, trigram)"
            },
            {
                "character": "卩",
                "pinyin": "jié",
                "meaning": "seal",
                "stroke_count": 2,
                "stroke_order": "vertical, hook",
                "frequency_rank": 26,
                "example_words": "节 (jié, festival), 印 (yìn, print)"
            },
            {
                "character": "厂",
                "pinyin": "hǎn",
                "meaning": "cliff",
                "stroke_count": 2,
                "stroke_order": "horizontal, vertical",
                "frequency_rank": 27,
                "example_words": "厂房 (chǎng fáng, factory building), 厅 (tīng, hall)"
            },
            {
                "character": "厶",
                "pinyin": "sī",
                "meaning": "private",
                "stroke_count": 2,
                "stroke_order": "horizontal, hook",
                "frequency_rank": 28,
                "example_words": "私 (sī, private), 公 (gōng, public)"
            },
            {
                "character": "又",
                "pinyin": "yòu",
                "meaning": "again",
                "stroke_count": 2,
                "stroke_order": "horizontal, hook",
                "frequency_rank": 29,
                "example_words": "又见 (yòu jiàn, see again), 友 (yǒu, friend)"
            },
            {
                "character": "口",
                "pinyin": "kǒu",
                "meaning": "mouth",
                "stroke_count": 3,
                "stroke_order": "top, right, bottom-left",
                "frequency_rank": 30,
                "example_words": "口语 (kǒu yǔ, spoken language), 出口 (chū kǒu, exit)"
            }
        ],
        "practice_template": "Write each radical 5 times, paying attention to stroke order:\n\n{character}: _ _ _ _ _"
    },
    "HSK1 - Essential": {
        "title": "HSK1 基础汉字 / HSK1 Essential Characters",
        "description": "Practice the most common characters from HSK Level 1",
        "hasAudio": True,
        "characters": [
            {
                "character": "我",
                "pinyin": "wǒ",
                "meaning": "I, me",
                "stroke_count": 7,
                "stroke_order": "horizontal, vertical, horizontal, vertical, horizontal, vertical, horizontal",
                "frequency_rank": 1,
                "example_words": "我们 (wǒ men, we), 我的 (wǒ de, my)"
            },
            {
                "character": "你",
                "pinyin": "nǐ",
                "meaning": "you",
                "stroke_count": 7,
                "stroke_order": "left diagonal, right diagonal, dot, horizontal, vertical, horizontal, vertical",
                "frequency_rank": 2,
                "example_words": "你好 (nǐ hǎo, hello), 你们 (nǐ men, you all)"
            },
            {
                "character": "他",
                "pinyin": "tā",
                "meaning": "he",
                "stroke_count": 5,
                "stroke_order": "left diagonal, right diagonal, horizontal, vertical, horizontal",
                "frequency_rank": 3,
                "example_words": "他们 (tā men, they), 他的 (tā de, his)"
            },
            {
                "character": "她",
                "pinyin": "tā",
                "meaning": "she",
                "stroke_count": 6,
                "stroke_order": "horizontal, vertical, horizontal, left diagonal, right diagonal, horizontal",
                "frequency_rank": 4,
                "example_words": "她们 (tā men, they - female), 她的 (tā de, her)"
            },
            {
                "character": "是",
                "pinyin": "shì",
                "meaning": "to be",
                "stroke_count": 9,
                "stroke_order": "horizontal, horizontal, horizontal, vertical, horizontal, vertical, horizontal, vertical, horizontal",
                "frequency_rank": 5,
                "example_words": "是的 (shì de, yes), 不是 (bú shì, is not)"
            },
            {
                "character": "不",
                "pinyin": "bù",
                "meaning": "no, not",
                "stroke_count": 4,
                "stroke_order": "horizontal, dot, horizontal, vertical",
                "frequency_rank": 6,
                "example_words": "不要 (bú yào, don't), 不好 (bù hǎo, not good)"
            },
            {
                "character": "好",
                "pinyin": "hǎo",
                "meaning": "good",
                "stroke_count": 6,
                "stroke_order": "horizontal, vertical, horizontal, left diagonal, right diagonal, horizontal",
                "frequency_rank": 7,
                "example_words": "你好 (nǐ hǎo, hello), 好吃 (hǎo chī, delicious)"
            },
            {
                "character": "人",
                "pinyin": "rén",
                "meaning": "person",
                "stroke_count": 2,
                "stroke_order": "left diagonal, right diagonal",
                "frequency_rank": 8,
                "example_words": "人民 (rén mín, people), 中国人 (zhōng guó rén, Chinese person)"
            },
            {
                "character": "名",
                "pinyin": "míng",
                "meaning": "name",
                "stroke_count": 6,
                "stroke_order": "vertical, horizontal, vertical, horizontal, left diagonal, right diagonal",
                "frequency_rank": 9,
                "example_words": "名字 (míng zi, name), 有名 (yǒu míng, famous)"
            },
            {
                "character": "什",
                "pinyin": "shén",
                "meaning": "what",
                "stroke_count": 4,
                "stroke_order": "left diagonal, right diagonal, horizontal, vertical",
                "frequency_rank": 10,
                "example_words": "什么 (shén me, what), 为什么 (wèi shén me, why)"
            }
        ],
        "practice_template": "Write each character 5 times, paying attention to stroke order:\n\n{character}: _ _ _ _ _"
    },
    "HSK2 - Basic": {
        "title": "HSK2 基础汉字 / HSK2 Basic Characters",
        "description": "Practice common characters from HSK Level 2",
        "hasAudio": True,
        "characters": [
            {
                "character": "学",
                "pinyin": "xué",
                "meaning": "to learn",
                "stroke_count": 8,
                "stroke_order": "top, left vertical, right vertical, horizontal, left diagonal, right diagonal, horizontal, vertical",
                "frequency_rank": 11,
                "example_words": "学习 (xué xí, to study), 学生 (xué sheng, student)"
            },
            {
                "character": "生",
                "pinyin": "shēng",
                "meaning": "to be born, life",
                "stroke_count": 5,
                "stroke_order": "horizontal, vertical, horizontal, left diagonal, right diagonal",
                "frequency_rank": 12,
                "example_words": "学生 (xué sheng, student), 生活 (shēng huó, life)"
            },
            {
                "character": "工",
                "pinyin": "gōng",
                "meaning": "work",
                "stroke_count": 3,
                "stroke_order": "horizontal, vertical, horizontal",
                "frequency_rank": 13,
                "example_words": "工作 (gōng zuò, work), 工人 (gōng rén, worker)"
            },
            {
                "character": "作",
                "pinyin": "zuò",
                "meaning": "to do",
                "stroke_count": 7,
                "stroke_order": "left diagonal, right diagonal, horizontal, vertical, horizontal, vertical, horizontal",
                "frequency_rank": 14,
                "example_words": "工作 (gōng zuò, work), 作业 (zuò yè, homework)"
            },
            {
                "character": "朋",
                "pinyin": "péng",
                "meaning": "friend",
                "stroke_count": 8,
                "stroke_order": "horizontal, vertical, horizontal, vertical, horizontal, vertical, horizontal, vertical",
                "frequency_rank": 15,
                "example_words": "朋友 (péng you, friend), 好朋友 (hǎo péng you, good friend)"
            },
            {
                "character": "友",
                "pinyin": "yǒu",
                "meaning": "friend",
                "stroke_count": 4,
                "stroke_order": "left diagonal, right diagonal, horizontal, vertical",
                "frequency_rank": 16,
                "example_words": "朋友 (péng you, friend), 友好 (yǒu hǎo, friendly)"
            },
            {
                "character": "明",
                "pinyin": "míng",
                "meaning": "bright",
                "stroke_count": 8,
                "stroke_order": "horizontal, vertical, horizontal, vertical, left diagonal, right diagonal, left diagonal, right diagonal",
                "frequency_rank": 17,
                "example_words": "明天 (míng tiān, tomorrow), 明白 (míng bai, understand)"
            },
            {
                "character": "天",
                "pinyin": "tiān",
                "meaning": "day, sky",
                "stroke_count": 4,
                "stroke_order": "horizontal, vertical, left diagonal, right diagonal",
                "frequency_rank": 18,
                "example_words": "今天 (jīn tiān, today), 天气 (tiān qì, weather)"
            },
            {
                "character": "气",
                "pinyin": "qì",
                "meaning": "air, gas",
                "stroke_count": 4,
                "stroke_order": "horizontal, vertical, left diagonal, right diagonal",
                "frequency_rank": 19,
                "example_words": "天气 (tiān qì, weather), 生气 (shēng qì, angry)"
            },
            {
                "character": "很",
                "pinyin": "hěn",
                "meaning": "very",
                "stroke_count": 9,
                "stroke_order": "horizontal, vertical, horizontal, vertical, horizontal, vertical, horizontal, vertical, horizontal",
                "frequency_rank": 20,
                "example_words": "很好 (hěn hǎo, very good), 很多 (hěn duō, many)"
            }
        ],
        "practice_template": "Write each character 5 times, paying attention to stroke order:\n\n{character}: _ _ _ _ _"
    },
    "Theme - Family": {
        "title": "主题 - 家庭 / Theme - Family",
        "description": "Practice characters related to family members and relationships",
        "hasAudio": True,
        "characters": [
            {
                "character": "家",
                "pinyin": "jiā",
                "meaning": "home, family",
                "stroke_count": 10,
                "stroke_order": "top, left vertical, right vertical, horizontal, left diagonal, right diagonal, horizontal, vertical, horizontal, vertical",
                "frequency_rank": 21,
                "example_words": "家人 (jiā rén, family members), 回家 (huí jiā, go home)"
            },
            {
                "character": "爸",
                "pinyin": "bà",
                "meaning": "father",
                "stroke_count": 9,
                "stroke_order": "horizontal, vertical, horizontal, vertical, horizontal, vertical, horizontal, vertical, horizontal",
                "frequency_rank": 22,
                "example_words": "爸爸 (bà ba, dad), 父亲 (fù qīn, father)"
            },
            {
                "character": "妈",
                "pinyin": "mā",
                "meaning": "mother",
                "stroke_count": 6,
                "stroke_order": "horizontal, vertical, horizontal, left diagonal, right diagonal, horizontal",
                "frequency_rank": 23,
                "example_words": "妈妈 (mā ma, mom), 母亲 (mǔ qīn, mother)"
            },
            {
                "character": "哥",
                "pinyin": "gē",
                "meaning": "older brother",
                "stroke_count": 10,
                "stroke_order": "top, right, bottom-left, horizontal, vertical, horizontal, vertical, horizontal, vertical, horizontal",
                "frequency_rank": 24,
                "example_words": "哥哥 (gē ge, older brother), 大哥 (dà gē, eldest brother)"
            },
            {
                "character": "姐",
                "pinyin": "jiě",
                "meaning": "older sister",
                "stroke_count": 8,
                "stroke_order": "horizontal, vertical, horizontal, left diagonal, right diagonal, horizontal, vertical, horizontal",
                "frequency_rank": 25,
                "example_words": "姐姐 (jiě jie, older sister), 大姐 (dà jiě, eldest sister)"
            },
            {
                "character": "弟",
                "pinyin": "dì",
                "meaning": "younger brother",
                "stroke_count": 7,
                "stroke_order": "horizontal, vertical, horizontal, vertical, horizontal, vertical, horizontal",
                "frequency_rank": 26,
                "example_words": "弟弟 (dì di, younger brother), 小弟 (xiǎo dì, little brother)"
            },
            {
                "character": "妹",
                "pinyin": "mèi",
                "meaning": "younger sister",
                "stroke_count": 8,
                "stroke_order": "horizontal, vertical, horizontal, left diagonal, right diagonal, horizontal, vertical, horizontal",
                "frequency_rank": 27,
                "example_words": "妹妹 (mèi mei, younger sister), 小妹 (xiǎo mèi, little sister)"
            },
            {
                "character": "儿",
                "pinyin": "ér",
                "meaning": "son, child",
                "stroke_count": 2,
                "stroke_order": "left diagonal, right diagonal",
                "frequency_rank": 28,
                "example_words": "儿子 (ér zi, son), 孩儿 (hái er, child)"
            },
            {
                "character": "女",
                "pinyin": "nǚ",
                "meaning": "female, daughter",
                "stroke_count": 3,
                "stroke_order": "left diagonal, right diagonal, horizontal",
                "frequency_rank": 29,
                "example_words": "女儿 (nǚ ér, daughter), 女人 (nǚ rén, woman)"
            },
            {
                "character": "爱",
                "pinyin": "ài",
                "meaning": "love",
                "stroke_count": 10,
                "stroke_order": "horizontal, vertical, horizontal, vertical, horizontal, vertical, horizontal, vertical, horizontal, vertical",
                "frequency_rank": 30,
                "example_words": "爱情 (ài qíng, love), 爱人 (ài rén, spouse)"
            }
        ],
        "practice_template": "Write each character 5 times, paying attention to stroke order:\n\n{character}: _ _ _ _ _"
    },
    "HSK3 - Intermediate": {
        "title": "HSK3 中级汉字 / HSK3 Intermediate Characters",
        "description": "Practice intermediate characters from HSK Level 3",
        "hasAudio": True,
        "characters": [
            {
                "character": "因",
                "pinyin": "yīn",
                "meaning": "because",
                "stroke_count": 6,
                "stroke_order": "top, left vertical, right vertical, horizontal, left diagonal, right diagonal",
                "frequency_rank": 31,
                "example_words": "因为 (yīn wèi, because), 原因 (yuán yīn, reason)"
            },
            {
                "character": "所",
                "pinyin": "suǒ",
                "meaning": "place",
                "stroke_count": 8,
                "stroke_order": "horizontal, vertical, horizontal, vertical, horizontal, vertical, horizontal, vertical",
                "frequency_rank": 32,
                "example_words": "所以 (suǒ yǐ, so), 厕所 (cè suǒ, toilet)"
            },
            {
                "character": "以",
                "pinyin": "yǐ",
                "meaning": "by means of",
                "stroke_count": 5,
                "stroke_order": "horizontal, vertical, horizontal, left diagonal, right diagonal",
                "frequency_rank": 33,
                "example_words": "所以 (suǒ yǐ, so), 可以 (kě yǐ, can)"
            },
            {
                "character": "但",
                "pinyin": "dàn",
                "meaning": "but",
                "stroke_count": 7,
                "stroke_order": "left diagonal, right diagonal, horizontal, vertical, horizontal, vertical, horizontal",
                "frequency_rank": 34,
                "example_words": "但是 (dàn shì, but), 但是 (dàn shì, however)"
            },
            {
                "character": "现",
                "pinyin": "xiàn",
                "meaning": "present, now",
                "stroke_count": 8,
                "stroke_order": "horizontal, vertical, horizontal, vertical, horizontal, vertical, horizontal, vertical",
                "frequency_rank": 35,
                "example_words": "现在 (xiàn zài, now), 发现 (fā xiàn, discover)"
            },
            {
                "character": "在",
                "pinyin": "zài",
                "meaning": "at, in",
                "stroke_count": 6,
                "stroke_order": "horizontal, vertical, horizontal, vertical, horizontal, vertical",
                "frequency_rank": 36,
                "example_words": "现在 (xiàn zài, now), 在家 (zài jiā, at home)"
            },
            {
                "character": "做",
                "pinyin": "zuò",
                "meaning": "to do",
                "stroke_count": 11,
                "stroke_order": "left diagonal, right diagonal, horizontal, vertical, horizontal, vertical, horizontal, vertical, horizontal, vertical, horizontal",
                "frequency_rank": 37,
                "example_words": "做饭 (zuò fàn, cook), 做事 (zuò shì, do things)"
            },
            {
                "character": "得",
                "pinyin": "dé",
                "meaning": "to get",
                "stroke_count": 11,
                "stroke_order": "horizontal, vertical, horizontal, vertical, horizontal, vertical, horizontal, vertical, horizontal, vertical, horizontal",
                "frequency_rank": 38,
                "example_words": "得到 (dé dào, obtain), 值得 (zhí dé, worth)"
            },
            {
                "character": "和",
                "pinyin": "hé",
                "meaning": "and",
                "stroke_count": 8,
                "stroke_order": "horizontal, vertical, horizontal, vertical, horizontal, vertical, horizontal, vertical",
                "frequency_rank": 39,
                "example_words": "和平 (hé píng, peace), 和谐 (hé xié, harmony)"
            },
            {
                "character": "时",
                "pinyin": "shí",
                "meaning": "time",
                "stroke_count": 10,
                "stroke_order": "horizontal, vertical, horizontal, vertical, horizontal, vertical, horizontal, vertical, horizontal, vertical",
                "frequency_rank": 40,
                "example_words": "时间 (shí jiān, time), 小时 (xiǎo shí, hour)"
            }
        ],
        "practice_template": "Write each character 5 times, paying attention to stroke order:\n\n{character}: _ _ _ _ _"
    },
    "Theme - Food": {
        "title": "主题 - 食物 / Theme - Food",
        "description": "Practice characters related to food and dining",
        "hasAudio": True,
        "characters": [
            {
                "character": "吃",
                "pinyin": "chī",
                "meaning": "to eat",
                "stroke_count": 6,
                "stroke_order": "top, right, bottom-left, horizontal, vertical, horizontal",
                "frequency_rank": 41,
                "example_words": "吃饭 (chī fàn, eat a meal), 好吃 (hǎo chī, delicious)"
            },
            {
                "character": "饭",
                "pinyin": "fàn",
                "meaning": "rice, meal",
                "stroke_count": 7,
                "stroke_order": "left vertical, right vertical, horizontal, vertical, horizontal, vertical, horizontal",
                "frequency_rank": 42,
                "example_words": "吃饭 (chī fàn, eat a meal), 米饭 (mǐ fàn, cooked rice)"
            },
            {
                "character": "菜",
                "pinyin": "cài",
                "meaning": "dish, vegetable",
                "stroke_count": 11,
                "stroke_order": "top, left vertical, right vertical, horizontal, vertical, horizontal, vertical, horizontal, vertical, horizontal, vertical",
                "frequency_rank": 43,
                "example_words": "菜单 (cài dān, menu), 蔬菜 (shū cài, vegetables)"
            },
            {
                "character": "米",
                "pinyin": "mǐ",
                "meaning": "rice",
                "stroke_count": 6,
                "stroke_order": "top, left vertical, right vertical, horizontal, left diagonal, right diagonal",
                "frequency_rank": 44,
                "example_words": "米饭 (mǐ fàn, cooked rice), 米粉 (mǐ fěn, rice noodles)"
            },
            {
                "character": "面",
                "pinyin": "miàn",
                "meaning": "noodle, face",
                "stroke_count": 9,
                "stroke_order": "horizontal, vertical, horizontal, vertical, horizontal, vertical, horizontal, vertical, horizontal",
                "frequency_rank": 45,
                "example_words": "面条 (miàn tiáo, noodles), 面包 (miàn bāo, bread)"
            },
            {
                "character": "茶",
                "pinyin": "chá",
                "meaning": "tea",
                "stroke_count": 9,
                "stroke_order": "top, left vertical, right vertical, horizontal, vertical, horizontal, vertical, horizontal, vertical",
                "frequency_rank": 46,
                "example_words": "茶叶 (chá yè, tea leaves), 绿茶 (lǜ chá, green tea)"
            },
            {
                "character": "水",
                "pinyin": "shuǐ",
                "meaning": "water",
                "stroke_count": 4,
                "stroke_order": "left dot, right dot, left diagonal, right diagonal",
                "frequency_rank": 47,
                "example_words": "水果 (shuǐ guǒ, fruit), 饮水 (yǐn shuǐ, drinking water)"
            },
            {
                "character": "果",
                "pinyin": "guǒ",
                "meaning": "fruit",
                "stroke_count": 8,
                "stroke_order": "horizontal, vertical, horizontal, vertical, horizontal, vertical, horizontal, vertical",
                "frequency_rank": 48,
                "example_words": "水果 (shuǐ guǒ, fruit), 苹果 (píng guǒ, apple)"
            },
            {
                "character": "鱼",
                "pinyin": "yú",
                "meaning": "fish",
                "stroke_count": 8,
                "stroke_order": "horizontal, vertical, horizontal, vertical, horizontal, vertical, horizontal, vertical",
                "frequency_rank": 49,
                "example_words": "鱼肉 (yú ròu, fish meat), 金鱼 (jīn yú, goldfish)"
            },
            {
                "character": "肉",
                "pinyin": "ròu",
                "meaning": "meat",
                "stroke_count": 6,
                "stroke_order": "horizontal, vertical, horizontal, vertical, horizontal, vertical",
                "frequency_rank": 50,
                "example_words": "牛肉 (niú ròu, beef), 猪肉 (zhū ròu, pork)"
            }
        ],
        "practice_template": "Write each character 5 times, paying attention to stroke order:\n\n{character}: _ _ _ _ _"
    },
    "Theme - Travel": {
        "title": "主题 - 旅行 / Theme - Travel",
        "description": "Practice characters related to travel and transportation",
        "hasAudio": True,
        "characters": [
            {
                "character": "车",
                "pinyin": "chē",
                "meaning": "car, vehicle",
                "stroke_count": 4,
                "stroke_order": "horizontal, vertical, horizontal, vertical",
                "frequency_rank": 51,
                "example_words": "汽车 (qì chē, car), 火车 (huǒ chē, train)"
            },
            {
                "character": "飞",
                "pinyin": "fēi",
                "meaning": "to fly",
                "stroke_count": 9,
                "stroke_order": "horizontal, vertical, horizontal, vertical, horizontal, vertical, horizontal, vertical, horizontal",
                "frequency_rank": 52,
                "example_words": "飞机 (fēi jī, airplane), 飞行 (fēi xíng, flight)"
            },
            {
                "character": "机",
                "pinyin": "jī",
                "meaning": "machine",
                "stroke_count": 6,
                "stroke_order": "horizontal, vertical, horizontal, vertical, horizontal, vertical",
                "frequency_rank": 53,
                "example_words": "飞机 (fēi jī, airplane), 手机 (shǒu jī, mobile phone)"
            },
            {
                "character": "场",
                "pinyin": "chǎng",
                "meaning": "field, place",
                "stroke_count": 12,
                "stroke_order": "horizontal, vertical, horizontal, vertical, horizontal, vertical, horizontal, vertical, horizontal, vertical, horizontal, vertical",
                "frequency_rank": 54,
                "example_words": "机场 (jī chǎng, airport), 广场 (guǎng chǎng, square)"
            },
            {
                "character": "路",
                "pinyin": "lù",
                "meaning": "road",
                "stroke_count": 13,
                "stroke_order": "horizontal, vertical, horizontal, vertical, horizontal, vertical, horizontal, vertical, horizontal, vertical, horizontal, vertical, horizontal",
                "frequency_rank": 55,
                "example_words": "道路 (dào lù, road), 马路 (mǎ lù, street)"
            },
            {
                "character": "站",
                "pinyin": "zhàn",
                "meaning": "station",
                "stroke_count": 10,
                "stroke_order": "horizontal, vertical, horizontal, vertical, horizontal, vertical, horizontal, vertical, horizontal, vertical",
                "frequency_rank": 56,
                "example_words": "车站 (chē zhàn, station), 站台 (zhàn tái, platform)"
            },
            {
                "character": "票",
                "pinyin": "piào",
                "meaning": "ticket",
                "stroke_count": 11,
                "stroke_order": "horizontal, vertical, horizontal, vertical, horizontal, vertical, horizontal, vertical, horizontal, vertical, horizontal",
                "frequency_rank": 57,
                "example_words": "机票 (jī piào, air ticket), 车票 (chē piào, train ticket)"
            },
            {
                "character": "行",
                "pinyin": "xíng",
                "meaning": "to go, travel",
                "stroke_count": 6,
                "stroke_order": "horizontal, vertical, horizontal, vertical, horizontal, vertical",
                "frequency_rank": 58,
                "example_words": "旅行 (lǚ xíng, travel), 行李 (xíng li, luggage)"
            },
            {
                "character": "李",
                "pinyin": "lǐ",
                "meaning": "plum, surname Li",
                "stroke_count": 7,
                "stroke_order": "horizontal, vertical, horizontal, vertical, horizontal, vertical, horizontal",
                "frequency_rank": 59,
                "example_words": "行李 (xíng li, luggage), 李子 (lǐ zi, plum)"
            },
            {
                "character": "国",
                "pinyin": "guó",
                "meaning": "country",
                "stroke_count": 8,
                "stroke_order": "top, left vertical, right vertical, horizontal, vertical, horizontal, vertical, horizontal",
                "frequency_rank": 60,
                "example_words": "中国 (zhōng guó, China), 外国 (wài guó, foreign country)"
            }
        ],
        "practice_template": "Write each character 5 times, paying attention to stroke order:\n\n{character}: _ _ _ _ _"
    }
}

# Sentence Completion
sentence_completion = {
    "Beginner": {
        "title": "初级句子完成 / Beginner Sentence Completion",
        "description": "Complete sentences with appropriate words",
        "exercises": [
            {
                "prompt": "我 ____ 中文。(study)",
                "answer": "学习",
                "pinyin": "xuéxí",
                "full_sentence": "我学习中文。",
                "full_sentence_en": "I study Chinese."
            },
            {
                "prompt": "他 ____ 咖啡。(drink)",
                "answer": "喝",
                "pinyin": "hē",
                "full_sentence": "他喝咖啡。",
                "full_sentence_en": "He drinks coffee."
            },
            {
                "prompt": "我们 ____ 去北京。(want)",
                "answer": "想",
                "pinyin": "xiǎng",
                "full_sentence": "我们想去北京。",
                "full_sentence_en": "We want to go to Beijing."
            },
            {
                "prompt": "她 ____ 看书。(like)",
                "answer": "喜欢",
                "pinyin": "xǐhuan",
                "full_sentence": "她喜欢看书。",
                "full_sentence_en": "She likes to read books."
            },
            {
                "prompt": "你 ____ 多少岁？(be)",
                "answer": "是",
                "pinyin": "shì",
                "full_sentence": "你是多少岁？",
                "full_sentence_en": "How old are you?"
            }
        ]
    },
    "Intermediate": {
        "title": "中级句子完成 / Intermediate Sentence Completion",
        "description": "Complete sentences with appropriate words or phrases",
        "exercises": [
            {
                "prompt": "如果明天 ____ ，我们就去公园。(good weather)",
                "answer": "天气好",
                "pinyin": "tiānqì hǎo",
                "full_sentence": "如果明天天气好，我们就去公园。",
                "full_sentence_en": "If the weather is good tomorrow, we will go to the park."
            },
            {
                "prompt": "虽然很难，但是我 ____ 学好中文。(determined)",
                "answer": "决心",
                "pinyin": "juéxīn",
                "full_sentence": "虽然很难，但是我决心学好中文。",
                "full_sentence_en": "Although it's difficult, I am determined to learn Chinese well."
            },
            {
                "prompt": "我不但会说中文，____ 会说英文。(but also)",
                "answer": "而且",
                "pinyin": "érqiě",
                "full_sentence": "我不但会说中文，而且会说英文。",
                "full_sentence_en": "I can not only speak Chinese, but also English."
            },
            {
                "prompt": "他 ____ 我去机场。(help)",
                "answer": "帮助",
                "pinyin": "bāngzhù",
                "full_sentence": "他帮助我去机场。",
                "full_sentence_en": "He helped me go to the airport."
            },
            {
                "prompt": "这本书 ____ 有意思。(very)",
                "answer": "非常",
                "pinyin": "fēicháng",
                "full_sentence": "这本书非常有意思。",
                "full_sentence_en": "This book is very interesting."
            }
        ]
    },
    "Advanced": {
        "title": "高级句子完成 / Advanced Sentence Completion",
        "description": "Complete sentences with appropriate words or phrases",
        "exercises": [
            {
                "prompt": "环境保护 ____ 全球关注的重要话题。(become)",
                "answer": "已经成为",
                "pinyin": "yǐjīng chéngwéi",
                "full_sentence": "环境保护已经成为全球关注的重要话题。",
                "full_sentence_en": "Environmental protection has become an important topic of global concern."
            },
            {
                "prompt": "随着经济的发展，人们的生活水平 ____ 。(improve)",
                "answer": "不断提高",
                "pinyin": "bùduàn tígāo",
                "full_sentence": "随着经济的发展，人们的生活水平不断提高。",
                "full_sentence_en": "With the development of the economy, people's living standards are constantly improving."
            },
            {
                "prompt": "尽管面临挑战，他们 ____ 取得了成功。(still)",
                "answer": "仍然",
                "pinyin": "réngrán",
                "full_sentence": "尽管面临挑战，他们仍然取得了成功。",
                "full_sentence_en": "Despite facing challenges, they still achieved success."
            },
            {
                "prompt": "这个问题 ____ 进一步研究。(need)",
                "answer": "需要",
                "pinyin": "xūyào",
                "full_sentence": "这个问题需要进一步研究。",
                "full_sentence_en": "This issue needs further research."
            },
            {
                "prompt": "我们应该 ____ 自然资源。(protect)",
                "answer": "保护",
                "pinyin": "bǎohù",
                "full_sentence": "我们应该保护自然资源。",
                "full_sentence_en": "We should protect natural resources."
            }
        ]
    }
}

# Translation Exercises
translation_exercises = {
    "Beginner": {
        "title": "初级翻译练习 / Beginner Translation Exercises",
        "description": "Translate simple sentences between English and Chinese",
        "exercises": [
            {
                "en": "My name is Li Ming.",
                "zh": "我叫李明。",
                "pinyin": "Wǒ jiào Lǐ Míng."
            },
            {
                "en": "I am a student.",
                "zh": "我是学生。",
                "pinyin": "Wǒ shì xuésheng."
            },
            {
                "en": "I like to eat Chinese food.",
                "zh": "我喜欢吃中国菜。",
                "pinyin": "Wǒ xǐhuan chī zhōngguó cài."
            },
            {
                "en": "Where is the bathroom?",
                "zh": "洗手间在哪里？",
                "pinyin": "Xǐshǒujiān zài nǎlǐ?"
            },
            {
                "en": "How much does this cost?",
                "zh": "这个多少钱？",
                "pinyin": "Zhège duōshao qián?"
            }
        ]
    },
    "Intermediate": {
        "title": "中级翻译练习 / Intermediate Translation Exercises",
        "description": "Translate more complex sentences between English and Chinese",
        "exercises": [
            {
                "en": "I have been studying Chinese for three years.",
                "zh": "我学习中文已经三年了。",
                "pinyin": "Wǒ xuéxí zhōngwén yǐjīng sān nián le."
            },
            {
                "en": "Although it's difficult, I enjoy learning Chinese.",
                "zh": "虽然很难，但是我喜欢学习中文。",
                "pinyin": "Suīrán hěn nán, dànshì wǒ xǐhuan xuéxí zhōngwén."
            },
            {
                "en": "Could you please speak more slowly?",
                "zh": "你能说得慢一点吗？",
                "pinyin": "Nǐ néng shuō de màn yīdiǎn ma?"
            },
            {
                "en": "I plan to travel to China next year.",
                "zh": "我计划明年去中国旅行。",
                "pinyin": "Wǒ jìhuà míngnián qù zhōngguó lǚxíng."
            },
            {
                "en": "What's your favorite Chinese dish?",
                "zh": "你最喜欢的中国菜是什么？",
                "pinyin": "Nǐ zuì xǐhuan de zhōngguó cài shì shénme?"
            }
        ]
    },
    "Advanced": {
        "title": "高级翻译练习 / Advanced Translation Exercises",
        "description": "Translate complex sentences and paragraphs between English and Chinese",
        "exercises": [
            {
                "en": "The rapid development of technology has greatly changed our way of life.",
                "zh": "科技的快速发展极大地改变了我们的生活方式。",
                "pinyin": "Kējì de kuàisù fāzhǎn jídà de gǎibiànle wǒmen de shēnghuó fāngshì."
            },
            {
                "en": "Environmental protection is not only the responsibility of the government but also the duty of every citizen.",
                "zh": "环境保护不仅是政府的责任，也是每个公民的义务。",
                "pinyin": "Huánjìng bǎohù bùjǐn shì zhèngfǔ de zérèn, yěshì měi gè gōngmín de yìwù."
            },
            {
                "en": "With the development of globalization, cultural exchange between countries has become increasingly frequent.",
                "zh": "随着全球化的发展，国家之间的文化交流变得越来越频繁。",
                "pinyin": "Suízhe quánqiúhuà de fāzhǎn, guójiā zhījiān de wénhuà jiāoliú biàn de yuè lái yuè pínfán."
            },
            {
                "en": "Despite facing numerous challenges, they persisted in their efforts and finally achieved success.",
                "zh": "尽管面临诸多挑战，他们坚持不懈地努力，最终取得了成功。",
                "pinyin": "Jǐnguǎn miànlín zhūduō tiǎozhàn, tāmen jiānchí bùxiè de nǔlì, zuìzhōng qǔdéle chénggōng."
            },
            {
                "en": "The combination of traditional culture and modern elements creates a unique artistic style.",
                "zh": "传统文化与现代元素的结合创造了独特的艺术风格。",
                "pinyin": "Chuántǒng wénhuà yǔ xiàndài yuánsù de jiéhé chuàngzàole dútè de yìshù fēnggé."
            }
        ]
    }
}

# Dictionary mapping activity types to content dictionaries
all_writing_activities = {
    "character": character_practice,
    "sentence": sentence_completion,
    "translation": translation_exercises
}

def generate_writing_file(activity_type, level, format_type):
    """Generate a text file with writing activity content for a specific type and level"""
    print(f"Generating {activity_type} {level} {format_type} writing file...")
    
    activities_dict = all_writing_activities[activity_type]
    if level not in activities_dict:
        print(f"Level {level} not found in {activity_type} activities")
        return
    
    activity_content = activities_dict[level]
    
    # Ensure the writing_files directory exists
    os.makedirs("writing_files", exist_ok=True)
    
    with open(f"writing_files/{activity_type}_{level.lower().replace(' ', '_')}_{format_type}.txt", "w", encoding="utf-8") as f:
        # Write the title and description
        if format_type == "zh":
            title_parts = activity_content["title"].split(" / ")
            f.write(f"{title_parts[0]}\n")
        elif format_type == "en":
            title_parts = activity_content["title"].split(" / ")
            f.write(f"{title_parts[1] if len(title_parts) > 1 else title_parts[0]}\n")
        else:  # pinyin
            f.write(f"{activity_content['title']}\n")
            
        f.write("-" * 20 + "\n\n")
        f.write(f"{activity_content['description']}\n\n")
        
        # Write the exercises based on activity type
        if activity_type == "character":
            for char_info in activity_content["characters"]:
                if format_type == "zh":
                    f.write(f"{char_info['character']} - {char_info['meaning']}\n")
                    f.write(f"笔画数: {char_info['stroke_count']}\n")
                    f.write(f"笔顺: {char_info['stroke_order']}\n\n")
                elif format_type == "pinyin":
                    f.write(f"{char_info['character']} - {char_info['pinyin']} - {char_info['meaning']}\n")
                    f.write(f"Stroke count: {char_info['stroke_count']}\n")
                    f.write(f"Stroke order: {char_info['stroke_order']}\n\n")
                else:  # en
                    f.write(f"{char_info['character']} - {char_info['pinyin']} - {char_info['meaning']}\n")
                    f.write(f"Stroke count: {char_info['stroke_count']}\n")
                    f.write(f"Stroke order: {char_info['stroke_order']}\n\n")
                
                # Add practice template
                practice_template = activity_content["practice_template"].replace("{character}", char_info['character'])
                f.write(f"{practice_template}\n\n")
                
        elif activity_type == "sentence":
            for i, exercise in enumerate(activity_content["exercises"], 1):
                if format_type == "zh":
                    f.write(f"{i}. {exercise['prompt']}\n")
                    f.write(f"答案: {exercise['answer']}\n")
                    f.write(f"完整句子: {exercise['full_sentence']}\n\n")
                elif format_type == "pinyin":
                    f.write(f"{i}. {exercise['prompt']}\n")
                    f.write(f"Answer: {exercise['answer']} ({exercise['pinyin']})\n")
                    f.write(f"Full sentence: {exercise['full_sentence']}\n\n")
                else:  # en
                    f.write(f"{i}. {exercise['prompt']}\n")
                    f.write(f"Answer: {exercise['answer']} ({exercise['pinyin']})\n")
                    f.write(f"Full sentence: {exercise['full_sentence_en']}\n\n")
                    
        elif activity_type == "translation":
            for i, exercise in enumerate(activity_content["exercises"], 1):
                if format_type == "zh":
                    f.write(f"{i}. 英文: {exercise['en']}\n")
                    f.write(f"翻译: {exercise['zh']}\n\n")
                elif format_type == "pinyin":
                    f.write(f"{i}. English: {exercise['en']}\n")
                    f.write(f"Translation: {exercise['pinyin']}\n\n")
                else:  # en
                    f.write(f"{i}. Chinese: {exercise['zh']}\n")
                    f.write(f"Translation: {exercise['en']}\n\n")

async def generate_audio(activity_type, level, format_type="zh", voice=None):
    """Generate audio file for writing instructions"""
    print(f"Generating {activity_type} {level} {format_type} audio file...")
    
    activities_dict = all_writing_activities[activity_type]
    if level not in activities_dict:
        print(f"Level {level} not found in {activity_type} activities")
        return
    
    activity_content = activities_dict[level]
    
    # Select text based on format type
    if format_type == "zh":
        title_parts = activity_content["title"].split(" / ")
        text = f"{title_parts[0]}. {activity_content['description']}"
        if not voice:
            voice = "zh-CN-XiaoxiaoNeural"
    elif format_type == "en":
        title_parts = activity_content["title"].split(" / ")
        title = title_parts[1] if len(title_parts) > 1 else title_parts[0]
        text = f"{title}. {activity_content['description']}"
        if not voice:
            voice = "en-US-AriaNeural"
    else:
        print(f"Audio generation not supported for {format_type}")
        return
    
    # Ensure the audio_files/writing directory exists
    os.makedirs("audio_files/writing", exist_ok=True)
    
    output_file = f"audio_files/writing/{activity_type}_{level.lower().replace(' ', '_')}_{format_type}.mp3"
    
    communicate = edge_tts.Communicate(text, voice)
    await communicate.save(output_file)
    
    print(f"Audio saved to {output_file}")

async def main():
    parser = argparse.ArgumentParser(description="Generate writing activity files")
    parser.add_argument("--type", choices=["character", "sentence", "translation", "all"], default="all", help="Writing activity type")
    parser.add_argument("--level", default="all", help="Activity level")
    parser.add_argument("--format", choices=["zh", "pinyin", "en", "all"], default="all", help="Output format")
    parser.add_argument("--audio", action="store_true", help="Generate audio files")
    
    args = parser.parse_args()
    
    activity_types = list(all_writing_activities.keys()) if args.type == "all" else [args.type]
    
    for activity_type in activity_types:
        levels = list(all_writing_activities[activity_type].keys()) if args.level == "all" else [args.level]
        
        for level in levels:
            if level not in all_writing_activities[activity_type]:
                print(f"Level {level} not found in {activity_type} activities")
                continue
                
            formats = ["zh", "pinyin", "en"] if args.format == "all" else [args.format]
            
            for format_type in formats:
                generate_writing_file(activity_type, level, format_type)
                
                if args.audio and format_type in ["zh", "en"]:
                    await generate_audio(activity_type, level, format_type)

if __name__ == "__main__":
    asyncio.run(main())