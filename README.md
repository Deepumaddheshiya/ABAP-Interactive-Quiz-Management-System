# 🎓 ABAP Interactive Quiz Management System & Simulator

> Enterprise-Grade SAP ABAP Quiz Management Platform with SAP GUI & SAP Fiori Web Simulator

![SAP ABAP](https://img.shields.io/badge/SAP-ABAP-blue)
![Module Pool](https://img.shields.io/badge/Module%20Pool-Dynpro-green)
![ALV Reports](https://img.shields.io/badge/ALV-Reports-orange)
![License](https://img.shields.io/badge/License-MIT-yellow)

---

## 📖 Overview

The **ABAP Interactive Quiz Management System & Simulator** is a complete enterprise-level assessment platform developed using **SAP ABAP** concepts and a modern **Web-Based SAP GUI Simulator**.

The project allows organizations, educational institutions, and training centers to conduct online assessments, manage quizzes, evaluate candidates automatically, and analyze performance through detailed reports.

The platform combines:

* SAP ABAP Backend Development
* Module Pool Programming
* Function Modules
* ALV Reporting
* DDIC Database Design
* SAP GUI Simulation
* SAP Fiori Modern Experience

This project demonstrates real-world SAP development practices and enterprise application architecture.

---

# ✨ Key Features

## 📝 Quiz Management
<img width="725" height="825" alt="image" src="https://github.com/user-attachments/assets/de96b979-2999-49ac-a493-88462ca6e459" />


* Create and manage quizzes
* Configure passing criteria
* Set quiz duration
* Enable/Disable negative marking
* Categorize quizzes by subject

## 👨‍🎓 Candidate Assessment

* Candidate Login System
* <img width="972" height="971" alt="image" src="https://github.com/user-attachments/assets/47fb99ec-b2e3-426e-86c0-3268daae80e5" />

* Interactive Quiz Interface
* <img width="971" height="972" alt="image" src="https://github.com/user-attachments/assets/2d94831e-38b7-464a-a06d-00e231209ded" />
<img width="971" height="971" alt="image" src="https://github.com/user-attachments/assets/babf4591-db3e-4d7a-a536-d11fa61a42ee" />


* Question Navigation
* Easy:
* <img width="972" height="971" alt="image" src="https://github.com/user-attachments/assets/2162eec3-ba7c-4d5c-8ae6-460638d1c03d" />
Medium:
<img width="946" height="971" alt="image" src="https://github.com/user-attachments/assets/5600422e-e17a-47be-99f3-0d6717632fe7" />
Hard:

* Timer-Based Examination
* Auto Submission
* Instant Result Generation

## 🔀 Anti-Cheating System

* Fisher-Yates Question Randomization
* Unique Question Order Per Candidate
* Dynamic Question Shuffling
* Response Logging

## ⚡ Evaluation Engine

Function Module:

```abap
ZQUIZ_EVALUATE
```

Features:

* Automatic Evaluation
* Dynamic Score Calculation
* Negative Marking Support
* Pass/Fail Determination
* Performance Calculation

* Final Result
* <img width="946" height="862" alt="image" src="https://github.com/user-attachments/assets/af56cede-ca53-4ed2-9dec-5dc554592631" />


## 📊 Analytics Dashboard

Admin Dashboard provides:

* Total Attempts
* Pass Percentage
* Average Scores
* Top Performers
* Drill-Down Analysis
* Candidate Statistics

## 📈 ALV Reporting

Interactive SAP ALV Reports:

* Candidate Results
* Quiz Performance
* Detailed Attempt Reports
* Response Analysis

---

# 🏗️ System Architecture

```text
┌──────────────────────────────┐
│      Web Frontend Layer      │
│ SAP GUI / SAP Fiori Simulator│
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│     Application Layer        │
│ Module Pool Programs         │
│ Function Modules             │
│ Business Logic               │
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│      Database Layer          │
│ SAP DDIC Transparent Tables  │
└──────────────────────────────┘
```

---

# 🛠️ Technology Stack

## SAP Backend

* SAP ABAP
* Data Dictionary (SE11)
* Module Pool Programming
* Dynpro Screens
* Function Modules (SE37)
* ALV Reports
* Open SQL
* Internal Tables
* Work Areas

## Frontend

* HTML5
* CSS3
* JavaScript
* Responsive Design

## Development Tools

* SAP GUI
* SAP NetWeaver AS ABAP
* VS Code
* Git
* GitHub

---

# 📂 Project Structure

```text
QuizManagementSystem
│
├── abap
│   │
│   ├── ddic
│   │   ├── zquiz_users.sql
│   │   ├── zquiz_header.sql
│   │   ├── zquiz_questions.sql
│   │   ├── zquiz_options.sql
│   │   ├── zquiz_attempts.sql
│   │   └── zquiz_responses.sql
│   │
│   └── programs
│       ├── zquiz_evaluation_fm.abap
│       ├── zquiz_attempt_mp.abap
│       └── zquiz_admin_report.abap
│
├── index.html
├── style.css
├── app.js
├── abap_source.js
├── package.json
└── README.md
```

---

# 🗄️ Database Design

## ZQUIZ_USERS

Stores:

* User Information
* Login Credentials
* User Roles

## ZQUIZ_HEADER

Stores:

* Quiz Name
* Passing Marks
* Duration
* Negative Marking Configuration

## ZQUIZ_QUESTIONS

Stores:

* Question Bank
* Question Text
* Difficulty Level

## ZQUIZ_OPTIONS

Stores:

* Multiple Choice Options
* Correct Answer

## ZQUIZ_ATTEMPTS

Stores:

* Attempt History
* Scores
* Result Status

## ZQUIZ_RESPONSES

Stores:

* Candidate Answers
* Question-Level Logs

---

# ⚙️ Core Components

## 1️⃣ Evaluation Engine

### Function Module

```abap
ZQUIZ_EVALUATE
```

Responsibilities:

* Validate Responses
* Calculate Scores
* Apply Negative Marking
* Generate Final Result

---

## 2️⃣ Candidate Examination Module

### Module Pool Program

```abap
ZQUIZ_ATTEMPT_MP
```

Screens:

| Screen | Purpose        |
| ------ | -------------- |
| 100    | Login          |
| 200    | Quiz Selection |
| 300    | Quiz Attempt   |
| 400    | Result Screen  |

---

## 3️⃣ Analytics Dashboard

### Report Program

```abap
ZQUIZ_ADMIN_REPORT
```

Provides:

* ALV Reports
* Quiz Statistics
* Performance Metrics
* Candidate Analysis

---

# 🌐 Web Simulator

The project includes a browser-based SAP simulator.

## SAP GUI Classic

✔ Traditional SAP Interface

✔ Desktop Experience

✔ SAP Transaction Flow

## SAP Fiori Modern

✔ Responsive Layout

✔ Mobile Friendly

✔ Dark Mode Support

✔ Modern Dashboard Design

---

# 🚀 Installation

## Clone Repository

```bash
git clone https://github.com/your-username/QuizManagementSystem.git
```

## Install Dependencies

```bash
npm install
```

## Run Application

```bash
npm start
```

## Open Browser

```text
http://localhost:3000
```

---

# 📥 SAP Deployment Guide

### Step 1

Create DDIC Objects using SE11.

### Step 2

Create Function Module:

```abap
ZQUIZ_EVALUATE
```

### Step 3

Create Module Pool:

```abap
ZQUIZ_ATTEMPT_MP
```

Create Screens:

* 100
* 200
* 300
* 400

### Step 4

Create Report:

```abap
ZQUIZ_ADMIN_REPORT
```

Activate all objects.

---

# 🔮 Future Enhancements

* 🤖 AI Question Generator
* 🏆 Automatic Certificate Generation
* 🎮 Gamification System
* 📱 Mobile App
* 📧 Email Notifications
* 🌍 Multi-Language Support
* 🔒 Secure Exam Mode
* ☁️ SAP BTP Integration
* 🚀 SAP Fiori Launchpad Deployment

---

# 📚 Learning Outcomes

This project demonstrates practical knowledge of:

* SAP ABAP Development
* Module Pool Programming
* Function Modules
* DDIC Table Design
* Open SQL
* ALV Reporting
* SAP GUI Development
* Enterprise Application Architecture

---

# 👨‍💻 Author

### Deepu Maddheshiya

B.Tech Computer Engineering

Skills:

* SAP ABAP
* Java
* Python
* JavaScript
* SQL
* Full Stack Development

GitHub: https://github.com/Deepumaddheshiya)

LinkedIn: https://www.linkedin.com/in/deepu-maddheshiya-889084308/)

---

# ⭐ Show Your Support

If you found this project useful:

⭐ Star this repository

🍴 Fork this repository

🛠 Contribute to improvements

📢 Share with the SAP community

---

## Thank You ❤️

Built with SAP ABAP, passion, and continuous learning.
