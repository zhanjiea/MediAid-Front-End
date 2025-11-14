import { NavLink } from "react-router-dom";
import { useState } from "react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const linkClasses = ({ isActive }) =>
    isActive
      ? "text-[#0A033C] underline"
      : "text-[#0A033C]"

  return (
    <div className="flex justify-between items-center h-[90px]">
      {/* Logo */}
      <h1 className="text-[#0A033C] font-bold text-xl">MediAid</h1>

      {/* Desktop Menu */}
      <ul className="hidden md:flex items-center gap-[50px]">
        <li><NavLink to="/" className={linkClasses}>Dashboard</NavLink></li>
        <li><NavLink to="/courses" className={linkClasses}>Courses</NavLink></li>
        <li><NavLink to="/badge" className={linkClasses}>Badge</NavLink></li>
        <li><NavLink to="/exam" className={linkClasses}>Exam</NavLink></li>
        <li><NavLink to="/account" className={linkClasses}>My Account</NavLink></li>
      </ul>

      {/* Hamburger Button (Mobile Only) */}
      <button
        className="md:hidden text-[#0A033C] text-3xl transition-transform duration-200 hover:scale-125 hover:text-[#4A3AFF]"
        onClick={() => setIsOpen(!isOpen)}
      >
        ☰
      </button>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-[90px] left-0 w-full shadow-lg bg-white flex flex-col items-start px-6 py-4 gap-4 md:hidden">
          <NavLink to="/" onClick={() => setIsOpen(false)} className={linkClasses}>Dashboard</NavLink>
          <NavLink to="/courses" onClick={() => setIsOpen(false)} className={linkClasses}>Courses</NavLink>
          <NavLink to="/badge" onClick={() => setIsOpen(false)} className={linkClasses}>Badge</NavLink>
          <NavLink to="/exam" onClick={() => setIsOpen(false)} className={linkClasses}>Exam</NavLink>
          <NavLink to="/account" onClick={() => setIsOpen(false)} className={linkClasses}>My Account</NavLink>
        </div>
      )}
    </div>
  );
};

export default Navbar;
