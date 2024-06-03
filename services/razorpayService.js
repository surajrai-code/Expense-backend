const Razorpay = require('razorpay');
const crypto = require('crypto');
require('dotenv').config();
// Initialize Razorpay instance
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

const createOrder = async (userId) => {
    try {
        const options = {
            amount: 100, 
            currency: 'INR',
            receipt: `receipt_${userId}`
        };

        const order = await razorpay.orders.create(options);
        

        return order;
    } catch (error) {
        // Handle authentication error
        if (error.code === 'BAD_REQUEST_ERROR' && error.error && error.error.description === 'Authentication failed') {
            console.error('Razorpay authentication failed. Please check your API credentials.');
            throw new Error('Razorpay authentication failed. Please check your API credentials.');
        } else {
            console.error('Error creating order:', error);
            throw new Error('Error creating order');
        }
    }
};

const verifySignature = (razorpay_order_id, razorpay_payment_id, razorpay_signature) => {
    const signatureString = `${razorpay_order_id}|${razorpay_payment_id}`;
    const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
    hmac.update(signatureString);
    const calculatedSignature = hmac.digest('hex');

    return calculatedSignature === razorpay_signature;
};

module.exports = {
    createOrder,
    verifySignature
};
