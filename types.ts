export interface VehicleQuery {
  placa: string;
  renavam: string;
}

export interface VehicleResponse {
  success: boolean;
  placa?: string;
  renavam?: string;
  // The backend returns a list of lists of strings
  // e.g., [["Infração: ...", "Valor: ..."], [...]]
  multas?: string[][]; 
  error?: string;
}

export enum RequestStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}