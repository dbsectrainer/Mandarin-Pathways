/**
 * Character Drawing Module
 * Provides canvas-based drawing functionality for Chinese character practice
 */

// Configuration
const config = {
    canvasSize: 200,          // Size of the canvas in pixels
    lineWidth: 3,             // Width of the drawing line
    lineColor: '#333',        // Color of the drawing line
    backgroundColor: '#f8f8f8', // Background color of the canvas
    gridColor: '#e0e0e0',     // Color of the grid lines
    showGrid: true,           // Whether to show the grid
    showStrokeOrder: true,    // Whether to show stroke order hints
    strokeOrderDelay: 1000,   // Delay between stroke order hints in ms
};

// Character Drawing Class
class CharacterDrawing {
    /**
     * Initialize a new character drawing canvas
     * @param {HTMLElement} container - The container element
     * @param {Object} character - Character data (character, strokes, etc.)
     * @param {Object} options - Optional configuration overrides
     */
    constructor(container, character, options = {}) {
        this.container = container;
        this.character = character;
        this.options = { ...config, ...options };
        this.isDrawing = false;
        this.currentStroke = [];
        this.strokes = [];
        this.undoStack = [];
        
        this.initializeCanvas();
        this.setupEventListeners();
        this.createControls();
        
        // Initial render
        this.render();
    }
    
    /**
     * Initialize the canvas element
     */
    initializeCanvas() {
        // Create canvas container
        this.canvasContainer = document.createElement('div');
        this.canvasContainer.className = 'character-canvas-container';
        this.canvasContainer.style.position = 'relative';
        this.canvasContainer.style.width = `${this.options.canvasSize}px`;
        this.canvasContainer.style.height = `${this.options.canvasSize}px`;
        this.canvasContainer.style.margin = '0 auto';
        this.canvasContainer.style.border = '1px solid #ccc';
        this.canvasContainer.style.borderRadius = '5px';
        this.canvasContainer.style.overflow = 'hidden';
        this.canvasContainer.style.backgroundColor = this.options.backgroundColor;
        
        // Create drawing canvas
        this.canvas = document.createElement('canvas');
        this.canvas.width = this.options.canvasSize;
        this.canvas.height = this.options.canvasSize;
        this.canvas.style.position = 'absolute';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.zIndex = '2';
        this.canvas.style.cursor = 'crosshair';
        
        // Create background canvas for grid and reference character
        this.bgCanvas = document.createElement('canvas');
        this.bgCanvas.width = this.options.canvasSize;
        this.bgCanvas.height = this.options.canvasSize;
        this.bgCanvas.style.position = 'absolute';
        this.bgCanvas.style.top = '0';
        this.bgCanvas.style.left = '0';
        this.bgCanvas.style.zIndex = '1';
        
        // Add canvases to container
        this.canvasContainer.appendChild(this.bgCanvas);
        this.canvasContainer.appendChild(this.canvas);
        
        // Add container to parent container
        this.container.appendChild(this.canvasContainer);
        
        // Get contexts
        this.ctx = this.canvas.getContext('2d');
        this.bgCtx = this.bgCanvas.getContext('2d');
        
        // Set line style
        this.ctx.lineWidth = this.options.lineWidth;
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
        this.ctx.strokeStyle = this.options.lineColor;
    }
    
    /**
     * Set up event listeners for drawing
     */
    setupEventListeners() {
        // Mouse events
        this.canvas.addEventListener('mousedown', this.startDrawing.bind(this));
        this.canvas.addEventListener('mousemove', this.draw.bind(this));
        this.canvas.addEventListener('mouseup', this.endDrawing.bind(this));
        this.canvas.addEventListener('mouseout', this.endDrawing.bind(this));
        
        // Touch events
        this.canvas.addEventListener('touchstart', this.handleTouchStart.bind(this));
        this.canvas.addEventListener('touchmove', this.handleTouchMove.bind(this));
        this.canvas.addEventListener('touchend', this.handleTouchEnd.bind(this));
    }
    
