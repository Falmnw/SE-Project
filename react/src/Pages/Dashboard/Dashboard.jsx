import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';
import PrivateChatApp from './components/PrivateChatApp';

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

  const [nampToken, setnampToken] = useState('');

  const [breedingSuccess, setBreedingSuccess] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const [notifications, setNotifications] = useState([]);
  const [notificationsUser, setNotificationsUser] = useState([]);

  const [allChats, setAllChats] = useState([]);       // Semua chat yg sudah diterima
  const [selectedChat, setSelectedChat] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isForum, setIsForum] = useState(false);
  const [showMatchList, setShowMatchList] = useState(false);

  const [showReqBreedList, setShowReqBreedList] = useState(false);

  const [showChat, setShowChat] = useState(false);


  // const [chatsPrivate, setChatsPrivate] = useState([]);

  const chatMessagesRef = useRef(null);

  const [petFromId, setPetFromId] = useState('');


  // const [breedingRequests, setBreedingRequests] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setnampToken(token);
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
        return fetch(`http://localhost:5051/api/pats`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
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
    const interval = setInterval(() => {
      console.log("Is Forum :", isForum);
      if (isForum) {
        fetch('http://localhost:5051/api/chats')
          .then((res) => res.json())
          .then(setChats)
          .catch((err) => console.error('Failed to fetch chats', err));
      } else {
        // pass
        console.log('Forum not active, skipping fetch');
      }
    }, 2000); // polling tiap 2 detik

    return () => clearInterval(interval); // bersihin interval kalau komponen unmount
  }, [user, isForum]);
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     console.log("Get All Chat");
  //     fetchAllPrivateChats(user.email);
  //   }, 6000); // polling tiap 6 detik

  //   return () => clearInterval(interval); // bersihin interval kalau komponen unmount
  // }, [user, isForum]);
  useEffect(() => {
    if (!user) return; // tunggu sampai user tersedia

    const fetchNotifications = async () => {
      try {
        const res = await fetch('http://localhost:5051/api/breeding-requests');
        if (!res.ok) throw new Error('Gagal ambil data');

        const data = await res.json();
        const userRequests = data.filter(req => req.owner_email === user.email && req.status === 'pending');
        const userRequestsUser = data;
        setNotificationsUser(userRequestsUser)
        setNotifications(userRequests);
      } catch (err) {
        console.error('Gagal mengambil notifikasi:', err);
      }
    };

    fetchNotifications();
  }, [user]);
  useEffect(() => {
    if (!user) return;
    fetchAllPrivateChats(user.email);
  }, [user]);

  useEffect(() => {
    if (chatMessagesRef.current) {
      // Scroll ke paling bawah
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  }, [selectedChat]);

  const fetchAllPrivateChats = async (currentUserEmail) => {
    try {
      const res = await fetch('http://localhost:5051/api/breeding-requests');
      const data = await res.json();
      const acceptedChats = data.filter(req => req.status === 'accepted' && (req.email_from === currentUserEmail || req.owner_email === currentUserEmail));

      const allMessages = await Promise.all(
        acceptedChats.map(async (chat) => {
          const res = await fetch(`http://localhost:5051/api/chats/private?user1=${chat.email_from}&user2=${chat.owner_email}`);
          const messages = await res.json();
          return { user1: chat.email_from, user2: chat.owner_email, messages };
        })
      );

      if (allMessages.length > 0) {
        setAllChats(allMessages);
        setSelectedChat(allMessages[0].messages);
        setSelectedUser({ user1: allMessages[0].user1, user2: allMessages[0].user2 });
      }
    } catch (err) {
      console.error('Gagal ambil chat:', err);
    }
  }

  const handleSendMessagePrivate = async (e) => {
    e.preventDefault();
    if (!newMessage || !selectedUser) return;

    try {
      await fetch('http://localhost:5051/api/chats/private/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${nampToken}`
        },
        body: JSON.stringify({
          from: user.email,
          to: user.email === selectedUser.user1 ? selectedUser.user2 : selectedUser.user1,
          text: newMessage,
        })
      });
      setNewMessage('');
      fetchPrivateChat(selectedUser.user1, selectedUser.user2);
    } catch (err) {
      console.error('Gagal kirim pesan:', err);
    }
  }

  //

  useEffect(() => {
    console.log('isForum updated to:', isForum);
  }, [isForum]);
  const handleSendMessage = (e) => {
    e.preventDefault();
    const payload = { user: user.name, message: newMessage };

    fetch('http://localhost:5051/api/chats', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${nampToken}`
      },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then(() => setNewMessage(''))
      .catch((err) => console.error('Gagal kirim pesan:', err));
  };

  const sendBreedingRequest = (ownerEmail, petId, petFromId) => {
    // const tokenz = localStorage.getItem('token');
    if (!petFromId) {
      alert('Silakan pilih hewan milikmu terlebih dahulu sebelum mengajukan breeding.');
      return;
    }
    fetch('http://localhost:5051/api/breeding-requests', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        Authorization: `Bearer ${nampToken}`
      },
      body: JSON.stringify({
        email_from: user.email,
        owner_email: ownerEmail,
        pet_from: petFromId.toString(),
        pet_to: petId.toString(),
        message: 'Breed kuy'
      })
    })
      .then(async res => {
        const contentType = res.headers.get('content-type');
        const resStat = res.status;
        if (contentType && contentType.includes('application/json') && resStat === 201) {
          const data = await res.json();
          setBreedingSuccess(true)
          alert(`✅ Permintaan dikirim ke ${ownerEmail}`);
        } else if (resStat === 422 || resStat === 404) {
          const data = await res.json();
          alert(data.error)
        } else {
          alert('❌ Gagal !');
        }
      })
      .catch(err => {
        console.error(err);
        alert('❌ Gagal !');
      });
  };

  const handleBreedingResponse = async (id, status) => {
    try {
      const response = await fetch(`http://localhost:5051/api/breeding-requests/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${nampToken}`
        },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        // Update state setelah sukses
        const res = await fetch('http://localhost:5051/api/breeding-requests');
        const data = await res.json();
        const userRequests = data.filter(req => req.owner_email === user.email && req.status === 'pending');
        const acceptedNotif = data.find(req => req.id === id); // ambil notif lengkapnya
        setNotifications(userRequests);

        // 💬 Buat chat privat jika diterima
        if (status === 'accepted' && acceptedNotif) {
          await fetch('http://localhost:5051/api/chats/private', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              user1: acceptedNotif.email_from,
              user2: acceptedNotif.owner_email,
            }),
          });

          // 🚀 Ambil dan tampilkan chat setelah dibuat
          fetchPrivateChat(acceptedNotif.email_from, acceptedNotif.owner_email);
        }

      } else {
        console.error('Gagal update status breeding:', await response.text());
      }
    } catch (err) {
      console.error('Error saat kirim fetch:', err);
    }
  };

  const fetchPrivateChat = async (email1, email2) => {
    try {
      const res = await fetch(`http://localhost:5051/api/chats/private?user1=${email1}&user2=${email2}`);
      const data = await res.json();
      setSelectedChat(data);
      setSelectedUser({ user1: email1, user2: email2 });
    } catch (err) {
      console.error('Gagal ambil chat privat:', err);
    }
  };

  const totalKucing = pets.filter(p => p.type === 'Kucing' && p.owner_email === user.email).length;
  const totalAnjing = pets.filter(p => p.type === 'Anjing' && p.owner_email === user.email).length;
  const totalHewan = pets.filter(p => p.owner_email === user.email).length;

  const myKucing = pets.filter(p => p.type === 'Kucing' && p.owner_email === user.email);
  const myAnjing = pets.filter(p => p.type === 'Anjing' && p.owner_email === user.email);


  const handleShowMatches = async () => {
    try {
      const totalAccepted = notificationsUser.filter(n => (n.owner_email === user.email || n.email_from === user.email) && n.status === 'accepted').length;
      if (totalAccepted >= 1) {
        setShowMatchList(true);
      } else {
        alert("Belum ada data.");
      }
    } catch (err) {
      console.error('Gagal fetch data match:', err);
    }
  };

  const handleShowReqBreed = async () => {
    try {
      const total = notificationsUser.filter(n => n.owner_email === user.email).length;
      if (total >= 1) {
        setShowReqBreedList(true);
      } else {
        alert("Belum ada data.");
      }
    } catch (err) {
      console.error('Gagal fetch data match:', err);
    }
  };

  const renderContent = () => {
    switch (activePage) {
      case 'Dashboard':
        const totalReq = notificationsUser.filter(n => n.owner_email === user.email);
        // const totalAccepted = notificationsUser.filter(n => n.owner_email === user.email && n.status === 'accepted').length;
        const matchedPets = notificationsUser.filter(n => (n.owner_email === user.email || n.email_from === user.email) && n.status === 'accepted')
        if (showMatchList) {
          return (
            <div className="match-list-overlay">
              <div className="match-list-modal">
                <div className="match-list-header">
                  <h2>Match Berhasil</h2>
                  <button className="close-btn" onClick={() => setShowMatchList(false)}>×</button>
                </div>

                {matchedPets.length === 0 ? (
                  <p className="empty-state">Belum ada data match.</p>
                ) : (
                  <div className="match-list-content">
                    {matchedPets.map((match, i) => {
                      const petnotif = pets.find(p => p.id.toString() === match.pet_to);
                      const petfrom = pets.find(p => p.id.toString() === match.pet_from);
                      let ras = "(" + petnotif?.breed + ")"
                      if (ras === "(undefined)") {
                        ras = ""
                      } else if (ras === "(null)") {
                        ras = ""
                      }
                      let rasFrom = "(" + petfrom?.breed + ")"
                      if (rasFrom === "(undefined)") {
                        rasFrom = ""
                      } else if (rasFrom === "(null)") {
                        rasFrom = ""
                      }
                      let pengaju = match.email_from
                      if (pengaju === user.email) {
                        pengaju = "Anda"
                      }
                      return (
                        <div key={i} className="match-card">
                          <h4 className="pet-name">🐾 {petnotif?.name} {ras} dengan {petfrom?.name} {rasFrom}</h4>
                          <p className="match-email">
                            Diajukan oleh: <span>{pengaju}</span>
                          </p>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          );
        } else if (showReqBreedList) {
          return (
            <div className="match-list-overlay">
              <div className="match-list-modal">
                <div className="match-list-header">
                  <h2>Total Permintaan Breeding</h2>
                  <button className="close-btn" onClick={() => setShowReqBreedList(false)}>×</button>
                </div>

                {totalReq.length === 0 ? (
                  <p className="empty-state">Belum ada data match.</p>
                ) : (
                  <div className="match-list-content">
                    {totalReq.map((match, i) => {
                      const petnotif = pets.find(p => p.id.toString() === match.pet_to);
                      const petfrom = pets.find(p => p.id.toString() === match.pet_from);
                      let ras = "(" + petnotif?.breed + ")"
                      if (ras === "(undefined)") {
                        ras = ""
                      } else if (ras === "(null)") {
                        ras = ""
                      }
                      let rasFrom = "(" + petfrom?.breed + ")"
                      if (rasFrom === "(undefined)") {
                        rasFrom = ""
                      } else if (rasFrom === "(null)") {
                        rasFrom = ""
                      }
                      let pengaju = match.email_from
                      if (pengaju === user.email) {
                        pengaju = "Anda"
                      }
                      return (
                        <div key={i} className="match-card">
                          <h4 className="pet-name">🐾 {petnotif?.name} {ras} dengan {petfrom?.name} {rasFrom}</h4>
                          <p className="match-email">
                            Diajukan oleh: <span>{pengaju}</span>
                          </p>
                          <p className="match-status">
                            Status: <span>{match.status}</span>
                          </p>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          );
        } else {
          return (
            <div className="overview-tab">
              <h1 className="tab-title">Overview</h1>
              <div className="stats-section">
                <div
                  className="stat-card"
                  style={{ cursor: 'pointer' }}
                  onClick={() => navigate('/profile')}
                  title="Show"
                >
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

                <div className="stat-card" title="Request" onClick={handleShowReqBreed} style={{ cursor: 'pointer' }}>
                  <div className="stat-header">
                    <img src={reverseIcon} alt="Paw" className="stat-icon" />
                    <h3>Total Permintaan Breeding</h3>
                  </div>
                  <div className="stat-main-value">
                    <span className="large-number">{totalReq.length}</span> Permintaan
                  </div>
                </div>

                <div className="stat-card" title="Matched" onClick={handleShowMatches} style={{ cursor: 'pointer' }}>
                  <div className="stat-header">
                    <img src={loveIcon} alt="Matches" className="stat-icon" />
                    <h3>Match Berhasil</h3>
                  </div>
                  <div className="stat-main-value">
                    <span className="large-number">{matchedPets.length}</span> Match sudah berhasil dilakukan
                  </div>
                </div>
              </div>
            </div>
          );
        }
      case 'Forum':
        // {setForum('Forum')}
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
        const kucingLain = pets.filter(p => p.type === 'Kucing' && p.owner_email !== user.email);
        if (breedingSuccess) {
          return (
            <div className="matchmaking-tab success-screen">
              <div className="success-icon-container">
                <div className="success-icon">✔</div>
              </div>
              <h2 className="success-title">Pengajuan Berhasil</h2>
              <p className="success-message">
                Pengajuan Breeding anda berhasil dikirimkan.<br />
                Silahkan menunggu untuk konfirmasi selanjutnya
              </p>
              <button className="match-button" onClick={() => setBreedingSuccess(false)}>
                Kembali ke Menu Utama
              </button>
            </div>
          );
        } else {
          return (
            <div className="matchmaking-tab">
              <h2 className="tab-title">Matchmaking Kucing</h2>
              {/* 🔽 PILIH HEWAN MILIK SENDIRI */}
              <div className="my-pet-selector">
                <label htmlFor="petFromSelect"> Pilih Kucing Kamu:</label>
                <select
                  id="petFromSelect"
                  value={petFromId}
                  onChange={(e) => setPetFromId(e.target.value)}
                >
                  <option value="">-- Pilih Kucing --</option>
                  {myKucing.map((myPet) => (
                    <option key={myPet.id} value={myPet.id}>
                      {myPet.name} ({myPet.gender})
                    </option>
                  ))}
                </select>

                {/* ✅ TAMPILKAN IMAGE HEWAN TERPILIH */}
                {petFromId && (() => {
                  const selectedPet = myKucing.find(p => p.id === petFromId);
                  if (!selectedPet) return null;
                  const imageUrl = selectedPet.image_path
                    ? 'http://localhost:5051' + selectedPet.image_path.replace(/\\/g, '')
                    : defaultPetImg;
                  return (
                    <div className="selected-pet-preview">
                      <img
                        src={imageUrl}
                        alt={selectedPet.name}
                        className="pet-image"
                        style={{ maxWidth: '150px', marginTop: '10px' }}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = catIcon;
                        }}
                      />
                      <p style={{ fontWeight: 'bold' }}>{selectedPet.name}</p>
                    </div>
                  );
                })()}
              </div>
              <div className="match-grid">
                {kucingLain.map((pet, index) => (
                  <div key={index} className="pet-card">
                    <img
                      src={pet.image_path ? 'http://localhost:5051' + pet.image_path.replace(/\\/g, '') : defaultPetImg}
                      alt={pet.name}
                      className="pet-image"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = catIcon; // fallback image
                      }}
                    />
                    <div className="pet-details">
                      <h3>{pet.name}</h3>
                      <p>🐾 {pet.breed}</p>
                      <p>Gender: {pet.gender}</p>
                      <p>📅 {pet.age} Tahun</p>
                      <p>📍 {pet.region}</p>
                      <button className="match-button" onClick={() => sendBreedingRequest(pet.owner_email, pet.id, petFromId)}>
                        Ajukan Breeding
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        }
      case 'Anjing':
        const anjinglain = pets.filter(p => p.type === 'Anjing' && p.owner_email !== user.email);
        if (breedingSuccess) {
          return (
            <div className="matchmaking-tab success-screen">
              <div className="success-icon-container">
                <div className="success-icon">✔</div>
              </div>
              <h2 className="success-title">Pengajuan Berhasil</h2>
              <p className="success-message">
                Pengajuan Breeding anda berhasil dikirimkan.<br />
                Silahkan menunggu untuk konfirmasi selanjutnya
              </p>
              <button className="match-button" onClick={() => setBreedingSuccess(false)}>
                Kembali ke Menu Utama
              </button>
            </div>
          );
        } else {
          return (
            <div className="matchmaking-tab">
              <h2 className="tab-title">Matchmaking Anjing</h2>
              {/* 🔽 PILIH HEWAN MILIK SENDIRI */}
              <div className="my-pet-selector">
                <label htmlFor="petFromSelect"> Pilih Anjing Kamu:</label>
                <select
                  id="petFromSelect"
                  value={petFromId}
                  onChange={(e) => setPetFromId(e.target.value)}
                >
                  <option value="">-- Pilih Anjing --</option>
                  {myAnjing.map((myPet) => (
                    <option key={myPet.id} value={myPet.id}>
                      {myPet.name} ({myPet.gender})
                    </option>
                  ))}
                </select>

                {/* ✅ TAMPILKAN IMAGE HEWAN TERPILIH */}
                {petFromId && (() => {
                  const selectedPet = myAnjing.find(p => p.id === petFromId);
                  if (!selectedPet) return null;
                  const imageUrl = selectedPet.image_path
                    ? 'http://localhost:5051' + selectedPet.image_path.replace(/\\/g, '')
                    : defaultPetImg;
                  return (
                    <div className="selected-pet-preview">
                      <img
                        src={imageUrl}
                        alt={selectedPet.name}
                        className="pet-image"
                        style={{ maxWidth: '150px', marginTop: '10px' }}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = catIcon;
                        }}
                      />
                      <p style={{ fontWeight: 'bold' }}>{selectedPet.name}</p>
                    </div>
                  );
                })()}
              </div>
              <div className="match-grid">
                {anjinglain.map((pet, index) => (
                  <div key={index} className="pet-card">
                    <img
                      src={pet.image_path ? 'http://localhost:5051' + pet.image_path.replace(/\\/g, '') : defaultPetImg}
                      alt={pet.name}
                      className="pet-image"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = catIcon; // fallback image
                      }}
                    />
                    <div className="pet-details">
                      <h3>{pet.name}</h3>
                      <p>🐾 {pet.breed}</p>
                      <p>📅 {pet.age} Tahun</p>
                      <p>📍 {pet.region}</p>
                      <button className="match-button" onClick={() => sendBreedingRequest(pet.owner_email, pet.id, petFromId)}>
                        Ajukan Breeding
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        }
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
          <div className="notification-icon" onClick={() => setShowNotifications(!showNotifications)} style={{ cursor: 'pointer' }}>
            <img src={bellIcon} alt="bell" className="bell-icon" />
            {notifications.length > 0 && (
              <span className="notification-badge">{notifications.length}</span>
            )}
          </div>

          {showNotifications && (
            <div className="notification-dropdown">
              <h4>Notifikasi Breeding</h4>
              {notifications.length === 0 ? (
                <p>Tidak ada notifikasi</p>
              ) : (
                <ul>
                  {notifications.map((notif, index) => {
                    const petnotif = pets.find(p => p.id.toString() === notif.pet_to);
                    const petfrom = pets.find(p => p.id.toString() === notif.pet_from);
                    let ras = "(" + petnotif?.breed + ")"
                    if (ras === "(undefined)") {
                      ras = ""
                    } else if (ras === "(null)") {
                      ras = ""
                    }
                    let rasFrom = "(" + petfrom?.breed + ")"
                    if (rasFrom === "(undefined)") {
                      rasFrom = ""
                    } else if (rasFrom === "(null)") {
                      rasFrom = ""
                    }
                    return (
                      <li key={index}>
                        <div>
                          <strong>{notif.email_from}</strong> mengajukan breeding antara {petnotif?.name} {ras} dengan {petfrom?.name} {rasFrom}.
                          <br />
                          Status: <span style={{ textTransform: 'capitalize' }}>{notif.status}</span>
                        </div>

                        {notif.status === 'pending' && (
                          <div style={{ marginTop: '0.5rem' }}>
                            <button
                              className="accept-button"
                              onClick={() => handleBreedingResponse(notif.id, 'accepted')}
                            >
                              ✅ Terima
                            </button>
                            <button
                              className="reject-button"
                              onClick={() => handleBreedingResponse(notif.id, 'rejected')}
                            >
                              ❌ Tolak
                            </button>
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          )}
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
              onClick={() => {
                setActivePage('Dashboard');
                setIsForum(false);
              }}
            >
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
                    onClick={() => {
                      setActivePage('Kucing');
                      setIsForum(false);
                    }}
                  >
                    Kucing
                  </div>
                  <div className={`option-item ${activePage === 'Anjing' ? 'active-tab' : ''}`}
                    //  onClick={() => setActivePage('Anjing')}>
                    onClick={() => {
                      setActivePage('Anjing');
                      setIsForum(false);
                    }}
                  >
                    Anjing
                  </div>
                </div>
              )}
            </div>

            <div className={`nav-item ${activePage === 'Forum' ? 'active-tab' : ''}`}
              onClick={() => {
                console.log('Clicked Forum');
                setActivePage('Forum');
                setIsForum(true);
              }}
            >
              <img src={forumImage} alt="forum" className={`grid ${activePage === 'Forum' ? 'active-icon' : ''}`} />
              <span>Forum</span>
            </div>
          </nav>
        </aside>

        <main className="main-content">
          {renderContent()}
          <div>
            {/* Isi Dashboard kamu */}

            {/* Tombol Chat */}
            <div style={{
              position: 'fixed',
              bottom: '20px',
              right: '20px',
              zIndex: 9999
            }}>
              <button
                onClick={() => setShowChat(prev => !prev)}
                style={{
                  backgroundColor: '#4a90e2',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50%',
                  width: '60px',
                  height: '60px',
                  fontSize: '24px',
                  cursor: 'pointer'
                }}
              >
                💬
              </button>
            </div>

            {/* Chat App */}
            {showChat && (
              <PrivateChatApp
                currentUserEmail={user.email}
                token={nampToken}
              />
            )}
          </div>

        </main>
        {/* )} */}
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