ALTER TABLE users
    DROP points,
    DROP lastPointsTimestamp,
    ADD firstActivityTimestamp INT NOT NULL DEFAULT 0,
    ADD messageCount INT NOT NULL DEFAULT 0;
