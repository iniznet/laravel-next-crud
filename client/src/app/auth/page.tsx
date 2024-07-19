'use client';

import { useState } from 'react';
import './page.css';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';
import { login, register } from '../utils/api';
import { Message } from '../types/Message';
import { UserData } from '../types/User';

const LoginRegister: React.FC = () => {
    const [action, setAction] = useState<string>('');
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [message, setMessage] = useState<Message | null>(null);

    const registerLink = () => {
        setAction('register-active');
        setMessage(null);
    };

    const loginLink = () => {
        setAction('login-active');
        setMessage(null);
    };

    const togglePasswordVisibility = () => {
        setShowPassword(prevState => !prevState);
    };

    const handleLogin = async (data: UserData) => {
        try {
            const response = await login(data);
            setMessage({ type: 'success', content: 'Login successful!' });
            console.log(response.data);
            // Handle successful login (e.g., store token, redirect)
        } catch (error) {
            setMessage({ type: 'error', content: 'Login failed. Please check your credentials.' });
            console.error('Login error:', error);
        }
    };

    const handleRegister = async (data: UserData) => {
        try {
            const response = await register(data);
            setMessage({ type: 'success', content: 'Registration successful! Please log in with your new account.' });
            loginLink(); // Switch to login form
            console.log(response.data);
        } catch (error) {
            setMessage({ type: 'error', content: 'Registration failed. Please try again.' });
            console.error('Registration error:', error);
        }
    };

    return (
        <div className={`wrapper ${action}`}>
            <div className="form-box login">
                {message && (
                    <div className={`message ${message.type}`}>
                        {message.content}
                    </div>
                )}
                <LoginForm
                    onSubmit={handleLogin}
                    togglePasswordVisibility={togglePasswordVisibility}
                    showPassword={showPassword}
                />
                <div className="register-link">
                    <p>Don't have an account? <a href="#" onClick={registerLink}>Register</a></p>
                </div>
            </div>

            <div className="form-box register">
                <RegisterForm
                    onSubmit={handleRegister}
                    togglePasswordVisibility={togglePasswordVisibility}
                    showPassword={showPassword}
                />
                <div className="register-link">
                    <p>Already have an account? <a href="#" onClick={loginLink}>Login</a></p>
                </div>
            </div>
        </div>
    );
};

export default LoginRegister;