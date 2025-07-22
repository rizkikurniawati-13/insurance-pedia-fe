import { InsuranceCompaniesModel } from "../insurance-companies-detail/insurance-companies.model";

export interface AuditCase {
  id?: string;
  title: string;
  company?: InsuranceCompaniesModel;
  companyId?: string; // untuk post
  lossValue: string;
  violationType: string;
  violationYear: number;
  findingYear: number;
  findingInstitution: string;
  defendants: string;
  relatedProject: string;
  findings: string;
  recommendations: string;
  followUp: string;
  source: string;
}