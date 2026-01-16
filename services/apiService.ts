import { VehicleQuery, VehicleResponse } from '../types';

const API_BASE_URL = 'http://localhost:8000/api/v1';

export const consultVehicle = async (data: VehicleQuery): Promise<VehicleResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/consultar`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      // Try to parse error message from backend
      try {
        const errorData = await response.json();
        if (errorData.error) {
          return { success: false, error: errorData.error };
        }
      } catch {
        // Ignore JSON parse error
      }
      throw new Error(`Server returned ${response.status}: ${response.statusText}`);
    }

    const result: VehicleResponse = await response.json();
    return result;
  } catch (error) {
    console.error("API Consultation Error:", error);
    
    // Fallback for demonstration: If backend is unreachable and using example data
    if (data.placa === 'ABC1234' && data.renavam === '12345678900') {
        console.warn("Backend unavailable. Returning mock data for demonstration.");
        await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate delay
        return {
          success: true,
          placa: "ABC1234",
          renavam: "12345678900",
          multas: [
            [
              "Infração: EXCESSO DE VELOCIDADE",
              "Data: 10/01/2024",
              "Valor: R$ 130,16",
              "Situação: PENDENTE"
            ],
            [
              "Infração: ESTACIONAMENTO IRREGULAR",
              "Data: 15/02/2024",
              "Valor: R$ 195,23",
              "Situação: PAGA"
            ]
          ]
        };
    }

    const message = error instanceof Error ? error.message : "Unknown error";
    const isNetworkError = message.includes('Failed to fetch') || message.includes('NetworkError');

    return {
      success: false,
      error: isNetworkError 
        ? `Could not connect to backend at ${API_BASE_URL}. Ensure the Python server is running.` 
        : message
    };
  }
};