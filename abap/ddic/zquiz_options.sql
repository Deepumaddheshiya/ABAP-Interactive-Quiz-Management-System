-- ZQUIZ_OPTIONS: Multiple Choice Options Database Table Definition
-- Created for ABAP Data Dictionary (DDIC) SE11 Representation

CREATE TABLE ZQUIZ_OPTIONS (
  MANDT       CHAR(3) NOT NULL,    -- Client
  QUIZ_ID     NUMC(8) NOT NULL,    -- Quiz ID
  QUEST_ID    NUMC(4) NOT NULL,    -- Question Sequence ID
  OPTION_ID   CHAR(2) NOT NULL,    -- Option ID (e.g. 'A', 'B', 'C', 'D')
  OPTION_TEXT CHAR(255) NOT NULL,  -- Text description of the option
  PRIMARY KEY (MANDT, QUIZ_ID, QUEST_ID, OPTION_ID)
);
