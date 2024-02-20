import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../database';
import { jwt } from '../../../utils';
import { RowDataPacket } from 'mysql2';
import { connect } from "../../../config/db"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const pool = await connect()
    switch (req.method) {
        case 'POST':
            try {
                return loginUser(req, res, pool)
            } catch (e: any) {
                console.log(e.message);
            }
        case 'GET':
            try {
                return getUser(req, res, pool)
            } catch (e: any) {
                console.log(e.message);
            }

        // default:
        //     res.status(400).json({
        //         message: 'Bad request'
        //     })
    }
}

const getUser = async (req: NextApiRequest, res: NextApiResponse, pool: any) => {
    const { Email : email, Password } = req.body;
    try {
        await pool?.connect();

        const [rows] = await pool.execute(`SELECT user.*, (CASE user.IsAdmin WHEN true THEN 1 ELSE 0 END) as IsAdmin  FROM user where Email = '${email}' and Password = '${Password}';`);
        return res.status(200).json(rows);
    }
    finally {
        await pool?.end();

    }

    /*pool.getConnection().then(async function(connection) {
                        
        await connection.connect();
        const {UserName, Password} = req.body;
  
        const [result] = await connection.query(`SELECT user.*, (CASE user.IsAdmin WHEN true THEN 1 ELSE 0 END) as IsAdmin  FROM user where UserName = '${UserName}' and Password = '${Password}';`);
        connection.release();
        return res.status(200).json(result);
    });*/

}

const loginUser = async (req: NextApiRequest, res: NextApiResponse, pool: any) => {
    const { Email : email, Password } = req.body;
    try {
        await pool?.connect();

        const [rows] = await pool.execute(`SELECT user.*, (CASE user.IsAdmin WHEN true THEN 1 ELSE 0 END) AS IsAdmin, (CASE user.active WHEN true THEN 1 ELSE 0 END) AS Active FROM user WHERE Email = '${email}' AND Password = '${Password}' AND ErasedAt IS NULL;`);
        const user = ((rows as RowDataPacket[])[0]);

        if (!user) {
            return res.status(400).json({ message: [{spanish: 'Correo o Contraseña incorrectos.', english:'Correo o Contraseña incorrectos.'}] })
        }

        const active = ((rows as RowDataPacket[])[0].Active);
        if (active == 0) {
            return res.status(400).json({ message: [{spanish:'Usuario inactivo, contactar al administrador.',
             english:'Usuario inactivo, contactar al administrador.'}]})
        }

        const Id = ((rows as RowDataPacket[])[0].Id);
        const Name = ((rows as RowDataPacket[])[0].UserName);
        const IsAdmin = ((rows as RowDataPacket[])[0].IsAdmin);
        const Email = ((rows as RowDataPacket[])[0].Email);

        const token = jwt.signToken(Id, Email, IsAdmin);
        
        return res.status(200).json({
            token,
            user: {
                Id, Email, Name, IsAdmin
            }
        })
    }
    finally {
        await pool?.end();

    }


}

