import React from 'react';
import './Register.css';

// Import gambar
import logo from './assets/images/logoBrand.png';
import registerImg from './assets/images/imageLoginReg.png';

const Register = () => {
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
              <form action="#!">
                <div className="form-group">
                  <label htmlFor="name">Nama Lengkap</label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    className="form-control"
                    placeholder="Masukkan nama lengkap"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    className="form-control"
                    placeholder="email@example.com"
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
                  />
                </div>
                <input
                  name="register"
                  id="register"
                  className="btn btn-block register-btn"
                  type="button"
                  value="Register"
                />
              </form>

              <div className="spacer-after-register-btn" />

              <p className="register-wrapper-footer-text">
                Already have an account?{' '}
                <a href="#!" className="text-reset">
                  Log in here
                </a>
              </p>
            </div>
          </div>
          <div className="col-sm-6 px-0 d-none d-sm-block">
            <img src={registerImg} alt="register image" className="register-img" />
          </div>
        </div>
      </div>
    </main>
    </>
  );
};

export default Register;
