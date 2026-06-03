import { Menu, X } from "lucide-react";
import { useState } from "react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="navbar bg-base-200 fixed top-0 z-50 shadow-lg">
      <div className="navbar-start">
        <div className="dropdown">
          <button
            tabIndex={0}
            className="btn btn-ghost lg:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
          >
            <li><a href="#services">Services</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </div>
        <a className="btn btn-ghost text-2xl font-bold text-amber-500">
          Atharva Wealth
        </a>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li><a href="#services" className="hover:text-amber-500">Services</a></li>
          <li><a href="#about" className="hover:text-amber-500">About</a></li>
          <li><a href="#contact" className="hover:text-amber-500">Contact</a></li>
        </ul>
      </div>
      <div className="navbar-end">
        <a className="btn btn-outline btn-primary">Client Login</a>
      </div>
    </div>
  );
};

export default Navbar;
