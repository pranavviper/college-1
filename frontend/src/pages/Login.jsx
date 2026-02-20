import { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const { login, user } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            if (user.role === 'student') navigate('/');
            else if (user.role === 'faculty') navigate('/faculty');
        }
    }, [user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await login(email, password);
        } catch (err) {
            setError(err);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10">
            <div className="card">
                <h2 className="text-2xl font-bold mb-6 text-center text-primary">Login</h2>
                {error && <div className="bg-red-100 text-danger p-3 rounded mb-4 text-sm">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Email</label>
                        <input
                            type="email"
                            className="input-field"
                            value={email}
                            onChange={(e) => {
                                let val = e.target.value;
                                if (val.endsWith('@') && val.length > email.length) {
                                    val += 'rajalakshmi.edu.in';
                                }
                                setEmail(val);
                            }}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Password</label>
                        <input
                            type="password"
                            className="input-field"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="text-right">
                        <Link to="/forgot-password" className="text-sm text-accent hover:underline">
                            Forgot Password?
                        </Link>
                    </div>
                    <button type="submit" className="btn btn-primary w-full">
                        Login
                    </button>
                </form>
                <p className="mt-4 text-center text-sm">
                    Don't have an account? <Link to="/register" className="text-accent hover:underline">Register</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
