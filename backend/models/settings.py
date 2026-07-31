"""Settings model for SQLite persistence."""

from app import db


class Settings(db.Model):
    """User settings stored in SQLite."""

    __tablename__ = "settings"

    id = db.Column(db.Integer, primary_key=True, default=1)
    theme = db.Column(db.String(20), nullable=False, default="dark")
    refresh_interval = db.Column(db.Integer, nullable=False, default=30)
    notifications = db.Column(db.Boolean, nullable=False, default=True)
    auto_refresh = db.Column(db.Boolean, nullable=False, default=True)
    default_speed_unit = db.Column(db.String(10), nullable=False, default="Mbps")
    language = db.Column(db.String(30), nullable=False, default="English")

    def to_dict(self):
        """Serialize settings to dictionary."""
        return {
            "theme": self.theme,
            "refresh_interval": self.refresh_interval,
            "notifications": self.notifications,
            "auto_refresh": self.auto_refresh,
            "default_speed_unit": self.default_speed_unit,
            "language": self.language,
        }

    @staticmethod
    def defaults():
        """Return default settings dict."""
        return {
            "theme": "dark",
            "refresh_interval": 30,
            "notifications": True,
            "auto_refresh": True,
            "default_speed_unit": "Mbps",
            "language": "English",
        }
