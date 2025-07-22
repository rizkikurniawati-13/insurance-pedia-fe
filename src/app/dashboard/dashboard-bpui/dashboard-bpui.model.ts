export interface FinancialReport {
  id: string;
  company: {
    id: string;
    name: string;
    // Properti lain jika perlu:
    type?: string;
    address?: string;
    contact?: string;
    licenseNumber?: string;
    establishedDate?: string;
    status?: string;
  };
  year: number;
  quarter: number;
  month?: number;
  totalAssets: number;
  totalLiabilities: number;
  equity: number;
  grossPremium: number;
  netPremium: number;
  underwritingIncome: number;
  claimsExpense: number;
  investmentIncome: number;
  netProfit: number;

  // Rasio-ratio penting
  solvencyRatio?: number;
  rbc?: number;
  liquidityRatio?: number;
  investmentAdequacyRatio?: number;
  expenseRatio?: number;
  operationalCostRatio?: number;

  // Rasio profitabilitas
  roa?: number;
  roe?: number;
  netProfitMargin?: number;

  // Lain-lain
  mmbr?: number;
  premiumGrowth?: number;

  auditStatus?: string;
  reportDate?: string;
  createdDate?: string;
  lastModifiedDate?: string;
}
