import { useState, useContext, useEffect } from 'react';
import { Briefcase, Clock, FileText, Plus, Check, X } from 'lucide-react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';

const OD = () => {
    const { user } = useContext(AuthContext);
    const [showForm, setShowForm] = useState(false);
    const [odRequests, setOdRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isUploading, setIsUploading] = useState(false);

    const [formData, setFormData] = useState({
        reason: 'Event',
        fromDate: '',
        toDate: '',
        description: '',
        proofFile: null
    });

    useEffect(() => {
        fetchODs();
    }, [user]);

    const fetchODs = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            // Fetch All if faculty, else fetch 'my'
            const endpoint = user.role === 'faculty' ? `${import.meta.env.VITE_API_URL || ''}/api/od` : `${import.meta.env.VITE_API_URL || ''}/api/od/my`;
            const { data } = await axios.get(endpoint, config);
            setOdRequests(data);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id, status) => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.put(`${import.meta.env.VITE_API_URL || ''}/api/od/${id}/status`, { status }, config);
            fetchODs(); // Refresh
        } catch (error) {
            console.error(error);
            alert('Error updating status');
        }
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formDataUpload = new FormData();
        formDataUpload.append('file', file);

        setIsUploading(true);
        try {
            const config = { headers: { 'Content-Type': 'multipart/form-data' } };
            const { data } = await axios.post(`${import.meta.env.VITE_API_URL || ''}/api/upload`, formDataUpload, config);
            setFormData(prev => ({ ...prev, proofFile: data.filePath }));
            alert('Proof Uploaded Successfully!');
        } catch (error) {

            console.error(error);
            alert('File Upload Failed. Please check server connection.');
            setFormData(prev => ({ ...prev, proofFile: null }));
        } finally {
            setIsUploading(false);
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.post(`${import.meta.env.VITE_API_URL || ''}/api/od`, formData, config);

            alert('OD Request Submitted Successfully!');
            setShowForm(false);
            setFormData({
                reason: 'Event',
                fromDate: '',
                toDate: '',
                description: '',
                proofFile: null
            });
            fetchODs(); // Refresh list
        } catch (error) {
            alert(error.response?.data?.message || 'Error submitting OD request');
        }
    };

    // Helper to get correct file URL
    const getFileUrl = (path) => {
        if (!path) return '#';
        if (path.startsWith('http')) return path;
        // Ensure regular file paths are prepended with API URL for browser navigation
        const baseUrl = import.meta.env.VITE_API_URL || '';
        // Remove trailing slash from base if present and leading slash from path
        const cleanBase = baseUrl.replace(/\/$/, '');
        const cleanPath = path.startsWith('/') ? path : `/${path}`;
        return `${cleanBase}${cleanPath}`;
    };

    return (
        <div className="max-w-5xl mx-auto py-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold mb-2 text-slate-800">
                        {user.role === 'faculty' ? 'OD Approvals' : 'On-Duty Requests'}
                    </h1>
                    <p className="text-slate-500">
                        {user.role === 'faculty' ? 'Manage and verify student On-Duty requests.' : 'Manage your OD applications for events, medical leave, etc.'}
                    </p>
                </div>
                {user.role !== 'faculty' && (
                    <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
                        {showForm ? 'Cancel' : <><Plus size={20} /> New OD Request</>}
                    </button>
                )}
            </div>

            {/* Form (Hidden for Faculty) */}
            {showForm && user.role !== 'faculty' && (
                <div className="card mb-10 border-l-4 border-l-primary animate-in slide-in-from-top-4 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <h2 className="text-xl font-bold mb-4 text-slate-800">New OD Application</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1 text-slate-600">Reason Category</label>
                                <select
                                    className="input-field w-full p-2 border rounded"
                                    value={formData.reason}
                                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                                >
                                    <option>Event</option>
                                    <option>Medical</option>
                                    <option>Personal</option>
                                    <option>Symposium</option>
                                    <option>Sports</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1 text-slate-600">Description</label>
                                <input
                                    type="text"
                                    className="input-field w-full p-2 border rounded"
                                    placeholder="Brief details..."
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1 text-slate-600">From Date</label>
                                <input
                                    type="date"
                                    className="input-field w-full p-2 border rounded"
                                    value={formData.fromDate}
                                    onChange={(e) => setFormData({ ...formData, fromDate: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1 text-slate-600">To Date</label>
                                <input
                                    type="date"
                                    className="input-field w-full p-2 border rounded"
                                    value={formData.toDate}
                                    onChange={(e) => setFormData({ ...formData, toDate: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium mb-1 text-slate-600">Upload Proof (Images/PDF)</label>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="file"
                                        className="input-field p-1 w-full border rounded"
                                        onChange={handleFileUpload}
                                        accept=".pdf,.jpg,.png"
                                    />
                                    {formData.proofFile && <span className="text-green-600 text-sm font-bold">Uploaded</span>}
                                    {isUploading && <span className="text-blue-600 text-sm animate-pulse">Uploading...</span>}
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end pt-2">
                            <button disabled={isUploading} type="submit" className="btn btn-primary px-8 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed">
                                {isUploading ? 'Uploading...' : 'Submit Request'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* List */}
            <div className="grid gap-4">
                {loading ? <p>Loading requests...</p> : odRequests.length === 0 ? (
                    <div className="text-center py-10 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                        <p className="text-slate-500">No OD requests found.</p>
                    </div>
                ) : (
                    odRequests.map((od) => (
                        <div key={od._id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all hover:shadow-md">
                            <div className="flex items-start gap-4 w-full">
                                <div className={`p-3 rounded-full shrink-0 ${od.status === 'Approved' ? 'bg-green-100 text-green-600' :
                                    od.status === 'Rejected' ? 'bg-red-100 text-red-600' :
                                        'bg-yellow-100 text-yellow-600'
                                    }`}>
                                    <Briefcase size={24} />
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="font-bold text-lg text-slate-800">{od.reason}</h3>
                                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${od.status === 'Approved' ? 'bg-green-100 text-green-700' :
                                                od.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                                                    'bg-yellow-100 text-yellow-700'
                                                }`}>{od.status}</span>
                                        </div>
                                    </div>

                                    {/* Student details for Faculty */}
                                    {user.role === 'faculty' && od.student && (
                                        <div className="text-sm font-semibold text-slate-700 mb-1">
                                            {od.student.name} <span className="text-slate-400 font-normal">({od.student.registerNumber})</span>
                                        </div>
                                    )}

                                    <p className="text-slate-600 mb-2">{od.description}</p>
                                    <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                                        <span className="flex items-center gap-1">
                                            <Clock size={16} /> {new Date(od.fromDate).toLocaleDateString()} - {new Date(od.toDate).toLocaleDateString()}
                                        </span>
                                        {od.proofFile ? (
                                            <a href={getFileUrl(od.proofFile)} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-1 font-medium">
                                                <FileText size={14} /> View Proof
                                            </a>
                                        ) : (
                                            <span className="text-slate-400 text-xs italic">No Proof Attached</span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Faculty Actions */}
                            {user.role === 'faculty' && od.status === 'Pending' && (
                                <div className="flex gap-2 shrink-0 border-l pl-4 border-slate-100 ml-2">
                                    <button
                                        onClick={() => handleStatusUpdate(od._id, 'Approved')}
                                        className="btn bg-green-50 text-green-600 hover:bg-green-100 p-2 rounded-lg"
                                        title="Approve"
                                    >
                                        <Check size={20} />
                                    </button>
                                    <button
                                        onClick={() => {
                                            if (window.confirm('Reject this request?')) handleStatusUpdate(od._id, 'Rejected');
                                        }}
                                        className="btn bg-red-50 text-red-600 hover:bg-red-100 p-2 rounded-lg"
                                        title="Reject"
                                    >
                                        <X size={20} />
                                    </button>
                                    {od.proofFile && (
                                        <a
                                            href={getFileUrl(od.proofFile)}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="btn bg-blue-50 text-blue-600 hover:bg-blue-100 p-2 rounded-lg"
                                            title="View Proof"
                                        >
                                            <FileText size={20} />
                                        </a>
                                    )}
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default OD;
