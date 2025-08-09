/**
 * Mandarin Pathways Gamification System
 * Core XP, levels, streaks, and progress tracking
 */

class GamificationSystem {
    constructor() {
        this.STORAGE_KEY = 'mandarin_gamification';
        this.XP_REWARDS = {
            DAILY_LESSON: 25,
            PERFECT_SCORE: 10,
            READING_EXERCISE: 15,
            WRITING_EXERCISE: 20,
            DAILY_CHALLENGE: 50,
            STREAK_MILESTONE: {
                7: 100,
                14: 200,
                30: 500,
                50: 1000
            }
        };
        
        this.LEVEL_THRESHOLDS = [
            0, 100, 250, 500, 1000, 1750, 2750, 4000, 5500, 7500, 10000,
            13000, 16500, 20500, 25000, 30000, 35500, 41500, 48000, 55000, 62500
        ];
        
        this.initializeData();
    }
    
    initializeData() {
        const defaultData = {
            user: {
                xp: 0,
                level: 1,
                currentStreak: 0,
                longestStreak: 0,
                lastActivityDate: null,
                badges: [],
                weeklyXP: 0,
                weekStartDate: this.getWeekStart(),
                challengesCompleted: [],
                weeklyGoal: 300,
                totalLessonsCompleted: 0,
                totalReadingCompleted: 0,
                totalWritingCompleted: 0,
                perfectScores: 0,
                preferences: {
                    showNotifications: true,
                    streakReminders: true,
                    celebrateAchievements: true
                }
            }
        };
        
        const stored = localStorage.getItem(this.STORAGE_KEY);
        this.data = stored ? { ...defaultData, ...JSON.parse(stored) } : defaultData;
        
        // Ensure user object exists with all properties
        this.data.user = { ...defaultData.user, ...this.data.user };
        
        this.updateWeeklyProgress();
        this.updateStreak();
        this.save();
    }
    
