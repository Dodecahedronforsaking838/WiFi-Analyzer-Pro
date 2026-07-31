"""Dashboard service layer.

Aggregates real-time data from all other services to provide
a comprehensive dashboard overview.
"""

from datetime import datetime, timezone

from services.wifi_service import get_current_network
from services.signal_service import get_signal_data
from services.network_service import get_network_info


def get_dashboard_data():
    """Return aggregated dashboard data from real services."""
    wifi = get_current_network()
    signal = get_signal_data()
    network = get_network_info()

    # Calculate network health from real values
    signal_score = min(100, max(0, signal.get("signal_percent", 0)))
    # Health = weighted average of signal quality + connection status
    health = int(signal_score * 0.7 + (30 if wifi.get("status") == "Connected" else 0))

    return {
        "connection": {
            "ssid": wifi.get("ssid", "Not Connected"),
            "status": wifi.get("status", "Disconnected"),
            "frequency": wifi.get("frequency", "—"),
            "channel": wifi.get("channel", 0),
            "security": wifi.get("security", "—"),
            "link_speed": wifi.get("link_speed", "—"),
        },
        "signal": {
            "rssi": signal.get("rssi", 0),
            "signal_percent": signal.get("signal_percent", 0),
            "noise": signal.get("noise", 0),
            "snr": signal.get("snr", 0),
            "quality": signal.get("quality", "Unknown"),
        },
        "network": {
            "local_ip": network.get("local_ip", "—"),
            "public_ip": network.get("public_ip", "—"),
            "gateway": network.get("gateway", "—"),
            "dns_server": network.get("dns_server", "—"),
            "hostname": network.get("hostname", "—"),
            "mac_address": network.get("mac_address", "—"),
        },
        "health": {
            "score": health,
            "label": _health_label(health),
        },
        "last_updated": datetime.now(timezone.utc).isoformat(),
    }


def _health_label(score):
    """Map health score to label."""
    if score >= 85:
        return "Excellent"
    if score >= 70:
        return "Good"
    if score >= 50:
        return "Fair"
    return "Poor"
