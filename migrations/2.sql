CREATE TABLE logMessages (
    messageId TEXT NOT NULL UNIQUE,
    timestamp INT NOT NULL -- in milliseconds
);
