# Medium Clone

A full-featured blogging platform built with Flask that replicates the core functionality and design of Medium.com. Features user authentication, story creation with a rich text editor, and a clean, responsive interface.

![Medium Clone Screenshot](https://via.placeholder.com/800x400/1a5d1a/ffffff?text=Medium+Clone)

## 🌟 Features

### Core Functionality
- **User Authentication**: Register, login, and secure session management
- **Story Management**: Create, edit, publish, and manage drafts
- **Rich Text Editor**: Medium-style single-page editor with formatting tools
- **Dashboard**: Personal story management interface
- **Public Reading**: Browse and read stories from all authors

### Medium-Style Editor
- **Plus Button Interface**: Click empty lines to access insertion menu
- **Image Upload**: Drag & drop or click to upload images with captions
- **Code Blocks**: Syntax-highlighted code insertion
- **Dividers**: Section breaks for better story organization
- **Auto-Save**: Prevents data loss with automatic draft saving
- **Rich Formatting**: Bold, italic, underline, headings, and lists

### User Experience
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Clean Interface**: Minimalist design focusing on content
- **Reading Time**: Automatic calculation based on content length
- **User Profiles**: Author pages with published stories
- **SEO-Friendly URLs**: Clean slug-based story URLs

## 🚀 Quick Start

### Prerequisites
- Python 3.11+
- PostgreSQL database
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd medium-clone
   ```

2. **Set up environment variables**
   ```bash
   export DATABASE_URL="postgresql://username:password@localhost/medium_clone"
   export SESSION_SECRET="your-secret-key-here"
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```
   
   Or using the package manager:
   ```bash
   # Dependencies are already installed in this Replit environment
   ```

4. **Run the application**
   ```bash
   python main.py
   ```
   
   Or using Gunicorn (production):
   ```bash
   gunicorn --bind 0.0.0.0:5000 --reuse-port --reload main:app
   ```

5. **Open your browser**
   Navigate to `http://localhost:5000`

## 📁 Project Structure

```
medium-clone/
├── app.py                 # Flask application setup
├── main.py               # Application entry point
├── models.py             # Database models
├── routes.py             # URL routes and view functions
├── forms.py              # WTForms for form handling
├── requirements.txt      # Python dependencies
├── replit.md            # Project documentation
├── static/
│   ├── css/
│   │   └── style.css    # Main stylesheet
│   └── js/
│       └── medium-editor.js  # Editor functionality
└── templates/
    ├── base.html        # Base template
    ├── index.html       # Homepage
    ├── dashboard.html   # User dashboard
    ├── write_story.html # Story creation
    ├── edit_story.html  # Story editing
    ├── read_story.html  # Story reading
    └── profile.html     # User profiles
```

## 🛠️ Technical Stack

### Backend
- **Flask**: Python web framework
- **SQLAlchemy**: Database ORM
- **PostgreSQL**: Database
- **Flask-Login**: User session management
- **WTForms**: Form handling and validation
- **Werkzeug**: Password hashing and utilities

### Frontend
- **Bootstrap 5**: CSS framework
- **Font Awesome 6**: Icons
- **Custom JavaScript**: Rich text editor functionality
- **Responsive Design**: Mobile-first approach

### Features Implementation
- **Rich Text Editor**: Custom implementation without third-party dependencies
- **Image Upload**: Base64 encoding for simplicity
- **Auto-Save**: Local storage backup with server synchronization
- **SEO Optimization**: Clean URLs and meta tags

## 🎯 Usage

### Creating Stories
1. **Sign up** or **log in** to your account
2. Click **"Write"** from the dashboard
3. Use the **Medium-style editor**:
   - Click on empty lines to see the plus button
   - Add images, code blocks, or dividers
   - Use the floating toolbar for text formatting
4. **Save as draft** or **publish** when ready

### Editor Features
- **Plus Button**: Appears on empty lines for content insertion
- **Image Upload**: Supports drag & drop with caption functionality
- **Code Blocks**: Formatted code snippets with syntax highlighting
- **Auto-Save**: Automatic draft saving every 2 seconds
- **Keyboard Shortcuts**: Standard formatting shortcuts (Ctrl+B, Ctrl+I, etc.)

### Reading Experience
- **Homepage**: Browse latest published stories
- **Story Pages**: Clean reading interface with author information
- **User Profiles**: View all stories by a specific author
- **Responsive**: Optimized for all device sizes

## 🔧 Configuration

### Environment Variables
```bash
DATABASE_URL=postgresql://username:password@localhost/medium_clone
SESSION_SECRET=your-very-secret-key-here
```

### Database Setup
The application automatically creates the necessary tables on first run. Models include:
- **User**: User accounts and authentication
- **Story**: Story content and metadata

## 🚀 Deployment

### Replit Deployment
This project is optimized for Replit deployment:
1. The application runs on port 5000 by default
2. Environment variables are managed through Replit's secrets
3. PostgreSQL database is automatically configured

### Production Deployment
For production environments:
1. Use a production WSGI server (Gunicorn included)
2. Set up a reverse proxy (Nginx recommended)
3. Configure SSL certificates
4. Set up proper logging and monitoring

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow PEP 8 for Python code styling
- Use semantic HTML and clean CSS
- Test all functionality before submitting
- Update documentation for new features

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎉 Acknowledgments

- Inspired by Medium.com's clean design and user experience
- Built with Flask and modern web technologies
- Thanks to the open-source community for excellent tools and libraries

## 📞 Support

If you encounter any issues or have questions:
1. Check the [Issues](../../issues) page for known problems
2. Create a new issue with detailed information
3. Contact the maintainers

---

**Built with ❤️ using Flask and modern web technologies**