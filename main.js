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
// "SELECT idaccount FROM account WHERE username = 'server' AND password = 'a66a8e9b1cf6d2032724c37305b83cdda18c904e';"
serv.post("/",(req,res)=>{
    var connection = mysql.createConnection({
        host     : 'localhost',
        user     : 'authenconnect',
        password : 'elicolelo',
        database : 'account'
    });
    connection.connect()
    connection.query(`SELECT idaccount FROM account WHERE username = '${req.body.pseudo}' AND password = '${req.body.password}'`, 
    function (error, results, fields) {
        if (error) throw error;
        try{
            var nb = results[0].idaccount
        }catch{
            var nb = 0
        }
        res.json({ID:nb})
        connection.end();
        // console.log("pseudo : " + req.body.pseudo)
        // console.log('mdp : ' + req.body.password)
        // console.log(`SELECT idaccount FROM account WHERE username = '${req.body.pseudo}' AND password = '${req.body.password}'`)
        // console.log(results)
        // console.log(JSON.stringify({ID:nb}))
    });
})
serv.listen(5678, function () {
    console.log('listening on port 5678')
  })