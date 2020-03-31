const mysql = require("mysql")
const express = require("express")
const bodyParser = require("body-parser")
const serv = express()
    serv.use(express.static("public"))
    serv.use(bodyParser.json())
    serv.use(bodyParser.urlencoded({extended: true}))

// serv.post("localhost:5678",(req,res)=>{
//     connection.query(`SELECT idaccount FROM account WHERE username = '${pseudo}' AND password = '${password}'` , 
//     function (error, results, fields) {
//         if (error) throw error;
//         // res.json({ok:})
//     });
//     connection.end();
// })

serv.get("/",(req,res)=>{
    connection.query(`SELECT idaccount FROM account WHERE username = '${pseudo}' AND password = '${password}'` , 
    function (error, results, fields) {
        if (error) throw error;
        res.json(results)
    });
    connection.end();
})
serv.listen(5678, function () {
    console.log('listening on port 3000')
  })

var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'authenconnect',
    password : 'elicolelo',
    database : 'account'
});