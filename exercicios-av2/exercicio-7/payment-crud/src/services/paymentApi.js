import axios from 'axios';

const API_URL = 'http://localhost:3000/api/payments';

const paymentApi = {
    findAll: async () => {
        return axios.get(API_URL);
    },

    findById: async (id) => {
        return axios.get(`${API_URL}/${id}`);
    },

    create: async (paymentData) => {
        return axios.post(API_URL, paymentData);
    },

    update: async (id, paymentData) => {
        return axios.put(`${API_URL}/${id}`, paymentData);
    },

    remove: async (id) => {
        return axios.delete(`${API_URL}/${id}`);
    }
};

export default paymentApi;