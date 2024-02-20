const express = require('express');
const router = express.Router();
const entityController = require('../controllers/entityController');

//router.get('/', entityController.view);
//router.post('/', entityController.find);
router.post('/clients/clients', entityController.create);
//router.get('/clients', entityController.form);

module.exports = router;