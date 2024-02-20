const express = require('express');
const exphbs = require('express-handlebar');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
debugger;

const app = express();

const port = process.env.port || 3000;

app.use(bodyParser.urlencoded({extended: false}));

app.use(bodyParser.json());

app.use(express.static('public'));

app.engine('tsx', exphbs({extname : '.tsx'}));

const pool = mysql.createPool({
    host: "mysql5045.site4now.net",
    user: "a7af99_chase",
    password: "Devise2021#",
    port: 3306,
    database: "db_a7af99_chase",
});

pool.getConnection((err, connecion)=>{
    if(!err)
    {
        console.log("SE LOGRO LA CONEXION")
    }
    else
    {
        console.log("FALLO LA CONEXION")
    }

});

const routes = require('.serverDB/routes/entity')

app.use('/', routes);

app.listen(port, () => console.log(`Listening on port${port}`));