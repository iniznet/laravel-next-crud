// components/RegisterForm.tsx
import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { FaUser, FaEnvelope, FaEye, FaEyeSlash } from "react-icons/fa";

interface RegisterFormProps {
    onSubmit: SubmitHandler<RegisterFormInputs>;
    togglePasswordVisibility: () => void;
    showPassword: boolean;
    fieldErrors?: {
        [key: string]: string;
    };
}

interface RegisterFormInputs {
    name?: string;
    email: string;
    password: string;
    confirmPassword: string;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSubmit, togglePasswordVisibility, showPassword, fieldErrors }) => {
    const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormInputs>();

    const getInputClassName = (fieldName: keyof RegisterFormInputs) => {
        return `border ${errors[fieldName] || fieldErrors?.[fieldName] ? 'border-red-500' : ''}`;
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <h1>Register</h1>
            <div className={`input-box ${errors.name || fieldErrors?.name ? 'error' : ''}`}>
                <div className="flex items-center">
                    <input
                        type="text"
                        placeholder='Name'
                        className={getInputClassName('name')}
                        {...register("name", { required: "Name is required" })}
                    />
                    <FaUser className='icon' />
                </div>
                {(errors.name || fieldErrors?.name) && <span className="error">{errors.name?.message || fieldErrors?.name}</span>}
            </div>
            <div className={`input-box ${errors.email || fieldErrors?.email ? 'error' : ''}`}>
                <div className="flex items-center">
                    <input
                        type="email"
                        placeholder='Email'
                        className={getInputClassName('email')}
                        {...register("email", {
                            required: "Email is required",
                            pattern: {
                                value: /^\S+@\S+$/i,
                                message: "Invalid email format"
                            }
                        })}
                    />
                    <FaEnvelope className='icon' />
                </div>
                {(errors.email || fieldErrors?.email) && <span className="error">{errors.email?.message || fieldErrors?.email}</span>}
            </div>
            <div className={`input-box ${errors.password || fieldErrors?.password || errors.confirmPassword || fieldErrors?.confirmPassword ? 'error' : ''}`}>
                <div className="flex items-center">
                    <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder='Password'
                        className={getInputClassName('password')}
                        {...register("password", { required: "Password is required" })}
                    />
                    <span onClick={togglePasswordVisibility} className='password-toggle-icon'>
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>
                </div>
                {(errors.password || fieldErrors?.password) && <span className="error">{errors.password?.message || fieldErrors?.password}</span>}
            </div>
            <div className={`input-box ${errors.confirmPassword || fieldErrors?.confirmPassword ? 'error' : ''}`}>
                <div className="flex items-center">
                    <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder='Confirm Password'
                        className={getInputClassName('confirmPassword')}
                        {...register("confirmPassword", { required: "Confirm Password is required" })}
                    />
                    <span onClick={togglePasswordVisibility} className='password-toggle-icon'>
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>
                </div>
                {(errors.confirmPassword || fieldErrors?.confirmPassword) && <span className="error">{errors.confirmPassword?.message || fieldErrors?.confirmPassword}</span>}
            </div>
            <button type="submit">Register</button>
        </form>
    );
};

export default RegisterForm;