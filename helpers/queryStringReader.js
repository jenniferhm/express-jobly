function queryStringReader(query) {
  const { search, min_employees, max_employees } = query;
    
  let queryStrings = [];
  let queryValues = [];

  if (min_employees > max_employees) {
    throw new ExpressError("Minimum number of employees is greater than maximum number of employees!", 400);
  }

  if (search) {
    queryValues.push(search);
    queryStrings.push(`handle ILIKE $${queryValues.length} OR name ILIKE $${queryValues.length}`);
  }

  if (min_employees) {
    queryValues.push(min_employees);
    queryStrings.push(`num_employees >= $${queryValues.length}`); 
  }

  if (max_employees) {
    queryValues.push(max_employees);
    queryStrings.push(`num_employees <= $${queryValues.length}`);      
  }

  let baseQuery = `SELECT handle, name FROM companies`

  for (let i = 0; i < queryStrings.length; i++) {
    if (i === 0) {
      baseQuery = `${baseQuery} WHERE ${queryStrings[i]}`
    } else {
      baseQuery = `${baseQuery} AND ${queryStrings[i]}` 
    }
  }
  return {baseQuery, queryValues};
}

module.exports = queryStringReader;