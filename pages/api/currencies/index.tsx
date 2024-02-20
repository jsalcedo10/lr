import type { NextApiRequest, NextApiResponse } from 'next';
import { RowDataPacket } from 'mysql2';
import { db } from '../../../database';
import { connect } from "../../../config/db"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const pool = await connect()
    switch (req.method) {
        case 'POST':
            return saveCurrencies(req, res, pool)
        case 'PUT':
            return editCurrencies(req, res, pool)
        case 'GET':
            try {
                return await getCurrencies(req, res, pool);
            } catch (e: any) {
            }
    }
}

const getCurrencies = async (req: NextApiRequest, res: NextApiResponse, pool: any) => {
    try {
        await pool?.connect();

        const { id = 0 } = req.query;

        const [rows] = await pool.query(`
        select * from currencies 
        where id = (case ${id} when 0 then currencies.id else ${id} end) and
        erasedat is null
        order by createdat desc`);
        return res.status(200).json(rows);

    }
    finally {
        await pool?.end();

    }
}

const saveCurrencies = async (req: NextApiRequest, res: NextApiResponse, pool: any) => {
    try {
        await pool?.connect();

        const [rows] = await pool.query("insert into currencies set ?", [req.body]);
        return res.status(200).json(rows);

    }
    finally {
        await pool?.end();

    }
}

const editCurrencies = async (req: NextApiRequest, res: NextApiResponse, pool: any) => {
    try {
        await pool?.connect();

        const { id, isBulk = false, bulkList = [] } = req.body;

        if (isBulk) {

            const [rows] = await pool.query("update currencies set ErasedAt = ? where id in (?)", [new Date(), bulkList]);
            return res.status(200).json(rows);
        }
        else {
            const [rows] = await pool.query("update currencies set ? where id = ?", [req.body, id]);
            return res.status(200).json(rows);
        }
    }
    finally {
        await pool?.end();

    }
}