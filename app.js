/* ==========================================================================
   SAP ABAP QUIZ MANAGEMENT SYSTEM - SIMULATOR ENGINE (app.js)
   Enterprise Edition: Randomization, Negative Marking & ALV Analytics
   ========================================================================== */

// ==========================================================================
// 1. IN-MEMORY DATABASE SCHEMA & MOCK DATA (Enterprise Settings)
// ==========================================================================

const db = {
  users: [
    { user_id: "ADMIN", uname: "Administrator Account", pass_hash: "admin123", role: "ADMIN" },
    { user_id: "STUDENT1", uname: "Deepu Maddheshiya", pass_hash: "student123", role: "USER" },
    { user_id: "STUDENT2", uname: "Alex Carter", pass_hash: "student123", role: "USER" }
  ],
  
  quiz_header: [
    { quiz_id: "10000001", title: "ABAP Core Basics", description: "Test your knowledge of ABAP syntax, control structures, internal tables, and reports.", duration: 3, total_quest: 3, max_score: 30, pass_pct: 60.00, neg_mark: "X", created_by: "ADMIN", created_on: "2026-05-20" },
    { quiz_id: "10000002", title: "SAP Database Dictionary (DDIC)", description: "Covers transparent tables, views, search helps, domains, and data elements.", duration: 5, total_quest: 3, max_score: 30, pass_pct: 50.00, neg_mark: " ", created_by: "ADMIN", created_on: "2026-05-22" },
    { quiz_id: "10000003", title: "SAP UI Technologies & Screen Flow", description: "Evaluate your understanding of Module Pool programming, Dynpros, and SAP Fiori basics.", duration: 4, total_quest: 3, max_score: 30, pass_pct: 50.00, neg_mark: "X", created_by: "ADMIN", created_on: "2026-05-25" }
  ],

  quiz_questions: [
    // Quiz 1: ABAP Core Basics
    { quiz_id: "10000001", quest_id: "0001", quest_type: "MCQ", quest_text: "Which of the following ABAP statements is used to declare an internal table structure?", correct_ans: "A", points: 10, neg_points: 3, difficulty: "EASY" },
    { quiz_id: "10000001", quest_id: "0002", quest_type: "TF", quest_text: "In ABAP, statements must always terminate with a period (.) character.", correct_ans: "T", points: 10, neg_points: 3, difficulty: "EASY" },
    { quiz_id: "10000001", quest_id: "0003", quest_type: "DESC", quest_text: "Explain the difference between a WORK AREA and an INTERNAL TABLE.", correct_ans: "row,structure,multiple,array,records", points: 10, neg_points: 0, difficulty: "HARD" },

    // Quiz 2: SAP DDIC
    { quiz_id: "10000002", quest_id: "0001", quest_type: "MCQ", quest_text: "Which technical setting determines where the database table indexes are stored physically?", correct_ans: "C", points: 10, neg_points: 2, difficulty: "MEDIUM" },
    { quiz_id: "10000002", quest_id: "0002", quest_type: "TF", quest_text: "A domain defines the technical characteristics of a field, whereas a data element provides semantic information.", correct_ans: "T", points: 10, neg_points: 2, difficulty: "EASY" },
    { quiz_id: "10000002", quest_id: "0003", quest_type: "DESC", quest_text: "Explain what a transparent table is in the SAP system.", correct_ans: "database,physical,same,dictionary,one-to-one", points: 10, neg_points: 0, difficulty: "MEDIUM" },

    // Quiz 3: SAP UI Technologies
    { quiz_id: "10000003", quest_id: "0001", quest_type: "MCQ", quest_text: "Which event block is triggered before a screen is displayed to the user in a Module Pool?", correct_ans: "B", points: 10, neg_points: 4, difficulty: "MEDIUM" },
    { quiz_id: "10000003", quest_id: "0002", quest_type: "TF", quest_text: "The PROCESS AFTER INPUT (PAI) block can be bypassed by clicking standard icons without implementing any modules.", correct_ans: "F", points: 10, neg_points: 2, difficulty: "EASY" },
    { quiz_id: "10000003", quest_id: "0003", quest_type: "DESC", quest_text: "Describe the primary purpose of a PF-STATUS (GUI Status) in Dynpros.", correct_ans: "menu,toolbar,buttons,icons,menu bar,navigation", points: 10, neg_points: 0, difficulty: "HARD" }
  ],

  quiz_options: [
    // Quiz 1 Options
    { quiz_id: "10000001", quest_id: "0001", option_id: "A", option_text: "DATA: lt_table TYPE TABLE OF ty_structure." },
    { quiz_id: "10000001", quest_id: "0001", option_id: "B", option_text: "CREATE TABLE lt_table LIKE structure." },
    { quiz_id: "10000001", quest_id: "0001", option_id: "C", option_text: "DECLARE lt_table TYPE INTERNAL TABLE." },
    { quiz_id: "10000001", quest_id: "0001", option_id: "D", option_text: "DATA lt_table TYPE STRUCTURE OF ty_structure." },

    // Quiz 2 Options
    { quiz_id: "10000002", quest_id: "0001", option_id: "A", option_text: "Size Category" },
    { quiz_id: "10000002", quest_id: "0001", option_id: "B", option_text: "Delivery Class" },
    { quiz_id: "10000002", quest_id: "0001", option_id: "C", option_text: "Data Class" },
    { quiz_id: "10000002", quest_id: "0001", option_id: "D", option_text: "Buffering Allowed" },

    // Quiz 3 Options
    { quiz_id: "10000003", quest_id: "0001", option_id: "A", option_text: "PROCESS AFTER INPUT (PAI)" },
    { quiz_id: "10000003", quest_id: "0001", option_id: "B", option_text: "PROCESS BEFORE OUTPUT (PBO)" },
    { quiz_id: "10000003", quest_id: "0001", option_id: "C", option_text: "PROCESS ON VALUE-REQUEST (POV)" },
    { quiz_id: "10000003", quest_id: "0001", option_id: "D", option_text: "INITIALIZATION" }
  ],

  quiz_attempts: [
    { attempt_id: "800001254", quiz_id: "10000001", user_id: "STUDENT2", att_date: "2026-05-28", att_time: "10:14:22", score_obt: 20, percentage: 66.67, status: "PASS" },
    { attempt_id: "800001255", quiz_id: "10000002", user_id: "STUDENT2", att_date: "2026-05-28", att_time: "10:22:45", score_obt: 10, percentage: 33.33, status: "FAIL" },
    { attempt_id: "800001256", quiz_id: "10000003", user_id: "STUDENT1", att_date: "2026-05-29", att_time: "14:05:00", score_obt: 25, percentage: 83.33, status: "PASS" }
  ],

  quiz_responses: [
    { attempt_id: "800001254", quiz_id: "10000001", quest_id: "0001", resp_text: "A", is_correct: "X", points_earn: 10 },
    { attempt_id: "800001254", quiz_id: "10000001", quest_id: "0002", resp_text: "T", is_correct: "X", points_earn: 10 },
    { attempt_id: "800001254", quiz_id: "10000001", quest_id: "0003", resp_text: "A work area is just a single variable, table has nothing.", is_correct: " ", points_earn: 0 },
    
    { attempt_id: "800001255", quiz_id: "10000002", quest_id: "0001", resp_text: "A", is_correct: "W", points_earn: -2 },
    { attempt_id: "800001255", quiz_id: "10000002", quest_id: "0002", resp_text: "T", is_correct: "X", points_earn: 10 },
    { attempt_id: "800001255", quiz_id: "10000002", quest_id: "0003", resp_text: "A table that does not have indexes.", is_correct: " ", points_earn: 0 },

    { attempt_id: "800001256", quiz_id: "10000003", quest_id: "0001", resp_text: "B", is_correct: "X", points_earn: 10 },
    { attempt_id: "800001256", quiz_id: "10000003", quest_id: "0002", resp_text: "T", is_correct: "W", points_earn: -2 },
    { attempt_id: "800001256", quiz_id: "10000003", quest_id: "0003", resp_text: "It designs menus, toolbars, navigation buttons and icons in Dynpro screens.", is_correct: "X", points_earn: 17 } // Handled custom score
  ]
};

