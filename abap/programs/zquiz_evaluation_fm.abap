*&---------------------------------------------------------------------*
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
      " Answer was not attempted (remained empty). No negative mark penalty is applied for skipped questions
      lv_is_correct = 'S'. " Skipped
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

  " Clamp total score to zero if candidate got negative cumulative score
  IF lv_total_score < 0.
    lv_total_score = 0.
  ENDIF.

  IF wa_quiz_hdr-max_score > 0.
    lv_max_score = wa_quiz_hdr-max_score.
  ENDIF.

  " 5. Calculate percentage and status based on dynamic cut-off
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

  " 6. Write final attempt summary to database table ZQUIZ_ATTEMPTS
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

ENDFUNCTION.
