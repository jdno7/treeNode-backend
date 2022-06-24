\echo 'Delete and recreate tree_node db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE tree_node;
CREATE DATABASE tree_node;
\connect tree_node

\i tree-node-schema.sql
-- \i tree-node-seed.sql

-- \echo 'Delete and recreate jobly_test db?'
-- \prompt 'Return for yes or control-C to cancel > ' foo

-- DROP DATABASE jobly_test;
-- CREATE DATABASE jobly_test;
-- \connect jobly_test

-- \i jobly-schema.sql
