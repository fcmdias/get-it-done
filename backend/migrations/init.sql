-- Create initial tags
INSERT INTO tags (name, created_at, updated_at) VALUES
    ('Frontend', NOW(), NOW()),
    ('Backend', NOW(), NOW()),
    ('DevOps', NOW(), NOW()),
    ('UI/UX', NOW(), NOW()),
    ('Database', NOW(), NOW()),
    ('Testing', NOW(), NOW()),
    ('Documentation', NOW(), NOW()),
    ('Bug Fix', NOW(), NOW());

-- Create sample projects
INSERT INTO projects (name, description, status, created_at, updated_at) VALUES
    ('Website Redesign', 'Modernize the company website with new design and features', 'active', NOW(), NOW()),
    ('API Development', 'Create RESTful API for mobile application', 'active', NOW(), NOW()),
    ('Database Migration', 'Migrate legacy database to PostgreSQL', 'pending', NOW(), NOW()),
    ('Mobile App', 'Develop cross-platform mobile application', 'active', NOW(), NOW()),
    ('Documentation Update', 'Update technical documentation for v2.0', 'completed', NOW(), NOW());

-- Link projects and tags
INSERT INTO project_tags (project_id, tag_id, created_at) VALUES
    (1, 1, NOW()), -- Website Redesign - Frontend
    (1, 4, NOW()), -- Website Redesign - UI/UX
    (2, 2, NOW()), -- API Development - Backend
    (2, 5, NOW()), -- API Development - Database
    (3, 5, NOW()), -- Database Migration - Database
    (3, 2, NOW()), -- Database Migration - Backend
    (4, 1, NOW()), -- Mobile App - Frontend
    (4, 2, NOW()), -- Mobile App - Backend
    (5, 7, NOW()); -- Documentation Update - Documentation 