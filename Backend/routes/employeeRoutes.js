const express = require('express');
const bodyParser = require('body-parser');
// const requireAuth = require('../middleware/requireAuth');
const { getAll, getById, updateActiveStatus, createemployee, updateEmployeeDetails } = require('../controllers/companyController')


const router = express.Router();
// router.use(requireAuth);
// Add bodyParser middleware to parse request bodies
router.use(bodyParser.json());

router.get('/get', getAll);

router.get('/get/:id', getById);


router.post('/createemployee', createemployee);


router.patch('/update-status/:id', updateActiveStatus);

// Add this route for updating employee details
router.put('/update/:id', updateEmployeeDetails);


module.exports = router;