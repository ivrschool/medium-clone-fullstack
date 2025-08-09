# Medium Clone

## Overview

A Medium-inspired blogging platform built with Flask that allows users to create accounts, write stories, and read content from other authors. The application features a clean, Medium-like interface with user authentication, story management, and a public reading experience. Users can write stories using a rich text editor, manage drafts and published content through a personal dashboard, and discover content from other writers on the homepage.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Web Framework & Backend
- **Flask**: Python web framework serving as the main application backend
- **SQLAlchemy**: ORM for database operations with declarative base model structure
- **Flask-Login**: Session-based user authentication and session management
- **WTForms**: Form handling and validation with CSRF protection

### Database Design
- **User Model**: Stores user credentials (username, email, hashed passwords), bio, and creation timestamps
- **Story Model**: Contains story content (title, subtitle, content), publication status, unique slugs for URLs, and author relationships
- **Relationships**: One-to-many relationship between Users and Stories with cascade delete

### Authentication & Security
- **Session-based Authentication**: Flask-Login manages user sessions with remember me functionality
- **Password Security**: Werkzeug password hashing for secure credential storage
- **Form Validation**: Server-side validation with custom validators for unique usernames and emails
- **CSRF Protection**: Built into WTForms for form security

### Frontend Architecture
- **Template Engine**: Jinja2 templates with base template inheritance
- **CSS Framework**: Bootstrap 5 for responsive design and components
- **Rich Text Editor**: TinyMCE integration for story writing with custom styling
- **Icon System**: Font Awesome for consistent iconography

### Content Management
- **Story System**: Draft and published states with unique slug generation
- **Reading Time Calculation**: Automatic estimation based on content length
- **Content Rendering**: Safe HTML rendering for rich story content
- **User Profiles**: Public author profiles displaying published stories

### URL Structure & Routing
- **RESTful Routes**: Clean URL patterns with slug-based story access
- **User Dashboard**: Personal story management interface
- **Public Pages**: Homepage with latest stories and individual story pages
- **Authentication Flow**: Login, registration, and logout handling

## External Dependencies

### Python Packages
- **Flask**: Web framework and core functionality
- **Flask-SQLAlchemy**: Database ORM integration
- **Flask-Login**: User session management
- **Flask-WTF**: Form handling and CSRF protection
- **WTForms**: Form validation and rendering
- **Werkzeug**: Password hashing and WSGI utilities
- **python-slugify**: URL-friendly slug generation

### Frontend Libraries
- **Bootstrap 5**: CSS framework via CDN for responsive UI components
- **Font Awesome 6**: Icon library via CDN for consistent iconography
- **TinyMCE**: Rich text editor for story content creation

### Infrastructure
- **Database**: Configurable via DATABASE_URL environment variable (SQLAlchemy compatible)
- **Session Management**: Requires SESSION_SECRET environment variable for security
- **WSGI Server**: ProxyFix middleware for proper header handling in production

### Development Tools
- **Flask Debug Mode**: Enabled for development with hot reload
- **Logging**: Python logging configuration for debugging and monitoring