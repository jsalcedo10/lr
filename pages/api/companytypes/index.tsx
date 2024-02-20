import type { NextApiRequest, NextApiResponse } from 'next';
import { RowDataPacket } from 'mysql2';
import { db } from '../../../database';
import { connect } from "../../../config/db"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const pool = await connect()
    switch (req.method) {
        case 'POST':
            return saveCompanyTypes(req, res, pool)
        case 'PUT':
            return editCompanyTypes(req, res, pool)
        case 'GET':
            try {
                return await getCompanyTypes(req, res, pool);
            } catch (e: any) {
            }
    }
}

const getCompanyTypes = async (req: NextApiRequest, res: NextApiResponse, pool: any) => {
    try {
        await pool?.connect();

        const { id = 0 } = req.query;

        const [rows] = await pool.query(`
        select * from companytypes 
        where id = (case ${id} when 0 then companytypes.id else ${id} end) and
        erasedat is null
        order by createdat asc`);
        return res.status(200).json(rows);

    }
    finally {
        await pool?.end();

    }
}

const saveCompanyTypes = async (req: NextApiRequest, res: NextApiResponse, pool: any) => {
    try {
        await pool?.connect();

        const [rows] = await pool.query("insert into companytypes set ?", [req.body]);
        return res.status(200).json(rows);

    }
    finally {
        await pool?.end();

    }
}

const editCompanyTypes = async (req: NextApiRequest, res: NextApiResponse, pool: any) => {
    try {
        await pool?.connect();

        const { id, isBulk = false, bulkList = [] } = req.body;

        if (isBulk) {

            const [rows] = await pool.query("update companytypes set ErasedAt = ? where id in (?)", [new Date(), bulkList]);
            return res.status(200).json(rows);
        }
        else {
            const [rows] = await pool.query("update companytypes set ? where id = ?", [req.body, id]);
            return res.status(200).json(rows);
        }
    }
    finally {
        await pool?.end();

    }
}