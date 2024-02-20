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
        const { id = 0, ordertype_id = 0, isdefault = 0} = req.query;

        const [rows] = await pool.query(`
        select 
        orders.id as Id,
        ordersdetail.date as Date,
        ordertypes.ordertype as OrderType,
        companytypes.companytype as CompanyType,
        companies.company as Company,
        companies.subsidiary as Subsidiary,
        ordersdetail.iepsunit as IepsUnit,
        ordersdetail.vatunit as VatUnit,
        ordersdetail.quantity as Quantity,
        companies.charter as Charter,
        ordersdetail.vattotalunit as VatTotalUnit,
        ordersdetail.iepstotalunit as IepsTotalUnit,
        ordersdetail.totalunitprice as TotalUnitPrice,
        ordersdetail.totalbase as TotalBase,
        ordersdetail.vattotal as VatTotal,
        ordersdetail.iepstotal as IepsTotal,
        ordersdetail.total as Total,
        (case when ordersdetail.concept = '' then 'No Existe' else ordersdetail.concept end) as Concept,
        companies.companytype_id as CompanyType_Id,
        ordersdetail.ordertype_id as OrderType_Id,
        currencies.currency as Currency
        from orders
        inner join ordersdetail on ordersdetail.order_id = orders.id
        inner join companies on companies.id = ordersdetail.Company_Id
        inner join companytypes on companytypes.id = companies.companytype_id
        inner join ordertypes on ordertypes.id = ordersdetail.OrderType_Id
        inner join currencies on currencies.id = ordersdetail.currency_id
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

// const saveSales = async (req: NextApiRequest, res: NextApiResponse, pool: any) => {
//     try {
//         const { date , ordertype_id,name,subsidiary,carrier,charter,salesConcept,purchaseConcept,product,currency,quantity,shipping,totalBaseUnitPrice} = req.body;

//         await pool?.connect();
//         console.log('entro')
//       console.log(currency)
    
//        const [ordertype] = await pool.query(`
//        SELECT OrderType
//        FROM ordertypes   
//        WHERE 
//        erasedat is null and
//        id= ${ordertype_id} 
//       `);
//       const [company] = await pool.query(`
//       SELECT Company,VAT
//       FROM companies   
//       WHERE 
//       erasedat is null and
//       id= ${name} 
//      `);
//       const [productname] = await pool.query(`
//       SELECT Product,Unit,IEPS
//       FROM products
//       WHERE 
//       erasedat is null and
//       id= ${product} 
//      `);
//      const [currencyname] = await pool.query(`
//      SELECT Currency
//      FROM currencies
//      WHERE 
//      erasedat is null and
//      id= ${currency} 
//     `);

//       const orderType = ordertype?.[0]?.OrderType;
//       const companyName = company?.[0].Company;
//       const vatPercentage = company?.[0].VAT;
//       const productName = productname?.[0].Product;
//       const productUnit = productname?.[0].Unit;
//       const productIEPS = productname?.[0].IEPS;
//       const currencyName = currencyname?.[0].Currency;
//        console.log(date);
//        console.log(orderType);
//        console.log(companyName)
//        console.log(subsidiary);
//        console.log(carrier);
//        console.log(charter);
//        console.log(salesConcept);
//        console.log(purchaseConcept);
//        console.log(productName);
//        console.log(productUnit);
//        console.log(productIEPS);
//        console.log(vatPercentage);
//        console.log(currencyName);
//        console.log(quantity);
//        console.log(shipping);
//     //    console.log(shippingCost);
//        console.log(totalBaseUnitPrice);
//        const shippingCost=(shipping*quantity);
//        const IEPSTotal=((productIEPS/100)*quantity)
//     //    const baseUnit=(totalBaseUnitPrice-(productIEPS/100))-()
//     const factor =1+(vatPercentage/100);
//        const total= (totalBaseUnitPrice*quantity)
//        const vatTotal=(((total-IEPSTotal)/factor)*(vatPercentage/100));
//         const base= ((total-IEPSTotal)/factor);
//        console.log(shippingCost);
//        console.log(IEPSTotal);
//        console.log(total);
//        console.log(vatTotal);
//        console.log(base);

//         // const [rows] = await pool.query("insert into sales set ?", [req.body]);
//         // return res.status(200).json(rows);

//     }
//     finally {
//         await pool?.end();

//     }
// }
const saveSales = async (req: NextApiRequest, res: NextApiResponse, pool: any) => {
    try {
        const {
            date,
            ordertype_id,
            name,
            subsidiary,
            carrier,
            charter,
            salesConcept,
            purchaseConcept,
            product,
            currency,
            quantity,
            shipping,
            totalBaseUnitPrice
        } = req.body;

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

        const [currencyname] = await pool.query(`
            SELECT Currency
            FROM currencies
            WHERE 
                erasedat IS NULL AND
                id = ?
        `, [currency]);
        const orderType = ordertype?.[0]?.OrderType;
        const companyName = company?.[0].Company;
        const companyType = company?.[0].Type;
        const vatPercentage = company?.[0].VAT;
        const productName = productname?.[0].Product;
        const productUnit = productname?.[0].Unit;
        const productIEPS = productname?.[0].IEPS;
        const currencyName = currencyname?.[0].Currency;

        const shippingCost = shipping * quantity;
        const IEPSTotal = (productIEPS / 100) * quantity;
        const factor = 1 + vatPercentage / 100;
        const total = totalBaseUnitPrice * quantity;
        const vatTotal = (((total - IEPSTotal) / factor) * (vatPercentage / 100));
        const base = ((total - IEPSTotal) / factor);
        const unitBasePrice= (base/quantity)
        const vatPercentageSale=(base*(vatPercentage/100));
        const iepsPercentageSale=(IEPSTotal/quantity);

        const sql = `
            INSERT INTO sales
            (date, ordertype_id, companytype_id,name, branch, carrier, charter, salesConcept, purchaseConcept, product, iepsPercentage, currencyName, quantity, shipping, totalUnitPrice, shippingCost, iepsPercentagePurchase,vatPercentage, total, vatPercentagePurchase, base,unitBasePrice,vatPercentageSale,iepsPercentageSale)
            VALUES (?, ?, ?, ?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?,?,?)
        `;

        const [result] = await pool.query(sql, [
            formattedDate,
            ordertype_id,
            companyType,
            companyName,
            subsidiary,
            carrier,
            charter,
            salesConcept,
            purchaseConcept,
            product,
            productIEPS,
            currencyName,
            quantity,
            shipping,
            totalBaseUnitPrice,
            shippingCost,
            IEPSTotal,
            vatPercentage,
            total,
            vatTotal,
            base,
            unitBasePrice,
            vatPercentageSale,
            iepsPercentageSale
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