CREATE TABLE users (
    id TEXT NOT NULL,
    name TEXT NOT NULL,
    points INT NOT NULL,
    lastPointsTimestamp INT NOT NULL, -- in milliseconds
    awardedRoleIds TEXT NOT NULL -- comma separated
);

CREATE TABLE responses (
    command TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    body TEXT NOT NULL
)
