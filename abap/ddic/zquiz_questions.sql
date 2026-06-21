-- ZQUIZ_QUESTIONS: Quiz Questions Database Table Definition (Enterprise Edition)
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
);
