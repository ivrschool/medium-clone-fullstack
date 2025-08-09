from flask_wtf import FlaskForm
from wtforms import StringField, TextAreaField, PasswordField, BooleanField, SubmitField
from wtforms.validators import DataRequired, Email, Length, EqualTo, ValidationError
from models import User

class LoginForm(FlaskForm):
    username = StringField('Username', validators=[DataRequired()])
    password = PasswordField('Password', validators=[DataRequired()])
    remember_me = BooleanField('Remember Me')
    submit = SubmitField('Sign In')

class RegistrationForm(FlaskForm):
    username = StringField('Username', validators=[DataRequired(), Length(min=3, max=20)])
    email = StringField('Email', validators=[DataRequired(), Email()])
    password = PasswordField('Password', validators=[DataRequired(), Length(min=6)])
    password2 = PasswordField('Repeat Password', 
                             validators=[DataRequired(), EqualTo('password')])
    submit = SubmitField('Register')
    
    def validate_username(self, username):
        user = User.query.filter_by(username=username.data).first()
        if user is not None:
            raise ValidationError('Please use a different username.')
    
    def validate_email(self, email):
        user = User.query.filter_by(email=email.data).first()
        if user is not None:
            raise ValidationError('Please use a different email address.')

class StoryForm(FlaskForm):
    title = StringField('Title', validators=[DataRequired(), Length(max=200)])
    subtitle = StringField('Subtitle', validators=[Length(max=300)])
    content = TextAreaField('Content', validators=[DataRequired()])
    published = BooleanField('Publish immediately')
    submit = SubmitField('Save Story')

class ProfileForm(FlaskForm):
    username = StringField('Username', validators=[DataRequired(), Length(min=3, max=20)])
    email = StringField('Email', validators=[DataRequired(), Email()])
    bio = TextAreaField('Bio', validators=[Length(max=500)])
    submit = SubmitField('Update Profile')
    
    def __init__(self, original_username, original_email, *args, **kwargs):
        super(ProfileForm, self).__init__(*args, **kwargs)
        self.original_username = original_username
        self.original_email = original_email
    
    def validate_username(self, username):
        if username.data != self.original_username:
            user = User.query.filter_by(username=username.data).first()
            if user is not None:
                raise ValidationError('Please use a different username.')
    
    def validate_email(self, email):
        if email.data != self.original_email:
            user = User.query.filter_by(email=email.data).first()
            if user is not None:
                raise ValidationError('Please use a different email address.')
