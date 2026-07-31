"""Signal Analyzer Blueprint.

Provides an endpoint to retrieve current Wi-Fi signal metrics
including RSSI, noise floor, SNR, channel, and frequency.
"""

from flask import Blueprint, jsonify

from services.signal_service import get_signal_data

signal_bp = Blueprint("signal", __name__, url_prefix="/api")


@signal_bp.route("/signal", methods=["GET"])
def signal_info():
    """Return current Wi-Fi signal analysis data."""
    data = get_signal_data()
    return jsonify(data), 200
