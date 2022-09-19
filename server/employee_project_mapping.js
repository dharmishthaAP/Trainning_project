const express = require('express');
const { Client } = require('pg');
const router = express.Router();
const pool = require("./database");



router.post('/', (req,res,next) => {
    const {emp_id, project_id, is_manager} = req.body;
    if(is_manager === 'false') {
        pool.query('INSERT INTO employee_project_details (emp_id, project_id, is_manager) VALUES($1, $2, $3)', [emp_id, project_id, is_manager], (err, result) => {
            if(err) {
                next(err);
            }
            else{
                res.status(200).json( {
                    message : result.command
                })
            }
        })
    } else {
        pool.query('SELECT employee_project_details.project_id FROM employee_project_details WHERE employee_project_details.is_manager = TRUE AND project_id = $1',[project_id], (err,result) => {
            if(err) {
                next(err);
            } else {
                if(result.rowCount > 0) {
                    var error = new Error('manager already exists')
                    error.status = 409
                    next(error);
                }
                else{
                    pool.query('INSERT INTO employee_project_details (emp_id, project_id, is_manager) VALUES($1, $2, $3)', [emp_id, project_id, is_manager], (err, result) => {

                            if(err) {
                                next(err);
                            }
                            else{
                                res.status(200).json( {
                                    message : result.command
                                })
                            }
                        })
                }
            }
        })
    }
    

})



router.patch('/', (req, res, next) => {
    const {emp_id, project_id, is_manager} = req.body;
    if(is_manager === 'false') {
        pool.query('UPDATE employee_project_details SET is_manager = false WHERE emp_id = $1 AND project_id = $2', [emp_id, project_id], (err, result) => {
            if(err) {
                next(err);
            } else{
                res.status(200).json( {
                    message : "UPDATED"
                })
            }
        })
    }

    else{
        pool.query('UPDATE employee_project_details SET is_manager = false WHERE project_id = $1', [project_id], (err, result) => {
            if(err) {
                next(err);
            }
            else{
                pool.query('UPDATE employee_project_details SET is_manager = TRUE WHERE emp_id = $1 AND project_id = $2', [emp_id, project_id], (err, result) => {
                    if(err) {
                        next(err);
                    }
                    else {
                        res.status(200).json( {
                            message : "UPDATED"
                        })
                    }
                })
            }
        })
    }
    
})


//TODO:  API to update project for an employee




module.exports = router;