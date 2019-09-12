DROP TABLE IF EXISTS jobs;
DROP TABLE IF EXISTS companies;

CREATE TABLE companies (
  handle text PRIMARY KEY,
  name text NOT NULL,
  num_employees INTEGER NOT NULL,
  description text,
  logo_url text
);

CREATE TABLE jobs (
  id serial PRIMARY KEY,
  title text NOT NULL,
  salary float NOT NULL,
  equity float NOT NULL,
  company_handle text REFERENCES companies ON DELETE CASCADE,
  date_posted date
);

INSERT INTO companies
  VALUES('apple', 'Apple', 500, 'fruit'),
        ('ibm', 'IBM', 600, 'blue');

INSERT INTO jobs (title, salary, equity, company_handle, date_posted)
  VALUES('Software Engineer', 100000.00, 0.05, 'apple', current_timestamp),
        ('Hardware Engineer', 90000.0, 0.02, 'ibm', current_timestamp);