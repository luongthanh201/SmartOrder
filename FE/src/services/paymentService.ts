// This is a mock payment service that simulates payment processing
// In a real application, this would connect to a payment gateway API

export interface PaymentDetails {
  cardNumber: string;
  cardHolder: string;
  expiryDate: string;
  cvv: string;
  amount: number;
}

export interface PaymentResult {
  success: boolean;
  transactionId?: string;
  error?: string;
}

// Simulate payment verification
export const validatePaymentDetails = (details: PaymentDetails): string | null => {
  // Basic validation (in a real app, this would be more comprehensive)

  // Card number validation (should be 16 digits)
  if (!/^\d{16}$/.test(details.cardNumber.replace(/\s/g, ''))) {
    return 'Số thẻ không hợp lệ (cần 16 chữ số)';
  }

  // Card holder validation (should not be empty)
  if (!details.cardHolder.trim()) {
    return 'Vui lòng nhập tên chủ thẻ';
  }

  // Expiry date validation (should be in MM/YY format)
  if (!/^(0[1-9]|1[0-2])\/([0-9]{2})$/.test(details.expiryDate)) {
    return 'Ngày hết hạn không hợp lệ (cần định dạng MM/YY)';
  }

  // Check if card has expired
  const [month, year] = details.expiryDate.split('/');
  const expiryDate = new Date(2000 + parseInt(year), parseInt(month) - 1, 1);
  const now = new Date();

  if (expiryDate < now) {
    return 'Thẻ đã hết hạn';
  }

  // CVV validation (should be 3 digits)
  if (!/^\d{3}$/.test(details.cvv)) {
    return 'Mã CVV không hợp lệ (cần 3 chữ số)';
  }

  return null; // No errors
};

// Simulate payment processing
export const processPayment = async (details: PaymentDetails): Promise<PaymentResult> => {
  // Validate the payment details
  const validationError = validatePaymentDetails(details);
  if (validationError) {
    return {
      success: false,
      error: validationError
    };
  }

  // Simulate API call with some delay
  return new Promise((resolve) => {
    setTimeout(() => {
      // Generate random success or failure (90% success rate)
      const isSuccess = Math.random() < 0.9;

      if (isSuccess) {
        resolve({
          success: true,
          transactionId: `TX-${Date.now()}-${Math.floor(Math.random() * 1000)}`
        });
      } else {
        resolve({
          success: false,
          error: 'Giao dịch thất bại. Vui lòng thử lại sau.'
        });
      }
    }, 1500); // 1.5 second delay to simulate API call
  });
};

// Simulate different payment methods
export const paymentMethods = [
  { id: 'credit_card', name: 'Thẻ tín dụng/ghi nợ', icon: '💳' },
  { id: 'momo', name: 'Ví MoMo', icon: '👛' },
  { id: 'zalopay', name: 'ZaloPay', icon: '💰' },
  { id: 'cash', name: 'Tiền mặt', icon: '💵' }
];
