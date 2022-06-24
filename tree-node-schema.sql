CREATE TABLE tree (
    node_id SERIAL PRIMARY KEY,
    parent_id INTEGER
        REFERENCES tree ON DELETE CASCADE,
    name TEXT NOT NULL
)