export interface InsuranceOverview {
  komponenAsuransi: string;
  kategori: string;
  jumlahIndustri: number;
  aset: number;
  liabilitas: number;
  ekuitas: number;
  pinjamanSubordinasi: number;
  premi: number;
  klaim: number;
  periode: string;      // format ISO date
  createdBy: string;
}

export interface InsuranceRatio {
  komponenAsuransi: string;
  kategori: string;
  rbc: number;             // Risk Based Capital
  solvabilitas: number;
  likuiditas: number;
  retensi: number;
  periode: string;
  createdBy: string;
}


export interface PeriodeOption {
  label: string;     // "April 2025"
  value: string;     // "2025-04-01"
}
