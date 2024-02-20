import type { NextApiRequest, NextApiResponse } from 'next';
import { RowDataPacket } from 'mysql2';
import { connect } from "../../../../config/db"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const pool = await connect()
    switch (req.method) {
        case 'GET':
            try {
                return await getInventory(req, res, pool);
            } catch (e: any) { }
    }
}

const getInventory = async (req: NextApiRequest, res: NextApiResponse, pool: any) => {
    try {
        await pool?.connect();

        const { id = 0, StartDate, EndDate, Sale, CompanyType, Company } = req.query;

        const [rows] = await pool.query(`
        select sales.*,
        ordertypes.ordertype as OrderType,
        companytypes.companytype as CompanyType

        from sales 
        
        inner join ordertypes on ordertypes.id = sales.ordertype_id
        inner join companytypes on companytypes.id = sales.companytype_id

        where
        sales.createdat between '${StartDate}' and '${EndDate}'`);
        return res.status(200).json(rows);

    }
    finally {
        await pool?.end();

    }
}