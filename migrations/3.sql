ALTER TABLE users
    DROP points;

ALTER TABLE users
    DROP lastPointsTimestamp;

ALTER TABLE users
    ADD firstActivityTimestamp INT NOT NULL DEFAULT 0;

ALTER TABLE users
    ADD messageCount INT NOT NULL DEFAULT 0;
