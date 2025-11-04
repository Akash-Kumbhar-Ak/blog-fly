// client/src/pages/LoginPage.js

import React, { useState } from 'react';
import apiService from '../services/apiService';
import './LoginPage.css';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  // 2. Use the 'useState' hook to create state variables for our form fields.
  // We initialize them with empty strings.
  const navigate=useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading,setLoading]=useState(false);
  const [error,SetError]=useState('');

  // 3. Create a handler function for form submission.
  const handleSubmit = async (event) => {
    event.preventDefault();
    SetError('');
    setLoading(true);
    try {
        const response=await apiService.post('/auth/login',{
            username,
            password,
        })

        localStorage.setItem('token',response.data.token);

        navigate('/admin/dashboard');
        // console.log("Login Successfully",response.data);
        // alert('Login Successfully Check the console for your credentials !')
        
    } catch (error) {
        console.error('Login failed Error',error);

        if(error.response && error.response.data && error.response.data.message){
            SetError(error.response.data.message);
        }else{
            SetError('Login Failed Please Try Again');
        }
        
    }finally{
        setLoading(false);
    }
    
  };

  return (
    <div className="login-page">
      <h2>Admin Login</h2>
      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Enter your password"
            // The input's value is controlled by the 'password' state variable.
            value={password}
            // The 'onChange' handler updates the state.
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="login-button">
          Log In
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
