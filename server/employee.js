const express = require('express');
const router = express.Router();
const pool = require("./database");
// const query = require("./query");


router.get('/', (req, res, next) => {
    pool.query('select * from employee', (err, result) => {
        if(err) {
            next(err);
        } else {
            res.status(200).json(result.rows);
        }

    })
})


router.get('/:id', (req, res, next) => {
    const id = parseInt(req.params.id);
        pool.query('select * from employee where id=$1', [id], (err, result) => {
            if(err) {
                next(err);
            }
            else{
                if(result.rowCount == 0) {
                    res.status(404).json(  {
                        error : "Not Found"
                    })
                }
                else res.status(200).json(result.rows);
            }
        })
})

router.post('/', (req, res, next) => {
    const {first_name, gender, email, last_name, contact_no} = req.body;
    pool.query('INSERT INTO employee (first_name, gender, email, last_name, contact_no) VALUES($1, $2, $3, $4, $5) RETURNING *', [first_name, gender, email, last_name, contact_no], 
                     (err, result) => {
                        if(err) {
                            next(err);
                        }
                        else{
                            res.status(201).json( {
                                message : err.message || result.command
                            })
                        }
                     })

     
})

router.patch('/:id', (req, res, next) => {
    const id = req.params.id;
    const data = req.body;
    const arr = Object.keys(data);
    
    for(var i=0; i<arr.length; i++) {
        var query = `UPDATE employee SET ${arr[i]} = \$1 WHERE id = \$2`;
        pool.query(query, [data[arr[i]], id], (err, result) => {
            if(err){
                next(err);
            }
        })
    }
    res.status(200).json({
        message : "Updated"
    });
})

router.delete('/:id', (req, res, next) => {
    const id = parseInt(req.params.id);
        pool.query('DELETE FROM employee WHERE id = $1', [id], (err, result) => {
            // console.log(result.rowCount);
            if(err) {
                next(err);
            }
            else{
                if(result.rowCount == 0) {
                    res.status(404).json( {
                        message : "Not Found"
                    })
                } else res.status(200).json( {
                    message : err.message || result.command
                });
            }
        })
})

router.post('/project_manager', (req,res,next) => {
    const {emp_id, project_id, is_manager} = req.body;
    pool.query('SELECT employee_project_details.project_id FROM employee_project_details WHERE employee_project_details.is_manager = TRUE AND project_id = $1',[project_id], (err,result) => {
        if(err) {
            next(err);
        } else {
            if(result.rowCount > 0) {
                var error = new Error('project already has a manager')
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

})



module.exports = router;

