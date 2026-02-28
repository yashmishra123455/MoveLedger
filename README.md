<div align="center">

# 💰 MoveLedger

### *Intelligent Personal Finance Management Platform*

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-brightgreen)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18%2B-61DAFB?logo=react)](https://react.dev/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Latest-13AA52?logo=mongodb)](https://www.mongodb.com/)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-181717?logo=github)](https://github.com/yashmishra123455/MoveLedger)

---

**Transform your financial life with intelligent transaction tracking, smart budgeting, and actionable insights.**

[📖 Documentation](#documentation) • [🤝 Contributing](#contributing) • [📞 Support](#support)

</div>

---

## 📋 Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Technology Stack](#technology-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Architecture](#architecture)
- [API Endpoints](#api-endpoints)
- [Undo & Redo System](#undo--redo-system)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)

---

## 📊 Overview

**MoveLedger** is a comprehensive personal finance management platform designed to empower users with complete control over their financial data. Built with modern web technologies and scalable architecture, MoveLedger provides real-time transaction tracking, intelligent budget management, and data-driven financial insights.

### Why MoveLedger?

- 🎯 **Intuitive Dashboard** - Clean, responsive UI for effortless financial management
- 🔒 **Bank-Grade Security** - Secure authentication and encrypted data storage
- ⚡ **Real-Time Analytics** - Instant insights into spending patterns
- 📱 **Mobile-First Design** - Seamless experience across all devices
- 🔄 **Smart Undo/Redo** - Never worry about accidental changes

---

## ✨ Key Features

### Core Capabilities

| Feature | Description | Status |
|---------|-------------|--------|
| **User Authentication** | Secure registration and login with JWT tokens | ✅ Complete |
| **Transaction Management** | Create, edit, categorize, and track all transactions | ✅ Complete |
| **Smart Budgeting** | Set category-based budgets with real-time tracking | ✅ Complete |
| **Advanced Analytics** | Visualize spending patterns with interactive charts | ✅ Complete |
| **Report Generation** | Generate detailed financial reports (PDF/CSV) | ✅ Complete |
| **Responsive Design** | Optimized for mobile, tablet, and desktop | ✅ Complete |
| **Undo/Redo System** | Comprehensive change history with reversal capability | ✅ Complete |
| **Data Export** | Export financial data in multiple formats | 🔄 In Progress |
| **AI Insights** | ML-powered financial recommendations | 📅 Planned |

---

## 🛠 Technology Stack

### Frontend Architecture
- **React 18+** - UI component library
- **Redux/Context API** - State management
- **Tailwind CSS** - Modern styling
- **Axios** - HTTP client
- **Chart.js/Recharts** - Data visualization

### Backend Infrastructure
- **Node.js** - Runtime environment
- **Express.js** - API framework
- **JWT** - Authentication
- **Middleware** - Rate limiting, CORS, validation

### Database Layer
- **MongoDB** - NoSQL database
- **Mongoose** - ODM library
- **Indexing** - Performance optimization
- **Replication** - Data redundancy

---

## 🚀 Getting Started

### Prerequisites

```bash
# Verify your system has:
- Node.js v18 or higher
- npm v9 or higher (or yarn v3+)
- MongoDB v5+ (local or cloud instance)
- Git v2.30+
```

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yashmishra123455/MoveLedger.git
cd MoveLedger
```

2. **Install dependencies**
```bash
npm install
cd server && npm install && cd ..
```

3. **Configure environment variables**
```bash
# Create .env file in root directory
cp .env.example .env

# Edit .env with your configuration:
MONGODB_URI=mongodb://localhost:27017/moveledger
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
PORT=5000
REACT_APP_API_URL=http://localhost:5000
```

4. **Start MongoDB**
```bash
# Local MongoDB
mongod

# Or use MongoDB Atlas (cloud)
```

5. **Start the development servers**
```bash
# Terminal 1 - Start backend
cd server && npm start

# Terminal 2 - Start frontend  
npm start
```

6. **Access the application**
```
Open browser: http://localhost:3000
Backend API: http://localhost:5000
```

### Docker Setup (Optional)

```bash
# Build and run with Docker
docker build -t moveledger .
docker run -p 3000:3000 -p 5000:5000 moveledger
```

---

## 📁 Project Structure

```
MoveLedger/
├── 📂 src/                          # Frontend source code
│   ├── 📂 components/               # React components
│   │   ├── Dashboard/
│   │   ├── Transactions/
│   │   ├── Budget/
│   │   ├── Reports/
│   │   └── Common/
│   ├── 📂 pages/                    # Page components
│   ├── 📂 styles/                   # Global CSS
│   ├── 📂 utils/                    # Utility functions
│   ├── 📂 services/                 # API services
│   ├── 📂 hooks/                    # Custom React hooks
│   ├── App.jsx
│   └── index.jsx
│
├── 📂 server/                       # Backend source code
│   ├── 📂 models/                   # MongoDB schemas
│   │   ├── User.js
│   │   ├── Transaction.js
│   │   └── Budget.js
│   ├── 📂 routes/                   # API routes
│   ├── 📂 controllers/              # Business logic
│   ├── 📂 middleware/               # Express middleware
│   ├── 📂 config/                   # Configuration
│   └── server.js
│
├── 📂 public/                       # Static assets
├── 📂 docs/                         # Documentation
│   ├── 📂 screenshots/              # UI screenshots
│   ├── 📂 diagrams/                 # Architecture diagrams
│   └── API.md
│
├── 📋 .env.example
├── 📋 package.json
├── 📋 README.md
├── 📋 LICENSE
└── 📋 CONTRIBUTING.md
```

---

## 🏗 Architecture

### System Design

```
┌─────────────────────────────────────────────────────────────┐
│                     CLIENT LAYER (React)                    │
│  Dashboard │ Transactions │ Budget │ Reports │ Analytics    │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTPS/REST API
┌────────────────────────▼────────────────────────────────────┐
│                 API GATEWAY (Express)                       │
│  Authentication Middleware │ Rate Limiting │ Validation     │
└────────────────────────┬────────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────────┐
│            BUSINESS LOGIC LAYER (Controllers)               │
│   Auth │ Transactions │ Budgets │ Reports │ Analytics       │
└────────────────────────┬────────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────────┐
│                    DATA ACCESS LAYER                        │
│            (Mongoose ORM / MongoDB)                         │
└────────────────────────┬────────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────────┐
│               MONGODB DATABASE                              │
│    Users │ Transactions │ Budgets │ Audit Logs              │
└─────────────────────────────────────────────────────────────┘
```

### Security Architecture

- **Authentication:** JWT-based token system with refresh tokens
- **Encryption:** Password hashing with bcrypt, HTTPS in transit
- **Authorization:** Role-based access control (RBAC)
- **Input Validation:** Schema validation on all endpoints
- **Rate Limiting:** Prevent brute force attacks
- **Audit Logging:** Track all sensitive operations

---

## 🔌 API Endpoints

### Authentication

```http
POST   /api/auth/register          # Register new user
POST   /api/auth/login             # Login user
POST   /api/auth/logout            # Logout user
GET    /api/auth/profile           # Get user profile
PUT    /api/auth/profile           # Update user profile
```

### Transactions

```http
GET    /api/transactions           # Get all transactions
POST   /api/transactions           # Create transaction
GET    /api/transactions/:id       # Get transaction by ID
PUT    /api/transactions/:id       # Update transaction
DELETE /api/transactions/:id       # Delete transaction
GET    /api/transactions/stats     # Get transaction statistics
```

### Budgets

```http
GET    /api/budgets                # Get all budgets
POST   /api/budgets                # Create budget
GET    /api/budgets/:id            # Get budget by ID
PUT    /api/budgets/:id            # Update budget
DELETE /api/budgets/:id            # Delete budget
```

### Reports

```http
GET    /api/reports/monthly        # Generate monthly report
GET    /api/reports/export         # Export data (CSV/PDF)
```

---

## 🔄 Undo & Redo System

MoveLedger features a sophisticated undo/redo system ensuring data integrity:

### Features

- **Change Tracking:** Every transaction modification is recorded with timestamps
- **State Management:** Maintains operation history with full context
- **Atomic Operations:** Ensures consistency across all changes
- **User Control:** Simple UI buttons for undo/redo actions
- **Limit:** Maintains last 50 operations per user

### Implementation

```javascript
// Create transaction (recorded in history)
const transaction = await createTransaction(data);

// User triggers undo
await undoAction();  // Transaction reverted

// User can redo if needed
await redoAction();  // Transaction restored
```

---

## 🗺 Roadmap

### Phase 1: Foundation (Current)
- ✅ Core transaction management
- ✅ Basic budgeting features
- ✅ User authentication
- ✅ Report generation
- ✅ Undo/Redo system

### Phase 2: Enhancement (Q2 2026)
- 🔄 Multi-currency support
- 🔄 Recurring transactions
- 🔄 Advanced filtering & search
- 🔄 Mobile app (React Native)

### Phase 3: Intelligence (Q3 2026)
- 📅 Machine learning insights
- 📅 Financial recommendations
- 📅 Investment tracking
- 📅 API marketplace integration

### Phase 4: Scaling (Q4 2026)
- 📅 Collaborative budgeting
- 📅 Bill reminders & notifications
- 📅 Cryptocurrency support
- 📅 Advanced analytics dashboard

---

## 🤝 Contributing

We welcome contributions! Here's how to get started:

### Steps to Contribute

1. **Fork** the repository
2. **Create** a feature branch:
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. **Commit** your changes:
   ```bash
   git commit -m 'Add some AmazingFeature'
   ```
4. **Push** to the branch:
   ```bash
   git push origin feature/AmazingFeature
   ```
5. **Open** a Pull Request

### Code Standards

- Follow ESLint configuration
- Write unit tests for new features
- Maintain >80% code coverage
- Document complex functions
- Use conventional commits

### Found a Bug?

Please create an issue with:
- Detailed description
- Steps to reproduce
- Expected vs actual behavior
- Screenshots/logs
- System information

---

## 📞 Support

### Getting Help

- 📖 **Documentation:** [Full docs](./docs/README.md)
- 💬 **Discussions:** [GitHub Discussions](https://github.com/yashmishra123455/MoveLedger/discussions)
- 🐛 **Issues:** [Report bug](https://github.com/yashmishra123455/MoveLedger/issues)
- 📧 **Email:** support@moveledger.dev

### FAQ

**Q: Is my data secure?**
A: Yes! We use industry-standard encryption (bcrypt, JWT, HTTPS).

**Q: Can I export my data?**
A: Yes, export to CSV or PDF from the Reports section.

**Q: Is there an API?**
A: Yes! Full REST API documentation in `/docs/API.md`

**Q: How often is data backed up?**
A: Daily automated backups with 30-day retention.

---

## 📜 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for complete details.

**Key License Terms:**
- ✅ Free to use commercially
- ✅ Modify as needed
- ✅ Distribute to others
- ⚠️ Include license notice
- ⚠️ Provide source code

---

## 👨‍💻 Authors & Contributors

### Core Team
- **Yash Mishra** ([@yashmishra123455](https://github.com/yashmishra123455)) - Lead Developer & Architect

### Acknowledgments

- Built with ❤️ for the open-source community
- Inspired by modern fintech solutions
- Special thanks to all contributors and supporters

---

<div align="center">

### 🌟 If you find MoveLedger helpful, please give it a star!

**[View on GitHub](https://github.com/yashmishra123455/MoveLedger)** | **[Report Issues](https://github.com/yashmishra123455/MoveLedger/issues)**

[🔝 Back to Top](#-moveledger)

</div>