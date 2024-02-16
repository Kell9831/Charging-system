CREATE TABLE Users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL DEFAULT 'supersecret',
    name VARCHAR(255) NOT NULL,
    age INTEGER CHECK (age > 0 OR age IS NULL),
    role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    CONSTRAINT chk_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'), 
    CONSTRAINT chk_password_length CHECK (LENGTH(password) >= 6) 
);
