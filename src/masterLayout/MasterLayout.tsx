import React, { useState, type PropsWithChildren } from "react";
import { Icon } from "@iconify/react";
import { Link, NavLink } from "react-router-dom";
import "../App.css";

const MasterLayout = ({ children }: PropsWithChildren) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
      {/* Mobile Overlay */}
      <div 
        className={`sidebar-overlay ${sidebarOpen ? "active" : ""}`} 
        onClick={() => setSidebarOpen(false)}
      ></div>

      <aside className={`sidebar ${sidebarOpen ? "mobile-open" : ""}`}>
        <div className="sidebar-header">
          <Link to="/" className="sidebar-logo">
            <img src="./Layer_1.png" alt="montr" />
          </Link>
          <button className="mobile-close" onClick={() => setSidebarOpen(false)}>
            <Icon icon="lucide:x" />
          </button>
        </div>

        <nav className="sidebar-nav">
          <ul>
            {menuItems.map((item) => (
              <li key={item.name}>
                <NavLink 
                  to={item.path} 
                  className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
                  onClick={() => setSidebarOpen(false)}
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
        {/* Mobile Header Toggle */}
        <header className="mobile-top-bar">
          <button className="menu-toggle" onClick={() => setSidebarOpen(true)}>
            <Icon icon="lucide:menu" />
          </button>
          <img src="./Layer_1.png" alt="logo" className="mobile-logo" />
        </header>

        <div className="page-body">{children}</div>
      </main>
    </div>
  );
};

export default MasterLayout;