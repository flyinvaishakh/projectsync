import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LayoutDashboard, LogOut } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="glass-nav">
            <div className="container nav-content">
                <Link to="/" className="logo flex items-center gap-2">
                    <LayoutDashboard size={24} color="#3b82f6" />
                    ProjectSync
                </Link>
                <div className="flex items-center gap-4">
                    <span className="text-secondary" style={{color: 'var(--text-secondary)'}}>
                        Welcome, {user?.name}
                    </span>
                    <button onClick={handleLogout} className="premium-btn premium-btn-secondary" style={{display: 'flex', gap: '8px', alignItems: 'center'}}>
                        <LogOut size={18} />
                        Logout
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
