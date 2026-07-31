"""Reports service layer.

Handles report history tracking and PDF generation using ReportLab.
Aggregates data from other service layers for the report content.
"""

import os
from datetime import datetime, timezone
from io import BytesIO

from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import mm
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
)

from services.wifi_service import get_current_network, scan_nearby_networks
from services.network_service import get_network_info, run_dns_lookup
from services.signal_service import get_signal_data
from services.analytics_service import get_analytics_data

# In-memory report history (would be a DB table in production)
_report_history = [
    {
        "id": 1,
        "name": "Weekly Network Summary",
        "generated_at": "2026-07-20 09:30",
        "type": "PDF",
        "size": "198 KB",
    },
    {
        "id": 2,
        "name": "Network Diagnostics Report",
        "generated_at": "2026-07-21 14:15",
        "type": "PDF",
        "size": "215 KB",
    },
    {
        "id": 3,
        "name": "Signal Analysis Report",
        "generated_at": "2026-07-22 11:00",
        "type": "PDF",
        "size": "183 KB",
    },
]

_next_id = 4


def get_report_history():
    """Return list of previously generated reports."""
    return _report_history


def delete_report(report_id, reports_dir):
    """Delete a report by ID."""
    global _report_history
    report = next((r for r in _report_history if r["id"] == report_id), None)
    if not report:
        return {"status": "error", "message": "Report not found"}

    # Delete file if it exists
    filename = report.get("filename")
    if filename:
        filepath = os.path.join(reports_dir, filename)
        if os.path.exists(filepath):
            os.remove(filepath)

    _report_history = [r for r in _report_history if r["id"] != report_id]
    return {"status": "success", "message": "Report deleted"}


def generate_pdf_report(reports_dir):
    """Generate a comprehensive network report PDF.

    Args:
        reports_dir: Directory where generated PDFs are stored.

    Returns:
        dict with status, message, and filename.
    """
    global _next_id

    os.makedirs(reports_dir, exist_ok=True)

    timestamp = datetime.now(timezone.utc)
    filename = f"netpulse_report_{timestamp.strftime('%Y%m%d_%H%M%S')}.pdf"
    filepath = os.path.join(reports_dir, filename)

    # Gather data from service layers
    wifi_data = get_current_network()
    networks = scan_nearby_networks()
    network_info = get_network_info()
    dns_data = run_dns_lookup()
    signal_data = get_signal_data()
    analytics_data = get_analytics_data()

    # Build PDF
    _build_pdf(
        filepath, wifi_data, networks, network_info, dns_data, signal_data, analytics_data
    )

    # Calculate file size
    file_size = os.path.getsize(filepath)
    size_str = f"{file_size / 1024:.0f} KB"

    # Add to history
    report_entry = {
        "id": _next_id,
        "name": "Network Report",
        "generated_at": timestamp.strftime("%Y-%m-%d %H:%M"),
        "type": "PDF",
        "size": size_str,
        "filename": filename,
    }
    _report_history.insert(0, report_entry)
    _next_id += 1

    return {
        "status": "success",
        "message": "Report generated successfully",
        "filename": filename,
        "size": size_str,
    }


