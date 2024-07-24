'use client';

import { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Checkbox } from 'primereact/checkbox';
import { classNames } from 'primereact/utils';

interface LoginFormInputs {
    email: string;
    password: string;
    remember: boolean;
}

interface LoginFormProps {
    onSubmit: (data: LoginFormInputs) => void;
    fieldErrors?: { [key: string]: string };
}

const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, fieldErrors }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState<boolean>(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        await onSubmit({ email, password, remember: rememberMe });
        setLoading(false);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="p-fluid">
                <div className="p-field mb-5">
                    <span className="p-float-label p-input-icon-right">
                        <i className="pi pi-envelope" />
                        <InputText
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={classNames({ 'p-invalid': fieldErrors?.email })}
                        />
                        <label htmlFor="email">Email</label>
                    </span>
                    {fieldErrors?.email && <small className="p-error">{fieldErrors.email}</small>}
                </div>
                <div className="p-field mb-5">
                    <span className="p-float-label">
                        <Password
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            toggleMask
                            className={classNames({ 'p-invalid': fieldErrors?.password })}
                            feedback={false}
                        />
                        <label htmlFor="password">Password</label>
                    </span>
                    {fieldErrors?.password && <small className="p-error">{fieldErrors.password}</small>}
                </div>
                <div className="p-field-checkbox mb-5">
                    <Checkbox
                        inputId="rememberMe"
                        checked={rememberMe || false}
                        onChange={(e) => setRememberMe(e.checked ?? false)}
                        className="mr-2"
                    />
                    <label htmlFor="rememberMe">Remember me</label>
                </div>
                <Button type="submit" label="Sign In" className="mt-2" loading={loading} />
            </div>
        </form>
    );
};

export default LoginForm;