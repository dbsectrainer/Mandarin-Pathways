// Request notification permission and subscribe to push notifications
async function initializeNotifications() {
  if ('Notification' in window && 'serviceWorker' in navigator && 'PushManager' in window) {
    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: 'YOUR_VAPID_PUBLIC_KEY' // You'll need to replace this with your actual VAPID key
        });
        
        // Here you would typically send the subscription to your server
        console.log('Push notification subscription:', subscription);
      }
    } catch (error) {
      console.error('Error setting up push notifications:', error);
    }
  }
}

document.addEventListener('DOMContentLoaded', function() {
    // Initialize notifications
    initializeNotifications();
    
    // Initialize language from URL or localStorage
    initializeLanguage();
    
    // Generate day grid
    generateDayGrid();
    
    // Initialize language cards
    initializeLanguageCards();
    
    // Add scroll animations
    initializeScrollAnimations();
    
    // Initialize day grid pagination
    initializeDayPagination();
    
    // Add micro-interactions
    initializeMicroInteractions();
    
    // Initialize language buttons
    initializeLanguageButtons();

    // Load hero section background image
    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
        const img = new Image();
        img.onload = function() {
            heroSection.classList.add('loaded');
        };
        img.src = 'https://images.unsplash.com/photo-1546410531-89436e5b419a?auto=format&fit=crop&w=900&q=75';
    }

    // Use content-visibility for better performance
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        if (!section.classList.contains('hero-section')) {
            section.style.contentVisibility = 'auto';
            section.style.containIntrinsicSize = '500px';
        }
    });
});

// Language handling
function initializeLanguage() {
    const urlParams = new URLSearchParams(window.location.search);
    const lang = urlParams.get('lang') || localStorage.getItem('preferredLanguage') || 'zh-CN';
    setLanguage(lang);
}

function setLanguage(lang) {
    // Store the preference
    localStorage.setItem('preferredLanguage', lang);
    
    // Update HTML lang attribute
    document.documentElement.lang = lang;
    
    // Update language buttons
    const buttons = document.querySelectorAll('.language-btn');
    buttons.forEach(btn => {
        if ((btn.dataset.lang === 'zh' && lang === 'zh-CN') ||
            (btn.dataset.lang === btn.dataset.lang && lang === btn.dataset.lang)) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

function initializeLanguageButtons() {
    const buttons = document.querySelectorAll('.language-btn');
    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            const lang = btn.dataset.lang;
            const htmlLang = lang === 'zh' ? 'zh-CN' : lang;
            setLanguage(htmlLang);
            
            // Update URL without reloading
            const url = new URL(window.location.href);
            url.searchParams.set('lang', lang);
            window.history.pushState({}, '', url);
        });
    });
}
// Global variables for pagination
let currentDayPage = 1;
const daysPerPage = 10;
const totalDays = 40;
let selectedLanguage = localStorage.getItem('preferredLanguage') || 'zh-CN'; // Default to Simplified Chinese

function generateDayGrid() {
    const dayGrid = document.querySelector('.day-grid');
    
    // Clear existing days
    dayGrid.innerHTML = '';
    
    // Calculate start and end days for current page
    const startDay = (currentDayPage - 1) * daysPerPage + 1;
    const endDay = Math.min(startDay + daysPerPage - 1, totalDays);
    
    // Update day range display
    if (document.getElementById('dayRangeStart')) {
        document.getElementById('dayRangeStart').textContent = startDay;
        document.getElementById('dayRangeEnd').textContent = endDay;
    }
    
    for (let i = startDay; i <= endDay; i++) {
        const dayLink = document.createElement('a');
        // Convert zh-CN to zh for URLs
        const urlLang = selectedLanguage === 'zh-CN' ? 'zh' : selectedLanguage;
        dayLink.href = `day.html?day=${i}&lang=${urlLang}`;
        dayLink.className = 'animate-fade-in hover-scale';
        dayLink.style.animationDelay = `${(i - startDay) * 0.05}s`;
        
        const dayNumber = document.createElement('div');
        dayNumber.className = 'day-number';
        dayNumber.textContent = i;
        
        const dayStatus = document.createElement('div');
        dayStatus.className = 'day-status';
        
        // Add status icon and tooltip based on day ranges
        dayStatus.innerHTML = '<i class="fas fa-circle" style="color: var(--warning-color);"></i>';
        
        if (i <= 7) {
            addDayTooltip(dayLink, 'Pinyin system, tones, and pronunciation basics');
        } else if (i <= 14) {
            addDayTooltip(dayLink, 'Essential daily phrases and basic grammar');
        } else if (i <= 22) {
            addDayTooltip(dayLink, 'Cultural context and daily life communication');
        } else if (i <= 30) {
            addDayTooltip(dayLink, 'Professional and business Mandarin');
        } else {
            addDayTooltip(dayLink, 'Advanced fluency and real-world applications');
        }
        
        dayLink.appendChild(dayNumber);
        dayLink.appendChild(dayStatus);
        dayGrid.appendChild(dayLink);
    }
    
    // Update progress based on available lessons
    updateProgress(0); // Reset progress to 0
}

