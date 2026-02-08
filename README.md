# 🏢 Residential Apartment Rental Portal

A **full-stack web application** that allows users to browse apartments, request bookings, and track booking status, while admins manage towers, units, amenities, and approvals.  
The project is fully **containerized using Docker** with Angular, Flask, and PostgreSQL.

---

## 🚀 Tech Stack

### Frontend
- **Angular**
- HTML, CSS
- JWT-based authentication
- Role-based routing (Admin / User)

### Backend
- **Flask (Python)**
- Flask-JWT-Extended
- Flask-SQLAlchemy
- RESTful APIs

### Database
- **PostgreSQL**

### DevOps / Deployment
- **Docker**
- **Docker Compose**
- Nginx (serving Angular production build)

---

## 📁 Project Structure

rental-apartment-portal \
│  
├── frontend/ \
│ ├── Dockerfile \
│ ├── nginx.conf \
│ └── src/ \
│\
├── backend/ \
│ ├── Dockerfile \
│ ├── app/ \
│ ├── run.py  \
│ └── requirements.txt \
│\
├── docker-compose.yml \
| \
└── README.md 




---

## 🔐 Features

### 👤 User
- Register & Login
- Browse apartments
- Request bookings
- Choose custom lease period
- View booking status

### 🛠 Admin
- Admin login
- Manage towers and units
- Approve / reject bookings
- Role-based access control

---

## 🧑‍💻 Authentication & Authorization

- JWT-based authentication
- Roles:
  - `ADMIN`
  - `USER`
- Angular route guards
- Backend JWT validation

---

## 🐳 Docker Setup

### Services
- `frontend` → Angular + Nginx
- `backend` → Flask API
- `db` → PostgreSQL

All services run on the same Docker network.

---

## ▶️ How to Run the Project

### 1️⃣ Clone the repository
```bash
git clone https://github.com/Hosamane/rental-apartment-portal.git
cd rental-apartment-portal

```

### 2️⃣ Build and start containers
```bash 
docker-compose up --build
```



## 🌐 Application URLs
| Service     | URL                                            |
| ----------- | ---------------------------------------------- |
| Frontend    | [http://localhost](http://localhost)           |
| Backend API | [http://localhost:5000](http://localhost:5000) |
| PostgreSQL  | localhost:5432                                 |






## 🗄 Database Access 

|Role	 |Email           	|Password |
|------|------------------|---------|
|Admin |admin@admin.com   |admin123 |
|User	 |user@example.com  |user123  |


## 📦 Environment Variables
``` bash 
DATABASE_URL=postgresql://postgres:postgres@db:5432/rental_db
JWT_SECRET_KEY=your-secret-key
```
## 🧾 API Overview

|Method|	Endpoint	               |Description| 
|------|---------------------------|-----------|
|POST	 |/api/auth/register	       |User registration |
|POST	 |/api/auth/login	           |Login| 
|GET	 |/api/user/units	           |View units | 
|POST	 |/api/user/bookings	       |Create booking  |
|GET	 |/api/admin/bookings	       |View all bookings  
|PUT	 |/api/admin/bookings/{id}   |Approve / Reject
