// ABAP and DDL Source Code Registry for Code Explorer Display

const abapSourceCode = {
  "zquiz_header.sql": `-- ZQUIZ_HEADER: Quiz Header Database Table Definition (Enterprise Edition)
-- Created for ABAP Data Dictionary (DDIC) SE11 Representation

CREATE TABLE ZQUIZ_HEADER (
  MANDT       CHAR(3) NOT NULL,    -- Client (default 800)
  QUIZ_ID     NUMC(8) NOT NULL,    -- Unique Quiz ID
  TITLE       CHAR(100) NOT NULL,  -- Title of the Quiz
  DESCRIPTION CHAR(255),           -- Short description
  DURATION    INT4 NOT NULL,       -- Duration in minutes
  TOTAL_QUEST INT4 NOT NULL,       -- Total questions in the quiz
  MAX_SCORE   INT4 NOT NULL,       -- Maximum marks obtainable
  PASS_PCT    DEC(5,2) DEFAULT 50.00 NOT NULL, -- Dynamic Passing Cut-off Percentage
  NEG_MARK    CHAR(1) DEFAULT ' ' NOT NULL,   -- Negative marking flag ('X' = Active, ' ' = Inactive)
  CREATED_BY  CHAR(12) NOT NULL,   -- SAP User who created the quiz
  CREATED_ON  DATS NOT NULL,       -- Date of creation
  PRIMARY KEY (MANDT, QUIZ_ID)
);`,

  "zquiz_questions.sql": `-- ZQUIZ_QUESTIONS: Quiz Questions Database Table Definition (Enterprise Edition)
-- Created for ABAP Data Dictionary (DDIC) SE11 Representation

CREATE TABLE ZQUIZ_QUESTIONS (
  MANDT       CHAR(3) NOT NULL,    -- Client
  QUIZ_ID     NUMC(8) NOT NULL,    -- Quiz ID
  QUEST_ID    NUMC(4) NOT NULL,    -- Question Sequence ID
  QUEST_TYPE  CHAR(4) NOT NULL,    -- Type: 'MCQ' (Multiple Choice), 'TF' (True/False), 'DESC' (Descriptive)
  QUEST_TEXT  STRG NOT NULL,       -- Question Text
  CORRECT_ANS STRG,                -- Correct Option ID (e.g. 'A') or True/False value ('T'/'F') or CSV keywords for descriptive evaluation
  POINTS      INT4 NOT NULL,       -- Allocated positive score points
  NEG_POINTS  INT4 DEFAULT 0 NOT NULL, -- Negative points to deduct if answered incorrectly (e.g. 2 points)
  DIFFICULTY  CHAR(10) DEFAULT 'MEDIUM' NOT NULL, -- Question Difficulty: 'EASY', 'MEDIUM', 'HARD'
  PRIMARY KEY (MANDT, QUIZ_ID, QUEST_ID)
);`,

  "zquiz_options.sql": `-- ZQUIZ_OPTIONS: Multiple Choice Options Database Table Definition
-- Created for ABAP Data Dictionary (DDIC) SE11 Representation

CREATE TABLE ZQUIZ_OPTIONS (
  MANDT       CHAR(3) NOT NULL,    -- Client
  QUIZ_ID     NUMC(8) NOT NULL,    -- Quiz ID
  QUEST_ID    NUMC(4) NOT NULL,    -- Question Sequence ID
  OPTION_ID   CHAR(2) NOT NULL,    -- Option ID (e.g. 'A', 'B', 'C', 'D')
  OPTION_TEXT CHAR(255) NOT NULL,  -- Text description of the option
  PRIMARY KEY (MANDT, QUIZ_ID, QUEST_ID, OPTION_ID)
);`,

  "zquiz_attempts.sql": `-- ZQUIZ_ATTEMPTS: Quiz Attempt Records Database Table Definition
-- Created for ABAP Data Dictionary (DDIC) SE11 Representation

CREATE TABLE ZQUIZ_ATTEMPTS (
  MANDT       CHAR(3) NOT NULL,    -- Client
  ATTEMPT_ID  NUMC(10) NOT NULL,   -- Unique Attempt Sequence ID (assigned via Number Range)
  QUIZ_ID     NUMC(8) NOT NULL,    -- Attempted Quiz ID
  USER_ID     CHAR(12) NOT NULL,   -- Candidate Username
  ATT_DATE    DATS NOT NULL,       -- Date of attempt
  ATT_TIME    TIMS NOT NULL,       -- Start time of attempt
  SCORE_OBT   INT4 NOT NULL,       -- Score obtained by user
  PERCENTAGE  DEC(5,2) NOT NULL,   -- Percentage scored (0.00 to 100.00)
  STATUS      CHAR(4) NOT NULL,    -- Final status: 'PASS' or 'FAIL'
  PRIMARY KEY (MANDT, ATTEMPT_ID)
);`,

  "zquiz_responses.sql": `-- ZQUIZ_RESPONSES: Quiz Answer Responses Database Table Definition
-- Created for ABAP Data Dictionary (DDIC) SE11 Representation

CREATE TABLE ZQUIZ_RESPONSES (
  MANDT       CHAR(3) NOT NULL,    -- Client
  ATTEMPT_ID  NUMC(10) NOT NULL,   -- Attempt Sequence ID
  QUIZ_ID     NUMC(8) NOT NULL,    -- Quiz ID
  QUEST_ID    NUMC(4) NOT NULL,    -- Question ID
  RESP_TEXT   STRG,                -- Candidate's response text / option ID
  IS_CORRECT  CHAR(1),             -- Flag: 'X' = Correct, ' ' = Incorrect
  POINTS_EARN INT4 NOT NULL,       -- Marks awarded for this question
  PRIMARY KEY (MANDT, ATTEMPT_ID, QUIZ_ID, QUEST_ID)
);`,

  "zquiz_users.sql": `-- ZQUIZ_USERS: User Credentials and Profile Table Definition
-- Created for ABAP Data Dictionary (DDIC) SE11 Representation

CREATE TABLE ZQUIZ_USERS (
  MANDT       CHAR(3) NOT NULL,    -- Client
  USER_ID     CHAR(12) NOT NULL,   -- Username / Login ID
  UNAME       CHAR(40) NOT NULL,   -- Full name of user
  PASS_HASH   CHAR(64) NOT NULL,   -- Encrypted or hashed password
  ROLE        CHAR(10) NOT NULL,   -- Role: 'ADMIN' (Creator) or 'USER' (Candidate)
  PRIMARY KEY (MANDT, USER_ID)
);`,

  "zquiz_admin_report.abap": `*&---------------------------------------------------------------------*
*& Report ZQUIZ_ADMIN_REPORT
*& Title: Quiz Statistics and Candidate Performance Dashboard (ALV)
*&---------------------------------------------------------------------*
REPORT zquiz_admin_report.

TABLES: zquiz_attempts, zquiz_header.

*--- Types declarations
TYPES: BEGIN OF ty_report_out,
         attempt_id  TYPE numc10,
         quiz_id     TYPE numc8,
         title       TYPE char100,
         user_id     TYPE char12,
         att_date    TYPE dats,
         att_time    TYPE tims,
         score_obt   TYPE int4,
         max_score   TYPE int4,
         percentage  TYPE dec5_2,
         status      TYPE char4,
       END OF ty_report_out.

TYPES: BEGIN OF ty_drilldown_out,
         quest_id    TYPE numc4,
         quest_text  TYPE string,
         quest_type  TYPE char4,
         resp_text   TYPE string,
         correct_ans TYPE string,
         is_correct  TYPE char1,
         points_earn TYPE int4,
         points      TYPE int4,
       END OF ty_drilldown_out.

*--- Internal Tables and Work Areas
DATA: it_output    TYPE TABLE OF ty_report_out,
      wa_output    TYPE ty_report_out,
      it_drilldown TYPE TABLE OF ty_drilldown_out,
      wa_drilldown TYPE ty_drilldown_out.

*--- ALV Variables
DATA: it_fieldcat TYPE slis_t_fieldcat_alv,
      wa_fieldcat TYPE slis_fieldcat_alv,
      gd_layout   TYPE slis_layout_alv,
      gd_repid    TYPE sy-repid.

*--- Selection Screen
SELECTION-SCREEN BEGIN OF BLOCK b1 WITH FRAME TITLE TEXT-001.
  SELECT-OPTIONS: s_quiz   FOR zquiz_attempts-quiz_id,
                  s_user   FOR zquiz_attempts-user_id,
                  s_date   FOR zquiz_attempts-att_date.
SELECTION-SCREEN END OF BLOCK b1.

*--- Initialization
INITIALIZATION.
  gd_repid = sy-repid.

*--- Start-of-Selection
START-OF-SELECTION.
  PERFORM get_data.
  PERFORM build_fieldcat.
  PERFORM build_layout.
  PERFORM display_alv.

*&---------------------------------------------------------------------*
*& Form GET_DATA
*&---------------------------------------------------------------------*
FORM get_data.
  " Fetch attempts along with Quiz title and max score
  SELECT a~attempt_id
         a~quiz_id
         h~title
         a~user_id
         a~att_date
         a~att_time
         a~score_obt
         h~max_score
         a~percentage
         a~status
    INTO CORRESPONDING FIELDS OF TABLE it_output
    FROM zquiz_attempts AS a
    INNER JOIN zquiz_header AS h ON a~quiz_id = h~quiz_id
    WHERE a~quiz_id  IN s_quiz
      AND a~user_id  IN s_user
      AND a~att_date IN s_date.

  IF it_output IS INITIAL.
    MESSAGE 'No attempt logs found matching search criteria.' TYPE 'I'.
    STOP.
  ENDIF.
ENDFORM.

*&---------------------------------------------------------------------*
*& Form BUILD_FIELDCAT
*&---------------------------------------------------------------------*
FORM build_fieldcat.
  CLEAR it_fieldcat.

  DEFINE m_fieldcat.
    clear wa_fieldcat.
    wa_fieldcat-fieldname = &1.
    wa_fieldcat-seltext_m = &2.
    wa_fieldcat-key       = &3.
    append wa_fieldcat to it_fieldcat.
  END-OF-DEFINITION.

  m_fieldcat 'ATTEMPT_ID' 'Attempt ID'     'X'.
  m_fieldcat 'QUIZ_ID'    'Quiz ID'        ' '.
  m_fieldcat 'TITLE'      'Quiz Title'     ' '.
  m_fieldcat 'USER_ID'    'Candidate ID'   ' '.
  m_fieldcat 'ATT_DATE'   'Date Attempted' ' '.
  m_fieldcat 'ATT_TIME'   'Time Attempted' ' '.
  m_fieldcat 'SCORE_OBT'  'Score Obtained' ' '.
  m_fieldcat 'MAX_SCORE'  'Max Score'      ' '.
  m_fieldcat 'PERCENTAGE' 'Percentage'     ' '.
  m_fieldcat 'STATUS'     'Result Status'  ' '.
ENDFORM.

*&---------------------------------------------------------------------*
*& Form BUILD_LAYOUT
*&---------------------------------------------------------------------*
FORM build_layout.
  gd_layout-colwidth_optimize = 'X'.
  gd_layout-zebra             = 'X'.
ENDFORM.

*&---------------------------------------------------------------------*
*& Form DISPLAY_ALV
*&---------------------------------------------------------------------*
FORM display_alv.
  CALL FUNCTION 'REUSE_ALV_GRID_DISPLAY'
    EXPORTING
      i_callback_program      = gd_repid
      i_callback_user_command = 'USER_COMMAND'
      is_layout               = gd_layout
      it_fieldcat             = it_fieldcat
    TABLES
      t_outtab                = it_output
    EXCEPTIONS
      program_error           = 1
      OTHERS                  = 2.
ENDFORM.

*&---------------------------------------------------------------------*
*& Form USER_COMMAND
*&---------------------------------------------------------------------*
FORM user_command USING r_ucomm LIKE sy-ucomm
                        rs_selfield TYPE slis_selfield.

  " Check if row is clicked
  CASE r_ucomm.
    WHEN '&IC1'. " SAP GUI Double-Click Action Code
      IF rs_selfield-fieldname = 'ATTEMPT_ID'.
        READ TABLE it_output INTO wa_output INDEX rs_selfield-tabindex.
        IF sy-subrc = 0.
          PERFORM show_drilldown USING wa_output-attempt_id.
        ENDIF.
      ENDIF.
  ENDCASE.
ENDFORM.

*&---------------------------------------------------------------------*
*& Form SHOW_DRILLDOWN
*&---------------------------------------------------------------------*
FORM show_drilldown USING p_attempt_id TYPE numc10.
  DATA: lt_drill_fcat TYPE slis_t_fieldcat_alv,
        wa_drill_fcat TYPE slis_fieldcat_alv.

  " Fetch question responses detail
  SELECT r~quest_id
         q~quest_text
         q~quest_type
         r~resp_text
         q~correct_ans
         r~is_correct
         r~points_earn
         q~points
    INTO CORRESPONDING FIELDS OF TABLE it_drilldown
    FROM zquiz_responses AS r
    INNER JOIN zquiz_questions AS q ON r~quiz_id = q~quiz_id AND r~quest_id = q~quest_id
    WHERE r~attempt_id = p_attempt_id.

  IF it_drilldown IS INITIAL.
    MESSAGE 'No detailed question logs found for this attempt.' TYPE 'I'.
    RETURN.
  ENDIF.

  " Build subfield catalog
  DEFINE m_drill_fcat.
    clear wa_drill_fcat.
    wa_drill_fcat-fieldname = &1.
    wa_drill_fcat-seltext_m = &2.
    append wa_drill_fcat to lt_drill_fcat.
  END-OF-DEFINITION.

  m_drill_fcat 'QUEST_ID'    'QNo'.
  m_drill_fcat 'QUEST_TYPE'  'Type'.
  m_drill_fcat 'QUEST_TEXT'  'Question Text'.
  m_drill_fcat 'RESP_TEXT'   'Submitted Answer'.
  m_drill_fcat 'CORRECT_ANS' 'Correct Answer'.
  m_drill_fcat 'IS_CORRECT'  'Is Correct?'.
  m_drill_fcat 'POINTS_EARN' 'Points Earned'.
  m_drill_fcat 'POINTS'      'Max Points'.

  " Display drilldown detail in a popup window
  CALL FUNCTION 'REUSE_ALV_GRID_DISPLAY'
    EXPORTING
      i_callback_program = gd_repid
      i_grid_title       = 'Candidate Response Details Audit'
      is_layout          = gd_layout
      it_fieldcat        = lt_drill_fcat
      i_screen_start_column = 10
      i_screen_start_line   = 5
      i_screen_end_column   = 110
      i_screen_end_line     = 20
    TABLES
      t_outtab           = it_drilldown
    EXCEPTIONS
      program_error      = 1
      OTHERS             = 2.
ENDFORM.`,

  "zquiz_attempt_mp.abap": `*&---------------------------------------------------------------------*
*& Module Pool       ZQUIZ_ATTEMPT_MP
*& Title: Screen controller for User Login, Catalog, Quiz Taking (with Randomization)
*&---------------------------------------------------------------------*
PROGRAM zquiz_attempt_mp.

*--- Global Structure Declarations for Screens
TABLES: zquiz_users, zquiz_header, zquiz_attempts.

*--- Constants
CONSTANTS: c_passed TYPE char4 VALUE 'PASS',
           c_failed TYPE char4 VALUE 'FAIL'.

*--- Internal structures
TYPES: BEGIN OF ty_question,
         quiz_id    TYPE numc8,
         quest_id   TYPE numc4,
         quest_type TYPE char4,
         quest_text TYPE string,
         points     TYPE int4,
       END OF ty_question.

TYPES: BEGIN OF ty_response_temp,
         quest_id  TYPE numc4,
         user_ans  TYPE string,
       END OF ty_response_temp.

*--- Internal Tables
DATA: it_quizzes    TYPE TABLE OF zquiz_header,
      wa_quiz       TYPE zquiz_header,
      it_questions  TYPE TABLE OF ty_question,
      wa_question   TYPE ty_question,
      it_user_ans   TYPE TABLE OF ty_response_temp,
      wa_user_ans   TYPE ty_response_temp.

*--- Screen Controls
DATA: g_username    TYPE char12,
      g_password    TYPE char20,
      g_active_role TYPE char10,
      g_fullname    TYPE char40,
      g_quiz_id     TYPE numc8,
      g_quiz_title  TYPE char100,
      g_qindex      TYPE int4, " Current Question Index (1-based)
      g_qtotal      TYPE int4, " Total questions in active quiz
      g_qtext       TYPE string, " Active question string
      g_qtype       TYPE char4,  " Active question type
      g_opt_a       TYPE char255,
      g_opt_b       TYPE char255,
      g_opt_c       TYPE char255,
      g_opt_d       TYPE char255,
      g_user_select TYPE char2,   " A, B, C, D (for MCQ)
      g_user_tf     TYPE char1,   " T / F (for True/False)
      g_user_desc   TYPE string,  " Free text (for Descriptive)
      g_timer       TYPE i,       " Quiz timer remaining (seconds)
      g_score_obt   TYPE int4,
      g_pct         TYPE dec5_2,
      g_status      TYPE char4.

*&---------------------------------------------------------------------*
*&      Module  STATUS_0100  OUTPUT
*&---------------------------------------------------------------------*
MODULE status_0100 OUTPUT.
  SET PF-STATUS 'STATUS_100'.
  SET TITLEBAR 'TITLE_100'.
  CLEAR: g_username, g_password.
ENDMODULE.

*&---------------------------------------------------------------------*
*&      Module  USER_COMMAND_0100  INPUT
*&---------------------------------------------------------------------*
MODULE user_command_0100 INPUT.
  CASE sy-ucomm.
    WHEN 'BACK' OR 'EXIT' OR 'CANCEL'.
      LEAVE PROGRAM.
    WHEN 'LOGIN'.
      SELECT SINGLE uname role
        INTO (g_fullname, g_active_role)
        FROM zquiz_users
        WHERE user_id = g_username
          AND pass_hash = g_password.

      IF sy-subrc <> 0.
        MESSAGE 'Invalid User ID or Password.' TYPE 'E'.
      ELSE.
        IF g_active_role = 'ADMIN'.
          SUBMIT zquiz_admin_report AND RETURN.
        ELSE.
          CALL SCREEN 200.
        ENDIF.
      ENDIF.
  ENDCASE.
ENDMODULE.

*&---------------------------------------------------------------------*
*&      Module  STATUS_0200  OUTPUT
*&---------------------------------------------------------------------*
MODULE status_0200 OUTPUT.
  SET PF-STATUS 'STATUS_200'.
  SET TITLEBAR 'TITLE_200'.
  SELECT * FROM zquiz_header INTO TABLE it_quizzes.
ENDMODULE.

*&---------------------------------------------------------------------*
*&      Module  USER_COMMAND_0200  INPUT
*&---------------------------------------------------------------------*
MODULE user_command_0200 INPUT.
  CASE sy-ucomm.
    WHEN 'BACK' OR 'CANCEL'.
      LEAVE TO SCREEN 100.
    WHEN 'EXIT'.
      LEAVE PROGRAM.
    WHEN 'START_QUIZ'.
      SELECT SINGLE *
        INTO wa_quiz
        FROM zquiz_header
        WHERE quiz_id = g_quiz_id.

      IF sy-subrc <> 0.
        MESSAGE 'Please enter or select a valid Quiz ID.' TYPE 'E'.
      ELSE.
        SELECT quiz_id quest_id quest_type quest_text points
          INTO TABLE it_questions
          FROM zquiz_questions
          WHERE quiz_id = g_quiz_id
          ORDER BY quest_id.

        DESCRIBE TABLE it_questions LINES g_qtotal.
        IF g_qtotal = 0.
          MESSAGE 'No questions configured for this quiz.' TYPE 'W'.
          RETURN.
        ENDIF.

        " Shuffle / Randomize order of questions for security audit
        PERFORM randomize_questions.

        " Initialize exam parameters
        g_qindex = 1.
        g_timer  = wa_quiz-duration * 60.
        CLEAR it_user_ans.

        PERFORM load_question USING g_qindex.
        CALL SCREEN 300.
      ENDIF.
  ENDCASE.
ENDMODULE.

*&---------------------------------------------------------------------*
*&      Module  STATUS_0300  OUTPUT
*&---------------------------------------------------------------------*
MODULE status_0300 OUTPUT.
  SET PF-STATUS 'STATUS_300'.
  SET TITLEBAR 'TITLE_300'.
ENDMODULE.

*&---------------------------------------------------------------------*
*&      Module  USER_COMMAND_0300  INPUT
*&---------------------------------------------------------------------*
MODULE user_command_0300 INPUT.
  PERFORM save_current_answer.

  CASE sy-ucomm.
    WHEN 'PREV'.
      IF g_qindex > 1.
        g_qindex = g_qindex - 1.
        PERFORM load_question USING g_qindex.
      ENDIF.
    WHEN 'NEXT'.
      IF g_qindex < g_qtotal.
        g_qindex = g_qindex + 1.
        PERFORM load_question USING g_qindex.
      ENDIF.
    WHEN 'SUBMIT_QUIZ' OR 'TIMEOUT'.
      PERFORM evaluate_and_finish.
      CALL SCREEN 400.
    WHEN 'CANCEL' OR 'BACK'.
      CALL SCREEN 200.
  ENDCASE.
ENDMODULE.

*&---------------------------------------------------------------------*
*&      Module  STATUS_0400  OUTPUT
*&---------------------------------------------------------------------*
MODULE status_0400 OUTPUT.
  SET PF-STATUS 'STATUS_400'.
  SET TITLEBAR 'TITLE_400'.
ENDMODULE.

*&---------------------------------------------------------------------*
*&      Module  USER_COMMAND_0400  INPUT
*&---------------------------------------------------------------------*
MODULE user_command_0400 INPUT.
  CASE sy-ucomm.
    WHEN 'BACK' OR 'CANCEL' OR 'EXIT' OR 'OK'.
      CALL SCREEN 200.
  ENDCASE.
ENDMODULE.

*&---------------------------------------------------------------------*
*& Form LOAD_QUESTION
*&---------------------------------------------------------------------*
FORM load_question USING p_index TYPE int4.
  READ TABLE it_questions INTO wa_question INDEX p_index.
  IF sy-subrc = 0.
    g_qtype = wa_question-quest_type.
    g_qtext = wa_question-quest_text.
    
    CLEAR: g_opt_a, g_opt_b, g_opt_c, g_opt_d, g_user_select, g_user_tf, g_user_desc.

    READ TABLE it_user_ans INTO wa_user_ans WITH KEY quest_id = wa_question-quest_id.
    IF sy-subrc = 0.
      IF g_qtype = 'MCQ'.
        g_user_select = wa_user_ans-user_ans.
      ELSEIF g_qtype = 'TF'.
        g_user_tf = wa_user_ans-user_ans.
      ELSE.
        g_user_desc = wa_user_ans-user_ans.
      ENDIF.
    ENDIF.

    IF g_qtype = 'MCQ'.
      SELECT SINGLE option_text FROM zquiz_options INTO g_opt_a
        WHERE quiz_id = wa_question-quiz_id AND quest_id = wa_question-quest_id AND option_id = 'A'.
      SELECT SINGLE option_text FROM zquiz_options INTO g_opt_b
        WHERE quiz_id = wa_question-quiz_id AND quest_id = wa_question-quest_id AND option_id = 'B'.
      SELECT SINGLE option_text FROM zquiz_options INTO g_opt_c
        WHERE quiz_id = wa_question-quiz_id AND quest_id = wa_question-quest_id AND option_id = 'C'.
      SELECT SINGLE option_text FROM zquiz_options INTO g_opt_d
        WHERE quiz_id = wa_question-quiz_id AND quest_id = wa_question-quest_id AND option_id = 'D'.
    ENDIF.
  ENDIF.
ENDFORM.

*&---------------------------------------------------------------------*
*& Form SAVE_CURRENT_ANSWER
*&---------------------------------------------------------------------*
FORM save_current_answer.
  DATA: l_ans TYPE string.
  
  READ TABLE it_questions INTO wa_question INDEX g_qindex.
  CHECK sy-subrc = 0.

  IF g_qtype = 'MCQ'.
    l_ans = g_user_select.
  ELSEIF g_qtype = 'TF'.
    l_ans = g_user_tf.
  ELSE.
    l_ans = g_user_desc.
  ENDIF.

  READ TABLE it_user_ans INTO wa_user_ans WITH KEY quest_id = wa_question-quest_id.
  IF sy-subrc = 0.
    wa_user_ans-user_ans = l_ans.
    MODIFY it_user_ans FROM wa_user_ans INDEX sy-tabix.
  ELSE.
    wa_user_ans-quest_id = wa_question-quest_id.
    wa_user_ans-user_ans = l_ans.
    APPEND wa_user_ans TO it_user_ans.
  ENDIF.
ENDFORM.

*&---------------------------------------------------------------------*
*& Form RANDOMIZE_QUESTIONS
*&---------------------------------------------------------------------*
FORM randomize_questions.
  DATA: lv_lines TYPE i,
        lv_rand  TYPE i,
        wa_temp  TYPE ty_question.

  DESCRIBE TABLE it_questions LINES lv_lines.
  CHECK lv_lines > 1.

  LOOP AT it_questions INTO wa_question.
    DATA(lv_curr_idx) = sy-tabix.
    
    " Generate a pseudo-random integer index between 1 and table size
    CALL FUNCTION 'QF_RANDOM_INTEGER'
      EXPORTING
        ran_int_max   = lv_lines
        ran_int_min   = 1
      IMPORTING
        ran_int       = lv_rand
      EXCEPTIONS
        invalid_input = 1
        OTHERS        = 2.
    
    IF sy-subrc = 0 AND lv_rand <> lv_curr_idx.
      " Swap structures at current index and random index
      READ TABLE it_questions INTO wa_temp INDEX lv_rand.
      MODIFY it_questions FROM wa_question INDEX lv_rand.
      MODIFY it_questions FROM wa_temp INDEX lv_curr_idx.
    ENDIF.
  ENDLOOP.
ENDFORM.

*&---------------------------------------------------------------------*
*& Form EVALUATE_AND_FINISH
*&---------------------------------------------------------------------*
FORM evaluate_and_finish.
  DATA: lv_attempt_id TYPE numc10.

  CALL FUNCTION 'NUMBER_GET_NEXT'
    EXPORTING
      nr_range_nr             = '01'
      object                  = 'ZQUIZ_ATT'
    IMPORTING
      number                  = lv_attempt_id
    EXCEPTIONS
      interval_not_found      = 1
      number_range_not_intern = 2
      object_not_found        = 3
      quantity_is_not_1       = 4
      interval_overflow        = 5
      buffer_overflow         = 6
      OTHERS                  = 7.
  IF sy-subrc <> 0.
    lv_attempt_id = sy-timlo.
  ENDIF.

  CALL FUNCTION 'ZQUIZ_EVALUATE'
    EXPORTING
      i_attempt_id   = lv_attempt_id
      i_quiz_id      = g_quiz_id
      i_user_id      = g_username
      it_responses   = it_user_ans
    IMPORTING
      e_score_obt    = g_score_obt
      e_percentage   = g_pct
      e_status       = g_status.

ENDFORM.`,

  "zquiz_evaluation_fm.abap": `*&---------------------------------------------------------------------*
*& Function Module   ZQUIZ_EVALUATE
*& Title: Advanced Quiz Response Grading, Dynamic Cutoff & Negative Marking Engine
*&---------------------------------------------------------------------*
FUNCTION zquiz_evaluate.
*"----------------------------------------------------------------------
*"*"Local Interface:
*"  IMPORTING
*"     VALUE(I_ATTEMPT_ID) TYPE  NUMC10
*"     VALUE(I_QUIZ_ID) TYPE  NUMC8
*"     VALUE(I_USER_ID) TYPE  CHAR12
*"     VALUE(IT_RESPONSES) TYPE  ANY TABLE
*"  EXPORTING
*"     VALUE(E_SCORE_OBT) TYPE  INT4
*"     VALUE(E_PERCENTAGE) TYPE  DEC5_2
*"     VALUE(E_STATUS) TYPE  CHAR4
*"----------------------------------------------------------------------

  TYPES: BEGIN OF ty_resp_local,
           quest_id  TYPE numc4,
           user_ans  TYPE string,
         END OF ty_resp_local.

  DATA: lt_user_responses TYPE TABLE OF ty_resp_local,
        wa_user_resp      TYPE ty_resp_local.

  DATA: lt_questions TYPE TABLE OF zquiz_questions,
        wa_question  TYPE zquiz_questions.

  DATA: wa_response_db TYPE zquiz_responses,
        wa_attempt_db  TYPE zquiz_attempts,
        wa_quiz_hdr    TYPE zquiz_header.

  DATA: lv_total_score TYPE int4 VALUE 0,
        lv_max_score   TYPE int4 VALUE 0,
        lv_points_earn TYPE int4,
        lv_is_correct  TYPE char1.

  " Fields for Descriptive Grading (Keyword Matching)
  DATA: lt_keywords TYPE TABLE OF string,
        lv_keyword  TYPE string,
        lv_matches  TYPE int4,
        lv_total_kw TYPE int4,
        lv_desc_pct TYPE dec5_2.

  lt_user_responses = it_responses.

  " 1. Retrieve Quiz Header parameters (Max Score, Pass Limit, Neg Marking)
  SELECT SINGLE * FROM zquiz_header INTO wa_quiz_hdr
    WHERE quiz_id = i_quiz_id.
  IF sy-subrc <> 0.
    wa_quiz_hdr-max_score = 0.
    wa_quiz_hdr-pass_pct   = 50.
    wa_quiz_hdr-neg_mark   = ' '.
  ENDIF.

  " 2. Fetch all configured questions for the quiz
  SELECT * FROM zquiz_questions INTO TABLE lt_questions
    WHERE quiz_id = i_quiz_id.

  " 3. Grade each question response
  LOOP AT lt_questions INTO wa_question.
    lv_points_earn = 0.
    lv_is_correct  = ' '.
    
    IF wa_quiz_hdr-max_score = 0.
      lv_max_score = lv_max_score + wa_question-points.
    ENDIF.

    " Find matching response from user
    READ TABLE lt_user_responses INTO wa_user_resp WITH KEY quest_id = wa_question-quest_id.
    IF sy-subrc = 0 AND wa_user_resp-user_ans IS NOT INITIAL.
      
      TRANSLATE wa_user_resp-user_ans TO UPPER CASE.
      DATA(lv_correct_ans) = wa_question-correct_ans.
      TRANSLATE lv_correct_ans TO UPPER CASE.

      CASE wa_question-quest_type.
        " --- Multiple Choice Grading ---
        WHEN 'MCQ'.
          IF wa_user_resp-user_ans = lv_correct_ans.
            lv_points_earn = wa_question-points.
            lv_is_correct  = 'X'.
          ELSE.
            " Deduct negative marks if configured
            IF wa_quiz_hdr-neg_mark = 'X' AND wa_question-neg_points > 0.
              lv_points_earn = -1 * wa_question-neg_points.
              lv_is_correct  = 'W'. " Wrong/Incorrect with penalty
            ENDIF.
          ENDIF.

        " --- True/False Grading ---
        WHEN 'TF'.
          IF wa_user_resp-user_ans = lv_correct_ans OR 
             ( wa_user_resp-user_ans(1) = lv_correct_ans(1) ).
            lv_points_earn = wa_question-points.
            lv_is_correct  = 'X'.
          ELSE.
            " Deduct negative marks if configured
            IF wa_quiz_hdr-neg_mark = 'X' AND wa_question-neg_points > 0.
              lv_points_earn = -1 * wa_question-neg_points.
              lv_is_correct  = 'W'.
            ENDIF.
          ENDIF.

        " --- Descriptive Grading (Keyword Semantic Analysis) ---
        WHEN 'DESC'.
          SPLIT lv_correct_ans AT ',' INTO TABLE lt_keywords.
          DESCRIBE TABLE lt_keywords LINES lv_total_kw.
          
          IF lv_total_kw > 0.
            lv_matches = 0.
            LOOP AT lt_keywords INTO lv_keyword.
              CONDENSE lv_keyword.
              IF wa_user_resp-user_ans CO lv_keyword OR 
                 find( val = wa_user_resp-user_ans sub = lv_keyword ) >= 0.
                lv_matches = lv_matches + 1.
              ENDIF.
            ENDLOOP.
            
            " Allocate points proportionally
            IF lv_matches > 0.
              lv_desc_pct = lv_matches / lv_total_kw.
              lv_points_earn = wa_question-points * lv_desc_pct.
              IF lv_matches = lv_total_kw.
                lv_is_correct = 'X'.
              ELSE.
                lv_is_correct = 'P'. " Partially correct
              ENDIF.
            ELSE.
              " Wrong answer descriptive penalty
              IF wa_quiz_hdr-neg_mark = 'X' AND wa_question-neg_points > 0.
                lv_points_earn = -1 * wa_question-neg_points.
                lv_is_correct  = 'W'.
              ENDIF.
            ENDIF.
          ENDIF.
      ENDCASE.
    ELSE.
      " Answer was not attempted (remained empty). No penalty for skips.
      lv_is_correct = 'S'.
    ENDIF.

    " Add to accumulated score
    lv_total_score = lv_total_score + lv_points_earn.

    " 4. Save question response to database table ZQUIZ_RESPONSES
    CLEAR wa_response_db.
    wa_response_db-mandt       = sy-mandt.
    wa_response_db-attempt_id  = i_attempt_id.
    wa_response_db-quiz_id     = i_quiz_id.
    wa_response_db-quest_id    = wa_question-quest_id.
    wa_response_db-resp_text   = wa_user_resp-user_ans.
    wa_response_db-is_correct  = lv_is_correct.
    wa_response_db-points_earn = lv_points_earn.
    INSERT INTO zquiz_responses VALUES wa_response_db.
  ENDLOOP.

  " Clamp total score to zero if negative
  IF lv_total_score < 0.
    lv_total_score = 0.
  ENDIF.

  IF wa_quiz_hdr-max_score > 0.
    lv_max_score = wa_quiz_hdr-max_score.
  ENDIF.

  E_SCORE_OBT = lv_total_score.
  IF lv_max_score > 0.
    E_PERCENTAGE = ( lv_total_score / lv_max_score ) * 100.
  ELSE.
    E_PERCENTAGE = 0.
  ENDIF.

  IF E_PERCENTAGE >= wa_quiz_hdr-pass_pct.
    E_STATUS = 'PASS'.
  ELSE.
    E_STATUS = 'FAIL'.
  ENDIF.

  wa_attempt_db-mandt      = sy-mandt.
  wa_attempt_db-attempt_id = i_attempt_id.
  wa_attempt_db-quiz_id    = i_quiz_id.
  wa_attempt_db-user_id    = i_user_id.
  wa_attempt_db-att_date   = sy-datum.
  wa_attempt_db-att_time   = sy-uzeit.
  wa_attempt_db-score_obt  = E_SCORE_OBT.
  wa_attempt_db-percentage = E_PERCENTAGE.
  wa_attempt_db-status     = E_STATUS.
  INSERT INTO zquiz_attempts VALUES wa_attempt_db.

  COMMIT WORK.

ENDFUNCTION.`
};

