import React, { useState } from 'react';
import axios from 'axios';

export default function Auth({ setUser }) {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';

        try {
            const { data } = await axios.post(endpoint, formData);
            localStorage.setItem('token', data.token);
            setUser(data.user);
        } catch (error) {
            alert(error.response?.data?.message || 'Error logging in or registering');
        }
    };

    return (
        <div className="auth-container">
            <h2>{isLogin ? 'Log in' : 'Sign up'}</h2>
            <form onSubmit={handleSubmit}>
                {!isLogin && (
                    <div>
                        <label>Username</label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                        />
                    </div>
                )}
                <div>
                    <label>Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Password</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit">{isLogin ? 'Log in' : 'Sign up'}</button>
            </form>
            <button onClick={() => setIsLogin(!isLogin)}>
                {isLogin ? "Don't have an account? Sign up" : "Already have an account? Log in"}
            </button>
            <button onClick={() => setUser(null)}>
                Continue without logging in
            </button>
        </div>
    );
}