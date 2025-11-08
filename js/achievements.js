/**
 * Mandarin Pathways Achievement System
 * Manages badges, trophies, and achievement unlocking
 */

class AchievementSystem {
    constructor() {
        this.badges = {
            first_steps: {
                id: 'first_steps',
                name: { en: 'First Steps', zh: '初出茅庐' },
                description: { en: 'Complete your first lesson', zh: '完成第一课' },
                icon: '🌱',
                condition: (user) => user.totalLessonsCompleted >= 1,
                category: 'progress'
            },
            
            week_warrior: {
                id: 'week_warrior',
                name: { en: 'Week Warrior', zh: '周冠军' },
                description: { en: 'Complete 7 lessons', zh: '完成7课' },
                icon: '⚔️',
                condition: (user) => user.totalLessonsCompleted >= 7,
                category: 'progress'
            },
            
            month_master: {
                id: 'month_master',
                name: { en: 'Month Master', zh: '月度大师' },
                description: { en: 'Complete 30 lessons', zh: '完成30课' },
                icon: '👑',
                condition: (user) => user.totalLessonsCompleted >= 30,
                category: 'progress'
            },
            
            streak_starter: {
                id: 'streak_starter',
                name: { en: 'Streak Starter', zh: '连击新手' },
                description: { en: 'Maintain a 3-day streak', zh: '保持3天连击' },
                icon: '🔥',
                condition: (user) => user.currentStreak >= 3 || user.longestStreak >= 3,
                category: 'consistency'
            },
            
            streak_master: {
                id: 'streak_master',
                name: { en: 'Streak Master', zh: '连击大师' },
                description: { en: 'Maintain a 7-day streak', zh: '保持7天连击' },
                icon: '🌟',
                condition: (user) => user.currentStreak >= 7 || user.longestStreak >= 7,
                category: 'consistency'
            },
            
            dedication_hero: {
                id: 'dedication_hero',
                name: { en: 'Dedication Hero', zh: '坚持英雄' },
                description: { en: 'Maintain a 30-day streak', zh: '保持30天连击' },
                icon: '💎',
                condition: (user) => user.currentStreak >= 30 || user.longestStreak >= 30,
                category: 'consistency'
            },
            
            writing_pro: {
                id: 'writing_pro',
                name: { en: 'Writing Pro', zh: '写作专家' },
                description: { en: 'Complete 10 writing exercises', zh: '完成10个写作练习' },
                icon: '✍️',
                condition: (user) => user.totalWritingCompleted >= 10,
                category: 'skills'
            },
            
            reading_champion: {
                id: 'reading_champion',
                name: { en: 'Reading Champion', zh: '阅读冠军' },
                description: { en: 'Complete 15 reading exercises', zh: '完成15个阅读练习' },
                icon: '📚',
                condition: (user) => user.totalReadingCompleted >= 15,
                category: 'skills'
            },
            
            perfect_student: {
                id: 'perfect_student',
                name: { en: 'Perfect Student', zh: '完美学生' },
                description: { en: 'Achieve 5 perfect scores', zh: '获得5次满分' },
                icon: '🎯',
                condition: (user) => user.perfectScores >= 5,
                category: 'excellence'
            },
            
            challenge_champion: {
                id: 'challenge_champion',
                name: { en: 'Challenge Champion', zh: '挑战冠军' },
                description: { en: 'Complete 5 daily challenges', zh: '完成5个每日挑战' },
                icon: '🏆',
                condition: (user) => user.challengesCompleted.length >= 5,
                category: 'challenges'
            },
            
            level_5_legend: {
                id: 'level_5_legend',
                name: { en: 'Level 5 Legend', zh: '五级传说' },
                description: { en: 'Reach Level 5', zh: '达到5级' },
                icon: '🌟',
                condition: (user) => user.level >= 5,
                category: 'levels'
            },
            
            level_10_master: {
                id: 'level_10_master',
                name: { en: 'Level 10 Master', zh: '十级大师' },
                description: { en: 'Reach Level 10', zh: '达到10级' },
                icon: '🎖️',
                condition: (user) => user.level >= 10,
                category: 'levels'
            },
            
            weekly_warrior: {
                id: 'weekly_warrior',
                name: { en: 'Weekly Warrior', zh: '每周战士' },
                description: { en: 'Reach weekly XP goal', zh: '达到每周经验目标' },
                icon: '📈',
                condition: (user) => user.weeklyXP >= user.weeklyGoal,
                category: 'goals'
            },
            
            xp_collector: {
                id: 'xp_collector',
                name: { en: 'XP Collector', zh: '经验收集者' },
                description: { en: 'Earn 1000 total XP', zh: '获得1000总经验' },
                icon: '💰',
                condition: (user) => user.xp >= 1000,
                category: 'milestones'
            },
            
            xp_master: {
                id: 'xp_master',
                name: { en: 'XP Master', zh: '经验大师' },
                description: { en: 'Earn 5000 total XP', zh: '获得5000总经验' },
                icon: '💎',
                condition: (user) => user.xp >= 5000,
                category: 'milestones'
            }
        };
        
        this.categories = {
            progress: { name: { en: 'Progress', zh: '进度' }, color: '#2ecc71' },
            consistency: { name: { en: 'Consistency', zh: '坚持' }, color: '#e74c3c' },
            skills: { name: { en: 'Skills', zh: '技能' }, color: '#3498db' },
            excellence: { name: { en: 'Excellence', zh: '卓越' }, color: '#f39c12' },
            challenges: { name: { en: 'Challenges', zh: '挑战' }, color: '#9b59b6' },
            levels: { name: { en: 'Levels', zh: '等级' }, color: '#1abc9c' },
            goals: { name: { en: 'Goals', zh: '目标' }, color: '#34495e' },
            milestones: { name: { en: 'Milestones', zh: '里程碑' }, color: '#e67e22' }
        };
        
        this.initializeListeners();
    }
    
