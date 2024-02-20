export interface IOrdersDetail {
    Id: number;
    Order_Id: number;
    Company_Id: number;
    OrderType_Id: number;
    Product_Id: number;
    ConceptPurchase: string;
    ConceptSale: string;
    Quantity: number;
    Charter: number;
    CharterQuantityPrice: number;
    UnitBase: number;
    VatUnit: number;
    IepsUnit: number;
    VatTotalUnit: number;
    IepsTotalUnit: number;
    TotalUnitPrice: number;
    VatTotal: number;
    IepsTotal: number;
    TotalBase: number;
    Total: number;
    Date : Date;
    OrderType : string;
    CompanyType : string
}