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
    link: string;
    products: ProductsModel[];
    risks : RiskModel[];
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

export interface RiskModel{
    id: string;
    name: string;
    type: string;
    cause: string;
    impact: string;
    mitigation: string;
}

export interface PageableCompanyResponse {
  totalItems: number;
  data: InsuranceCompaniesModel[];
  totalPages: number;
  currentPage: number;
}
