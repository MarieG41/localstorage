import { createContext, useEffect, useState } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    useEffect(() => {
        axios.get('http://localhost:5000/checkAuth', { withCredentials: true })
            .then(response => setUser(response.data))
            .catch(() => setUser(null));
    }, []);

    const login = (username, password) => {
        return axios.post('http://localhost:5000/login', { username, password }, { withCredentials: true })
            .then(response => {
                setUser(response.data);
                return response.data;
            });
    };

    const logout = () => {
        return axios.get('http://localhost:5000/logout', { withCredentials: true })
            .then(() => setUser(null))
    };

    const register = (username, password) => {
        return axios.post('http://localhost:5000/register', { username, password })
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, register }} >
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider