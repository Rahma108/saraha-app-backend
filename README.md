💌 Saraha App


📌 Overview

Saraha App is a secure anonymous messaging platform that allows users to send hidden messages to others.
The receiver can view the message and reply to it only if the sender has an account.

The main focus of this application is:

Anonymous messaging

Secure authentication

Data protection using hashing & encryption

Clean backend architecture 

👤 User Model

Each user has the following attributes:

FirstName

LastName

Email

Password

Gender (Female / Male)

Confirm Email

Change Credential Time

Provider (System / Google Sign-Up)

Cover Pictures (Array)

Address🔐 Security (Non-Functional Requirements)

Security is a core feature of this application.

✔ Implemented Security Measures:

Password Hashing

Data Encryption


🏗️ System Architecture
1️⃣ SDLC

The project follows structured development phases:

Planning

Design

Implementation

Testing

Deployment  


2️⃣ Folder Structure
Saraha-App/
│
├── src/
│   ├── config/
│   │   └── db.connection.js
│   │
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── signup.js
│   │   │   ├── login.js
│   │   │   └── token.js
│   │   │
│   │   └── profile/
│   │       └── profile.controller.js
│   │
│   ├── utils/
│   │   ├── hash.js
│   │   └── encryption.js
│   │
│   └── app.js
│
└── package.json

3️⃣ Database Connection

Secure database connection configuration

Environment variables for credentials

Organized connection layer

4️⃣ Database Repository

Repository pattern used

Separation between business logic and database logic

🔑 Authentication System
✔ Signup

Email confirmation required

Password hashing

Provider support (System / Google)

✔ Login

Email & Password validation

Token generation

✔ Token

Secure JWT authentication

Used to protect routes

👤 Profile Module

View profile

Update user data

Manage cover pictures

Track credential change time  


🔒 Hashing & Encryption
Hashing

Used for password protection

One-way encryption

Encryption

Used for sensitive data storage

Secure message handling 


🚀 Current Status

✔ Signup
✔ Login
✔ Hashing
✔ Encryption
✔ Profile
✔ Token

Project still under development. 


📧 OTP System (Mailtrap)

OTP (One-Time Password) is used for secure email verification and password resets.

🔹 Features:

Generate a random OTP for user verification

Send OTP via email using Mailtrap (SMTP)

Validate OTP within a limited time

Secure handling and storage

🔹 User Model for OTP

Each OTP record contains:

userId – Reference to the user

otp – Hashed OTP code

expiresAt – Expiration time

isUsed – Boolean flag for one-time use 

Mailtrap Configuration
MAIL_HOST=sandbox.smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USER=<your-mailtrap-username>
MAIL_PASS=<your-mailtrap-password>  


🔹 Sample OTP Workflow

User signs up or requests verification

Backend generates a secure OTP

OTP is hashed and saved in the database

OTP is sent via email using Mailtrap

User submits OTP for verification

Backend validates OTP and marks it as used 

🔹 Folder Structure (OTP)
modules/
└── otp/
    ├── otp.model.js       # OTP schema / database model
    ├── otp.controller.js  # Generate & validate OTP
    └── otp.service.js     # Email sending & hashing logic

🔹 Security Measures

OTP hashed before saving

One-time use enforced
postman Doc :-
https://documenter.getpostman.com/view/46710820/2sBXcDHMyH
hoppscotch.io Doc:
https://api-docs.hoppscotch.io/view/00192b5a-8f26-4ba6-a64c-6b4a35391175/CURRENT
 
 Link Deployment :- saraha-app-backend-production-65eb.up.railway.app

Expiration time to prevent reuse 

Token-based Authentication

Secure Credential Update Handling  