// ==========================================================================
// 2. SIMULATOR SESSION STATE
// ==========================================================================

const session = {
  currentUser: null,
  activeTx: "LOGON", // LOGON, EASY_ACCESS, ZQUIZ, ZQUIZ_PLAYER, ZQUIZ_RESULT, ALV_REPORT, ADMIN_CREATE
  currentQuiz: null,
  questions: [],
  userAnswers: {}, 
  timer: null,
  timeRemaining: 0,
  currentQIndex: 0 
};

let activeCodeFile = "zquiz_header.sql";

// ==========================================================================
// 3. SAP ROUTER & SCREEN RENDERING SYSTEM
// ==========================================================================

window.addEventListener("DOMContentLoaded", () => {
  renderScreen();
  selectCodeFile("zquiz_header.sql");
  showHelp(); 
});

function renderScreen() {
  const container = document.getElementById("sap-screen");
  const activeTxDisplay = document.getElementById("sap-active-tx");

  if (session.timer) {
    clearInterval(session.timer);
    session.timer = null;
  }

  activeTxDisplay.textContent = `TX: ${session.activeTx}`;

  switch (session.activeTx) {
    case "LOGON":
      container.innerHTML = getLogonScreenHTML();
      updateStatusBar("Enter credentials to connect to System NXP.", "info");
      break;

    case "EASY_ACCESS":
      container.innerHTML = getEasyAccessHTML();
      updateStatusBar(`SAP Easy Access Menu - Welcome back, ${session.currentUser.uname}.`, "success");
      break;

    case "ZQUIZ":
      container.innerHTML = getQuizCatalogHTML();
      updateStatusBar("Select a Quiz from the Catalog and click Start.", "info");
      break;

    case "ZQUIZ_PLAYER":
      container.innerHTML = getQuizPlayerHTML();
      startQuizTimer();
      updateStatusBar(`Attempting Quiz (Randomized): ${session.currentQuiz.title}`, "info");
      break;

    case "ZQUIZ_RESULT":
      container.innerHTML = getQuizResultHTML();
      updateStatusBar("Quiz completed. Score evaluated successfully.", "success");
      break;

    case "ALV_REPORT":
      container.innerHTML = getAlvReportHTML();
      updateStatusBar("ALV List Viewer: Double click Attempt ID row to audit answer responses.", "success");
      break;

    case "ADMIN_CREATE":
      container.innerHTML = getAdminCreateHTML();
      updateStatusBar("ZQUIZ_CREATE: Add a new quiz and questions to catalog.", "info");
      break;
      
    default:
      container.innerHTML = `<div class="sap-error-block">
        <i class="fa-solid fa-triangle-exclamation"></i>
        <h3>Transaction Error</h3>
        <p>Transaction ${session.activeTx} is currently locked or does not exist.</p>
      </div>`;
      updateStatusBar(`Transaction ${session.activeTx} not found. Try /nSE11 or /nZQUIZ.`, "error");
  }
}

function updateStatusBar(text, type = "info") {
  const statusText = document.getElementById("sap-status-text");
  const statusIcon = document.getElementById("status-icon");
  statusText.textContent = text;
  
  statusIcon.className = "fa-solid";
  if (type === "error") {
    statusIcon.classList.add("fa-circle-xmark", "error");
  } else if (type === "success") {
    statusIcon.classList.add("fa-circle-check", "success");
  } else {
    statusIcon.classList.add("fa-circle-info");
  }
}

// ==========================================================================
// 4. SCREEN HTML GENERATORS
// ==========================================================================

function getLogonScreenHTML() {
  return `
    <div class="sap-logon-box">
      <div class="sap-logon-header">
        <span>SAP GUI Logon</span>
        <span>NXP</span>
      </div>
      <div class="sap-logon-body">
        <div class="sap-input-group">
          <label>Client</label>
          <input type="text" id="logon-client" value="800" disabled>
        </div>
        <div class="sap-input-group">
          <label>User</label>
          <input type="text" id="logon-user" placeholder="ADMIN or STUDENT1" autofocus>
        </div>
        <div class="sap-input-group">
          <label>Password</label>
          <input type="password" id="logon-pass" placeholder="Password">
        </div>
        <div class="sap-input-group">
          <label>Language</label>
          <input type="text" value="EN" disabled style="width: 40px; text-align: center;">
        </div>
      </div>
      <div class="sap-logon-footer">
        <button class="sap-btn" onclick="submitLogon()">Logon</button>
      </div>
    </div>
  `;
}

function getEasyAccessHTML() {
  const isAdmin = session.currentUser.role === "ADMIN";
  return `
    <div class="sap-menu-container">
      <div class="sap-menu-title">
        <i class="fa-solid fa-folder-tree"></i> SAP Easy Access Menu
      </div>
      <ul class="sap-menu-list">
        <li class="sap-menu-item" onclick="navigateTx('ZQUIZ')">
          <i class="fa-solid fa-graduation-cap"></i>
          <div>
            <strong>/nZQUIZ - Candidate Portal</strong>
            <span>Take available quizzes, check scoring, review certificates.</span>
          </div>
        </li>
        
        ${isAdmin ? `
        <li class="sap-menu-item" onclick="navigateTx('ALV_REPORT')">
          <i class="fa-solid fa-chart-line"></i>
          <div>
            <strong>/nZQUIZ_REPORT - Admin ALV Performance Dashboard</strong>
            <span>Generate drill-down audits, calculate user statistics, evaluate answers.</span>
          </div>
        </li>
        <li class="sap-menu-item" onclick="navigateTx('ADMIN_CREATE')">
          <i class="fa-solid fa-plus-circle"></i>
          <div>
            <strong>/nZQUIZ_CREATE - Create Quiz</strong>
            <span>Add questions (MCQ, True/False, Descriptive) to the catalog database.</span>
          </div>
        </li>
        ` : `
        <li class="sap-menu-item" style="opacity: 0.5; cursor: not-allowed;">
          <i class="fa-solid fa-lock"></i>
          <div>
            <strong>/nZQUIZ_REPORT (Locked)</strong>
            <span>Analytics dashboard is reserved for ADMINISTRATOR profile only.</span>
          </div>
        </li>
        `}
      </ul>
    </div>
  `;
}

