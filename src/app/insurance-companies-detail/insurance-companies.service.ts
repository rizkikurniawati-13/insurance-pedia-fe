import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Observer } from 'rxjs';
import { InsuranceCompaniesModel, PageableCompanyResponse, ProductCategoriesModel, ProductsModel } from './insurance-companies.model';
import { environment } from '../../environment/environment.prod';

export interface Company {
  id?: string;
  name: string;
  type: string;
  address: string;
  contact: string;
  npwp: string;
  licenseNumber: string;
  establishedDate: Date;
  status: string;
}

@Injectable({
  providedIn: 'root'
})
export class InsuranceCompanyService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders(token ? { Authorization: `Bearer ${token}` } : {});
  }

  getAll(): Observable<Company[]> {
    return this.http.get<Company[]>(`${this.baseUrl}/companies`, { headers: this.getHeaders() });
  }

  getCompanyPageable(page: number = 1, size: number = 10, search: string = ''): Observable<PageableCompanyResponse> {
    const backendPage = page - 1;
    let url = `${this.baseUrl}/companies/pageable?page=${backendPage}&size=${size}`;
    if (search) {
      url += `&search=${encodeURIComponent(search)}`;
    }
    return this.http.get<PageableCompanyResponse>(url, { headers: this.getHeaders() });

  }

  create(data: Company): Observable<Company> {
    return this.http.post<Company>(`${this.baseUrl}/companies`, data, { headers: this.getHeaders() });
  }

  update(id: string, data: Company): Observable<Company> {
    return this.http.put<Company>(`${this.baseUrl}/companies/${id}`, data, { headers: this.getHeaders() });
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/companies/${id}`, { headers: this.getHeaders() });
  }

  getById(id: string): Observable<InsuranceCompaniesModel> {
    return this.http.get<InsuranceCompaniesModel>(`${this.baseUrl}/companies/${id}`, { headers: this.getHeaders() });
  }

  getAllProducts(): Observable<ProductsModel[]> {
    return this.http.get<ProductsModel[]>(`${this.baseUrl}/products`, { headers: this.getHeaders() });
  }

  getAllProductCategories(): Observable<ProductCategoriesModel[]> {
    return this.http.get<ProductCategoriesModel[]>(`${this.baseUrl}/product-categories`, { headers: this.getHeaders() });
  }
}
