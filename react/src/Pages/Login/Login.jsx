// import React from 'react';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';  // import useNavigate
import './Login.css';

// Import gambar
import logo from './assets/images/logoBrand.png';
import loginImg from './assets/images/imageLoginReg.png';


const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleLoginClick = async () => {
    if (!form.email.includes('@')) {
      setError('Email tidak valid');
      return;
    }

    try {
      const res = await fetch('http://localhost:5051/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Login gagal');
        return;
      }

      // Simpan token ke localStorage
      localStorage.setItem('token', data.token);

      // Jeda 3 detik sebelum redirect
      setError('Login berhasil! Redirect...');
      setTimeout(() => navigate('/dashboard'), 3000);
    } catch (err) {
      setError('Terjadi kesalahan saat login');
    }
  };

  return (
    <>
      <title>Login - PurrfectMate</title>
      <main>
        <div className="container-fluid">
          <div className="row">
            <div className="col-sm-6 login-section-wrapper">
              <div className="brand-wrapper">
                <img src={logo} alt="logo" className="logo" />
              </div>
              <div className="login-wrapper my-auto">
                <h1 className="login-title">Log in</h1>

                {error && <div className="alert alert-danger">{error}</div>}

                <form action="#!">
                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      className="form-control"
                      placeholder="email@example.com"
                      value={form.email}
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
                      placeholder="enter your password"
                      value={form.password}
                      onChange={handleChange}
                    />
                  </div>
                  <input
                    name="login"
                    id="login"
                    className="btn btn-block login-btn"
                    type="button"
                    value="Login"
                    onClick={handleLoginClick}
                  />
                </form>

                <div className="spacer-after-login-btn" />

                <p className="login-wrapper-footer-text">
                  Don't have an account?{' '}
                  <Link to="/register" className="text-reset">
                    Register here
                  </Link>
                </p>
              </div>
            </div>
            <div className="col-sm-6 px-0 d-none d-sm-block">
              <img src={loginImg} alt="login image" className="login-img" />
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Login;

// const Login = () => {
//   const navigate = useNavigate();

//   const handleLoginClick = () => {
//     // Di sini biasanya validasi login dulu, tapi sekarang langsung redirect saja
//     navigate('/dashboard');
//   };

//   return (
//     <>
//       <title>Login - PurrfectMate</title>
//       <main>
//         <div className="container-fluid">
//           <div className="row">
//             <div className="col-sm-6 login-section-wrapper">
//               <div className="brand-wrapper">
//                 <img src={logo} alt="logo" className="logo" />
//               </div>
//               <div className="login-wrapper my-auto">
//                 <h1 className="login-title">Log in</h1>
//                 <form action="#!">
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
//                   <div className="form-group mb-4">
//                     <label htmlFor="password">Password</label>
//                     <input
//                       type="password"
//                       name="password"
//                       id="password"
//                       className="form-control"
//                       placeholder="enter your password"
//                     />
//                   </div>
//                   <input
//                     name="login"
//                     id="login"
//                     className="btn btn-block login-btn"
//                     type="button"
//                     value="Login"
//                     onClick={handleLoginClick}  // tambahkan handler klik
//                   />
//                 </form>

//                 <div className="spacer-after-login-btn" />

//                 <p className="login-wrapper-footer-text">
//                   Don't have an account?{' '}
//                   <Link to="/register" className="text-reset">
//                     Register here
//                   </Link>
//                 </p>
//               </div>
//             </div>
//             <div className="col-sm-6 px-0 d-none d-sm-block">
//               <img src={loginImg} alt="login image" className="login-img" />
//             </div>
//           </div>
//         </div>
//       </main>
//     </>
//   );
// };

// export default Login;
