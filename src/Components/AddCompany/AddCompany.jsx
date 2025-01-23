import React, { useState, useEffect } from 'react';
import empservice from '../../services/Companyservice';
import './addcompany.css'
const AddCompany = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [companies, setCompanies] = useState([]);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        fetchCompanies();
    }, []);

    const fetchCompanies = async () => {
        try {
            const response = await empservice.getemployee();
            console.log("response", response);
            setCompanies(response.data.userData);
        } catch (error) {
            console.error(error);
        }
    };

    const handleSubmit = async () => {
        const payload = { name, email };
        try {
            await empservice.createemployee(payload);
            setShowModal(true);
            fetchCompanies();
        } catch (error) {
            console.error(error);
        }
    };

    const toggleActiveStatus = async (id) => {
        try {
            await empservice.updateEmployeeStatus(id);
            fetchCompanies(); // Refresh the list
        } catch (error) {
            console.error(error);
        }
    };
let slno = 1;
    return (
        <div id="signup">
            <div id="signup-form" className={showModal ? 'blur' : ''}>
                <h2 id="heading">Add Company</h2>
                <span>Name</span>
                <input type="text" placeholder="Enter Name" value={name} onChange={(e) => setName(e.target.value)} />
                <span>Email</span>
                <input type="email" placeholder="Enter Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <button onClick={handleSubmit}>Add Company</button>
            </div>

            <div id="company-list">
                <h2>Company List</h2>
                <div className="company-list-header">
                    <span>sl no</span>
                    <span>Company Name</span>
                    <span>HR Email</span>
                    <span>Mail Status</span>
                    <span>Action</span>
                </div>
                {companies.map((company) => (
                    <div key={company._id} className="company-item">
                        <span>{slno++}</span>
                        <span>{company.company_name}</span>
                        <span>{company.company_email}</span>
                        <span>{company.active ? 'Active' : 'Disabled'}</span>
                        <button
                            onClick={() => toggleActiveStatus(company._id)}
                            style={{
                                backgroundColor: company.active ? 'red' : 'green',
                                color: 'white',
                                border: 'none',
                                padding: '10px 20px',
                                cursor: 'pointer',
                                borderRadius: '5px',
                            }}
                        >
                            {company.active ? 'Disable' : 'Enable'}
                        </button>

                    </div>
                ))}
            </div>
        </div>
    );
};

export default AddCompany;