function getQuizCatalogHTML() {
  let cardsHTML = "";
  db.quiz_header.forEach(q => {
    const isSelected = session.currentQuiz && session.currentQuiz.quiz_id === q.quiz_id;
    cardsHTML += `
      <div class="quiz-card ${isSelected ? 'selected' : ''}" onclick="selectQuizCard('${q.quiz_id}')">
        <h4 style="display:flex; justify-content:space-between; align-items:center;">
          <span>${q.title}</span>
          ${q.neg_mark === 'X' ? '<span class="difficulty-badge hard" style="font-size:0.55rem; padding:0.1rem 0.3rem;"><i class="fa-solid fa-triangle-exclamation"></i> NEG MARK</span>' : ''}
        </h4>
        <p>${q.description}</p>
        <div class="quiz-meta-pills">
          <span class="quiz-pill"><i class="fa-regular fa-clock"></i> ${q.duration} min</span>
          <span class="quiz-pill"><i class="fa-regular fa-circle-question"></i> ${q.total_quest} Qs</span>
          <span class="quiz-pill"><i class="fa-solid fa-award"></i> ${q.max_score} Pts</span>
          <span class="quiz-pill"><i class="fa-solid fa-arrow-down-short-wide"></i> Pass: ${q.pass_pct}%</span>
        </div>
      </div>
    `;
  });

  return `
    <div class="sap-sel-block">
      <div class="sap-sel-title">Quiz Catalog Database</div>
      <div class="quiz-catalog-grid">
        ${cardsHTML}
      </div>
    </div>
    
    <div class="sap-navigation-toolbar" style="margin-top: 1rem; display: flex; justify-content: flex-end; gap: 0.8rem;">
      <button class="sap-btn" onclick="navigateTx('EASY_ACCESS')">Menu Screen</button>
      <button class="sap-btn" id="btn-start-quiz" onclick="startSelectedQuiz()" ${!session.currentQuiz ? 'disabled' : ''}>Start Attempt</button>
    </div>
  `;
}

function getQuizPlayerHTML() {
  const currentQuest = session.questions[session.currentQIndex];
  const qNum = session.currentQIndex + 1;
  const isLast = qNum === session.questions.length;
  const savedAns = session.userAnswers[currentQuest.quest_id] || "";

  // Render question inputs dynamically based on Type
  let renderInputsHTML = "";
  if (currentQuest.quest_type === "MCQ") {
    const options = db.quiz_options.filter(o => o.quiz_id === currentQuest.quiz_id && o.quest_id === currentQuest.quest_id);
    renderInputsHTML += `<div class="options-list">`;
    options.forEach(opt => {
      const isChecked = savedAns === opt.option_id;
      renderInputsHTML += `
        <label class="option-item" onclick="saveAnswerValue('${currentQuest.quest_id}', '${opt.option_id}')">
          <input type="radio" name="mcq-option" value="${opt.option_id}" ${isChecked ? 'checked' : ''}>
          <span class="option-label"><strong>${opt.option_id}.</strong> ${opt.option_text}</span>
        </label>
      `;
    });
    renderInputsHTML += `</div>`;
  } else if (currentQuest.quest_type === "TF") {
    const isTrue = savedAns === "T";
    const isFalse = savedAns === "F";
    renderInputsHTML += `
      <div class="options-list">
        <label class="option-item" onclick="saveAnswerValue('${currentQuest.quest_id}', 'T')">
          <input type="radio" name="tf-option" value="T" ${isTrue ? 'checked' : ''}>
          <span class="option-label"><i class="fa-solid fa-check" style="color: #22c55e;"></i> TRUE</span>
        </label>
        <label class="option-item" onclick="saveAnswerValue('${currentQuest.quest_id}', 'F')">
          <input type="radio" name="tf-option" value="F" ${isFalse ? 'checked' : ''}>
          <span class="option-label"><i class="fa-solid fa-xmark" style="color: #ef4444;"></i> FALSE</span>
        </label>
      </div>
    `;
  } else {
    renderInputsHTML += `
      <div class="text-answer-box">
        <label style="font-size: 0.72rem; font-weight: 700; opacity: 0.8;">Enter your explanation (ABAP Evaluation module will inspect keywords):</label>
        <textarea id="descriptive-textarea" oninput="saveAnswerValue('${currentQuest.quest_id}', this.value)" placeholder="Type your answer here...">${savedAns}</textarea>
      </div>
    `;
  }

  // Format Time
  const mins = Math.floor(session.timeRemaining / 60);
  const secs = session.timeRemaining % 60;
  const timeStr = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  const isTimeLow = session.timeRemaining <= 30;

  // Difficulty badge
  const diffClass = currentQuest.difficulty ? currentQuest.difficulty.toLowerCase() : "medium";
  const penaltyLabel = (session.currentQuiz.neg_mark === 'X' && currentQuest.neg_points > 0) 
    ? `<span style="color:#ef4444; font-weight:bold; margin-left:0.5rem;"><i class="fa-solid fa-circle-minus"></i> Penalty: -${currentQuest.neg_points}</span>` 
    : '';

  return `
    <div class="quiz-player-container">
      <div class="quiz-player-header">
        <div>
          <h3>${session.currentQuiz.title}</h3>
          <div style="display:flex; align-items:center; gap:0.5rem; margin-top:0.2rem;">
            <span style="font-size: 0.7rem; opacity: 0.7;">Question ${qNum} of ${session.questions.length}</span>
            <span class="difficulty-badge ${diffClass}">${currentQuest.difficulty || 'MEDIUM'}</span>
            ${penaltyLabel}
          </div>
        </div>
        <div class="timer-box ${isTimeLow ? 'blinking' : ''}">
          <i class="fa-regular fa-clock"></i> <span id="player-timer">${timeStr}</span>
        </div>
      </div>
      
      <div class="question-box">
        <div class="question-title">${qNum}. ${currentQuest.quest_text}</div>
        ${renderInputsHTML}
      </div>

      <div class="quiz-navigation-toolbar">
        <button class="sap-btn" onclick="prevQuestion()" ${session.currentQIndex === 0 ? 'disabled' : ''}>&lt; Previous</button>
        
        <div>
          <button class="sap-btn" onclick="abandonAttempt()" style="color: #dc2626;">Cancel Attempt</button>
          ${isLast ? `
            <button class="sap-btn" onclick="submitExamAttempt()" style="background: linear-gradient(to bottom, #d1fae5, #a7f3d0); border-color: #059669; font-weight: 700;">Submit Exam</button>
          ` : `
            <button class="sap-btn" onclick="nextQuestion()">Next &gt;</button>
          `}
        </div>
      </div>
    </div>
  `;
}

