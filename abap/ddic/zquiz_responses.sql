-- ZQUIZ_RESPONSES: Quiz Answer Responses Database Table Definition
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
);
