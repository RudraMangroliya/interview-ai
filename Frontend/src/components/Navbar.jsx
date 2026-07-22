import React from 'react'
import { Link, useNavigate } from 'react-router'
import { useAuth } from '../features/auth/hooks/useAuth'
import './navbar.scss'

const Navbar = () => {
    const { user, handleLogout } = useAuth()
    const navigate = useNavigate()

    const onLogout = async () => {
        await handleLogout()
        navigate('/login')
    }

    return (
        <header className="app-navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-brand">
                    <div className="brand-logo">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" fill="url(#navGlow)" />
                            <defs>
                                <linearGradient id="navGlow" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                                    <stop stopColor="#ff2d46" />
                                    <stop offset="1" stopColor="#b3001e" />
                                </linearGradient>
                            </defs>
                        </svg>
                    </div>
                    <span className="brand-title">Interview <span className="highlight">AI</span></span>
                </Link>

                {user ? (
                    <div className="navbar-user">
                        <div className="user-info">
                            <div className="user-avatar">
                                {(user.username || user.email || 'U').charAt(0).toUpperCase()}
                            </div>
                            <span className="user-name">{user.username || user.email.split('@')[0]}</span>
                        </div>
                        <button onClick={onLogout} className="logout-btn" title="Sign Out">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                                <polyline points="16 17 21 12 16 7" />
                                <line x1="21" y1="12" x2="9" y2="12" />
                            </svg>
                            <span>Logout</span>
                        </button>
                    </div>
                ) : (
                    <div className="navbar-auth">
                        <Link to="/login" className="nav-auth-btn nav-auth-btn--login">Login</Link>
                        <Link to="/register" className="nav-auth-btn nav-auth-btn--register">Register</Link>
                    </div>
                )}

            </div>
        </header>
    )
}

export default Navbar
