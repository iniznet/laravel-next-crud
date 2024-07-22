import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { FaUser, FaEye, FaEyeSlash } from "react-icons/fa";

interface LoginFormProps {
    onSubmit: SubmitHandler<LoginFormInputs>;
    togglePasswordVisibility: () => void;
    showPassword: boolean;
    fieldErrors?: {
        [key: string]: string;
    };
}

interface LoginFormInputs {
    email: string;
    password: string;
    remember: boolean;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, togglePasswordVisibility, showPassword, fieldErrors }) => {
    const { register, handleSubmit, formState: { errors } } = useForm<LoginFormInputs>();

    const getInputClassName = (fieldName: keyof LoginFormInputs) => {
        return `border ${errors[fieldName] || fieldErrors?.[fieldName] ? 'border-red-500' : ''}`;
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <h1>Login</h1>
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
                    <FaUser className='icon' />
                </div>
                {(errors.email || fieldErrors?.email) && <span className="error">{errors.email?.message || fieldErrors?.email}</span>}
            </div>
            <div className={`input-box ${errors.password || fieldErrors?.password ? 'error' : ''}`}>
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
            <div className="remember-forgot">
                <label><input type="checkbox" {...register("remember")} /> Remember me</label>
                <a href="#">Forgot password?</a>
            </div>
            <button type="submit">Login</button>
        </form>
    );
};

export default LoginForm;