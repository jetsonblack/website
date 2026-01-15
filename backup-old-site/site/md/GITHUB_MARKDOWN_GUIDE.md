# GitHub Markdown Styling - What Changed

This document explains the key changes made to implement GitHub-style markdown formatting in your Flask portfolio.

## Key Changes

### 1. HTML Structure
**Before:**
```html
<div class="window-section">
    <h2 class="section-title">Your Name</h2>
    <p class="text-muted">Job title</p>
    <ul class="feature-list">
        <li>create <span class="highlight">animations</span></li>
    </ul>
</div>
```

**After:**
```html
<div class="markdown-body">
    <h1>Your Name</h1>
    <p>Job title</p>
    <ul>
        <li>create <strong>animations</strong></li>
    </ul>
</div>
```

### 2. Typography
**Before:**
- Custom class-based styling
- Courier Prime monospace throughout
- Manual spacing with utility classes

**After:**
- GitHub's system font stack
- Semantic HTML with automatic styling
- Consistent spacing via CSS

### 3. Visual Elements

#### Headings
- **H1**: Large with bottom border (28px, primary color)
- **H2**: Medium with bottom border (22px, dark text)
- **H3**: Smaller, no border (18px)

#### Blockquotes
- Left border in primary color
- Light background tint
- Padding for visual separation

#### Code Elements
- Inline `code` with gray background
- Proper monospace font (Courier Prime)
- Rounded corners for polish

#### Links
- Blue color (#0969da) - GitHub standard
- Underline on hover
- Clear visual affordance

## CSS Classes Reference

### Main Container
```css
.markdown-body {
    /* GitHub-style base formatting */
    font-family: system fonts;
    font-size: 14px;
    line-height: 1.6;
}
```

### Headers
```css
.markdown-body h1 {
    font-size: 28px;
    border-bottom: 1px solid #e1e4e8;
    color: var(--primary);
}

.markdown-body h2 {
    font-size: 22px;
    border-bottom: 1px solid #e1e4e8;
}

.markdown-body h3 {
    font-size: 18px;
}
```

### Content Elements
```css
.markdown-body blockquote {
    border-left: 4px solid var(--primary);
    background: rgba(255, 107, 53, 0.05);
    padding: 12px 16px;
}

.markdown-body code {
    background: rgba(175, 184, 193, 0.2);
    padding: 2px 6px;
    border-radius: 6px;
}

.markdown-body strong {
    font-weight: 600;
    color: var(--primary);
}
```

## Content Formatting Examples

### About Section
```html
<div class="markdown-body">
    <!-- Profile header with avatar -->
    <div class="profile-header">
        <div class="profile-avatar"></div>
        <div class="profile-info">
            <h1>Name</h1>
            <p>Title</p>
        </div>
    </div>
    
    <hr>
    
    <!-- Bio paragraph -->
    <p>Introduction text...</p>
    
    <!-- Feature list -->
    <ul>
        <li>create <strong>animations</strong></li>
        <li>create <strong>videos</strong></li>
    </ul>
    
    <!-- Education section -->
    <h2>EDUCATION</h2>
    <blockquote>
        <p><strong>Degree Name</strong></p>
        <p><em>University, Year</em></p>
    </blockquote>
</div>
```

### Work Section
```html
<div class="markdown-body">
    <h1>Work Portfolio</h1>
    
    <!-- Call to action -->
    <blockquote>
        <p><strong>Accepting work via <a href="#">email</a>!</strong></p>
    </blockquote>
    
    <!-- Tools as inline code blocks -->
    <h2>TOOLS</h2>
    <p>
        <code>Photoshop</code> 
        <code>Animate</code> 
        <code>Unity</code>
    </p>
    
    <!-- Project listings -->
    <h3>📱 Project Name</h3>
    <p>Description with <a href="#">link</a>.</p>
</div>
```

### Links Section
```html
<div class="markdown-body">
    <h1>Links</h1>
    
    <h2>Social Media</h2>
    <ul>
        <li>🐦 <a href="#">Twitter</a></li>
        <li>📺 <a href="#">YouTube</a></li>
    </ul>
    
    <blockquote>
        <p>Links open in new tab!</p>
    </blockquote>
</div>
```

## Benefits of GitHub Markdown Styling

1. **Familiar**: Users are accustomed to this format from GitHub, README files
2. **Readable**: Clear hierarchy and spacing improves comprehension
3. **Professional**: Clean, polished appearance
4. **Maintainable**: Semantic HTML is easier to update
5. **Accessible**: Proper heading structure helps screen readers
6. **Flexible**: Easy to add new markdown elements
7. **Consistent**: Uniform styling across all windows

## Migration Tips

### Converting Existing Content
1. Replace `<div class="window-section">` with `<div class="markdown-body">`
2. Change `<h2 class="section-title">` to `<h1>`
3. Replace `<span class="highlight">` with `<strong>`
4. Remove utility classes (`mb-3`, `mt-3`, etc.)
5. Let CSS handle spacing automatically

### Adding New Content
1. Always wrap in `<div class="markdown-body">`
2. Use semantic HTML (h1, h2, h3)
3. Add `<hr>` for visual breaks
4. Use `<blockquote>` for callouts
5. Use `<code>` for technical terms
6. Use `<strong>` for emphasis

### Custom Styling
If you need custom styles within markdown:
```css
.markdown-body .custom-class {
    /* Your custom styles */
}
```

## Color Variables

The styling uses CSS variables for easy theming:

```css
:root {
    --primary: #ff6b35;        /* Main accent color */
    --text-dark: #2d3748;      /* Primary text */
    --text-muted: #718096;     /* Secondary text */
}
```

Change these in `styles.css` to match your brand!

## Emoji Support

The markdown styling works great with emojis:
- Use in headings: `<h3>📱 Mobile App</h3>`
- Use in lists: `<li>🎨 Design work</li>`
- Use for visual interest: `<p>💡 <strong>Tip:</strong> ...</p>`

## Future Enhancements

Possible additions:
- Task lists (`[ ]` and `[x]`)
- Definition lists
- Footnotes
- Table of contents
- Syntax highlighting for code blocks
- Collapsible sections

---

**That's it!** Your Flask portfolio now has professional GitHub-style markdown formatting that's both beautiful and functional.
