const mysql = require('mysql2');

const pool = mysql.createPool({
    host: "mysql5045.site4now.net",
    user: "a7af99_chase",
    password: "Devise2021#",
    port: 3306,
    database: "db_a7af99_chase",
});

exports.view = (req, res) => {

        pool.getConnection((err, connection)=>{
                if(!err)
                {
                    console.log("SE LOGRO LA CONEXION")
                }
                else
                {
                    console.log("FALLO LA CONEXION")
                }

                let post = "SELECT * FROM entity";

                connection.query(post, (err, rows)=>{
                    
                connection.release();

                if(!err)
                {
                res.render('clients', {rows});
                }
                else
                {
                    console.log(err);
                }

                console.log('The data from entity table: \n', rows)

            });
        
        });
}

exports.find = (req, res) => {

        pool.getConnection((err, connection)=>{
            if(!err)
            {
                console.log("SE LOGRO LA CONEXION")
            }
            else
            {
                console.log("FALLO LA CONEXION")
            }
            debugger;
            let name = req.body.name;
            let legalCompanyName = req.body.legalCompanyName;


            let post = "INSERT INTO entity SET Name = ?, LegalCompanyName = ?, Active = ?, RegistrationNumber = ?";

            connection.query(post, [name, legalCompanyName, 1, "000002"], (err, rows)=>{

            connection.release();

            if(!err)
            {
            res.render('clients', {rows});
            }
            else
            {
                console.log(err);
            }

            console.log('The data from entity table: \n', rows)

        });

    });

}

exports.form = (req, res) => {

        pool.getConnection((err, connection)=>{

            const {Name, legalCompanyName} = req.body;

            if(!err)
            {
                console.log("SE LOGRO LA CONEXION")
            }
            else
            {
                console.log("FALLO LA CONEXION")
            }

            let post = "INSERT INTO entity SET Name = ?, LegalCompanyName = ?, Active = ?, RegistrationNumber = ?";

            connection.query(post, [Name, legalCompanyName, 1, "000002"], (err, rows)=>{

            connection.release();

            if(!err)
            {
            res.render('clients', {rows});
            }
            else
            {
                console.log(err);
            }

            console.log('The data from entity table: \n', rows)

        });

    });
}

exports.create = (req, res) => {

    pool.getConnection((err, connection)=>{

        const {Name, legalCompanyName} = req.body;

        if(!err)
        {
            console.log("SE LOGRO LA CONEXION")
        }
        else
        {
            console.log("FALLO LA CONEXION")
        }

        let post = "INSERT INTO entity SET Name = ?, LegalCompanyName = ?, Active = ?, RegistrationNumber = ?";

        connection.query(post, [Name, legalCompanyName, 1, "000002"], (err, rows)=>{

        connection.release();

        if(!err)
        {
        res.render('clients', {rows});
        }
        else
        {
            console.log(err);
        }

        console.log('The data from entity table: \n', rows)

    });

});
}