'use client';
import { useState, useContext } from 'react';
import { classNames } from 'primereact/utils';
import { LayoutContext } from '../../../layout/context/layoutcontext';
import LoginForm from '@/app/components/LoginForm';
import RegisterForm from '@/app/components/RegisterForm';
import { useRouter } from 'next/navigation';
import { AuthAPI } from '@/apis/AuthApi';
const LoginRegister = () => {
    const [isRegisterActive, setIsRegisterActive] = useState(false);
    const [message, setMessage] = useState(null);
    const { layoutConfig } = useContext(LayoutContext);
    const router = useRouter();
    const toggleForm = () => {
        setIsRegisterActive(!isRegisterActive);
        setMessage(null);
    };
    const handleLogin = async (data) => {
        try {
            const response = await AuthAPI.login(data);
            setMessage({ type: 'success', content: response.message });
            setTimeout(() => {
                router.push('/');
            }, 1000);
        }
        catch (error) {
            const { message, errors } = error;
            const fieldErrors = errors ? (errors || {}) : {
                email: 'Invalid email or password',
                password: 'Invalid email or password',
            };
            setMessage({
                type: 'error',
                content: message || 'Login failed',
                fieldErrors,
            });
        }
    };
    const handleRegister = async (data) => {
        try {
            const response = await AuthAPI.register(data);
            setMessage({ type: 'success', content: response.message });
            toggleForm();
        }
        catch (error) {
            const { message, errors } = error;
            const fieldErrors = errors ? (errors || {}) : {
                email: 'Email is already in use',
            };
            setMessage({
                type: 'error',
                content: message || 'Registration failed',
                fieldErrors,
            });
        }
    };
    const containerClassName = classNames('surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden', { 'p-input-filled': layoutConfig.inputStyle === 'filled' });
    return (<div className={containerClassName}>
            <div className="flex flex-column align-items-center justify-content-center">
                <img src={`/layout/images/logo-${layoutConfig.colorScheme === 'light' ? 'dark' : 'white'}.svg`} alt="Sakai logo" className="mb-5 w-6rem flex-shrink-0"/>
                <div style={{
            borderRadius: '56px',
            padding: '0.3rem',
            background: 'linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)'
        }}>
                    <div className="w-full surface-card py-8 px-5 sm:px-8" style={{ borderRadius: '53px' }}>
                        <div className="text-center mb-5">
                            <div className="text-900 text-3xl font-medium mb-3">
                                {isRegisterActive ? 'Create an Account' : 'Welcome Back'}
                            </div>
                        </div>

                        {message && (<div className={`p-message p-message-${message.type} mb-5`}>
                                <div className="p-message-wrapper">
                                    <span className="p-message-text">{message.content}</span>
                                </div>
                            </div>)}

                        {isRegisterActive ? (<RegisterForm onSubmit={handleRegister} fieldErrors={message?.fieldErrors}/>) : (<LoginForm onSubmit={handleLogin} fieldErrors={message?.fieldErrors}/>)}

                        <div className="text-center mt-5">
                            {isRegisterActive ? (<p>Already have an account? <a href="#" onClick={toggleForm} className="font-medium text-blue-500">Sign In</a></p>) : (<p>Don&apos;t have an account? <a href="#" onClick={toggleForm} className="font-medium text-blue-500">Register</a></p>)}
                        </div>
                    </div>
                </div>
            </div>
        </div>);
};
export default LoginRegister;
