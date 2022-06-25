\echo 'Delete and recreate tree_node db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE tree_node;
CREATE DATABASE tree_node;
\connect tree_node

\i tree-node-schema.sql
\i tree-node-seed.sql

