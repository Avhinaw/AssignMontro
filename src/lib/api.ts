// const API_URL = 'http://localhost:3000/api/payments';
const API_URL = 'https://assignmontrobe.onrender.com/api/payments';


export const fetchPayments = async () => {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Failed to fetch payments');
    return response.json();
};

export const createPayment = async (paymentData: any) => {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paymentData),
    });
    if (!response.ok) throw new Error('Failed to create payment');
    return response.json();
};

export const fetchPaymentDetails = async (paymentId: string) => {
  const response = await fetch(`${API_URL}/${paymentId}/details`);
  if (!response.ok) throw new Error('Failed to fetch payment details');
  return response.json();
};

export const exportPaymentsCsv = async () => {
  const response = await fetch(`${API_URL}/export-csv`);
  if (!response.ok) throw new Error('Failed to export csv');
  const blob = await response.blob();
  return blob;
};