let lastAttemptResult = null; 
function getQuizResultHTML() {
  if (!lastAttemptResult) return `<p>No active result loaded.</p>`;

  const isPass = lastAttemptResult.status === "PASS";
  return `
    <div class="result-card">
      <div class="result-badge ${isPass ? 'pass' : 'fail'}">
        <i class="fa-solid ${isPass ? 'fa-circle-check' : 'fa-circle-xmark'}"></i>
      </div>
      <h3>Evaluation Summary</h3>
      <p style="font-size: 0.8rem; opacity: 0.8;">Attempt ID: <strong>${lastAttemptResult.attempt_id}</strong></p>
      
      <div class="score-display">
        <span class="pct">${lastAttemptResult.percentage.toFixed(1)}%</span>
        <span class="fraction">${lastAttemptResult.score_obt} / ${session.currentQuiz.max_score} Marks</span>
      </div>

      <span class="status-tag ${isPass ? 'pass' : 'fail'}">${lastAttemptResult.status}ED</span>
      
      <p style="font-size: 0.72rem; max-width: 320px; line-height: 1.4;">
        ${isPass ? 
          "Congratulations! You passed the grading benchmarks. The result block has been locked in custom table <strong>ZQUIZ_ATTEMPTS</strong>." : 
          `Benchmark score of <strong>${session.currentQuiz.pass_pct}%</strong> was not achieved. Please review database documentation in the code explorer panel and try again.`}
      </p>

      <button class="sap-btn" onclick="navigateTx('ZQUIZ')" style="margin-top: 1rem;">Back to Dashboard</button>
    </div>
  `;
}

// Generate the advanced Analytics Dashboard header for the ALV Report screen
function getAlvReportHTML() {
  let tableRows = "";
  
  const sortedAttempts = [...db.quiz_attempts].reverse();
  
  // Calculate stats KPIs
  const totalAttempts = db.quiz_attempts.length;
  let totalScorePctSum = 0;
  let passCount = 0;
  
  db.quiz_attempts.forEach(att => {
    totalScorePctSum += att.percentage;
    if (att.status === "PASS") passCount++;
  });
  
  const averagePercentage = totalAttempts > 0 ? (totalScorePctSum / totalAttempts) : 0;
  const passRate = totalAttempts > 0 ? ((passCount / totalAttempts) * 100) : 0;
  const failRate = 100 - passRate;

  sortedAttempts.forEach(att => {
    const qHeader = db.quiz_header.find(h => h.quiz_id === att.quiz_id);
    const qTitle = qHeader ? qHeader.title : "Unknown Quiz";
    tableRows += `
      <tr ondblclick="drilldownAttempt('${att.attempt_id}')">
        <td style="color: #2e6e9e; font-weight: bold;">${att.attempt_id}</td>
        <td>${att.quiz_id}</td>
        <td>${qTitle}</td>
        <td>${att.user_id}</td>
        <td>${att.att_date}</td>
        <td>${att.att_time}</td>
        <td style="text-align: right;">${att.score_obt}</td>
        <td style="text-align: right;">${att.percentage.toFixed(2)}%</td>
        <td>
          <span class="alv-status-badge ${att.status.toLowerCase()}">${att.status}</span>
        </td>
      </tr>
    `;
  });

  // Render KPI grid and visual CSS progress bar charts
  return `
    <div class="alv-grid-wrapper">
      <!-- Advanced Analytics Dashboard Header -->
      <div class="alv-dashboard-panel">
        <div class="alv-dashboard-title"><i class="fa-solid fa-chart-pie"></i> Quiz Analytics Overview</div>
        
        <!-- KPI Cards -->
        <div class="kpi-grid">
          <div class="kpi-card">
            <span class="kpi-label">Total Exam Logs</span>
            <span class="kpi-value">${totalAttempts}</span>
          </div>
          <div class="kpi-card">
            <span class="kpi-label">Average Grade</span>
            <span class="kpi-value">${averagePercentage.toFixed(1)}%</span>
          </div>
          <div class="kpi-card">
            <span class="kpi-label">Passing Rate</span>
            <span class="kpi-value" style="color: #22c55e;">${passRate.toFixed(1)}%</span>
          </div>
        </div>

        <!-- Visual Analytics Graph: Pass vs Fail Ratio -->
        <div class="chart-container">
          <div style="display:flex; justify-content:space-between; font-size:0.7rem; margin-bottom:0.3rem;">
            <span>Result Ratio (Pass vs Fail)</span>
            <span>${passCount} Pass / ${totalAttempts - passCount} Fail</span>
          </div>
          <div class="css-chart-bar-shell">
            <div class="css-chart-bar-fill pass" style="width: ${passRate}%" title="Pass Rate: ${passRate.toFixed(1)}%"></div>
            <div class="css-chart-bar-fill fail" style="width: ${failRate}%" title="Fail Rate: ${failRate.toFixed(1)}%"></div>
          </div>
          <div style="display:flex; justify-content:space-between; font-size:0.6rem; margin-top:0.25rem; opacity:0.8;">
            <span><i class="fa-solid fa-circle" style="color:#22c55e; margin-right:0.2rem;"></i> Pass (${passRate.toFixed(1)}%)</span>
            <span>Fail (${failRate.toFixed(1)}%) <i class="fa-solid fa-circle" style="color:#ef4444; margin-left:0.2rem;"></i></span>
          </div>
        </div>
      </div>

      <!-- ALV Grid table list -->
      <div class="alv-toolbar">
        <button class="alv-tool-btn" onclick="updateStatusBar('ALV list refreshed.', 'success')"><i class="fa-solid fa-arrows-rotate"></i> Refresh</button>
        <button class="alv-tool-btn" onclick="showHelp()"><i class="fa-solid fa-circle-question"></i> Help Pad</button>
        <div style="flex: 1;"></div>
        <span style="align-self: center; font-weight: bold; padding-right: 0.5rem;">ALV Grid Control Grid</span>
      </div>
      <div class="alv-table-container">
        <table class="alv-table">
          <thead>
            <tr>
              <th>Attempt ID</th>
              <th>Quiz ID</th>
              <th>Quiz Title</th>
              <th>User ID</th>
              <th>Date</th>
              <th>Time</th>
              <th style="text-align: right;">Score</th>
              <th style="text-align: right;">Percentage</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${tableRows}
          </tbody>
        </table>
      </div>
    </div>

    <div id="alv-popup-container"></div>
  `;
}

