import { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import axios from 'axios';
import { User, BookOpen } from 'lucide-react';

const Home = () => {
    const { user } = useContext(AuthContext);
    const [courses, setCourses] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (user && user.role === 'admin') {
            navigate('/admin');
        }
    }, [user, navigate]);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                const { data } = await axios.get(`${import.meta.env.VITE_API_URL || ''}/api/courses`, config);
                setCourses(data);
            } catch (error) {
                console.error(error);
            }
        };
        if (user) {
            fetchCourses();
        }
    }, [user]);

    return (
        <div className="flex flex-col items-center">
            {user ? (
                // Logged In: Dashboard View
                <div className="w-full max-w-6xl animate-in fade-in zoom-in duration-300">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
                            <p className="text-slate-500 mt-1">Welcome back, {user.name.split(' ')[0]} 👋</p>
                        </div>
                        <div className="text-sm font-medium px-4 py-2 bg-white rounded-lg border border-slate-200 shadow-sm text-slate-600">
                            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </div>
                    </div>

                    {/* Profile Summary Card */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                        <div className="lg:col-span-2 bg-gradient-brand rounded-2xl p-[1px] shadow-lg shadow-primary/10">
                            <div className="bg-white rounded-2xl p-6 h-full flex flex-col md:flex-row items-center md:items-start gap-6 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl pointer-events-none" />

                                <div className="w-24 h-24 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 border border-slate-200 shadow-inner flex-shrink-0">
                                    <User size={40} />
                                </div>
                                <div className="flex-1 text-center md:text-left z-10">
                                    <div className="flex flex-col md:flex-row md:items-center gap-2 mb-1">
                                        <h2 className="text-2xl font-bold text-slate-800">{user.name}</h2>
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold uppercase w-fit mx-auto md:mx-0 ${user.role === 'faculty' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                                            }`}>
                                            {user.role}
                                        </span>
                                    </div>
                                    <p className="text-slate-500 font-medium mb-4">{user.registerNumber}</p>

                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                                            <p className="text-xs text-slate-400 uppercase font-bold mb-1">Department</p>
                                            <p className="text-slate-700 font-semibold">{user.department || 'CSBS'}</p>
                                        </div>
                                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                                            <p className="text-xs text-slate-400 uppercase font-bold mb-1">Email</p>
                                            <p className="text-slate-700 font-semibold truncate" title={user.email}>{user.email}</p>
                                        </div>
                                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                                            <p className="text-xs text-slate-400 uppercase font-bold mb-1">{user.role === 'faculty' ? 'Designation' : 'Semester'}</p>
                                            <p className="text-slate-700 font-semibold">{user.role === 'faculty' ? 'Assistant Prof.' : '5'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Quick Stats / Info */}
                        <div className="bg-gradient-to-br from-primary to-accent rounded-2xl p-6 text-white shadow-lg shadow-primary/20 flex flex-col justify-between relative overflow-hidden">
                            <div className="absolute bottom-0 right-0 opacity-10 transform translate-x-1/4 translate-y-1/4">
                                <BookOpen size={180} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold mb-1 opacity-90">Academic Status</h3>
                                <p className="text-white/70 text-sm mb-6">Current Progress Overview</p>
                            </div>
                            <div className="flex items-end gap-2 z-10">
                                <span className="text-5xl font-bold tracking-tight">
                                    {courses.length}
                                </span>
                                <span className="mb-2 opacity-80 font-medium">Active Subjects</span>
                            </div>
                        </div>
                    </div>

                    {/* Subjects Section */}
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-1 px-3 h-8 bg-primary rounded-full" />
                        <h2 className="text-xl font-bold text-slate-800">
                            Enrolled Subjects
                        </h2>
                    </div>

                    <div className="bg-white rounded-2xl shadow-soft border border-slate-100 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50/50 border-b border-slate-100 text-slate-500 uppercase text-xs font-bold tracking-wider">
                                        <th className="p-5 font-semibold">Code</th>
                                        <th className="p-5 font-semibold">Subject Name</th>
                                        <th className="p-5 font-semibold">Department</th>
                                        <th className="p-5 font-semibold text-center">Credits</th>
                                        <th className="p-5 font-semibold text-center">Semester</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {courses.length === 0 ? (
                                        <tr><td colSpan="5" className="p-8 text-center text-slate-500">No courses available.</td></tr>
                                    ) : (
                                        courses.map((course, index) => (
                                            <tr key={index} className="hover:bg-slate-50/80 transition-colors group">
                                                <td className="p-5 font-medium text-primary group-hover:text-accent transition-colors">{course.code}</td>
                                                <td className="p-5 text-slate-700 font-semibold">{course.name}</td>
                                                <td className="p-5 text-slate-600">
                                                    <span className="px-2 py-1 bg-slate-100 rounded text-xs font-bold">
                                                        {course.department}
                                                    </span>
                                                </td>
                                                <td className="p-5 text-center">
                                                    <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-bold">
                                                        {course.credits}
                                                    </span>
                                                </td>
                                                <td className="p-5 text-center">
                                                    <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-bold">
                                                        Sem {course.semester}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            ) : (
                // Landing Page
                <div className="w-full">
                    {/* Hero Section */}
                    <div className="relative min-h-[85vh] flex flex-col justify-center items-center text-center px-4 py-20 overflow-hidden">
                        {/* Background Elements */}
                        <div className="absolute inset-0 bg-background z-0" />
                        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-30 select-none z-0 pointer-events-none">
                            <div className="absolute top-[-10%] left-[10%] w-[500px] h-[500px] bg-primary rounded-full mix-blend-multiply filter blur-[128px] animate-blob" />
                            <div className="absolute top-[-10%] right-[10%] w-[500px] h-[500px] bg-accent rounded-full mix-blend-multiply filter blur-[128px] animate-blob animation-delay-2000" />
                            <div className="absolute bottom-[-20%] left-[20%] w-[600px] h-[600px] bg-sky-300 rounded-full mix-blend-multiply filter blur-[128px] animate-blob animation-delay-4000" />
                        </div>

                        <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/60 backdrop-blur-sm border border-slate-200 text-sm font-medium text-slate-600 mb-8 shadow-sm">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                Updated for 2026 Academic Year
                            </div>

                            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 mb-6 drop-shadow-sm">
                                Academic Management <br />
                                <span className="bg-gradient-to-r from-primary via-accent to-blue-600 bg-clip-text text-transparent">Reimagined.</span>
                            </h1>

                            <p className="text-xl text-slate-600 mb-10 max-w-2xl leading-relaxed">
                                A unified platform for students and faculty. Manage credit transfers, on-duty requests, and academic progress with a seamless, modern experience.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                                <Link to="/register" className="btn btn-primary px-8 py-4 text-lg shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
                                    Get Started Now
                                </Link>
                                <Link to="/login" className="btn btn-secondary px-8 py-4 text-lg hover:bg-white hover:border-slate-300 hover:shadow-lg transition-all">
                                    Member Login
                                </Link>
                            </div>
                        </div>

                        {/* Feature Cards floating */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 max-w-6xl w-full z-10 px-4">
                            {[
                                { title: 'Credit Transfer', icon: '🔄', desc: 'Seamlessly submit and track credit transfer requests with automated workflow.' },
                                { title: 'OD Management', icon: '📅', desc: 'Digital on-duty requests with instant faculty verification and approval.' },
                                { title: 'Smart Analytics', icon: '📊', desc: 'Real-time insights into academic performance and achievements.' }
                            ].map((feature, idx) => (
                                <div key={idx} className="glass-panel p-8 rounded-2xl hover:-translate-y-1 transition-transform duration-300">
                                    <div className="text-4xl mb-4">{feature.icon}</div>
                                    <h3 className="text-xl font-bold text-slate-800 mb-2">{feature.title}</h3>
                                    <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Home;
