import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { Plus, Trash2, BookOpen, CheckCircle, Pencil, X } from 'lucide-react';

const CourseManagement = () => {
    const { user } = useContext(AuthContext);
    const [courses, setCourses] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        code: '',
        department: 'CSBS',
        credits: '',
        semester: '',
        isCreditTransferEligible: false
    });
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchCourses = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.get(`${import.meta.env.VITE_API_URL || ''}/api/courses`, config);
            setCourses(data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchCourses();
    }, [user.token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const payload = { ...formData, credits: Number(formData.credits), semester: Number(formData.semester) };

            if (isEditing) {
                await axios.put(`${import.meta.env.VITE_API_URL || ''}/api/courses/${editId}`, payload, config);
                alert('Course updated successfully');
            } else {
                await axios.post(`${import.meta.env.VITE_API_URL || ''}/api/courses`, payload, config);
                alert('Course added successfully');
            }

            resetForm();
            fetchCourses();
        } catch (error) {
            console.error(error);
            alert(isEditing ? 'Error updating course' : 'Error adding course');
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({ name: '', code: '', department: 'CSBS', credits: '', semester: '', isCreditTransferEligible: false });
        setIsEditing(false);
        setEditId(null);
    };

    const handleEdit = (course) => {
        setFormData({
            name: course.name,
            code: course.code,
            department: course.department,
            credits: course.credits,
            semester: course.semester,
            isCreditTransferEligible: course.isCreditTransferEligible || false
        });
        setEditId(course._id);
        setIsEditing(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this course?')) {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                await axios.delete(`${import.meta.env.VITE_API_URL || ''}/api/courses/${id}`, config);
                fetchCourses();
            } catch (error) {
                console.error(error);
                alert('Error deleting course');
            }
        }
    };

    return (
        <div className="max-w-6xl mx-auto py-8">
            <h1 className="text-3xl font-bold mb-8 text-primary flex items-center gap-2">
                <BookOpen className="text-primary" /> Course Management
            </h1>

            {/* Add/Edit Course Form */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-8">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                        {isEditing ? <Pencil size={20} /> : <Plus size={20} />}
                        {isEditing ? 'Edit Course' : 'Add New Course'}
                    </h2>
                    {isEditing && (
                        <button onClick={resetForm} className="text-sm text-slate-500 hover:text-red-500 flex items-center gap-1">
                            <X size={16} /> Cancel Edit
                        </button>
                    )}
                </div>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div>
                        <label className="block text-sm font-semibold text-slate-600 mb-1">Course Name</label>
                        <input
                            type="text"
                            className="input-field"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                            placeholder="e.g. Advanced AI"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-slate-600 mb-1">Course Code</label>
                        <input
                            type="text"
                            className="input-field"
                            value={formData.code}
                            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                            required
                            placeholder="e.g. CSBS401"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-slate-600 mb-1">Department</label>
                        <select
                            className="input-field"
                            value={formData.department}
                            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                        >
                            <option value="CSBS">CSBS</option>
                            <option value="CSE">CSE</option>
                            <option value="IT">IT</option>
                            <option value="AIDS">AIDS</option>
                            <option value="ECE">ECE</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-slate-600 mb-1">Credits</label>
                        <input
                            type="number"
                            className="input-field"
                            value={formData.credits}
                            onChange={(e) => setFormData({ ...formData, credits: e.target.value })}
                            required
                            min="1"
                            max="10"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-slate-600 mb-1">Semester</label>
                        <input
                            type="number"
                            className="input-field"
                            value={formData.semester}
                            onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                            required
                            min="1"
                            max="8"
                        />
                    </div>
                    <div className="flex items-end">
                        <label className="flex items-center gap-2 cursor-pointer bg-slate-50 px-4 py-3 rounded-lg border border-slate-200 w-full hover:bg-slate-100 transition-colors">
                            <input
                                type="checkbox"
                                className="w-5 h-5 text-primary rounded focus:ring-primary"
                                checked={formData.isCreditTransferEligible}
                                onChange={(e) => setFormData({ ...formData, isCreditTransferEligible: e.target.checked })}
                            />
                            <span className="text-sm font-semibold text-slate-700">Eligible for Credit Transfer</span>
                        </label>
                    </div>
                    <div className="flex items-end">
                        <button type="submit" className="btn btn-primary w-full justify-center" disabled={loading}>
                            {loading ? (isEditing ? 'Updating...' : 'Adding...') : (isEditing ? 'Update Course' : 'Add Course')}
                        </button>
                    </div>
                </form>
            </div>

            {/* Course List */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                        <BookOpen size={20} className="text-primary" />
                        Existing Courses
                    </h2>
                    <span className="text-sm text-slate-500">{courses.length} courses found</span>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="p-4 font-semibold text-slate-600 text-sm uppercase tracking-wider">Code</th>
                                <th className="p-4 font-semibold text-slate-600 text-sm uppercase tracking-wider">Name</th>
                                <th className="p-4 font-semibold text-slate-600 text-sm uppercase tracking-wider">Dept</th>
                                <th className="p-4 font-semibold text-slate-600 text-sm uppercase tracking-wider">Credits</th>
                                <th className="p-4 font-semibold text-slate-600 text-sm uppercase tracking-wider">Sem</th>
                                <th className="p-4 font-semibold text-slate-600 text-sm uppercase tracking-wider text-center">Transfer Eligible</th>
                                <th className="p-4 font-semibold text-slate-600 text-sm uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {courses.length === 0 ? (
                                <tr><td colSpan="7" className="p-8 text-center text-slate-500">No courses available.</td></tr>
                            ) : (
                                courses.map((course) => (
                                    <tr key={course._id} className="hover:bg-slate-50 transition-colors">
                                        <td className="p-4 font-mono text-slate-600">{course.code}</td>
                                        <td className="p-4 font-medium text-slate-900">{course.name}</td>
                                        <td className="p-4">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                                                {course.department}
                                            </span>
                                        </td>
                                        <td className="p-4 text-slate-600">{course.credits}</td>
                                        <td className="p-4 text-slate-600">{course.semester}</td>
                                        <td className="p-4 text-center">
                                            {course.isCreditTransferEligible ? (
                                                <span className="inline-flex items-center justify-center w-6 h-6 bg-green-100 text-green-600 rounded-full">
                                                    <CheckCircle size={14} />
                                                </span>
                                            ) : (
                                                <span className="text-slate-300 text-xs">-</span>
                                            )}
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleEdit(course)}
                                                    className="text-slate-400 hover:text-primary p-2 hover:bg-slate-100 rounded-lg transition-colors"
                                                    title="Edit Course"
                                                >
                                                    <Pencil size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(course._id)}
                                                    className="text-slate-400 hover:text-red-600 p-2 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Delete Course"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default CourseManagement;
