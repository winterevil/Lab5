import axios from 'axios';

const BASE_URL = 'https://kami-backend-5rs0.onrender.com';

export const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
})

export const login = async (phone, password) => {
    try {
        console.log("Calling API with:", phone, password);
        const res = await api.post('/auth', { phone, password });
        console.log("Response OK:", res.data);
        return res.data;
    } catch (error) {
        console.log("Login API Error:", error.message);
        throw error;
    }
}

export const getServices = async () => {
    const res = await api.get('/services');
    return res.data;
}

export const getServiceById = async (id) => {
    const res = await api.get(`/services/${id}`);
    return res.data;
}

export const addService = async (name, price, token) => {
    const res = await api.post('/services', { name, price }, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    return res.data;
}

export const updateService = async (token, id, name, price) => {
    const res = await api.put(`/services/${id}`, { name, price }, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    return res.data;
}

export const deleteService = async (token, id) => {
    const res = await api.delete(`/services/${id}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    return res.data;
}

export const getCustomers = async () => {
    const res = await api.get('/customers');
    return res.data;
}

export const addCustomer = async (token, name, phone) => {
    const res = await api.post('/customers', { name, phone }, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    return res.data;
}

export const getTransactions = async () => {
    const res = await api.get('/transactions');
    return res.data;
}

export const getTransactionById = async (id) => {
    const res = await api.get(`/transactions/${id}`);
    return res.data;
}