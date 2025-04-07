import React from 'react';
import './assets/css/login.css';
import './assets/scss/login.scss';

// Import gambar
import logo from './assets/images/logo.svg';
import loginImg from './assets/images/login.jpg';

const Login = () => {
  return (
    <main>
      <div className="container-fluid">
        <div className="row">
          <div className="col-sm-6 login-section-wrapper">
            <div className="brand-wrapper">
              <img src={logo} alt="logo" className="logo" />
            </div>
            <div className="login-wrapper my-auto">
              <h1 className="login-title">Log in</h1>
              <form action="#!">
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
                <div className="form-group mb-4">
                  <label htmlFor="password">Password</label>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    className="form-control"
                    placeholder="enter your password"
                  />
                </div>
                <input
                  name="login"
                  id="login"
                  className="btn btn-block login-btn"
                  type="button"
                  value="Login"
                />
              </form>
              <a href="#!" className="forgot-password-link">
                Forgot password?
              </a>
              <p className="login-wrapper-footer-text">
                Don't have an account?{' '}
                <a href="#!" className="text-reset">
                  Register here
                </a>
              </p>
            </div>
          </div>
          <div className="col-sm-6 px-0 d-none d-sm-block">
            <img src={loginImg} alt="login image" className="login-img" />
          </div>
        </div>
      </div>
    </main>
  );
};

export default Login;
