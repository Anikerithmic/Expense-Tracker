const Razorpay = require('razorpay');
const Order = require('../models/orders');

exports.purchasePremium = async (req, res) => {
    try {
        var rzp = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET
        });

        const amount = 100;

        rzp.orders.create({ amount, currency: "INR" }, (err, order) => {
            if (err) {
                throw new Error(JSON.stringify(err));
            }
            console.log('Order:', order);
            req.user.createOrder({ orderid: order.id, status: 'PENDING' }).then(() => {
                return res.status(201).json({ order, key_id: rzp.key_id });
            }).catch(err => {
                throw new Error(err);
            })
        })
    } catch (err) {
        console.log(err);
        res.status(403).json({ message: 'Something went wrong', error: err })
    }
}

exports.updateTransactionStatus = async (req, res) => {
    try {
        const { payment_id, order_id } = req.body;
        const order = await Order.findOne({ where: { orderid: order_id } })

        //if payment succeed.
        if (payment_id) {
            const promise1 = order.update({ paymentid: payment_id, status: 'SUCCESSFUL' })
            const promise2 = req.user.update({ ispremiumuser: true })

            Promise.all([promise1, promise2]).then(() => {
                return res.status(202).json({ success: true, message: 'Transaction Successful' });
            }).catch((err) => {
                throw new Error(err);
            })
        }
        //if payment failed.
        else {
            await order.update({ status: 'FAILED' }).then(() => {
                return res.status(402).json({ success: false, message: 'Transaction FAILED' });
            }).catch((err) => {
                throw new Error(err);
            })
        }

    } catch (err) {
        throw new Error(err);
    }
}
