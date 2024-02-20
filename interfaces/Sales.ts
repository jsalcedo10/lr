export interface ISales {
    id: number;
    date: string;
    orderType: string;
    companyType: string;
    name: string;
    subsidiary: string;
    charter: string;
    currency: string;
    branch: string;
    salesConcept: string;
    purchaseConcept: string;
    product: string;
    iepsPercentage: number;
    vatPercentage: number;
    quantity: number;
    baseUnitPrice: number;
    totalBaseUnitPrice:number;
    vatPercentageSale: number;
    iepsPercentageSale: number;
    totalUnitPrice: number;
    unit: number;
    base: number;
    vatPercentagePurchase: number;
    iepsPercentagePurchase: number;
    total: number;
    carrier: string;
    shipping: number;
    shippingCost: number;
    createdAt: Date;
    ordertype_id : number;
    companytype_id : number;
    TermsCondition : string;


}
