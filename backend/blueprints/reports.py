"""Reports Blueprint.

Provides endpoints for listing report history, generating PDF reports,
and downloading generated reports.
"""

import os

from flask import Blueprint, jsonify, send_from_directory, current_app

from services.reports_service import get_report_history, generate_pdf_report

reports_bp = Blueprint("reports", __name__, url_prefix="/api/reports")


def _reports_dir():
    """Get the reports output directory."""
    return os.path.join(current_app.instance_path, "reports")


@reports_bp.route("/history", methods=["GET"])
def report_history():
    """Return list of previously generated reports."""
    history = get_report_history()
    return jsonify(history), 200


@reports_bp.route("/generate", methods=["POST"])
def generate_report():
    """Generate a new PDF report."""
    result = generate_pdf_report(_reports_dir())
    return jsonify(result), 201


@reports_bp.route("/download/<filename>", methods=["GET"])
def download_report(filename):
    """Download a generated report PDF."""
    # Prevent path traversal
    if ".." in filename or "/" in filename or "\\" in filename:
        return jsonify({"status": "error", "message": "Invalid filename"}), 400
    try:
        return send_from_directory(_reports_dir(), filename, as_attachment=True)
    except FileNotFoundError:
        return jsonify({"status": "error", "message": "Report not found"}), 404


@reports_bp.route("/delete/<int:report_id>", methods=["DELETE"])
def delete_report(report_id):
    """Delete a report from history."""
    from services.reports_service import delete_report as _delete
    result = _delete(report_id, _reports_dir())
    if result["status"] == "success":
        return jsonify(result), 200
    return jsonify(result), 404
