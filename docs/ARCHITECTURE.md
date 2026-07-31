# Architecture Overview

## NetPulse Pro - System Architecture

This document outlines the high-level architecture of the NetPulse Pro platform.

### Frontend Architecture
- Component-based React architecture
- Client-side routing with React Router
- Centralized API layer with Axios
- Chart visualizations with Recharts

### Backend Architecture
- Flask application factory pattern
- RESTful API design
- SQLAlchemy ORM with SQLite
- CORS-enabled for frontend communication

### Data Flow
```
Frontend (React) <--HTTP/REST--> Backend (Flask) <--ORM--> SQLite Database
```

*Further documentation will be added as the project evolves.*
