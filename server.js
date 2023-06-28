const express = require("express");
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const app = express();
app.use(express.json());
const bcrypt = require("bcrypt");
const dbPath = path.join(__dirname, "customer.db"); //Assuming customer.db contains all customer details
let db = null;
const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};
initializeDBAndServer();

//Validating Admin credentials for authentication
app.post("/login", async (request, response) => {
  const { phoneNumber, password } = request.body; //Destructuring login details from request body object
  //Checking for phone number in the Database using SQL Query
  const confirmPhoneNumber = ` 
    SELECT
        *
    FROM 
        customer
    WHERE 
      phoneNumber = '${phoneNumber}';`;
  const userValidity = await db.get(confirmPhoneNumber);
  if (userValidity === undefined) {
    //If userValidity is not undefined, then login is legitimate
    response.status(400);
    response.send("Invalid phone number");
  } else {
    //Comparing decrypted and original passwords
    const passwordValidation = await bcrypt.compare(
      password,
      userValidity.password
    );
    if (passwordValidation === true) {
      response.send("Login Successful!");
    } else {
      response.status(400);
      response.send("Invalid Password");
    }
  }
});

//After successful login,adding the user to the database
app.post("/addCustomer", async (request, response) => {
  const { name, phoneNumber, password } = request.body; //Getting details for user creation from req body
  const encryptedPassword = await bcrypt.hash(password, 10); //Encrypting the password
  //Now checking for any duplicates in the Database using SQL Query
  const confirmPhoneNumber = `
    SELECT
        *
    FROM 
        customer
    WHERE 
        phoneNumber = '${phoneNumber}';`;
  const userValidity = await db.get(confirmPhoneNumber);
  if (userValidity === undefined) {
    //if userValidity is undefined, then there are no duplicates in the DB
    const addingUserDetails = `
        INSERT 
          INTO customer (name, phoneNumber)
        VALUES ('${name}''${phoneNumber}','${encryptedPassword}');`;
    const dbResponse = await db.run(addingUserDetails);
    response.send("User created successfully");
  } else {
    response.status(400);
    response.send("User already exists");
  }
});
