-- Active: 1692042581788@@127.0.0.1@3306
CREATE TABLE users(
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL,
    created_at TEXT DEFAULT(DATETIME()) NOT NULL 
);

CREATE TABLE posts(
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    creator_id TEXT UNIQUE NOT NULL,
    content TEXT NOT NULL,
    likes INTEGER DEFAULT (0) NOT NULL,
    dislikes INTEGER DEFAULT (0) NOT NULL,
    created_at TEXT DEFAULT(DATETIME()) NOT NULL,
    updated_at TEXT DEFAULT(DATETIME()) NOT NULL,
    FOREIGN KEY (creator_id) REFERENCES users(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

CREATE TABLE likes_dislikes(
    user_id TEXT NOT NULL,
    post_id TEXT NOT NULL,
    like INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    FOREIGN KEY (post_id) REFERENCES posts(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

INSERT INTO users(id, name, email, password, role)
VALUES
    ("u001","Luiz Silva", "lsilva@gmail.com", "$2a$12$ukmUVHppNZ2vGlt//iD4uOgTrUNCdy8QWAfw0LluJCkoJRvIRW/rK
", "NORMAL"), --senha: 123abc
    ("u002","Joana Maciel", "maciel_jo@gmail.com", "$2a$12$kAW9Gux58tiTFlvn4vu1AOPs3FxWJB0vBFNMUH.BYUyNQBTd62U.C
", "NORMAL"), --senha 123456
    ("u003","Caio Cézar", "cezar9840958@hotmail.com", "$2a$12$jNIp3gROjKJuUB1bVd7kbO96KZK83JdeB.cDJjRPU4RCXz6NG9ife
", "NORMAL");--senha 47389oiwo

INSERT INTO posts(id, creator_id, content)
VALUES
    ("p001", "u001", "Partiu Região dos Lagos!"),
    ("p002", "u003", "Festa do Luiz nesse fds, quem vai?");

INSERT INTO likes_dislikes(user_id, post_id, like)
VALUES
    ("u002", "p001", 1),
    ("u003", "p001", 1),
    ("u001", "p002", 1),
    ("u003", "p002", 0);

SELECT * FROM likes_dislikes;

UPDATE posts
SET likes = 2
WHERE id = 'p001';

UPDATE posts
SET likes = 1, dislikes = 1
WHERE id = 'p002';