CREATE TABLE companies (
  handle text PRIMARY KEY,
  name text NOT NULL,
  num_employees INTEGER NOT NULL,
  description text,
  logo_url text
);