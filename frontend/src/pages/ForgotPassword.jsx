import { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        try {
            const { data } = await axios.post('/api/auth/forgotpassword', { email });
            setMessage(data.message);
            // In a real app, users check email. Here we might show the mock URL in dev console or UI if needed, 
            // but for now let's stick to the plan of showing a success message.
            if (data.resetUrl) {
                console.log("DEV ONLY: Reset URL:", data.resetUrl);
                setMessage(`Email sent! (Check console for dev URL)`);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong');
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10">
            <div className="card">
                <h2 className="text-2xl font-bold mb-6 text-center text-primary">Forgot Password</h2>
                {message && <div className="bg-green-100 text-green-700 p-3 rounded mb-4 text-sm">{message}</div>}
                {error && <div className="bg-red-100 text-danger p-3 rounded mb-4 text-sm">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Email Address</label>
                        <input
                            type="email"
                            className="input-field"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="Enter your registered email"
                        />
                    </div>
                    <button type="submit" className="btn btn-primary w-full">
                        Send Reset Link
                    </button>
                </form>
                <div className="mt-4 text-center">
                    <Link to="/login" className="text-sm text-accent hover:underline">Back to Login</Link>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