def _build_pdf(filepath, wifi_data, networks, network_info, dns_data, signal_data, analytics_data):
    """Build the PDF document using ReportLab."""
    doc = SimpleDocTemplate(filepath, pagesize=A4, topMargin=20 * mm, bottomMargin=20 * mm)
    styles = getSampleStyleSheet()
    elements = []

    # Custom styles
    title_style = ParagraphStyle(
        "CustomTitle", parent=styles["Heading1"], fontSize=22, spaceAfter=10
    )
    heading_style = ParagraphStyle(
        "CustomHeading", parent=styles["Heading2"], fontSize=14, spaceBefore=16, spaceAfter=8
    )
    body_style = styles["Normal"]

    # Title
    elements.append(Paragraph("NetPulse Pro — Network Report", title_style))
    elements.append(Paragraph(
        f"Generated: {datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M UTC')}",
        body_style,
    ))
    elements.append(Spacer(1, 12))

    # --- Dashboard Summary ---
    elements.append(Paragraph("Dashboard Summary", heading_style))
    summary = analytics_data.get("summary", {})
    summary_table_data = [
        ["Metric", "Value"],
        ["Avg Download", f"{summary.get('avg_download', 'N/A')} Mbps"],
        ["Avg Upload", f"{summary.get('avg_upload', 'N/A')} Mbps"],
        ["Avg Ping", f"{summary.get('avg_ping', 'N/A')} ms"],
        ["Avg Signal", f"{summary.get('avg_signal', 'N/A')}%"],
        ["Performance Score", f"{summary.get('performance_score', 'N/A')}/100"],
    ]
    elements.append(_make_table(summary_table_data))
    elements.append(Spacer(1, 10))

    # --- Wi-Fi Information ---
    elements.append(Paragraph("Wi-Fi Information", heading_style))
    wifi_table_data = [
        ["Field", "Value"],
        ["SSID", wifi_data.get("ssid", "N/A")],
        ["Status", wifi_data.get("status", "N/A")],
        ["Signal", f"{wifi_data.get('signal_strength', 'N/A')} dBm ({wifi_data.get('signal_percent', 'N/A')}%)"],
        ["Frequency", wifi_data.get("frequency", "N/A")],
        ["Channel", str(wifi_data.get("channel", "N/A"))],
        ["Security", wifi_data.get("security", "N/A")],
        ["MAC Address", wifi_data.get("mac_address", "N/A")],
    ]
    elements.append(_make_table(wifi_table_data))
    elements.append(Spacer(1, 6))
    elements.append(Paragraph(f"Nearby Networks Detected: {len(networks)}", body_style))
    elements.append(Spacer(1, 10))

    # --- Network Diagnostics ---
    elements.append(Paragraph("Network Diagnostics", heading_style))
    net_table_data = [
        ["Field", "Value"],
        ["Hostname", network_info.get("hostname", "N/A")],
        ["Local IP", network_info.get("local_ip", "N/A")],
        ["Public IP", network_info.get("public_ip", "N/A")],
        ["Gateway", network_info.get("gateway", "N/A")],
        ["DNS Server", network_info.get("dns_server", "N/A")],
        ["OS", network_info.get("operating_system", "N/A")],
    ]
    elements.append(_make_table(net_table_data))
    elements.append(Spacer(1, 6))

    # DNS Lookup
    elements.append(Paragraph("DNS Lookup Results", heading_style))
    dns_table_data = [["Domain", "IP Address", "Response", "Status"]]
    for entry in dns_data[:5]:
        dns_table_data.append([
            entry.get("domain", ""),
            entry.get("ip_address", ""),
            entry.get("response_time", ""),
            entry.get("status", ""),
        ])
    elements.append(_make_table(dns_table_data))
    elements.append(Spacer(1, 10))

    # --- Signal Analysis ---
    elements.append(Paragraph("Signal Analysis", heading_style))
    signal_table_data = [
        ["Metric", "Value"],
        ["RSSI", f"{signal_data.get('rssi', 'N/A')} dBm"],
        ["Signal Strength", f"{signal_data.get('signal_percent', 'N/A')}%"],
        ["Noise Floor", f"{signal_data.get('noise', 'N/A')} dBm"],
        ["SNR", f"{signal_data.get('snr', 'N/A')} dB"],
        ["Channel", str(signal_data.get("channel", "N/A"))],
        ["Frequency", signal_data.get("frequency", "N/A")],
        ["Bandwidth", signal_data.get("bandwidth", "N/A")],
        ["Quality", signal_data.get("quality", "N/A")],
    ]
    elements.append(_make_table(signal_table_data))
    elements.append(Spacer(1, 10))

    # --- Analytics Summary ---
    elements.append(Paragraph("Analytics Summary", heading_style))
    elements.append(Paragraph(
        f"Total Tests Run: {summary.get('total_tests', 'N/A')} | "
        f"Uptime: {summary.get('uptime_percent', 'N/A')}%",
        body_style,
    ))

    # Build document
    doc.build(elements)


def _make_table(data):
    """Create a styled table from a 2D data list."""
    table = Table(data, hAlign="LEFT")
    style = TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#4f46e5")),
        ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
        ("FONTSIZE", (0, 0), (-1, -1), 9),
        ("BOTTOMPADDING", (0, 0), (-1, 0), 8),
        ("TOPPADDING", (0, 0), (-1, 0), 8),
        ("BOTTOMPADDING", (0, 1), (-1, -1), 5),
        ("TOPPADDING", (0, 1), (-1, -1), 5),
        ("BACKGROUND", (0, 1), (-1, -1), colors.HexColor("#f9fafb")),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.HexColor("#f9fafb"), colors.white]),
        ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#e5e7eb")),
        ("LEFTPADDING", (0, 0), (-1, -1), 8),
        ("RIGHTPADDING", (0, 0), (-1, -1), 8),
    ])
    table.setStyle(style)
    return table