function getAdminCreateHTML() {
  return `
    <div class="admin-create-quiz-form">
      <h3 style="font-family: var(--font-display); border-bottom: 2px solid var(--sap-accent); padding-bottom: 0.3rem;">ZQUIZ_CREATE: Add Quiz</h3>
      <div class="admin-grid-fields">
        <div class="admin-form-group">
          <label>Quiz Code ID (NUMC8)</label>
          <input type="text" id="admin-quiz-id" placeholder="e.g. 10000004" maxlength="8">
        </div>
        <div class="admin-form-group">
          <label>Quiz Title</label>
          <input type="text" id="admin-quiz-title" placeholder="Quiz Title">
        </div>
      </div>
      <div class="admin-form-group">
        <label>Description</label>
        <textarea id="admin-quiz-desc" placeholder="Brief description..." rows="2"></textarea>
      </div>
      <div class="admin-grid-fields">
        <div class="admin-form-group">
          <label>Duration (Minutes)</label>
          <input type="number" id="admin-quiz-duration" value="5" min="1">
        </div>
        <div class="admin-form-group">
          <label>Passing Percentage (%)</label>
          <input type="number" id="admin-quiz-pass" value="60" min="10" max="100">
        </div>
      </div>
      
      <div class="admin-grid-fields" style="margin-bottom:0.5rem;">
        <div class="admin-form-group" style="flex-direction:row; gap:0.5rem; align-items:center; margin-top:0.8rem;">
          <input type="checkbox" id="admin-quiz-neg" style="width:auto; cursor:pointer;">
          <label for="admin-quiz-neg" style="cursor:pointer; font-weight:bold;">Activate Negative Marking</label>
        </div>
        <div class="admin-form-group">
          <label>Score Per Question</label>
          <input type="number" id="admin-quiz-pts" value="10" min="1">
        </div>
      </div>

      <!-- Single Question Adding block -->
      <div class="question-adder-block">
        <h4 style="font-size: 0.75rem; margin-bottom: 0.5rem; text-transform: uppercase;">Simulate Adding Question 1:</h4>
        <div class="admin-grid-fields" style="margin-bottom:0.5rem;">
          <div class="admin-form-group">
            <label>Question Type</label>
            <select id="admin-q-type" onchange="toggleAdminOptions(this.value)">
              <option value="MCQ">Multiple Choice Question (MCQ)</option>
              <option value="TF">True / False (TF)</option>
              <option value="DESC">Descriptive Explanation (DESC)</option>
            </select>
          </div>
          <div class="admin-form-group">
            <label>Difficulty</label>
            <select id="admin-q-diff">
              <option value="EASY">EASY</option>
              <option value="MEDIUM" selected>MEDIUM</option>
              <option value="HARD">HARD</option>
            </select>
          </div>
        </div>
        
        <div class="admin-grid-fields" style="margin-bottom: 0.5rem;">
          <div class="admin-form-group">
            <label>Question Text</label>
            <input type="text" id="admin-q-text" placeholder="What is...">
          </div>
          <div class="admin-form-group">
            <label>Negative Penalty Points</label>
            <input type="number" id="admin-q-neg" value="2" min="0">
          </div>
        </div>
        
        <div id="admin-options-block">
          <div class="admin-grid-fields" style="gap: 0.4rem; margin-bottom: 0.5rem;">
            <input type="text" id="admin-opt-a" placeholder="Option A text">
            <input type="text" id="admin-opt-b" placeholder="Option B text">
          </div>
          <div class="admin-grid-fields" style="gap: 0.4rem;">
            <input type="text" id="admin-opt-c" placeholder="Option C text">
            <input type="text" id="admin-opt-d" placeholder="Option D text">
          </div>
        </div>

        <div class="admin-form-group" style="margin-top: 0.5rem;">
          <label id="label-correct-ans">Correct Answer Option (e.g. A)</label>
          <input type="text" id="admin-correct-ans" placeholder="A">
        </div>
      </div>

      <div style="display: flex; justify-content: flex-end; gap: 0.8rem; margin-top: 0.5rem;">
        <button class="sap-btn" onclick="navigateTx('EASY_ACCESS')">Cancel</button>
        <button class="sap-btn" style="font-weight: bold; color: #1d4ed8;" onclick="submitNewQuiz()">Save Quiz</button>
      </div>
    </div>
  `;
}

function toggleAdminOptions(type) {
  const block = document.getElementById("admin-options-block");
  const label = document.getElementById("label-correct-ans");
  const input = document.getElementById("admin-correct-ans");
  
  if (type === "MCQ") {
    block.style.display = "block";
    label.textContent = "Correct Answer Option (A, B, C, or D)";
    input.placeholder = "A";
  } else if (type === "TF") {
    block.style.display = "none";
    label.textContent = "Correct True/False value (T or F)";
    input.placeholder = "T";
  } else {
    block.style.display = "none";
    label.textContent = "Evaluation keywords (comma-separated)";
    input.placeholder = "keyword1,keyword2,keyword3";
  }
}

// ==========================================================================
// 5. TRANSACTION ROUTING & EVENT HANDLERS
// ==========================================================================

const TCODES = [
  { code: "/NZQUIZ", desc: "Candidate Portal & Exams" },
  { code: "/NZQUIZ_CREATE", desc: "Create Quiz & Questions" },
  { code: "/NZQUIZ_REPORT", desc: "Admin Analytics Dashboard" },
  { code: "/NZQUIZ_USERS", desc: "User Management" },
  { code: "/NZQUIZ_CERT", desc: "Certificate Center" },
  { code: "/NZQUIZ_LEADER", desc: "Global Leaderboard" },
  { code: "/NZQUIZ_SETTINGS", desc: "System Settings" },
  { code: "/NZQUIZ_INTERVIEW", desc: "ABAP Interview Readiness" }
];
let transactionHistory = [];
let isFavActive = false;

function handleCmdInput(e) {
  const val = e.target.value.toUpperCase();
  const dropdown = document.getElementById("cmd-autocomplete-dropdown");
  if (!dropdown) return;
  dropdown.innerHTML = "";
  if (!val) {
    dropdown.classList.add("hidden");
    return;
  }
  
  const matches = TCODES.filter(t => t.code.includes(val) || t.desc.toUpperCase().includes(val));
  if (matches.length > 0) {
    dropdown.classList.remove("hidden");
    matches.forEach(m => {
      const div = document.createElement("div");
      div.className = "cmd-dropdown-item";
      div.innerHTML = `<span class="cmd-code">${m.code}</span><span class="cmd-desc">${m.desc}</span>`;
      div.onclick = () => {
        document.getElementById("sap-cmd-input").value = m.code;
        dropdown.classList.add("hidden");
        executeCommand();
      };
      dropdown.appendChild(div);
    });
  } else {
    dropdown.classList.add("hidden");
  }
}

function handleCmdEnter(e) {
  if (e.key === "Enter") {
    const dropdown = document.getElementById("cmd-autocomplete-dropdown");
    if(dropdown) dropdown.classList.add("hidden");
    executeCommand();
  }
}

function toggleHistory() {
  const dropdown = document.getElementById("cmd-history-dropdown");
  if (!dropdown) return;
  if (dropdown.classList.contains("hidden")) {
    dropdown.innerHTML = '<div class="cmd-section-header">Recent Transactions</div>';
    if (transactionHistory.length === 0) {
      dropdown.innerHTML += '<div class="cmd-dropdown-item" style="justify-content:center; opacity:0.6;">No history</div>';
    } else {
      transactionHistory.forEach(h => {
        const t = TCODES.find(tc => tc.code === h) || {code: h, desc: "Unknown"};
        const div = document.createElement("div");
        div.className = "cmd-dropdown-item";
        div.innerHTML = `<span class="cmd-code">${t.code}</span><span class="cmd-desc">${t.desc}</span>`;
        div.onclick = () => {
          document.getElementById("sap-cmd-input").value = t.code;
          dropdown.classList.add("hidden");
          executeCommand();
        };
        dropdown.appendChild(div);
      });
    }
    dropdown.classList.remove("hidden");
  } else {
    dropdown.classList.add("hidden");
  }
}

