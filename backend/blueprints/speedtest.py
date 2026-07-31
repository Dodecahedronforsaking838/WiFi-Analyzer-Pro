"""Speed Test Blueprint.

Provides an endpoint to run an internet speed test measuring
download, upload, and ping.
"""

from flask import Blueprint, jsonify

from services.speedtest_service import run_speed_test

speedtest_bp = Blueprint("speedtest", __name__, url_prefix="/api")


@speedtest_bp.route("/speedtest", methods=["GET"])
def speed_test():
    """Run a speed test and return results."""
    data = run_speed_test()
    return jsonify(data), 200
