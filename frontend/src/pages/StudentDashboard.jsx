import { useState, useContext, useEffect } from 'react';
import AuthContext from '../context/AuthContext';
import axios from 'axios';
import { Download, Edit2, User, BookOpen, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const StudentDashboard = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [courses, setCourses] = useState([]);
    const [applications, setApplications] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };

                // Fetch Applications
                const appsRes = await axios.get(`${import.meta.env.VITE_API_URL || ''}/api/applications`, config);
                setApplications(appsRes.data);

                // Fetch Courses
                const coursesRes = await axios.get(`${import.meta.env.VITE_API_URL || ''}/api/courses`, config);
                setCourses(coursesRes.data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }, [user.token]);

    const handleEdit = (app) => {
        navigate('/credit-transfer', { state: { appData: app } });
    };

    const downloadPDF = async (id) => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.get(`${import.meta.env.VITE_API_URL || ''}/api/applications/${id}/pdf`, config);

            const pdfUrl = data.pdfUrl;
            if (pdfUrl.startsWith('http')) {
                window.open(pdfUrl, '_blank');
            } else {
                window.open(`${import.meta.env.VITE_API_URL || ''}${pdfUrl}`, '_blank');
            }
        } catch (error) {
            alert('Error generating PDF');
        }
    };

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Student Dashboard</h1>
                <p className="text-slate-500">Welcome back, {user.name}!</p>
            </div>

            {/* Courses Section */}
            <div className="mb-10">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <BookOpen size={20} className="text-primary" />
                    Available Courses
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses.length === 0 ? (
                        <div className="col-span-full text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-300 text-slate-500">
                            No courses available at the moment.
                        </div>
                    ) : (
                        courses.map((course) => (
                            <div key={course._id} className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="text-xs font-bold px-2 py-1 bg-blue-50 text-blue-700 rounded uppercase tracking-wider">{course.department}</span>
                                    <span className="text-xs font-medium text-slate-500">{course.credits} Credits</span>
                                </div>
                                <h3 className="font-bold text-lg text-slate-800 mb-1">{course.name}</h3>
                                <p className="text-sm text-slate-500 font-mono mb-3">{course.code}</p>
                                <div className="flex items-center justify-between text-xs text-slate-500 border-t border-slate-100 pt-3">
                                    <span>Semester {course.semester}</span>
                                    {/* Placeholder for future action like 'Enroll' or 'View' */}
                                    {/* <button className="text-primary font-medium hover:underline">Details</button> */}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            <div className="mb-6 flex justify-between items-end">
                <div>
                    <h2 className="text-xl font-bold mb-1">My Applications</h2>
                    <p className="text-sm text-slate-500">Track your credit transfer requests</p>
                </div>
                <button onClick={() => navigate('/credit-transfer')} className="btn btn-primary text-sm">
                    <Plus size={16} className="mr-1" /> New Application
                </button>
            </div>

            <div className="grid gap-6">
                {applications.length === 0 ? (
                    <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                        <p className="text-slate-500 mb-4">No applications found.</p>
                        <button onClick={() => navigate('/credit-transfer')} className="btn btn-primary">
                            Create New Application
                        </button>
                    </div>
                ) : (
                    applications.map((app) => (
                        <div key={app._id} className="card flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <h3 className="font-bold text-lg">Application #{app._id.slice(-6)}</h3>
                                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${app.status === 'Approved' ? 'bg-green-100 text-green-700' :
                                        app.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                                            'bg-yellow-100 text-yellow-700'
                                        }`}>{app.status}</span>
                                </div>
                                <div className="text-sm text-slate-500 space-y-1">
                                    <p>Submitted on {new Date(app.createdAt).toLocaleDateString()}</p>
                                    <p>{app.courses.length} Course(s), {app.internships.length} Internship(s)</p>
                                </div>
                                {app.remarks && <p className="text-sm text-red-600 mt-2 bg-red-50 p-2 rounded border border-red-100">Remarks: {app.remarks}</p>}
                            </div>
                            <div className="flex gap-2 w-full md:w-auto">
                                {app.status === 'Approved' && (
                                    <button onClick={() => downloadPDF(app._id)} className="btn btn-secondary text-sm flex-1 md:flex-none justify-center">
                                        <Download size={16} /> PDF
                                    </button>
                                )}
                                {app.status === 'Rejected' && (
                                    <button onClick={() => handleEdit(app)} className="btn btn-primary text-sm flex-1 md:flex-none justify-center">
                                        <Edit2 size={16} /> Edit
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default StudentDashboard;