function toggleFavorite() {
  const icon = document.getElementById("cmd-fav-icon");
  const inputVal = document.getElementById("sap-cmd-input").value.toUpperCase();
  if (!inputVal) return;
  
  isFavActive = !isFavActive;
  if (isFavActive) {
    icon.classList.remove("fa-regular");
    icon.classList.add("fa-solid", "active");
    updateStatusBar(`${inputVal} added to favorites.`, "success");
  } else {
    icon.classList.remove("fa-solid", "active");
    icon.classList.add("fa-regular");
    updateStatusBar(`${inputVal} removed from favorites.`, "info");
  }
}

function executeCommand() {
  const input = document.getElementById("sap-cmd-input");
  const cmd = input.value.trim().toUpperCase();
  const autoDrop = document.getElementById("cmd-autocomplete-dropdown");
  const histDrop = document.getElementById("cmd-history-dropdown");
  if(autoDrop) autoDrop.classList.add("hidden");
  if(histDrop) histDrop.classList.add("hidden");

  if (!cmd) return;

  if (!session.currentUser && cmd !== "/N") {
    updateStatusBar("Authentication required. Please log in first.", "error");
    return;
  }

  // Update history
  if (cmd.startsWith("/N")) {
    if (!transactionHistory.includes(cmd)) {
      transactionHistory.unshift(cmd);
      if (transactionHistory.length > 8) transactionHistory.pop();
    }
  }

  if (cmd.startsWith("/N")) {
    const tx = cmd.substring(2);
    if (tx === "") {
      session.activeTx = "LOGON";
      session.currentUser = null;
      renderScreen();
      return;
    }

    if (tx === "ZQUIZ") {
      session.activeTx = "ZQUIZ";
      session.currentQuiz = null;
      renderScreen();
    } else if (tx === "ZQUIZ_REPORT") {
      if (session.currentUser.role !== "ADMIN") {
        updateStatusBar("Access Denied: Transaction is restricted to ADMIN role.", "error");
      } else {
        session.activeTx = "ALV_REPORT";
        renderScreen();
      }
    } else if (tx === "ZQUIZ_CREATE") {
      if (session.currentUser.role !== "ADMIN") {
        updateStatusBar("Access Denied: Transaction is restricted to ADMIN role.", "error");
      } else {
        session.activeTx = "ADMIN_CREATE";
        renderScreen();
      }
    } else if (tx === "ZQUIZ_USERS" || tx === "ZQUIZ_CERT" || tx === "ZQUIZ_LEADER" || tx === "ZQUIZ_SETTINGS" || tx === "ZQUIZ_INTERVIEW") {
      session.activeTx = tx;
      renderScreen();
    } else if (tx === "SE11") {
      selectCodeFile("zquiz_header.sql");
      updateStatusBar("SE11: Code explorer switched to Table Dictionary.", "success");
    } else if (tx === "SE38") {
      selectCodeFile("zquiz_admin_report.abap");
      updateStatusBar("SE38: Code explorer switched to ABAP Editor.", "success");
    } else if (tx === "SE37") {
      selectCodeFile("zquiz_evaluation_fm.abap");
      updateStatusBar("SE37: Code explorer switched to Function Builder.", "success");
    } else {
      session.activeTx = tx;
      renderScreen();
    }
  } else {
    updateStatusBar("Prefix transaction codes with /n (e.g. /nZQUIZ).", "error");
  }
}

function submitLogon() {
  const userVal = document.getElementById("logon-user").value.trim().toUpperCase();
  const passVal = document.getElementById("logon-pass").value;

  const matched = db.users.find(u => u.user_id === userVal && u.pass_hash === passVal);

  if (matched) {
    session.currentUser = matched;
    session.activeTx = "EASY_ACCESS";
    renderScreen();
  } else {
    updateStatusBar("Login failed: Unknown username or password.", "error");
    const box = document.querySelector(".sap-logon-box");
    box.style.animation = "shake 0.3s ease";
    setTimeout(() => box.style.animation = "", 300);
  }
}

function selectQuizCard(id) {
  const matched = db.quiz_header.find(h => h.quiz_id === id);
  if (matched) {
    session.currentQuiz = matched;
    renderScreen();
  }
}

// Start Quiz Attempt (with Question Shuffling Algorithm)
function startSelectedQuiz() {
  if (!session.currentQuiz) return;

  // 1. Fetch raw questions from database
  const rawQuestions = db.quiz_questions.filter(q => q.quiz_id === session.currentQuiz.quiz_id);
  
  // 2. Perform Fisher-Yates array shuffling algorithm to randomize order
  const shuffled = [...rawQuestions];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  // Set randomized questions inside active session
  session.questions = shuffled;
  session.currentQIndex = 0;
  session.timeRemaining = session.currentQuiz.duration * 60;
  session.userAnswers = {};

  session.activeTx = "ZQUIZ_PLAYER";
  renderScreen();
}

function startQuizTimer() {
  session.timer = setInterval(() => {
    session.timeRemaining--;
    
    const timerBox = document.getElementById("player-timer");
    if (timerBox) {
      const mins = Math.floor(session.timeRemaining / 60);
      const secs = session.timeRemaining % 60;
      timerBox.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
      
      const boxNode = document.querySelector(".timer-box");
      if (session.timeRemaining <= 30 && boxNode) {
        boxNode.classList.add("blinking");
      }
    }

    if (session.timeRemaining <= 0) {
      clearInterval(session.timer);
      session.timer = null;
      updateStatusBar("Exam time expired! Auto-evaluating responses.", "error");
      submitExamAttempt();
    }
  }, 1000);
}

function saveAnswerValue(questId, value) {
  session.userAnswers[questId] = value;
}

function prevQuestion() {
  if (session.currentQIndex > 0) {
    session.currentQIndex--;
    renderScreen();
  }
}

function nextQuestion() {
  if (session.currentQIndex < session.questions.length - 1) {
    session.currentQIndex++;
    renderScreen();
  }
}

function abandonAttempt() {
  if (confirm("Are you sure you want to abandon this quiz attempt? No records will be saved.")) {
    session.activeTx = "ZQUIZ";
    session.currentQuiz = null;
    renderScreen();
  }
}

