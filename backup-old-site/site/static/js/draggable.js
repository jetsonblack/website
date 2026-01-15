// Window Management System
class WindowManager {
    constructor() {
        this.windows = [];
        this.zIndexCounter = 100;
        this.init();
    }

    init() {
        // Position hero window in center
        const heroWindow = document.querySelector('.hero-window');
        if (heroWindow) {
            const centerX = (window.innerWidth - heroWindow.offsetWidth) / 2;
            heroWindow.style.left = `${centerX}px`;
            heroWindow.style.top = '100px';
            this.makeDraggable(heroWindow, false);
        }

        // Setup icon click handlers
        document.querySelectorAll('.desktop-icon').forEach(icon => {
            icon.addEventListener('click', (e) => {
                const windowType = icon.dataset.window;
                this.openWindow(windowType);
            });
        });
    }

    openWindow(type) {
        const template = document.getElementById(`${type}-template`);
        if (!template) return;

        const windowId = `${type}-${Date.now()}`;
        const windowEl = this.createWindow(windowId, this.capitalizeFirst(type), template.content.cloneNode(true));
        
        document.querySelector('.desktop').appendChild(windowEl);
        this.windows.push({ id: windowId, element: windowEl });
        
        // Position with offset
        const offsetX = 100 + (this.windows.length * 30);
        const offsetY = 50 + (this.windows.length * 30);
        windowEl.style.left = `${offsetX}px`;
        windowEl.style.top = `${offsetY}px`;
        
        this.makeDraggable(windowEl, true);
        this.bringToFront(windowEl);
    }

    createWindow(id, title, content) {
        const windowEl = document.createElement('div');
        windowEl.className = 'window dynamic-window';
        windowEl.dataset.windowId = id;
        
        const titleBar = document.createElement('div');
        titleBar.className = 'window-titlebar';
        
        const titleSpan = document.createElement('span');
        titleSpan.className = 'window-title';
        titleSpan.textContent = title;
        
        const closeBtn = document.createElement('button');
        closeBtn.className = 'close-btn';
        closeBtn.textContent = '[x]';
        closeBtn.addEventListener('click', () => this.closeWindow(id));
        
        titleBar.appendChild(titleSpan);
        titleBar.appendChild(closeBtn);
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'window-content';
        contentDiv.appendChild(content);
        
        windowEl.appendChild(titleBar);
        windowEl.appendChild(contentDiv);
        
        return windowEl;
    }

    closeWindow(id) {
        const index = this.windows.findIndex(w => w.id === id);
        if (index !== -1) {
            const window = this.windows[index];
            window.element.style.animation = 'fadeOut 0.2s ease-out';
            setTimeout(() => {
                window.element.remove();
                this.windows.splice(index, 1);
            }, 200);
        }
    }

    makeDraggable(windowEl, closable) {
        const titleBar = windowEl.querySelector('.window-titlebar');
        let isDragging = false;
        let currentX;
        let currentY;
        let initialX;
        let initialY;

        const dragStart = (e) => {
            // Don't drag if clicking close button
            if (e.target.classList.contains('close-btn')) return;
            
            initialX = e.clientX - windowEl.offsetLeft;
            initialY = e.clientY - windowEl.offsetTop;
            
            if (e.target === titleBar || titleBar.contains(e.target)) {
                isDragging = true;
                this.bringToFront(windowEl);
            }
        };

        const drag = (e) => {
            if (isDragging) {
                e.preventDefault();
                currentX = e.clientX - initialX;
                currentY = e.clientY - initialY;

                // Constrain to viewport
                const maxX = window.innerWidth - windowEl.offsetWidth;
                const maxY = window.innerHeight - 100;
                
                currentX = Math.max(0, Math.min(currentX, maxX));
                currentY = Math.max(0, Math.min(currentY, maxY));

                windowEl.style.left = `${currentX}px`;
                windowEl.style.top = `${currentY}px`;
            }
        };

        const dragEnd = () => {
            isDragging = false;
        };

        titleBar.addEventListener('mousedown', dragStart);
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', dragEnd);

        // Click to bring to front
        windowEl.addEventListener('mousedown', () => {
            this.bringToFront(windowEl);
        });
    }

    bringToFront(windowEl) {
        this.zIndexCounter++;
        windowEl.style.zIndex = this.zIndexCounter;
    }

    capitalizeFirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
}

// Add fade out animation
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeOut {
        from {
            opacity: 1;
            transform: scale(1);
        }
        to {
            opacity: 0;
            transform: scale(0.9);
        }
    }
`;
document.head.appendChild(style);

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new WindowManager();
});
