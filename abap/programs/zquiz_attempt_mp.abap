*&---------------------------------------------------------------------*
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

ENDFORM.
