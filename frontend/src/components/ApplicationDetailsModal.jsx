import { X, Check } from 'lucide-react';

const ApplicationDetailsModal = ({ application, onClose, onStatusUpdate }) => {
    if (!application) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center p-6 border-b border-slate-200">
                    <h2 className="text-xl font-bold">Application Details #{application._id.slice(-6)}</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                        <X size={24} />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Student Info */}
                    <div className="grid grid-cols-3 gap-4 bg-slate-50 p-4 rounded-lg">
                        <div>
                            <p className="text-xs text-slate-500 uppercase font-semibold">Student Name</p>
                            <p className="font-medium">{application.student?.name}</p>
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 uppercase font-semibold">Register Number</p>
                            <p className="font-medium">{application.student?.registerNumber}</p>
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 uppercase font-semibold">Department</p>
                            <p className="font-medium">{application.department}</p>
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 uppercase font-semibold">Batch</p>
                            <p className="font-medium">{application.batch}</p>
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 uppercase font-semibold">Current CGPA</p>
                            <p className="font-medium">{application.cgpa}</p>
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 uppercase font-semibold">Semester</p>
                            <p className="font-medium">{application.semester}</p>
                        </div>
                    </div>

                    {/* Courses */}
                    {application.courses && application.courses.length > 0 && (
                        <div>
                            <h3 className="font-semibold text-lg mb-3">Online Courses</h3>
                            <div className="space-y-4">
                                {application.courses.map((course, index) => (
                                    <div key={index} className="border border-slate-200 rounded-lg p-4">
                                        <h4 className="font-medium text-accent mb-2">Course {index + 1}</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                            <div>
                                                <p className="text-sm font-medium text-slate-700">Online Course Type</p>
                                                <p className="text-sm text-slate-600">{course.courseType}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-slate-700">REC Subject Code</p>
                                                <p className="text-sm text-slate-600">{course.recSubjectCode}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-slate-700">Course Name</p>
                                                <p className="text-sm text-slate-600">{course.courseName}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-slate-700">Offering Institution</p>
                                                <p className="text-sm text-slate-600">{course.offeringUniversity}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-slate-700">Final Grade</p>
                                                <p className="text-sm text-slate-600">{course.grade}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-slate-700">Semester</p>
                                                <p className="text-sm text-slate-600">{course.semester}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-slate-700">Dropped Elective</p>
                                                <p className="text-sm text-slate-600">{course.droppedElective}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-slate-700">Dropped Elective Code</p>
                                                <p className="text-sm text-slate-600">{course.droppedElectiveCode}</p>
                                            </div>
                                            {course.proofFile && (
                                                <div className="col-span-1 md:col-span-2 lg:col-span-3 mt-2">
                                                    <a
                                                        href={`${import.meta.env.VITE_API_URL || ''}${course.proofFile}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
                                                    >
                                                        <FileText size={16} /> View Certificate
                                                    </a>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Internships if any */}
                    {application.internships && application.internships.length > 0 && (
                        <div>
                            <h3 className="font-semibold text-lg mb-3">Internship Details</h3>
                            {application.internships.map((internship, index) => (
                                <div key={index} className="border border-slate-200 rounded-lg p-4">
                                    <h4 className="font-medium text-accent mb-2">Internship {index + 1}</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        <div>
                                            <p className="text-sm font-medium text-slate-700">Industry Subject Code</p>
                                            <p className="text-sm text-slate-600">{internship.industrySubjectCode}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-slate-700">Industry Name</p>
                                            <p className="text-sm text-slate-600">{internship.companyName}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-slate-700">Internship Period</p>
                                            <p className="text-sm text-slate-600">{internship.duration}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-slate-700">Final Grade</p>
                                            <p className="text-sm text-slate-600">{internship.grade}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-slate-700">Dropped Elective</p>
                                            <p className="text-sm text-slate-600">{internship.droppedElective}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-slate-700">Semester</p>
                                            <p className="text-sm text-slate-600">{internship.semester}</p>
                                        </div>
                                        {internship.proofFile && (
                                            <div className="col-span-1 md:col-span-2 lg:col-span-3 mt-2">
                                                <a
                                                    href={`${import.meta.env.VITE_API_URL || ''}${internship.proofFile}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
                                                >
                                                    <FileText size={16} /> View Completion Certificate
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="p-6 border-t border-slate-200 bg-slate-50 flex justify-end gap-3">
                    <button onClick={onClose} className="btn bg-slate-200 text-slate-800 hover:bg-slate-300">Close</button>
                    {application.status === 'Pending' && onStatusUpdate && (
                        <>
                            <button
                                onClick={() => {
                                    onStatusUpdate(application._id, 'Rejected');
                                    onClose();
                                }}
                                className="btn bg-red-100 text-red-700 hover:bg-red-200 flex items-center gap-2"
                            >
                                <X size={18} /> Reject
                            </button>
                            <button
                                onClick={() => {
                                    onStatusUpdate(application._id, 'Approved');
                                    onClose();
                                }}
                                className="btn bg-green-600 text-white hover:bg-green-700 flex items-center gap-2"
                            >
                                <Check size={18} /> Approve
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ApplicationDetailsModal;
