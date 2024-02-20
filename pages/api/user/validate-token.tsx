import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import  {db}  from '../../../database';
import { jwt } from '../../../utils';
import { RowDataPacket } from 'mysql2';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import {connect} from "../../../config/db"

type Data = 
| { message: string }
| {
    token: string;
    user: {
        Id: string;
        Email: string;
        Name: string;
        IsAdmin : number;
        isLoggedIn : boolean;
    }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    const pool=await connect()
    switch( req.method ) {
        case 'GET':
            try {
                return checkJWT(req, res,pool)
            } catch (e:any) {
                console.log(e.message);
               }

        // default:
        //     res.status(400).json({
        //         message: 'Bad request'
        //     })
    }
}

const checkJWT = async(req: NextApiRequest, res: NextApiResponse<Data>,pool:any) => {
    //await db.connect();
    const { token = '' } = req.cookies;
    //const { id } = req.query;

    let userId = '';

    try {
        userId = await jwt.isValidToken( token );

    } catch (error) {
        Cookies.remove('token');

        return res.status(401).json({
            message: 'Token not valid'
        })   
    }
    
    const id = parseInt(userId)
    await pool?.connect();
    const [rows] = await pool.execute(`SELECT user.*, (CASE WHEN user.IsAdmin = true THEN 1 ELSE 0 END) as IsAdmin FROM user WHERE Id = ${id};`);
      //setTimeout(function(){
      // pool?.end();
      //}, 2000);   
    const Name = ((rows as RowDataPacket[])[0].UserName); 
    const Id = ((rows as RowDataPacket[])[0].Id); 
    const IsAdmin = ((rows as RowDataPacket[])[0].IsAdmin); 
    const Email = ((rows as RowDataPacket[])[0].Email); 

    const isLoggedIn = true;
    if ( !Name ) {
        //await db.disconnect();
        //await pool?.end();
        await pool?.end();
        return res.status(400).json({ message: 'User not exist' })
    }
    //await db.disconnect();
    await pool?.end();
    return res.status(200).json({
        token, 
        user: {
            Id, 
            Email,
            Name, 
            IsAdmin,
            isLoggedIn
        }
    })


}
