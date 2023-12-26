const express = require('express');

const purchaseController = require('../controllers/purchase');

const userAuthentication = require('../middleware/auth');

const router = express.Router();   
const bodyParser = require('body-parser');  


router.get('/purchase/premiumMembership', userAuthentication.authenticate, purchaseController.purchasePremium);

router.post('/purchase/updateTransactionStatus', userAuthentication.authenticate, purchaseController.updateTransactionStatus);


module.exports = router;