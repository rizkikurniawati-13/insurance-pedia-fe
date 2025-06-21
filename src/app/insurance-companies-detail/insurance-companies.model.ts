export interface InsuranceCompaniesModel{
    id: string;
    name: string;
    type:string;
    address: string;
    contact: string;
    npwp: string;
    licenseNumber: string;
    establishedDate: Date;
    status: string;
    products: ProductsModel[];
    createdBy: string;
    createdDate: Date;
    lastModifiedBy: string;
    lastModifiedDate: Date;
}


export interface ProductsModel{
    id: string;
    name: string;
    productCategory: ProductCategoriesModel;
    createdBy: string;
    createdDate: Date;
    lastModifiedBy: string;
    lastModifiedDate: Date;
}

export interface ProductCategoriesModel{
    id: string;
    name: string;
    products: ProductsModel[];
    createdBy: string;
    createdDate: Date;
    lastModifiedBy: string;
    lastModifiedDate: Date;
}