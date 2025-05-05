// Notification scheduling and management
class NotificationManager {
  constructor() {
    this.NOTIFICATION_KEY = 'mandarin_pathways_notifications';
    this.DEFAULT_REMINDER_TIME = '09:00'; // Default reminder time (9 AM)
  }

  // Initialize notification settings
  async initialize() {
    if (!('Notification' in window)) {
      console.log('This browser does not support notifications');
      return;
    }

    const permission = Notification.permission;
    if (permission === 'granted') {
      this.setupNotificationPreferences();
      this.scheduleNextReminder();
    }
  }

  // Request notification permission
  async requestPermission() {
    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        this.setupNotificationPreferences();
        this.scheduleNextReminder();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  }

  // Set up notification preferences
  setupNotificationPreferences() {
    const preferences = this.getStoredPreferences();
    if (!preferences) {
      // Set default preferences
      const defaultPreferences = {
        enabled: true,
        reminderTime: this.DEFAULT_REMINDER_TIME,
        lastNotification: null,
        nextNotification: this.calculateNextNotificationTime(this.DEFAULT_REMINDER_TIME)
      };
      this.storePreferences(defaultPreferences);
    }
  }

  // Get stored notification preferences
  getStoredPreferences() {
    const stored = localStorage.getItem(this.NOTIFICATION_KEY);
    return stored ? JSON.parse(stored) : null;
  }

  // Store notification preferences
  storePreferences(preferences) {
    localStorage.setItem(this.NOTIFICATION_KEY, JSON.stringify(preferences));
  }

  // Calculate next notification time based on preferred time
  calculateNextNotificationTime(preferredTime) {
    const [hours, minutes] = preferredTime.split(':').map(Number);
    const now = new Date();
    const next = new Date(now);
    next.setHours(hours, minutes, 0, 0);

    // If the time has already passed today, schedule for tomorrow
    if (next <= now) {
      next.setDate(next.getDate() + 1);
    }

    return next.toISOString();
  }

  // Schedule the next reminder
  scheduleNextReminder() {
    const preferences = this.getStoredPreferences();
    if (!preferences || !preferences.enabled) return;

    const nextTime = new Date(preferences.nextNotification);
    const now = new Date();
    const timeUntilNext = nextTime - now;

    if (timeUntilNext > 0) {
      setTimeout(() => {
        this.showNotification();
        this.scheduleNextReminder();
      }, timeUntilNext);
    } else {
      // If we missed the time, schedule for next occurrence
      preferences.nextNotification = this.calculateNextNotificationTime(preferences.reminderTime);
      this.storePreferences(preferences);
      this.scheduleNextReminder();
    }
  }

  // Show a notification
  async showNotification() {
    if (!('serviceWorker' in navigator)) return;

    try {
      const registration = await navigator.serviceWorker.ready;
      const preferences = this.getStoredPreferences();

      // Get user's progress
      const completedDays = JSON.parse(localStorage.getItem('completedDays') || '{}');
      const totalCompleted = Object.keys(completedDays).length;
      
      // Create appropriate message based on progress
      let message;
      if (totalCompleted === 0) {
        message = "Start your Mandarin learning journey today!";
      } else {
        message = `Continue your progress! You've completed ${totalCompleted} lessons.`;
      }

      // Show notification
      await registration.showNotification('Time for Mandarin Practice!', {
        body: message,
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-96x96.png',
        vibrate: [100, 50, 100],
        data: {
          dateOfArrival: Date.now(),
          primaryKey: 1
        },
        actions: [
          {
            action: 'start',
            title: 'Start Learning',
            icon: '/icons/icon-96x96.png'
          },
          {
            action: 'settings',
            title: 'Notification Settings',
            icon: '/icons/icon-96x96.png'
          }
        ]
      });

      // Update last notification time and schedule next
      preferences.lastNotification = new Date().toISOString();
      preferences.nextNotification = this.calculateNextNotificationTime(preferences.reminderTime);
      this.storePreferences(preferences);
    } catch (error) {
      console.error('Error showing notification:', error);
    }
  }

  // Update notification settings
  updateSettings(enabled, reminderTime = this.DEFAULT_REMINDER_TIME) {
    const preferences = this.getStoredPreferences() || {};
    preferences.enabled = enabled;
    preferences.reminderTime = reminderTime;
    preferences.nextNotification = this.calculateNextNotificationTime(reminderTime);
    this.storePreferences(preferences);

    if (enabled) {
      this.scheduleNextReminder();
    }
  }
}

// Initialize notification manager when the page loads
document.addEventListener('DOMContentLoaded', () => {
  const notificationManager = new NotificationManager();
  
  // Only initialize if permission was previously granted
  if (Notification.permission === 'granted') {
    notificationManager.initialize();
  }

  // Make the notification manager available globally
  window.notificationManager = notificationManager;

  // Set up notification settings UI
  setupNotificationSettingsUI(notificationManager);
});

// Set up notification settings UI handlers
function setupNotificationSettingsUI(notificationManager) {
  // Get UI elements
  const modal = document.getElementById('notification-settings-modal');
  const enabledCheckbox = document.getElementById('notifications-enabled');
  const reminderTimeInput = document.getElementById('reminder-time');
  const saveButton = document.getElementById('save-notification-settings');
  const closeButton = document.getElementById('close-notification-settings');

  // Load current settings
  const preferences = notificationManager.getStoredPreferences() || {
    enabled: true,
    reminderTime: notificationManager.DEFAULT_REMINDER_TIME
  };

  // Set initial values
  enabledCheckbox.checked = preferences.enabled;
  reminderTimeInput.value = preferences.reminderTime;

  // Add settings button to the header
  const header = document.querySelector('header');
  const settingsButton = document.createElement('button');
  settingsButton.className = 'notification-settings-btn';
  settingsButton.innerHTML = '<i class="fas fa-bell"></i>';
  settingsButton.style.cssText = `
    position: absolute;
    right: 1rem;
    top: 1rem;
    background: transparent;
    border: none;
    color: white;
    font-size: 1.2rem;
    cursor: pointer;
    padding: 0.5rem;
  `;
  header.appendChild(settingsButton);

  // Show modal when settings button is clicked
  settingsButton.addEventListener('click', () => {
    modal.style.display = 'flex';
  });

  // Save settings
  saveButton.addEventListener('click', async () => {
    if (enabledCheckbox.checked && Notification.permission !== 'granted') {
      const granted = await notificationManager.requestPermission();
      if (!granted) {
        enabledCheckbox.checked = false;
        alert('Please enable notifications in your browser settings to receive reminders.');
        return;
      }
    }
    
    notificationManager.updateSettings(
      enabledCheckbox.checked,
      reminderTimeInput.value
    );
    modal.style.display = 'none';
  });

  // Close modal
  closeButton.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  // Close modal when clicking outside
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  });

  // Handle notification click events
  navigator.serviceWorker.addEventListener('message', (event) => {
    if (event.data.type === 'notificationClick') {
      if (event.data.action === 'settings') {
        modal.style.display = 'flex';
      }
    }
  });
}
