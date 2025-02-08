const express = require('express');
const bodyParser = require('body-parser');
// const requireAuth = require('../middleware/requireAuth');
const { getAll, getById, updateActiveStatus, createemployee, updateEmployeeDetails, sendEmails } = require('../controllers/companyController')


const router = express.Router();
// router.use(requireAuth);
// Add bodyParser middleware to parse request bodies
router.use(bodyParser.json());

router.get('/get', getAll);

router.get('/get/:id', getById);


router.post('/createemployee', createemployee);


router.patch('/update-status/:id', updateActiveStatus);


router.put('/update/:id', updateEmployeeDetails);

router.post('/sendEmails', sendEmails);

module.exports = router;