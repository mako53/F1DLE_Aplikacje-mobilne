-- Generated by Oracle SQL Developer Data Modeler 24.3.0.240.1210
--   at:        2024-11-04 19:29:38 CET
--   site:      Oracle Database 21c
--   type:      Oracle Database 21c



-- predefined type, no DDL - SDO_GEOMETRY

-- predefined type, no DDL - XMLTYPE

CREATE TABLE circuits (
    circuit_id        NUMBER(3) NOT NULL,
    short_name        VARCHAR2(20 BYTE) NOT NULL,
    full_name         VARCHAR2(50 BYTE),
    nations_nation_id NUMBER(3) NOT NULL,
    debut_year        NUMBER(4)
);

ALTER TABLE circuits ADD CONSTRAINT circuits_pk PRIMARY KEY ( circuit_id );

CREATE TABLE drivers (
    driver_id           NUMBER(4) NOT NULL,
    name                VARCHAR2(15 BYTE) NOT NULL,
    surname             VARCHAR2(20 BYTE) NOT NULL,
    age                 NUMBER(2) NOT NULL,
    teams_team_id       NUMBER(3) NOT NULL,
    starting_num        NUMBER(2) NOT NULL,
    nationality         VARCHAR2(30 BYTE) NOT NULL,
    wc                  NUMBER(2) NOT NULL,
    starts              NUMBER(4) NOT NULL,
    points              NUMBER(4, 1) NOT NULL,
    podiums             NUMBER(3) NOT NULL,
    debut               NUMBER(4) NOT NULL,
    circuits_circuit_id NUMBER(3),
    nations_nation_id   NUMBER(3)
);

ALTER TABLE drivers ADD CONSTRAINT drivers_pk PRIMARY KEY ( driver_id );

CREATE TABLE managers (
    manager_id        NUMBER(3) NOT NULL,
    name              VARCHAR2(20 BYTE) NOT NULL,
    surname           VARCHAR2(30 BYTE) NOT NULL,
    nationality       VARCHAR2(20 BYTE) NOT NULL,
    nations_nation_id NUMBER(3) NOT NULL
);

ALTER TABLE managers ADD CONSTRAINT managers_pk PRIMARY KEY ( manager_id );

CREATE TABLE nations (
    nation_id   NUMBER(3) NOT NULL,
    name        VARCHAR2(30 BYTE) NOT NULL,
    nation_code VARCHAR2(3 BYTE) NOT NULL,
    continent   VARCHAR2(20 BYTE),
    nationality VARCHAR2(30 BYTE) NOT NULL
);

ALTER TABLE nations ADD CONSTRAINT nations_pk PRIMARY KEY ( nation_id );

ALTER TABLE nations ADD CONSTRAINT nations_name_un UNIQUE ( name );

CREATE TABLE teams (
    team_id             NUMBER(3) NOT NULL,
    short_name          VARCHAR2(20 BYTE) NOT NULL,
    full_name           VARCHAR2(50 BYTE),
    managers_manager_id NUMBER(3) NOT NULL,
    debut_year          NUMBER(4)
);

ALTER TABLE teams ADD CONSTRAINT teams_pk PRIMARY KEY ( team_id );

ALTER TABLE teams ADD CONSTRAINT teams_short_name_un UNIQUE ( short_name );

CREATE TABLE users (
    user_id  NUMBER(3) NOT NULL,
    name     VARCHAR2(30 BYTE) NOT NULL,
    type     VARCHAR2(5 BYTE) NOT NULL,
    password VARCHAR2(30 BYTE) NOT NULL
);

ALTER TABLE users ADD CONSTRAINT users_pk PRIMARY KEY ( user_id );

ALTER TABLE circuits
    ADD CONSTRAINT circuits_nations_fk FOREIGN KEY ( nations_nation_id )
        REFERENCES nations ( nation_id );

ALTER TABLE drivers
    ADD CONSTRAINT drivers_circuits_fk FOREIGN KEY ( circuits_circuit_id )
        REFERENCES circuits ( circuit_id );

ALTER TABLE drivers
    ADD CONSTRAINT drivers_nations_fk FOREIGN KEY ( nations_nation_id )
        REFERENCES nations ( nation_id );

ALTER TABLE drivers
    ADD CONSTRAINT drivers_teams_fk FOREIGN KEY ( teams_team_id )
        REFERENCES teams ( team_id );

ALTER TABLE managers
    ADD CONSTRAINT managers_nations_fk FOREIGN KEY ( nations_nation_id )
        REFERENCES nations ( nation_id );

ALTER TABLE teams
    ADD CONSTRAINT teams_managers_fk FOREIGN KEY ( managers_manager_id )
        REFERENCES managers ( manager_id );



-- Oracle SQL Developer Data Modeler Summary Report: 
-- 
-- CREATE TABLE                             6
-- CREATE INDEX                             0
-- ALTER TABLE                             14
-- CREATE VIEW                              0
-- ALTER VIEW                               0
-- CREATE PACKAGE                           0
-- CREATE PACKAGE BODY                      0
-- CREATE PROCEDURE                         0
-- CREATE FUNCTION                          0
-- CREATE TRIGGER                           0
-- ALTER TRIGGER                            0
-- CREATE COLLECTION TYPE                   0
-- CREATE STRUCTURED TYPE                   0
-- CREATE STRUCTURED TYPE BODY              0
-- CREATE CLUSTER                           0
-- CREATE CONTEXT                           0
-- CREATE DATABASE                          0
-- CREATE DIMENSION                         0
-- CREATE DIRECTORY                         0
-- CREATE DISK GROUP                        0
-- CREATE ROLE                              0
-- CREATE ROLLBACK SEGMENT                  0
-- CREATE SEQUENCE                          0
-- CREATE MATERIALIZED VIEW                 0
-- CREATE MATERIALIZED VIEW LOG             0
-- CREATE SYNONYM                           0
-- CREATE TABLESPACE                        0
-- CREATE USER                              0
-- 
-- DROP TABLESPACE                          0
-- DROP DATABASE                            0
-- 
-- REDACTION POLICY                         0
-- 
-- ORDS DROP SCHEMA                         0
-- ORDS ENABLE SCHEMA                       0
-- ORDS ENABLE OBJECT                       0
-- 
-- ERRORS                                   0
-- WARNINGS                                 0
