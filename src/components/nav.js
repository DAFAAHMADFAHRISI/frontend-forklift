import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
    return (
        <nav className="bg-gray-800 p-4">
            <ul className="flex space-x-6">
                <li>
                    <Link to="/" className="text-white hover:text-gray-300">Home</Link>
                </li>
                <li>
                    <Link to="/unit" className="text-white hover:text-gray-300">Unit</Link>
                </li>
                <li>
                    <Link to="/produk" className="text-white hover:text-gray-300">About</Link>
                </li>
            </ul>
        </nav>
    );
}

export default Navbar;
