import React, { useState } from 'react';
// import { Link } from 'react-router-dom';
import { Link, useNavigate } from 'react-router-dom';
import './Register.css';

import logo from './assets/images/logoBrand.png';
import registerImg from './assets/images/imageLoginReg.png';

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {

     if (!form.name || !form.email || !form.phone || !form.password) {
    alert("Semua field wajib diisi.");
    return;
  }

  // Validasi email (harus ada @ dan .)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(form.email)) {
    alert("Email tidak valid.");
    return;
  }

    try {
      const res = await fetch("http://localhost:5051/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Berhasil register!");
         setForm({ name: "", email: "", phone: "", password: "" });
          setTimeout(() => {
            navigate("/login");
          }, 3000);
        // Optionally redirect or clear form
      } else {
        alert(`Gagal register: ${data.message || "Unknown error"}`);
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan saat mengirim data.");
    }
  };

  return (
    <>
      <title>Register - PurrfectMate</title>
      <main>
        <div className="container-fluid">
          <div className="row">
            <div className="col-sm-6 register-section-wrapper">
              <div className="brand-wrapper">
                <img src={logo} alt="logo" className="logo" />
              </div>
              <div className="register-wrapper my-auto">
                <h1 className="register-title">Register</h1>
                <form onSubmit={(e) => e.preventDefault()}>
                  <div className="form-group">
                    <label htmlFor="name">Nama Lengkap XXXX</label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      className="form-control"
                      placeholder="Masukkan nama lengkap"
                      value={form.name}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email xxx</label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      className="form-control"
                      // placeholder="email@example.com"
                      placeholder="Email"
                      value={form.email}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="phone">No. HP</label>
                    <input
                      type="tel"
                      name="phone"
                      id="phone"
                      className="form-control"
                      placeholder="08xxxxxxxxxx"
                      value={form.phone}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group mb-4">
                    <label htmlFor="password">Password</label>
                    <input
                      type="password"
                      name="password"
                      id="password"
                      className="form-control"
                      placeholder="Buat password"
                      value={form.password}
                      onChange={handleChange}
                    />
                  </div>
                  <input
                    name="register"
                    id="register"
                    className="btn btn-block register-btn"
                    type="button"
                    value="Register"
                    onClick={handleRegister}
                  />
                </form>

                <div className="spacer-after-register-btn" />

                <p className="register-wrapper-footer-text">
                  Already have an account?{' '}
                  <Link to="/login" className="text-reset">
                    Log in here
                  </Link>
                </p>
              </div>
            </div>
            <div className="col-sm-6 px-0 d-none d-sm-block">
              <img src={registerImg} alt="register" className="register-img" />
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Register;


// import React from 'react';
// import { Link } from 'react-router-dom'; // Tambahkan ini
// import './Register.css';

// // Import gambar
// import logo from './assets/images/logoBrand.png';
// import registerImg from './assets/images/imageLoginReg.png';

// const Register = () => {
//   return (
//     <>
//       <title>Register - PurrfectMate</title>
//       <main>
//         <div className="container-fluid">
//           <div className="row">
//             <div className="col-sm-6 register-section-wrapper">
//               <div className="brand-wrapper">
//                 <img src={logo} alt="logo" className="logo" />
//               </div>
//               <div className="register-wrapper my-auto">
//                 <h1 className="register-title">Register</h1>
//                 <form action="#!">
//                   <div className="form-group">
//                     <label htmlFor="name">Nama Lengkap</label>
//                     <input
//                       type="text"
//                       name="name"
//                       id="name"
//                       className="form-control"
//                       placeholder="Masukkan nama lengkap"
//                     />
//                   </div>
//                   <div className="form-group">
//                     <label htmlFor="email">Email</label>
//                     <input
//                       type="email"
//                       name="email"
//                       id="email"
//                       className="form-control"
//                       placeholder="email@example.com"
//                     />
//                   </div>
//                   <div className="form-group">
//                     <label htmlFor="phone">No. HP</label>
//                     <input
//                       type="tel"
//                       name="phone"
//                       id="phone"
//                       className="form-control"
//                       placeholder="08xxxxxxxxxx"
//                     />
//                   </div>
//                   <div className="form-group mb-4">
//                     <label htmlFor="password">Password</label>
//                     <input
//                       type="password"
//                       name="password"
//                       id="password"
//                       className="form-control"
//                       placeholder="Buat password"
//                     />
//                   </div>
//                   <input
//                     name="register"
//                     id="register"
//                     className="btn btn-block register-btn"
//                     type="button"
//                     value="Register"
//                   />
//                 </form>

//                 <div className="spacer-after-register-btn" />

//                 <p className="register-wrapper-footer-text">
//                   Already have an account?{' '}
//                   <Link to="/login" className="text-reset">
//                     Log in here
//                   </Link>
//                 </p>
//               </div>
//             </div>
//             <div className="col-sm-6 px-0 d-none d-sm-block">
//               <img src={registerImg} alt="register image" className="register-img" />
//             </div>
//           </div>
//         </div>
//       </main>
//     </>
//   );
// };

// export default Register;
