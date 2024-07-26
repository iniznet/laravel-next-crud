import React, { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { classNames } from 'primereact/utils';

interface RegisterFormInputs {
    name?: string;
    email: string;
    password: string;
    confirmPassword: string;
}

interface RegisterFormProps {
    onSubmit: (data: RegisterFormInputs) => void;
    fieldErrors?: { [key: string]: string };
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSubmit, fieldErrors }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        onSubmit({ name, email, password, confirmPassword });
        setLoading(false);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="p-fluid">
                <div className="p-field mb-5">
                    <span className="p-float-label">
                        <InputText
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className={classNames({ 'p-invalid': fieldErrors?.name })}
                        />
                        <label htmlFor="name">Name</label>
                    </span>
                    {fieldErrors?.name && <small className="p-error">{fieldErrors.name}</small>}
                </div>
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
                        />
                        <label htmlFor="password">Password</label>
                    </span>
                    {fieldErrors?.password && <small className="p-error">{fieldErrors.password}</small>}
                </div>
                <div className="p-field mb-5">
                    <span className="p-float-label">
                        <Password
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            toggleMask
                            className={classNames({ 'p-invalid': fieldErrors?.confirmPassword })}
                            feedback={false}
                        />
                        <label htmlFor="confirmPassword">Confirm Password</label>
                    </span>
                    {fieldErrors?.confirmPassword && <small className="p-error">{fieldErrors.confirmPassword}</small>}
                </div>
                <Button type="submit" label="Register" className="mt-2" loading={loading} />
            </div>
        </form>
    );
};

export default RegisterForm;