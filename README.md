# ABAP Interactive Quiz Management System & Simulator

An interactive web-based simulator and enterprise-grade SAP ABAP implementation of a **Quiz Management System**. This repository contains both the frontend simulator (to experience SAP GUI / Fiori transaction flows right in the browser) and the backend ABAP code (DDIC tables, Module Pool screens, Function Modules, and ALV reports).

---

## 🚀 Key Features

* **Web-Based SAP GUI Simulator**: Experience SAP transactions inside the browser with two distinct visual styles:
  * **SAP GUI Classic**: Retro-styled SAP desktop interface.
  * **SAP Fiori Modern**: Clean, light/dark responsive dashboard look.
* **Complete Database Schema (SE11)**: Transparent database tables for Users, Quiz Headers, Question Pools, Multiple-choice Options, Attempts, and Response Logs.
* **Scoring Engine with Penalty Penalties (`ZQUIZ_EVALUATE`)**:
  * Evaluates candidate submissions dynamically using a dedicated Function Module.
  * Subtracts penalties for wrong answers (if configured) while keeping the minimum cumulative score at 0.
* **Anti-Cheating Randomizer (`ZQUIZ_ATTEMPT_MP`)**: Shuffles questions for each candidate using the Fisher-Yates array swap algorithm and standard SAP randomizer routines.
* **ALV Dashboard Reports (`ZQUIZ_ADMIN_REPORT`)**:
  * Real-time metrics grid for admins showing attempts, average scores, and pass rates.
  * Interactive double-click drill-downs to view responses in a pop-up window.

---

## 📂 Project Repository Structure

The project layout is divided into the SAP Backend codebase and the Web-based Frontend Simulator:

### 💼 SAP ABAP Backend (`/abap`)
* **[abap/ddic/](file:///c:/Users/Deepu/OneDrive/Desktop/vegitables&fruits/QuizManagementSystem/abap/ddic)**: Custom SE11 SQL schemas for DDIC tables:
  * [zquiz_users.sql](file:///c:/Users/Deepu/OneDrive/Desktop/vegitables&fruits/QuizManagementSystem/abap/ddic/zquiz_users.sql): Credentials & user permissions.
  * [zquiz_header.sql](file:///c:/Users/Deepu/OneDrive/Desktop/vegitables&fruits/QuizManagementSystem/abap/ddic/zquiz_header.sql): Quiz metadata & configurations (passing cutoff, timer, penalty flags).
  * [zquiz_questions.sql](file:///c:/Users/Deepu/OneDrive/Desktop/vegitables&fruits/QuizManagementSystem/abap/ddic/zquiz_questions.sql): Question pool database.
  * [zquiz_options.sql](file:///c:/Users/Deepu/OneDrive/Desktop/vegitables&fruits/QuizManagementSystem/abap/ddic/zquiz_options.sql): Answer choices for MCQs.
  * [zquiz_attempts.sql](file:///c:/Users/Deepu/OneDrive/Desktop/vegitables&fruits/QuizManagementSystem/abap/ddic/zquiz_attempts.sql): Candidate attempt grades.
  * [zquiz_responses.sql](file:///c:/Users/Deepu/OneDrive/Desktop/vegitables&fruits/QuizManagementSystem/abap/ddic/zquiz_responses.sql): Itemized response-level logs.
* **[abap/programs/](file:///c:/Users/Deepu/OneDrive/Desktop/vegitables&fruits/QuizManagementSystem/abap/programs)**: Core application logic:
  * [zquiz_evaluation_fm.abap](file:///c:/Users/Deepu/OneDrive/Desktop/vegitables&fruits/QuizManagementSystem/abap/programs/zquiz_evaluation_fm.abap): SE37 grading Function Module.
  * [zquiz_attempt_mp.abap](file:///c:/Users/Deepu/OneDrive/Desktop/vegitables&fruits/QuizManagementSystem/abap/programs/zquiz_attempt_mp.abap): Dynpro exam screen with question shuffling routines.
  * [zquiz_admin_report.abap](file:///c:/Users/Deepu/OneDrive/Desktop/vegitables&fruits/QuizManagementSystem/abap/programs/zquiz_admin_report.abap): SE38 Admin dashboard ALV report.

### 🌐 Web Frontend Simulator
* [index.html](file:///c:/Users/Deepu/OneDrive/Desktop/vegitables&fruits/QuizManagementSystem/index.html): Main responsive HTML workspace layout.
* [style.css](file:///c:/Users/Deepu/OneDrive/Desktop/vegitables&fruits/QuizManagementSystem/style.css): Custom styling for SAP GUI Classic & SAP Fiori themes.
* [app.js](file:///c:/Users/Deepu/OneDrive/Desktop/vegitables&fruits/QuizManagementSystem/app.js): Application routing, transaction state machine, and GUI simulator controllers.
* [abap_source.js](file:///c:/Users/Deepu/OneDrive/Desktop/vegitables&fruits/QuizManagementSystem/abap_source.js): Integrated source code viewer repository.
* [package.json](file:///c:/Users/Deepu/OneDrive/Desktop/vegitables&fruits/QuizManagementSystem/package.json): Development scripts and local web server config.

---

## 💻 Running the Web Simulator Locally

To run the interactive simulator in your browser, perform the following commands:

1. Install dependencies and start the local development server:
   ```bash
   npm start
   ```
2. The server will start on port `3000` and automatically open your default browser:
   [http://localhost:3000](http://localhost:3000)

---

## 🛠️ SAP Deployment Guide

To import this system into your SAP Application Server:

1. **Database Schema (SE11)**: Create domains, data elements, and transparent tables matching the schema files under `abap/ddic/`.
2. **Evaluation Engine (SE37)**: Create the Function Module `ZQUIZ_EVALUATE` and load the source code from `abap/programs/zquiz_evaluation_fm.abap`.
3. **Candidate Examination Engine (SE80 / SE38)**: Create a Module Pool program `ZQUIZ_ATTEMPT_MP` and map Screens 100, 200, 300, and 400. Insert the flow logic and ABAP source code from `abap/programs/zquiz_attempt_mp.abap`.
4. **Analytics ALV Report (SE38)**: Create a standard report program `ZQUIZ_ADMIN_REPORT` and insert the source code from `abap/programs/zquiz_admin_report.abap`. Create a transaction code `ZQUIZ_ADMIN` pointing to this report.
