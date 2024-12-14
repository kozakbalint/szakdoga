ALTER TABLE movies ALTER COLUMN vote_average TYPE NUMERIC(3, 1) USING vote_average::NUMERIC(3, 1);