    save() {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.data));
        this.dispatchUpdateEvent();
    }
    
    dispatchUpdateEvent() {
        window.dispatchEvent(new CustomEvent('gamificationUpdate', {
            detail: this.data.user
        }));
    }
    
    getWeekStart() {
        const now = new Date();
        const day = now.getDay();
        const diff = now.getDate() - day;
        return new Date(now.setDate(diff)).toDateString();
    }
    
    updateWeeklyProgress() {
        const currentWeekStart = this.getWeekStart();
        if (this.data.user.weekStartDate !== currentWeekStart) {
            this.data.user.weeklyXP = 0;
            this.data.user.weekStartDate = currentWeekStart;
        }
    }
    
    updateStreak() {
        const today = new Date().toDateString();
        const lastActivity = this.data.user.lastActivityDate;
        
        if (!lastActivity) {
            return; // No previous activity
        }
        
        const lastDate = new Date(lastActivity);
        const todayDate = new Date(today);
        const diffTime = todayDate - lastDate;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays > 1) {
            // Streak broken
            this.data.user.currentStreak = 0;
        }
    }
    
    awardXP(amount, activity) {
        const oldLevel = this.data.user.level;
        this.data.user.xp += amount;
        this.data.user.weeklyXP += amount;
        
        const newLevel = this.calculateLevel(this.data.user.xp);
        if (newLevel > oldLevel) {
            this.data.user.level = newLevel;
            this.triggerLevelUp(newLevel);
        }
        
        this.recordActivity();
        this.save();
        
        return {
            xpAwarded: amount,
            totalXP: this.data.user.xp,
            levelUp: newLevel > oldLevel,
            newLevel: newLevel,
            activity: activity
        };
    }
    
    recordActivity() {
        const today = new Date().toDateString();
        const lastActivity = this.data.user.lastActivityDate;
        
        if (lastActivity !== today) {
            if (lastActivity) {
                const lastDate = new Date(lastActivity);
                const todayDate = new Date(today);
                const diffTime = todayDate - lastDate;
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                
                if (diffDays === 1) {
                    // Consecutive day
                    this.data.user.currentStreak++;
                    if (this.data.user.currentStreak > this.data.user.longestStreak) {
                        this.data.user.longestStreak = this.data.user.currentStreak;
                    }
                    this.checkStreakMilestones();
                } else {
                    // Streak broken
                    this.data.user.currentStreak = 1;
                }
            } else {
                // First activity
                this.data.user.currentStreak = 1;
                if (this.data.user.longestStreak === 0) {
                    this.data.user.longestStreak = 1;
                }
            }
            
            this.data.user.lastActivityDate = today;
        }
    }
    
    checkStreakMilestones() {
        const streak = this.data.user.currentStreak;
        const milestones = this.XP_REWARDS.STREAK_MILESTONE;
        
        if (milestones[streak]) {
            this.awardXP(milestones[streak], `${streak}-day streak milestone`);
            this.triggerStreakMilestone(streak);
        }
    }
    
    calculateLevel(xp) {
        for (let i = this.LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
            if (xp >= this.LEVEL_THRESHOLDS[i]) {
                return i + 1;
            }
        }
        return 1;
    }
    
    getXPForNextLevel() {
        const currentLevel = this.data.user.level;
        if (currentLevel >= this.LEVEL_THRESHOLDS.length) {
            return null; // Max level reached
        }
        return this.LEVEL_THRESHOLDS[currentLevel] - this.data.user.xp;
    }
    
    getProgressToNextLevel() {
        const currentLevel = this.data.user.level;
        if (currentLevel >= this.LEVEL_THRESHOLDS.length) {
            return 100; // Max level
        }
        
        const currentLevelXP = this.LEVEL_THRESHOLDS[currentLevel - 1];
        const nextLevelXP = this.LEVEL_THRESHOLDS[currentLevel];
        const progressXP = this.data.user.xp - currentLevelXP;
        const neededXP = nextLevelXP - currentLevelXP;
        
        return Math.min(100, (progressXP / neededXP) * 100);
    }
    
    completeLesson(day, language, perfect = false) {
        let xpAwarded = this.XP_REWARDS.DAILY_LESSON;
        let activities = [`Day ${day} lesson`];
        
        if (perfect) {
            xpAwarded += this.XP_REWARDS.PERFECT_SCORE;
            activities.push('Perfect score bonus');
            this.data.user.perfectScores++;
        }
        
        this.data.user.totalLessonsCompleted++;
        
        const result = this.awardXP(xpAwarded, activities.join(', '));
        this.checkAchievements();
        
        return result;
    }
    
    completeReading() {
        this.data.user.totalReadingCompleted++;
        const result = this.awardXP(this.XP_REWARDS.READING_EXERCISE, 'Reading exercise');
        this.checkAchievements();
        return result;
    }
    
    completeWriting() {
        this.data.user.totalWritingCompleted++;
        const result = this.awardXP(this.XP_REWARDS.WRITING_EXERCISE, 'Writing exercise');
        this.checkAchievements();
        return result;
    }
    
    completeChallenge(challengeId) {
        if (!this.data.user.challengesCompleted.includes(challengeId)) {
            this.data.user.challengesCompleted.push(challengeId);
            const result = this.awardXP(this.XP_REWARDS.DAILY_CHALLENGE, `Challenge: ${challengeId}`);
            this.checkAchievements();
            return result;
        }
        return null;
    }
    
    checkAchievements() {
        // This will be expanded in achievements.js
        window.dispatchEvent(new CustomEvent('checkAchievements', {
            detail: this.data.user
        }));
    }
    
    awardBadge(badgeId) {
        if (!this.data.user.badges.includes(badgeId)) {
            this.data.user.badges.push(badgeId);
            this.save();
            this.triggerBadgeAwarded(badgeId);
        }
    }
    
    triggerLevelUp(newLevel) {
        window.dispatchEvent(new CustomEvent('levelUp', {
            detail: { newLevel, user: this.data.user }
        }));
        
        if (this.data.user.preferences.celebrateAchievements) {
            this.showNotification(`🎉 Level Up! You reached Level ${newLevel}!`, 'success');
        }
    }
    
    triggerStreakMilestone(streak) {
        window.dispatchEvent(new CustomEvent('streakMilestone', {
            detail: { streak, user: this.data.user }
        }));
        
        if (this.data.user.preferences.celebrateAchievements) {
            this.showNotification(`🔥 Amazing! ${streak}-day learning streak!`, 'success');
        }
    }
    
    triggerBadgeAwarded(badgeId) {
        window.dispatchEvent(new CustomEvent('badgeAwarded', {
            detail: { badgeId, user: this.data.user }
        }));
        
        if (this.data.user.preferences.celebrateAchievements) {
            this.showNotification(`🏆 New Badge Earned: ${badgeId}!`, 'achievement');
        }
    }
    
    showNotification(message, type = 'info') {
        // Create and show notification
        const notification = document.createElement('div');
        notification.className = `gamification-notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 5000);
        
        // Close button functionality
        notification.querySelector('.notification-close').addEventListener('click', () => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        });
    }
    
    getUserData() {
        return this.data.user;
    }
    
    resetProgress() {
        localStorage.removeItem(this.STORAGE_KEY);
        this.initializeData();
    }
    
    exportData() {
        return JSON.stringify(this.data, null, 2);
    }
    
    importData(jsonData) {
        try {
            this.data = JSON.parse(jsonData);
            this.save();
            return true;
        } catch (error) {
            console.error('Failed to import data:', error);
            return false;
        }
    }
}

// Initialize global gamification system
if (typeof window !== 'undefined') {
    window.gamificationSystem = new GamificationSystem();
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GamificationSystem;
}