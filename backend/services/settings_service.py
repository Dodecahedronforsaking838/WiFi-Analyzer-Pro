"""Settings service layer.

Handles reading and writing user settings from/to SQLite.
Ensures a single settings row always exists.
"""

from app import db
from models.settings import Settings


def get_settings():
    """Retrieve current settings from the database."""
    settings = Settings.query.get(1)
    if settings is None:
        # Create default settings on first access
        settings = Settings(id=1, **Settings.defaults())
        db.session.add(settings)
        db.session.commit()
    return settings.to_dict()


def update_settings(data):
    """Update settings in the database.

    Args:
        data: Dictionary of settings fields to update.

    Returns:
        dict with status and message.
    """
    settings = Settings.query.get(1)
    if settings is None:
        settings = Settings(id=1, **Settings.defaults())
        db.session.add(settings)

    allowed_fields = {
        "theme", "refresh_interval", "notifications",
        "auto_refresh", "default_speed_unit", "language",
    }

    for key, value in data.items():
        if key in allowed_fields:
            setattr(settings, key, value)

    db.session.commit()
    return {"status": "success", "message": "Settings saved successfully"}


def reset_settings():
    """Reset settings to defaults."""
    settings = Settings.query.get(1)
    if settings is None:
        settings = Settings(id=1, **Settings.defaults())
        db.session.add(settings)
    else:
        defaults = Settings.defaults()
        for key, value in defaults.items():
            setattr(settings, key, value)

    db.session.commit()
    return {"status": "success", "message": "Settings reset to defaults"}
