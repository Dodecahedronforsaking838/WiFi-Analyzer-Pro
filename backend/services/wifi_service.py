"""Wi-Fi scanning service layer.

This module provides functions that return Wi-Fi network data.
Currently returns realistic sample data. To integrate real scanning,
replace the function bodies with platform-specific implementations
(e.g., subprocess calls to `netsh wlan` on Windows, `iwlist` on Linux,
or `airport` on macOS).
"""

import random


def get_current_network():
    """Return information about the currently connected network."""
    return {
        "ssid": "NetPulse-Enterprise-5G",
        "signal_strength": -42,
        "signal_percent": 88,
        "frequency": "5 GHz",
        "channel": 36,
        "security": "WPA3-Enterprise",
        "mac_address": "A4:CF:12:D8:56:3E",
        "status": "Connected",
        "ip_address": "192.168.1.105",
        "gateway": "192.168.1.1",
        "dns": "8.8.8.8",
        "link_speed": "866 Mbps",
    }


def scan_nearby_networks():
    """Return a list of nearby Wi-Fi networks detected in range."""
    base_networks = [
        {
            "ssid": "NetPulse-Enterprise-5G",
            "signal_strength": -42,
            "signal_percent": 88,
            "frequency": "5 GHz",
            "channel": 36,
            "security": "WPA3-Enterprise",
            "connected": True,
        },
        {
            "ssid": "NetPulse-Enterprise-2.4G",
            "signal_strength": -55,
            "signal_percent": 72,
            "frequency": "2.4 GHz",
            "channel": 6,
            "security": "WPA3-Enterprise",
            "connected": False,
        },
        {
            "ssid": "CafeWiFi-Guest",
            "signal_strength": -68,
            "signal_percent": 54,
            "frequency": "2.4 GHz",
            "channel": 1,
            "security": "WPA2-Personal",
            "connected": False,
        },
        {
            "ssid": "Neighbor_5G_Plus",
            "signal_strength": -72,
            "signal_percent": 48,
            "frequency": "5 GHz",
            "channel": 44,
            "security": "WPA2-Personal",
            "connected": False,
        },
        {
            "ssid": "IoT-Network",
            "signal_strength": -60,
            "signal_percent": 65,
            "frequency": "2.4 GHz",
            "channel": 11,
            "security": "WPA2-Personal",
            "connected": False,
        },
        {
            "ssid": "DIRECT-HP-Printer",
            "signal_strength": -78,
            "signal_percent": 38,
            "frequency": "2.4 GHz",
            "channel": 6,
            "security": "WPA2-Personal",
            "connected": False,
        },
        {
            "ssid": "Corp-Secure",
            "signal_strength": -50,
            "signal_percent": 80,
            "frequency": "5 GHz",
            "channel": 149,
            "security": "WPA3-Enterprise",
            "connected": False,
        },
        {
            "ssid": "FiOS-G4X2P",
            "signal_strength": -75,
            "signal_percent": 42,
            "frequency": "5 GHz",
            "channel": 52,
            "security": "WPA2-Personal",
            "connected": False,
        },
        {
            "ssid": "xfinitywifi",
            "signal_strength": -82,
            "signal_percent": 30,
            "frequency": "2.4 GHz",
            "channel": 3,
            "security": "Open",
            "connected": False,
        },
        {
            "ssid": "SmartHome-Hub",
            "signal_strength": -63,
            "signal_percent": 60,
            "frequency": "2.4 GHz",
            "channel": 9,
            "security": "WPA2-Personal",
            "connected": False,
        },
        {
            "ssid": "Office-Floor3",
            "signal_strength": -58,
            "signal_percent": 68,
            "frequency": "5 GHz",
            "channel": 40,
            "security": "WPA3-Enterprise",
            "connected": False,
        },
        {
            "ssid": "NETGEAR-Guest",
            "signal_strength": -80,
            "signal_percent": 34,
            "frequency": "2.4 GHz",
            "channel": 8,
            "security": "WPA2-Personal",
            "connected": False,
        },
    ]

    # Add slight randomization to signal values for realism
    for network in base_networks:
        jitter = random.randint(-3, 3)
        network["signal_strength"] = network["signal_strength"] + jitter
        network["signal_percent"] = max(
            0, min(100, network["signal_percent"] + jitter)
        )

    return base_networks
