#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    CREATE USER postgres WITH PASSWORD 'mypassword';
    CREATE DATABASE xdigital;
    GRANT ALL PRIVILEGES ON DATABASE xdigital TO postgres;
    
    \c task_assignment_db;
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
    
    -- Grant permissions to postgres
    GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO postgres;
    GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO postgres;
EOSQL