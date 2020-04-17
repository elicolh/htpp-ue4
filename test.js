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
    console.log(await newQuery("SELECT * from table"))
    if(a){
        
    }
},5000)



function newQuery(query){
    return new Promise(function(resolve,reject){
        connection.query(query,function(error,result){
            resolve(result)
        })
    })
}