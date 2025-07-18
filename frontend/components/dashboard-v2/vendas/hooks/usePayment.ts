import { useState, useEffect } from 'react';
import { paymentService } from '../services/paymentService';

export function usePayment() {
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    paymentService
      .getPaymentMethods()
      .then(setPaymentMethods)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return { paymentMethods, loading, error };
}