// Initialize day grid pagination
function initializeDayPagination() {
    const prevButton = document.getElementById('prevDays');
    const nextButton = document.getElementById('nextDays');
    
    if (prevButton && nextButton) {
        prevButton.addEventListener('click', function() {
            if (currentDayPage > 1) {
                currentDayPage--;
                generateDayGrid();
                
                // Scroll animation
                document.querySelector('.day-grid').classList.add('animate-fade-in');
                setTimeout(() => {
                    document.querySelector('.day-grid').classList.remove('animate-fade-in');
                }, 800);
            }
        });
        
        nextButton.addEventListener('click', function() {
            if (currentDayPage < Math.ceil(totalDays / daysPerPage)) {
                currentDayPage++;
                generateDayGrid();
                
                // Scroll animation
                document.querySelector('.day-grid').classList.add('animate-fade-in');
                setTimeout(() => {
                    document.querySelector('.day-grid').classList.remove('animate-fade-in');
                }, 800);
            }
        });
    }
}

function addDayTooltip(element, text) {
    element.setAttribute('title', text);
}

function initializeLanguageCards() {
    const cards = document.querySelectorAll('.language-card');
    const languages = {
        'zh': 'zh-CN',
        'pinyin': 'en',
        'en': 'en'
    };
    
    cards.forEach((card, index) => {
        const language = Object.keys(languages)[index];
        if (language) {
            card.addEventListener('click', function() {
                const htmlLang = languages[language];
                
                // Update selected language
                document.querySelectorAll('.language-card').forEach(c => {
                    c.style.opacity = '0.7';
                    c.style.transform = 'none';
                });
                this.style.opacity = '1';
                this.style.transform = 'translateY(-10px)';
                
                // Set language
                setLanguage(htmlLang);
                
                // Update day grid links
                updateDayGridLanguage(language);
                
                // Scroll to day selection
                document.querySelector('#day-selection').scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            });
            
            // Add hover effects
            card.addEventListener('mouseenter', function() {
                if (this.style.opacity !== '0.7') {
                    this.style.transform = 'translateY(-10px)';
                    this.style.boxShadow = '0 15px 30px rgba(0,0,0,0.15)';
                }
            });
            
            card.addEventListener('mouseleave', function() {
                if (this.style.opacity !== '0.7') {
                    this.style.transform = 'translateY(0)';
                    this.style.boxShadow = '0 10px 20px rgba(0,0,0,0.1)';
                }
            });
        }
    });
}

function updateDayGridLanguage(language) {
    const dayLinks = document.querySelectorAll('.day-grid a');
    dayLinks.forEach(link => {
        const day = link.querySelector('.day-number').textContent;
        link.href = `day.html?day=${day}&lang=${language}`;
    });
}
function initializeScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Apply different animations based on element type
                if (entry.target.classList.contains('section-card')) {
                    entry.target.classList.add('animate-slide-right');
                } else if (entry.target.classList.contains('benefit-card')) {
                    entry.target.classList.add('animate-slide-left');
                } else {
                    entry.target.classList.add('animate-fade-in');
                }
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });
    
    // Observe all sections, cards, and course sections
    document.querySelectorAll('section, .language-card, .section-card, .benefit-card, .section-divider').forEach(el => {
        if (!el.classList.contains('animate-fade-in') &&
            !el.classList.contains('animate-slide-right') &&
            !el.classList.contains('animate-slide-left')) {
            observer.observe(el);
        }
    });
    
    // Add floating animation to visual anchors
    document.querySelectorAll('.visual-anchor').forEach(anchor => {
        anchor.classList.add('animate-float');
    });
}

// Initialize micro-interactions
function initializeMicroInteractions() {
    // Add pulse animation to section dividers
    document.querySelectorAll('.section-divider').forEach(divider => {
        divider.classList.add('animate-pulse');
    });
    
    // Add hover effects to benefit cards
    document.querySelectorAll('.benefit-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.background = 'linear-gradient(135deg, white, #f8f9fa)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.background = 'white';
        });
    });
    
    // Add hover effects to course section cards
    document.querySelectorAll('.section-card').forEach((card, index) => {
        card.addEventListener('mouseenter', function() {
            this.style.borderLeftWidth = '8px';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.borderLeftWidth = '4px';
        });
    });
}

// Progress tracking
function updateProgress(day) {
    const progressFills = document.querySelectorAll('.progress-fill');
    const progress = (day / 40) * 100;
    
    progressFills.forEach(fill => {
        fill.style.width = `${progress}%`;
    });
    
    // Update all progress texts
    document.querySelectorAll('.progress-container p').forEach(text => {
        text.textContent = `Progress: Day ${day}/40`;
    });
}

// Helper function to format dates
function formatDate(date) {
    const lang = document.documentElement.lang;
    return new Intl.DateTimeFormat(lang === 'zh-CN' ? 'zh-CN' : 'en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }).format(date);
}

// Error handling
function handleError(error) {
    console.error('An error occurred:', error);
    const main = document.querySelector('main');
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error animate-fade-in';
    const lang = document.documentElement.lang;
    errorDiv.innerHTML = lang === 'zh-CN' ?
        '<span class="zh">发生错误。请稍后再试。</span>' :
        '<span class="en">An error occurred. Please try again later.</span>';
    main.prepend(errorDiv);
}
