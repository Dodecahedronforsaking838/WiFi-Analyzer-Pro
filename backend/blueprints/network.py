"""Network Diagnostics Blueprint.

Provides endpoints for network information, connectivity tests (ping),
and DNS lookups.
"""

from flask import Blueprint, jsonify

from services.network_service import (
    get_network_info,
    run_ping_tests,
    run_dns_lookup,
)

network_bp = Blueprint("network", __name__, url_prefix="/api/network")


@network_bp.route("/info", methods=["GET"])
def network_info():
    """Return local network configuration information."""
    data = get_network_info()
    return jsonify(data), 200


@network_bp.route("/ping", methods=["GET"])
def ping_test():
    """Run connectivity tests against known targets."""
    results = run_ping_tests()
    return jsonify(results), 200


@network_bp.route("/dns", methods=["GET"])
def dns_lookup():
    """Run DNS lookup tests against common domains."""
    results = run_dns_lookup()
    return jsonify(results), 200
