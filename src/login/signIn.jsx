import React, { useState } from "react";
import "./loginForm.css";
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
import { Link, useNavigate } from 'react-router-dom';
import { useUserContext } from '../authContext/authContext';

const SignIn = () => {
  const { setUser } = useUserContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [visible, setVisible] = useState(true);
  const [fastLogin, setFastLogin] = useState();
  const navigate = useNavigate();

  function generateVerificationCode() {
    const min = 100000;
    const max = 999999;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  async function usersLogin(email, password) {
    try {
      const userResponse = await fetch("http://localhost:3001/api/userLogin?email="+email+"&password="+password);
      if (!userResponse.ok) {
        window.alert('Erroneous data, please verify your information, or you can try creating a user.');
        return false;
      } else {
        const userData = await userResponse.json();

        const twoFAcode = generateVerificationCode();

        if (userData.verified){
          const tokenResponse = await fetch(
          "http://localhost:3001/api/session",
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json',},
            body: JSON.stringify({
              userID : userData._id,
              username : userData.username,
              twoFAcode : twoFAcode,
              admin : userData.admin
            }),
          });
        const token = await tokenResponse.json();

        setUser(token);
        sessionStorage.setItem('token', JSON.stringify(token));

        if (userData.twoFA) {
            const twoFAsms = await fetch("http://localhost:3001/api/sms", {
            method:"POST",
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              "message" : "Your 2FA code is: " + twoFAcode,
              "cellphone" : userData.cellphone
            }),
            });
            return { success: true, fastLogin: false };
        } else {
          return { success: true, fastLogin: true };
        }
        } else {
          return { success: false, fastLogin: false };
        }
      }
    } catch (err) {
      alert(`Time response fail`);
    };
  };

  const handleSignIn = async (event) => {
    event.preventDefault();
    const loginCheck = await usersLogin(email, password)

    if (loginCheck.success){
      console.log("Login successful");
      if (loginCheck.fastLogin) {
        navigate("/mainPage");
      } else {
        navigate("/verification");
      }
    } else {
      window.alert('Unverified user');
    }
  };

  const togglePassword = () => {
    setVisible(!visible);
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-form">
      <form>
        <h2>Sign In</h2>
        <input
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <div className='password'>
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className='eye' onClick={togglePassword}>
          {visible ? (<EyeOutlined style={{color: "white" }} />) : (<EyeInvisibleOutlined style={{ color: "white" }} />)}
        </div>
        </div>
        <button  className="btn btn-secondary"  onClick={handleSignIn}>Sign In</button>
        <div className="link">
          <Link  className="text-white" to="/signUp">Sign Up</Link>
        </div>
      </form>
    </div>
  );
};

export default SignIn;