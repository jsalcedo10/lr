import type { NextApiRequest, NextApiResponse } from 'next';
import { RowDataPacket } from 'mysql2';
import { db } from '../../../database';
import { connect } from "../../../config/db"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const pool = await connect()
    switch (req.method) {
        case 'POST':
            return saveOrderTypes(req, res, pool)
        case 'PUT':
            return editOrderTypes(req, res, pool)
        case 'GET':
            try {
                return await getOrderTypes(req, res, pool);
            } catch (e: any) {
            }
    }
}

const getOrderTypes = async (req: NextApiRequest, res: NextApiResponse, pool: any) => {
    try {
        await pool?.connect();

        const { id = 0, isdefault = 0 } = req.query;

        const [rows] = await pool.query(`
        select * from ordertypes 
        where 
        id = (case ${id} when 0 then ordertypes.id else ${id} end) and
        isdefault = (case ${isdefault} when 0 then ordertypes.isdefault else ${isdefault} end) and
        erasedat is null
        order by createdat desc`);
        return res.status(200).json(rows);

    }
    finally {
        await pool?.end();

    }
}

const saveOrderTypes = async (req: NextApiRequest, res: NextApiResponse, pool: any) => {
    try {
        await pool?.connect();

        const [rows] = await pool.query("insert into ordertypes set ?", [req.body]);
        return res.status(200).json(rows);

    }
    finally {
        await pool?.end();

    }
}

const editOrderTypes = async (req: NextApiRequest, res: NextApiResponse, pool: any) => {
    try {
        await pool?.connect();

        const { id, isBulk = false, bulkList = [] } = req.body;

        if (isBulk) {

            const [rows] = await pool.query("update ordertypes set ErasedAt = ? where id in (?)", [new Date(), bulkList]);
            return res.status(200).json(rows);
        }
        else {
            const [rows] = await pool.query("update ordertypes set ? where id = ?", [req.body, id]);
            return res.status(200).json(rows);
        }
    }
    finally {
        await pool?.end();

    }
}