// Advanced Grading Engine - Emulating dynamic thresholds and negative mark deductions
function submitExamAttempt() {
  if (session.timer) {
    clearInterval(session.timer);
    session.timer = null;
  }

  const newAttemptId = (800000000 + db.quiz_attempts.length + 1000).toString();
  
  let totalScoreObtained = 0;
  let responsesToInsert = [];
  
  const isNegActive = session.currentQuiz.neg_mark === "X";

  session.questions.forEach(q => {
    let earned = 0;
    let isCorrect = " ";
    const userAns = session.userAnswers[q.quest_id] || "";
    
    const cleanUser = userAns.trim().toUpperCase();
    const cleanCorrect = q.correct_ans.toUpperCase();

    if (userAns !== "") {
      if (q.quest_type === "MCQ") {
        if (cleanUser === cleanCorrect) {
          earned = q.points;
          isCorrect = "X";
        } else {
          // Apply negative penalty
          if (isNegActive && q.neg_points > 0) {
            earned = -1 * q.neg_points;
            isCorrect = "W";
          }
        }
      } else if (q.quest_type === "TF") {
        if (cleanUser === cleanCorrect || cleanUser[0] === cleanCorrect[0]) {
          earned = q.points;
          isCorrect = "X";
        } else {
          // Apply negative penalty
          if (isNegActive && q.neg_points > 0) {
            earned = -1 * q.neg_points;
            isCorrect = "W";
          }
        }
      } else if (q.quest_type === "DESC") {
        const keywords = cleanCorrect.split(",");
        let matches = 0;
        
        keywords.forEach(kw => {
          const word = kw.trim();
          if (cleanUser.includes(word)) {
            matches++;
          }
        });

        if (keywords.length > 0 && matches > 0) {
          const fraction = matches / keywords.length;
          earned = Math.round(q.points * fraction);
          isCorrect = (matches === keywords.length) ? "X" : "P";
        } else {
          // Apply negative penalty for wrong descriptive keyword matches
          if (isNegActive && q.neg_points > 0) {
            earned = -1 * q.neg_points;
            isCorrect = "W";
          }
        }
      }
    } else {
      // Skipped question - no penalty
      isCorrect = "S";
    }

    totalScoreObtained += earned;

    responsesToInsert.push({
      attempt_id: newAttemptId,
      quiz_id: session.currentQuiz.quiz_id,
      quest_id: q.quest_id,
      resp_text: userAns,
      is_correct: isCorrect,
      points_earn: earned
    });
  });

  // Clamp total score to 0
  if (totalScoreObtained < 0) {
    totalScoreObtained = 0;
  }

  const pct = (totalScoreObtained / session.currentQuiz.max_score) * 100;
  const finalStatus = pct >= session.currentQuiz.pass_pct ? "PASS" : "FAIL";

  const dateObj = new Date();
  const dateStr = dateObj.toISOString().split('T')[0];
  const timeStr = dateObj.toTimeString().split(' ')[0];

  const newAttempt = {
    attempt_id: newAttemptId,
    quiz_id: session.currentQuiz.quiz_id,
    user_id: session.currentUser.user_id,
    att_date: dateStr,
    att_time: timeStr,
    score_obt: totalScoreObtained,
    percentage: pct,
    status: finalStatus
  };

  db.quiz_attempts.push(newAttempt);
  db.quiz_responses.push(...responsesToInsert);

  lastAttemptResult = newAttempt;
  session.activeTx = "ZQUIZ_RESULT";
  renderScreen();
}

function drilldownAttempt(attemptId) {
  const responses = db.quiz_responses.filter(r => r.attempt_id === attemptId);
  const questions = db.quiz_questions;

  let listHTML = "";
  responses.forEach(r => {
    const q = questions.find(qst => qst.quiz_id === r.quiz_id && qst.quest_id === r.quest_id);
    const qText = q ? q.quest_text : "Unknown question text";
    const maxPoints = q ? q.points : 10;
    
    let correctnessClass = "incorrect";
    let correctnessLabel = "Incorrect";
    if (r.is_correct === "X") {
      correctnessClass = "correct";
      correctnessLabel = "Correct";
    } else if (r.is_correct === "P") {
      correctnessClass = "partial";
      correctnessLabel = "Partially Correct";
    } else if (r.is_correct === "S") {
      correctnessClass = "partial";
      correctnessLabel = "Skipped / Unattempted";
    } else if (r.is_correct === "W") {
      correctnessClass = "incorrect";
      correctnessLabel = `Incorrect (Negative Penalty Applied)`;
    }

    listHTML += `
      <div class="audit-item ${correctnessClass}">
        <div class="audit-q-text">Q${parseInt(r.quest_id)}. ${qText}</div>
        <div class="audit-meta-row">
          <div class="audit-val-box"><strong>User Answer:</strong> ${r.resp_text || '[Skipped]'}</div>
          <div class="audit-val-box"><strong>Grading:</strong> ${correctnessLabel} (${r.points_earn}/${maxPoints} Pts)</div>
        </div>
      </div>
    `;
  });

  const popupContainer = document.getElementById("alv-popup-container");
  popupContainer.innerHTML = `
    <div class="alv-popup-overlay" id="alv-popup-modal">
      <div class="alv-popup-box">
        <div class="alv-popup-header">
          <span>Candidate Response Auditor - Attempt ${attemptId}</span>
          <button style="border:none; background:transparent; font-size:1.2rem; cursor:pointer;" onclick="closeAlvPopup()">&times;</button>
        </div>
        <div class="alv-popup-body">
          <div class="audit-list">
            ${listHTML}
          </div>
        </div>
        <div class="alv-popup-footer">
          <button class="sap-btn" onclick="closeAlvPopup()">Close (Enter)</button>
        </div>
      </div>
    </div>
  `;
}

function closeAlvPopup() {
  const popup = document.getElementById("alv-popup-modal");
  if (popup) popup.remove();
}

function submitNewQuiz() {
  const qId = document.getElementById("admin-quiz-id").value.trim();
  const qTitle = document.getElementById("admin-quiz-title").value.trim();
  const qDesc = document.getElementById("admin-quiz-desc").value.trim();
  const qDuration = parseInt(document.getElementById("admin-quiz-duration").value);
  const qPoints = parseInt(document.getElementById("admin-quiz-pts").value);
  const qPass = parseFloat(document.getElementById("admin-quiz-pass").value);
  const isNeg = document.getElementById("admin-quiz-neg").checked;
  
  const questText = document.getElementById("admin-q-text").value.trim();
  const questType = document.getElementById("admin-q-type").value;
  const correctAns = document.getElementById("admin-correct-ans").value.trim();
  const questDiff = document.getElementById("admin-q-diff").value;
  const questNeg = parseInt(document.getElementById("admin-q-neg").value);

  if (!qId || !qTitle || !questText || !correctAns) {
    alert("Please fill in all mandatory quiz fields.");
    return;
  }

  db.quiz_header.push({
    quiz_id: qId,
    title: qTitle,
    description: qDesc || "Custom created quiz via dashboard admin portal.",
    duration: qDuration,
    total_quest: 1,
    max_score: qPoints,
    pass_pct: qPass,
    neg_mark: isNeg ? "X" : " ",
    created_by: "ADMIN",
    created_on: new Date().toISOString().split('T')[0]
  });

  db.quiz_questions.push({
    quiz_id: qId,
    quest_id: "0001",
    quest_type: questType,
    quest_text: questText,
    correct_ans: correctAns,
    points: qPoints,
    neg_points: isNeg ? questNeg : 0,
    difficulty: questDiff
  });

  if (questType === "MCQ") {
    db.quiz_options.push(
      { quiz_id: qId, quest_id: "0001", option_id: "A", option_text: document.getElementById("admin-opt-a").value || "Option A text" },
      { quiz_id: qId, quest_id: "0001", option_id: "B", option_text: document.getElementById("admin-opt-b").value || "Option B text" },
      { quiz_id: qId, quest_id: "0001", option_id: "C", option_text: document.getElementById("admin-opt-c").value || "Option C text" },
      { quiz_id: qId, quest_id: "0001", option_id: "D", option_text: document.getElementById("admin-opt-d").value || "Option D text" }
    );
  }

  updateStatusBar(`Quiz ${qId} successfully created and written to DDIC.`, "success");
  session.activeTx = "ZQUIZ";
  renderScreen();
}

