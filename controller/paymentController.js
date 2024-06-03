
const razorpayService = require('../services/razorpayService');
const User = require('../models/userModals');
const Payment = require('../models/paymentModel');

exports.createOrder = async (req, res) => {
    try {
        const order = await razorpayService.createOrder(req.user.id);
        res.json(order);
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ error: 'Error creating order' });
    }
};

exports.verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        if (!razorpayService.verifySignature(razorpay_order_id, razorpay_payment_id, razorpay_signature)) {
            return res.status(400).json({ error: 'Invalid signature' });
        }

        // Save payment details to the database
        await Payment.create({
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        });

        // If signature is valid, update user to premium
        const user = await User.findByPk(req.user.id);
        user.role = 'isPrimium';
        await user.save();

        res.json({ message: 'Payment successful, user upgraded to premium' });
    } catch (error) {
        console.error('Error verifying payment:', error);
        res.status(500).json({ error: 'Error verifying payment' });
    }
};
