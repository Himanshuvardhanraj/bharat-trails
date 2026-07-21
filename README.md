# 🇮🇳 BharatTrails

**Discover, Explore & Share Incredible Destinations Across India**

BharatTrails is a full-stack travel discovery platform inspired by YelpCamp, designed specifically for exploring the beauty and diversity of India. Users can browse destinations, create their own travel listings, write reviews, and share their experiences with fellow travelers.

---

## ✨ Features

### 🔐 Authentication
- User Registration
- Secure Login & Logout
- Password Authentication using Passport.js
- Session Management
- Flash Messages

### 🏕️ Destination Management
- View all destinations
- Add new destinations
- Edit existing destinations
- Delete destinations
- Detailed destination pages

### ⭐ Reviews
- Add reviews
- Delete reviews
- Rating system
- Review validation

### 🎨 User Interface
- Responsive Bootstrap 5 Design
- Modern Navigation Bar
- Interactive Home Page
- Why Us Page
- Clean Card Layouts
- Flash Notifications

### 🛡️ Validation & Security
- Server-side validation
- Error handling
- Express middleware
- Secure session management

---

# 🛠️ Tech Stack

## Frontend
- HTML5
- CSS3
- Bootstrap 5
- EJS

## Backend
- Node.js
- Express.js

## Database
- MongoDB
- Mongoose

## Authentication
- Passport.js
- Passport Local
- Passport Local Mongoose
- Express Session
- Connect Flash

## Other Packages
- ejs-mate
- method-override
- Joi
- dotenv

---

# 📂 Project Structure

```
bharat-trails
│
├── models/
│   ├── campground.js
│   ├── review.js
│   └── user.js
│
├── routes/
│   ├── campground.js
│   ├── review.js
│   └── users.js
│
├── utils/
│   ├── catchAsync.js
│   ├── ExpressError.js
│   ├── validateCampground.js
│   └── validateReview.js
│
├── public/
│   ├── css/
│   ├── js/
│   └── images/
│
├── views/
│   ├── campgrounds/
│   ├── users/
│   ├── partials/
│   ├── layout/
│   ├── home.ejs
│   ├── why-us.ejs
│   └── error.ejs
│
├── app.js
├── package.json
├── README.md
└── .env
```

---

# 🚀 Installation

Clone the repository

```bash
git clone https://github.com/Himanshuvardhanraj/bharat-trails.git
```

Move into the project

```bash
cd bharat-trails
```

Install dependencies

```bash
npm install
```

Create a `.env` file

```env
DB_URL=mongodb://localhost:27017/Bharat-Trails

SECRET=your_secret_key
```

Run MongoDB

```bash
mongod
```

Start the application

```bash
node app.js
```

or

```bash
nodemon app.js
```

Open

```
http://localhost:3000
```

---

# 🌟 Future Improvements

- 📍 Google Maps Integration
- ☁️ Cloudinary Image Upload
- ❤️ Wishlist / Favorites
- 🔍 Advanced Search & Filters
- 🤖 AI Trip Recommendation
- 🌦️ Weather API Integration
- 💳 Booking & Payments
- 📱 Progressive Web App (PWA)
- 🌍 Multi-language Support
- 👤 User Profiles

---

# 📚 Learning Outcomes

This project helped me gain practical experience with:

- RESTful Routing
- Express.js
- MongoDB & Mongoose
- MVC Architecture
- Authentication using Passport.js
- Session Management
- Flash Messages
- CRUD Operations
- Error Handling
- Server-side Validation
- Git & GitHub Workflow

---

# 🤝 Contributing

Contributions, suggestions, and improvements are welcome.

1. Fork the repository
2. Create a new feature branch
3. Commit your changes
4. Push to GitHub
5. Open a Pull Request

---

# 📄 License

This project is licensed under the MIT License.

---

# 👨‍💻 Author

**Himanshu Raj**

B.Tech Computer Science Engineering

Passionate about Full Stack Development, AI-powered applications, and building scalable web solutions.

GitHub: https://github.com/Himanshuvardhanraj

LinkedIn: https://linkedin.com/in/himanshuraj49

---

# ⭐ Support

If you like this project, consider giving it a ⭐ on GitHub.

It motivates me to build more open-source projects.
