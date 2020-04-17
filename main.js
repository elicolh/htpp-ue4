const mysql = require("mysql")      
const express = require("express")
const bodyParser = require("body-parser")
var exec = require('child_process').execFile;
const serv = express()
    serv.use(express.static("public"))
    serv.use(bodyParser.json())
    serv.use(bodyParser.urlencoded({ extended: true }))
var connection = mysql.createConnection({//on crée une nvl connection a la DB
    host: 'localhost',
    user: 'authenconnect',
    password: 'elicolelo',
    database: 'account'
});
serv.post("/",async function(request,resolve){
    console.log("nvle requete")
    connection.connect()//init de la connection a la base sql
    var result = await newQuery(`SELECT idaccount FROM account WHERE username = '${req.body.pseudo}' AND password = '${req.body.password}'`)
    try{var idaccount = result.idaccount}
    catch{
        console.log("---------------mauvaise connection---------------")
        console.log(req.body)
        response.json({port:0})
        return
    }
    await newQuery(`UPDATE account SET deviceid = '${req.body.Deviceid}' WHERE idaccount = '${idaccount}'`)
    result = await newQuery(`SELECT idTeam FROM account WHERE idaccount = '${idaccount}'`)
    try{var idTeam = result}
    catch{
        console.log("PAS DANS UNE TEAM")
        response.json({port:-1})
        return
    }
    console.log(`idTeam renvoyé :${idTeam}`)
    result = await newQuery(`SELECT sessionport FROM team WHERE idTeam = '${idTeam}'`)
    try{
        var sessionport = result.sessionport
        response.json({ port: sessionport })
    }
    catch{
        result = await newQuery("SELECT port FROM port WHERE idTeam IS NULL LIMIT 1;")
        try{
            var port = result[0].port || result[0].port[0]
        }catch{
            console.log("la query a pas retourné de port libre")
            response.json({port:-2})
        }
        console.log("lancement du .exe")
        exec(__dirname + "/startSession.bat", [port])
        response.json({port:port})
        await newQuery(`UPDATE team SET sessionport = ${port} WHERE idTeam = ${idTeam};`)
        await newQuery(`UPDATE port SET idTeam = ${idTeam} WHERE port = ${port};`)
    }
})

serv.listen(6999, function () {//on lance l'écoute du serv
    console.log('listening on port 6999')
})
function newQuery(query){
    return new Promise((resolve,reject)=>{
        connection.query(query,(error,results,field)=>{
            if(error) throw error
            resolve(results[0])
        })
    })
}