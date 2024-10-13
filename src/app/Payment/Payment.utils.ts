/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { v4 as uuidv4 } from 'uuid';

export const initialPayment = async (paymentData: any) => {
    const transactionID = uuidv4();
    
    try {
        const response = await axios.post("https://sandbox.aamarpay.com/jsonpost.php", {
            store_id: "aamarpaytest",
            signature_key: "dbb74894e82415a2f7ff0ec3a97e4183",
            tran_id: transactionID,
            success_url: "http://www.merchantdomain.com/successpage.html",
            fail_url: "http://www.merchantdomain.com/failedpage.html",
            cancel_url: "http://www.merchantdomain.com/cancelpage.html",
            amount: paymentData?.payableAmount,
            currency: "BDT",
            desc: "Merchant Registration Payment",
            cus_name: paymentData?.customerName,
            cus_email: paymentData?.customerEmail,
            cus_add1: paymentData?.customerAddress,
            cus_add2: "Mohakhali DOHS",
            cus_city: "Dhaka",
            cus_state: "Dhaka",
            cus_postcode: "1206",
            cus_country: "Bangladesh",
            cus_phone: paymentData?.customerPhone,
            type: "json"
        });

        
        return response.data;  
    } catch (error) {
        console.error('Payment initiation failed:', error);
        throw new Error('Payment failed');  // Handle error as needed
    }
};