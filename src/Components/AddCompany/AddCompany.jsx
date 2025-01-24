import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router';
import empservice from '../../services/Companyservice';
import './addcompany.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddCompany = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [editname, setEditName] = useState('');
    const [editemail, setEditEmail] = useState('');
    const [companies, setCompanies] = useState([]);
    const [editState, setEditState] = useState(false);
    const [searchEmail, setSearchEmail] = useState(''); 

    const loc = useLocation();
    const id = loc.pathname.split("/")[1];

    // Fetch company data when edit mode is active
    useEffect(() => {
        if (editState && id)  {
            fetchData();
        }
    }, [editState, id]);

    const fetchData = async () => {
        try {
            const response = await empservice.getemployeeById(id);
            const companyData = response;
            setEditName(companyData.employee.company_name);
            setEditEmail(companyData.employee.company_email);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchCompanies = async () => {
        try {
            const response = await empservice.getemployee();
            setCompanies(response.data.userData);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchCompanies();
    }, []);

    const handleSubmit = async () => {
        const payload = { name, email };
        try {
            await empservice.createemployee(payload);
            fetchCompanies();
            toast.success("Company added successfully!"); // Success toast
        } catch (error) {
            toast.error("Failed to add company!"); // Error toast
            console.error(error);
        }
    };

    const toggleActiveStatus = async (id) => {
        try {
            await empservice.updateEmployeeStatus(id);
            fetchCompanies(); // Refresh the list
            toast.success("Company status updated successfully!"); // Success toast
        } catch (error) {
            toast.error("Failed to update company status!"); // Error toast
            console.error(error);
        }
    };

    const handleEdit = async () => {
        setEditState(true);
    };

    const update = async () => {
        const payload = { company_name: editname, company_email: editemail };
        try {
            await empservice.updateemployee(payload, id);
            setEditState(false);
            fetchCompanies(); // Refresh the list after update
            toast.success("Company updated successfully!"); // Success toast
        } catch (error) {
            toast.error("Failed to update company!"); // Error toast
            console.error(error);
        }
    };

    const handleSearchChange = (event) => {
        setSearchEmail(event.target.value);  // Update search email on change
    };

    // Filter the companies list based on the search email
    const filteredCompanies = companies.filter((company) =>
        company.company_email.toLowerCase().includes(searchEmail.toLowerCase())
    );

    let slno = 1;
    return (
        <div id="signup">
            {editState ? (
                <div id="signup-form">
                    <h2 id="heading">Edit Company</h2>
                    <span>Name</span>
                    <input type="text" placeholder="Enter Name" value={editname} onChange={(e) => setEditName(e.target.value)} />
                    <span>Email</span>
                    <input type="email" placeholder="Enter Email" value={editemail} onChange={(e) => setEditEmail(e.target.value)} />
                    <button onClick={update}>Update Company</button>
                </div>
            ) : (
                <div id="signup-form">
                    <h2 id="heading">Add Company</h2>
                    <span>Name</span>
                    <input type="text" placeholder="Enter Name" value={name} onChange={(e) => setName(e.target.value)} />
                    <span>Email</span>
                    <input type="email" placeholder="Enter Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <button onClick={handleSubmit}>Add Company</button>
                </div>
            )}

            <div id="company-list">
                <h2>Company List</h2>

                <div>
                    <input
                        type="email"
                        placeholder="Search by Email"
                        value={searchEmail}
                        onChange={handleSearchChange}
                    />
                </div>

                <div className="company-list-header">
                    <span>sl no</span>
                    <span>Company Name</span>
                    <span>HR Email</span>
                    <span>Mail Status</span>
                    <span>Action</span>
                </div>
                {filteredCompanies.map((company) => (
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
                        <Link to={`${company._id}`} >
                            <button
                                onClick={handleEdit}
                                style={{
                                    backgroundColor: company.active ? 'red' : 'green',
                                    color: 'white',
                                    border: 'none',
                                    padding: '1px',
                                    cursor: 'pointer',
                                    borderRadius: '5px',
                                }}
                            >
                                Edit
                            </button>
                        </Link>
                    </div>
                ))}
            </div>

            <ToastContainer /> {/* Toast Container */}
        </div>
    );
};

export default AddCompany;
