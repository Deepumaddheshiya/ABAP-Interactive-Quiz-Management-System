-- ZQUIZ_HEADER: Quiz Header Database Table Definition (Enterprise Edition)
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
);
