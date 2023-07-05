# BackendSmartex

This application callled "BackendSmartex" is a backend CRUD app in nodeJs. It's an API capable of getting the products in database and also add, delete or update if needed.

## Guide to run application

1. Install dependecies by running the terminal of the project "BackendSmartex":
``` 
npm install
npm install express
npm install pg
```

2. Create an .env file in the project, copy the following variables and fill them according to your postgreSQL database:
``` 
DB_USERNAME="exampleUSERNAME"
DB_HOST="exampleHOST"
DB_NAME="exampleNAME"
DB_PASSWORD="examplePASSWORD"
```

3. In your database create a new table called "products" by inserting the following query:
``` 
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    description VARCHAR(255),
    price FLOAT,
    category VARCHAR[]
);
```
4. Finally, in order to run the app run the following code in project terminal:
``` 
node ./server.js
```

## Unit Test

1. Install Jest dependecies by running the following line in "backend" folder terminal:
``` 
npm install --save-dev jest
```

2. Install Supertest dependency in the same terminal:
``` 
npm install supertest --save-dev
```

3. To run the unit test file use the command:
``` 
npx jest
```

## Technologies used

-NodeJS
-Express
-PostgreSQL
-Pino
