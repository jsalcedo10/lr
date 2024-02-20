import type { NextApiRequest, NextApiResponse } from 'next';
import { RowDataPacket } from 'mysql2';
import { db } from '../../../database';
import { connect } from "../../../config/db"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const pool = await connect()
    switch (req.method) {
        case 'POST':
            return saveProducts(req, res, pool)
        case 'PUT':
            return editProducts(req, res, pool)
        case 'GET':
            try {
                return await getProducts(req, res, pool);
            } catch (e: any) {
            }
    }
}

const getProducts = async (req: NextApiRequest, res: NextApiResponse, pool: any) => {
    try {
        await pool?.connect();

        const { id = 0 } = req.query;

        const [rows] = await pool.query(`
        select * from products 
        where id = (case ${Number(id)} when 0 then products.id else ${Number(id)} end) and
        erasedat is null
        order by createdat desc`);
        return res.status(200).json(rows);

    }
    finally {
        await pool?.end();

    }
}

const saveProducts = async (req: NextApiRequest, res: NextApiResponse, pool: any) => {
    try {
        await pool?.connect();

        const [rows] = await pool.query("insert into products set ?", [req.body]);
        return res.status(200).json(rows);

    }
    finally {
        await pool?.end();

    }
}

const editProducts = async (req: NextApiRequest, res: NextApiResponse, pool: any) => {
    try {
        await pool?.connect();

        const { id, isBulk = false, bulkList = [] } = req.body;

        if (isBulk) {

            const [rows] = await pool.query("update products set ErasedAt = ? where id in (?)", [new Date(), bulkList]);
            return res.status(200).json(rows);
        }
        else {
            const [rows] = await pool.query("update products set ? where id = ?", [req.body, id]);
            return res.status(200).json(rows);
        }
    }
    finally {
        await pool?.end();

    }
}