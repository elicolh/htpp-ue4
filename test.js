const mysql = require("mysql")
var pool = mysql.createPool({
    host: 'localhost',
    user: 'authenconnect',
    password: 'elicolelo',
    database: 'account'
});
var connection = await new Promise(function(resolve,reject){
    pool.getConnection(function(erreur, conn){
        resolve(conn)
    })
})


setInterval(function(){
    var reponse = await newQuery("SELECT pseudo from table")
    console.log(reponse.pseudo)
    try{
        var pseudo = reponse.pseudo
    }catch{
        var pseudo = null
    }
    if(pseudo){
        
    }
},5000)



function newQuery(query){
    return new Promise(function(resolve,reject){
        connection.query(query,function(error,result){
            resolve(result)
        })
    })
}