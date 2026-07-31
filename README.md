# NetPulse Pro

**Enterprise Network Diagnostics & Wi-Fi Analysis Platform**

A production-quality web application for analyzing Wi-Fi networks, performing network diagnostics, running speed tests, and visualizing network health.

## Tech Stack

### Frontend
- React 19
- Vite
- Tailwind CSS
- React Router DOM
- Axios
- Recharts
- Lucide React

### Backend
- Python 3.12+
- Flask
- Flask-CORS
- Flask-SQLAlchemy
- SQLite

## Getting Started

### Prerequisites
- Node.js 18+
- Python 3.12+
- npm or yarn

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### Backend Setup

```bash
cd backend
python -m venv venv
# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate
pip install -r requirements.txt
python app.py
```

## Project Structure

```
netpulse-pro/
├── frontend/          # React + Vite application
├── backend/           # Flask API server
├── docs/              # Project documentation
├── .gitignore
└── README.md
```

## License

MIT
