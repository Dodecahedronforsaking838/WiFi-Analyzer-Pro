"""NetPulse Pro - Flask Application Entry Point."""

import os

from dotenv import load_dotenv
from flask import Flask, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy

from config import config_by_name

# Load environment variables
load_dotenv()

# Initialize extensions
db = SQLAlchemy()


def create_app(config_name=None):
    """Application factory pattern."""
    if config_name is None:
        config_name = os.getenv("FLASK_ENV", "development")

    app = Flask(__name__, instance_relative_config=True)
    app.config.from_object(config_by_name[config_name])

    # Ensure instance folder exists
    os.makedirs(app.instance_path, exist_ok=True)

    # Initialize extensions with app
    db.init_app(app)
    CORS(app, resources={r"/api/*": {"origins": "*"}})

    # Security headers
    @app.after_request
    def add_security_headers(response):
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        return response

    # Health check route
    @app.route("/api/health", methods=["GET"])
    def health_check():
        return jsonify({"status": "healthy", "service": "NetPulse Pro API"}), 200

    # Global error handlers
    @app.errorhandler(404)
    def not_found(e):
        return jsonify({"status": "error", "message": "Endpoint not found"}), 404

    @app.errorhandler(500)
    def internal_error(e):
        return jsonify({"status": "error", "message": "Internal server error"}), 500

    @app.errorhandler(405)
    def method_not_allowed(e):
        return jsonify({"status": "error", "message": "Method not allowed"}), 405

    # Register blueprints
    from blueprints.dashboard import dashboard_bp
    from blueprints.wifi import wifi_bp
    from blueprints.network import network_bp
    from blueprints.speedtest import speedtest_bp
    from blueprints.signal import signal_bp
    from blueprints.analytics import analytics_bp
    from blueprints.reports import reports_bp
    from blueprints.settings import settings_bp

    app.register_blueprint(dashboard_bp)
    app.register_blueprint(wifi_bp)
    app.register_blueprint(network_bp)
    app.register_blueprint(speedtest_bp)
    app.register_blueprint(signal_bp)
    app.register_blueprint(analytics_bp)
    app.register_blueprint(reports_bp)
    app.register_blueprint(settings_bp)

    # Import models so db.create_all() picks them up
    from models import settings as _settings_model  # noqa: F401

    # Create database tables
    with app.app_context():
        db.create_all()

    return app


if __name__ == "__main__":
    app = create_app()
    app.run(host="127.0.0.1", port=5000, debug=True)
