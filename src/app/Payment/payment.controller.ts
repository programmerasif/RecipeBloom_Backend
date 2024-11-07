import catchAsync from "../utils/catchAsync";

const paymentConfirmation = catchAsync(async (req, res) => {
  res.send(`<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Payment Success</title>
</head>
<body style="font-family: Arial, sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; background-color: #f0f0f0;">
  <div style="background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); text-align: center; width: 90%; max-width: 400px;">
    <h1 style="color: #6ABE4C; font-size: 24px; margin-bottom: 10px;">Payment Successful!</h1>
    <p style="color: #333333; font-size: 16px; margin-bottom: 20px;">Thank you for your payment. Your transaction has been completed successfully.</p>
    
    <button onclick="window.location.href='https://recipe-bloom.vercel.app/recipe-feed'" style="padding: 10px 20px; background-color: #6ABE4C; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 16px;">
      Go Back
    </button>
  </div>
</body>
</html>`);
});

export const PaymentController = {
  paymentConfirmation,
};