function sapBack() {
  if (session.activeTx === "ZQUIZ_PLAYER") {
    abandonAttempt();
  } else if (session.activeTx === "ZQUIZ" || session.activeTx === "ALV_REPORT" || session.activeTx === "ADMIN_CREATE") {
    session.activeTx = "EASY_ACCESS";
    renderScreen();
  } else if (session.activeTx === "EASY_ACCESS") {
    session.activeTx = "LOGON";
    session.currentUser = null;
    renderScreen();
  }
}

function sapExit() {
  if (confirm("Disconnect from SAP GUI Logon session?")) {
    session.currentUser = null;
    session.activeTx = "LOGON";
    renderScreen();
  }
}

function sapCancel() {
  sapBack();
}

function navigateTx(txName) {
  session.activeTx = txName;
  renderScreen();
}

// ==========================================================================
// 6. CODE EXPLORER SELECTION & PRESENTATION ENGINE
// ==========================================================================

function selectCodeFile(filename) {
  activeCodeFile = filename;
  
  const links = document.querySelectorAll(".nav-file-link");
  links.forEach(l => {
    if (l.getAttribute("data-file") === filename) {
      l.classList.add("active");
    } else {
      l.classList.remove("active");
    }
  });

  const nameNode = document.getElementById("current-filename");
  const txNode = document.getElementById("sap-se-tx");
  const codeNode = document.getElementById("code-content");
  const explanationNode = document.getElementById("file-explanation-text");

  nameNode.textContent = filename;

  let txLabel = "SE11 (ABAP Dictionary)";
  let explanation = "";

  switch (filename) {
    case "zquiz_header.sql":
      txLabel = "SE11 (Dictionary)";
      explanation = "Defines the <strong>ZQUIZ_HEADER</strong> transparent database table. Holds metadata for each quiz, including dynamic passing cut-off thresholds and negative marking active flags.";
      break;
    case "zquiz_questions.sql":
      txLabel = "SE11 (Dictionary)";
      explanation = "Defines the <strong>ZQUIZ_QUESTIONS</strong> table, storing question texts, difficulty levels ('EASY', 'MEDIUM', 'HARD'), correct keys, and negative mark deduction weights.";
      break;
    case "zquiz_options.sql":
      txLabel = "SE11 (Dictionary)";
      explanation = "Defines the options table <strong>ZQUIZ_OPTIONS</strong>. Used exclusively for MCQ type questions, associating label options (A, B, C, or D) to their textual strings.";
      break;
    case "zquiz_attempts.sql":
      txLabel = "SE11 (Dictionary)";
      explanation = "Defines the <strong>ZQUIZ_ATTEMPTS</strong> records table. Automatically generated and updated during exam evaluation. Stores the score achieved, percentage grade, date, and final Pass/Fail criteria status.";
      break;
    case "zquiz_responses.sql":
      txLabel = "SE11 (Dictionary)";
      explanation = "Defines the detailed audit log table <strong>ZQUIZ_RESPONSES</strong>. Maps each attempt to individual candidate question selections, tracking points awarded per question to support drilldown audits.";
      break;
    case "zquiz_users.sql":
      txLabel = "SE11 (Dictionary)";
      explanation = "Transparent database table <strong>ZQUIZ_USERS</strong> mapping credential authorization IDs to their full system profiles and organizational roles (ADMIN vs candidate USER).";
      break;
    case "zquiz_admin_report.abap":
      txLabel = "SE38 (ABAP Editor)";
      explanation = "The main administrative ALV Report <strong>ZQUIZ_ADMIN_REPORT</strong>. Selects and joins data logs from attempts and quiz header tables, outputting columns visually using the standard ALV Grid Function Module, and handles double-click events to open response popup sheets.";
      break;
    case "zquiz_attempt_mp.abap":
      txLabel = "SE80 (Object Navigator)";
      explanation = "The Module Pool program <strong>ZQUIZ_ATTEMPT_MP</strong> that controls Dynpro screens flow logic (PAI/PBO blocks) representing the quiz portal UI and logon sequences. Implements Fisher-Yates randomization to shuffle quiz questions using standard random modules.";
      break;
    case "zquiz_evaluation_fm.abap":
      txLabel = "SE37 (Function Builder)";
      explanation = "The core scoring engine <strong>ZQUIZ_EVALUATE</strong>. Receives inputs from attempts, iterates over questions, computes scores (incorporating negative marking deductions), inserts logs into the database, and returns pass/fail metrics based on dynamic quiz thresholds.";
      break;
  }

  txNode.innerHTML = `Transaction: <strong>${txLabel}</strong>`;
  explanationNode.innerHTML = explanation;

  const rawCode = abapSourceCode[filename] || "";
  const highlightedCode = highlightABAP(rawCode, filename);
  codeNode.innerHTML = highlightedCode;

  const lineNumbersNode = document.getElementById("line-numbers");
  const lineCount = rawCode.split("\n").length;
  let lineNumbersHTML = "";
  for (let i = 1; i <= lineCount; i++) {
    lineNumbersHTML += `${i}<br>`;
  }
  lineNumbersNode.innerHTML = lineNumbersHTML;
}

function copyActiveCode() {
  const codeText = abapSourceCode[activeCodeFile] || "";
  if (!codeText) return;

  navigator.clipboard.writeText(codeText)
    .then(() => {
      alert(`Successfully copied ${activeCodeFile} code content to clipboard!`);
    })
    .catch(err => {
      console.error("Clipboard copy failed: ", err);
    });
}

function showHelp() {
  document.getElementById("help-modal").classList.add("active");
}

function closeHelp() {
  document.getElementById("help-modal").classList.remove("active");
}

function switchTheme(theme) {
  const body = document.body;
  const btnSap = document.getElementById("btn-theme-sap");
  const btnFiori = document.getElementById("btn-theme-fiori");

  if (theme === "sap") {
    body.className = "sap-gui-theme";
    btnSap.classList.add("active");
    btnFiori.classList.remove("active");
  } else {
    body.className = "sap-fiori-theme";
    btnSap.classList.remove("active");
    btnFiori.classList.add("active");
  }
}

// Menu Bar Dropdown Logic
function toggleMenu(menuId) {
  // Close any already open menus
  const allMenus = document.querySelectorAll('.sap-dropdown');
  allMenus.forEach(menu => {
    if (menu.id !== menuId) {
      menu.classList.remove('show');
    }
  });

  // Toggle the clicked menu
  const menu = document.getElementById(menuId);
  if (menu) {
    menu.classList.toggle('show');
  }
}

// Close dropdowns if clicked outside
window.onclick = function(event) {
  if (!event.target.matches('.sap-menu-item')) {
    const dropdowns = document.getElementsByClassName("sap-dropdown");
    for (let i = 0; i < dropdowns.length; i++) {
      let openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}

// Initial Boot
document.addEventListener("DOMContentLoaded", () => {
  renderScreen();
  selectCodeFile("zquiz_header.sql");
});
