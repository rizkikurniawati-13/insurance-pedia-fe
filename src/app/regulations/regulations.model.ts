export interface Regulation {
  id?: string; // UUID
  title: string;
  number?: string;
  type?: string; // e.g., "Peraturan Menteri", "UU", "SE"
  issuedDate?: string; // format ISO string: 'YYYY-MM-DD'
  description?: string;
  fileName?: string;
  fileType?: string;
  fileBase64?: string;
  link?:string;

  createdBy?: string;
  createdDate?: string; // ISO datetime string
  lastModifiedBy?: string;
  lastModifiedDate?: string; // ISO datetime string
}
