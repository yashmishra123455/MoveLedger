# MoveLedger

> A modern, intuitive application for tracking and managing your financial movements and ledger entries.

## 📋 Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Future Migration Roadmap](#future-migration-roadmap)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

---

## 🎯 Overview

MoveLedger is a comprehensive financial ledger management system designed to help users efficiently track, organize, and analyze their financial transactions. The application provides a seamless user experience with intuitive interfaces and powerful financial management tools.

**Current Version:** Basic HTML/CSS/JavaScript Implementation  
**Target Version:** Full-stack MERN application with advanced features

---

## ✨ Features

### Current Implementation
- ✅ **Transaction Tracking** - Record and categorize financial transactions
- ✅ **User-Friendly Interface** - Clean and responsive web interface
- ✅ **Local Storage** - Persistent data storage in browser
- ✅ **Real-time Calculations** - Instant balance and summary updates
- ✅ **Export Functionality** - Export transaction history (planned)

### Planned Features
- 🔐 **User Authentication** - Secure login and account management
- 📊 **Advanced Analytics** - Detailed financial reports and visualizations
- 📱 **Mobile Responsiveness** - Optimized for all devices
- 🌩️ **Cloud Sync** - Real-time data synchronization
- 💾 **Backup & Recovery** - Automated data backup system
- 🔔 **Notifications** - Smart alerts for transactions
- 🌙 **Dark Mode** - Theme customization options

---

## 🛠️ Tech Stack

### Current Stack
```
┌─────────────────┐
│   Frontend      │
├─────────────────┤
│ HTML            │
│ CSS             │
│ JavaScript      │
│ Local Storage   │
└─────────────────┘
```

### Planned Stack
```
┌──────────────────────────────────────────┐
│           MERN Full-Stack                │
├──────────────────────────────────────────┤
│                                          │
│  ┌─────────────────┐                    │
│  │   Frontend      │                    │
│  ├─────────────────┤                    │
│  │ React.js        │                    │
│  │ Redux           │                    │
│  │ Material-UI     │                    │
│  │ Chart.js        │                    │
│  └─────────────────┘                    │
│           ↕                              │
│  ┌─────────────────┐                    │
│  │   Backend       │                    │
│  ├─────────────────┤                    │
│  │ Node.js         │                    │
│  │ Express.js      │                    │
│  │ JWT Auth        │                    │
│  │ RESTful APIs    │                    │
│  └─────────────────┘                    │
│           ↕                              │
│  ┌─────────────────┐                    │
│  │   Database      │                    │
│  ├─────────────────┤                    │
│  │ MongoDB         │                    │
│  │ Mongoose ODM    │                    │
│  └─────────────────┘                    │
│                                          │
└──────────────────────────────────────────┘
```

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React.js | Dynamic UI components |
| | Redux | State management |
| | Axios | HTTP client |
| **Backend** | Node.js | Runtime environment |
| | Express.js | API framework |
| | Passport.js | Authentication |
| **Database** | MongoDB | NoSQL data storage |
| | Mongoose | ODM & validation |
| **DevOps** | Docker | Containerization |
| | Git | Version control |


## 📁 Project Structure

```
MoveLedger/
│
├── 📂 public/
│   ├── index.html
│   ├── favicon.ico
│   └── assets/
│       ├── images/
│       ├── icons/
│       └── logo.png
│
├── 📂 src/
│   ├── 📂 components/
│   │   ├── Dashboard.jsx
│   │   ├── TransactionForm.jsx
│   │   ├── TransactionList.jsx
│   │   ├── Reports.jsx
│   │   └── Navbar.jsx
│   │
│   ├── 📂 pages/
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Dashboard.jsx
│   │   └── Settings.jsx
│   │
│   ├── 📂 redux/
│   │   ├── store.js
│   │   ├── 📂 slices/
│   │   │   ├── transactionSlice.js
│   │   │   ├── userSlice.js
│   │   │   └── uiSlice.js
│   │   └── actions/
│   │
│   ├── 📂 styles/
│   │   ├── index.css
│   │   ├── components.css
│   │   └── responsive.css
│   │
│   ├── 📂 utils/
│   │   ├── api.js
│   │   ├── validators.js
│   │   └── formatters.js
│   │
│   ├── 📂 hooks/
│   │   ├── useTransactions.js
│   │   └── useAuth.js
│   │
│   ├── App.jsx
│   │   └── index.js
│   |
├── 📂 backend/ (Node.js/Express)
│   ├── 📂 routes/
│   │   ├── users.js
│   │   ├── transactions.js
│   │   ├── categories.js
│   │   └── auth.js
│   │
│   ├── 📂 models/
│   │   ├── User.js
│   │   ├── Transaction.js
│   │   └── Category.js
│   │
│   ├── 📂 middleware/
│   │   ├── auth.js
│   │   ├── validation.js
│   │   └── errorHandler.js
│   │
│   ├── 📂 controllers/
│   │   ├── userController.js
│   │   ├── transactionController.js
│   │   └── reportController.js
│   │
│   ├── 📂 config/
│   │   ├── database.js
│   │   ├── passport.js
│   │   └── env.js
│   │
│   ├── server.js
│   │   └── .env
│   |
├── 📂 docker/
│   ├── Dockerfile
│   └── docker-compose.yml
│   |
├── .gitignore
├── package.json
├── README.md
└── LICENSE

```

