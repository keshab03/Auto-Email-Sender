import axios from 'axios';
import { url } from '../config';

const baseUrl = url;

const Employeeservice = {

    getemployee: async () => {
        try {
            const response = await axios.get(`${baseUrl}/com/get`);

            // console.log('Getting Employee');
            return response;
        } catch (error) {
            console.log(error.response.data.error);
            if (error.response && error.response.data) {
                throw new Error(error.response.data.error.message);
            } else {
                throw new Error("Something went wrong");
            }
        }
    },

    getemployeeById: async (empid) => {
        try {
            const response = await axios.get(`${baseUrl}/com/get/${empid}`);

            return response.data;
        } catch (error) {
            console.log(error);
        }
    },

    createemployee: async (data) => {
        try {
            const response = await axios.post(`${baseUrl}/com/createemployee`, data);
            return response.data;
        } catch (error) {
            if (error.response && error.response.data) {
                throw new Error(error.response.data.error);
            } else {
                throw new Error("Something went wrong while adding details");
            }
        }
    },


    updateEmployeeStatus: async (id) => {
        try {
            const response = await axios.patch(`${baseUrl}/com/update-status/${id}`);
            // console.log(response.data);
            return response.data;
        } catch (error) {
            console.error(error);
            throw new Error("Error updating employee status");
        }
    },
    updateemployee: async (data, empId) => {
        try {
            const response = await axios.put(`${baseUrl}/com/update/${empId}`, data);
            console.log('Employee updated');
            return response.data;
        } catch (error) {
            if (error.response && error.response.data) {
                throw new Error(error.response.data.error);
            } else {
                throw new Error("Something went wrong");
            }
        }
    },
    sendEmails: async () => {
        try {
            const response = await axios.post(`${baseUrl}/com/sendEmails`);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.error || "Something went wrong");
        }
    },
}
export default Employeeservice;
