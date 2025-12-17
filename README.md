# 🏛️ Civic-Link

A comprehensive Digital Complaint Tracking System that empowers citizens to report civic issues and enables administrators to efficiently manage and resolve community complaints. Built as a Problem-Based Learning (PBL) project.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Screenshots](#screenshots)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Setup](#environment-setup)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)
- [License](#license)

## 🌟 Overview

Civic-Link is a full-stack complaint management platform designed to bridge the gap between citizens and local governance. The system provides:

- **For Citizens**: Easy complaint registration and real-time tracking
- **For Administrators**: Comprehensive dashboard for complaint management and resolution
- **For Communities**: Transparent and efficient civic issue resolution

## ✨ Features

### 👤 User Features
- 🔐 **Secure Authentication** - JWT-based user registration and login
- 📝 **Complaint Registration** - Submit complaints with detailed information
- 🔍 **Track Complaints** - Monitor status of registered complaints (Pending, In Progress, Resolved)
- 📊 **Personal Dashboard** - View all your complaints and their current status
- 📍 **Location Details** - Specify exact location of civic issues

### 👨‍💼 Admin Features
- 📈 **Analytics Dashboard** - Visual insights with charts and graphs
  - Status Distribution (Pie Chart)
  - Complaints by Type (Bar Chart)
  - Priority Levels Distribution
  - Recent Activity Feed
- 👥 **User Management** - View all complaints from citizens
- 🎯 **Priority Assignment** - Set complaint priority (High, Medium, Low)
- 📊 **Status Management** - Update complaint status throughout resolution process
- 🔔 **Real-time Tracking** - Monitor all complaints with filtering options
- 📋 **Complaint Assignment** - Assign complaints to specific officials
- 📞 **User Information** - Access citizen contact details for communication

### 🎨 UI Features
- 📱 **Responsive Design** - Works seamlessly on all devices
- 🎯 **Intuitive Interface** - Clean and modern design
- 📊 **Data Visualization** - Interactive charts for better insights
- 🔄 **Real-time Updates** - Live status updates
- 🎨 **Professional Styling** - Tailwind CSS for modern aesthetics

## 🛠️ Tech Stack

### Frontend
- **React.js** - UI library for building interactive interfaces
- **React Router** - For navigation and routing
- **Tailwind CSS** - Utility-first CSS framework
- **Recharts** - For data visualization and charts
- **Axios** - HTTP client for API calls
- **Lucide React** - Modern icon library

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT (jsonwebtoken)** - Secure authentication
- **bcryptjs** - Password hashing
- **dotenv** - Environment variable management
- **cors** - Cross-origin resource sharing

### Development Tools
- **VS Code** - Code editor
- **Git** - Version control
- **npm** - Package manager

## 📸 Screenshots

> 🚀 **Coming Soon!** Screenshots will be added after deployment.
> The application is fully functional and ready for deployment.

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14.x or higher)
- **npm** (v6.x or higher) or **yarn**
- **MongoDB** (local installation) or **MongoDB Atlas** account
- **Git**

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/Chirag1724/Civic-Link.git
cd Civic-Link
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

**Backend Dependencies include:**
- express
- mongoose
- jsonwebtoken
- bcryptjs
- dotenv
- cors
- nodemon (dev dependency)

### 3. Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

**Frontend Dependencies include:**
- react
- react-dom
- react-router-dom
- axios
- recharts
- lucide-react
- tailwindcss

## ⚙️ Environment Setup

### 🔴 IMPORTANT: Backend Environment Configuration

**You must create a `.env` file in the backend folder! The application will not work without it.**

#### Step 1: Navigate to Backend Directory

```bash
cd backend
```

#### Step 2: Create `.env` File

On Windows:
```bash
type nul > .env
```

On Linux/Mac:
```bash
touch .env
```

Or manually create a file named `.env` in the backend folder.

#### Step 3: Add Environment Variables

Add these variables to your `.env` file:

```env
# Server Configuration
PORT=5000

# Database Configuration - MongoDB Atlas
MONGO_URI=mongodb+srv://your_username:your_password@cluster0.xxxxx.mongodb.net/CivicLink?retryWrites=true&w=majority&appName=Cluster0

# JWT Secret Key (for authentication)
JWT_SECRET=your_super_secret_jwt_key_here_minimum_32_characters

# Optional: Node Environment
NODE_ENV=development
```

### 📝 Environment Variables Explained

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Backend server port | `5000` |
| `MONGO_URI` | MongoDB connection string | See below |
| `JWT_SECRET` | Secret key for JWT tokens | Random string (32+ chars) |
| `NODE_ENV` | Environment mode | `development` or `production` |

### 🗄️ MongoDB Setup

#### Option 1: MongoDB Atlas (Recommended - Cloud)

1. **Sign up** at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. **Create a Cluster** (Free tier available)
3. **Create Database User**:
   - Go to Database Access
   - Add New Database User
   - Set username and password
   - Save credentials
4. **Whitelist IP Address**:
   - Go to Network Access
   - Add IP Address
   - Allow access from anywhere (0.0.0.0/0) for development
5. **Get Connection String**:
   - Go to Clusters
   - Click "Connect"
   - Choose "Connect your application"
   - Copy connection string
   - Replace `<password>` with your actual password
   - Replace `<dbname>` with `CivicLink`

**Final MONGO_URI format:**
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/CivicLink?retryWrites=true&w=majority&appName=Cluster0
```

#### Option 2: Local MongoDB

If using local MongoDB:
```env
MONGO_URI=mongodb://localhost:27017/CivicLink
```

### 🔐 Generating Secure JWT Secret

Use one of these methods to generate a secure JWT_SECRET:

**Method 1: Node.js**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Method 2: Online Generator**
Visit: https://randomkeygen.com/ (use Fort Knox Passwords)

**Method 3: Simple Random String**
```
my_super_secret_jwt_key_2024_civic_link_application
```

### ⚠️ Security Best Practices

1. **Never commit `.env` file** to Git (already in .gitignore)
2. **Use strong, random JWT_SECRET** (minimum 32 characters)
3. **Keep MongoDB credentials secure**
4. **Use different secrets** for development and production
5. **Regularly rotate secrets** in production

## 🏃‍♂️ Running the Application

### Development Mode

#### Terminal 1: Start Backend Server

```bash
cd backend
npm start
# or for auto-reload during development
npm run dev
```

Backend will run on: `http://localhost:5000`

**Expected Output:**
```
Server running on port 5000
MongoDB Connected: cluster0.xxxxx.mongodb.net
```

#### Terminal 2: Start Frontend Development Server

```bash
cd frontend
npm start
```

Frontend will run on: `http://localhost:3000`

**Expected Output:**
```
Compiled successfully!
You can now view frontend in the browser.
Local: http://localhost:3000
```

### Access the Application

- **User Portal**: `http://localhost:3000/`
- **Login Page**: `http://localhost:3000/login`
- **Signup Page**: `http://localhost:3000/signup`
- **User Dashboard**: `http://localhost:3000/dashboard`
- **Admin Dashboard**: `http://localhost:3000/official`
- **API Endpoints**: `http://localhost:5000/api/`

## 📁 Project Structure

```
Civic-Link/
│
├── backend/
│   ├── config/
│   │   └── db.js                    # MongoDB connection configuration
│   │
│   ├── controllers/
│   │   ├── authController.js        # User authentication logic
│   │   └── complaintController.js   # Complaint management logic
│   │
│   ├── models/
│   │   ├── User.js                  # User schema (citizens & officials)
│   │   ├── Worker.js                # Worker/Official schema
│   │   └── Complaint.js             # Complaint schema
│   │
│   ├── routes/
│   │   ├── authRoutes.js            # Authentication routes
│   │   ├── complaintRoutes.js       # Complaint routes
│   │   └── statsRoutes.js           # Statistics routes
│   │
│   ├── middleware/
│   │   └── authMiddleware.js        # JWT verification middleware
│   │
│   ├── dsa/
│   │   ├── graph.js                 # Graph data structure
│   │   ├── hashSet.js               # Hash set implementation
│   │   ├── priorityQueue.js         # Priority queue for complaints
│   │   └── queue.js                 # Queue implementation
│   │
│   ├── .env                         # Environment variables (CREATE THIS!)
│   ├── .env.example                 # Example environment file
│   ├── .gitignore                   # Git ignore file
│   ├── server.js                    # Express server entry point
│   ├── package.json                 # Backend dependencies
│   ├── package-lock.json
│   └── prototype.tldr               # Design prototype
│
├── frontend/
│   ├── public/
│   │   ├── index.html               # HTML template
│   │   └── CivicLink_logo.png       # Application logo
│   │
│   ├── src/
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx      # Home/Landing page
│   │   │   ├── Login.jsx            # User login page
│   │   │   ├── Signup.jsx           # User registration page
│   │   │   ├── CitizenDashboard.jsx # User dashboard
│   │   │   ├── OfficialDashboard.jsx# Admin dashboard
│   │   │   └── TrackComplaint.jsx   # Complaint tracking page
│   │   │
│   │   ├── tailwind.config.js       # Tailwind CSS configuration
│   │   ├── App.jsx                  # Main application component
│   │   ├── main.jsx                 # React entry point
│   │   ├── App.jsx                  # Root component with routing
│   │   └── styles.css               # Global styles
│   │
│   ├── package.json                 # Frontend dependencies
│   ├── package-lock.json
│   ├── postcss.config.js            # PostCSS configuration
│   └── tailwind.config.js           # Tailwind configuration
│
├── .gitignore                       # Git ignore rules
├── README.md                        # Project documentation (this file)
└── prototype.tldr                   # Design prototype file
```

## 🔌 API Endpoints

### Authentication Routes (`/api/auth`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/auth/signup` | Register new user | Public |
| POST | `/api/auth/login` | User login | Public |
| GET | `/api/auth/profile` | Get user profile | Private |

### Complaint Routes (`/api/complaints`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/complaints/register` | Register new complaint | Private (User) |
| GET | `/api/complaints/user` | Get user's complaints | Private (User) |
| GET | `/api/complaints/all` | Get all complaints | Private (Admin) |
| GET | `/api/complaints/:id` | Get complaint by ID | Private |
| PUT | `/api/complaints/:id` | Update complaint | Private (Admin) |
| DELETE | `/api/complaints/:id` | Delete complaint | Private (Admin) |

### Statistics Routes (`/api/stats`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/stats/dashboard` | Get dashboard stats | Private (Admin) |
| GET | `/api/stats/user` | Get user stats | Private (User) |

## 🎯 Key Features Implementation

### Data Structures Used (DSA Folder)

The project implements various data structures for efficient complaint management:

- **Priority Queue** (`priorityQueue.js`) - For handling complaints based on priority
- **Queue** (`queue.js`) - For FIFO complaint processing
- **Graph** (`graph.js`) - For relationship mapping
- **Hash Set** (`hashSet.js`) - For fast lookups

### Database Schema

**User Model:**
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (citizen/official),
  phone: String,
  createdAt: Date
}
```

**Complaint Model:**
```javascript
{
  userId: ObjectId (ref: User),
  type: String (Water/Electricity/Road/etc),
  description: String,
  location: String,
  priority: String (High/Medium/Low),
  status: String (Pending/In Progress/Resolved),
  assignedTo: String,
  createdAt: Date,
  updatedAt: Date
}
```

## 🤝 Contributing

We welcome contributions from developers of all skill levels! Here's how you can contribute:

### 1. Fork the Repository

```bash
git clone https://github.com/Chirag1724/Civic-Link.git
cd Civic-Link
```

### 2. Create a Feature Branch

```bash
git checkout -b feature/YourAmazingFeature
```

### 3. Make Your Changes

- Write clean, commented code
- Follow existing code style
- Test your changes thoroughly

### 4. Commit Your Changes

```bash
git add .
git commit -m "Add: Your amazing feature description"
```

### 5. Push to Your Branch

```bash
git push origin feature/YourAmazingFeature
```

### 6. Open a Pull Request

- Go to the original repository
- Click "Pull Request"
- Provide a clear description of changes

### Contribution Guidelines

- 📝 Write meaningful commit messages
- 🧪 Test your code before submitting
- 📖 Update documentation if needed
- 💬 Be respectful and constructive
- 🐛 Report bugs via GitHub Issues

## 🐛 Troubleshooting

### Common Issues and Solutions

#### 1. MongoDB Connection Error

**Error:** `MongoServerError: bad auth`

**Solution:**
- Verify MONGO_URI is correct
- Check username and password
- Ensure password doesn't have special characters (URL encode if needed)
- Whitelist IP address in MongoDB Atlas

#### 2. Port Already in Use

**Error:** `EADDRINUSE: address already in use :::5000`

**Solution:**

On Windows:
```bash
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

