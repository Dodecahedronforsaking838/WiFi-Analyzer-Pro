"""Network diagnostics service layer.

Uses real Python networking modules (socket, platform, subprocess)
where practical. Falls back to structured sample data when a
platform-specific operation is unavailable or fails.
"""

import platform
import socket
import subprocess
import time
import uuid


def get_network_info():
    """Gather local network configuration."""
    hostname = _safe_call(socket.gethostname, "Unknown")
    local_ip = _get_local_ip()
    mac_address = _get_mac_address()
    os_info = f"{platform.system()} {platform.release()}"
    gateway = _get_default_gateway()
    dns_server = _get_dns_server()

    return {
        "hostname": hostname,
        "local_ip": local_ip,
        "public_ip": _get_public_ip(),
        "gateway": gateway,
        "dns_server": dns_server,
        "mac_address": mac_address,
        "operating_system": os_info,
    }


def run_ping_tests():
    """Run ping connectivity tests against known targets."""
    targets = [
        {"target": "8.8.8.8", "label": "Google DNS"},
        {"target": "1.1.1.1", "label": "Cloudflare DNS"},
        {"target": "208.67.222.222", "label": "OpenDNS"},
    ]

    # Add gateway if detectable
    gateway = _get_default_gateway()
    if gateway and gateway != "192.168.1.1":
        targets.insert(0, {"target": gateway, "label": "Gateway"})
    else:
        targets.insert(0, {"target": "192.168.1.1", "label": "Gateway"})

    results = []
    for entry in targets:
        result = _ping_host(entry["target"])
        results.append({
            "target": entry["target"],
            "label": entry["label"],
            "latency": result["latency"],
            "status": result["status"],
        })

    return results


def run_dns_lookup():
    """Perform DNS resolution for common domains."""
    domains = [
        "google.com",
        "github.com",
        "cloudflare.com",
        "amazon.com",
        "microsoft.com",
    ]

    results = []
    for domain in domains:
        start = time.perf_counter()
        try:
            ip = socket.gethostbyname(domain)
            elapsed = (time.perf_counter() - start) * 1000
            results.append({
                "domain": domain,
                "ip_address": ip,
                "response_time": f"{elapsed:.1f} ms",
                "status": "Resolved",
            })
        except socket.gaierror:
            elapsed = (time.perf_counter() - start) * 1000
            results.append({
                "domain": domain,
                "ip_address": "—",
                "response_time": f"{elapsed:.1f} ms",
                "status": "Failed",
            })

    return results


# ---------------------------------------------------------------------------
# Internal helpers
# ---------------------------------------------------------------------------


def _safe_call(fn, default="Unknown"):
    """Call fn and return default on exception."""
    try:
        return fn()
    except Exception:
        return default


def _get_public_ip():
    """Attempt to get the real public IP address."""
    try:
        import urllib.request
        response = urllib.request.urlopen("https://api.ipify.org", timeout=3)
        return response.read().decode("utf-8").strip()
    except Exception:
        return "Unavailable"


def _get_local_ip():
    """Get the local IP address by connecting to an external host."""
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.settimeout(2)
        s.connect(("8.8.8.8", 80))
        ip = s.getsockname()[0]
        s.close()
        return ip
    except Exception:
        return "192.168.1.105"


def _get_mac_address():
    """Get the MAC address of this machine."""
    try:
        mac = uuid.getnode()
        mac_str = ":".join(
            f"{(mac >> (8 * i)) & 0xFF:02X}" for i in reversed(range(6))
        )
        return mac_str
    except Exception:
        return "A4:CF:12:D8:56:3E"


def _get_default_gateway():
    """Attempt to detect the default gateway."""
    system = platform.system()
    try:
        if system == "Windows":
            output = subprocess.check_output(
                ["ipconfig"], text=True, timeout=5, stderr=subprocess.DEVNULL
            )
            for line in output.splitlines():
                if "Default Gateway" in line:
                    parts = line.split(":")
                    if len(parts) >= 2:
                        gw = parts[1].strip()
                        if gw:
                            return gw
        elif system == "Linux":
            output = subprocess.check_output(
                ["ip", "route", "show", "default"],
                text=True,
                timeout=5,
                stderr=subprocess.DEVNULL,
            )
            parts = output.split()
            if "via" in parts:
                return parts[parts.index("via") + 1]
        elif system == "Darwin":
            output = subprocess.check_output(
                ["route", "-n", "get", "default"],
                text=True,
                timeout=5,
                stderr=subprocess.DEVNULL,
            )
            for line in output.splitlines():
                if "gateway" in line:
                    return line.split(":")[1].strip()
    except Exception:
        pass
    return "192.168.1.1"


def _get_dns_server():
    """Attempt to detect the configured DNS server."""
    system = platform.system()
    try:
        if system == "Windows":
            output = subprocess.check_output(
                ["ipconfig", "/all"], text=True, timeout=5, stderr=subprocess.DEVNULL
            )
            for line in output.splitlines():
                if "DNS Servers" in line:
                    parts = line.split(":")
                    if len(parts) >= 2:
                        dns = parts[1].strip()
                        if dns:
                            return dns
        elif system in ("Linux", "Darwin"):
            with open("/etc/resolv.conf", "r") as f:
                for line in f:
                    if line.startswith("nameserver"):
                        return line.split()[1]
    except Exception:
        pass
    return "8.8.8.8"


def _ping_host(host):
    """Ping a host and return latency + status."""
    system = platform.system()
    param = "-n" if system == "Windows" else "-c"

    try:
        start = time.perf_counter()
        result = subprocess.run(
            ["ping", param, "1", "-w", "2000" if system == "Windows" else "2", host],
            capture_output=True,
            text=True,
            timeout=5,
        )
        elapsed = (time.perf_counter() - start) * 1000

        if result.returncode == 0:
            # Try to parse actual latency from output
            latency = _parse_ping_latency(result.stdout, system)
            if latency is None:
                latency = f"{elapsed:.0f} ms"
            return {"latency": latency, "status": "Success"}
        else:
            return {"latency": "—", "status": "Failed"}
    except (subprocess.TimeoutExpired, FileNotFoundError, Exception):
        return {"latency": "—", "status": "Timeout"}


def _parse_ping_latency(output, system):
    """Extract average latency from ping output."""
    try:
        if system == "Windows":
            for line in output.splitlines():
                if "Average" in line or "Moyenne" in line:
                    # Format: "Average = 18ms"
                    parts = line.split("=")
                    if len(parts) >= 2:
                        return parts[-1].strip().replace("ms", " ms")
                if "time=" in line or "time<" in line:
                    segment = line.split("time")[1]
                    val = segment.split("ms")[0].replace("=", "").replace("<", "").strip()
                    return f"{val} ms"
        else:
            for line in output.splitlines():
                if "avg" in line:
                    # Format: "rtt min/avg/max/mdev = 1.0/1.5/2.0/0.5 ms"
                    parts = line.split("=")[1].strip().split("/")
                    if len(parts) >= 2:
                        return f"{parts[1]} ms"
    except Exception:
        pass
    return None
