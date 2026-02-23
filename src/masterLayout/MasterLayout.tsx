import React, { useState, type PropsWithChildren } from "react";
import { Icon } from "@iconify/react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import "../App.css";
const MasterLayout = ({ children } : PropsWithChildren) => {
  const [sidebarActive] = useState(false);
  // const navigate = useNavigate();

  const menuItems = [
    { name: "Dashboard", icon: "lucide:layout-dashboard", path: "/" },
    { name: "Applications", icon: "lucide:layers", path: "/applications" },
    { name: "Payment", icon: "lucide:credit-card", path: "/payment" },
    { name: "Contracts", icon: "lucide:file-text", path: "/contracts" },
    { name: "User", icon: "lucide:user", path: "/user" },
    { name: "Subscription", icon: "lucide:award", path: "/subscription" },
    { name: "Reports", icon: "lucide:bar-chart-3", path: "/reports" },
    { name: "Integrations", icon: "lucide:component", path: "/integrations" },
    { name: "Support", icon: "lucide:headphones", path: "/support" },
  ];

  return (
    <div className="layout-wrapper">
      <aside className={`sidebar ${sidebarActive ? "collapsed" : ""}`}>
        <div className="sidebar-header">
          <Link to="/" className="sidebar-logo">
            <img src="./Layer_1.png" alt="montr" />
          </Link>
        </div>

        <nav className="sidebar-nav">
          <ul>
            {menuItems.map((item) => (
              <li key={item.name}>
                <NavLink 
                  to={item.path} 
                  className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
                >
                  <Icon icon={item.icon} className="nav-icon" />
                  <span className="nav-label">{item.name}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      <main className="main-content">
        <div className="page-body">{children}</div>
      </main>
    </div>
  );
};

export default MasterLayout;