    initializeListeners() {
        window.addEventListener('checkAchievements', (event) => {
            this.checkAllAchievements(event.detail);
        });
    }
    
    checkAllAchievements(userData) {
        const newBadges = [];
        
        Object.values(this.badges).forEach(badge => {
            if (!userData.badges.includes(badge.id) && badge.condition(userData)) {
                window.gamificationSystem.awardBadge(badge.id);
                newBadges.push(badge);
            }
        });
        
        return newBadges;
    }
    
    getBadge(badgeId) {
        return this.badges[badgeId];
    }
    
    getAllBadges() {
        return this.badges;
    }
    
    getUserBadges(userBadgeIds) {
        return userBadgeIds.map(id => this.badges[id]).filter(Boolean);
    }
    
    getAvailableBadges(userData) {
        return Object.values(this.badges).filter(badge => 
            !userData.badges.includes(badge.id)
        );
    }
    
    getNearbyBadges(userData, limit = 3) {
        const available = this.getAvailableBadges(userData);
        
        // Sort by how close the user is to earning them (basic heuristic)
        return available.slice(0, limit);
    }
    
    getBadgesByCategory(category) {
        return Object.values(this.badges).filter(badge => 
            badge.category === category
        );
    }
    
    getProgressToNextBadge(userData, badgeId) {
        const badge = this.badges[badgeId];
        if (!badge || userData.badges.includes(badgeId)) {
            return null;
        }
        
        // Basic progress calculation based on badge type
        let progress = 0;
        
        switch (badgeId) {
            case 'week_warrior':
                progress = Math.min(100, (userData.totalLessonsCompleted / 7) * 100);
                break;
            case 'month_master':
                progress = Math.min(100, (userData.totalLessonsCompleted / 30) * 100);
                break;
            case 'streak_master':
                progress = Math.min(100, (Math.max(userData.currentStreak, userData.longestStreak) / 7) * 100);
                break;
            case 'writing_pro':
                progress = Math.min(100, (userData.totalWritingCompleted / 10) * 100);
                break;
            case 'reading_champion':
                progress = Math.min(100, (userData.totalReadingCompleted / 15) * 100);
                break;
            case 'perfect_student':
                progress = Math.min(100, (userData.perfectScores / 5) * 100);
                break;
            case 'challenge_champion':
                progress = Math.min(100, (userData.challengesCompleted.length / 5) * 100);
                break;
            case 'level_5_legend':
                progress = Math.min(100, (userData.level / 5) * 100);
                break;
            case 'level_10_master':
                progress = Math.min(100, (userData.level / 10) * 100);
                break;
            case 'weekly_warrior':
                progress = Math.min(100, (userData.weeklyXP / userData.weeklyGoal) * 100);
                break;
            case 'xp_collector':
                progress = Math.min(100, (userData.xp / 1000) * 100);
                break;
            case 'xp_master':
                progress = Math.min(100, (userData.xp / 5000) * 100);
                break;
            default:
                progress = badge.condition(userData) ? 100 : 0;
        }
        
        return progress;
    }
    