    /**
     * Create control buttons
     */
    createControls() {
        // Create controls container
        this.controlsContainer = document.createElement('div');
        this.controlsContainer.className = 'character-drawing-controls';
        this.controlsContainer.style.display = 'flex';
        this.controlsContainer.style.justifyContent = 'center';
        this.controlsContainer.style.gap = '10px';
        this.controlsContainer.style.marginTop = '10px';
        
        // Create clear button
        this.clearButton = document.createElement('button');
        this.clearButton.className = 'character-drawing-btn clear-btn';
        this.clearButton.innerHTML = '<i class="fas fa-eraser"></i> Clear';
        this.clearButton.style.padding = '5px 10px';
        this.clearButton.style.backgroundColor = '#f8f8f8';
        this.clearButton.style.border = '1px solid #ccc';
        this.clearButton.style.borderRadius = '3px';
        this.clearButton.style.cursor = 'pointer';
        this.clearButton.addEventListener('click', this.clear.bind(this));
        
        // Create undo button
        this.undoButton = document.createElement('button');
        this.undoButton.className = 'character-drawing-btn undo-btn';
        this.undoButton.innerHTML = '<i class="fas fa-undo"></i> Undo';
        this.undoButton.style.padding = '5px 10px';
        this.undoButton.style.backgroundColor = '#f8f8f8';
        this.undoButton.style.border = '1px solid #ccc';
        this.undoButton.style.borderRadius = '3px';
        this.undoButton.style.cursor = 'pointer';
        this.undoButton.addEventListener('click', this.undo.bind(this));
        
        // Create hint button
        this.hintButton = document.createElement('button');
        this.hintButton.className = 'character-drawing-btn hint-btn';
        this.hintButton.innerHTML = '<i class="fas fa-lightbulb"></i> Hint';
        this.hintButton.style.padding = '5px 10px';
        this.hintButton.style.backgroundColor = '#f8f8f8';
        this.hintButton.style.border = '1px solid #ccc';
        this.hintButton.style.borderRadius = '3px';
        this.hintButton.style.cursor = 'pointer';
        this.hintButton.addEventListener('click', this.showHint.bind(this));
        
        // Add buttons to controls container
        this.controlsContainer.appendChild(this.clearButton);
        this.controlsContainer.appendChild(this.undoButton);
        this.controlsContainer.appendChild(this.hintButton);
        
        // Add controls to parent container
        this.container.appendChild(this.controlsContainer);
    }
    
    /**
     * Start drawing on mouse down
     * @param {MouseEvent} e - Mouse event
     */
    startDrawing(e) {
        this.isDrawing = true;
        this.currentStroke = [];
        
        const point = this.getPointFromEvent(e);
        this.currentStroke.push(point);
        
        this.ctx.beginPath();
        this.ctx.moveTo(point.x, point.y);
        this.ctx.lineTo(point.x, point.y);
        this.ctx.stroke();
    }
    
    /**
     * Draw on mouse move
     * @param {MouseEvent} e - Mouse event
     */
    draw(e) {
        if (!this.isDrawing) return;
        
        const point = this.getPointFromEvent(e);
        this.currentStroke.push(point);
        
        this.ctx.beginPath();
        this.ctx.moveTo(this.currentStroke[this.currentStroke.length - 2].x, this.currentStroke[this.currentStroke.length - 2].y);
        this.ctx.lineTo(point.x, point.y);
        this.ctx.stroke();
    }
    
    /**
     * End drawing on mouse up
     */
    endDrawing() {
        if (!this.isDrawing) return;
        
        this.isDrawing = false;
        if (this.currentStroke.length > 0) {
            this.strokes.push([...this.currentStroke]);
            this.undoStack = [];
        }
    }
    
