import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import styles from './Navbar.module.css';
import { Squash as Hamburger } from 'hamburger-react';

const Navbar = ({ toggleMenu, menuOpen }) => {
  const [isOpen, setOpen] = useState(false);

  // Reset isOpen state when menuOpen changes
  useEffect(() => {
    if (!menuOpen) {
      setOpen(false);
    }
  }, [menuOpen]);

  const handleToggle = () => {
    setOpen(!isOpen);
    toggleMenu(); // This function will still be used to control the menu state.
  };

  return (
    <div className="relative p-4">
      <div className="flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-[var(--color-secondary)]">Shagun Khare</Link>
        
        {/* Replace the div with Hamburger */}
        <div className="relative z-50"> {/* Ensure it's on top of the menu */}
          <Hamburger
            toggled={isOpen}
            toggle={handleToggle}
            color="var(--color-secondary)"
            size={24} // Adjust the size to your preference
            duration={0.5} // Adjust the animation duration
          />
        </div>
      </div>

      {menuOpen && (
        <div className="fixed inset-0 bg-[var(--color-primary)] flex flex-col justify-center items-center text-center text-5xl z-40">
          {/* Add some padding to the top to prevent the hamburger icon from overlapping */}
          <NavLink 
            to="/" 
            className={({ isActive }) => 
              isActive ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink
            }
            onClick={toggleMenu}
          >
            Home
          </NavLink>
          <NavLink 
            to="/writing" 
            className={({ isActive }) => 
              isActive ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink
            }
            onClick={toggleMenu}
          >
            Writing
          </NavLink>
          <NavLink 
            to="/about" 
            className={({ isActive }) => 
              isActive ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink
            }
            onClick={toggleMenu}
          >
            About
          </NavLink>
        </div>
      )}
    </div>
  );
};

export default Navbar;
