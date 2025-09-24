import React from "react";
import { Link } from "react-router-dom";
import Notion from "../assets/Notion_Press_Logo.png";

const Navbar: React.FC = () => {
    return (
        <nav className="bg-gray-200 px-6 py-2 flex justify-between items-center">
            <div className="flex items-center space-x-2">
                <img src={Notion} alt="Notion Press Logo" className="h-10 w-auto" />
                <span className="text-gray-500 font-semibold text-lg">Notion Press</span>
            </div>

            <div className="space-x-4">
                <Link to="/" className="bg-[#FF5A5F] px-3 py-1 rounded text-white">Home</Link>
                <Link to="/books" className="bg-[#FF5A5F] px-3 py-1 rounded text-white">Books</Link>
                <Link to="/login" className="bg-[#FF5A5F] px-3 py-1 rounded text-white">Login</Link>
            </div>
        </nav>
    );
};

export default Navbar;
