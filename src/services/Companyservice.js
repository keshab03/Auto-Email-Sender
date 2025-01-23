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

    createemployee: async (data) => {        
        try {
            const response = await axios.post(`${baseUrl}/com/createemployee`, data);
            if (response.data.status !== 409) {
                console.log('Created');
            }
            // console.log(response.data)

            // return response.data.employee._id;
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
    
}
export default Employeeservice;
