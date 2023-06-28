const customers = [
  {
    email: "anurag11@yopmail.com",
    name: "anurag",
  },
  {
    email: "sameer11@yopmail.com",
    name: "sameer",
  },
  {
    email: "ravi11@yopmail.com",
    name: "ravi",
  },
  {
    email: "akash11@yopmail.com",
    name: "akash",
  },
  {
    email: "anjali11@yopmail.com",
    name: "anjai",
  },
  {
    email: "santosh11@yopmail.com",
    name: "santosh",
  },
];
const sqlite3 = require("sqlite3").verbose();
let db = new sqlite3.Database("./custmrs.db");
db.run(`CREATE TABLE custmrs(email text, name text)`);
customers.map((each) => {
  let sqlFunction = `INSERT INTO custmrs (email, name) VALUES (${each.email},${each.name})`;
  db.run(sqlFunction, customers, function (error) {
    if (error) {
      return console.log(error.message);
    }
    console.log(`Data added successfully`);
  });
});

db.close();
