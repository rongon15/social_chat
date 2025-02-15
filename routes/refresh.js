const express = require('express');
const router = express.Router();
const refreshTokenController = require('../controller/refreshTokenController');

router.post("/", refreshTokenController.handleRefresh);

module.exports = router;