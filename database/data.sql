INSERT INTO sections (name) VALUES
('Finance'),
('Marketing'),
('HR'),
('IT');
INSERT INTO subsections (section_id, name) VALUES
-- For Finance
(1, 'Budget Planning'),
(1, 'Investment Analysis'),
(1, 'Payroll Management'),
-- For Marketing
(2, 'Social Media'),
(2, 'Market Research'),
(2, 'Brand Strategy'),
-- For HR
(3, 'Recruitment'),
(3, 'Employee Relations'),
(3, 'Training & Development');

INSERT INTO questions (id,section_id, subsection_id, question_text, option_type) VALUES
(1,1, 1, 'What is the main goal of budget planning?', 'SINGLE'),
(2,1, 1, 'Which of these are included in budget forecasts?', 'MULTI'),
(3,2, 4, 'Which platform is best for social media ads?', 'SINGLE'),
(4,3, 7, 'What is the first step in recruitment?', 'SINGLE');
-- Options for Question 1 (id=1)
INSERT INTO options (question_id, text, marks) VALUES
(1, 'Control company spending', 1),
(1, 'Increase employee salaries', 0),
(1, 'Expand office space', 0);
-- Options for Question 2 (id=2)
INSERT INTO options (question_id, text, marks) VALUES
(2, 'Revenue projections', 1),
(2, 'Expense planning', 1),
(2, 'Market analysis', 0);
-- Options for Question 3 (id=3)
INSERT INTO options (question_id, text, marks) VALUES
(3, 'Instagram', 1),
(3, 'LinkedIn', 0),
(3, 'Pinterest', 0);
-- Options for Question 4 (id=4)
INSERT INTO options (question_id, text, marks) VALUES
(4, 'Define job requirements', 1),
(4, 'Conduct interviews', 0),
(4, 'Prepare offer letter', 0);
