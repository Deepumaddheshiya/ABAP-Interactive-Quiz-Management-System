# 🎯 ABAP Interactive Quiz Management System

A complete **SAP ABAP-based Quiz Management System** with a modern web simulator that replicates SAP GUI and SAP Fiori experiences. The project demonstrates enterprise-level SAP ABAP concepts including DDIC Tables, Module Pool Programming, Function Modules, ALV Reports, Dynamic Scoring Engine, and Quiz Analytics.

---

## 🚀 Project Overview

The ABAP Interactive Quiz Management System is designed to automate quiz creation, candidate assessment, result evaluation, and performance analytics.

The system supports:

* Quiz Creation & Management
* Candidate Assessment
* Automatic Evaluation
* Negative Marking
* Question Randomization
* Performance Analytics
* SAP GUI Simulation
* SAP Fiori Experience

---

## ✨ Features

### 👨‍💼 Admin Features

* Create and manage quizzes
* Configure passing criteria
* Enable/Disable negative marking
* View candidate attempts
* Generate reports
* Monitor performance analytics

### 👨‍🎓 Candidate Features

* Login and attempt quizzes
* Randomized question sequence
* Timer-based assessments
* Instant result generation
* Detailed score analysis

### 📊 Analytics Features

* ALV Dashboard Reports
* Pass/Fail Statistics
* Average Score Tracking
* Candidate Performance Analysis
* Drill-Down Reporting

---

## 🛠️ Technologies Used

### SAP ABAP

* Data Dictionary (SE11)
* Module Pool Programming
* Function Modules
* Internal Tables
* Open SQL
* ALV Reports
* Dynpro Screens

### Frontend

* HTML5
* CSS3
* JavaScript
* Responsive UI

---

## 📂 Project Structure

```text
QuizManagementSystem/
│
├── abap/
│   ├── ddic/
│   │   ├── zquiz_users.sql
│   │   ├── zquiz_header.sql
│   │   ├── zquiz_questions.sql
│   │   ├── zquiz_options.sql
│   │   ├── zquiz_attempts.sql
│   │   └── zquiz_responses.sql
│   │
│   └── programs/
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

## 🗄️ Database Tables

| Table           | Purpose             |
| --------------- | ------------------- |
| ZQUIZ_USERS     | User Management     |
| ZQUIZ_HEADER    | Quiz Configuration  |
| ZQUIZ_QUESTIONS | Question Repository |
| ZQUIZ_OPTIONS   | MCQ Options         |
| ZQUIZ_ATTEMPTS  | Candidate Attempts  |
| ZQUIZ_RESPONSES | Answer Logs         |

---

## ⚙️ Core Modules

### ZQUIZ_EVALUATE

Function Module responsible for:

* Score Calculation
* Answer Validation
* Negative Marking
* Pass/Fail Determination

### ZQUIZ_ATTEMPT_MP

Module Pool Program for:

* Quiz Attempt Screens
* Question Navigation
* Timer Handling
* Question Randomization

### ZQUIZ_ADMIN_REPORT

ALV Report providing:

* Attempt Statistics
* Candidate Analytics
* Pass Percentage
* Detailed Reports

---

## 🔀 Anti-Cheating Mechanism

Implemented using:

* Fisher-Yates Shuffle Algorithm
* Dynamic Question Randomization
* Candidate-Specific Question Order

This ensures fairness during assessments.

---

## 🌐 Web Simulator

Two interface styles are available:

### SAP GUI Classic

* Traditional SAP Look
* Desktop Interface
* SAP Navigation Experience

### SAP Fiori Modern

* Responsive Design
* Dark/Light Theme
* Modern Dashboard UI

---

## 🚀 Running the Project

### Install Dependencies

```bash
npm install
```

### Start Development Server

```bash
npm start
```

### Open Browser

```text
http://localhost:3000
```

---

## 📥 SAP Deployment Steps

### Step 1

Create all DDIC objects using SE11.

### Step 2

Create Function Module:

```text
ZQUIZ_EVALUATE
```

### Step 3

Create Module Pool:

```text
ZQUIZ_ATTEMPT_MP
```

Create Screens:

* 100 Login Screen
* 200 Quiz Selection
* 300 Quiz Attempt
* 400 Result Screen

### Step 4

Create ALV Report:

```text
ZQUIZ_ADMIN_REPORT
```

Activate all objects.

---

## 🔮 Future Enhancements

* Role-Based Access Control
* AI Question Generator
* Automatic Certificate Generation
* Leaderboard System
* Coding Assessment Module
* PDF & Excel Export
* SAP BTP Integration
* SAP Fiori Launchpad Deployment

---

## 📚 Learning Outcomes

This project demonstrates:

* SAP ABAP Development
* Module Pool Programming
* Function Modules
* ALV Reporting
* DDIC Table Design
* Open SQL Operations
* Enterprise Application Design

---

## 👨‍💻 Author

**Deepu Maddheshiya**

B.Tech Computer Engineering

Skills:

* SAP ABAP
* Java
* Python
* JavaScript
* SQL
* Full Stack Development

---

## ⭐ Support

If you found this project useful, please give it a ⭐ on GitHub and share your feedback.

Contributions and suggestions are always welcome.
