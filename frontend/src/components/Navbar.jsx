import { useState, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { LogOut, User, Menu, X, Home, FileText, Briefcase, LayoutDashboard, Calendar, Award, BookOpen } from 'lucide-react';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        setIsMenuOpen(false);
        logout();
        navigate('/login');
    };

    const isActive = (path) => location.pathname === path;

    const NavLink = ({ to, icon: Icon, children }) => (
        <Link
            to={to}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive(to)
                ? 'bg-primary text-white shadow-lg shadow-primary/30'
                : 'text-slate-500 hover:bg-slate-50 hover:text-primary'
                }`}
        >
            <Icon size={20} className={isActive(to) ? 'text-white' : 'group-hover:text-primary transition-colors'} />
            <span className="font-medium">{children}</span>
            {isActive(to) && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white/50" />}
        </Link>
    );

    const MobileNavLink = ({ to, icon: Icon, children, onClick }) => (
        <Link
            to={to}
            onClick={onClick}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive(to) ? 'bg-primary/10 text-primary font-semibold' : 'text-slate-600 hover:bg-slate-50'
                }`}
        >
            <Icon size={20} />
            {children}
        </Link>
    );

    return (
        <>
            {/* Desktop Sidebar */}
            <nav className="hidden md:flex flex-col w-72 h-screen fixed left-0 top-0 bg-white border-r border-slate-100/50 shadow-soft z-50 justify-between py-6 px-4">
                <div>
                    <div className="px-4 mb-10 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white shadow-lg shadow-primary/20">
                            <span className="text-xl font-bold">🎓</span>
                        </div>
                        <div>
                            <h1 className="text-lg font-bold text-slate-800 tracking-tight leading-none">CSBS</h1>
                            <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Portal</p>
                        </div>
                    </div>

                    <div className="flex flex-col gap-1">
                        <p className="px-4 text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 mt-2">Menu</p>
                        <NavLink to="/" icon={Home}>Home</NavLink>

                        {user && (
                            <>
                                <p className="px-4 text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 mt-6">{user.role === 'admin' ? 'Admin Menu' : 'Academic'}</p>
                                {user.role === 'student' && (
                                    <NavLink to="/credit-transfer" icon={FileText}>Credit Transfer</NavLink>
                                )}
                                {user.role !== 'admin' && (
                                    <NavLink to="/od" icon={Briefcase}>OD Request</NavLink>
                                )}
                                {user.role === 'admin' ? (
                                    <>
                                        <NavLink to="/admin" icon={LayoutDashboard}>Dashboard</NavLink>
                                        <NavLink to="/admin/students" icon={User}>Students</NavLink>
                                        <NavLink to="/admin/faculty" icon={Briefcase}>Faculty</NavLink>
                                        <NavLink to="/credit-transfer" icon={FileText}>Credit Application</NavLink>
                                        <NavLink to="/od" icon={Briefcase}>OD Request</NavLink>
                                        <NavLink to="/events" icon={Calendar}>Events</NavLink>
                                    </>
                                ) : (
                                    <NavLink to={user.role === 'faculty' ? "/faculty" : "/student"} icon={LayoutDashboard}>
                                        {user.role === 'faculty' ? 'Applications' : 'Dashboard'}
                                    </NavLink>
                                )}
                                {user.role === 'faculty' && (
                                    <NavLink to="/faculty/courses" icon={BookOpen}>Add Course</NavLink>
                                )}

                                {user.role !== 'admin' && (
                                    <>
                                        <p className="px-4 text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 mt-6">Department</p>
                                        <NavLink to="/events" icon={Calendar}>Events</NavLink>
                                        <NavLink to="/achievements" icon={Award}>Achievements</NavLink>
                                    </>
                                )}
                            </>
                        )}
                    </div>
                </div>

                <div>
                    {user ? (
                        <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border border-slate-100 text-slate-400 shadow-sm">
                                    <User size={20} />
                                </div>
                                <div className="overflow-hidden">
                                    <p className="text-sm font-bold text-slate-800 truncate">{user.name}</p>
                                    <p className="text-xs text-slate-500 capitalize">{user.role}</p>
                                </div>
                            </div>
                            <Link to="/change-password" className="block w-full text-left px-2 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg mb-2 flex items-center gap-2 transition-colors">
                                <div className="w-6 flex justify-center"><span className="text-lg">🔑</span></div> Change Password
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="w-full btn btn-secondary text-sm py-2 flex items-center justify-center gap-2 hover:bg-red-50 hover:text-red-500 hover:border-red-100 transition-colors"
                            >
                                <LogOut size={16} /> Logout
                            </button>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-3 p-4 bg-primary/5 rounded-2xl border border-primary/10">
                            <div className="text-center mb-2">
                                <p className="text-sm font-bold text-slate-800">Welcome Back</p>
                                <p className="text-xs text-slate-500">Please login to continue</p>
                            </div>
                            <Link to="/login" className="btn btn-primary text-sm w-full justify-center shadow-lg shadow-primary/20">Login</Link>
                            <Link to="/register" className="btn btn-ghost text-sm w-full justify-center hover:bg-white">Register</Link>
                        </div>
                    )}
                </div>
            </nav>

            {/* Mobile Header */}
            <div className="md:hidden fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b border-slate-200/50 h-16 flex items-center justify-between px-4 z-50 shadow-sm">
                <Link to="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-sm shadow-md">
                        🎓
                    </div>
                    <span className="font-bold text-slate-800">CSBS Portal</span>
                </Link>
                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="p-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                    {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            {isMenuOpen && (
                <div className="md:hidden fixed inset-0 top-16 bg-white z-40 p-4 flex flex-col animate-in slide-in-from-top-2 overflow-y-auto">
                    <div className="flex flex-col gap-2">
                        <MobileNavLink to="/" icon={Home} onClick={() => setIsMenuOpen(false)}>Home</MobileNavLink>
                    </div>

                    {user ? (
                        <>
                            <div className="my-4 border-t border-slate-100 pt-4">
                                <p className="px-4 text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">{user.role === 'admin' ? 'Admin Menu' : 'Academics'}</p>
                                {user.role === 'student' && (
                                    <MobileNavLink to="/credit-transfer" icon={FileText} onClick={() => setIsMenuOpen(false)}>Credit Transfer</MobileNavLink>
                                )}
                                {user.role !== 'admin' && (
                                    <MobileNavLink to="/od" icon={Briefcase} onClick={() => setIsMenuOpen(false)}>OD Request</MobileNavLink>
                                )}
                                {user.role === 'admin' ? (
                                    <>
                                        <MobileNavLink to="/admin" icon={LayoutDashboard} onClick={() => setIsMenuOpen(false)}>Dashboard</MobileNavLink>
                                        <MobileNavLink to="/admin/students" icon={User} onClick={() => setIsMenuOpen(false)}>Students</MobileNavLink>
                                        <MobileNavLink to="/admin/faculty" icon={Briefcase} onClick={() => setIsMenuOpen(false)}>Faculty</MobileNavLink>
                                        <MobileNavLink to="/credit-transfer" icon={FileText} onClick={() => setIsMenuOpen(false)}>Credit Application</MobileNavLink>
                                        <MobileNavLink to="/od" icon={Briefcase} onClick={() => setIsMenuOpen(false)}>OD Request</MobileNavLink>
                                        <MobileNavLink to="/events" icon={Calendar} onClick={() => setIsMenuOpen(false)}>Events</MobileNavLink>
                                    </>
                                ) : (
                                    <MobileNavLink to={user.role === 'faculty' ? "/faculty" : "/student"} icon={LayoutDashboard} onClick={() => setIsMenuOpen(false)}>
                                        {user.role === 'faculty' ? 'Applications' : 'Dashboard'}
                                    </MobileNavLink>
                                )}
                                {user.role === 'faculty' && (
                                    <MobileNavLink to="/faculty/courses" icon={BookOpen} onClick={() => setIsMenuOpen(false)}>Add Course</MobileNavLink>
                                )}
                            </div>

                            {user.role !== 'admin' && (
                                <div className="mb-4 border-t border-slate-100 pt-4">
                                    <p className="px-4 text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Department</p>
                                    <MobileNavLink to="/events" icon={Calendar} onClick={() => setIsMenuOpen(false)}>Events</MobileNavLink>
                                    <MobileNavLink to="/achievements" icon={Award} onClick={() => setIsMenuOpen(false)}>Achievements</MobileNavLink>
                                </div>
                            )}

                            <div className="mt-auto bg-slate-50 p-4 rounded-xl border border-slate-100">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-slate-400 border border-slate-200">
                                        <User size={20} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-800">{user.name}</p>
                                        <p className="text-xs text-slate-500 capitalize">{user.role}</p>
                                    </div>
                                </div>
                                <Link to="/change-password" className="block w-full text-left p-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg mb-2 flex items-center gap-2 transition-colors">
                                    <div className="w-6 flex justify-center"><span className="text-lg">🔑</span></div> Change Password
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="w-full btn btn-secondary text-sm justify-center text-red-600 hover:bg-red-50 border-slate-200"
                                >
                                    <LogOut size={16} /> Logout
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="mt-auto flex flex-col gap-3">
                            <Link to="/login" onClick={() => setIsMenuOpen(false)} className="btn btn-primary w-full justify-center shadow-lg shadow-primary/20">Login</Link>
                            <Link to="/register" onClick={() => setIsMenuOpen(false)} className="btn btn-secondary w-full justify-center">Register</Link>
                        </div>
                    )}
                </div>
            )}
        </>
    );
};

export default Navbar;
