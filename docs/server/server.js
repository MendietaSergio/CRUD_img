const express = require('express');
const app= express();
const mysql = require('mysql');
const myconn = require('express-myconnection');
const routes = require('./routes/routes');
const cors = require('cors');
//PARA CONECTAR LA BASE DE DATOS
app.use(myconn(mysql,{
    host:'localhost',
    port: 3306,
    user: 'root',
    password: "1234",
    database: 'images'
}))

app.use(cors());//para realizar peticiones desde el cliente 
app.use(routes)


app.listen(9000, ()=>{
    console.log("Server running on", "http://localhost:"+9000);
})

