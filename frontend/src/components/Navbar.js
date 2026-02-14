import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
    const { user, isAuthenticated, logout } = useContext(AuthContext);

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-logo">
                    EventHub
                </Link>

                <ul className="navbar-menu">
                    <li>
                        <Link to="/" className="navbar-link">Events</Link>
                    </li>

                    {isAuthenticated() ? (
                        <>
                            <li>
                                <Link to="/dashboard" className="navbar-link">Dashboard</Link>
                            </li>
                            <li className="navbar-user">
                                Welcome, {user?.name}
                            </li>
                            <li>
                                <button onClick={logout} className="navbar-button">
                                    Logout
                                </button>
                            </li>
                        </>
                    ) : (
                        <>
                            <li>
                                <Link to="/login" className="navbar-link">Login</Link>
                            </li>
                            <li>
                                <Link to="/register" className="navbar-button-link">
                                    Register
                                </Link>
                            </li>
                        </>
                    )}
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
