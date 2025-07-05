CREATE TABLE users (
    id TEXT NOT NULL,
    name TEXT NOT NULL,
    firstActivityTimestamp INT NOT NULL, -- in milliseconds
    messageCount INT NOT NULL,
    awardedRoleIds TEXT NOT NULL -- comma separated
);

CREATE TABLE responses (
    command TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    body TEXT NOT NULL
);

CREATE TABLE logMessages (
    messageId TEXT NOT NULL UNIQUE,
    timestamp INT NOT NULL -- in milliseconds
);
