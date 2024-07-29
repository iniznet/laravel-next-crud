'use client';

import { useState, useContext } from 'react';
import { classNames } from 'primereact/utils';
import { LayoutContext } from '../../../layout/context/layoutcontext';
import { login, register } from '@/app/utils/api';
import { Message } from '@/types/message';
import { UserData } from '@/types/user';
import LoginForm from '@/app/components/LoginForm';
import RegisterForm from '@/app/components/RegisterForm';
import { useRouter } from 'next/navigation';
import { setCookie } from '@/app/utils/cookie';

const LoginRegister: React.FC = () => {
    const [isRegisterActive, setIsRegisterActive] = useState(false);
    const [message, setMessage] = useState<Message | null>(null);
    const { layoutConfig } = useContext(LayoutContext);
    const router = useRouter();

    const toggleForm = () => {
        setIsRegisterActive(!isRegisterActive);
        setMessage(null);
    };

    const handleLogin = async (data: UserData) => {
        const response = await login(data);

        if (response.status === 200) {
            setMessage({ type: 'success', content: response.data.message });

            setCookie('sanctum_token', response.data.token, 60 * 60 * 24 * 365);

            setTimeout(() => {
                router.push('/');
            }, 1000);
        } else {
            const fieldErrors = response.status === 422 ? (response.data.errors || {}) : {
                email: 'Invalid email or password',
                password: 'Invalid email or password',
            };

            setMessage({
                type: 'error',
                content: response.data.message,
                fieldErrors,
            });
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

    const containerClassName = classNames('surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden', { 'p-input-filled': layoutConfig.inputStyle === 'filled' });

    return (
        <div className={containerClassName}>
            <div className="flex flex-column align-items-center justify-content-center">
                <img src={`/layout/images/logo-${layoutConfig.colorScheme === 'light' ? 'dark' : 'white'}.svg`} alt="Sakai logo" className="mb-5 w-6rem flex-shrink-0" />
                <div
                    style={{
                        borderRadius: '56px',
                        padding: '0.3rem',
                        background: 'linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)'
                    }}
                >
                    <div className="w-full surface-card py-8 px-5 sm:px-8" style={{ borderRadius: '53px' }}>
                        <div className="text-center mb-5">
                            <div className="text-900 text-3xl font-medium mb-3">
                                {isRegisterActive ? 'Create an Account' : 'Welcome Back'}
                            </div>
                        </div>

                        {message && (
                            <div className={`p-message p-message-${message.type} mb-5`}>
                                <div className="p-message-wrapper">
                                    <span className="p-message-text">{message.content}</span>
                                </div>
                            </div>
                        )}

                        {isRegisterActive ? (
                            <RegisterForm onSubmit={handleRegister} fieldErrors={message?.fieldErrors} />
                        ) : (
                            <LoginForm onSubmit={handleLogin} fieldErrors={message?.fieldErrors} />
                        )}

                        <div className="text-center mt-5">
                            {isRegisterActive ? (
                                <p>Already have an account? <a href="#" onClick={toggleForm} className="font-medium text-blue-500">Sign In</a></p>
                            ) : (
                                <p>Don't have an account? <a href="#" onClick={toggleForm} className="font-medium text-blue-500">Register</a></p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginRegister;