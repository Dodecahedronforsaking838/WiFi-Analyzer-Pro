"""Dashboard Blueprint.

Provides a single endpoint that aggregates real-time data
from Wi-Fi, signal, and network services.
"""

from flask import Blueprint, jsonify

from services.dashboard_service import get_dashboard_data

dashboard_bp = Blueprint("dashboard", __name__, url_prefix="/api")


@dashboard_bp.route("/dashboard", methods=["GET"])
def dashboard():
    """Return aggregated dashboard data."""
    data = get_dashboard_data()
    return jsonify(data), 200
