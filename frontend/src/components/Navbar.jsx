import React, { useRef } from 'react'
import {navbarStyles as s} from '../assets/dummyStyles';
import logo from '../assets/logo.png';
import { Home, Search, Briefcase, UserCog, Bookmark, UserPen } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const navItems = [
  { id: "home", label: "Home", path: "/", icon: <Home size={18} /> },
  { id: "jobs", label: "Jobs", path: "/jobs", icon: <Search size={18} /> },
  {
    id: "companies",
    label: "Companies",
    path: "/companies",
    icon: <Briefcase size={18} />,
  },
  { id: "roles", label: "Roles", path: "/roles", icon: <UserCog size={18} /> },
  { id: "saved", label: "Saved", path: "/saved", icon: <Bookmark size={18} /> },
  {
    id: "contact",
    label: "Contact",
    path: "/contact",
    icon: <UserPen size={18} />,
  },
];
const STORAGE_KEY = "jobportal_user";


const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [activeNavItems, setActiveNavItems] = useState("home");
    const [isHovered, setIsHovered] = useState(null);
    const [user, setUser] = useState(null);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const userMenuRef = useRef(null);


  return (
    <nav className={s.navbar(isScrolled)}>
        <div className={s.container}>
            <div className={s.flexContainer}>
                <div className={s.logoSection}>
                    <div className={s.logoWrapper}>
                        <Link to="/">
                    </div>
                </div>
            </div>
        </div>
    </nav>
  )
}

export default Navbar