    renderBadge(badgeId, earned = false, showProgress = false, userData = null) {
        const badge = this.badges[badgeId];
        if (!badge) return null;
        
        const lang = localStorage.getItem('preferredLanguage') === 'zh-CN' ? 'zh' : 'en';
        const category = this.categories[badge.category];
        
        let progressHTML = '';
        if (showProgress && !earned && userData) {
            const progress = this.getProgressToNextBadge(userData, badgeId);
            if (progress !== null) {
                progressHTML = `
                    <div class="badge-progress">
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${progress}%"></div>
                        </div>
                        <span class="progress-text">${Math.round(progress)}%</span>
                    </div>
                `;
            }
        }
        
        return `
            <div class="achievement-badge ${earned ? 'earned' : 'locked'}" data-badge-id="${badgeId}">
                <div class="badge-icon" style="border-color: ${category.color}">
                    ${earned ? badge.icon : '🔒'}
                </div>
                <div class="badge-info">
                    <h4 class="badge-name">${badge.name[lang]}</h4>
                    <p class="badge-description">${badge.description[lang]}</p>
                    <span class="badge-category" style="color: ${category.color}">
                        ${category.name[lang]}
                    </span>
                    ${progressHTML}
                </div>
            </div>
        `;
    }
    
    renderBadgeGrid(userData, showLocked = true, categoryFilter = null) {
        const lang = localStorage.getItem('preferredLanguage') === 'zh-CN' ? 'zh' : 'en';
        
        let badgesToShow = Object.values(this.badges);
        
        if (categoryFilter) {
            badgesToShow = badgesToShow.filter(badge => badge.category === categoryFilter);
        }
        
        if (!showLocked) {
            badgesToShow = badgesToShow.filter(badge => userData.badges.includes(badge.id));
        }
        
        const earnedBadges = badgesToShow.filter(badge => userData.badges.includes(badge.id));
        const lockedBadges = badgesToShow.filter(badge => !userData.badges.includes(badge.id));
        
        // Sort earned badges first, then locked badges
        const sortedBadges = [...earnedBadges, ...lockedBadges];
        
        const badgeHTML = sortedBadges.map(badge => 
            this.renderBadge(badge.id, userData.badges.includes(badge.id), true, userData)
        ).join('');
        
        return `
            <div class="achievement-header">
                <h3>${lang === 'zh' ? '成就徽章' : 'Achievement Badges'}</h3>
                <div class="achievement-stats">
                    <span class="earned-count">${earnedBadges.length}</span> / 
                    <span class="total-count">${badgesToShow.length}</span>
                    ${lang === 'zh' ? '已获得' : 'Earned'}
                </div>
            </div>
            <div class="achievement-grid">
                ${badgeHTML}
            </div>
        `;
    }
    
    renderCategoryTabs() {
        const lang = localStorage.getItem('preferredLanguage') === 'zh-CN' ? 'zh' : 'en';
        
        const tabs = Object.entries(this.categories).map(([key, category]) => `
            <button class="category-tab" data-category="${key}" style="border-color: ${category.color}">
                ${category.name[lang]}
            </button>
        `).join('');
        
        return `
            <div class="achievement-categories">
                <button class="category-tab active" data-category="all">
                    ${lang === 'zh' ? '全部' : 'All'}
                </button>
                ${tabs}
            </div>
        `;
    }
    
    getAchievementSummary(userData) {
        const totalBadges = Object.keys(this.badges).length;
        const earnedBadges = userData.badges.length;
        const completionRate = Math.round((earnedBadges / totalBadges) * 100);
        
        const categoryProgress = Object.keys(this.categories).map(category => {
            const categoryBadges = this.getBadgesByCategory(category);
            const categoryEarned = categoryBadges.filter(badge => 
                userData.badges.includes(badge.id)
            ).length;
            
            return {
                category,
                total: categoryBadges.length,
                earned: categoryEarned,
                percentage: Math.round((categoryEarned / categoryBadges.length) * 100)
            };
        });
        
        return {
            totalBadges,
            earnedBadges,
            completionRate,
            categoryProgress
        };
    }
}

// Initialize global achievement system
if (typeof window !== 'undefined') {
    window.achievementSystem = new AchievementSystem();
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AchievementSystem;
}