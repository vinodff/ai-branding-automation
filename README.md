
# BrandCraft - Enterprise SaaS Platform

High-performance, credit-based AI Branding platform built with FastAPI, SQLAlchemy, and React.

## 🚀 Startup Instructions

### 1. Prerequisites
- Python 3.10+
- Node.js 18+
- SQLite (default) or PostgreSQL

### 2. Backend Setup
```bash
# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env 
# Ensure API_KEY and JWT_SECRET are set

# Initialize Database & Run Diagnostics
python system_check.py

# Start the Server
python main.py
```

### 3. Frontend Setup
```bash
# The app is designed to run via index.html/index.tsx (ESM modules)
# Simply serve the root directory using any static file server
npx serve .
```

## 🏗 Project Architecture

```text
brandcraft/
├── core/               # Security, Logging, Middleware
├── database/           # Models, Connection, CRUD
├── modules/            # SaaS Logic (Auth, Credits, Plans)
├── routes/             # API Endpoints
├── services/           # AI Routing & Metrics Engine
├── static/             # Generated Assets
├── main.py             # Entry Point
└── system_check.py     # Diagnostic Script
```

## 💳 Usage Credits
| Feature | Cost |
| :--- | :--- |
| Brand Name | 1 Credit |
| Content Generation | 2 Credits |
| Logo Synthesis | 5 Credits |
| AI Assistant | 1 Credit |

## 🛡 Security
- Built-in **Prompt Injection** filters.
- **JWT** Authentication with tier-based access.
- **XSS** and Malicious Text filtering on all inputs.
