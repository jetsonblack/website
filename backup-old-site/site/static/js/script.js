// Window management
let windows = [];
let zIndexCounter = 100;
let draggedWindow = null;
let dragOffset = { x: 0, y: 0 };

// Window content templates
const windowTemplates = {
    about: 'about-template',
    work: 'work-template',
    links: 'links-template',
    faq: 'faq-template',
    contact: 'contact-template'
};

// Window titles
const windowTitles = {
    about: 'about',
    work: 'work',
    links: 'links',
    faq: 'faq',
    contact: 'contact'
};

// Open a new window
function openWindow(type) {
    const windowId = `${type}-${Date.now()}`;
    const template = document.getElementById(windowTemplates[type]);
    
    if (!template) {
        console.error('Template not found:', type);
        return;
    }
    
    // Create window element
    const windowEl = document.createElement('div');
    windowEl.className = 'window draggable-window';
    windowEl.id = windowId;
    
    // Calculate initial position with offset
    const offsetMultiplier = windows.length;
    const initialX = 100 + (offsetMultiplier * 30);
    const initialY = 50 + (offsetMultiplier * 30);
    
    windowEl.style.left = `${initialX}px`;
    windowEl.style.top = `${initialY}px`;
    windowEl.style.zIndex = ++zIndexCounter;
    
    // Create window header
    const header = document.createElement('div');
    header.className = 'window-header';
    header.innerHTML = `
        <span>${windowTitles[type]}</span>
        <button class="close-button" onclick="closeWindow('${windowId}')">[x]</button>
    `;
    
    // Create window content
    const content = document.createElement('div');
    content.className = 'window-content';
    content.appendChild(template.content.cloneNode(true));
    
    // Assemble window
    windowEl.appendChild(header);
    windowEl.appendChild(content);
    
    // Add to container
    document.querySelector('.container').appendChild(windowEl);
    
    // Add drag listeners
    header.addEventListener('mousedown', startDrag);
    windowEl.addEventListener('mousedown', () => bringToFront(windowId));
    
    // Store window info
    windows.push({
        id: windowId,
        element: windowEl,
        position: { x: initialX, y: initialY }
    });
}

// Close a window
function closeWindow(windowId) {
    const windowIndex = windows.findIndex(w => w.id === windowId);
    
    if (windowIndex !== -1) {
        const windowEl = document.getElementById(windowId);
        if (windowEl) {
            windowEl.remove();
        }
        windows.splice(windowIndex, 1);
    }
}

// Bring window to front
function bringToFront(windowId) {
    const windowEl = document.getElementById(windowId);
    if (windowEl) {
        windowEl.style.zIndex = ++zIndexCounter;
    }
}

// Drag functionality
function startDrag(e) {
    // Only drag if clicking on the header (not the close button)
    if (e.target.classList.contains('close-button')) {
        return;
    }
    
    draggedWindow = e.currentTarget.parentElement;
    
    // Calculate offset from mouse to window position
    const rect = draggedWindow.getBoundingClientRect();
    dragOffset.x = e.clientX - rect.left;
    dragOffset.y = e.clientY - rect.top;
    
    // Add dragging class
    e.currentTarget.classList.add('dragging');
    
    // Bring to front
    bringToFront(draggedWindow.id);
    
    // Add event listeners
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', stopDrag);
    
    e.preventDefault();
}

function drag(e) {
    if (!draggedWindow) return;
    
    // Calculate new position
    let newX = e.clientX - dragOffset.x;
    let newY = e.clientY - dragOffset.y;
    
    // Constrain to viewport
    const maxX = window.innerWidth - draggedWindow.offsetWidth;
    const maxY = window.innerHeight - 100;
    
    newX = Math.max(0, Math.min(newX, maxX));
    newY = Math.max(0, Math.min(newY, maxY));
    
    // Apply position
    draggedWindow.style.left = `${newX}px`;
    draggedWindow.style.top = `${newY}px`;
    
    // Update stored position
    const windowData = windows.find(w => w.id === draggedWindow.id);
    if (windowData) {
        windowData.position = { x: newX, y: newY };
    }
}

function stopDrag(e) {
    if (draggedWindow) {
        const header = draggedWindow.querySelector('.window-header');
        if (header) {
            header.classList.remove('dragging');
        }
    }
    
    draggedWindow = null;
    
    document.removeEventListener('mousemove', drag);
    document.removeEventListener('mouseup', stopDrag);
}

// Prevent text selection while dragging
document.addEventListener('selectstart', (e) => {
    if (draggedWindow) {
        e.preventDefault();
    }
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    console.log('Portfolio website loaded');
});
