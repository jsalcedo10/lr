import type { NextApiRequest, NextApiResponse } from 'next';
import { RowDataPacket } from 'mysql2';
import { db } from '../../../database';
import { connect } from "../../../config/db"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const pool = await connect()
    switch (req.method) {
        case 'POST':
            return saveSales(req, res, pool)
        case 'PUT':
            return editSales(req, res, pool)
        case 'GET':
            try {
                return await getSales(req, res, pool);
            } catch (e: any) {
            }
    }
}

const getSales = async (req: NextApiRequest, res: NextApiResponse, pool: any) => {
    try {
        await pool?.connect();
        const { id = 0, ordertype_id = 0, isdefault = 0 } = req.query;

        const [rows] = await pool.query(`
        select 
        orders.id as Id,
        orders.UpdatedAt as UpdatedAt,
        ordersdetail.date as Date,
        ordertypes.ordertype as OrderType,
        companytypes.companytype as CompanyType,
        companies.company as Company,
        companies.subsidiary as Subsidiary,
        ordersdetail.iepsunit as IepsUnit,
        ordersdetail.vatunit as VatUnit,
        ordersdetail.quantity as Quantity,
        ordersdetail.vattotalunit as VatTotalUnit,
        ordersdetail.iepstotalunit as IepsTotalUnit,
        ordersdetail.totalunitprice as TotalUnitPrice,
        ordersdetail.charterquantityprice as CharterQuantityPrice,
        ordersdetail.totalbase as TotalBase,
        ordersdetail.vattotal as VatTotal,
        ordersdetail.iepstotal as IepsTotal,
        ordersdetail.total as Total,
        ordersdetail.unitbase as UnitBase,
        ordersdetail.vattotalunit as VatTotalUnit,
        ordersdetail.iepsunit as IepsUnit,
        ordersdetail.totalunitprice as TotalUnitPrice,
        (case when ordersdetail.conceptPurchase = '' then 'No Existe' else ordersdetail.conceptPurchase end) as ConceptPurchase,
        (case when ordersdetail.conceptSale = '' then 'No Existe' else ordersdetail.conceptSale end) as ConceptSale,
        companies.companytype_id as CompanyType_Id,
        ordersdetail.ordertype_id as OrderType_Id,
        currencies.currency as Currency,
        companies_carrier.company AS Carrier,
        companies_carrier.charter AS Charter,
        products.Product as Product,
        products.Unit as Unit
        from orders
        inner join ordersdetail on ordersdetail.order_id = orders.id
        inner join companies on companies.id = ordersdetail.Company_Id
        inner join companytypes on companytypes.id = companies.companytype_id
        inner join ordertypes on ordertypes.id = ordersdetail.OrderType_Id
        inner join currencies on currencies.id = ordersdetail.currency_id
        inner join products ON products.id = ordersdetail.Product_Id
        left join companies AS companies_carrier ON companies_carrier.id = ordersdetail.Carrier_Id
        where 
        orders.id = (case ${Number(id)} when 0 then orders.id else ${Number(id)} end) and
        ordersdetail.ordertype_id = (case ${ordertype_id} when 0 then ordersdetail.ordertype_id else ${ordertype_id} end) and
        orders.erasedat is null and
        ordertypes.isdefault = (case ${isdefault} when 0 then ordertypes.isdefault else ${isdefault} end)
        order by orders.createdat desc`);
        return res.status(200).json(rows);

    }
    finally {
        await pool?.end();

    }
}
const saveSales = async (req: NextApiRequest, res: NextApiResponse, pool: any) => {
    try {
        const {
            date,
            ordertype_id,
            name,
            product,
            currency,
            quantity,
            totalBaseUnitPrice,
            isPreview = false,
            TermsCondition,salesConcept,shipping

        } = req.body;

        let CharterQuantityPrice: number | null;

        if (shipping && quantity) {
            CharterQuantityPrice = parseFloat((shipping * quantity).toFixed(6));
        } else {
            CharterQuantityPrice = null;
        }

        if (isPreview) {
            await pool?.connect();
            const inputDate = date; //formato MM/DD/YYYY

            const [ordertype] = await pool.query(`
            SELECT OrderType
            FROM ordertypes   
            WHERE 
                erasedat IS NULL AND
                id = ?
        `, [ordertype_id]);

            const [company] = await pool.query(`
            SELECT Company, VAT,Type
            FROM companies   
            WHERE 
                erasedat IS NULL AND
                id = ?
        `, [name]);

            const [productname] = await pool.query(`
            SELECT Product, Unit, IEPS
            FROM products
            WHERE 
                erasedat IS NULL AND
                id = ?
        `, [product]);

            const vatPercentage = company?.[0].VAT;
            const productIEPS = productname?.[0].IEPS;
            const IEPSTotal: number = parseFloat((productIEPS / 100 * quantity).toFixed(6));
            const factor: number = parseFloat((1 + vatPercentage / 100).toFixed(6));
            const total: number = (parseFloat((totalBaseUnitPrice * quantity).toFixed(6)));
            const vatTotal: number = parseFloat((((total - IEPSTotal) / factor) * (vatPercentage / 100)).toFixed(6));
            const base: number = parseFloat(((total - IEPSTotal) / factor).toFixed(6));
            const unitBasePrice: number = parseFloat((base / quantity).toFixed(6));
            await pool?.end();
            return res.status(200).json({ calculation: { unitBasePrice, base, vatTotal, IEPSTotal, total } });

        }

        await pool?.connect();
        const inputDate = date; //formato MM/DD/YYYY
        const parsedDate = new Date(inputDate);
        const formattedDate = `${parsedDate.getFullYear()}-${(parsedDate.getMonth() + 1).toString().padStart(2, '0')}-${parsedDate.getDate().toString().padStart(2, '0')}`;

        

        const [ordertype] = await pool.query(`
            SELECT OrderType
            FROM ordertypes   
            WHERE 
                erasedat IS NULL AND
                id = ?
        `, [ordertype_id]);

        const [company] = await pool.query(`
            SELECT Company, VAT,Type
            FROM companies   
            WHERE 
                erasedat IS NULL AND
                id = ?
        `, [name]);

        const [productname] = await pool.query(`
            SELECT Product, Unit, IEPS
            FROM products
            WHERE 
                erasedat IS NULL AND
                id = ?
        `, [product]);


        const orderType = ordertype?.[0]?.OrderType;
        const companyName = company?.[0].Company;
        const companyType = company?.[0].Type;
        const vatPercentage = company?.[0].VAT;
        // const productName = productname?.[0].Product;
        const productUnit = productname?.[0].Unit;
        const productIEPS = productname?.[0].IEPS;
        // const shippingCost: number = parseFloat((shipping * quantity).toFixed(6));
        const IEPSTotal: number = parseFloat((productIEPS / 100 * quantity).toFixed(6));
        const factor: number = parseFloat((1 + vatPercentage / 100).toFixed(6));
        const total: number = parseFloat((totalBaseUnitPrice * quantity).toFixed(6));
        const vatTotal: number = parseFloat((((total - IEPSTotal) / factor) * (vatPercentage / 100)).toFixed(6));
        const base: number = parseFloat(((total - IEPSTotal) / factor).toFixed(6));
        const unitBasePrice: number = parseFloat((base / quantity).toFixed(6));
        const vatPercentageSale: number = parseFloat((base * (vatPercentage / 100)).toFixed(6));
        const iepsPercentageSale: number = parseFloat((IEPSTotal / quantity).toFixed(6));
        const vatTotalUnit: number = parseFloat((vatTotal / quantity).toFixed(6));

        
        // Insertar en la tabla orders
        const insertOrderSql = `
           INSERT INTO orders
           (Id, ErasedAt)
           VALUES (NULL, NULL)
       `;
        const [orderResult] = await pool.query(insertOrderSql);
        const sql = `
            INSERT INTO ordersdetail
            ( Order_Id, Company_Id,OrderType_Id, Product_Id,quantity, 
                UnitBase,VatUnit,IepsUnit,VatTotalUnit,IepsTotalUnit, 
                TotalUnitPrice,VatTotal,IepsTotal,TotalBase, Total, 
                Date,Currency_Id, TermsCondition,ConceptSale,CharterQuantityPrice)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?,?,?)
        `;

console.log("Order_Id:", orderResult.insertId);
console.log("Company_Id:", name);
console.log("OrderType_Id:", ordertype_id);
console.log("Product_Id:", product);
console.log("Quantity:", quantity);
console.log("UnitBase:", unitBasePrice);
console.log("VatUnit:", vatPercentage);
console.log("IepsUnit:", iepsPercentageSale);
console.log("VatTotalUnit:", vatTotalUnit);
console.log("IepsTotalUnit:", productIEPS);
console.log("TotalUnitPrice:", totalBaseUnitPrice);
console.log("VatTotal:", vatTotal);
console.log("IepsTotal:", IEPSTotal);
console.log("TotalBase:", base);
console.log("Total:", total);
console.log("Date:", formattedDate);
console.log("Currency_Id:", currency);
console.log("TermsCondition:", TermsCondition);
console.log("ConceptSale:", salesConcept);

console.log("CharterQuantityPrice:", CharterQuantityPrice);

        const [result] = await pool.query(sql, [
            orderResult.insertId, // Order_Id: Id de la orden recién insertada en la tabla orders
            name,
            ordertype_id,
            product,
            quantity,
            unitBasePrice,
            vatPercentage,//vat unit
            iepsPercentageSale,//ieps unit
            vatTotalUnit, //vat unit
            productIEPS,
            totalBaseUnitPrice,
            vatTotal,//vat total unit
            IEPSTotal,
            base,
            total,
            formattedDate,
            currency,
            TermsCondition,
            salesConcept,
            CharterQuantityPrice
        ]);
        if (result.affectedRows > 0) {
            return res.status(200).json({ message: 'Orden registrada correctamente' });
        } else {
            return res.status(500).json({ message: 'Error al registrar la orden' });
        }
    } finally {
        await pool?.end();
    }
};

const editSales = async (req: NextApiRequest, res: NextApiResponse, pool: any) => {
    try {
        await pool?.connect();

        const { id, isBulk = false, bulkList = [] } = req.body;

        if (isBulk) {

            const [rows] = await pool.query("update orders set ErasedAt = ? where id in (?)", [new Date(), bulkList]);
            return res.status(200).json(rows);
        }
        else {
            const [rows] = await pool.query("update orders set ? where id = ?", [req.body, id]);
            return res.status(200).json(rows);
        }
    }
    finally {
        await pool?.end();

    }
}