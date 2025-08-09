from datetime import datetime
from app import db
from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash
from slugify import slugify

class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)
    bio = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationship with stories
    stories = db.relationship('Story', backref='author', lazy=True, cascade='all, delete-orphan')
    
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
    
    def __repr__(self):
        return f'<User {self.username}>'

class Story(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    subtitle = db.Column(db.String(300))
    content = db.Column(db.Text, nullable=False)
    slug = db.Column(db.String(250), unique=True, nullable=False)
    published = db.Column(db.Boolean, default=False, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Foreign key to User
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    
    def generate_slug(self):
        """Generate a unique slug for the story"""
        base_slug = slugify(self.title)
        slug = base_slug
        counter = 1
        
        while Story.query.filter_by(slug=slug).first():
            slug = f"{base_slug}-{counter}"
            counter += 1
        
        self.slug = slug
    
    def get_reading_time(self):
        """Estimate reading time based on word count"""
        word_count = len(self.content.split())
        reading_time = max(1, round(word_count / 200))  # Average 200 words per minute
        return reading_time
    
    def __repr__(self):
        return f'<Story {self.title}>'
