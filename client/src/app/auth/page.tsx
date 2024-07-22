'use client';

import { useState } from 'react';
import './page.css';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';
import { login, register } from '../utils/api';
import { Message } from '../types/Message';
import { UserData } from '../types/User';

const LoginRegister: React.FC = () => {
    const [isRegisterActive, setIsRegisterActive] = useState(false);
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [message, setMessage] = useState<Message | null>(null);

    const toggleForm = () => {
        setIsRegisterActive(!isRegisterActive);
        setMessage(null);
    };

    const togglePasswordVisibility = () => {
        setShowPassword(prevState => !prevState);
    };

    const handleLogin = async (data: UserData) => {
        const response = await login(data);

        if (response.status === 200) {
            setMessage({ type: 'success', content: response.data.message });
        } else {
            setMessage({ type: 'error', content: response.data.message, fieldErrors: response.data.errors });
        }
    };

    const handleRegister = async (data: UserData) => {
        const response = await register(data);

        if (response.status === 201) {
            setMessage({ type: 'success', content: response.data.message });
            toggleForm();
        } else {
            setMessage({ type: 'error', content: response.data.message, fieldErrors: response.data.errors });
        }
    };

    return (
        <div className="wrapper">
            <div className={`form-container ${isRegisterActive ? 'register-active' : ''}`}>
                <div className="form-box">
                    {message && (
                        <div className={`message ${message.type}`}>
                            {message.content}
                        </div>
                    )}
                    <LoginForm
                        onSubmit={handleLogin}
                        togglePasswordVisibility={togglePasswordVisibility}
                        showPassword={showPassword}
                        fieldErrors={message?.fieldErrors}
                    />
                    <div className="register-link">
                        <p>Don't have an account? <a href="#" onClick={toggleForm}>Register</a></p>
                    </div>
                </div>

                <div className="form-box">
                    {message && (
                        <div className={`message ${message.type}`}>
                            {message.content}
                        </div>
                    )}
                    <RegisterForm
                        onSubmit={handleRegister}
                        togglePasswordVisibility={togglePasswordVisibility}
                        showPassword={showPassword}
                        fieldErrors={message?.fieldErrors}
                    />
                    <div className="register-link">
                        <p>Already have an account? <a href="#" onClick={toggleForm}>Login</a></p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginRegister;