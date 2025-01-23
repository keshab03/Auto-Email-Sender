const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
    company_name: {
        type: String,
        required: true,
    },
    company_email: {
        type: String,
        required: true,
    },
    active: {
        type: Boolean,
        required: true,
    }
}, { timestamps: true });
const Company = mongoose.model('CompanyDetails', companySchema);
module.exports = Company;