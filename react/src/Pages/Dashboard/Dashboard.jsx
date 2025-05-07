import React, { useState } from 'react';
import './Dashboard.css';

import placeholderLogo from './assets/images/logoBrand.png';
import dashboardImage from './assets/images/gridFrame.png';
import forumImage from './assets/images/forum.png';
import loveImage from './assets/images/love.png';
import bellIcon from './assets/images/bell.png'; // Tambahkan gambar lonceng

const Dashboard = () => {
  const [activePage, setActivePage] = useState('Dashboard');
  const [dropdownOpen, setDropdownOpen] = useState(true);

  const renderContent = () => {
    switch (activePage) {
      case 'Dashboard':
        return <img src={dashboardImage} alt="Dashboard" className="placeholder-image" />;
      case 'Forum':
        return <img src={forumImage} alt="Forum" className="placeholder-image" />;
      case 'Kucing':
        return <h2 className="placeholder-text">Matchmaking Kucing</h2>;
      case 'Anjing':
        return <h2 className="placeholder-text">Matchmaking Anjing</h2>;
      default:
        return null;
    }
  };

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="top-header">
        <div className="header-left">
          <img src={placeholderLogo} alt="Logo" className="logo" />
          <span className="logo-text">PURRFECT</span>
        </div>
        <div className="header-right">
          <div className="notification-icon">
            <img src={bellIcon} alt="bell" className="bell-icon" />
            <span className="notification-badge">10</span>
          </div>
          <div className="avatar">
            <span className="avatar-initial">K</span>
            <span className="online-dot"></span>
          </div>
        </div>
      </header>

      {/* Main layout */}
      <div className="main-layout">
        <aside className="sidebar">
          <nav className="nav">
            <div className="nav-item" onClick={() => setActivePage('Dashboard')}>
              <img src={dashboardImage} alt="grid" className="grid" />
              <span>Dashboard</span>
            </div>

            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="matchmaking-button"
                type="button"
              >
                <span className="flex items-center space-x-1">
                  <img src={loveImage} alt="love" className="love" />
                  <span>Matchmaking</span>
                </span>
                <i className={`fas ${dropdownOpen ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
              </button>

              {dropdownOpen && (
                <div className="matchmaking-options">
                  <div className="option-item" onClick={() => setActivePage('Kucing')}>
                    Kucing
                  </div>
                  <div className="option-item" onClick={() => setActivePage('Anjing')}>
                    Anjing
                  </div>
                </div>
              )}
            </div>

            <div className="nav-item" onClick={() => setActivePage('Forum')}>
              <img src={forumImage} alt="forum" className="forum" />
              <span>Forum</span>
            </div>
          </nav>
        </aside>

        <main className="main-content">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
