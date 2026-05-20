import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Plus, ArrowLeft, Calendar, Trash2 } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const ProjectDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const [project, setProject] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [newTaskDesc, setNewTaskDesc] = useState('');

    useEffect(() => {
        fetchProjectData();
    }, [id]);

    const fetchProjectData = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const [projRes, tasksRes] = await Promise.all([
                axios.get(`${API_URL}/api/projects/${id}`, config),
                axios.get(`${API_URL}/api/tasks/project/${id}`, config)
            ]);
            setProject(projRes.data);
            setTasks(tasksRes.data);
        } catch (error) {
            console.error('Error fetching project data:', error);
        }
    };

    const handleCreateTask = async (e) => {
        e.preventDefault();
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.post(`${API_URL}/api/tasks`, {
                title: newTaskTitle,
                description: newTaskDesc,
                project: id
            }, config);
            setIsTaskModalOpen(false);
            setNewTaskTitle('');
            setNewTaskDesc('');
            fetchProjectData();
        } catch (error) {
            console.error('Error creating task:', error);
        }
    };

    const handleUpdateTaskStatus = async (taskId, newStatus) => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.put(`${API_URL}/api/tasks/${taskId}`, { status: newStatus }, config);
            fetchProjectData();
        } catch (error) {
            console.error('Error updating task:', error);
        }
    };

    const handleDeleteTask = async (taskId) => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.delete(`${API_URL}/api/tasks/${taskId}`, config);
            fetchProjectData();
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    };

    const renderTasksByStatus = (status) => {
        return tasks.filter(t => t.status === status).map(task => (
            <div key={task._id} className="task-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <h4 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>{task.title}</h4>
                    <button onClick={() => handleDeleteTask(task._id)} style={{ color: 'var(--danger)', padding: '4px' }}>
                        <Trash2 size={16} />
                    </button>
                </div>
                <p>{task.description}</p>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
                    <select 
                        className="premium-input" 
                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.875rem', width: 'auto' }}
                        value={task.status}
                        onChange={(e) => handleUpdateTaskStatus(task._id, e.target.value)}
                    >
                        <option value="To Do">To Do</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Done">Done</option>
                    </select>
                    
                    {task.assignedTo && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                            <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'var(--accent-primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                {task.assignedTo.name.charAt(0)}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        ));
    };

    if (!project) return <div className="container" style={{ marginTop: '2rem' }}>Loading...</div>;

    return (
        <div className="container animate-fade-in-up">
            <div style={{ marginTop: '2rem' }}>
                <button onClick={() => navigate('/')} className="premium-btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '0.5rem 1rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                    <ArrowLeft size={16} />
                    Back to Dashboard
                </button>
            </div>

            <div className="page-header">
                <div>
                    <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{project.name}</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>{project.description}</p>
                </div>
                <button className="premium-btn" onClick={() => setIsTaskModalOpen(true)} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <Plus size={20} />
                    Add Task
                </button>
            </div>

            <div className="task-board">
                <div className="task-column">
                    <div className="task-column-header">
                        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#94a3b8' }}></div>
                            To Do
                        </span>
                        <span style={{ color: 'var(--text-secondary)' }}>{tasks.filter(t => t.status === 'To Do').length}</span>
                    </div>
                    {renderTasksByStatus('To Do')}
                </div>

                <div className="task-column">
                    <div className="task-column-header">
                        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f59e0b' }}></div>
                            In Progress
                        </span>
                        <span style={{ color: 'var(--text-secondary)' }}>{tasks.filter(t => t.status === 'In Progress').length}</span>
                    </div>
                    {renderTasksByStatus('In Progress')}
                </div>

                <div className="task-column">
                    <div className="task-column-header">
                        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e' }}></div>
                            Done
                        </span>
                        <span style={{ color: 'var(--text-secondary)' }}>{tasks.filter(t => t.status === 'Done').length}</span>
                    </div>
                    {renderTasksByStatus('Done')}
                </div>
            </div>

            {isTaskModalOpen && (
                <div className="modal-overlay" onClick={() => setIsTaskModalOpen(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <h2 style={{ marginBottom: '1.5rem' }}>Add New Task</h2>
                        <form onSubmit={handleCreateTask}>
                            <div className="form-group">
                                <label>Task Title</label>
                                <input 
                                    type="text" 
                                    className="premium-input" 
                                    value={newTaskTitle}
                                    onChange={(e) => setNewTaskTitle(e.target.value)}
                                    required 
                                    placeholder="e.g., Update Login Screen"
                                />
                            </div>
                            <div className="form-group">
                                <label>Description</label>
                                <textarea 
                                    className="premium-input" 
                                    value={newTaskDesc}
                                    onChange={(e) => setNewTaskDesc(e.target.value)}
                                    rows="3"
                                    placeholder="Task details"
                                ></textarea>
                            </div>
                            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '2rem' }}>
                                <button type="button" className="premium-btn premium-btn-secondary" onClick={() => setIsTaskModalOpen(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className="premium-btn">
                                    Create Task
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProjectDetail;
