import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState('Dashboard');
  const [dropdownOpen, setDropdownOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [pets, setPets] = useState([]);

  const [chats, setChats] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    fetch('http://localhost:5051/api/me', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Invalid token');
        } 
        return res.json();
      })
      .then((userData) => {
        setUser(userData);
        return fetch(`http://localhost:5051/api/pat/${userData.email}`);
      })
      .then((res) => res.json())
      .then((petList) => {
        setPets(petList);
        setIsLoading(false);
      })
      .catch(() => {
        localStorage.removeItem('token');
        navigate('/login');
      });
  }, [navigate]);
  useEffect(() => {
  if (!user) return;

  const interval = setInterval(() => {
    fetch('http://localhost:5051/api/chats')
      .then((res) => res.json())
      .then(setChats)
      .catch((err) => console.error('Failed to fetch chats', err));
  }, 2000); // polling tiap 2 detik

  return () => clearInterval(interval); // bersihin interval kalau komponen unmount
}, [user]);

const handleSendMessage = (e) => {
  e.preventDefault();
  const payload = { user: user.name, message: newMessage };

  fetch('http://localhost:5051/api/chats', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })
    .then((res) => res.json())
    .then(() => setNewMessage(''))
    .catch((err) => console.error('Gagal kirim pesan:', err));
};

  const totalKucing = pets.filter(p => p.type === 'Kucing').length;
  const totalAnjing = pets.filter(p => p.type === 'Anjing').length;
  const totalHewan = pets.length;

  const renderContent = () => {
    switch (activePage) {
      case 'Dashboard':
        return (
          <div className="overview-tab">
            <h1 className="tab-title">Overview</h1>
            <div className="stats-section">
              <div className="stat-card">
                <div className="stat-header">
                  <img src={pawIcon} alt="Breeding" className="stat-icon" />
                  <h3>Jumlah Hewan Peliharaan</h3>
                </div>
                <ul className="stat-list">
                  <li>
                    <img src={catIcon} alt="Cat" className="animal-icon" />
                    <span className="stat-value">{totalKucing}</span>
                    <span className="stat-labelCat">Kucing</span>
                  </li>
                  <li>
                    <img src={dogIcon} alt="Dog" className="animal-icon" />
                    <span className="stat-value">{totalAnjing}</span>
                    <span className="stat-labelDog">Anjing</span>
                  </li>
                </ul>
                <div className="stat-footer">
                  Total <span className="total-value">{totalHewan}</span> Hewan
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-header">
                  <img src={reverseIcon} alt="Paw" className="stat-icon" />
                  <h3>Total Permintaan Breeding</h3>
                </div>
                <div className="stat-main-value">
                  <span className="large-number">20</span> Permintaan
                </div>
              </div>

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
        // return <img src={forumImage} alt="Forum" className="placeholder-image" />;
        return (
          <div className="chat-forum">
            <h2 className="tab-title">Forum Diskusi</h2>
            <div className="chat-box">
              <div className="chat-messages">
                {chats.map((chat, i) => {
                  const isOwn = chat.email === user.email;
                  return (
                    <div
                      key={i}
                      className={`chat-message ${isOwn ? 'own-message' : i % 2 === 0 ? 'even-message' : 'odd-message'}`}
                    >
                      <strong>{chat.user}</strong>: {chat.message}
                      <div className="chat-time">
                        {timeAgo(chat.time)} WIB
                      </div>
                    </div>
                  );
                })}
              </div>
              <form onSubmit={handleSendMessage} className="chat-form">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Ketik pesan..."
                  required
                />
                <button type="submit">Kirim</button>
              </form>
            </div>
          </div>
        );
      case 'Kucing':
        return <h2 className="placeholder-text">Matchmaking Kucing</h2>;
      case 'Anjing':
        return <h2 className="placeholder-text">Matchmaking Anjing</h2>;
      default:
        return null;
    }
  };

  const isMatchmakingActive = activePage === 'Kucing' || activePage === 'Anjing';

  if (isLoading) return <div>Loading...</div>;

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
          <div 
            className="avatar"
            style={{ cursor: 'pointer' }}
            onClick={() => navigate('/profile')}
            title="Go to Profile"
          >
            <span className="avatar-initial">
              {user ? user.name.charAt(0).toUpperCase() : ''}
            </span>
            <span className="online-dot"></span>
          </div>
        </div>
      </header>

      <div className="main-layout">
        <aside className="sidebar">
          <nav className="nav">
            <div className={`nav-item ${activePage === 'Dashboard' ? 'active-tab' : ''}`}
                 onClick={() => setActivePage('Dashboard')}>
              <img src={dashboardImage} alt="grid" className={`grid ${activePage === 'Dashboard' ? 'active-icon' : ''}`} />
              <span>Dashboard</span>
            </div>

            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className={`matchmaking-button ${isMatchmakingActive ? 'active-matchmaking' : ''}`}
                type="button"
              >
                <span className="flex items-center space-x-1">
                  <img src={loveImage} alt="love" className={`love ${isMatchmakingActive ? 'active-icon' : ''}`} />
                  <span>Matchmaking</span>
                </span>
                <i className={`fas ${dropdownOpen ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
              </button>

              {dropdownOpen && (
                <div className="matchmaking-options">
                  <div className={`option-item ${activePage === 'Kucing' ? 'active-tab' : ''}`}
                       onClick={() => setActivePage('Kucing')}>
                    Kucing
                  </div>
                  <div className={`option-item ${activePage === 'Anjing' ? 'active-tab' : ''}`}
                       onClick={() => setActivePage('Anjing')}>
                    Anjing
                  </div>
                </div>
              )}
            </div>

            <div className={`nav-item ${activePage === 'Forum' ? 'active-tab' : ''}`}
                 onClick={() => setActivePage('Forum')}>
              <img src={forumImage} alt="forum" className={`grid ${activePage === 'Forum' ? 'active-icon' : ''}`} />
              <span>Forum</span>
            </div>
          </nav>
        </aside>

        <main className="main-content">{renderContent()}</main>
      </div>
    </div>
  );
};

function formatToWIB(dateString) {
  const date = new Date(dateString);
  const options = {
    timeZone: 'Asia/Jakarta',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  };
  return new Intl.DateTimeFormat('id-ID', options).format(date) + ' WIB';
}


function timeAgo(dateString) {
  const now = new Date();

  // konversi waktu ke WIB dengan menambahkan offset +7 jam
  const utcDate = new Date(dateString);
  const wibDate = new Date(utcDate.getTime() + (7 * 60 * 60 * 1000));

  const diff = Math.floor((now - wibDate) / 1000); // dalam detik

  if (diff < 60) return `${diff} detik lalu`;
  if (diff < 3600) return `${Math.floor(diff / 60)} menit lalu`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} jam lalu`;
  if (diff < 604800) return `${Math.floor(diff / 86400)} hari lalu`;

  // fallback format manual ke WIB
  return formatToWIB(dateString);
}

export default Dashboard;


// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import './Dashboard.css';

// import placeholderLogo from './assets/images/logoBrand.png';
// import dashboardImage from './assets/images/gridFrame.png';
// import forumImage from './assets/images/forum.png';
// import loveImage from './assets/images/love.png'; 
// import loveIcon from './assets/images/loveIcon.png'; 
// import bellIcon from './assets/images/bell.png';
// import pawIcon from './assets/images/paw.png';
// import dogIcon from './assets/images/dogLogo.png';
// import catIcon from './assets/images/catLogo.png';
// import reverseIcon from './assets/images/reverse.png';

// const Dashboard = () => {
//   const navigate = useNavigate();
//   const [activePage, setActivePage] = useState('Dashboard');
//   const [dropdownOpen, setDropdownOpen] = useState(true);
//   const [isLoading, setIsLoading] = useState(true);
//   const [user, setUser] = useState(null); // 🔥 simpan data user

//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     if (!token) {
//       navigate('/login');
//       return;
//     }

//     fetch('http://localhost:5051/api/me', {
//       headers: {
//         'Authorization': `Bearer ${token}`
//       }
//     })
//       .then((res) => {
//         if (!res.ok) {
//           throw new Error('Invalid token');
//         } 
//         return res.json();
//       })
//       .then((userData) => {
//         console.log('User authenticated:', userData);
//         setUser(userData);
//         setIsLoading(false);
//       })
//       .catch(() => {
//         localStorage.removeItem('token');
//         navigate('/login');
//       });
//   }, [navigate]);

//   const renderContent = () => {
//     switch (activePage) {
//       case 'Dashboard':
//         return (
//           <div className="overview-tab">
//             <h1 className="tab-title">Overview</h1>
//             <div className="stats-section">
//               <div className="stat-card">
//                 <div className="stat-header">
//                   <img src={pawIcon} alt="Breeding" className="stat-icon" />
//                   <h3>Jumlah Hewan Peliharaan</h3>
//                 </div>
//                 <ul className="stat-list">
//                   <li>
//                     <img src={catIcon} alt="Cat" className="animal-icon" />
//                     <span className="stat-value">2</span>
//                     <span className="stat-labelCat">Kucing</span>
//                   </li>
//                   <li>
//                     <img src={dogIcon} alt="Dog" className="animal-icon" />
//                     <span className="stat-value">1</span>
//                     <span className="stat-labelDog">Anjing</span>
//                   </li>
//                 </ul>
//                 <div className="stat-footer">
//                   Total <span className="total-value">3</span> Hewan
//                 </div>
//               </div>

//               <div className="stat-card">
//                 <div className="stat-header">
//                   <img src={reverseIcon} alt="Paw" className="stat-icon" />
//                   <h3>Total Permintaan Breeding</h3>
//                 </div>
//                 <div className="stat-main-value">
//                   <span className="large-number">20</span> Permintaan
//                 </div>
//               </div>

//               <div className="stat-card">
//                 <div className="stat-header">
//                   <img src={loveIcon} alt="Matches" className="stat-icon" />
//                   <h3>Match Berhasil</h3>
//                 </div>
//                 <div className="stat-main-value">
//                   <span className="large-number">13</span> Match sudah berhasil dilakukan
//                 </div>
//               </div>
//             </div>
//           </div>
//         );
//       case 'Forum':
//         return <img src={forumImage} alt="Forum" className="placeholder-image" />;
//       case 'Kucing':
//         return <h2 className="placeholder-text">Matchmaking Kucing</h2>;
//       case 'Anjing':
//         return <h2 className="placeholder-text">Matchmaking Anjing</h2>;
//       default:
//         return null;
//     }
//   };

//   const isMatchmakingActive = activePage === 'Kucing' || activePage === 'Anjing';

//   if (isLoading) return <div>Loading...</div>;

//   return (
//     <div className="dashboard-container">
//       <header className="top-header">
//         <div className="header-left">
//           <img src={placeholderLogo} alt="Logo" className="logo" />
//           <span className="logo-text">PurrfectMatch</span>
//         </div>
//         <div className="header-right">
//           <div className="notification-icon">
//             <img src={bellIcon} alt="bell" className="bell-icon" />
//             <span className="notification-badge">10</span>
//           </div>
//           {/* <div className="avatar"> */}
//           <div 
//             className="avatar"
//             style={{ cursor: 'pointer' }}
//             onClick={() => navigate('/profile')}
//             title="Go to Profile"
//           >
//             {/* <span className="avatar-initial">K</span> */}
//             <span className="avatar-initial">
//               {user ? user.name.charAt(0).toUpperCase() : ''}
//             </span>
//             <span className="online-dot"></span>
//           </div>
//         </div>
//       </header>

//       <div className="main-layout">
//         <aside className="sidebar">
//           <nav className="nav">
//             <div className={`nav-item ${activePage === 'Dashboard' ? 'active-tab' : ''}`}
//                  onClick={() => setActivePage('Dashboard')}>
//               <img src={dashboardImage} alt="grid" className={`grid ${activePage === 'Dashboard' ? 'active-icon' : ''}`} />
//               <span>Dashboard</span>
//             </div>

//             <div className="relative">
//               <button
//                 onClick={() => setDropdownOpen(!dropdownOpen)}
//                 className={`matchmaking-button ${isMatchmakingActive ? 'active-matchmaking' : ''}`}
//                 type="button"
//               >
//                 <span className="flex items-center space-x-1">
//                   <img src={loveImage} alt="love" className={`love ${isMatchmakingActive ? 'active-icon' : ''}`} />
//                   <span>Matchmaking</span>
//                 </span>
//                 <i className={`fas ${dropdownOpen ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
//               </button>

//               {dropdownOpen && (
//                 <div className="matchmaking-options">
//                   <div className={`option-item ${activePage === 'Kucing' ? 'active-tab' : ''}`}
//                        onClick={() => setActivePage('Kucing')}>
//                     Kucing
//                   </div>
//                   <div className={`option-item ${activePage === 'Anjing' ? 'active-tab' : ''}`}
//                        onClick={() => setActivePage('Anjing')}>
//                     Anjing
//                   </div>
//                 </div>
//               )}
//             </div>

//             <div className={`nav-item ${activePage === 'Forum' ? 'active-tab' : ''}`}
//                  onClick={() => setActivePage('Forum')}>
//               <img src={forumImage} alt="forum" className={`grid ${activePage === 'Forum' ? 'active-icon' : ''}`} />
//               <span>Forum</span>
//             </div>
//           </nav>
//         </aside>

//         <main className="main-content">{renderContent()}</main>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;
