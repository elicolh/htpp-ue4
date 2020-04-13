const mysql = require("mysql")
const express = require("express")
const bodyParser = require("body-parser")
const serv = express()
    serv.use(express.static("public"))
    serv.use(bodyParser.json())
    serv.use(bodyParser.urlencoded({extended: true}))

/*serv.post("localhost:5678",(req,res)=>{
    connection.query(`SELECT idaccount FROM account WHERE username = '${pseudo}' AND password = '${password}'` , 
    function (error, results, fields) {
        if (error) throw error;
        // res.json({ok:})
    });
    connection.end();
})
"SELECT idaccount FROM account WHERE username = 'server' AND password = 'a66a8e9b1cf6d2032724c37305b83cdda18c904e';"*/
serv.post("/",(req,res)=>{//si on a une requete de type POST au sous domaine "/" 
    var connection = mysql.createConnection({//on crée une nvl connection a la DB
        host     : 'localhost',
        user     : 'authenconnect',
        password : 'elicolelo',
        database : 'account'
    });
    connection.connect()//init de la connection a la base sql
    connection.query(`SELECT idaccount FROM account WHERE username = '${req.body.pseudo}' AND password = '${req.body.password}'`,//l'objet req.body contient les arguments de la requete (pseudo password et deviceid)
    function (error, results, fields) {//reponse de la query
    if (error) throw error;//si reponse mal passée on arrete le programme et on print l'erreur
        if(results[0].idaccount){//si la query a retourné un id : le mdp est correct
            res.json({ID:1})//on repond a la requete
            console.log(req.body)
            connection.query(`UPDATE account SET deviceid = '${req.body.deviceid}' WHERE idaccount = '${results[0].idaccount}'`,
            function(err,results,fields){//réponse de la 2e query
                if(err) throw err//si reponse mal passée on arrete le programme et on print l'erreur
            })
            connection.end()//on ferme la nvle connection
        }else{//si la query a rien retourné : le mdp est faux
            res.json({ID:0})//on reponds a la requete
        }
    });
})
serv.listen(5678, function () {//on lance l'écoute du serv
    console.log('listening on port 5678')
})



// serv.post("/",(req,res)=>{//si on a une requete de type POST au sous domaine "/" 
//     var connection = mysql.createConnection({//on crée une nvl connection a la DB
//         host     : 'localhost',
//         user     : 'authenconnect',
//         password : 'elicolelo',
//         database : 'account'
//     });
//     connection.connect()//init de la connection a la base sql
//     connection.query(`SELECT idaccount FROM account WHERE username = '${req.body.pseudo}' AND password = '${req.body.password}'`,//l'objet req.body contient les arguments de la requete (pseudo password et deviceid)
//     function (error, results, fields) {//reponse de la query
//         if (error) throw error;//si reponse mal passée on arrete le programme et on print l'erreur
//         connection.end((err)=>{//une fois la connection fermée:
//             if (err) throw err;//si la fermuture s'est mal pasée on arrete le programme et on print l'erreur
//             if(results[0].idaccount){//si la query a retourné un id : le mdp est correct
//                 res.json({ID:1})//on repond a la requete
//                 connection.connect()//on ouvre une nvle connection
//                 connection.query(`UPDATE account SET deviceid = '${req.body.deviceid}' WHERE idaccount = '${results[0].idaccount}'`,
//                 function(err,results,fields){//réponse de la 2e query
//                     if(err) throw err//si reponse mal passée on arrete le programme et on print l'erreur
//                 })
//                 connection.end()//on ferme la nvle connection
//             }else{//si la query a rien retourné : le mdp est faux
//                 res.json({ID:0})//on reponds a la requete
//             }
//         });
//     });
// })