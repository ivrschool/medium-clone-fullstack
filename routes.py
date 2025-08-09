from flask import render_template, flash, redirect, url_for, request, abort
from flask_login import current_user, login_user, logout_user, login_required
from app import app, db
from models import User, Story
from forms import LoginForm, RegistrationForm, StoryForm, ProfileForm

@app.route('/')
def index():
    # Get all published stories ordered by creation date
    stories = Story.query.filter_by(published=True).order_by(Story.created_at.desc()).limit(20).all()
    return render_template('index.html', title='Home', stories=stories)

@app.route('/login', methods=['GET', 'POST'])
def login():
    if current_user.is_authenticated:
        return redirect(url_for('index'))
    
    form = LoginForm()
    if form.validate_on_submit():
        user = User.query.filter_by(username=form.username.data).first()
        if user is None or not user.check_password(form.password.data):
            flash('Invalid username or password')
            return redirect(url_for('login'))
        
        login_user(user, remember=form.remember_me.data)
        next_page = request.args.get('next')
        if not next_page or not next_page.startswith('/'):
            next_page = url_for('dashboard')
        return redirect(next_page)
    
    return render_template('login.html', title='Sign In', form=form)

@app.route('/logout')
def logout():
    logout_user()
    return redirect(url_for('index'))

@app.route('/register', methods=['GET', 'POST'])
def register():
    if current_user.is_authenticated:
        return redirect(url_for('index'))
    
    form = RegistrationForm()
    if form.validate_on_submit():
        user = User(username=form.username.data, email=form.email.data)
        user.set_password(form.password.data)
        db.session.add(user)
        db.session.commit()
        flash('Congratulations, you are now a registered user!')
        return redirect(url_for('login'))
    
    return render_template('register.html', title='Register', form=form)

@app.route('/dashboard')
@login_required
def dashboard():
    stories = Story.query.filter_by(user_id=current_user.id).order_by(Story.updated_at.desc()).all()
    return render_template('dashboard.html', title='Dashboard', stories=stories)

@app.route('/write', methods=['GET', 'POST'])
@login_required
def write_story():
    form = StoryForm()
    if form.validate_on_submit():
        story = Story(
            title=form.title.data,
            subtitle=form.subtitle.data,
            content=form.content.data,
            published=form.published.data,
            user_id=current_user.id
        )
        story.generate_slug()
        db.session.add(story)
        db.session.commit()
        flash('Your story has been saved!')
        return redirect(url_for('dashboard'))
    
    return render_template('write_story.html', title='Write a Story', form=form)

@app.route('/edit/<int:id>', methods=['GET', 'POST'])
@login_required
def edit_story(id):
    story = Story.query.get_or_404(id)
    if story.author != current_user:
        abort(403)
    
    form = StoryForm()
    if form.validate_on_submit():
        story.title = form.title.data
        story.subtitle = form.subtitle.data
        story.content = form.content.data
        story.published = form.published.data
        story.generate_slug()  # Regenerate slug if title changed
        db.session.commit()
        flash('Your story has been updated!')
        return redirect(url_for('dashboard'))
    elif request.method == 'GET':
        form.title.data = story.title
        form.subtitle.data = story.subtitle
        form.content.data = story.content
        form.published.data = story.published
    
    return render_template('edit_story.html', title='Edit Story', form=form, story=story)

@app.route('/story/<slug>')
def read_story(slug):
    story = Story.query.filter_by(slug=slug, published=True).first_or_404()
    return render_template('read_story.html', title=story.title, story=story)

@app.route('/delete/<int:id>')
@login_required
def delete_story(id):
    story = Story.query.get_or_404(id)
    if story.author != current_user:
        abort(403)
    
    db.session.delete(story)
    db.session.commit()
    flash('Your story has been deleted!')
    return redirect(url_for('dashboard'))

@app.route('/profile', methods=['GET', 'POST'])
@login_required
def profile():
    form = ProfileForm(current_user.username, current_user.email)
    if form.validate_on_submit():
        current_user.username = form.username.data
        current_user.email = form.email.data
        current_user.bio = form.bio.data
        db.session.commit()
        flash('Your profile has been updated!')
        return redirect(url_for('profile'))
    elif request.method == 'GET':
        form.username.data = current_user.username
        form.email.data = current_user.email
        form.bio.data = current_user.bio
    
    return render_template('profile.html', title='Profile', form=form)

@app.route('/author/<username>')
def author_profile(username):
    user = User.query.filter_by(username=username).first_or_404()
    stories = Story.query.filter_by(user_id=user.id, published=True).order_by(Story.created_at.desc()).all()
    return render_template('profile.html', title=f'{user.username}', user=user, stories=stories, is_public=True)

@app.errorhandler(404)
def not_found_error(error):
    return render_template('404.html'), 404

@app.errorhandler(500)
def internal_error(error):
    db.session.rollback()
    return render_template('500.html'), 500
