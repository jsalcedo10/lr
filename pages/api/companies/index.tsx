import type { NextApiRequest, NextApiResponse } from 'next';
import { RowDataPacket } from 'mysql2';
import { db } from '../../../database';
import { connect } from "../../../config/db"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const pool = await connect()
    switch (req.method) {
        case 'POST':
            return saveCompanies(req, res, pool)
        case 'PUT':
            return editCompanies(req, res, pool)
        case 'GET':
            try {
                return await getCompanies(req, res, pool);
            } catch (e: any) {
            }
    }
}

const getCompanies = async (req: NextApiRequest, res: NextApiResponse, pool: any) => {
    try {
        await pool?.connect();

        const { id = 0, companytype_id = 0 } = req.query;

        const [rows] = await pool.query(`
        select companies.*, companytypes.companytype as CompanyType 
        from companies 
        inner join companytypes on companytypes.id = companies.companytype_id
        where 
        companies.id = (case ${id} when 0 then companies.id else ${id} end) and
        companies.companytype_id = (case ${companytype_id} when 0 then companies.companytype_id else ${companytype_id} end) and
        companies.erasedat is null
        order by companies.createdat desc`);
        return res.status(200).json(rows);

    }
    finally {
        await pool?.end();

    }
}

const saveCompanies = async (req: NextApiRequest, res: NextApiResponse, pool: any) => {
    try {
        await pool?.connect();

        const [rows] = await pool.query("insert into companies set ?", [req.body]);
        return res.status(200).json(rows);

    }
    finally {
        await pool?.end();

    }
}

const editCompanies = async (req: NextApiRequest, res: NextApiResponse, pool: any) => {
    try {
        await pool?.connect();

        const { id, isBulk = false, bulkList = [] } = req.body;

        if (isBulk) {

            const [rows] = await pool.query("update companies set ErasedAt = ? where id in (?)", [new Date(), bulkList]);
            return res.status(200).json(rows);
        }
        else {
            const [rows] = await pool.query("update companies set ? where id = ?", [req.body, id]);
            return res.status(200).json(rows);
        }
    }
    finally {
        await pool?.end();

    }
}