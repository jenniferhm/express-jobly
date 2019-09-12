DROP TABLE IF EXISTS jobs;
DROP TABLE IF EXISTS companies;
DROP TABLE IF EXISTS users;

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

CREATE TABLE users (
  username text PRIMARY KEY,
  password text NOT NULL,
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL,
  photo_url text,
  is_admin boolean
);

INSERT INTO companies
  VALUES('apple', 'Apple', 500, 'fruit'),
        ('ibm', 'IBM', 600, 'blue');

INSERT INTO jobs (title, salary, equity, company_handle, date_posted)
  VALUES('Software Engineer', 100000.00, 0.05, 'apple', current_timestamp),
        ('Hardware Engineer', 90000.0, 0.02, 'ibm', current_timestamp);

INSERT INTO users
  VALUES('whiskey', 'password', 'dog', 'pup', 'whiskey@dog.com', 'https://visualhunt.com/photos/4/golden-retriever-dog-retriever-animal-pet-fur.jpg?s=s', true),
        ('fluffy', 'password', 'ball', 'cotton', 'fluffy@cotton.com', null, false);