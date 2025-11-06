import React from "react";
import { Link } from "react-router-dom";
import './Navbar.css';

const Navbar=()=>{
    return(
        <>
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-brand">
                    <img src="/Icon.png" alt="Blog Fly" className="navbar-logo" />
                    Blog Fly
                </Link>
                <ul className="navbar-nav">
                    <li>
                        <Link to="/" className="nav-link">Home</Link>
                    </li>
                </ul>
            </div>
        </nav>
        </>
    )
}

export default Navbar;