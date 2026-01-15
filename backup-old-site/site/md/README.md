# Retro Portfolio - Flask Application

A retro Windows 95-style portfolio website built with Flask, featuring draggable windows and a nostalgic desktop interface.

## Features

- 🎨 Retro Windows 95-inspired design aesthetic
- 🖱️ Fully draggable windows with smooth animations
- 📱 Responsive window management system
- 🎯 Interactive desktop icons
- 💼 Portfolio sections: About, Work, Links, FAQ, Contact
- 🎭 Custom fonts and color scheme
- ⚡ Pure JavaScript (no framework dependencies on frontend)

## Project Structure

```
flask_portfolio/
├── app.py                 # Flask application
├── requirements.txt       # Python dependencies
├── templates/
│   └── index.html        # Main HTML template
└── static/
    ├── css/
    │   └── styles.css    # Retro-styled CSS
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

### Changing Personal Information

Edit the template content in `templates/index.html`:

- **Hero section**: Update the name and subtitle in the `.hero-content` div
- **About**: Modify the `#about-template` to include your bio and education
- **Work**: Update the `#work-template` with your projects
- **Links**: Add your social media links in `#links-template`
- **FAQ**: Customize questions and answers in `#faq-template`
- **Contact**: Update contact information in `#contact-template`

### Styling

Modify `static/css/styles.css`:

- **Colors**: Change CSS variables in `:root` section
- **Fonts**: Update the Google Fonts import in `index.html`
- **Window sizes**: Adjust `.hero-window` and `.dynamic-window` widths
- **Animations**: Customize the `@keyframes` animations

### Adding New Sections

1. Add a new icon button in the hero window
2. Create a corresponding template with id `{name}-template`
3. The JavaScript will automatically handle window creation

## Technical Details

### Window System

The application uses a custom `WindowManager` class that:
- Creates draggable windows dynamically
- Manages z-index for window layering
- Handles window positioning and constraints
- Provides smooth open/close animations

### Browser Compatibility

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Uses CSS Grid and Flexbox
- Vanilla JavaScript (ES6+)

## Deployment

### Local Development
```bash
python app.py
```

### Production (with Gunicorn)
```bash
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

### Docker
```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["python", "app.py"]
```

## License

Free to use and modify for personal and commercial projects.

## Credits

Design inspired by classic Windows 95 interface with a modern twist.
