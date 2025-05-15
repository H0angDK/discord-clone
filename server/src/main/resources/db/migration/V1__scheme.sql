CREATE TABLE messages
(
    id         UUID NOT NULL,
    content    OID,
    room_id    UUID NOT NULL,
    user_id    UUID NOT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE,
    CONSTRAINT pk_messages PRIMARY KEY (id)
);

CREATE TABLE rooms
(
    id         UUID         NOT NULL,
    name       VARCHAR(255) NOT NULL,
    is_private BOOLEAN      NOT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE,
    CONSTRAINT pk_rooms PRIMARY KEY (id)
);

CREATE TABLE tokens
(
    id         UUID NOT NULL,
    token      VARCHAR(255),
    user_id    UUID,
    is_revoked BOOLEAN,
    token_type VARCHAR(255),
    CONSTRAINT pk_tokens PRIMARY KEY (id)
);

CREATE TABLE user_room
(
    room_id UUID NOT NULL,
    user_id UUID NOT NULL,
    CONSTRAINT pk_user_room PRIMARY KEY (room_id, user_id)
);

CREATE TABLE users
(
    id       UUID         NOT NULL,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    CONSTRAINT pk_users PRIMARY KEY (id)
);

ALTER TABLE users
    ADD CONSTRAINT uc_users_username UNIQUE (username);

CREATE INDEX idx_3e020a835b8d5922a99f4f2df ON messages (created_at);

CREATE INDEX idx_6fe13bb4f86f3f7af2c527046 ON rooms (name);

CREATE INDEX idx_e3e76093ee81b7003ea2fdfe4 ON rooms (is_private);

CREATE INDEX idx_user_username ON users (username);

CREATE INDEX token_idx ON tokens (token);

ALTER TABLE messages
    ADD CONSTRAINT FK_MESSAGES_ON_ROOM FOREIGN KEY (room_id) REFERENCES rooms (id);

ALTER TABLE messages
    ADD CONSTRAINT FK_MESSAGES_ON_USER FOREIGN KEY (user_id) REFERENCES users (id);

ALTER TABLE tokens
    ADD CONSTRAINT FK_TOKENS_ON_USER FOREIGN KEY (user_id) REFERENCES users (id);

CREATE INDEX user_id_idx ON tokens (user_id);

ALTER TABLE user_room
    ADD CONSTRAINT fk_user_room_on_room FOREIGN KEY (room_id) REFERENCES rooms (id);

ALTER TABLE user_room
    ADD CONSTRAINT fk_user_room_on_user FOREIGN KEY (user_id) REFERENCES users (id);