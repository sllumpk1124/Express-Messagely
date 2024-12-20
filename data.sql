DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS messages;

CREATE TABLE users (
    username text PRIMARY KEY,
    password text NOT NULL,
    first_name text NOT NULL,
    last_name text NOT NULL,
    phone text NOT NULL,
    join_at timestamp without time zone NOT NULL,
    last_login_at timestamp with time zone
);

CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    from_username TEXT NOT NULL REFERENCES users(username) ON DELETE CASCADE,
    to_username TEXT NOT NULL REFERENCES users(username) ON DELETE CASCADE,
    body TEXT NOT NULL,
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    read_at TIMESTAMP WITH TIME ZONE
);
