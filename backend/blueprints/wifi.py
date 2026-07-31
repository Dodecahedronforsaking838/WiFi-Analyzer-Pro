"""Wi-Fi Scanner Blueprint.

Provides endpoints for retrieving current Wi-Fi connection info
and scanning for nearby networks. Uses sample data when real
system scanning is unavailable — designed so a real scanner
adapter can be plugged in by replacing the service layer functions.
"""

from flask import Blueprint, jsonify

from services.wifi_service import get_current_network, scan_nearby_networks

wifi_bp = Blueprint("wifi", __name__, url_prefix="/api/wifi")


@wifi_bp.route("/current", methods=["GET"])
def current_network():
    """Return information about the currently connected Wi-Fi network."""
    data = get_current_network()
    return jsonify(data), 200


@wifi_bp.route("/scan", methods=["GET"])
def scan_networks():
    """Return a list of nearby Wi-Fi networks."""
    networks = scan_nearby_networks()
    return jsonify(networks), 200
