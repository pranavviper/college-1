import { useState, useContext, useEffect } from 'react';
import AuthContext from '../context/AuthContext';
import axios from 'axios';
import { Check, X, Eye, FileText } from 'lucide-react';
import ApplicationDetailsModal from '../components/ApplicationDetailsModal';

const FacultyDashboard = () => {
    const { user } = useContext(AuthContext);
    const [applications, setApplications] = useState([]);
    const [filter, setFilter] = useState('');
    const [selectedApplication, setSelectedApplication] = useState(null);

    const fetchApplications = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            // Optional: add query params for filter
            const { data } = await axios.get(`${import.meta.env.VITE_API_URL || ''}/api/applications?keyword=${filter}`, config);
            setApplications(data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchApplications();
    }, [user.token, filter]);

    const handleStatusUpdate = async (id, status) => {
        // if (!window.confirm(`Are you sure you want to ${status} this application?`)) return;
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.put(`${import.meta.env.VITE_API_URL || ''}/api/applications/${id}/status`, { status }, config);
            fetchApplications();
        } catch (error) {
            console.error(error);
            alert('Error updating status');
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Faculty Dashboard</h1>
                <div className="flex gap-2">
                    <select className="input-field py-1" value={filter} onChange={(e) => setFilter(e.target.value)}>
                        <option value="">All Departments</option>
                        <option value="CSE">CSE</option>
                        <option value="ECE">ECE</option>
                        <option value="MECH">MECH</option>
                        <option value="IT">IT</option>
                    </select>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-4 font-medium text-slate-500">Application ID</th>
                            <th className="px-6 py-4 font-medium text-slate-500">Student</th>
                            <th className="px-6 py-4 font-medium text-slate-500">Department</th>
                            <th className="px-6 py-4 font-medium text-slate-500">Date</th>
                            <th className="px-6 py-4 font-medium text-slate-500">Status</th>
                            <th className="px-6 py-4 font-medium text-slate-500">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {applications.length === 0 ? (
                            <tr><td colSpan="6" className="px-6 py-8 text-center text-slate-500">No applications found.</td></tr>
                        ) : (
                            applications.map((app) => (
                                <tr key={app._id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-slate-900">#{app._id.slice(-6)}</td>
                                    <td className="px-6 py-4">
                                        <div>{app.student?.name}</div>
                                        <div className="text-xs text-slate-500">{app.student?.registerNumber}</div>
                                    </td>
                                    <td className="px-6 py-4">{app.department}</td>
                                    <td className="px-6 py-4 text-slate-500">{new Date(app.createdAt).toLocaleDateString()}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${app.status === 'Approved' ? 'bg-green-100 text-green-800' :
                                            app.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                                                'bg-yellow-100 text-yellow-800'
                                            }`}>
                                            {app.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            {/* In real app, Eye would open details modal */}
                                            <button className="p-1 text-slate-400 hover:text-accent" title="View Details" onClick={() => setSelectedApplication(app)}>
                                                <Eye size={18} />
                                            </button>

                                            {app.status === 'Pending' && (
                                                <>
                                                    <button
                                                        onClick={() => handleStatusUpdate(app._id, 'Approved')}
                                                        className="p-1 text-green-500 hover:bg-green-50 rounded"
                                                        title="Approve"
                                                    >
                                                        <Check size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleStatusUpdate(app._id, 'Rejected')}
                                                        className="p-1 text-red-500 hover:bg-red-50 rounded"
                                                        title="Reject"
                                                    >
                                                        <X size={18} />
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {selectedApplication && (
                <ApplicationDetailsModal
                    application={selectedApplication}
                    onClose={() => setSelectedApplication(null)}
                    onStatusUpdate={handleStatusUpdate}
                />
            )}
        </div>
    );
};

export default FacultyDashboard;
