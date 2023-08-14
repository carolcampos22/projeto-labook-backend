-- Active: 1692042581788@@127.0.0.1@3306
CREATE TABLE users(
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT(DATETIME())
);

CREATE TABLE posts(
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    creator_id TEXT NOT NULL,
    content TEXT NOT NULL,
    likes INTEGER NOT NULL,
    dislikes INTEGER NOT NULL,
    created_at TEXT NOT NULL DEFAULT(DATETIME()),
    updated_at TEXT NOT NULL DEFAULT(DATETIME()),
    FOREIGN KEY (creator_id) REFERENCES users(id)

);

CREATE TABLE likes_dislikes(
    user_id TEXT NOT NULL,
    post_id TEXT NOT NULL,
    like INTEGER,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (post_id) REFERENCES posts(id)
);

INSERT INTO users(id, name, email, password, role)
VALUES
    ("u001","Luiz Silva", "lsilva@gmail.com", "123abc", "NORMAL"),
    ("u002","Joana Maciel", "maciel_jo@gmail.com", "123456", "NORMAL"),
    ("u003","Caio Cézar", "cezar9840958@hotmail.com", "47389oiwo", "NORMAL");

INSERT INTO posts(id, creator_id, content, likes, dislikes)
VALUES
    ("p001", "u001", "Partiu Região dos Lagos!", 15, 0),
    ("p002", "u003", "Festa do Luiz nesse fds, quem vai?", 80, 2);

INSERT INTO likes_dislikes(user_id, post_id, like)
VALUES
    ("u001", "p001", 1),
    ("u001", "p002", 0),
    ("u002", "p001", 0);

SELECT * FROM likes_dislikes;