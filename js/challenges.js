/**
 * Mandarin Pathways Challenge System
 * Daily and weekly challenges to encourage engagement
 */

class ChallengeSystem {
    constructor() {
        this.STORAGE_KEY = 'mandarin_challenges';
        
        this.dailyChallenges = {
            perfect_pronunciation: {
                id: 'perfect_pronunciation',
                name: { en: 'Perfect Pronunciation', zh: '完美发音' },
                description: { en: 'Complete all audio exercises today', zh: '今天完成所有听力练习' },
                icon: '🎵',
                type: 'daily',
                xpReward: 50,
                difficulty: 'medium',
                category: 'audio',
                condition: (progress) => progress.audioExercisesToday >= progress.totalAudioExercises,
                resetDaily: true
            },
            
            character_master: {
                id: 'character_master',
                name: { en: 'Character Master', zh: '汉字大师' },
                description: { en: 'Practice writing 10 characters', zh: '练习书写10个汉字' },
                icon: '✍️',
                type: 'daily',
                xpReward: 50,
                difficulty: 'medium',
                category: 'writing',
                condition: (progress) => progress.charactersWrittenToday >= 10,
                resetDaily: true
            },
            
            speed_reader: {
                id: 'speed_reader',
                name: { en: 'Speed Reader', zh: '快速阅读者' },
                description: { en: 'Complete 3 reading exercises', zh: '完成3个阅读练习' },
                icon: '📚',
                type: 'daily',
                xpReward: 50,
                difficulty: 'easy',
                category: 'reading',
                condition: (progress) => progress.readingExercisesToday >= 3,
                resetDaily: true
            },
            
            consistency_king: {
                id: 'consistency_king',
                name: { en: 'Consistency King', zh: '坚持之王' },
                description: { en: 'Study for 20+ minutes today', zh: '今天学习20+分钟' },
                icon: '⏰',
                type: 'daily',
                xpReward: 50,
                difficulty: 'medium',
                category: 'time',
                condition: (progress) => progress.studyTimeToday >= 20,
                resetDaily: true
            },
            
            perfect_day: {
                id: 'perfect_day',
                name: { en: 'Perfect Day', zh: '完美一天' },
                description: { en: 'Complete lesson with 100% accuracy', zh: '以100%准确率完成课程' },
                icon: '🎯',
                type: 'daily',
                xpReward: 75,
                difficulty: 'hard',
                category: 'accuracy',
                condition: (progress) => progress.perfectScoresToday >= 1,
                resetDaily: true
            }
        };
        
        this.weeklyChallenges = {
            weekly_warrior: {
                id: 'weekly_warrior',
                name: { en: 'Weekly Warrior', zh: '每周战士' },
                description: { en: 'Complete 5 lessons this week', zh: '本周完成5课' },
                icon: '⚔️',
                type: 'weekly',
                xpReward: 200,
                difficulty: 'medium',
                category: 'consistency',
                condition: (progress) => progress.lessonsThisWeek >= 5,
                resetWeekly: true
            },
            
            streak_champion: {
                id: 'streak_champion',
                name: { en: 'Streak Champion', zh: '连击冠军' },
                description: { en: 'Maintain daily study streak for 7 days', zh: '保持7天每日学习连击' },
                icon: '🔥',
                type: 'weekly',
                xpReward: 300,
                difficulty: 'hard',
                category: 'consistency',
                condition: (progress) => progress.currentStreak >= 7,
                resetWeekly: false
            },
            
            skill_master: {
                id: 'skill_master',
                name: { en: 'Skill Master', zh: '技能大师' },
                description: { en: 'Complete 5 writing + 5 reading exercises', zh: '完成5个写作+5个阅读练习' },
                icon: '🎓',
                type: 'weekly',
                xpReward: 250,
                difficulty: 'hard',
                category: 'skills',
                condition: (progress) => progress.writingThisWeek >= 5 && progress.readingThisWeek >= 5,
                resetWeekly: true
            },
            
            xp_hunter: {
                id: 'xp_hunter',
                name: { en: 'XP Hunter', zh: '经验猎人' },
                description: { en: 'Earn 500 XP this week', zh: '本周获得500经验' },
                icon: '💎',
                type: 'weekly',
                xpReward: 200,
                difficulty: 'medium',
                category: 'xp',
                condition: (progress) => progress.xpThisWeek >= 500,
                resetWeekly: true
            }
        };
        
        this.initializeData();
    }
    
