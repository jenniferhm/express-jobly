DROP TABLE IF EXISTS companies;

CREATE TABLE companies (
  handle text PRIMARY KEY,
  name text NOT NULL,
  num_employees INTEGER NOT NULL,
  description text,
  logo_url text
);

INSERT INTO companies
  VALUES('apple', 'Apple', 500, 'fruit'),
        ('ibm', 'IBM', 600, 'blue');