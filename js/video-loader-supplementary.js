class VideoLoaderSupplementary {
    constructor() {
        this.videos = null;
        this.pendingLoads = [];
    }

    async init() {
        try {
            console.log('Initializing supplementary video loader...');
            // Load video configuration
            const response = await fetch('videos_supplementary.json');
            if (!response.ok) {
                throw new Error('Failed to load supplementary video configuration');
            }
            const data = await response.json();
            console.log('Loaded videos_supplementary.json:', data);
            this.videos = data;
            
            // Get current page parameters
            const urlParams = new URLSearchParams(window.location.search);
            const category = urlParams.get('category') || 'education';
            let lang = urlParams.get('lang') || 'zh';
            
            // For Pinyin, use Mandarin videos
            if (lang === 'pinyin') {
                lang = 'zh';
            }
            
            // Load video for current category
            this.loadVideo(category);
            
            // Process any pending video loads
            while (this.pendingLoads.length > 0) {
                const category = this.pendingLoads.shift();
                this.loadVideo(category);
            }
        } catch (error) {
            console.error('Error initializing video loader:', error);
            this.showFallback();
        }
    }

    loadVideo(category) {
        // If videos aren't loaded yet, queue this request
        if (!this.videos) {
            console.log('Videos not loaded yet, queueing request...');
            this.pendingLoads.push(category);
            return;
        }

        const iframe = document.getElementById('youtube-video');
        const fallback = document.getElementById('video-fallback');
        const container = document.querySelector('.video-player');
        
        console.log('Looking for video with category:', category, 'in videos:', this.videos);
        
        if (this.videos && this.videos[category]) {
            const videoId = this.videos[category];
            const embedUrl = `https://www.youtube.com/embed/${videoId}`;
            console.log('Setting video URL:', embedUrl);
            
            // Set container size
            container.style.position = 'relative';
            container.style.width = '100%';
            container.style.paddingTop = '56.25%'; // 16:9 aspect ratio
            
            // Style iframe
            iframe.style.position = 'absolute';
            iframe.style.top = '0';
            iframe.style.left = '0';
            iframe.style.width = '100%';
            iframe.style.height = '100%';
            
            iframe.src = embedUrl;
            iframe.style.display = 'block';
            fallback.style.display = 'none';
        } else {
            console.warn(`No video available for category ${category}`);
            this.showFallback();
        }
    }

    showFallback() {
        const iframe = document.getElementById('youtube-video');
        const fallback = document.getElementById('video-fallback');
        iframe.src = '';
        iframe.style.display = 'none';
        fallback.style.display = 'block';
    }
}

// Initialize video loader when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing supplementary video loader...');
    window.videoLoader = new VideoLoaderSupplementary();
    window.videoLoader.init().catch(error => {
        console.error('Failed to initialize supplementary video loader:', error);
    });
});