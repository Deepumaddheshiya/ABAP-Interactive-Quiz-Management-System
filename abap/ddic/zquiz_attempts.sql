-- ZQUIZ_ATTEMPTS: Quiz Attempt Records Database Table Definition
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
);
