// Writing activities data structure
        const writingData = {
            character: {
                "Basic Strokes": {
                    title: "Basic Strokes",
                    titleZh: "基本笔画",
                    titlePinyin: "Jīběn bǐhuà",
                    description: "Practice the fundamental strokes used in Chinese characters",
                    descriptionZh: "练习汉字中使用的基本笔画",
                    descriptionPinyin: "Liànxí Hànzì zhōng shǐyòng de jīběn bǐhuà",
                    hasAudio: true
                },
                "Common Radicals": {
                    title: "Common Radicals",
                    titleZh: "常用部首",
                    titlePinyin: "Chángyòng bùshǒu",
                    description: "Practice common radicals that form the building blocks of Chinese characters",
                    descriptionZh: "练习构成汉字基本组成部分的常用部首",
                    descriptionPinyin: "Liànxí gòuchéng Hànzì jīběn zǔchéng bùfèn de chángyòng bùshǒu",
                    hasAudio: true
                },
                "Numbers": {
                    title: "Numbers",
                    titleZh: "数字",
                    titlePinyin: "Shùzì",
                    description: "Practice writing Chinese numbers",
                    descriptionZh: "练习书写中文数字",
                    descriptionPinyin: "Liànxí shūxiě Zhōngwén shùzì",
                    hasAudio: true
                },
                "Complete Radicals - Group 1": {
                    title: "Complete Radicals - Group 1",
                    titleZh: "完整部首 - 第一组",
                    titlePinyin: "Wánzhěng bùshǒu - Dì yī zǔ",
                    description: "Practice common radicals (1-30 of 214 Kangxi radicals)",
                    descriptionZh: "练习常用部首（康熙部首214个中的1-30个）",
                    descriptionPinyin: "Liànxí chángyòng bùshǒu (Kāngxī bùshǒu 214 gè zhōng de 1-30 gè)",
                    hasAudio: true
                },
                "Complete Radicals - Group 2": {
                    title: "Complete Radicals - Group 2",
                    titleZh: "完整部首 - 第二组",
                    titlePinyin: "Wánzhěng bùshǒu - Dì èr zǔ",
                    description: "Practice common radicals (31-60 of 214 Kangxi radicals)",
                    descriptionZh: "练习常用部首（康熙部首214个中的31-60个）",
                    descriptionPinyin: "Liànxí chángyòng bùshǒu (Kāngxī bùshǒu 214 gè zhōng de 31-60 gè)",
                    hasAudio: true
                },
                "Complete Radicals - Group 3": {
                    title: "Complete Radicals - Group 3",
                    titleZh: "完整部首 - 第三组",
                    titlePinyin: "Wánzhěng bùshǒu - Dì sān zǔ",
                    description: "Practice common radicals (61-90 of 214 Kangxi radicals)",
                    descriptionZh: "练习常用部首（康熙部首214个中的61-90个）",
                    descriptionPinyin: "Liànxí chángyòng bùshǒu (Kāngxī bùshǒu 214 gè zhōng de 61-90 gè)",
                    hasAudio: true
                },
                "HSK1 - Essential": {
                    title: "HSK1 Essential Characters",
                    titleZh: "HSK1 基础汉字",
                    titlePinyin: "HSK1 jīchǔ Hànzì",
                    description: "Practice the most common characters from HSK Level 1",
                    descriptionZh: "练习HSK一级中最常用的汉字",
                    descriptionPinyin: "Liànxí HSK yī jí zhōng zuì chángyòng de Hànzì",
                    hasAudio: true
                },
                "HSK2 - Basic": {
                    title: "HSK2 Basic Characters",
                    titleZh: "HSK2 基本汉字",
                    titlePinyin: "HSK2 jīběn Hànzì",
                    description: "Practice common characters from HSK Level 2",
                    descriptionZh: "练习HSK二级中的常用汉字",
                    descriptionPinyin: "Liànxí HSK èr jí zhōng de chángyòng Hànzì",
                    hasAudio: true
                },
                "HSK3 - Intermediate": {
                    title: "HSK3 Intermediate Characters",
                    titleZh: "HSK3 中级汉字",
                    titlePinyin: "HSK3 zhōngjí Hànzì",
                    description: "Practice intermediate characters from HSK Level 3",
                    descriptionZh: "练习HSK三级中的中级汉字",
                    descriptionPinyin: "Liànxí HSK sān jí zhōng de zhōngjí Hànzì",
                    hasAudio: true
                },
                "Theme - Family": {
                    title: "Theme - Family",
                    titleZh: "主题 - 家庭",
                    titlePinyin: "Zhǔtí - Jiātíng",
                    description: "Practice characters related to family members and relationships",
                    descriptionZh: "练习与家庭成员和关系相关的汉字",
                    descriptionPinyin: "Liànxí yǔ jiātíng chéngyuán hé guānxì xiāngguān de Hànzì",
                    hasAudio: true
                },
                "Theme - Food": {
                    title: "Theme - Food",
                    titleZh: "主题 - 食物",
                    titlePinyin: "Zhǔtí - Shíwù",
                    description: "Practice characters related to food and dining",
                    descriptionZh: "练习与食物和用餐相关的汉字",
                    descriptionPinyin: "Liànxí yǔ shíwù hé yòngcān xiāngguān de Hànzì",
                    hasAudio: true
                },
                "Theme - Travel": {
                    title: "Theme - Travel",
                    titleZh: "主题 - 旅行",
                    titlePinyin: "Zhǔtí - Lǚxíng",
                    description: "Practice characters related to travel and transportation",
                    descriptionZh: "练习与旅行和交通相关的汉字",
                    descriptionPinyin: "Liànxí yǔ lǚxíng hé jiāotōng xiāngguān de Hànzì",
                    hasAudio: true
                }
            },
            sentence: {
                "Beginner": {
                    title: "Beginner Sentence Completion",
                    titleZh: "初级句子完成",
                    titlePinyin: "Chūjí jùzi wánchéng",
                    description: "Complete sentences with appropriate words",
                    descriptionZh: "用适当的词语完成句子",
                    descriptionPinyin: "Yòng shìdàng de cíyǔ wánchéng jùzi",
                    hasAudio: true
                },
                "Intermediate": {
                    title: "Intermediate Sentence Completion",
                    titleZh: "中级句子完成",
                    titlePinyin: "Zhōngjí jùzi wánchéng",
                    description: "Complete sentences with appropriate words or phrases",
                    descriptionZh: "用适当的词语或短语完成句子",
                    descriptionPinyin: "Yòng shìdàng de cíyǔ huò duǎnyǔ wánchéng jùzi",
                    hasAudio: true
                },
                "Advanced": {
                    title: "Advanced Sentence Completion",
                    titleZh: "高级句子完成",
                    titlePinyin: "Gāojí jùzi wánchéng",
                    description: "Complete complex sentences with appropriate words or phrases",
                    descriptionZh: "用适当的词语或短语完成复杂句子",
                    descriptionPinyin: "Yòng shìdàng de cíyǔ huò duǎnyǔ wánchéng fùzá jùzi",
                    hasAudio: true
                }
            },
            translation: {
                "Beginner": {
                    title: "Beginner Translation Exercises",
                    titleZh: "初级翻译练习",
                    titlePinyin: "Chūjí fānyì liànxí",
                    description: "Translate simple sentences between English and Chinese",
                    descriptionZh: "翻译英文和中文之间的简单句子",
                    descriptionPinyin: "Fānyì Yīngwén hé Zhōngwén zhījiān de jiǎndān jùzi",
                    hasAudio: true
                },
                "Intermediate": {
                    title: "Intermediate Translation Exercises",
                    titleZh: "中级翻译练习",
                    titlePinyin: "Zhōngjí fānyì liànxí",
                    description: "Translate more complex sentences between English and Chinese",
                    descriptionZh: "翻译英文和中文之间的更复杂句子",
                    descriptionPinyin: "Fānyì Yīngwén hé Zhōngwén zhījiān de gèng fùzá jùzi",
                    hasAudio: true
                },
                "Advanced": {
                    title: "Advanced Translation Exercises",
                    titleZh: "高级翻译练习",
                    titlePinyin: "Gāojí fānyì liànxí",
                    description: "Translate complex sentences and paragraphs between English and Chinese",
                    descriptionZh: "翻译英文和中文之间的复杂句子和段落",
                    descriptionPinyin: "Fānyì Yīngwén hé Zhōngwén zhījiān de fùzá jùzi hé duànluò",
                    hasAudio: true
                }
            }
        };

        document.addEventListener('DOMContentLoaded', function() {
            const urlParams = new URLSearchParams(window.location.search);
            const activityType = urlParams.get('type') || '';
            const level = urlParams.get('level') || '';
            const lang = urlParams.get('lang') || 'zh';
            
            // Set active language and update HTML lang attribute
            const languageBtns = document.querySelectorAll('.language-btn');
            languageBtns.forEach(btn => {
                if (btn.dataset.lang === lang) {
                    btn.classList.add('active');
                    // Set HTML lang attribute based on selected language
                    if (lang === 'en') {
                        document.documentElement.setAttribute('lang', 'en');
                    } else if (lang === 'zh') {
                        document.documentElement.setAttribute('lang', 'zh-CN');
                    } else {
                        // For pinyin, we'll use English as the base language
                        document.documentElement.setAttribute('lang', 'en');
                    }
                }
            });
            
            // Apply language filtering - show only elements for the selected language
            const allLangElements = document.querySelectorAll('.zh, .pinyin, .en');
            allLangElements.forEach(el => {
                // Hide all language elements first
                el.style.display = 'none';
            });
            
            // Show only elements for the selected language
            const selectedLangElements = document.querySelectorAll('.' + lang);
            selectedLangElements.forEach(el => {
                el.style.display = '';
            });
            
            // Add click event listeners to language buttons
            languageBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    const currentType = urlParams.get('type') || '';
                    const currentLevel = urlParams.get('level') || '';
                    let newUrl = `writing.html?lang=${btn.dataset.lang}`;
                    if (currentType) {
                        newUrl += `&type=${currentType}`;
                        if (currentLevel) {
                            newUrl += `&level=${currentLevel}`;
                        }
                    }
                    window.location.href = newUrl;
                });
            });

            // Set language flag
            const flagMap = {
                'zh': '🇨🇳',
                'pinyin': '🔤',
                'en': '🇺🇸'
            };
            document.getElementById('language-flag').textContent = flagMap[lang];

            // Set up activity type buttons
            const activityBtns = document.querySelectorAll('.activity-btn');
            activityBtns.forEach(btn => {
                if (btn.dataset.type === activityType) {
                    btn.classList.add('active');
                }
                btn.addEventListener('click', () => {
                    window.location.href = `writing.html?type=${btn.dataset.type}&lang=${lang}`;
                });
            });

            // If activity type is selected, show levels
            if (activityType && writingData[activityType]) {
                document.querySelector('.level-selector').style.display = 'block';
                document.getElementById('activity-type').textContent = getActivityTypeDisplay(activityType, lang);
                
                // Populate levels
                const levelButtons = document.getElementById('level-buttons');
                levelButtons.innerHTML = '';
                
                Object.keys(writingData[activityType]).forEach(levelName => {
                    const btn = document.createElement('button');
                    btn.className = 'level-btn';
                    if (levelName === level) {
                        btn.classList.add('active');
                    }
                    btn.dataset.level = levelName;
                    
                    let icon = '';
                    if (activityType === 'sentence' || activityType === 'translation') {
                        if (levelName === 'Beginner') {
                            icon = '<i class="fas fa-star"></i> ';
                        } else if (levelName === 'Intermediate') {
                            icon = '<i class="fas fa-star"></i><i class="fas fa-star"></i> ';
                        } else if (levelName === 'Advanced') {
                            icon = '<i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i> ';
                        }
                    } else {
                        icon = '<i class="fas fa-pen"></i> ';
                    }
                    
                    // Display level name in the appropriate language
                    let displayName = levelName;
                    const levelData = writingData[activityType][levelName];
                    
                    if (lang === 'zh' && levelData.titleZh) {
                        displayName = levelData.titleZh;
                    } else if (lang === 'pinyin' && levelData.titlePinyin) {
                        displayName = levelData.titlePinyin;
                    }
                    
                    btn.innerHTML = icon + displayName;
                    
                    btn.addEventListener('click', () => {
                        window.location.href = `writing.html?type=${activityType}&level=${levelName}&lang=${lang}`;
                    });
                    
                    levelButtons.appendChild(btn);
                });
            }

            // If both activity type and level are selected, load content
            if (activityType && level && writingData[activityType] && writingData[activityType][level]) {
                loadWritingContent(activityType, level, lang);
            } else {
                // Hide content sections if no level selected
                document.getElementById('section-title').textContent = '';
                document.getElementById('section-description').textContent = '';
                document.querySelector('.audio-player').style.display = 'none';
                document.getElementById('writing-content').innerHTML = '';
                document.querySelector('.writing-tools').style.display = 'none';
                document.getElementById('complete-btn').style.display = 'none';
            }

            // Writing tools functionality
            document.getElementById('clear-btn').addEventListener('click', () => {
                const inputs = document.querySelectorAll('.writing-input, .answer-input');
                inputs.forEach(input => {
                    input.value = '';
                });
            });

            document.getElementById('check-btn').addEventListener('click', () => {
                const exercises = document.querySelectorAll('.exercise-item');
                exercises.forEach(exercise => {
                    const input = exercise.querySelector('.writing-input, .answer-input');
                    const answer = exercise.dataset.answer;
                    
                    if (input && answer) {
                        if (input.value.trim().toLowerCase() === answer.toLowerCase()) {
                            input.classList.add('correct');
                            input.classList.remove('incorrect');
                        } else {
                            input.classList.add('incorrect');
                            input.classList.remove('correct');
                        }
                    }
                });
            });

            document.getElementById('show-answers-btn').addEventListener('click', () => {
                const exercises = document.querySelectorAll('.exercise-item');
                exercises.forEach(exercise => {
                    const input = exercise.querySelector('.writing-input, .answer-input');
                    const answer = exercise.dataset.answer;
                    
                    if (input && answer) {
                        input.value = answer;
                        input.classList.remove('incorrect');
                        input.classList.add('correct');
                    }
                });
            });

            // Mark as complete functionality
            const completeBtn = document.getElementById('complete-btn');
            const completedWritings = JSON.parse(localStorage.getItem('completedWritings') || '{}');
            
            if (activityType && level && completedWritings[`${activityType}_${level}_${lang}`]) {
                completeBtn.classList.add('completed');
                
                // Create language-specific completed text
                let completedText = '';
                if (lang === 'zh') {
                    completedText = '已完成';
                } else if (lang === 'pinyin') {
                    completedText = 'Yǐ wánchéng';
                } else {
                    completedText = 'Completed';
                }
                
                completeBtn.innerHTML = `<i class="fas fa-check-circle"></i> ${completedText}`;
                completeBtn.disabled = true;
            }

            completeBtn.addEventListener('click', () => {
                if (activityType && level) {
                    // Mark writing activity as complete
                    completedWritings[`${activityType}_${level}_${lang}`] = true;
                    localStorage.setItem('completedWritings', JSON.stringify(completedWritings));
                    
                    // Update button state
                    completeBtn.classList.add('completed');
                    
                    // Create language-specific completed text
                    let completedText = '';
                    if (lang === 'zh') {
                        completedText = '已完成';
                    } else if (lang === 'pinyin') {
                        completedText = 'Yǐ wánchéng';
                    } else {
                        completedText = 'Completed';
                    }
                    
                    completeBtn.innerHTML = `<i class="fas fa-check-circle"></i> ${completedText}`;
                    completeBtn.disabled = true;

                    // Show completion notification with language-specific text
                    const notification = document.getElementById('copy-notification');
                    
                    if (lang === 'zh') {
                        notification.textContent = '活动已标记为完成！';
                    } else if (lang === 'pinyin') {
                        notification.textContent = 'Huódòng yǐ biāojì wéi wánchéng!';
                    } else {
                        notification.textContent = 'Activity marked as complete!';
                    }
                    notification.style.display = 'block';
                    notification.style.animation = 'none';
                    notification.offsetHeight; // Trigger reflow
                    notification.style.animation = 'fadeInOut 2s ease';
                    setTimeout(() => {
                        notification.style.display = 'none';
                        notification.textContent = 'Phrase copied to clipboard!';
                    }, 2000);
                }
            });
        });

        function getActivityTypeDisplay(type, lang) {
            if (lang === 'zh') {
                switch(type) {
                    case 'character': return '汉字练习';
                    case 'sentence': return '句子完成';
                    case 'translation': return '翻译练习';
                    default: return type;
                }
            } else if (lang === 'pinyin') {
                switch(type) {
                    case 'character': return 'Hànzì liànxí';
                    case 'sentence': return 'Jùzi wánchéng';
                    case 'translation': return 'Fānyì liànxí';
                    default: return type;
                }
            } else {
                switch(type) {
                    case 'character': return 'Character Practice';
                    case 'sentence': return 'Sentence Completion';
                    case 'translation': return 'Translation Practice';
                    default: return type;
                }
            }
        }

        /**
         * Section header aligns with stitched TTS cues (Chinese title clause + English description for zh audio).
         * Pinyin UI uses plain text — no karaoke spans (audio is still Mandarin/instruction English).
         * @returns {boolean} Whether DOM has cue elements for LessonAudioSync
         */
        function setupWritingSectionHeader(activityInfo, lang) {
            const titleEl = document.getElementById('section-title');
            const descEl = document.getElementById('section-description');
            if (lang === 'pinyin') {
                titleEl.textContent = activityInfo.titlePinyin || activityInfo.title;
                descEl.textContent = activityInfo.descriptionPinyin || activityInfo.description;
                return false;
            }

            const parts = activityInfo.title.split(' / ').map((s) => s.trim()).filter(Boolean);
            const zhTitle = parts[0] || activityInfo.title;
            const enTitle = parts.length > 1 ? parts.slice(1).join(' / ') : parts[0] || activityInfo.title;
            const titleCueText = lang === 'zh' ? zhTitle : enTitle;
            const descriptionCueText = activityInfo.description;

            const titleSpanLang = /[\u4e00-\u9fff]/.test(titleCueText) ? 'zh' : 'en';
            titleEl.innerHTML = '';
            descEl.innerHTML = '';

            const titleCue = document.createElement('span');
            titleCue.className = 'writing-sync-cue';
            titleCue.dataset.cueI = '0';
            titleCue.appendChild(
                LessonAudioSync.appendPhraseSpansToFragment(titleCueText, titleSpanLang)
            );
            titleEl.appendChild(titleCue);

            const descCue = document.createElement('span');
            descCue.className = 'writing-sync-cue';
            descCue.dataset.cueI = '1';
            descCue.appendChild(
                LessonAudioSync.appendPhraseSpansToFragment(descriptionCueText, 'en')
            );
            descEl.appendChild(descCue);
            return true;
        }

        function loadWritingContent(activityType, level, lang) {
            const activityInfo = writingData[activityType][level];

            const headerSynced = setupWritingSectionHeader(activityInfo, lang);

            document.querySelector('.audio-player').style.display = 'block';
            document.querySelector('.writing-tools').style.display = 'block';
            document.getElementById('complete-btn').style.display = 'block';

            const audio = document.getElementById('audio-player');
            const audioFallback = document.getElementById('audio-fallback');
            const audioLang = lang === 'pinyin' ? 'zh' : lang;
            const levelSlug = level.toLowerCase().replace(/ /g, '_');

            if (activityInfo.hasAudio) {
                audio.src = `audio_files/writing/${activityType}_${levelSlug}_${audioLang}.mp3`;
                if (lang === 'pinyin') {
                    audioFallback.innerHTML = '<p class="note"><i class="fas fa-info-circle"></i> Using Mandarin audio for reference.</p>';
                    audioFallback.style.display = 'block';
                } else {
                    audioFallback.style.display = 'none';
                }
            } else {
                audio.src = '';
                audioFallback.innerHTML = '<p class="note"><i class="fas fa-info-circle"></i> Audio not available for this activity.</p>';
                audioFallback.style.display = 'block';
            }

            const txtUrl = `writing_files/${activityType}_${levelSlug}_${lang}.txt`;
            const timingUrl =
                activityInfo.hasAudio ? `timing/writing/${activityType}_${levelSlug}_${audioLang}.json` : '';

            const textFetch = fetch(txtUrl).then((response) => {
                if (!response.ok) throw new Error(`Network response was not ok: ${response.status}`);
                return response.text();
            });

            const timingFetch = timingUrl
                ? fetch(timingUrl)
                      .then(async (response) => {
                          if (!response.ok) return null;
                          try {
                              return await response.json();
                          } catch (e) {
                              console.warn('Writing timing manifest invalid JSON:', e);
                              return null;
                          }
                      })
                      .catch(() => null)
                : Promise.resolve(null);

            Promise.all([textFetch, timingFetch])
                .then(([text, timing]) => {
                    formatAndDisplayWritingContent(text, activityType);
                    if (activityInfo.hasAudio && headerSynced) {
                        LessonAudioSync.attachCueHighlighting(
                            audio,
                            timing?.phrases,
                            (cue) =>
                                document.querySelector(
                                    `.writing-sync-cue[data-cue-i="${cue.i}"]`
                                ) || null
                        );
                    }
                })
                .catch((error) => {
                    console.error('Error loading writing content:', error);
                    showContentError(document.getElementById('writing-content'));
                    document.querySelector('.writing-tools').style.display = 'none';
                });
        }

        function formatAndDisplayWritingContent(text, activityType) {
            // Split the text into sections
            const sections = text.split(/\n(?=\w[^\n]+\n-+\n)/);
            
            if (sections.length >= 1) {
                const mainSection = sections[0];
                const lines = mainSection.split('\n');
                
                // Skip title and separator lines
                const contentLines = lines.slice(2);
                
                const writingContentDiv = document.getElementById('writing-content');
                writingContentDiv.innerHTML = '';
                
                if (activityType === 'character') {
                    formatCharacterPractice(contentLines, writingContentDiv);
                } else if (activityType === 'sentence') {
                    formatSentenceCompletion(contentLines, writingContentDiv);
                } else if (activityType === 'translation') {
                    formatTranslationExercises(contentLines, writingContentDiv);
                }
            }
        }

        function formatCharacterPractice(lines, container) {
            // Add instruction message at the top
            const instructionDiv = document.createElement('div');
            instructionDiv.className = 'instruction-message';
            instructionDiv.style.marginBottom = '20px';
            instructionDiv.style.padding = '10px';
            instructionDiv.style.backgroundColor = 'rgba(255, 255, 0, 0.1)';
            instructionDiv.style.borderRadius = '5px';
            instructionDiv.style.borderLeft = '4px solid #ffc107';
            
            const instructionIcon = document.createElement('i');
            instructionIcon.className = 'fas fa-info-circle';
            instructionIcon.style.marginRight = '8px';
            instructionIcon.style.color = '#ffc107';
            
            const instructionText = document.createElement('span');
            
            // Create language-specific instruction text
            const zhInstruction = document.createElement('span');
            zhInstruction.className = 'zh';
            zhInstruction.innerHTML = '<strong>练习方法：</strong>使用鼠标或触摸屏在绘图框中绘制每个汉字。您可以使用"清除"、"撤销"和"提示"按钮来辅助练习。';
            
            const pinyinInstruction = document.createElement('span');
            pinyinInstruction.className = 'pinyin';
            pinyinInstruction.innerHTML = '<strong>Liànxí fāngfǎ:</strong> Shǐyòng shǔbiāo huò chùmō píng zài huìtú kuàng zhōng huìzhì měi gè hànzì. Nín kěyǐ shǐyòng "qīngchú", "chèxiāo" hé "tíshì" ànniǔ lái fǔzhù liànxí.';
            
            const enInstruction = document.createElement('span');
            enInstruction.className = 'en';
            enInstruction.innerHTML = '<strong>How to practice:</strong> Use your mouse or touch screen to draw each character in the drawing boxes. You can use the Clear, Undo, and Hint buttons to help with your practice.';
            
            instructionText.appendChild(zhInstruction);
            instructionText.appendChild(pinyinInstruction);
            instructionText.appendChild(enInstruction);
            
            instructionDiv.appendChild(instructionIcon);
            instructionDiv.appendChild(instructionText);
            container.appendChild(instructionDiv);
            
            let currentCharacter = null;
            let characterInfo = [];
            let characters = [];
            
            lines.forEach(line => {
                if (line.trim()) {
                    if (line.includes('_')) {
                        // This is a practice template line
                        if (currentCharacter) {
                            characters.push({
                                character: currentCharacter,
                                info: characterInfo,
                                template: line
                            });
                            currentCharacter = null;
                            characterInfo = [];
                        }
                    } else if (line.match(/^[\u4e00-\u9fa5]\s*-/)) {
                        // This is a new character line
                        if (currentCharacter) {
                            characters.push({
                                character: currentCharacter,
                                info: characterInfo
                            });
                            characterInfo = [];
                        }
                        currentCharacter = line.trim().split('-')[0].trim();
                        characterInfo.push(line);
                    } else {
                        // This is additional info about the current character
                        characterInfo.push(line);
                    }
                }
            });
            
            // Add the last character if there is one
            if (currentCharacter) {
                characters.push({
                    character: currentCharacter,
                    info: characterInfo
                });
            }
            
            // Create character practice elements
            characters.forEach(char => {
                const charDiv = document.createElement('div');
                charDiv.className = 'character-practice';
                
                // Character info
                const infoDiv = document.createElement('div');
                infoDiv.className = 'character-info';
                
                char.info.forEach(info => {
                    const p = document.createElement('p');
                    p.textContent = info;
                    infoDiv.appendChild(p);
                });
                
                charDiv.appendChild(infoDiv);
                
                // Character practice area
                const practiceDiv = document.createElement('div');
                practiceDiv.className = 'practice-area';
                
                const characterDisplay = document.createElement('div');
                characterDisplay.className = 'character-display';
                characterDisplay.textContent = char.character;
                
                const practiceGrid = document.createElement('div');
                practiceGrid.className = 'practice-grid';
                
                for (let i = 0; i < 5; i++) {
                    const cell = document.createElement('div');
                    cell.className = 'practice-cell';
                    
                    const input = document.createElement('input');
                    input.type = 'text';
                    input.className = 'writing-input';
                    input.maxLength = 1;
                    
                    cell.appendChild(input);
                    practiceGrid.appendChild(cell);
                }
                
                practiceDiv.appendChild(characterDisplay);
                practiceDiv.appendChild(practiceGrid);
                
                charDiv.appendChild(practiceDiv);
                container.appendChild(charDiv);
            });
        }

        function formatSentenceCompletion(lines, container) {
            const exercises = [];
            let currentExercise = null;
            
            lines.forEach(line => {
                if (line.trim()) {
                    if (line.match(/^\d+\./)) {
                        // This is a new exercise
                        if (currentExercise) {
                            exercises.push(currentExercise);
                        }
                        currentExercise = {
                            prompt: line,
                            answer: '',
                            fullSentence: ''
                        };
                    } else if (line.toLowerCase().includes('answer:')) {
                        // This is the answer line
                        if (currentExercise) {
                            currentExercise.answer = line.split(':')[1].trim();
                        }
                    } else if (line.toLowerCase().includes('full sentence:')) {
                        // This is the full sentence line
                        if (currentExercise) {
                            currentExercise.fullSentence = line.split(':')[1].trim();
                        }
                    }
                }
            });
            
            // Add the last exercise if there is one
            if (currentExercise) {
                exercises.push(currentExercise);
            }
            
            // Create sentence completion elements
            exercises.forEach(exercise => {
                const exerciseDiv = document.createElement('div');
                exerciseDiv.className = 'exercise-item';
                exerciseDiv.dataset.answer = exercise.answer;
                
                const promptP = document.createElement('p');
                promptP.className = 'exercise-prompt';
                promptP.textContent = exercise.prompt;
                
                const inputDiv = document.createElement('div');
                inputDiv.className = 'exercise-input';
                
                const input = document.createElement('input');
                input.type = 'text';
                input.className = 'answer-input';
                input.placeholder = 'Your answer...';
                
                inputDiv.appendChild(input);
                
                const resultDiv = document.createElement('div');
                resultDiv.className = 'exercise-result';
                resultDiv.style.display = 'none';
                
                exerciseDiv.appendChild(promptP);
                exerciseDiv.appendChild(inputDiv);
                exerciseDiv.appendChild(resultDiv);
                
                container.appendChild(exerciseDiv);
            });
        }

        function formatTranslationExercises(lines, container) {
            const exercises = [];
            let currentExercise = null;
            
            lines.forEach(line => {
                if (line.trim()) {
                    if (line.match(/^\d+\./)) {
                        // This is a new exercise
                        if (currentExercise) {
                            exercises.push(currentExercise);
                        }
                        currentExercise = {
                            source: line,
                            translation: ''
                        };
                    } else if (line.toLowerCase().includes('translation:')) {
                        // This is the translation line
                        if (currentExercise) {
                            currentExercise.translation = line.split(':')[1].trim();
                        }
                    }
                }
            });
            
            // Add the last exercise if there is one
            if (currentExercise) {
                exercises.push(currentExercise);
            }
            
            // Create translation exercise elements
            exercises.forEach(exercise => {
                const exerciseDiv = document.createElement('div');
                exerciseDiv.className = 'exercise-item';
                exerciseDiv.dataset.answer = exercise.translation;
                
                const sourceP = document.createElement('p');
                sourceP.className = 'exercise-prompt';
                sourceP.textContent = exercise.source;
                
                const inputDiv = document.createElement('div');
                inputDiv.className = 'exercise-input';
                
                const input = document.createElement('textarea');
                input.className = 'answer-input';
                input.placeholder = 'Your translation...';
                input.rows = 3;
                
                inputDiv.appendChild(input);
                
                const resultDiv = document.createElement('div');
                resultDiv.className = 'exercise-result';
                resultDiv.style.display = 'none';
                
                exerciseDiv.appendChild(sourceP);
                exerciseDiv.appendChild(inputDiv);
                exerciseDiv.appendChild(resultDiv);
                
                container.appendChild(exerciseDiv);
            });
        }

        function copyText(text) {
            navigator.clipboard.writeText(text).then(() => {
                const notification = document.getElementById('copy-notification');
                notification.style.display = 'block';
                notification.style.animation = 'none';
                notification.offsetHeight; // Trigger reflow
                notification.style.animation = 'fadeInOut 2s ease';
                setTimeout(() => {
                    notification.style.display = 'none';
                }, 2000);
            });
        }
