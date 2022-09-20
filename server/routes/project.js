const express = require('express');
const router = express.Router();
const pool = require("../../server/database");

router.get('/', (req, res, next) => {
    pool.query('select * from project', (err, result) => {
        if(err) {
            next(err);
        } else {
            res.status(200).json(result.rows);
        }

    })
})

router.get('/:id', (req, res, next) => {
    const id = parseInt(req.params.id);
        pool.query('select * from project where id=$1', [id], (err, result) => {
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
    const {project_name, start_from, client_name} = req.body;
    pool.query('INSERT INTO project (project_name, start_from, client_name) VALUES($1, $2, $3) RETURNING *', [project_name, start_from, client_name], 
                     (err, result) => {
                        if(err) {
                            next(err);
                        }
                        else{
                            // console.log(result);
                            res.status(201).json( {
                                message : result.command
                            })
                        }
                     })

     
})

router.patch('/:id', (req, res, next) => {
    const id = req.params.id;
    const data = req.body;
    const arr = Object.keys(data);
    
    for(var i=0; i<arr.length; i++) {
        var query = `UPDATE project SET ${arr[i]} = \$1 WHERE id = \$2`;
        pool.query(query, [data[arr[i]], id], (err, result) => {
            if(err){
                next(err);
            }
        })
    }
    res.status(200).json("Updated");
})

router.delete('/:id', (req, res, next) => {
    const id = parseInt(req.params.id);
        pool.query('DELETE FROM project WHERE id = $1', [id], (err, result) => {
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






module.exports = router;