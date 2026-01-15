# Retro Portfolio - Flask Application (GitHub Markdown Edition)

A retro Windows 95-style portfolio website built with Flask, featuring draggable windows and **GitHub-style markdown formatting** in each window.

## Features

- 🎨 Retro Windows 95-inspired design aesthetic
- 🖱️ Fully draggable windows with smooth animations
- 📝 **GitHub-style markdown formatting** for clean, readable content
- 📱 Responsive window management system
- 🎯 Interactive desktop icons
- 💼 Portfolio sections: About, Work, Links, FAQ, Contact
- 🎭 Custom fonts and color scheme
- ⚡ Pure JavaScript (no framework dependencies on frontend)

## What's New: GitHub Markdown Styling

Each window now features beautiful GitHub-style markdown formatting:

### Markdown Elements
- ✨ **Headers** with bottom borders (H1, H2)
- 📋 **Lists** with proper indentation
- 💬 **Blockquotes** with left border accent
- 🔗 **Links** with hover effects
- 💻 **Code blocks** with background highlighting
- ➖ **Horizontal rules** for section breaks
- 🎯 **Emphasis** (bold, italic)
- 📊 **Tables** (if needed)

### Styling Features
- Clean, sans-serif typography (system fonts)
- Proper spacing and line-height
- Color-coded elements (primary color for headings, links)
- Responsive padding and margins
- Professional, readable layout

## Project Structure

```
flask_portfolio/
├── app.py                 # Flask application
├── requirements.txt       # Python dependencies
├── templates/
│   └── index.html        # Main HTML with markdown templates
└── static/
    ├── css/
    │   └── styles.css    # Retro + GitHub markdown styles
    └── js/
        └── draggable.js  # Window management system
```

## Installation

1. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Run the Flask application:**
   ```bash
   python app.py
   ```

3. **Open your browser:**
   Navigate to `http://localhost:5000`

## Customization

### Changing Content

Edit the template sections in `templates/index.html`:

#### About Section
```html
<template id="about-template">
    <div class="markdown-body">
        <h1>Your Name</h1>
        <p>Your bio...</p>
        <h2>EDUCATION</h2>
        <!-- Add your content using markdown syntax -->
    </div>
</template>
```

#### Work Section
```html
<template id="work-template">
    <div class="markdown-body">
        <h1>Work Portfolio</h1>
        <h3>Project Name</h3>
        <p>Project description with <code>code snippets</code></p>
    </div>
</template>
```

### Using Markdown Elements

The `.markdown-body` class provides GitHub-style formatting:

```html
<!-- Headers -->
<h1>Main Title</h1>
<h2>Section</h2>
<h3>Subsection</h3>

<!-- Lists -->
<ul>
    <li>Item one</li>
    <li>Item two</li>
</ul>

<!-- Blockquotes -->
<blockquote>
    <p>Important note or quote</p>
</blockquote>

<!-- Code -->
<code>inline code</code>
<pre><code>code block</code></pre>

<!-- Links -->
<a href="#">Link text</a>

<!-- Emphasis -->
<strong>Bold text</strong>
<em>Italic text</em>

<!-- Horizontal Rule -->
<hr>
```

### Styling

Modify `static/css/styles.css`:

**Change Colors:**
```css
:root {
    --primary: #ff6b35;  /* Change this to your brand color */
    --bg-gradient-start: #e3f2fd;
    --bg-gradient-end: #90caf9;
}
```

**Modify Markdown Styles:**
```css
.markdown-body h1 {
    font-size: 28px;
    color: var(--primary);
    /* Customize as needed */
}
```

**Change Fonts:**
In `templates/index.html`, update the Google Fonts import:
```html
<link href="https://fonts.googleapis.com/css2?family=YOUR_FONT&display=swap" rel="stylesheet">
```

## Interactive Features

- **Draggable Windows**: Click and drag the title bar to move windows
- **Multiple Windows**: Click icons to open multiple windows simultaneously
- **Window Stacking**: Click any window to bring it to front
- **Close Windows**: Click [x] button on any window except the main one

## Markdown Content Best Practices

1. **Use semantic HTML**: Proper heading hierarchy (h1 → h2 → h3)
2. **Keep content scannable**: Use lists, blockquotes, and code blocks
3. **Add visual breaks**: Use horizontal rules to separate sections
4. **Highlight key info**: Use `<strong>` for emphasis and `<code>` for technical terms
5. **Link appropriately**: Make links descriptive and add `target="_blank"` for external sites

## Example Content Formatting

```html
<div class="markdown-body">
    <h1>My Project</h1>
    
    <p>This is a brief introduction to my project.</p>
    
    <h2>Features</h2>
    <ul>
        <li>Feature one with <code>code example</code></li>
        <li>Feature two with <strong>emphasis</strong></li>
    </ul>
    
    <blockquote>
        <p>Important note about the project</p>
    </blockquote>
    
    <h2>Technologies Used</h2>
    <p><code>React</code> <code>Python</code> <code>Flask</code></p>
    
    <hr>
    
    <p>See the project on <a href="#">GitHub</a></p>
</div>
```

## Deployment

### Heroku
```bash
echo "web: gunicorn app:app" > Procfile
git init
heroku create
git push heroku main
```

### PythonAnywhere
1. Upload the entire `flask_portfolio` folder
2. Set up a web app pointing to `app.py`
3. Install requirements in the console

## Browser Compatibility

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Uses CSS Grid and Flexbox
- Vanilla JavaScript (ES6+)

## Credits

- Retro Windows 95-inspired design
- GitHub markdown styling for clean, readable content
- VT323 monospace font for retro aesthetic
- System fonts for markdown body content

## License

Free to use and modify for personal and commercial projects.
