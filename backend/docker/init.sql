-- Initialize the database for the Telegram Mini App
-- This file will be executed when the PostgreSQL container starts for the first time

-- Create any additional extensions if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- You can add any initial database setup here
-- For example:
-- CREATE SCHEMA IF NOT EXISTS app;
-- CREATE TABLE IF NOT EXISTS app.example_table (...);

-- The database and user are already created via environment variables
SELECT 'Database initialization completed' as status;