import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import './Profile.css';

import logo from './assets/images/logoBrand.png';
import bellIcon from './assets/images/bell.png';
import defaultPetImg from './assets/images/kucing-dan-anjing.webp';





const Profile = () => {
  const [user, setUser] = useState(null);
  const [pets, setPets] = useState([]);
  const [petAll, setPetAll] = useState([]);
  const [newPet, setNewPet] = useState({ name: '', type: 'Kucing', gender: 'Jantan', age: '', breed: '', region: '' });
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const [notificationsUser, setNotificationsUser] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    fetch('http://localhost:5051/api/me', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => {
        if (!res.ok) throw new Error('Invalid token');
        return res.json();
      })
      .then(data => {
        setUser(data);
        return fetch(`http://localhost:5051/api/pat/${data.email}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      })
      .then(res => res.json())
      .then(petList => {
        setPets(petList);
        setIsLoading(false);
      })

      .catch(() => {
        localStorage.removeItem('token');
        navigate('/login');
      });
  }, [navigate, token]);

  useEffect(() => {
    if (!user) return; // tunggu sampai user tersedia

    const petAlls = async () => {
      try {
        const res = await fetch('http://localhost:5051/api/pats', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (!res.ok) throw new Error('Gagal ambil data');

        const data = await res.json();
        setPetAll(data);
      } catch (err) {
        console.error('Gagal mengambil notifikasi:', err);
      }
    };

    petAlls();
  }, [user]);

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
  const handleAddPet = (e) => {
    e.preventDefault();
    if (!newPet.name || !newPet.age || !newPet.image) return;

    const formData = new FormData();
    formData.append('name', newPet.name);
    formData.append('type', newPet.type);
    formData.append('gender', newPet.gender);
    formData.append('age', newPet.age);
    formData.append('owner', user.email);
    formData.append('breed', newPet.breed);
    formData.append('region', newPet.region);
    formData.append('image', newPet.image);


    fetch('http://localhost:5051/api/pat', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    })
      .then(res => res.json())
      .then(saved => {
        setPets([...pets, saved]);
        setNewPet({ name: '', type: 'Kucing', gender: 'Jantan', age: '', image: null, breed: '', region: '' });
        navigate(0);
      })
      .catch(console.error);
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="dashboard-container">
      <header className="top-header">
        <div className="header-left">
          <img src={logo} alt="Logo" className="logo" />
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
                    const petfrom = petAll.find(p => p.id.toString() === notif.pet_from);
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
          {/* <div className="avatar"> */}
          <div
            className="avatar"
            style={{ cursor: 'pointer' }}
            onClick={() => navigate('/profile')}
            title="Go to Profile"
          >
            <span className="avatar-initial">{user.name?.[0]?.toUpperCase()}</span>
            <span className="online-dot"></span>
          </div>
        </div>
      </header>

      <div className="main-layout">
        <aside className="sidebar">
          <nav className="nav">
            <div className="nav-item active-tab" onClick={() => navigate('/dashboard')}>
              <span>Kembali ke Dashboard</span>
            </div>
          </nav>
        </aside>

        <main className="main-content">
          <h1 className="tab-title">Profil Pengguna</h1>
          <div className="profile-info">
            <p><strong>Nama:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
          </div>

          <h2 className="tab-title mt-4">Hewan Peliharaan Saya</h2>
          <div className="stats-section">
            {pets.length === 0 ? (
              <p>Kamu belum menambahkan hewan peliharaan.</p>
            ) : (
              pets.map((pet, index) => (
                <div key={index} className="stat-card">
                  <div className="stat-header">
                    <img
                      src={pet.image_path ? 'http://localhost:5051' + pet.image_path.replace(/\\/g, '') : defaultPetImg}
                      alt={pet.name}
                      className="stat-icon"
                    />
                  </div>
                  <div className="stat-main-value">
                    <p><strong>Nama xxx:</strong> {pet.name}</p>
                    <p><strong>Jenis:</strong> {pet.type}</p>
                    <p><strong>Ras:</strong> {pet.breed}</p>
                    <p><strong>Gender:</strong> {pet.gender}</p>
                    <p><strong>Umur:</strong> {pet.age} tahun</p>
                  </div>
                </div>
              ))
            )}
          </div>

          <h2 className="tab-title mt-4">Tambah Hewan Baru</h2>
          <form className="pet-form" onSubmit={handleAddPet}>
            <div className="form-group">
              <label>Nama</label>
              <input
                type="text"
                value={newPet.name}
                onChange={(e) => setNewPet({ ...newPet, name: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Jenis</label>
              <select
                value={newPet.type}
                onChange={(e) => setNewPet({ ...newPet, type: e.target.value })}
              >
                <option value="Kucing">Kucing</option>
                <option value="Anjing">Anjing</option>
              </select>
            </div>
            <div className="form-group">
              <label>Gender</label>
              <select
                value={newPet.gender}
                onChange={(e) => setNewPet({ ...newPet, gender: e.target.value })}
              >
                <option value="Jantan">Jantan</option>
                <option value="Betina">Betina</option>
              </select>
            </div>
            <div className="form-group">
              <label>Umur (tahun)</label>
              <input
                type="number"
                value={newPet.age}
                onChange={(e) => setNewPet({ ...newPet, age: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Ras</label>
              <input
                type="text"
                value={newPet.breed}
                onChange={(e) => setNewPet({ ...newPet, breed: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Region</label>
              <input
                type="text"
                value={newPet.region}
                onChange={(e) => setNewPet({ ...newPet, region: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Foto Hewan</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setNewPet({ ...newPet, image: e.target.files[0] })}
                required
              />
            </div>
            <button type="submit" className="submit-button">Tambah Hewan</button>
          </form>
        </main>
      </div>
    </div>
  );
};

export default Profile;