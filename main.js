const bcrypt = require('bcrypt');//:flag_dz: :flag_dz: :flag_dz: :flag_dz: :flag_dz:
const mysql = require("mysql")      
const express = require("express")
const bodyParser = require("body-parser")
var exec = require('child_process').execFile;
require('colors')
const LAMUSQIUE = require("./CLAMUSIQUE/LAMUSIQUE")
const serv = express()
    serv.use(express.static("public"))
    serv.use(bodyParser.json())
    serv.use(bodyParser.urlencoded({ extended: true }))
var pool = mysql.createPool({//on crée une nvl connection a la DB
    host: 'localhost',
    user: 'authenconnect',
    password: 'elicolelo',
    database: 'account'
});
var connection;
serv.post("/",async function(request,response){
    console.log("nvle requete")
    // connection.connect()//init de la connection a la base sql
    connection = await getPoolConnection()
    var result = await newQuery(`SELECT password FROM account WHERE name = '${request.body.pseudo}';`)
    try{
        var password = result.password
    }catch{
        console.log("le compte existe pas")
        return
    }
    if (!await bcrypt.compare(request.body.password ,password))
        {
        console.log("---------------mauvais mdp---------------".red)
        console.log(request.body)
        response.json({port:0})
        }
    else //mdp correct
        {
        var id = await newQuery(`SELECT id FROM account WHERE name = '${request.body.pseudo}'`)
        await newQuery(`UPDATE account SET deviceid = '${request.body.Deviceid}' WHERE id = '${id}'`)
        result = await newQuery(`SELECT idTeam FROM account WHERE id = '${id}'`)
        try{var idTeam = result.idTeam}
        catch{
            console.log("PAS DANS UNE TEAM".red)
            response.json({port:-1})
            return
        }
        console.log(`idTeam renvoyé :${idTeam}`)
        result = await newQuery(`SELECT sessionport FROM team WHERE idTeam = '${idTeam}'`)
        try{
            var sessionport = result.sessionport
        }
        catch{
            var sessionport = null
        }
        if(sessionport){
            response.json({ port: sessionport })
            console.log(`port bien renvoyé en json : sessionport = ${sessionport}`)
        }else{
            result = await newQuery("SELECT port FROM port WHERE idTeam IS NULL LIMIT 1;")
            try{
                var port = result.port
            }catch{
                console.log("la query a pas retourné de port libre".red)
                response.json({port:-2})
                return
            }
            console.log(`lancement du .exe, port renvoyé = ${port}`)
            exec(__dirname + "/startSession.bat", [port])
            response.json({port:port})
            await newQuery(`UPDATE team SET sessionport = ${port} WHERE idTeam = ${idTeam};`)
            await newQuery(`UPDATE port SET idTeam = ${idTeam} WHERE port = ${port};`)
        }
        connection.destroy()
        }
})

serv.listen(6999, function () {//on lance l'écoute du serv
    console.log('listening on port 6999')
})
async function newQuery(query){
    return new Promise((resolve,reject)=>{
        connection.query(query,(error,results,field)=>{
            if(error) throw error
            resolve(results[0])
        })
    })
}
function getPoolConnection(){
    return new Promise((res,rej)=>{
        pool.getConnection((err,connection)=>{
            if(err) console.error(err.red)
            res(connection)
        })
    })
}