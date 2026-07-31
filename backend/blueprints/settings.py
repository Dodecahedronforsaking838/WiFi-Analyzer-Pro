"""Settings Blueprint.

Provides endpoints for reading, updating, and resetting
application settings persisted in SQLite.
"""

from flask import Blueprint, jsonify, request

from services.settings_service import get_settings, update_settings, reset_settings

settings_bp = Blueprint("settings", __name__, url_prefix="/api/settings")


@settings_bp.route("", methods=["GET"])
def read_settings():
    """Return current settings."""
    data = get_settings()
    return jsonify(data), 200


@settings_bp.route("", methods=["POST"])
def save_settings():
    """Update settings with provided values."""
    payload = request.get_json()
    if not payload:
        return jsonify({"status": "error", "message": "No data provided"}), 400

    # Validate input types
    valid_themes = ("dark", "light")
    valid_units = ("Mbps", "Kbps", "MBps")
    valid_languages = ("English", "Spanish", "French", "German", "Japanese")

    if "theme" in payload and payload["theme"] not in valid_themes:
        return jsonify({"status": "error", "message": "Invalid theme value"}), 400
    if "default_speed_unit" in payload and payload["default_speed_unit"] not in valid_units:
        return jsonify({"status": "error", "message": "Invalid speed unit"}), 400
    if "language" in payload and payload["language"] not in valid_languages:
        return jsonify({"status": "error", "message": "Invalid language"}), 400
    if "refresh_interval" in payload:
        if not isinstance(payload["refresh_interval"], int) or payload["refresh_interval"] < 5:
            return jsonify({"status": "error", "message": "Invalid refresh interval"}), 400

    result = update_settings(payload)
    return jsonify(result), 200


@settings_bp.route("/reset", methods=["POST"])
def reset_defaults():
    """Reset all settings to defaults."""
    result = reset_settings()
    return jsonify(result), 200
