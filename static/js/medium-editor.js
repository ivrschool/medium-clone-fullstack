// Medium-Style Editor JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const titleInput = document.getElementById('editable-title');
    const subtitleInput = document.getElementById('editable-subtitle');
    const contentInput = document.getElementById('editable-content');
    const floatingToolbar = document.getElementById('floating-toolbar');
    const form = document.getElementById('story-form');
    const statusIndicator = document.getElementById('status-indicator');
    const autoSaveStatus = document.getElementById('auto-save-status');
    
    let autoSaveTimer;
    let hasUnsavedChanges = false;
    
    // Initialize editor
    function initializeEditor() {
        // Set initial published state
        const isEditing = window.initialStoryData && window.initialStoryData.published !== undefined;
        const publishedState = isEditing ? window.initialStoryData.published : false;
        
        document.getElementById('hidden-published').checked = publishedState;
        
        // Enable rich text editing
        document.execCommand('defaultParagraphSeparator', false, 'p');
        
        // Setup event listeners
        setupEventListeners();
        setupPlusButton();
        setupImageUpload();
        
        // Focus on title if it's empty
        if (!titleInput.textContent.trim()) {
            titleInput.focus();
        }
    }
    
    function setupEventListeners() {
        // Input event listeners for auto-save
        [titleInput, subtitleInput, contentInput].forEach(element => {
            element.addEventListener('input', handleInput);
            element.addEventListener('paste', handlePaste);
            element.addEventListener('keydown', handleKeyDown);
        });
        
        // Selection change for toolbar
        document.addEventListener('selectionchange', handleSelectionChange);
        
        // Toolbar button listeners
        document.querySelectorAll('.toolbar-btn').forEach(btn => {
            btn.addEventListener('click', handleToolbarClick);
        });
        
        // Save buttons
        document.getElementById('save-draft').addEventListener('click', () => saveDraft());
        document.getElementById('publish-story').addEventListener('click', () => publishStory());
        
        // Navigation warning
        window.addEventListener('beforeunload', handleBeforeUnload);
        
        // Keyboard shortcuts
        document.addEventListener('keydown', handleKeyboardShortcuts);
    }
    
    function handleInput(e) {
        hasUnsavedChanges = true;
        updateAutoSaveStatus('Unsaved changes...');
        
        // Clear previous timer
        clearTimeout(autoSaveTimer);
        
        // Set new timer for auto-save
        autoSaveTimer = setTimeout(() => {
            autoSave();
        }, 2000);
        
        // Handle Enter key behavior
        if (e.target === titleInput && e.inputType === 'insertParagraph') {
            e.preventDefault();
            subtitleInput.focus();
        } else if (e.target === subtitleInput && e.inputType === 'insertParagraph') {
            e.preventDefault();
            contentInput.focus();
        }
    }
    
    function handlePaste(e) {
        e.preventDefault();
        
        // Get plain text from clipboard
        const text = (e.clipboardData || window.clipboardData).getData('text/plain');
        
        // Insert as plain text
        document.execCommand('insertText', false, text);
    }
    
    function handleKeyDown(e) {
        // Handle Enter key in title and subtitle
        if (e.key === 'Enter') {
            if (e.target === titleInput) {
                e.preventDefault();
                subtitleInput.focus();
            } else if (e.target === subtitleInput) {
                e.preventDefault();
                contentInput.focus();
            }
        }
        
        // Handle backspace at the beginning of content
        if (e.key === 'Backspace' && e.target === contentInput) {
            const selection = window.getSelection();
            if (selection.anchorOffset === 0 && selection.focusOffset === 0) {
                const range = selection.getRangeAt(0);
                const startContainer = range.startContainer;
                
                if (startContainer === contentInput || 
                    (startContainer.parentNode === contentInput && 
                     contentInput.firstChild === startContainer)) {
                    e.preventDefault();
                    subtitleInput.focus();
                    // Move cursor to end of subtitle
                    const range = document.createRange();
                    range.selectNodeContents(subtitleInput);
                    range.collapse(false);
                    selection.removeAllRanges();
                    selection.addRange(range);
                }
            }
        }
    }
    
    function handleSelectionChange() {
        const selection = window.getSelection();
        
        if (selection.rangeCount === 0) {
            hideToolbar();
            return;
        }
        
        const range = selection.getRangeAt(0);
        const selectedText = selection.toString();
        
        // Show toolbar only if text is selected and within content area
        if (selectedText.length > 0 && contentInput.contains(range.commonAncestorContainer)) {
            showToolbar(range);
            updateToolbarState();
        } else {
            hideToolbar();
        }
    }
    
    function showToolbar(range) {
        const rect = range.getBoundingClientRect();
        const toolbar = floatingToolbar;
        
        // Position toolbar above selection
        const top = rect.top + window.scrollY - toolbar.offsetHeight - 10;
        const left = rect.left + window.scrollX + (rect.width / 2) - (toolbar.offsetWidth / 2);
        
        toolbar.style.top = Math.max(10, top) + 'px';
        toolbar.style.left = Math.max(10, Math.min(window.innerWidth - toolbar.offsetWidth - 10, left)) + 'px';
        toolbar.style.display = 'flex';
    }
    
    function hideToolbar() {
        floatingToolbar.style.display = 'none';
    }
    
    function updateToolbarState() {
        document.querySelectorAll('.toolbar-btn').forEach(btn => {
            const command = btn.dataset.command;
            const heading = btn.dataset.heading;
            
            if (command) {
                btn.classList.toggle('active', document.queryCommandState(command));
            } else if (heading) {
                const selection = window.getSelection();
                if (selection.rangeCount > 0) {
                    const container = selection.getRangeAt(0).commonAncestorContainer;
                    const element = container.nodeType === Node.TEXT_NODE ? container.parentNode : container;
                    btn.classList.toggle('active', element.tagName && element.tagName.toLowerCase() === heading);
                }
            }
        });
    }
    
    function handleToolbarClick(e) {
        e.preventDefault();
        
        const btn = e.currentTarget;
        const command = btn.dataset.command;
        const heading = btn.dataset.heading;
        
        if (command === 'createLink') {
            const url = prompt('Enter URL:');
            if (url) {
                document.execCommand(command, false, url);
            }
        } else if (command) {
            document.execCommand(command, false, null);
        } else if (heading) {
            document.execCommand('formatBlock', false, heading);
        }
        
        // Restore focus to content
        contentInput.focus();
        
        // Update toolbar state
        setTimeout(updateToolbarState, 10);
    }
    
    function handleKeyboardShortcuts(e) {
        if (e.ctrlKey || e.metaKey) {
            switch (e.key) {
                case 's':
                    e.preventDefault();
                    saveDraft();
                    break;
                case 'Enter':
                    e.preventDefault();
                    publishStory();
                    break;
                case 'b':
                    if (contentInput.contains(document.activeElement) || document.activeElement === contentInput) {
                        e.preventDefault();
                        document.execCommand('bold');
                    }
                    break;
                case 'i':
                    if (contentInput.contains(document.activeElement) || document.activeElement === contentInput) {
                        e.preventDefault();
                        document.execCommand('italic');
                    }
                    break;
            }
        }
    }
    
    function handleBeforeUnload(e) {
        if (hasUnsavedChanges) {
            e.preventDefault();
            e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
            return e.returnValue;
        }
    }
    
    function updateHiddenFields() {
        document.getElementById('hidden-title').value = titleInput.textContent.trim();
        document.getElementById('hidden-subtitle').value = subtitleInput.textContent.trim();
        document.getElementById('hidden-content').value = contentInput.innerHTML;
    }
    
    function autoSave() {
        if (!hasUnsavedChanges) return;
        
        updateAutoSaveStatus('Saving...');
        
        // Save to localStorage as backup
        const draftData = {
            title: titleInput.textContent.trim(),
            subtitle: subtitleInput.textContent.trim(),
            content: contentInput.innerHTML,
            timestamp: Date.now()
        };
        
        localStorage.setItem('story_draft', JSON.stringify(draftData));
        
        setTimeout(() => {
            updateAutoSaveStatus('Saved to browser');
            hasUnsavedChanges = false;
        }, 500);
    }
    
    function saveDraft() {
        updateHiddenFields();
        document.getElementById('hidden-published').checked = false;
        
        // Update status
        document.querySelector('.status-text').textContent = 'Draft';
        updateAutoSaveStatus('Saving...');
        
        // Submit form
        document.getElementById('hidden-submit').click();
    }
    
    function publishStory() {
        // Validate required fields
        if (!titleInput.textContent.trim()) {
            alert('Please add a title to your story.');
            titleInput.focus();
            return;
        }
        
        if (!contentInput.textContent.trim()) {
            alert('Please add some content to your story.');
            contentInput.focus();
            return;
        }
        
        updateHiddenFields();
        document.getElementById('hidden-published').checked = true;
        
        // Update status
        document.querySelector('.status-text').textContent = 'Publishing...';
        updateAutoSaveStatus('');
        
        // Submit form
        document.getElementById('hidden-submit').click();
    }
    
    function updateAutoSaveStatus(text) {
        autoSaveStatus.textContent = text;
    }
    
    function loadDraftFromStorage() {
        const savedDraft = localStorage.getItem('story_draft');
        if (savedDraft && !titleInput.textContent.trim() && !contentInput.textContent.trim()) {
            try {
                const draftData = JSON.parse(savedDraft);
                
                // Only load if it's recent (within 24 hours)
                if (Date.now() - draftData.timestamp < 24 * 60 * 60 * 1000) {
                    if (confirm('Found a saved draft. Would you like to restore it?')) {
                        titleInput.textContent = draftData.title || '';
                        subtitleInput.textContent = draftData.subtitle || '';
                        contentInput.innerHTML = draftData.content || '';
                        hasUnsavedChanges = true;
                    }
                }
            } catch (e) {
                console.log('Could not load draft from storage');
            }
        }
    }
    
    function clearDraftFromStorage() {
        localStorage.removeItem('story_draft');
    }
    
    // Plus Button Functionality
    function setupPlusButton() {
        const plusButton = document.getElementById('plus-button');
        const plusMenu = document.getElementById('plus-menu');
        let currentLine = null;
        
        console.log('Setting up plus button functionality', {plusButton, plusMenu});
        
        if (!plusButton || !plusMenu) {
            console.error('Plus button elements not found');
            return;
        }
        
        // Show plus button on empty lines
        contentInput.addEventListener('click', handleContentClick);
        contentInput.addEventListener('keyup', handleContentKeyUp);
        contentInput.addEventListener('focus', handleContentFocus);
        
        function handleContentClick(e) {
            console.log('Content clicked', e.target);
            showPlusButtonIfNeeded(e.target);
        }
        
        function handleContentKeyUp(e) {
            console.log('Content key up', e.target);
            showPlusButtonIfNeeded(e.target);
        }
        
        function handleContentFocus(e) {
            console.log('Content focused', e.target);
            showPlusButtonIfNeeded(e.target);
        }
        
        function showPlusButtonIfNeeded(element) {
            console.log('Checking if plus button should show...');
            
            const selection = window.getSelection();
            if (selection.rangeCount === 0) {
                console.log('No selection range');
                return;
            }
            
            const range = selection.getRangeAt(0);
            
            // Simplified logic: show plus button if content is empty or at start of empty paragraph
            const contentText = contentInput.textContent.trim();
            const isEmpty = contentText === '' || contentText === '\n';
            
            console.log('Content check:', {
                contentText: contentText,
                isEmpty: isEmpty,
                contentLength: contentText.length
            });
            
            if (isEmpty) {
                // Position the plus button at the cursor location
                const rect = range.getBoundingClientRect();
                const contentRect = contentInput.getBoundingClientRect();
                
                const top = Math.max(0, rect.top - contentRect.top + contentInput.scrollTop);
                
                console.log('Showing plus button at top:', top);
                
                plusButton.style.top = top + 'px';
                plusButton.style.display = 'flex';
                currentLine = contentInput;
                
                // Also check for empty paragraph
                const currentNode = selection.anchorNode;
                if (currentNode && currentNode.nodeType === Node.ELEMENT_NODE && currentNode.tagName === 'P') {
                    if (!currentNode.textContent.trim()) {
                        currentLine = currentNode;
                    }
                }
            } else {
                // Check if we're in an empty paragraph
                let currentElement = range.commonAncestorContainer;
                if (currentElement.nodeType === Node.TEXT_NODE) {
                    currentElement = currentElement.parentNode;
                }
                
                if (currentElement.tagName === 'P' && !currentElement.textContent.trim()) {
                    const rect = currentElement.getBoundingClientRect();
                    const contentRect = contentInput.getBoundingClientRect();
                    
                    const top = Math.max(0, rect.top - contentRect.top + contentInput.scrollTop);
                    
                    console.log('Showing plus button for empty paragraph at top:', top);
                    
                    plusButton.style.top = top + 'px';
                    plusButton.style.display = 'flex';
                    currentLine = currentElement;
                } else {
                    hidePlusButton();
                }
            }
        }
        
        function hidePlusButton() {
            plusButton.style.display = 'none';
            plusMenu.style.display = 'none';
            plusButton.classList.remove('active');
        }
        
        // Plus button click
        plusButton.addEventListener('click', function(e) {
            e.stopPropagation();
            if (plusMenu.style.display === 'block') {
                plusMenu.style.display = 'none';
                plusButton.classList.remove('active');
            } else {
                plusMenu.style.display = 'block';
                plusButton.classList.add('active');
            }
        });
        
        // Plus menu items click
        document.querySelectorAll('.plus-menu-item').forEach(item => {
            item.addEventListener('click', function(e) {
                e.stopPropagation();
                const action = this.dataset.action;
                handlePlusMenuAction(action);
                hidePlusButton();
            });
        });
        
        // Hide plus button when clicking elsewhere
        document.addEventListener('click', function(e) {
            if (!plusButton.contains(e.target) && !plusMenu.contains(e.target)) {
                hidePlusButton();
            }
        });
        
        function handlePlusMenuAction(action) {
            const selection = window.getSelection();
            const range = selection.getRangeAt(0);
            
            switch (action) {
                case 'image':
                    openImageUploadModal();
                    break;
                case 'code':
                    insertCodeBlock();
                    break;
                case 'divider':
                    insertDivider();
                    break;
            }
        }
        
        function insertCodeBlock() {
            const codeBlockHtml = `
                <div class="story-code-block" contenteditable="false">
                    <div class="story-code-header">Code</div>
                    <div class="story-code-content" contenteditable="true" placeholder="// Enter your code here"></div>
                </div>
                <p><br></p>
            `;
            insertAtCurrentPosition(codeBlockHtml);
        }
        
        function insertDivider() {
            const dividerHtml = `
                <hr class="story-divider">
                <p><br></p>
            `;
            insertAtCurrentPosition(dividerHtml);
        }
        
        function insertAtCurrentPosition(html) {
            const selection = window.getSelection();
            if (selection.rangeCount > 0) {
                const range = selection.getRangeAt(0);
                
                // Clear current line if it's empty
                if (currentLine && !currentLine.textContent.trim()) {
                    currentLine.innerHTML = '';
                }
                
                const fragment = range.createContextualFragment(html);
                range.deleteContents();
                range.insertNode(fragment);
                
                // Move cursor after inserted content
                range.collapse(false);
                selection.removeAllRanges();
                selection.addRange(range);
                
                hasUnsavedChanges = true;
            }
        }
    }
    
    // Image Upload Functionality
    function setupImageUpload() {
        const modal = document.getElementById('image-upload-modal');
        const uploadArea = document.getElementById('image-upload-area');
        const fileInput = document.getElementById('image-file-input');
        const previewContainer = document.getElementById('image-preview-container');
        const preview = document.getElementById('image-preview');
        const cancelBtn = document.getElementById('cancel-image-upload');
        const insertBtn = document.getElementById('insert-image');
        
        let selectedFile = null;
        let currentImageRange = null;
        
        function openImageUploadModal() {
            const selection = window.getSelection();
            if (selection.rangeCount > 0) {
                currentImageRange = selection.getRangeAt(0).cloneRange();
            }
            modal.style.display = 'flex';
            resetModal();
        }
        
        function closeImageUploadModal() {
            modal.style.display = 'none';
            resetModal();
        }
        
        function resetModal() {
            selectedFile = null;
            previewContainer.style.display = 'none';
            insertBtn.disabled = true;
            uploadArea.classList.remove('dragover');
        }
        
        // Upload area click
        uploadArea.addEventListener('click', () => fileInput.click());
        
        // File input change
        fileInput.addEventListener('change', handleFileSelect);
        
        // Drag and drop
        uploadArea.addEventListener('dragover', handleDragOver);
        uploadArea.addEventListener('dragleave', handleDragLeave);
        uploadArea.addEventListener('drop', handleDrop);
        
        // Modal buttons
        cancelBtn.addEventListener('click', closeImageUploadModal);
        insertBtn.addEventListener('click', insertSelectedImage);
        
        // Close modal on background click
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeImageUploadModal();
            }
        });
        
        function handleFileSelect(e) {
            const file = e.target.files[0];
            if (file && file.type.startsWith('image/')) {
                selectedFile = file;
                showImagePreview(file);
            }
        }
        
        function handleDragOver(e) {
            e.preventDefault();
            uploadArea.classList.add('dragover');
        }
        
        function handleDragLeave(e) {
            e.preventDefault();
            uploadArea.classList.remove('dragover');
        }
        
        function handleDrop(e) {
            e.preventDefault();
            uploadArea.classList.remove('dragover');
            
            const files = e.dataTransfer.files;
            if (files.length > 0 && files[0].type.startsWith('image/')) {
                selectedFile = files[0];
                showImagePreview(files[0]);
            }
        }
        
        function showImagePreview(file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                preview.src = e.target.result;
                previewContainer.style.display = 'block';
                insertBtn.disabled = false;
            };
            reader.readAsDataURL(file);
        }
        
        function insertSelectedImage() {
            if (!selectedFile || !currentImageRange) return;
            
            const reader = new FileReader();
            reader.onload = function(e) {
                const imageHtml = `
                    <div class="story-image-container" contenteditable="false">
                        <img src="${e.target.result}" alt="Story image" class="story-image">
                        <div class="story-image-caption" contenteditable="true" placeholder="Add a caption (optional)"></div>
                    </div>
                    <p><br></p>
                `;
                
                // Insert image at saved range
                const selection = window.getSelection();
                selection.removeAllRanges();
                selection.addRange(currentImageRange);
                
                const fragment = currentImageRange.createContextualFragment(imageHtml);
                currentImageRange.deleteContents();
                currentImageRange.insertNode(fragment);
                
                // Move cursor after image
                currentImageRange.collapse(false);
                selection.removeAllRanges();
                selection.addRange(currentImageRange);
                
                hasUnsavedChanges = true;
                closeImageUploadModal();
            };
            reader.readAsDataURL(selectedFile);
        }
        
        // Expose openImageUploadModal globally
        window.openImageUploadModal = openImageUploadModal;
    }

    // Initialize when page loads
    initializeEditor();
    loadDraftFromStorage();
    
    // Clear draft when form is successfully submitted
    form.addEventListener('submit', () => {
        clearDraftFromStorage();
        hasUnsavedChanges = false;
    });
    
    // Word count and reading time calculator
    function updateWordCount() {
        const text = contentInput.textContent || '';
        const wordCount = text.trim().split(/\s+/).filter(word => word.length > 0).length;
        const readingTime = Math.max(1, Math.round(wordCount / 200));
        
        // Update reading time display if needed
        const readingTimeEl = document.getElementById('reading-time');
        if (readingTimeEl) {
            readingTimeEl.textContent = `${readingTime} min read`;
        }
    }
    
    // Update word count on input
    contentInput.addEventListener('input', updateWordCount);
    
    // Medium-style paragraph handling
    contentInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            // Create new paragraph
            const selection = window.getSelection();
            const range = selection.getRangeAt(0);
            
            // If we're in a heading, create a normal paragraph
            const container = range.commonAncestorContainer;
            const element = container.nodeType === Node.TEXT_NODE ? container.parentNode : container;
            
            if (element.tagName && /^H[1-6]$/.test(element.tagName)) {
                e.preventDefault();
                document.execCommand('formatBlock', false, 'p');
                document.execCommand('insertHTML', false, '<br>');
            }
        }
    });
});

// Utility functions for enhanced editing experience
function insertAtCursor(html) {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        range.deleteContents();
        
        const fragment = range.createContextualFragment(html);
        range.insertNode(fragment);
        
        // Move cursor to end of inserted content
        range.collapse(false);
        selection.removeAllRanges();
        selection.addRange(range);
    }
}

function wrapSelection(tag) {
    const selection = window.getSelection();
    if (selection.rangeCount > 0 && selection.toString().length > 0) {
        const range = selection.getRangeAt(0);
        const selectedContent = range.extractContents();
        
        const wrapper = document.createElement(tag);
        wrapper.appendChild(selectedContent);
        
        range.insertNode(wrapper);
        
        // Clear selection
        selection.removeAllRanges();
    }
}

// Export functions for potential external use
window.MediumEditor = {
    insertAtCursor,
    wrapSelection
};