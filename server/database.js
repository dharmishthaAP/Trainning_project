const Pool = require('pg').Pool;

const pool = new Pool({
    host: "localhost",
    user: "postgres",
    port: 5432,
    password: "shikhar@123",
    database: "employee"
});

pool.connect( (err) => {
    if(err) {
        console.log("database connection failed", err);
    } else {
        console.log("connected to database");
    }
})

module.exports = pool;