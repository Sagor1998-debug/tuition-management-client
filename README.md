eTuitionBd - Online Tuition Marketplace


Project Name
eTuitionBd

Purpose
eTuitionBd is a full-stack online tuition platform that connects students with qualified tutors across Bangladesh. It allows students to post tuition requests, tutors to apply for jobs, and admins to moderate content. The platform ensures safe payments through Stripe, role-based access, and a smooth hiring process with payment required for tutor approval.
Features

Role-Based Dashboards (Student, Tutor, Admin)
Post Tuition Requests with pending status for admin approval
Admin Moderation – Approve/Reject tuition posts before they become visible
Tutor Application System – Tutors apply with expected salary
Student Application Management – View applications, Accept & Pay or Reject
Stripe Payment Integration – Student pays tutor's expected salary to approve
Dynamic Statistics on all dashboards (real data from database)
Responsive Design with DaisyUI/Tailwind CSS
Authentication – Login/Register with JWT
Tuition Listing with Filters (subject, location, salary range)
Tutor Profiles with details and hire button (student only)
Payment History for students and tutors

Live URL:
Currently running locally at https://luminous-frangollo-b6b2d3.netlify.app/

Packages Used
Frontend (React + Vite)

react, react-dom
react-router-dom – Routing
axios – API calls
react-hot-toast – Notifications
daisyui + tailwindcss – UI & styling
@headlessui/react – Modals (optional)
stripe / @stripe/stripe-js – Payment (if client-side)

Backend (Node.js + Express)

express – Server
mongoose – MongoDB ODM
bcryptjs – Password hashing
jsonwebtoken – Auth tokens
stripe – Payment processing
cors – Cross-origin
dotenv – Environment variables
express-async-errors (optional)

Database

MongoDB (via MongoDB Atlas or local)

Development Tools

nodemon – Auto-restart server
concurrently – Run frontend & backend together

Tech Stack: MERN (MongoDB, Express, React, Node.js) + Stripe + Tailwind/DaisyUI