---

## 🚀 Future Migration Roadmap

### Phase 1: Foundation (Current → Month 1)
```
Current State (HTML/CSS/JS)
          ↓
    - Set up React + Redux
    - Create basic components
    - Establish project structure
          ↓
Basic React Frontend
```

### Phase 2: Backend Development (Month 1-2)
```
Frontend Ready
          ↓
    - Set up Node.js + Express
    - Create RESTful API endpoints
    - Implement authentication (JWT)
    - Error handling & logging
          ↓
Backend API Endpoints
```

### Phase 3: Database Integration (Month 2-3)
```
Backend Ready
          ↓
    - Set up MongoDB Atlas
    - Create data models (Mongoose)
    - Implement database operations
    - Data validation & security
          ↓
Full Database Integration
```

### Phase 4: Feature Enhancement (Month 3-4)
```
Full Stack Ready
          ↓
    - Advanced analytics & charts
    - Report generation
    - Export functionality
    - Notifications system
          ↓
Enhanced Features
```

### Phase 5: DevOps & Deployment (Month 4-5)
```
Features Complete
          ↓
    - Dockerization
    - CI/CD Pipeline (GitHub Actions)
    - Cloud deployment (Heroku/AWS)
    - Performance optimization
          ↓
Production Ready
```

### Detailed Timeline

| Phase | Duration | Key Technologies | Deliverables |
|-------|----------|-----------------|--------------|
| **Phase 1** | Week 1-4 | React, Redux, Webpack | Component library, Redux store |
| **Phase 2** | Week 5-8 | Node.js, Express, JWT | REST API, Auth system |
| **Phase 3** | Week 9-12 | MongoDB, Mongoose | Data models, CRUD operations |
| **Phase 4** | Week 13-16 | Chart.js, Report generators | Analytics dashboard, exports |
| **Phase 5** | Week 17-20 | Docker, GitHub Actions | Containerized app, CI/CD |

---

## 🏁 Getting Started

### Prerequisites
```bash
- Node.js (v14 or higher)
- npm or yarn
- MongoDB (local or Atlas)
- Git
```

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yashmishra123455/MoveLedger.git
cd MoveLedger
```

2. **Install frontend dependencies**
```bash
npm install
```

3. **Install backend dependencies**
```bash
cd backend
npm install
cd ..
```

4. **Configure environment variables**
```bash
# Create .env file in root
REACT_APP_API_URL=http://localhost:5000
REACT_APP_ENV=development

# Create backend/.env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
NODE_ENV=development
PORT=5000
```

5. **Start the application**
```bash
# Terminal 1 - Frontend
npm start

# Terminal 2 - Backend
cd backend
npm start
```

The application will be available at `http://localhost:3000`

---

## 💻 Usage

### Creating a Transaction
1. Navigate to the Dashboard
2. Click "Add Transaction"
3. Enter transaction details:
   - Amount
   - Category
   - Date
   - Description
4. Click "Save"

### Viewing Reports
1. Go to Reports section
2. Select date range and category
3. View charts and statistics
4. Export data if needed

### Managing Categories
1. Access Settings
2. Manage custom categories
3. Set category colors and icons

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Code Style
- Follow ESLint configuration
- Use meaningful variable names
- Add comments for complex logic
- Write unit tests for new features

---

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 📞 Support & Contact

- **Issues**: [GitHub Issues](https://github.com/yashmishra123455/MoveLedger/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yashmishra123455/MoveLedger/discussions)
- **Email**: myash7166@gmail.com

---

## 📊 Project Statistics

- **Current Lines of Code**: ~2,500
- **Target LOC (Full Stack)**: ~15,000+
- **Test Coverage**: 0% → 85% (Planned)
- **Documentation**: In Progress

---

**Made with ❤️ by Yash Mishra**

Last Updated: 2026-02-28 17:39:46
