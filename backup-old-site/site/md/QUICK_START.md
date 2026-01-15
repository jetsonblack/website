# Quick Start Guide - Retro Portfolio Flask App

## What You Have

Your Figma design has been converted to a fully functional Flask application with:
- Draggable Windows 95-style interface
- Interactive portfolio sections
- Retro aesthetic with modern web technologies

## How to Run

### Option 1: Quick Start (Recommended)
```bash
cd flask_portfolio
pip install -r requirements.txt
python app.py
```
Then open your browser to: http://localhost:5000

### Option 2: With Virtual Environment (Best Practice)
```bash
cd flask_portfolio
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

## What Each File Does

### Backend (Flask)
- `app.py` - Main Flask application, runs the web server
- `requirements.txt` - Python packages needed

### Frontend
- `templates/index.html` - Main HTML structure with all content
- `static/css/styles.css` - Retro Windows 95 styling
- `static/js/draggable.js` - Window dragging and management logic

## Customization Guide

### 1. Change Your Name and Info
Edit `templates/index.html`:
- Line 35: `<h1 class="hero-title">hi! i'm shar</h1>` → Change "shar" to your name
- Lines 85-172: Update all template content with your information

### 2. Change Colors
Edit `static/css/styles.css`:
```css
:root {
    --primary: #ff6b35;  /* Change this to your brand color */
    --bg-gradient-start: #e3f2fd;  /* Light blue background */
    --bg-gradient-end: #90caf9;    /* Darker blue background */
}
```

### 3. Change Fonts
In `templates/index.html`, line 7, update the Google Fonts import:
```html
<link href="https://fonts.googleapis.com/css2?family=YOUR_FONT&display=swap" rel="stylesheet">
```

## Interactive Features

- **Draggable Windows**: Click and drag the title bar to move windows
- **Multiple Windows**: Click icons to open multiple windows simultaneously
- **Window Stacking**: Click any window to bring it to front
- **Close Windows**: Click [x] button on any window except the main one

## Deployment Options

### Heroku
```bash
# Add Procfile
echo "web: gunicorn app:app" > Procfile
# Deploy
git init
heroku create
git push heroku main
```

### PythonAnywhere
1. Upload the entire `flask_portfolio` folder
2. Set up a web app pointing to `app.py`
3. Install requirements in the console

### Vercel/Netlify
Use a WSGI server wrapper for these platforms.

## Troubleshooting

### Port 5000 already in use?
Change the port in `app.py`:
```python
app.run(debug=True, host='0.0.0.0', port=8080)
```

### CSS/JS not loading?
Make sure you're in the `flask_portfolio` directory when running `python app.py`

### Windows not dragging?
Check browser console for JavaScript errors. Most modern browsers should work.

## Next Steps

1. Replace the placeholder content with your real information
2. Add your actual projects and work samples
3. Update social media links
4. Add real images (replace the gradient circle in About section)
5. Deploy to a hosting service

Enjoy your retro portfolio! 🎨
