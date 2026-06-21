-- ZQUIZ_USERS: User Credentials and Profile Table Definition
-- Created for ABAP Data Dictionary (DDIC) SE11 Representation

CREATE TABLE ZQUIZ_USERS (
  MANDT       CHAR(3) NOT NULL,    -- Client
  USER_ID     CHAR(12) NOT NULL,   -- Username / Login ID
  UNAME       CHAR(40) NOT NULL,   -- Full name of user
  PASS_HASH   CHAR(64) NOT NULL,   -- Encrypted or hashed password
  ROLE        CHAR(10) NOT NULL,   -- Role: 'ADMIN' (Creator) or 'USER' (Candidate)
  PRIMARY KEY (MANDT, USER_ID)
);