    initializeData() {
        const defaultData = {
            activeChallenges: [],
            completedChallenges: [],
            dailyProgress: {},
            weeklyProgress: {},
            lastResetDate: new Date().toDateString(),
            lastWeekResetDate: this.getWeekStart()
        };
        
        const stored = localStorage.getItem(this.STORAGE_KEY);
        this.data = stored ? { ...defaultData, ...JSON.parse(stored) } : defaultData;
        
        this.checkResets();
        this.generateDailyChallenges();
        this.generateWeeklyChallenges();
        this.save();
    }
    
    save() {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.data));
    }
    
    getWeekStart() {
        const now = new Date();
        const day = now.getDay();
        const diff = now.getDate() - day;
        return new Date(now.setDate(diff)).toDateString();
    }
    
    checkResets() {
        const today = new Date().toDateString();
        const currentWeek = this.getWeekStart();
        
        // Reset daily challenges
        if (this.data.lastResetDate !== today) {
            this.resetDailyChallenges();
            this.data.lastResetDate = today;
        }
        
        // Reset weekly challenges
        if (this.data.lastWeekResetDate !== currentWeek) {
            this.resetWeeklyChallenges();
            this.data.lastWeekResetDate = currentWeek;
        }
    }
    
    resetDailyChallenges() {
        // Remove completed daily challenges
        this.data.completedChallenges = this.data.completedChallenges.filter(id => {
            const challenge = this.dailyChallenges[id] || this.weeklyChallenges[id];
            return challenge && !challenge.resetDaily;
        });
        
        // Reset daily progress
        this.data.dailyProgress = {};
        
        // Generate new daily challenges
        this.generateDailyChallenges();
    }
    
    resetWeeklyChallenges() {
        // Remove completed weekly challenges
        this.data.completedChallenges = this.data.completedChallenges.filter(id => {
            const challenge = this.dailyChallenges[id] || this.weeklyChallenges[id];
            return challenge && !challenge.resetWeekly;
        });
        
        // Reset weekly progress
        this.data.weeklyProgress = {};
        
        // Generate new weekly challenges
        this.generateWeeklyChallenges();
    }
    
    generateDailyChallenges() {
        const availableDailies = Object.values(this.dailyChallenges).filter(challenge =>
            !this.data.completedChallenges.includes(challenge.id)
        );
        
        // Select 2-3 random daily challenges
        const selectedCount = Math.min(3, availableDailies.length);
        const selected = this.shuffleArray(availableDailies).slice(0, selectedCount);
        
        this.data.activeChallenges = this.data.activeChallenges.filter(id => {
            const challenge = this.weeklyChallenges[id];
            return challenge && challenge.type === 'weekly';
        });
        
        selected.forEach(challenge => {
            if (!this.data.activeChallenges.includes(challenge.id)) {
                this.data.activeChallenges.push(challenge.id);
            }
        });
    }
    
    generateWeeklyChallenges() {
        const availableWeeklies = Object.values(this.weeklyChallenges).filter(challenge =>
            !this.data.completedChallenges.includes(challenge.id)
        );
        
        // Select 2 random weekly challenges
        const selectedCount = Math.min(2, availableWeeklies.length);
        const selected = this.shuffleArray(availableWeeklies).slice(0, selectedCount);
        
        selected.forEach(challenge => {
            if (!this.data.activeChallenges.includes(challenge.id)) {
                this.data.activeChallenges.push(challenge.id);
            }
        });
    }
    
    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }
    
    updateProgress(activityType, amount = 1) {
        const today = new Date().toDateString();
        
        // Initialize daily progress if needed
        if (!this.data.dailyProgress[today]) {
            this.data.dailyProgress[today] = {
                audioExercisesToday: 0,
                charactersWrittenToday: 0,
                readingExercisesToday: 0,
                studyTimeToday: 0,
                perfectScoresToday: 0,
                lessonsToday: 0
            };
        }
        
        // Initialize weekly progress if needed
        const weekStart = this.getWeekStart();
        if (!this.data.weeklyProgress[weekStart]) {
            this.data.weeklyProgress[weekStart] = {
                lessonsThisWeek: 0,
                writingThisWeek: 0,
                readingThisWeek: 0,
                xpThisWeek: 0
            };
        }
        
        const dailyProgress = this.data.dailyProgress[today];
        const weeklyProgress = this.data.weeklyProgress[weekStart];
        
        // Update progress based on activity type
        switch (activityType) {
            case 'audio_exercise':
                dailyProgress.audioExercisesToday += amount;
                break;
            case 'character_writing':
                dailyProgress.charactersWrittenToday += amount;
                break;
            case 'reading_exercise':
                dailyProgress.readingExercisesToday += amount;
                weeklyProgress.readingThisWeek += amount;
                break;
            case 'study_time':
                dailyProgress.studyTimeToday += amount;
                break;
            case 'perfect_score':
                dailyProgress.perfectScoresToday += amount;
                break;
            case 'lesson_complete':
                dailyProgress.lessonsToday += amount;
                weeklyProgress.lessonsThisWeek += amount;
                break;
            case 'writing_exercise':
                weeklyProgress.writingThisWeek += amount;
                break;
            case 'xp_earned':
                weeklyProgress.xpThisWeek += amount;
                break;
        }
        
        // Get user data for streak information
        const userData = window.gamificationSystem ? window.gamificationSystem.getUserData() : {};
        
        // Create combined progress object
        const combinedProgress = {
            ...dailyProgress,
            ...weeklyProgress,
            currentStreak: userData.currentStreak || 0,
            totalAudioExercises: 1 // This could be dynamic based on lesson content
        };
        
        this.checkChallengeCompletion(combinedProgress);
        this.save();
    }
    
    checkChallengeCompletion(progress) {
        const newlyCompleted = [];
        
        this.data.activeChallenges.forEach(challengeId => {
            if (this.data.completedChallenges.includes(challengeId)) {
                return; // Already completed
            }
            
            const challenge = this.dailyChallenges[challengeId] || this.weeklyChallenges[challengeId];
            if (challenge && challenge.condition(progress)) {
                this.completeChallenge(challengeId);
                newlyCompleted.push(challenge);
            }
        });
        
        return newlyCompleted;
    }
    
    completeChallenge(challengeId) {
        if (this.data.completedChallenges.includes(challengeId)) {
            return false; // Already completed
        }
        
        this.data.completedChallenges.push(challengeId);
        
        const challenge = this.dailyChallenges[challengeId] || this.weeklyChallenges[challengeId];
        if (challenge && window.gamificationSystem) {
            const result = window.gamificationSystem.completeChallenge(challengeId);
            
            if (result) {
                this.triggerChallengeComplete(challenge);
            }
        }
        
        this.save();
        return true;
    }
    
    triggerChallengeComplete(challenge) {
        window.dispatchEvent(new CustomEvent('challengeComplete', {
            detail: { challenge }
        }));
        
        // Show notification
        const lang = localStorage.getItem('preferredLanguage') === 'zh-CN' ? 'zh' : 'en';
        const message = `🏆 ${lang === 'zh' ? '挑战完成' : 'Challenge Complete'}: ${challenge.name[lang]}!`;
        
        if (window.gamificationSystem) {
            window.gamificationSystem.showNotification(message, 'success');
        }
    }
    
    getActiveChallenges() {
        return this.data.activeChallenges.map(id => {
            const challenge = this.dailyChallenges[id] || this.weeklyChallenges[id];
            if (!challenge) return null;
            
            const isCompleted = this.data.completedChallenges.includes(id);
            const progress = this.getChallengeProgress(id);
            
            return {
                ...challenge,
                isCompleted,
                progress
            };
        }).filter(Boolean);
    }
    
    getChallengeProgress(challengeId) {
        const challenge = this.dailyChallenges[challengeId] || this.weeklyChallenges[challengeId];
        if (!challenge) return 0;
        
        const today = new Date().toDateString();
        const weekStart = this.getWeekStart();
        const userData = window.gamificationSystem ? window.gamificationSystem.getUserData() : {};
        
        const dailyProgress = this.data.dailyProgress[today] || {};
        const weeklyProgress = this.data.weeklyProgress[weekStart] || {};
        
        const combinedProgress = {
            ...dailyProgress,
            ...weeklyProgress,
            currentStreak: userData.currentStreak || 0,
            totalAudioExercises: 1
        };
        
        // Calculate progress percentage based on challenge type
        switch (challengeId) {
            case 'perfect_pronunciation':
                return Math.min(100, (combinedProgress.audioExercisesToday / combinedProgress.totalAudioExercises) * 100);
            case 'character_master':
                return Math.min(100, (combinedProgress.charactersWrittenToday / 10) * 100);
            case 'speed_reader':
                return Math.min(100, (combinedProgress.readingExercisesToday / 3) * 100);
            case 'consistency_king':
                return Math.min(100, (combinedProgress.studyTimeToday / 20) * 100);
            case 'perfect_day':
                return combinedProgress.perfectScoresToday >= 1 ? 100 : 0;
            case 'weekly_warrior':
                return Math.min(100, (combinedProgress.lessonsThisWeek / 5) * 100);
            case 'streak_champion':
                return Math.min(100, (combinedProgress.currentStreak / 7) * 100);
            case 'skill_master':
                const writingProgress = Math.min(1, combinedProgress.writingThisWeek / 5);
                const readingProgress = Math.min(1, combinedProgress.readingThisWeek / 5);
                return (writingProgress + readingProgress) * 50;
            case 'xp_hunter':
                return Math.min(100, (combinedProgress.xpThisWeek / 500) * 100);
            default:
                return challenge.condition(combinedProgress) ? 100 : 0;
        }
    }
    
    renderChallengeCard(challenge) {
        const lang = localStorage.getItem('preferredLanguage') === 'zh-CN' ? 'zh' : 'en';
        const progressPercent = challenge.progress || 0;
        
        const difficultyColors = {
            easy: '#2ecc71',
            medium: '#f39c12',
            hard: '#e74c3c'
        };
        
        const typeLabel = challenge.type === 'daily' 
            ? (lang === 'zh' ? '每日' : 'Daily')
            : (lang === 'zh' ? '每周' : 'Weekly');
        
        return `
            <div class="challenge-card ${challenge.isCompleted ? 'completed' : ''}" data-challenge-id="${challenge.id}">
                <div class="challenge-header">
                    <div class="challenge-icon">${challenge.icon}</div>
                    <div class="challenge-info">
                        <h4 class="challenge-name">${challenge.name[lang]}</h4>
                        <p class="challenge-description">${challenge.description[lang]}</p>
                    </div>
                    <div class="challenge-meta">
                        <span class="challenge-type" style="background-color: ${difficultyColors[challenge.difficulty]}">
                            ${typeLabel}
                        </span>
                        <span class="challenge-xp">+${challenge.xpReward} XP</span>
                    </div>
                </div>
                <div class="challenge-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${progressPercent}%"></div>
                    </div>
                    <span class="progress-text">${Math.round(progressPercent)}%</span>
                </div>
                ${challenge.isCompleted ? '<div class="challenge-completed">✅ ' + (lang === 'zh' ? '已完成' : 'Completed') + '</div>' : ''}
            </div>
        `;
    }
    
    renderChallengesSection() {
        const lang = localStorage.getItem('preferredLanguage') === 'zh-CN' ? 'zh' : 'en';
        const activeChallenges = this.getActiveChallenges();
        
        if (activeChallenges.length === 0) {
            return `
                <div class="challenges-section">
                    <h3>${lang === 'zh' ? '今日挑战' : 'Daily Challenges'}</h3>
                    <div class="no-challenges">
                        <p>${lang === 'zh' ? '暂无可用挑战，明天再来看看！' : 'No challenges available, check back tomorrow!'}</p>
                    </div>
                </div>
            `;
        }
        
        const challengeHTML = activeChallenges.map(challenge => 
            this.renderChallengeCard(challenge)
        ).join('');
        
        const completedCount = activeChallenges.filter(c => c.isCompleted).length;
        
        return `
            <div class="challenges-section">
                <div class="challenges-header">
                    <h3>${lang === 'zh' ? '今日挑战' : 'Daily Challenges'}</h3>
                    <div class="challenges-progress">
                        <span class="completed-challenges">${completedCount}</span> / 
                        <span class="total-challenges">${activeChallenges.length}</span>
                        ${lang === 'zh' ? '已完成' : 'Completed'}
                    </div>
                </div>
                <div class="challenges-grid">
                    ${challengeHTML}
                </div>
            </div>
        `;
    }
    
    getChallengeStats() {
        const total = this.data.completedChallenges.length;
        const today = new Date().toDateString();
        const weekStart = this.getWeekStart();
        
        const dailyCompleted = this.data.completedChallenges.filter(id => {
            const challenge = this.dailyChallenges[id];
            return challenge && challenge.resetDaily;
        }).length;
        
        const weeklyCompleted = this.data.completedChallenges.filter(id => {
            const challenge = this.weeklyChallenges[id];
            return challenge && challenge.resetWeekly;
        }).length;
        
        return {
            totalCompleted: total,
            dailyCompleted,
            weeklyCompleted,
            activeChallenges: this.data.activeChallenges.length
        };
    }
}

// Initialize global challenge system
if (typeof window !== 'undefined') {
    window.challengeSystem = new ChallengeSystem();
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ChallengeSystem;
}