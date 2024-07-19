import { useForm, SubmitHandler } from 'react-hook-form';
import { FaUser, FaEye, FaEyeSlash } from "react-icons/fa";

interface LoginFormProps {
    onSubmit: SubmitHandler<LoginFormInputs>;
    togglePasswordVisibility: () => void;
    showPassword: boolean;
}

interface LoginFormInputs {
    email: string;
    password: string;
    remember: boolean;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, togglePasswordVisibility, showPassword }) => {
    const { register, handleSubmit, formState: { errors } } = useForm<LoginFormInputs>();

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <h1>Login</h1>
            <div className="input-box">
                <input
                    type="email"
                    placeholder='Email'
                    {...register("email", {
                        required: "Email is required",
                        pattern: {
                            value: /^\S+@\S+$/i,
                            message: "Invalid email format"
                        }
                    })}
                />
                <FaUser className='icon' />
                {errors.email && <span className="error">{errors.email.message}</span>}
            </div>
            <div className="input-box">
                <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder='Password'
                    {...register("password", { required: "Password is required" })}
                />
                <span onClick={togglePasswordVisibility} className='password-toggle-icon'>
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
                {errors.password && <span className="error">{errors.password.message}</span>}
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