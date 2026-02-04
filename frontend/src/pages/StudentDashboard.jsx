import { useState, useContext, useEffect } from 'react';
import AuthContext from '../context/AuthContext';
import axios from 'axios';
import { Plus, FileText, Download, Edit2, Upload } from 'lucide-react';

const StudentDashboard = () => {
    const { user } = useContext(AuthContext);
    const [applications, setApplications] = useState([]);
    const [isApplying, setIsApplying] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);

    // Form State
    const [formData, setFormData] = useState({
        academicYear: '2025-2026', batch: '', semester: '5', cgpa: '', courses: [], internships: []
    });

    const addCourse = () => {
        setFormData({
            ...formData,
            courses: [...formData.courses, {
                courseType: '', recSubjectCode: '', courseName: '', offeringUniversity: '',
                grade: '', droppedElective: '', droppedElectiveCode: '', semester: '', proofFile: ''
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

    const addInternship = () => {
        setFormData({
            ...formData,
            internships: [...formData.internships, {
                industrySubjectCode: '', companyName: '', duration: '', grade: '',
                droppedElective: '', semester: '', proofFile: ''
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

    const handleFileUpload = async (e, type, index) => {
        const file = e.target.files[0];
        if (!file) return;

        const formDataUpload = new FormData();
        formDataUpload.append('file', file);

        try {
            const config = { headers: { 'Content-Type': 'multipart/form-data' } };
            const { data } = await axios.post('http://localhost:5001/api/upload', formDataUpload, config);

            if (type === 'course') {
                updateCourse(index, 'proofFile', data.filePath);
            } else {
                updateInternship(index, 'proofFile', data.filePath);
            }
            alert('PDF Uploaded Successfully!');
        } catch (error) {
            alert(error.response?.data || 'Upload failed. PDF only.');
        }
    };

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/applications`, config);
                setApplications(data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchApplications();
    }, [user.token, isApplying]); // Refetch when done applying

    const handleApply = async (e) => {
        e.preventDefault();
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const payload = {
                ...formData,
                department: user.department,
                registerNumber: user.registerNumber
            };

            if (isEditing) {
                await axios.put(`${import.meta.env.VITE_API_URL}/api/applications/${editId}`, payload, config);
                alert('Application Updated & Resubmitted!');
            } else {
                await axios.post(`${import.meta.env.VITE_API_URL}/api/applications`, payload, config);
                alert('Application Submitted!');
            }

            setIsApplying(false);
            setIsEditing(false);
            setEditId(null);
            setFormData({
                academicYear: '2025-2026', batch: '', semester: '5', cgpa: '', courses: [], internships: []
            });
        } catch (error) {
            alert(error.response?.data?.message || 'Error submitting');
        }
    };

    const handleEdit = (app) => {
        setFormData({
            academicYear: app.academicYear,
            batch: app.batch,
            semester: app.semester,
            cgpa: app.cgpa,
            courses: app.courses || [],
            internships: app.internships || []
        });
        setEditId(app._id);
        setIsEditing(true);
        setIsApplying(true);
    };

    const downloadPDF = async (id) => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/applications/${id}/pdf`, config);
            window.open(`${import.meta.env.VITE_API_URL}${data.pdfUrl}`, '_blank');
        } catch (error) {
            alert('Error generating PDF');
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Student Dashboard</h1>
                {!isApplying && (
                    <button onClick={() => {
                        setIsApplying(true);
                        setIsEditing(false);
                        setFormData({
                            academicYear: '2025-2026', batch: '', semester: '5', cgpa: '', courses: [], internships: []
                        });
                    }} className="btn btn-primary">
                        <Plus size={20} /> New Application
                    </button>
                )}
                {isApplying && (
                    <button onClick={() => {
                        setIsApplying(false);
                        setIsEditing(false);
                    }} className="btn btn-secondary">
                        Cancel
                    </button>
                )}
            </div>

            {isApplying ? (
                <div className="card max-w-4xl mx-auto">
                    <h3 className="text-xl font-bold mb-4">
                        {isEditing ? 'Edit Application' : 'Submit Credit Transfer Request'}
                    </h3>
                    <form onSubmit={handleApply} className="space-y-6">
                        {/* Basic Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Academic Year</label>
                                <input type="text" className="input-field" value={formData.academicYear}
                                    onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })} required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Batch</label>
                                <input type="text" className="input-field" value={formData.batch}
                                    onChange={(e) => setFormData({ ...formData, batch: e.target.value })} required placeholder="e.g. 2022-2026" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Current Semester</label>
                                <input type="text" className="input-field" value={formData.semester}
                                    onChange={(e) => setFormData({ ...formData, semester: e.target.value })} required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Current CGPA</label>
                                <input type="number" step="0.01" className="input-field" value={formData.cgpa}
                                    onChange={(e) => setFormData({ ...formData, cgpa: e.target.value })} required />
                            </div>
                        </div>

                        {/* Online Courses */}
                        <div className="border-t pt-4">
                            <div className="flex justify-between items-center mb-4">
                                <h4 className="font-bold text-lg">Online Courses</h4>
                                <button type="button" onClick={addCourse} className="text-sm text-accent flex items-center gap-1">
                                    <Plus size={16} /> Add Course
                                </button>
                            </div>
                            {formData.courses.map((course, index) => (
                                <div key={index} className="bg-slate-50 p-4 rounded-lg mb-4 border border-slate-200">
                                    <h5 className="font-medium mb-2 text-sm uppercase text-slate-500">Course {index + 1}</h5>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <select className="input-field" value={course.courseType} onChange={(e) => updateCourse(index, 'courseType', e.target.value)} required>
                                            <option value="">Select Credits</option>
                                            <option value="1 Credit">1 Credit</option>
                                            <option value="2 Credits">2 Credits</option>
                                            <option value="3 Credits">3 Credits</option>
                                        </select>
                                        <input type="text" placeholder="REC Subject Code" className="input-field" value={course.recSubjectCode} onChange={(e) => updateCourse(index, 'recSubjectCode', e.target.value)} required />
                                        <input type="text" placeholder="Online Course Name" className="input-field" value={course.courseName} onChange={(e) => updateCourse(index, 'courseName', e.target.value)} required />
                                        <input type="text" placeholder="Offering Institution" className="input-field" value={course.offeringUniversity} onChange={(e) => updateCourse(index, 'offeringUniversity', e.target.value)} required />
                                        <input type="text" placeholder="Final Grade/Score" className="input-field" value={course.grade} onChange={(e) => updateCourse(index, 'grade', e.target.value)} required />
                                        <input type="text" placeholder="Dropped Elective Name" className="input-field" value={course.droppedElective} onChange={(e) => updateCourse(index, 'droppedElective', e.target.value)} required />
                                        <input type="text" placeholder="Dropped Elective Code" className="input-field" value={course.droppedElectiveCode} onChange={(e) => updateCourse(index, 'droppedElectiveCode', e.target.value)} required />
                                        <input type="text" placeholder="Semester" className="input-field" value={course.semester} onChange={(e) => updateCourse(index, 'semester', e.target.value)} required />

                                        <div className="col-span-1 md:col-span-2 mt-2">
                                            <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Upload Result/Certificate (PDF Only)</label>
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="file"
                                                    accept=".pdf"
                                                    onChange={(e) => handleFileUpload(e, 'course', index)}
                                                    className="input-field p-1"
                                                />
                                                {course.proofFile && <span className="text-green-600 text-sm flex items-center gap-1"><FileText size={14} /> Uploaded</span>}
                                            </div>
                                        </div>
                                    </div>
                                    <button type="button" onClick={() => removeCourse(index)} className="text-red-500 text-xs mt-2 underline">Remove</button>
                                </div>
                            ))}
                        </div>

                        {/* Internships */}
                        <div className="border-t pt-4">
                            <div className="flex justify-between items-center mb-4">
                                <h4 className="font-bold text-lg">Industry Internships</h4>
                                <button type="button" onClick={addInternship} className="text-sm text-accent flex items-center gap-1">
                                    <Plus size={16} /> Add Internship
                                </button>
                            </div>
                            {formData.internships.map((internship, index) => (
                                <div key={index} className="bg-slate-50 p-4 rounded-lg mb-4 border border-slate-200">
                                    <h5 className="font-medium mb-2 text-sm uppercase text-slate-500">Internship {index + 1}</h5>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <input type="text" placeholder="Industry Subject Code" className="input-field" value={internship.industrySubjectCode} onChange={(e) => updateInternship(index, 'industrySubjectCode', e.target.value)} required />
                                        <input type="text" placeholder="Industry Name" className="input-field" value={internship.companyName} onChange={(e) => updateInternship(index, 'companyName', e.target.value)} required />
                                        <input type="text" placeholder="Internship Period" className="input-field" value={internship.duration} onChange={(e) => updateInternship(index, 'duration', e.target.value)} required />
                                        <input type="text" placeholder="Final Grade" className="input-field" value={internship.grade} onChange={(e) => updateInternship(index, 'grade', e.target.value)} required />
                                        <input type="text" placeholder="Dropped Elective (Internship)" className="input-field" value={internship.droppedElective} onChange={(e) => updateInternship(index, 'droppedElective', e.target.value)} required />
                                        <input type="text" placeholder="Semester (Internship)" className="input-field" value={internship.semester} onChange={(e) => updateInternship(index, 'semester', e.target.value)} required />

                                        <div className="col-span-1 md:col-span-2 mt-2">
                                            <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Upload Completion Certificate (PDF Only)</label>
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="file"
                                                    accept=".pdf"
                                                    onChange={(e) => handleFileUpload(e, 'internship', index)}
                                                    className="input-field p-1"
                                                />
                                                {internship.proofFile && <span className="text-green-600 text-sm flex items-center gap-1"><FileText size={14} /> Uploaded</span>}
                                            </div>
                                        </div>
                                    </div>
                                    <button type="button" onClick={() => removeInternship(index)} className="text-red-500 text-xs mt-2 underline">Remove</button>
                                </div>
                            ))}
                        </div>

                        <button type="submit" className="btn btn-primary w-full py-3">
                            {isEditing ? 'Update & Resubmit Application' : 'Submit Application'}
                        </button>
                    </form>
                </div>
            ) : (
                <div className="grid gap-6">
                    {applications.length === 0 ? (
                        <p className="text-slate-500">No applications found. Start a new one!</p>
                    ) : (
                        applications.map((app) => (
                            <div key={app._id} className="card flex justify-between items-center">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-bold text-lg">Application #{app._id.slice(-6)}</h3>
                                        <span className={`text-xs px-2 py-1 rounded-full ${app.status === 'Approved' ? 'bg-green-100 text-green-700' :
                                            app.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                                                'bg-yellow-100 text-yellow-700'
                                            }`}>{app.status}</span>
                                    </div>
                                    <p className="text-sm text-slate-500">Submitted on {new Date(app.createdAt).toLocaleDateString()}</p>
                                    <p className="text-sm mt-1">{app.courses.length} Courses for Transfer</p>
                                    {app.remarks && <p className="text-xs text-red-500 mt-2">Remarks: {app.remarks}</p>}
                                </div>
                                <div className="flex gap-2">
                                    {app.status === 'Approved' && (
                                        <button onClick={() => downloadPDF(app._id)} className="btn btn-secondary text-sm">
                                            <Download size={16} /> PDF
                                        </button>
                                    )}
                                    {app.status === 'Rejected' && (
                                        <button onClick={() => handleEdit(app)} className="btn btn-primary text-sm">
                                            <Edit2 size={16} /> Edit
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default StudentDashboard;
