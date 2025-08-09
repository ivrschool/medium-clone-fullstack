// TinyMCE Rich Text Editor Configuration
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('story-content')) {
        tinymce.init({
            selector: '#story-content',
            height: 500,
            menubar: false,
            plugins: [
                'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                'insertdatetime', 'media', 'table', 'help', 'wordcount'
            ],
            toolbar: 'undo redo | blocks | ' +
                'bold italic forecolor | alignleft aligncenter ' +
                'alignright alignjustify | bullist numlist outdent indent | ' +
                'removeformat | help',
            content_style: `
                body { 
                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Helvetica Neue", sans-serif; 
                    font-size: 18px; 
                    line-height: 1.6; 
                    color: #292929;
                    max-width: none;
                    margin: 0;
                    padding: 20px;
                }
                h1, h2, h3, h4, h5, h6 { 
                    font-weight: 600; 
                    margin-top: 2rem; 
                    margin-bottom: 1rem; 
                    line-height: 1.3;
                }
                h1 { font-size: 2.5rem; }
                h2 { font-size: 2rem; }
                h3 { font-size: 1.5rem; }
                p { 
                    margin-bottom: 1.5rem; 
                    line-height: 1.8;
                }
                blockquote {
                    border-left: 4px solid #1a8917;
                    padding-left: 1.5rem;
                    margin: 2rem 0;
                    font-style: italic;
                    color: #757575;
                }
                ul, ol {
                    margin-bottom: 1.5rem;
                }
                li {
                    margin-bottom: 0.5rem;
                }
                a {
                    color: #1a8917;
                    text-decoration: underline;
                }
                a:hover {
                    color: #156c14;
                }
                code {
                    background-color: #f5f5f5;
                    padding: 2px 6px;
                    border-radius: 3px;
                    font-family: 'Courier New', monospace;
                    font-size: 0.9em;
                }
                pre {
                    background-color: #f5f5f5;
                    padding: 1rem;
                    border-radius: 5px;
                    overflow-x: auto;
                    margin: 1.5rem 0;
                }
                img {
                    max-width: 100%;
                    height: auto;
                    border-radius: 5px;
                    margin: 1rem 0;
                }
            `,
            placeholder: 'Tell your story...',
            toolbar_mode: 'sliding',
            contextmenu: 'link image table',
            skin: 'oxide',
            content_css: 'default',
            branding: false,
            elementpath: false,
            resize: true,
            statusbar: true,
            paste_data_images: true,
            automatic_uploads: false,
            file_picker_types: 'image',
            
            // Custom styles for better Medium-like experience
            style_formats: [
                {
                    title: 'Headings',
                    items: [
                        { title: 'Title', block: 'h1' },
                        { title: 'Subtitle', block: 'h2' },
                        { title: 'Heading', block: 'h3' },
                        { title: 'Subheading', block: 'h4' }
                    ]
                },
                {
                    title: 'Blocks',
                    items: [
                        { title: 'Paragraph', block: 'p' },
                        { title: 'Quote', block: 'blockquote' },
                        { title: 'Code', block: 'pre' }
                    ]
                }
            ],
            
            setup: function(editor) {
                // Auto-save functionality
                let autoSaveTimer;
                
                editor.on('input', function() {
                    clearTimeout(autoSaveTimer);
                    autoSaveTimer = setTimeout(function() {
                        // You can implement auto-save to localStorage here
                        console.log('Auto-saving content...');
                        localStorage.setItem('story_draft', editor.getContent());
                    }, 2000);
                });
                
                // Load draft on init
                editor.on('init', function() {
                    const draft = localStorage.getItem('story_draft');
                    if (draft && !editor.getContent()) {
                        editor.setContent(draft);
                    }
                });
                
                // Clear draft on form submit
                editor.getElement().form.addEventListener('submit', function() {
                    localStorage.removeItem('story_draft');
                });
                
                // Custom button for inserting dividers
                editor.ui.registry.addButton('divider', {
                    text: '---',
                    tooltip: 'Insert divider',
                    onAction: function() {
                        editor.insertContent('<hr>');
                    }
                });
                
                // Word count display
                editor.on('keyup', function() {
                    const wordCount = editor.plugins.wordcount.getWordCount();
                    const readingTime = Math.max(1, Math.round(wordCount / 200));
                    
                    // Update reading time display if element exists
                    const readingTimeEl = document.getElementById('reading-time');
                    if (readingTimeEl) {
                        readingTimeEl.textContent = `${readingTime} min read`;
                    }
                });
            }
        });
    }
    
    // Character counter for title and subtitle
    const titleInput = document.querySelector('input[name="title"]');
    const subtitleInput = document.querySelector('input[name="subtitle"]');
    
    if (titleInput) {
        addCharacterCounter(titleInput, 200);
    }
    
    if (subtitleInput) {
        addCharacterCounter(subtitleInput, 300);
    }
    
    function addCharacterCounter(input, maxLength) {
        const counter = document.createElement('small');
        counter.className = 'text-muted float-end';
        counter.textContent = `0/${maxLength}`;
        
        input.parentNode.appendChild(counter);
        
        input.addEventListener('input', function() {
            const length = this.value.length;
            counter.textContent = `${length}/${maxLength}`;
            
            if (length > maxLength * 0.9) {
                counter.className = 'text-warning float-end';
            } else if (length >= maxLength) {
                counter.className = 'text-danger float-end';
            } else {
                counter.className = 'text-muted float-end';
            }
        });
    }
    
    // Form validation enhancement
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            const submitBtn = form.querySelector('input[type="submit"], button[type="submit"]');
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.classList.add('loading');
                
                // Re-enable after 3 seconds in case of error
                setTimeout(() => {
                    submitBtn.disabled = false;
                    submitBtn.classList.remove('loading');
                }, 3000);
            }
        });
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Reading progress indicator for story pages
    if (document.querySelector('.story-content')) {
        createReadingProgressBar();
    }
    
    function createReadingProgressBar() {
        const progressBar = document.createElement('div');
        progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 0%;
            height: 3px;
            background-color: #1a8917;
            z-index: 9999;
            transition: width 0.3s ease;
        `;
        document.body.appendChild(progressBar);
        
        window.addEventListener('scroll', function() {
            const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
            progressBar.style.width = Math.min(scrollPercent, 100) + '%';
        });
    }
});

// Utility functions for enhanced UX
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `alert alert-${type} position-fixed`;
    toast.style.cssText = `
        top: 20px;
        right: 20px;
        z-index: 1050;
        min-width: 250px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    `;
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + S to save (if in editor)
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        const form = document.querySelector('form');
        if (form && (window.location.pathname.includes('/write') || window.location.pathname.includes('/edit'))) {
            e.preventDefault();
            form.querySelector('input[type="submit"]').click();
        }
    }
    
    // Ctrl/Cmd + Enter to publish
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        const publishCheckbox = document.querySelector('input[name="published"]');
        if (publishCheckbox) {
            publishCheckbox.checked = true;
            publishCheckbox.form.querySelector('input[type="submit"]').click();
        }
    }
});
