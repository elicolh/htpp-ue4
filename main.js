const mysql = require("mysql")
const express = require("express")
const bodyParser = require("body-parser")
var exec = require('child_process').execFile;
const serv = express()
    serv.use(express.static("public"))
    serv.use(bodyParser.json())
    serv.use(bodyParser.urlencoded({extended: true}))
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
    try{
        var idaccount = results[0].idaccount
    }catch{
        var idaccount = false
        console.log("---------------mauvaise connection---------------")
        console.log(req.body)
    }
        if(idaccount){//si la query a retourné un id : le mdp est correct
            connection.query(`SELECT idTeam FROM account WHERE idaccount = '${idaccount}'`,//renvoie l'id de la team
            function(err,res,f){
                if(err) throw err
                try{var idTeam = res[0].idTeam}
                    catch{var idTeam = false}
                    console.log("idTeam renvoyé : " + idTeam)
                    if(idTeam){//si le gars est dans une team
                    connection.query(`SELECT sessionport FROM team WHERE idTeam = '${idTeam}'`,//renvoie le port qui correspond à la team
                    function(e,r,fi){
                        if(e) throw e
                        try{var sessionport = r[0].sessionport}
                            catch{var sessionport = false}
                        console.log("sessionport renvoyé : " + sessionport)
                        if(sessionport){//si un port lui est attribué => session déjà lancée
                            res.json({port:sessionport})//on repond a la requete avec le port correspondant à sa team
                        }else{
                            connection.query("SELECT port FROM port WHERE idTeam IS  NULL LIMIT 1;",
                            function(erreur, resultats, champs){
                                if(erreur) throw erreur
                                try{port = resultats[0].port || resultats[0].port[0] }
                                    catch{port = false}
                                console.log("port libre renvoyé : " + port)
                                if(port){
                                    console.log("on essaye de lancer le .exe")
                                    exec('E:\\Game\\WindowsNoEditor\\Dawn\\Binaries\\Win64\\DawnServer.exe',
                                        ['-log', `-port=${port}`]);//on lance le .exe
                                    connection.query(`UPDATE port SET idTeam =${idTeam}WHERE port = ${port}';`,
                                    function(erreur1,resultats1,fields1){
                                        if(erreur1)throw erreur1
                                    })
                                    res.json({port:port})//on répond au json avec le nouveau port
                                }else{
                                    console.error("la query a pas retourné de port sur lequel ouvrir la session")
                                    res.json({port:0})//code erreur
                                }
                            })
                        }
                    })
                }else{
                    console.log("PAS DANS UNE TEAM")//TODO: supporter ça
                }
            })
            console.log(req.body)
            connection.query(`UPDATE account SET deviceid = '${req.body.Deviceid}' WHERE idaccount = '${idaccount}'`,
            function(err,results,fields){//réponse de la 2e query
                if(err) throw err//si reponse mal passée on arrete le programme et on print l'erreur
            })
            connection.end()//on ferme la nvle connection
        }else{//si la query a rien retourné : le mdp est faux
            res.json({ID:0})//on reponds a la requete
        }
    });
})
serv.listen(6999, function () {//on lance l'écoute du serv
    console.log('listening on port 6999')
})