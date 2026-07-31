"""Analytics Blueprint.

Provides aggregated network performance analytics
including speed, signal, and ping history data.
"""

from flask import Blueprint, jsonify

from services.analytics_service import get_analytics_data

analytics_bp = Blueprint("analytics", __name__, url_prefix="/api")


@analytics_bp.route("/analytics", methods=["GET"])
def analytics():
    """Return analytics data with history and summary."""
    data = get_analytics_data()
    return jsonify(data), 200
