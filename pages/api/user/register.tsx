import { RowDataPacket } from 'mysql2';
import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../database';
import { jwt } from '../../../utils';
import { connect } from "../../../config/db"

type Data =
    | { message: string }
    | {
        token: string;
        user: {
            UserName: string;
            Password: string;
        }
    }

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const pool = await connect()
    switch (req.method) {
        case 'POST':
            return registerUser(req, res, pool)

        case 'GET':
            try {
                return getUser(req, res, pool)
            } catch (e: any) {
                console.log(e.message);
            }

        case 'PUT':
            return editUser(req, res, pool)

        case 'DELETE':
            return deleteUser(req, res, pool)

        // default:
        //     res.status(400).json({
        //         message: 'Bad request'
        //     })
    }
}

const getUser = async (req: NextApiRequest, res: NextApiResponse, pool: any) => {
    try {
        await pool?.connect();
        const { id = 0 } = req.query;

        const [rows] = await pool.query(`
        select user.*, (case user.isadmin when true then 1 else 0 end) as IsAdmin  from user 
        where id = (case ${id} when 0 then user.id else ${id} end) and
        erasedat is null
        order by createdat desc`);
        return res.status(200).json(rows);
    }
    finally {
        await pool?.end();

    }

    /*pool.getConnection().then(async function(connection) {
        await connection.connect();

        if(Id){
            const [user] = await connection.query(`SELECT user.*, position.Name as Position ,DATE_FORMAT(user.CreatedAt, '%m/%d/%Y %T') as CreatedAt, (CASE WHEN user.Active = true THEN 1 ELSE 0 END) as Active ,user.Department_Id as Department_Id ,department.Name as Department,(CASE user.IsAdmin WHEN true THEN 1 ELSE 0 END) as IsAdmin FROM user INNER JOIN department ON department.Id = user.Department_Id LEFT JOIN position ON position.Id = user.Position_Id WHERE user.ErasedAt is null and user.Id = ${Id} ORDER BY user.CreatedAt ASC;`);
            connection.release();
            return res.status(200).json(user);
        }
        const [user] = await connection.query(`SELECT user.*, position.Name as Position ,DATE_FORMAT(user.CreatedAt, '%m/%d/%Y %T') as CreatedAt,(CASE WHEN user.Active = true THEN 1 ELSE 0 END) as Active ,user.Department_Id as Department_Id ,department.Name as Department,(CASE user.IsAdmin WHEN true THEN 1 ELSE 0 END) as IsAdmin FROM user INNER JOIN department ON department.Id = user.Department_Id LEFT JOIN position ON position.Id = user.Position_Id WHERE user.ErasedAt is null AND (CASE WHEN ${Entity_Id} > 0 THEN user.Entity_Id = ${Entity_Id} ELSE user.Entity_Id END)  ORDER BY user.CreatedAt ASC;`);
        //await pool?.end();
        connection.release();
        return res.status(200).json(user);
    });*/

}

const registerUser = async (req: NextApiRequest, res: NextApiResponse, pool: any) => {

    const { UserName, Password, Email } = req.body;
    try {
        await pool?.connect();

        const [exist] = await pool.execute(`SELECT Email FROM user WHERE Email = '${Email}' and ErasedAt is null`);
        const user = ((exist as RowDataPacket[])[0]);

        if (user) {
            return res.status(200).json({ message: "Correo existente actualmente." })
        }

        const [rows] = await pool.query("INSERT INTO user SET ?", [req.body]);


        //const Id = ((user as RowDataPacket[])[0]);

        //const token = jwt.signToken( Id[0], UserName);
        return res.status(200).json(rows)
    }
    finally {
        await pool?.end();

    }

}

const editUser = async (req: NextApiRequest, res: NextApiResponse, pool: any) => {

    const { id, Email, isBulk = false, bulkList = [], Active, isDelete = false } = req.body;

    try {
        await pool?.connect();

        if (isBulk) {
            const result = await pool?.query("UPDATE user SET ErasedAt = ?, Active = false WHERE id in (?)", [new Date(), bulkList]);
            await pool?.end();
            return res.status(200).json(result);

        }
        else {

            const [exist] = await pool.execute(`SELECT Email FROM user WHERE Email = '${Email}' and id != ${id} and ErasedAt is null`);
            const user = ((exist as RowDataPacket[])[0]);

            if (user) {
                return res.status(200).json({ message: "Correo existente actualmente." })
            }

            const [result] = await pool.query("UPDATE user SET ? WHERE Id = ?", [req.body, id]);

            return res.status(200).json(result);
        }

    }
    finally {
        await pool?.end();

    }


}

const deleteUser = async (req: NextApiRequest, res: NextApiResponse, pool: any) => {
    const { Id } = req.body;
    try {
        await pool?.connect();

        const [result] = await pool.query(`UPDATE user SET ErasedAt = ? WHERE Id = ?`, [new Date(), Id]);
        return res.status(200).json(result);
    }
    finally {
        await pool?.end();

    }

}



