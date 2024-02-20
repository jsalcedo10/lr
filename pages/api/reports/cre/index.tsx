import type { NextApiRequest, NextApiResponse } from 'next';
import { RowDataPacket } from 'mysql2';
import { connect } from "../../../../config/db"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const pool = await connect()
    switch (req.method) {
        case 'GET':
            try {
                return await getCRE(req, res, pool);
            } catch (e: any) { }
    }
}

const getCRE = async (req: NextApiRequest, res: NextApiResponse, pool: any) => {
    try {
        await pool?.connect();

        const { id = 0, StartDate, EndDate, Sale } = req.query;

        const [rows] = await pool.query(`
        select ordersdetail.*,
        DATE_FORMAT(ordersdetail.date,'%d/%m/%Y') as date,
        ordertypes.ordertype as OrderType,
        companytypes.companytype as CompanyType,
        companies.state, 
        companies.town, 
        companies.rfc,
        companies.type,
        companies.turn,
        companies.vat,
        companies.subsidiary,
        companies.company,
        companies.charter,
        products.product

        from orders 

        inner join ordersdetail on ordersdetail.order_id = orders.id
        inner join ordertypes on ordertypes.id = ordersdetail.ordertype_id
        inner join companies on companies.id = ordersdetail.company_id
        inner join companytypes on companytypes.id = companies.companytype_id
        inner join products on products.id = ordersdetail.product_id

        where
        ordertypes.isdefault = 1 and 
        ordersdetail.concept = (case when '${Sale}' = 'Todos' then ordersdetail.concept else '${Sale}' end) and
        ordersdetail.date between '${StartDate}' and '${EndDate}'`);

        return res.status(200).json(rows);

    }
    finally {
        await pool?.end();

    }
}