const Razorpay = require('razorpay');
const crypto = require('crypto');
const User = require('../models/userModals');

// Initialize Razorpay instance
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});
exports.createOrder = async (req, res) => {
    const options = {
        amount: 50000, 
        currency: 'INR',
        receipt: `receipt_${req.user.id}`
    };

    try {
        const order = await razorpay.orders.create(options);
        res.json(order);
    } catch (error) {
        res.status(500).json({ error: 'Error creating order' });
    }
};

exports.verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        // Construct the signature string
        const signatureString = razorpay_order_id + '|' + razorpay_payment_id;

        // Calculate the HMAC digest
        const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
        hmac.update(signatureString);
        const calculatedSignature = hmac.digest('hex');

        // Compare the signatures
        if (calculatedSignature !== razorpay_signature) {
            return res.status(400).json({ error: 'Invalid signature' });
        }

        // If signature is valid, update user to premium
        const user = await User.findByPk(req.user.id);
        user.role = 'premium';
        await user.save();

        res.json({ message: 'Payment successful, user upgraded to premium' });
    } catch (error) {
        console.error('Error verifying payment:', error);
        res.status(500).json({ error: 'Error verifying payment' });
    }
};