    /**
     * Handle touch start event
     * @param {TouchEvent} e - Touch event
     */
    handleTouchStart(e) {
        e.preventDefault();
        const touch = e.touches[0];
        const mouseEvent = new MouseEvent('mousedown', {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        this.canvas.dispatchEvent(mouseEvent);
    }
    
    /**
     * Handle touch move event
     * @param {TouchEvent} e - Touch event
     */
    handleTouchMove(e) {
        e.preventDefault();
        const touch = e.touches[0];
        const mouseEvent = new MouseEvent('mousemove', {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        this.canvas.dispatchEvent(mouseEvent);
    }
    
    /**
     * Handle touch end event
     * @param {TouchEvent} e - Touch event
     */
    handleTouchEnd(e) {
        e.preventDefault();
        const mouseEvent = new MouseEvent('mouseup');
        this.canvas.dispatchEvent(mouseEvent);
    }
    
    /**
     * Get point coordinates from mouse or touch event
     * @param {Event} e - Mouse or touch event
     * @returns {Object} Point coordinates
     */
    getPointFromEvent(e) {
        const rect = this.canvas.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    }
    
    /**
     * Clear the canvas
     */
    clear() {
        // Save current strokes for undo
        if (this.strokes.length > 0) {
            this.undoStack.push([...this.strokes]);
        }
        
        // Clear strokes
        this.strokes = [];
        this.currentStroke = [];
        
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    
    /**
     * Undo the last stroke
     */
    undo() {
        if (this.strokes.length === 0) {
            // If no strokes, check undo stack
            if (this.undoStack.length > 0) {
                this.strokes = this.undoStack.pop();
                this.redraw();
            }
            return;
        }
        
        // Remove last stroke
        this.strokes.pop();
        
        // Redraw
        this.redraw();
    }
    
    /**
     * Redraw all strokes
     */
    redraw() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Redraw all strokes
        for (const stroke of this.strokes) {
            if (stroke.length < 2) continue;
            
            this.ctx.beginPath();
            this.ctx.moveTo(stroke[0].x, stroke[0].y);
            
            for (let i = 1; i < stroke.length; i++) {
                this.ctx.lineTo(stroke[i].x, stroke[i].y);
            }
            
            this.ctx.stroke();
        }
    }
    
    /**
     * Show stroke order hint
     */
    showHint() {
        // Display a faded version of the character
        this.showCharacterHint();
    }
    
    /**
     * Show character hint
     */
    showCharacterHint() {
        // Save current alpha
        const currentAlpha = this.bgCtx.globalAlpha;
        
        // Draw character with transparency
        this.bgCtx.globalAlpha = 0.3;
        this.bgCtx.font = `${this.options.canvasSize * 0.8}px sans-serif`;
        this.bgCtx.textAlign = 'center';
        this.bgCtx.textBaseline = 'middle';
        this.bgCtx.fillText(
            this.character.character,
            this.bgCanvas.width / 2,
            this.bgCanvas.height / 2
        );
        
        // Restore alpha
        this.bgCtx.globalAlpha = currentAlpha;
        
        // Set timeout to clear hint
        setTimeout(() => {
            this.render();
        }, 2000);
    }
    
    /**
     * Render the canvas
     */
    render() {
        // Clear background canvas
        this.bgCtx.clearRect(0, 0, this.bgCanvas.width, this.bgCanvas.height);
        
        // Draw grid if enabled
        if (this.options.showGrid) {
            this.drawGrid();
        }
    }
    
    /**
     * Draw grid on background canvas
     */
    drawGrid() {
        const size = this.bgCanvas.width;
        const cellSize = size / 4;
        
        this.bgCtx.strokeStyle = this.options.gridColor;
        this.bgCtx.lineWidth = 1;
        
        // Draw grid lines
        this.bgCtx.beginPath();
        
        // Horizontal lines
        for (let i = 1; i < 4; i++) {
            const y = i * cellSize;
            this.bgCtx.moveTo(0, y);
            this.bgCtx.lineTo(size, y);
        }
        
        // Vertical lines
        for (let i = 1; i < 4; i++) {
            const x = i * cellSize;
            this.bgCtx.moveTo(x, 0);
            this.bgCtx.lineTo(x, size);
        }
        
        // Draw center lines
        this.bgCtx.moveTo(0, size / 2);
        this.bgCtx.lineTo(size, size / 2);
        this.bgCtx.moveTo(size / 2, 0);
        this.bgCtx.lineTo(size / 2, size);
        
        this.bgCtx.stroke();
    }
}

/**
 * Initialize character drawing for all practice cells
 */
function initializeCharacterDrawing() {
    // Find all character practice areas
    const practiceAreas = document.querySelectorAll('.practice-area');
    
    practiceAreas.forEach(area => {
        // Get character from display
        const characterDisplay = area.querySelector('.character-display');
        if (!characterDisplay) return;
        
        const character = {
            character: characterDisplay.textContent.trim(),
            // We don't have stroke data yet, but we could add it later
            strokes: []
        };
        
        // Remove existing practice grid
        const existingGrid = area.querySelector('.practice-grid');
        if (existingGrid) {
            existingGrid.remove();
        }
        
        // Create container for drawing canvases
        const drawingContainer = document.createElement('div');
        drawingContainer.className = 'drawing-container';
        drawingContainer.style.display = 'flex';
        drawingContainer.style.flexWrap = 'wrap';
        drawingContainer.style.gap = '10px';
        drawingContainer.style.justifyContent = 'center';
        
        // Create 5 drawing canvases
        for (let i = 0; i < 5; i++) {
            const canvasContainer = document.createElement('div');
            canvasContainer.className = 'canvas-container';
            canvasContainer.style.width = '200px';
            canvasContainer.style.marginBottom = '20px';
            
            drawingContainer.appendChild(canvasContainer);
            
            // Initialize drawing canvas
            new CharacterDrawing(canvasContainer, character);
        }
        
        // Add drawing container to practice area
        area.appendChild(drawingContainer);
    });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on the writing page with character practice
    const writingContent = document.getElementById('writing-content');
    if (writingContent && window.location.href.includes('type=character')) {
        // Wait for content to be loaded
        const checkInterval = setInterval(() => {
            if (document.querySelector('.practice-area')) {
                clearInterval(checkInterval);
                initializeCharacterDrawing();
            }
        }, 100);
    }
});
