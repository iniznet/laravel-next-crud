"use client"

import { useState } from 'react';
import './page.css';
import { FaUser, FaEnvelope, FaEye, FaEyeSlash } from "react-icons/fa";

const LoginRegister = () => {

    const [action, setAction] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const registerLink = () => {
        setAction('register-active');
    };

    const loginLink = () => {
        setAction('login-active');
    };

    const togglePasswordVisibility = () => {
        setShowPassword(prevState => !prevState);
    };

    return (
        <div className={`wrapper ${action}`}>
            <div className="form-box login">
                <form action="">
                    <h1>Login</h1>
                    <div className="input-box">
                        <input type="text" placeholder='Username' required />
                        <FaUser className='icon' />
                    </div>
                    <div className="input-box">
                        <input type={showPassword ? 'text' : 'password'} placeholder='Password' required />
                        <span onClick={togglePasswordVisibility} className='password-toggle-icon'>
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </span>
                    </div>

                    <div className="remember-forgot">
                        <label><input type="checkbox" />
                            Remember me</label>
                        <a href="#">Forgot password?</a>
                    </div>

                    <button type="submit">Login</button>

                    <div className="register-link">
                        <p>Don't have an account? <a href="#" onClick={registerLink}>Register</a></p>
                    </div>
                </form>
            </div>

            <div className="form-box register">
                <form action="">
                    <h1>Registration</h1>
                    <div className="input-box">
                        <input type="text" placeholder='Username' required />
                        <FaUser className='icon' />
                    </div>
                    <div className="input-box">
                        <input type="email" placeholder='Email' required />
                        <FaEnvelope className='icon' />
                    </div>
                    <div className="input-box">
                        <input type={showPassword ? 'text' : 'password'} placeholder='Password' required />
                        <span onClick={togglePasswordVisibility} className='password-toggle-icon'>
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </span>
                    </div>

                    <div className="remember-forgot">
                        <label><input type="checkbox" />
                            I agree to the terms & condition</label>
                    </div>

                    <button type="submit">Register</button>

                    <div className="register-link">
                        <p>Already have an account? <a href="#" onClick={loginLink}>Login</a></p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginRegister;