// Clean syntax highlighter logic
function highlightABAP(code, filename) {
  if (!code) return "";
  
  let escaped = code
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  const isSQL = filename.endsWith('.sql');

  if (isSQL) {
    const sqlKeywords = [
      "CREATE TABLE", "NOT NULL", "PRIMARY KEY", "CHAR", "NUMC", 
      "INT4", "DEC", "DATS", "TIMS", "STRG", "VARCHAR", "INT", 
      "FOREIGN KEY", "REFERENCES", "TABLE", "DEFAULT"
    ];
    
    escaped = escaped.replace(/(--.*)/g, '<span class="hljs-comment">$1</span>');
    
    sqlKeywords.forEach(kw => {
      const regex = new RegExp(`\\b(${kw})\\b`, "gi");
      escaped = escaped.replace(regex, '<span class="hljs-keyword">$1</span>');
    });

    escaped = escaped.replace(/('[^']*')/g, '<span class="hljs-string">$1</span>');
  } else {
    const abapKeywords = [
      "REPORT", "PROGRAM", "FUNCTION", "ENDFUNCTION", "MODULE", "ENDMODULE", 
      "FORM", "ENDFORM", "TABLES", "CONSTANTS", "TYPES", "DATA", "CLEAR", 
      "CASE", "WHEN", "ENDCASE", "IF", "ELSEIF", "ELSE", "ENDIF", "SELECT", 
      "SINGLE", "INTO", "FROM", "WHERE", "ORDER BY", "DESCRIBE", "TABLE", 
      "LINES", "PERFORM", "CALL SCREEN", "CALL FUNCTION", "EXPORTING", 
      "IMPORTING", "TABLES", "EXCEPTIONS", "OTHERS", "LEAVE PROGRAM", 
      "LEAVE TO SCREEN", "SUBMIT", "AND RETURN", "MESSAGE", "STOP", "RETURN", 
      "READ TABLE", "INDEX", "MODIFY", "APPEND", "INSERT", "COMMIT WORK", 
      "TRANSLATE", "TO UPPER CASE", "SPLIT", "AT", "LOOP AT", "ENDLOOP", 
      "CONDENSE", "CO", "VALUE", "IN", "CORRESPONDING FIELDS OF", "INNER JOIN", 
      "ON", "SELECTION-SCREEN", "BEGIN OF", "BLOCK", "WITH FRAME", "TITLE", 
      "END OF", "SELECT-OPTIONS", "FOR", "INITIALIZATION", "START-OF-SELECTION", 
      "TYPE", "LIKE", "REF TO", "FIELD-SYMBOLS"
    ];

    let lines = escaped.split('\n');
    lines = lines.map(line => {
      if (line.trim().startsWith('*') || line.trim().startsWith('&amp;*')) {
        return `<span class="hljs-comment">${line}</span>`;
      }
      
      let commentIdx = line.indexOf('"');
      if (commentIdx !== -1) {
        let countQuotes = (line.substring(0, commentIdx).match(/'/g) || []).length;
        if (countQuotes % 2 === 0) {
          let codePart = line.substring(0, commentIdx);
          let commentPart = line.substring(commentIdx);
          return `${codePart}<span class="hljs-comment">${commentPart}</span>`;
        }
      }
      return line;
    });
    escaped = lines.join('\n');

    abapKeywords.forEach(kw => {
      const regex = new RegExp(`\\b(${kw})\\b`, "gi");
      escaped = escaped.replace(regex, match => {
        return `<span class="hljs-keyword">${match}</span>`;
      });
    });

    escaped = escaped.replace(/('[^']*')/g, '<span class="hljs-string">$1</span>');
  }

  return escaped;
}
