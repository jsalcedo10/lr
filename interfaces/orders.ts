export interface IOrders {
    Id: number;
    name: string;
    CreatedAt: Date;
    UpdatedAt: Date;
    Order_Id: number;
    OrderDetail_Id: number;
    Company_Id: number;
    OrderType_Id: number;
    Product_Id: number;
    Product: string;
    Concept: string;
    ConceptSale: string;
    ConceptPurchase: string;
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
    Date: Date;
    OrderType: string;
    CompanyType: string
    Subsidiary: string;
    Company: string;
    CompanyType_Id : number;
    Currency : string;
    Carrier: string;
    Unit: string;
}