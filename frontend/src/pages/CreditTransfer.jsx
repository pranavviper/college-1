import { useState, useContext, useEffect } from 'react';
import AuthContext from '../context/AuthContext';
import axios from 'axios';
import { Plus, FileText, CheckCircle, Trash2, Download, Search } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const CreditTransfer = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);
    const [applicationType, setApplicationType] = useState('online_course'); // 'online_course' or 'internship'

    // Admin View State
    const [adminApplications, setAdminApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // Form State
    const [formData, setFormData] = useState({
        academicYear: '2025-2026',
        batch: '',
        semester: '5',
        courses: [],
        internships: []

    });

    const [eligibleCourses, setEligibleCourses] = useState([]);
    const [isOtherCourse, setIsOtherCourse] = useState({}); // Track "Other" selection per course index

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                const { data } = await axios.get(`${import.meta.env.VITE_API_URL || ''}/api/courses`, config);
                const eligible = data.filter(c => c.isCreditTransferEligible);
                setEligibleCourses(eligible);
            } catch (error) {
                console.error("Error fetching courses", error);
            }
        };
        fetchCourses();
    }, [user.token]);

    const handleCourseSelection = (index, value) => {
        const newCourses = [...formData.courses];

        if (value === 'other') {
            setIsOtherCourse({ ...isOtherCourse, [index]: true });
            newCourses[index]['droppedElective'] = '';
            newCourses[index]['droppedElectiveCode'] = '';
            newCourses[index]['recSubjectCode'] = '';
            newCourses[index]['courseType'] = ''; // Allow manual selection
        } else {
            const selected = eligibleCourses.find(c => c._id === value);
            if (selected) {
                setIsOtherCourse({ ...isOtherCourse, [index]: false });
                newCourses[index]['droppedElective'] = selected.name; // Auto-fill Dropped Elective Name
                newCourses[index]['droppedElectiveCode'] = selected.code; // Auto-fill Dropped Elective Code
                newCourses[index]['recSubjectCode'] = selected.code; // Standard mapping
                newCourses[index]['courseType'] = `${selected.credits} Credits`.endsWith('s') ? `${selected.credits} Credits` : `${selected.credits} Credit`;
                newCourses[index]['semester'] = selected.semester;
                // Keep courseName (Online Course Name) empty or preserve user input if they typed before selecting? 
                // Requirement says "should be manual filled", so we don't overwrite it with selected.name
            }
        }
        setFormData({ ...formData, courses: newCourses });
    };

    useEffect(() => {
        if (user.role === 'admin') {
            fetchAllApplications();
        } else {
            // Check if we are editing an application
            if (location.state && location.state.appData) {
                const app = location.state.appData;
                setFormData({
                    academicYear: app.academicYear || '',
                    batch: app.batch || '',
                    semester: app.semester || '',
                    courses: app.courses || [],
                    internships: app.internships || []
                });
                setEditId(app._id);
                setIsEditing(true);

                // Determine type based on data
                if (app.internships && app.internships.length > 0) {
                    setApplicationType('internship');
                } else {
                    setApplicationType('online_course');
                }
            }
        }
    }, [location.state, user.role]);

    const fetchAllApplications = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.get(`${import.meta.env.VITE_API_URL || ''}/api/applications`, config);
            setAdminApplications(data);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this application?')) {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                await axios.delete(`${import.meta.env.VITE_API_URL || ''}/api/applications/${id}`, config);
                setAdminApplications(prev => prev.filter(app => app._id !== id));
                alert('Application deleted successfully');
            } catch (error) {
                alert('Error deleting application');
            }
        }
    };

    const filteredApplications = adminApplications.filter(app =>
        app.student?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.student?.registerNumber?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // --- Course Helpers ---
    const addCourse = () => {
        setFormData({
            ...formData,
            courses: [...formData.courses, {
                courseType: '3 Credits', // default
                recSubjectCode: '',
                courseName: '',
                offeringUniversity: '', // Organization/Institution
                grade: '',
                droppedElective: '',
                droppedElectiveCode: '', // Although not explicitly in image for all columns, standard to keep
                semester: formData.semester,
                proofFile: ''
            }]
        });
    };

    const updateCourse = (index, field, value) => {
        const newCourses = [...formData.courses];
        newCourses[index][field] = value;
        setFormData({ ...formData, courses: newCourses });
    };

    const removeCourse = (index) => {
        const newCourses = formData.courses.filter((_, i) => i !== index);
        setFormData({ ...formData, courses: newCourses });
    };

    // --- Internship Helpers ---
    const addInternship = () => {
        setFormData({
            ...formData,
            internships: [...formData.internships, {
                industrySubjectCode: '',
                companyName: '',
                duration: '', // Period
                grade: '',
                droppedElective: '',
                semester: formData.semester,
                proofFile: ''
            }]
        });
    };

    const updateInternship = (index, field, value) => {
        const newInternships = [...formData.internships];
        newInternships[index][field] = value;
        setFormData({ ...formData, internships: newInternships });
    };

    const removeInternship = (index) => {
        const newInternships = formData.internships.filter((_, i) => i !== index);
        setFormData({ ...formData, internships: newInternships });
    };

    // --- File Upload ---
    const handleFileUpload = async (e, type, index) => {
        const file = e.target.files[0];
        if (!file) return;

        const formDataUpload = new FormData();
        formDataUpload.append('file', file);

        try {
            const config = { headers: { 'Content-Type': 'multipart/form-data' } };
            const { data } = await axios.post(`${import.meta.env.VITE_API_URL || ''}/api/upload`, formDataUpload, config);

            if (type === 'course') {
                updateCourse(index, 'proofFile', data.filePath);
            } else {
                updateInternship(index, 'proofFile', data.filePath);
            }
            alert('File Uploaded Successfully!');
        } catch (error) {
            console.error(error);
            // Fallback for demo
            if (type === 'course') {
                updateCourse(index, 'proofFile', URL.createObjectURL(file));
            } else {
                updateInternship(index, 'proofFile', URL.createObjectURL(file));
            }
            alert('File attached (mock upload due to connection).');
        }
    };

    // --- Submit ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };

            // Prepare payload based on selection
            const payload = {
                academicYear: formData.academicYear,
                batch: formData.batch,
                semester: formData.semester,
                department: user.department,
                registerNumber: user.registerNumber,
                cgpa: 0, // Defaulting if not strictly required or removed from form
                // Mutually Exclusive Logic
                courses: applicationType === 'online_course' ? formData.courses : [],
                internships: applicationType === 'internship' ? formData.internships : []
            };

            if (isEditing) {
                await axios.put(`${import.meta.env.VITE_API_URL || ''}/api/applications/${editId}`, payload, config);
                alert('Application Updated & Resubmitted!');
            } else {
                await axios.post(`${import.meta.env.VITE_API_URL || ''}/api/applications`, payload, config);
                alert('Application Submitted!');
            }

            navigate('/student');

        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || 'Error submitting application');
        }
    };

    // Admin List View
    if (user.role === 'admin') {
        return (
            <div className="max-w-6xl mx-auto py-8">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-3xl font-bold mb-2 text-primary">All Applications</h1>
                        <p className="text-slate-500">Manage all student credit transfer requests.</p>
                    </div>
                    <div className="relative">
                        <input
                            type="text"
                            className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg w-64 focus:outline-none focus:border-primary"
                            placeholder="Search student..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    {loading ? (
                        <p className="p-8 text-center text-slate-500">Loading applications...</p>
                    ) : filteredApplications.length === 0 ? (
                        <p className="p-8 text-center text-slate-500">No applications found.</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-slate-50 border-b border-slate-200">
                                    <tr>
                                        <th className="p-4 font-semibold text-slate-600 text-sm uppercase tracking-wider">Student</th>
                                        <th className="p-4 font-semibold text-slate-600 text-sm uppercase tracking-wider">Department</th>
                                        <th className="p-4 font-semibold text-slate-600 text-sm uppercase tracking-wider">Type</th>
                                        <th className="p-4 font-semibold text-slate-600 text-sm uppercase tracking-wider">Status</th>
                                        <th className="p-4 font-semibold text-slate-600 text-sm uppercase tracking-wider">Date</th>
                                        <th className="p-4 font-semibold text-slate-600 text-sm uppercase tracking-wider text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {filteredApplications.map((app) => (
                                        <tr key={app._id} className="hover:bg-slate-50 transition-colors">
                                            <td className="p-4">
                                                <div className="font-bold text-slate-800">{app.student?.name || 'Unknown'}</div>
                                                <div className="text-xs text-slate-500">{app.student?.registerNumber}</div>
                                            </td>
                                            <td className="p-4 text-sm text-slate-600">{app.department}</td>
                                            <td className="p-4">
                                                {app.courses?.length > 0 ? (
                                                    <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded text-xs font-semibold">Online Course</span>
                                                ) : (
                                                    <span className="px-2 py-1 bg-purple-50 text-purple-600 rounded text-xs font-semibold">Internship</span>
                                                )}
                                            </td>
                                            <td className="p-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-bold ${app.status === 'Approved' ? 'bg-green-100 text-green-700' :
                                                    app.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                                                        'bg-yellow-100 text-yellow-700'
                                                    }`}>
                                                    {app.status}
                                                </span>
                                            </td>
                                            <td className="p-4 text-sm text-slate-500">
                                                {new Date(app.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="p-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    {app.status === 'Approved' && (
                                                        <button className="p-2 text-slate-500 hover:text-primary hover:bg-slate-100 rounded-lg transition-colors" title="Download PDF">
                                                            <Download size={18} />
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => handleDelete(app._id)}
                                                        className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                        title="Delete"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // Default Student Form View
    return (
        <div className="max-w-4xl mx-auto py-8">
            <h1 className="text-3xl font-bold mb-8 text-center text-primary">
                {isEditing ? 'Edit Application' : 'Credit Transfer Request Form'}
            </h1>

            <form onSubmit={handleSubmit} className="space-y-8">

                {/* Segment 1: Personal Details */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <h2 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-3 mb-4 uppercase tracking-wide">
                        1. Student Details
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-slate-600 mb-1">Name of the Student</label>
                            <input type="text" className="input-field bg-slate-50" value={user.name} disabled />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-600 mb-1">Register Number</label>
                            <input type="text" className="input-field bg-slate-50" value={user.registerNumber} disabled />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-600 mb-1">Department</label>
                            <input type="text" className="input-field bg-slate-50" value={user.department} disabled />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-600 mb-1">Batch <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                className="input-field"
                                value={formData.batch}
                                onChange={(e) => setFormData({ ...formData, batch: e.target.value })}
                                required
                                placeholder="e.g. 2023-2027"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-600 mb-1">Academic Year</label>
                            <input
                                type="text"
                                className="input-field"
                                value={formData.academicYear}
                                onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-600 mb-1">Current Semester</label>
                            <select
                                className="input-field"
                                value={formData.semester}
                                onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                            >
                                {[...Array(8)].map((_, i) => (
                                    <option key={i} value={i + 1}>{i + 1}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Segment 2: Application Type */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <h2 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-3 mb-4 uppercase tracking-wide">
                        2. Application Category
                    </h2>
                    <div className="flex gap-4 p-1 bg-slate-100 rounded-lg">
                        <button
                            type="button"
                            onClick={() => setApplicationType('online_course')}
                            className={`flex-1 py-3 px-4 rounded-md font-semibold text-sm transition-all ${applicationType === 'online_course'
                                ? 'bg-white text-primary shadow-sm ring-1 ring-slate-200'
                                : 'text-slate-500 hover:text-slate-700'
                                }`}
                        >
                            Online Course
                        </button>
                        <button
                            type="button"
                            onClick={() => setApplicationType('internship')}
                            className={`flex-1 py-3 px-4 rounded-md font-semibold text-sm transition-all ${applicationType === 'internship'
                                ? 'bg-white text-primary shadow-sm ring-1 ring-slate-200'
                                : 'text-slate-500 hover:text-slate-700'
                                }`}
                        >
                            Industry Internship
                        </button>
                    </div>
                    <p className="text-xs text-orange-600 mt-2 font-medium">
                        * Note: You can request credit transfer for EITHER Online Courses OR Industry Internship, not both in the same request.
                    </p>
                </div>

                {/* Segment 3: Details */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <h2 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-3 mb-4 uppercase tracking-wide">
                        3. {applicationType === 'online_course' ? 'Online Course Details' : 'Internship Details'}
                    </h2>

                    {applicationType === 'online_course' ? (
                        /* Online Course Form */
                        <div className="space-y-6">
                            {formData.courses.map((course, index) => (
                                <div key={index} className="bg-slate-50 p-5 rounded-lg border border-slate-200 relative group">
                                    <div className="absolute top-4 right-4">
                                        <button type="button" onClick={() => removeCourse(index)} className="text-red-400 hover:text-red-600">
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                    <h5 className="font-bold text-slate-700 mb-4 text-sm uppercase">Course #{index + 1}</h5>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="md:col-span-2">
                                            <label className="label-text">Select Professional Elective to be Dropped</label>
                                            <select
                                                className="input-field mb-2"
                                                onChange={(e) => handleCourseSelection(index, e.target.value)}
                                            >
                                                <option value="">-- Select Eligible Course --</option>
                                                {eligibleCourses.map(c => (
                                                    <option key={c._id} value={c._id}>{c.name} ({c.code}) - {c.credits} Credits</option>
                                                ))}
                                                <option value="other">Other (Manual Entry)</option>
                                            </select>
                                        </div>

                                        <div className="md:col-span-2">
                                            <label className="label-text">Name of Online Course</label>
                                            <input
                                                type="text"
                                                className="input-field"
                                                placeholder="e.g. Joy of Computing using Python"
                                                value={course.courseName}
                                                onChange={(e) => updateCourse(index, 'courseName', e.target.value)}
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="label-text">Credits</label>
                                            <select className="input-field" value={course.courseType} onChange={(e) => updateCourse(index, 'courseType', e.target.value)} disabled={!isOtherCourse[index] && course.courseName !== ''}>
                                                <option value="1 Credit">1 Credit</option>
                                                <option value="2 Credits">2 Credits</option>
                                                <option value="3 Credits">3 Credits</option>
                                                <option value="4 Credits">4 Credits</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="label-text">Subject Code</label>
                                            <input type="text" className="input-field" placeholder="e.g. CS19P12" value={course.recSubjectCode} onChange={(e) => updateCourse(index, 'recSubjectCode', e.target.value)} required />
                                        </div>

                                        <div className="md:col-span-2">
                                            <label className="label-text">Name of Organization / Institution</label>
                                            <input type="text" className="input-field" placeholder="e.g. NPTEL / Coursera" value={course.offeringUniversity} onChange={(e) => updateCourse(index, 'offeringUniversity', e.target.value)} required />
                                        </div>
                                        <div>
                                            <label className="label-text">Final Grade Obtained</label>
                                            <input type="text" className="input-field" placeholder="e.g. Elite / 90%" value={course.grade} onChange={(e) => updateCourse(index, 'grade', e.target.value)} required />
                                        </div>
                                        <div>
                                            <label className="label-text">Semester</label>
                                            <input type="text" className="input-field" value={course.semester} onChange={(e) => updateCourse(index, 'semester', e.target.value)} required />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="label-text">Professional Elective to be Dropped (Auto-filled)</label>
                                            <div className="grid grid-cols-2 gap-2">
                                                <input
                                                    type="text"
                                                    className="input-field bg-slate-50"
                                                    placeholder="Code (e.g. CB19P49)"
                                                    value={course.droppedElectiveCode}
                                                    onChange={(e) => updateCourse(index, 'droppedElectiveCode', e.target.value)}
                                                    required
                                                />
                                                <input
                                                    type="text"
                                                    className="input-field bg-slate-50"
                                                    placeholder="Name (e.g. Cryptography)"
                                                    value={course.droppedElective}
                                                    onChange={(e) => updateCourse(index, 'droppedElective', e.target.value)}
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="md:col-span-2 mt-2">
                                            <label className="label-text mb-2 block">Upload Certificate (PDF)</label>
                                            <div className="flex items-center gap-3">
                                                <label className="flex items-center justify-center px-4 py-2 border border-slate-300 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors bg-white text-slate-600 text-sm font-medium">
                                                    <span>Choose File</span>
                                                    <input type="file" className="hidden" accept=".pdf" onChange={(e) => handleFileUpload(e, 'course', index)} />
                                                </label>
                                                {course.proofFile ? (
                                                    <span className="text-green-600 text-sm flex items-center gap-1 font-medium bg-green-50 px-2 py-1 rounded">
                                                        <CheckCircle size={14} /> Attached
                                                    </span>
                                                ) : <span className="text-slate-400 text-xs italic">No file chosen</span>}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <button type="button" onClick={addCourse} className="btn-secondary w-full flex justify-center py-3 border-dashed border-2">
                                <Plus size={18} /> Add Another Course
                            </button>
                        </div>
                    ) : (
                        /* Internship Form */
                        <div className="space-y-6">
                            {formData.internships.map((internship, index) => (
                                <div key={index} className="bg-slate-50 p-5 rounded-lg border border-slate-200 relative group">
                                    <div className="absolute top-4 right-4">
                                        <button type="button" onClick={() => removeInternship(index)} className="text-red-400 hover:text-red-600">
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                    <h5 className="font-bold text-slate-700 mb-4 text-sm uppercase">Internship #{index + 1}</h5>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="label-text">Subject Code for Internship</label>
                                            <input type="text" className="input-field" value={internship.industrySubjectCode} onChange={(e) => updateInternship(index, 'industrySubjectCode', e.target.value)} required />
                                        </div>
                                        <div>
                                            <label className="label-text">Name of Industry</label>
                                            <input type="text" className="input-field" value={internship.companyName} onChange={(e) => updateInternship(index, 'companyName', e.target.value)} required />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="label-text">Period (Duration)</label>
                                            <input type="text" className="input-field" placeholder="e.g. 6 weeks" value={internship.duration} onChange={(e) => updateInternship(index, 'duration', e.target.value)} required />
                                        </div>
                                        <div>
                                            <label className="label-text">Final Grade Obtained</label>
                                            <input type="text" className="input-field" value={internship.grade} onChange={(e) => updateInternship(index, 'grade', e.target.value)} required />
                                        </div>
                                        <div>
                                            <label className="label-text">Semester</label>
                                            <input type="text" className="input-field" value={internship.semester} onChange={(e) => updateInternship(index, 'semester', e.target.value)} required />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="label-text">Professional Elective to be Dropped</label>
                                            <input type="text" className="input-field" placeholder="Name of Subject" value={internship.droppedElective} onChange={(e) => updateInternship(index, 'droppedElective', e.target.value)} required />
                                        </div>

                                        <div className="md:col-span-2 mt-2">
                                            <label className="label-text mb-2 block">Upload Internship Certificate (PDF)</label>
                                            <div className="flex items-center gap-3">
                                                <label className="flex items-center justify-center px-4 py-2 border border-slate-300 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors bg-white text-slate-600 text-sm font-medium">
                                                    <span>Choose File</span>
                                                    <input type="file" className="hidden" accept=".pdf" onChange={(e) => handleFileUpload(e, 'internship', index)} />
                                                </label>
                                                {internship.proofFile ? (
                                                    <span className="text-green-600 text-sm flex items-center gap-1 font-medium bg-green-50 px-2 py-1 rounded">
                                                        <CheckCircle size={14} /> Attached
                                                    </span>
                                                ) : <span className="text-slate-400 text-xs italic">No file chosen</span>}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <button type="button" onClick={addInternship} className="btn-secondary w-full flex justify-center py-3 border-dashed border-2">
                                <Plus size={18} /> Add Another Internship
                            </button>
                        </div>
                    )}
                </div>

                <div className="pt-4">
                    <button type="submit" className="btn btn-primary w-full py-4 text-lg font-bold shadow-lg shadow-primary/20">
                        {isEditing ? 'Update Request' : 'Submit Transfer Request'}
                    </button>
                    <p className="text-center text-xs text-slate-400 mt-4">
                        By submitting, you declare that the information provided is valid and the certificates are authentic.
                    </p>
                </div>
            </form>

            <style>{`
                .label-text {
                    display: block;
                    font-size: 0.875rem;
                    font-weight: 500;
                    color: #475569;
                    margin-bottom: 0.25rem;
                }
            `}</style>
        </div>
    );
};

export default CreditTransfer;
