"""Speed Test service layer.

Runs an internet speed test using the speedtest-cli library.
If the test fails or the library is unavailable, returns structured
sample data so the API never crashes.
"""

from datetime import datetime, timezone


def run_speed_test():
    """Execute a speed test and return structured results."""
    try:
        import speedtest

        st = speedtest.Speedtest()
        st.get_best_server()
        st.download()
        st.upload()

        results = st.results.dict()

        download_mbps = results["download"] / 1_000_000
        upload_mbps = results["upload"] / 1_000_000
        ping_ms = results["ping"]
        server_name = results.get("server", {}).get("name", "Unknown")
        server_country = results.get("server", {}).get("country", "")
        isp = results.get("client", {}).get("isp", "Unknown")

        return {
            "download": f"{download_mbps:.1f} Mbps",
            "download_value": round(download_mbps, 1),
            "upload": f"{upload_mbps:.1f} Mbps",
            "upload_value": round(upload_mbps, 1),
            "ping": f"{ping_ms:.0f} ms",
            "ping_value": round(ping_ms),
            "server": f"{server_name}, {server_country}".strip(", "),
            "isp": isp,
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "source": "live",
        }

    except Exception:
        # Return realistic sample data if speedtest fails
        return _get_sample_data()


def _get_sample_data():
    """Return structured sample speed test data."""
    return {
        "download": "152.4 Mbps",
        "download_value": 152.4,
        "upload": "47.8 Mbps",
        "upload_value": 47.8,
        "ping": "18 ms",
        "ping_value": 18,
        "server": "Chennai, India",
        "isp": "Airtel Broadband",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "source": "sample",
    }
