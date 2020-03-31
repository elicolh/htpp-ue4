const mysql = require("mysql")
const express = require("express")
const bodyParser = require("body-parser")
const serv = express()
    serv.use(express.static("public"))
    serv.use(bodyParser.json())
    app.use(bodyParser.urlencoded({extended: true}))

// app.post("localhost:5678",(req,res)=>{
//     connection.query(`SELECT idaccount FROM account WHERE username = '${pseudo}' AND password = '${password}'` , 
//     function (error, results, fields) {
//         if (error) throw error;
//         // res.json({ok:})
//     });
//     connection.end();
// })

app.get("localhost:5678",(req,res)=>{
    connection.query(`SELECT idaccount FROM account WHERE username = '${pseudo}' AND password = '${password}'` , 
    function (error, results, fields) {
        if (error) throw error;
        res.json(results)
    });
    connection.end();
})

var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'authenconnect',
    password : 'elicolelo',
    database : 'account'
});