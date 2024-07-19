import { useForm, SubmitHandler } from 'react-hook-form';
import { FaUser, FaEnvelope, FaEye, FaEyeSlash } from "react-icons/fa";

interface RegisterFormProps {
    onSubmit: SubmitHandler<RegisterFormInputs>;
    togglePasswordVisibility: () => void;
    showPassword: boolean;
}

interface RegisterFormInputs {
    email: string;
    password: string;
    name?: string;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSubmit, togglePasswordVisibility, showPassword }) => {
    const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormInputs>();

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <h1>Register</h1>
            <div className="input-box">
                <input
                    type="text"
                    placeholder='Name'
                    {...register("name", { required: "Name is required" })}
                />
                <FaUser className='icon' />
                {errors.name && <span className="error">{errors.name.message}</span>}
            </div>
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
                <FaEnvelope className='icon' />
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
            <button type="submit">Register</button>
        </form>
    );
};

export default RegisterForm;