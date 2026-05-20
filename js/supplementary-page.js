document.addEventListener('DOMContentLoaded', function() {
            const urlParams = new URLSearchParams(window.location.search);
            const category = urlParams.get('category') || 'education';
            const lang = urlParams.get('lang') || 'zh';
            
            // Update category name with proper formatting
            const categoryName = category.charAt(0).toUpperCase() + category.slice(1).replace('_', ' ');
            document.getElementById('category-name').textContent = categoryName;

            // Check if category is completed
            const completedCategories = JSON.parse(localStorage.getItem('completedSupplementary') || '{}');
            const completeBtn = document.getElementById('complete-btn');
            
            if (completedCategories[`${category}_${lang}`]) {
                completeBtn.classList.add('completed');
                completeBtn.innerHTML = '<i class="fas fa-check-circle"></i> Completed';
                completeBtn.disabled = true;
            }

            completeBtn.addEventListener('click', () => {
                // Mark category as complete
                completedCategories[`${category}_${lang}`] = true;
                localStorage.setItem('completedSupplementary', JSON.stringify(completedCategories));
                
                // Update button state
                completeBtn.classList.add('completed');
                completeBtn.innerHTML = '<i class="fas fa-check-circle"></i> Completed';
                completeBtn.disabled = true;

                // Show completion notification
                const notification = document.getElementById('copy-notification');
                notification.textContent = 'Category marked as complete!';
                notification.style.display = 'block';
                notification.style.animation = 'none';
                notification.offsetHeight; // Trigger reflow
                notification.style.animation = 'fadeInOut 2s ease';
                setTimeout(() => {
                    notification.style.display = 'none';
                    notification.textContent = 'Phrase copied to clipboard!';
                }, 2000);
            });
            
            // Set active language
            const languageBtns = document.querySelectorAll('.language-btn');
            languageBtns.forEach(btn => {
                if (btn.dataset.lang === lang) {
                    btn.classList.add('active');
                }
                btn.addEventListener('click', () => {
                    window.location.href = `supplementary.html?category=${category}&lang=${btn.dataset.lang}`;
                });
            });

            // Set language flag
            const flagMap = {
                'zh': '🇨🇳',
                'pinyin': '🔤',
                'en': '🇺🇸'
            };
            document.getElementById('language-flag').textContent = flagMap[lang];

            // Update section info based on category
            const sectionInfo = getSectionInfo(category);
            document.getElementById('section-title').textContent = sectionInfo.title;
            document.getElementById('section-description').textContent = sectionInfo.description;

            // Load audio from audio_files/supplementary directory
            const audio = document.getElementById('audio-player');
            // For Pinyin, use Mandarin audio. For English and Mandarin, use their respective audio files
            const audioLang = lang === 'pinyin' ? 'zh' : lang;
            const audioPath = `audio_files/supplementary/${category}_${audioLang}.mp3`;
            
            audio.src = audioPath;
            
            // Add a note only for Pinyin that it's using Mandarin audio
            const audioFallback = document.getElementById('audio-fallback');
            if (lang === 'pinyin') {
                audioFallback.innerHTML = '<p class="note"><i class="fas fa-info-circle"></i> Using Mandarin audio for reference.</p>';
                audioFallback.style.display = 'block';
            } else {
                audioFallback.innerHTML = '';
                audioFallback.style.display = 'none';
            }
            
            // Load text content from text_files/supplementary directory
            fetch(`text_files/supplementary/${category}_${lang}.txt`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`Network response was not ok: ${response.status}`);
                    }
                    return response.text();
                })
                .then(text => {
                    formatAndDisplayContent(text);
                })
                .catch(error => {
                    console.error('Error loading text:', error);
                    showContentError(document.getElementById('text-content'));
                });
        });

        function formatAndDisplayContent(text) {
            // First, normalize line endings and remove any extra whitespace
            text = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
            
            // Split into sections based on titles (lines ending with multiple dashes)
            const sections = text.split(/\n(?=\w[^\n]+\n-+\n)/);
            
            const contentDiv = document.getElementById('text-content');
            contentDiv.innerHTML = '';

            sections.forEach(section => {
                if (section.trim()) {
                    const lines = section.split('\n');
                    
                    // Get the title (first line) and remove any trailing dashes
                    let title = lines[0].replace(/\s*[-]+\s*$/, '').trim();
                    
                    // Skip empty sections or sections that are just separators
                    if (!title || /^[-\s]+$/.test(title)) {
                        return;
                    }
                    
                    // Get phrases, skipping empty lines, separator lines, and the line of dashes after the title
                    let phrases = lines.slice(1).filter(line => {
                        const trimmed = line.trim();
                        return trimmed && !/^[-\s]+$/.test(trimmed);
                    });
                    
                    const sectionDiv = document.createElement('div');
                    sectionDiv.className = 'phrase-section';
                    
                    const titleEl = document.createElement('h3');
                    titleEl.textContent = title;
                    sectionDiv.appendChild(titleEl);
                    
                    const phraseList = document.createElement('div');
                    phraseList.className = 'phrase-list';
                    
                    phrases.forEach(phrase => {
                        if (phrase.trim()) {
                            const phraseItem = document.createElement('div');
                            phraseItem.className = 'phrase-item';
                            
                            const phraseText = document.createElement('span');
                            phraseText.textContent = phrase.trim();
                            
                            const copyBtn = document.createElement('button');
                            copyBtn.className = 'copy-btn';
                            copyBtn.innerHTML = '<i class="fas fa-copy"></i>';
                            copyBtn.addEventListener('click', () => copyPhrase(phrase.trim()));
                            
                            phraseItem.appendChild(phraseText);
                            phraseItem.appendChild(copyBtn);
                            phraseList.appendChild(phraseItem);
                        }
                    });
                    
                    sectionDiv.appendChild(phraseList);
                    contentDiv.appendChild(sectionDiv);
                }
            });
        }

        function copyPhrase(phrase) {
            navigator.clipboard.writeText(phrase).then(() => {
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

        function getSectionInfo(category) {
            const info = {
                'education': {
                    title: 'Education & Academic Life',
                    description: 'Essential vocabulary and phrases for academic settings.'
                },
                'hobbies': {
                    title: 'Hobbies & Interests',
                    description: 'Express your interests and discuss leisure activities.'
                },
                'emotions': {
                    title: 'Emotions & Feelings',
                    description: 'Communicate feelings and emotional states effectively.'
                },
                'daily_life': {
                    title: 'Weather & Daily Life',
                    description: 'Essential phrases for weather and daily routines.'
                },
                'comparisons': {
                    title: 'Comparison Structures',
                    description: 'Learn to make comparisons and express preferences.'
                }
            };
            return info[category] || {
                title: 'Supplementary Content',
                description: 'Additional learning materials to enhance your Mandarin skills.'
            };
        }