On Linux/Mac:
```bash
lsof -i :5000
kill -9 <PID>
```

Or change PORT in .env file:
```env
PORT=5001
```

#### 3. JWT Token Invalid

**Error:** `JsonWebTokenError: invalid token`

**Solution:**
- Clear browser localStorage
- Login again
- Verify JWT_SECRET matches in .env
- Check token expiration

#### 4. CORS Error

**Error:** `Access-Control-Allow-Origin error`

**Solution:**
- Verify backend CORS is configured
- Check frontend API URL
- Ensure backend is running

#### 5. Dependencies Installation Failed

**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall dependencies
npm install
```

#### 6. Frontend Not Loading

**Solution:**
- Check if backend is running
- Verify API endpoints in frontend code
- Check browser console for errors
- Clear browser cache

## 🔐 Security Notes

### Important Security Practices

1. **Environment Variables**
   - Never commit `.env` file to version control
   - Use different secrets for development and production
   - Keep JWT_SECRET long and random (32+ characters)

2. **Database Security**
   - Use strong MongoDB passwords
   - Whitelist only necessary IP addresses
   - Enable MongoDB Atlas network security

3. **API Security**
   - All sensitive routes protected with JWT
   - Password hashing with bcrypt
   - Input validation on all endpoints

4. **Production Deployment**
   - Use HTTPS in production
   - Set NODE_ENV to 'production'
   - Enable rate limiting
   - Regular security updates

## 📊 Project Statistics

- **Total Lines of Code**: ~5000+
- **Components**: 6 React pages
- **API Endpoints**: 10+
- **Database Collections**: 3
- **Authentication**: JWT-based

## 🎓 Academic Information

**Project Type**: Problem-Based Learning (PBL)  
**Domain**: Web Development, Civic Technology  
**Technologies**: MERN Stack (MongoDB, Express, React, Node.js)  
**Focus Areas**: 
- Full-stack development
- Database design
- User authentication
- Data visualization
- Responsive design

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Chirag Dwivedi**
- GitHub: [@Chirag1724](https://github.com/Chirag1724)
- Email: chiragdwivedi@gmail.com

## 🙏 Acknowledgments

- Thanks to all contributors who help improve Civic-Link
- Special thanks to the open-source community
- Inspired by the need for better civic governance
- Built with ❤️ for the community

## 📞 Support & Feedback

### Need Help?

- 📧 **Email**: chiragdwivedi@gmail.com
- 🐛 **Bug Reports**: [GitHub Issues](https://github.com/Chirag1724/Civic-Link/issues)
- 💡 **Feature Requests**: [GitHub Discussions](https://github.com/Chirag1724/Civic-Link/discussions)
- ⭐ **Star this repo** if you find it helpful!

### Feedback

Your feedback is valuable! If you have suggestions or found any issues:
1. Open an issue on GitHub
2. Submit a pull request
3. Contact via email

---

<div align="center">

**Made with ❤️ for the Community**

⭐ Star this repository if you find it helpful!

[Report Bug](https://github.com/Chirag1724/Civic-Link/issues) · [Request Feature](https://github.com/Chirag1724/Civic-Link/issues) · [Documentation](https://github.com/Chirag1724/Civic-Link/wiki)

</div>
