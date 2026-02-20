import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { Lock, CheckCircle, AlertCircle, Eye, EyeOff } from 'lucide-react';

const ChangePassword = () => {
    const [formData, setFormData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
        setSuccess('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const { oldPassword, newPassword, confirmPassword } = formData;

        if (newPassword !== confirmPassword) {
            setError('New passwords do not match');
            setLoading(false);
            return;
        }

        if (newPassword.length < 6) {
            setError('Password must be at least 6 characters');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch('http://localhost:5001/api/auth/change-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({ oldPassword, newPassword })
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess('Password updated successfully');
                setFormData({ oldPassword: '', newPassword: '', confirmPassword: '' });
                setTimeout(() => {
                    navigate('/');
                }, 2000);
            } else {
                setError(data.message || 'Failed to update password');
            }
        } catch (err) {
            setError('Something went wrong. Please try again.');
        }

        setLoading(false);
    };

    const toggleShowPassword = (setter, value) => {
        setter(!value);
    }

    return (
        <div className="flex justify-center items-center min-h-[80vh]">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
                <div className="bg-primary/5 p-6 border-b border-primary/10">
                    <div className="flex items-center gap-3 justify-center mb-2">
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-primary shadow-sm">
                            <Lock size={24} />
                        </div>
                    </div>
                    <h2 className="text-2xl font-bold text-center text-slate-800">Change Password</h2>
                    <p className="text-center text-slate-500 text-sm">Secure your account with a new password</p>
                </div>

                <div className="p-8">
                    {error && (
                        <div className="mb-6 bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl flex items-center gap-2 text-sm">
                            <AlertCircle size={18} />
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="mb-6 bg-green-50 border border-green-100 text-green-600 px-4 py-3 rounded-xl flex items-center gap-2 text-sm">
                            <CheckCircle size={18} />
                            {success}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-1">
                            <label className="text-sm font-semibold text-slate-700 ml-1">Current Password</label>
                            <div className="relative">
                                <input
                                    type={showOldPassword ? "text" : "password"}
                                    name="oldPassword"
                                    value={formData.oldPassword}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all pl-10"
                                    placeholder="Enter current password"
                                    required
                                />
                                <Lock className="absolute left-3 top-3.5 text-slate-400" size={18} />
                                <button type="button" onClick={() => toggleShowPassword(setShowOldPassword, showOldPassword)} className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600">
                                    {showOldPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-semibold text-slate-700 ml-1">New Password</label>
                            <div className="relative">
                                <input
                                    type={showNewPassword ? "text" : "password"}
                                    name="newPassword"
                                    value={formData.newPassword}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all pl-10"
                                    placeholder="Enter new password"
                                    required
                                />
                                <Lock className="absolute left-3 top-3.5 text-slate-400" size={18} />
                                <button type="button" onClick={() => toggleShowPassword(setShowNewPassword, showNewPassword)} className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600">
                                    {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-semibold text-slate-700 ml-1">Confirm New Password</label>
                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all pl-10"
                                    placeholder="Confirm new password"
                                    required
                                />
                                <Lock className="absolute left-3 top-3.5 text-slate-400" size={18} />
                                <button type="button" onClick={() => toggleShowPassword(setShowConfirmPassword, showConfirmPassword)} className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600">
                                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-3.5 rounded-xl text-white font-semibold transition-all shadow-lg shadow-primary/25 ${loading ? 'bg-slate-400 cursor-not-allowed' : 'bg-gradient-to-r from-primary to-accent hover:opacity-90 hover:scale-[1.02] active:scale-[0.98]'
                                }`}
                        >
                            {loading ? 'Updating Password...' : 'Update Password'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ChangePassword;
