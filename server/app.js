const express = require('express');
const employee_routes = require('./routes/employee');
const project_routes = require('./routes/project');
const manager_routes = require('./routes/employee_project_mapping');
const app = express();
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hello World");
})

app.use('/employee', employee_routes);
app.use('/project',project_routes);
app.use('/manager', manager_routes);


app.use((err, req, res, next) => {
    // console.log("hello");
    const status = err.status || 500;

    res.status(status).json( {
        message : err.message || "Error Occured"
    });
})

app.listen(5000, () => {
    console.log('server is listening')
});

module.exports = app;