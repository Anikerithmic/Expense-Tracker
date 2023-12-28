const express = require('express');

const premiumFeatureController = require('../controllers/premiumFeature');

const userAuthentication = require('../middleware/auth');

const router = express.Router();   


router.get('/premiumUser/getUserleaderBoard', userAuthentication.authenticate, premiumFeatureController.getUserLeaderBoard);

module.exports = router;