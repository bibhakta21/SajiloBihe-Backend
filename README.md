# 🚀 SajiloBihe Event Venue Booking App - Backend 

## 📢 Introduction  
The **SajiloBihe Event Venue Booking App - Backend** is a **robust and scalable API** designed to manage all aspects of an **event venue booking platform**. It provides endpoints for:  
✅ **User authentication**  
✅ **Venue management**  
✅ **Bookings & reservations**  
✅ **Contact requests**  
✅ **Storytelling & customer reviews**  
🔹 Making it an all-in-one solution for event management.

---

## 🌟 Features  

### 🏛️ **User Management**  
- 🔑 **Registration & Login**: Secure **user signup** and **login** using **JWT authentication**.  
- 👤 **Profile Management**: Update user details and **change passwords** with built-in security checks.  
- 🔒 **Password Reset**: Automated **email notifications** for password reset requests using **Nodemailer**.  

### 🏢 **Venue Management**  
- ✅ **CRUD Operations**: Create, read, update, and delete **venues** with details such as **location, capacity, pricing, and descriptions**.  
- 📸 **Image Uploads**: Supports **multiple image uploads** using **Multer** for enhanced venue presentation.  

### 📅 **Booking System**  
- 📌 **Reservation Handling**: Users can **book available venues, view their bookings**, and cancel reservations if needed.  
- 🔄 **Status Management**: Bookings have statuses (**pending, approved, canceled**) with **clear workflows** for both users and administrators.  

### 📩 **Contact Requests**  
- 📝 **User Inquiries**: Allows users to **submit contact requests** with their message, ensuring a **streamlined communication** channel with the support team.  
- 🔔 **Admin Management**: **Administrators** can view and delete **contact requests** as needed.  

### 📖 **Event Stories**  
- ✍️ **Story Sharing**: Add and update **event stories** with image uploads to showcase **successful events and customer testimonials**.  

### 📊 **Dashboard Analytics**  
- 📈 **Insightful Metrics**: Provides key performance indicators like **total sales, orders, venues, and customer counts**.  
- 📊 **Data Visualization**: Aggregates data for **charts displaying venue booking distribution, weekly bookings, and status breakdowns** for effective decision-making.  

---

## 🧪 Testing  
- ✅ **Mocha & Chai**: The application uses **Mocha and Chai** for **comprehensive testing**.  
- ✅ Ensures that every critical functionality—from **user authentication to booking management**—is **thoroughly validated** through unit and integration tests.  

---

## 🛠️ Tech Stack  
- 🟢 **Node.js & Express** – For building a **fast, efficient, and scalable server-side application**.  
- 🗄️ **MongoDB & Mongoose** – NoSQL database solution for **flexible and scalable data storage**.  
- 🔐 **JWT (JSON Web Tokens)** – Secure **user authentication** and **role-based access control**.  
- 📦 **Multer** – Middleware for **handling multipart/form-data**, essential for **image uploads**.  
- 📧 **Nodemailer** – Used for **sending automated emails**, particularly for **password reset requests**.  

---

## 🔒 Security Methods  
- 🛡️ **JWT Authentication**: Secure **token-based authentication** to protect API endpoints.  
- 👮 **Role-Based Access Control**: Differentiates **access** between **regular users and administrators**, ensuring only authorized personnel can perform **sensitive actions**.  
- 🏰 **Helmet**: Adds **various HTTP headers** to secure the app against **well-known vulnerabilities**.  
- 🌍 **CORS**: Configured to **allow requests only from trusted origins**, mitigating **cross-origin risks**.  
- 🔑 **Password Hashing**: Uses **bcrypt** for **securely hashing passwords** before storing them in the database.  

---

## 📩 Contact  
For any questions, suggestions, or contributions, please feel free to reach out:  

📧 **Email**: [bibhaktalamsal8@gmail.com](mailto:bibhaktalamsal8@gmail.com)  
  
