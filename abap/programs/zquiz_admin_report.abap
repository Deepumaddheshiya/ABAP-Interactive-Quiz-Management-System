*&---------------------------------------------------------------------*
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
ENDFORM.
