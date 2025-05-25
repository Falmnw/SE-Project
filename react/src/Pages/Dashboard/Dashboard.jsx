// Dashboard.jsx
import React, { useState } from 'react';
import './Dashboard.css';

import placeholderLogo from './assets/images/logoBrand.png';
import dashboardImage from './assets/images/gridFrame.png';
import forumImage from './assets/images/forum.png';
import loveImage from './assets/images/love.png'; 
import loveIcon from './assets/images/loveIcon.png'; 
import bellIcon from './assets/images/bell.png';
import pawIcon from './assets/images/paw.png';
import dogIcon from './assets/images/dogLogo.png';
import catIcon from './assets/images/catLogo.png';
import reverseIcon from './assets/images/reverse.png';


const Dashboard = () => {
  const [activePage, setActivePage] = useState('Dashboard');
  const [dropdownOpen, setDropdownOpen] = useState(true);

  const renderContent = () => {
    switch (activePage) {
      case 'Dashboard':
  return (
    <div className="overview-tab">
      <h1 className="tab-title">Overview</h1>
      
      <div className="stats-section">
        {/* Pet Count Card */}
        <div className="stat-card">
          <div className="stat-header">
            <img src={pawIcon} alt="Breeding" className="stat-icon" />
            <h3>Jumlah Hewan Peliharaan</h3>
          </div>
          <ul className="stat-list">
            <li>
              <img src={catIcon} alt="Cat" className="animal-icon" />
              <span className="stat-value">2</span>
              <span className="stat-labelCat">Kucing</span>
            </li>
            <li>
              <img src={dogIcon} alt="Dog" className="animal-icon" />
              <span className="stat-value">1</span>
              <span className="stat-labelDog">Anjing</span>
            </li>
          </ul>
          <div className="stat-footer">
            Total <span className="total-value">3</span> Hewan
          </div>
        </div>

        {/* Breeding Requests Card */}
        <div className="stat-card">
          <div className="stat-header">
            <img src={reverseIcon} alt="Paw" className="stat-icon" />
            <h3>Total Permintaan Breeding</h3>
          </div>
          <div className="stat-main-value">
            <span className="large-number">20</span> Permintaan
          </div>
        </div>

        {/* Successful Matches Card */}
        <div className="stat-card">
          <div className="stat-header">
            <img src={loveIcon} alt="Matches" className="stat-icon" />
            <h3>Match Berhasil</h3>
          </div>
          <div className="stat-main-value">
            <span className="large-number">13</span> Match sudah berhasil dilakukan
          </div>
        </div>
      </div>
    </div>
  );
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

  const isMatchmakingActive = activePage === 'Kucing' || activePage === 'Anjing';

  return (
    <div className="dashboard-container">
      <header className="top-header">
        <div className="header-left">
          <img src={placeholderLogo} alt="Logo" className="logo" />
          <span className="logo-text">PurrfectMatch</span>
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

      <div className="main-layout">
        <aside className="sidebar">
          <nav className="nav">
            <div
              className={`nav-item ${activePage === 'Dashboard' ? 'active-tab' : ''}`}
              onClick={() => setActivePage('Dashboard')}
            >
              <img
                src={dashboardImage}
                alt="grid"
                className={`grid ${activePage === 'Dashboard' ? 'active-icon' : ''}`}
              />
              <span>Dashboard</span>
            </div>

            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className={`matchmaking-button ${isMatchmakingActive ? 'active-matchmaking' : ''}`}
                type="button"
              >
                <span className="flex items-center space-x-1">
                  <img
                    src={loveImage}
                    alt="love"
                    className={`love ${isMatchmakingActive ? 'active-icon' : ''}`}
                  />
                  <span>Matchmaking</span>
                </span>
                <i className={`fas ${dropdownOpen ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
              </button>

              {dropdownOpen && (
                <div className="matchmaking-options">
                  <div
                    className={`option-item ${activePage === 'Kucing' ? 'active-tab' : ''}`}
                    onClick={() => setActivePage('Kucing')}
                  >
                    Kucing
                  </div>
                  <div
                    className={`option-item ${activePage === 'Anjing' ? 'active-tab' : ''}`}
                    onClick={() => setActivePage('Anjing')}
                  >
                    Anjing
                  </div>
                </div>
              )}
            </div>

            <div
              className={`nav-item ${activePage === 'Forum' ? 'active-tab' : ''}`}
              onClick={() => setActivePage('Forum')}
            >
              <img
                src={forumImage}
                alt="forum"
                className={`grid ${activePage === 'Forum' ? 'active-icon' : ''}`}
              />
              <span>Forum</span>
            </div>
          </nav>
        </aside>

        <main className="main-content">{renderContent()}</main>
      </div>
    </div>
  );
};

export default Dashboard;