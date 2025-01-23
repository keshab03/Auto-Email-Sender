const express = require('express');
const bodyParser = require('body-parser');
// const requireAuth = require('../middleware/requireAuth');
const { getAll, updateActiveStatus, createemployee, } = require('../controllers/companyController')


const router = express.Router();
// router.use(requireAuth);
// Add bodyParser middleware to parse request bodies
router.use(bodyParser.json());

router.get('/get', getAll);


router.post('/createemployee', createemployee);


router.patch('/update-status/:id', updateActiveStatus);


module.exports = router;