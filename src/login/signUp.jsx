import React, { useState } from "react";
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useUserContext } from '../authContext/authContext';

const SignUp = () => {
  const { setUser } = useUserContext();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [cellphone, setCellphone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [visible, setVisible] = useState(true);
  const url = 'http://localhost:3001/api/users/';
  const navigate = useNavigate();

  function generateVerificationCode() {
    const min = 100000; 
    const max = 999999; 
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  async function userPOST(username, email, password, cellphone) {
    const code = generateVerificationCode();
    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        "username": username,
        "email": email,
        "password": password,
        "cellphone": cellphone,
        "verificationCode" : code
      })
    }).then((response) => {
      return response.json()
    }).then((res) => {
      if (res.status === 201) {
        console.log("Post successfully created!")
      }
    }).catch((error) => {
      console.log(error)
    })
    const userData = {
      verificationCode: code,
      email: email,
      password: password,
    };

    setUser(userData);
  };

  //Hacer funcion GET

  const handleSignUp = async (event) => {
    event.preventDefault();
    // Debe verificar si el correo ya se encuentra en la base de datos
    if (password === "") {
      window.alert("Please write a password");
    } else if (password === confirmPassword) {
      await userPOST(username, email, password, cellphone);
      navigate('/verification');
    } else {
      window.alert('Passwords are not the same');
    }
  };

  const togglePassword = () => {
    setVisible(!visible);
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-form">
      <form>
      <h2>Sign Up</h2>
      <input
        className="my-1"
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        className="my-1"
        type="text"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        className="my-1"
        type="text"
        placeholder="Cellphone"
        value={cellphone}
        onChange={(e) => setCellphone(e.target.value)}
      />
      <input
        className="my-1"
        type={showPassword ? "text" : "password"}
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <div className='password'>
      <input
        type={showPassword ? "text" : "password"}
        placeholder="Confirm Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
      <div onClick={togglePassword} className="mx-2">
        {visible ? <EyeOutlined style={{ color: 'white' }} /> : <EyeInvisibleOutlined style={{ color: 'white' }} />}
      </div>
      </div>
      <button className="btn btn-secondary my-2" onClick={handleSignUp}>Sign Up</button>

      <div className="link">
        <Link className="text-white" to="/">Sign In</Link>
      </div>
      </form>
    </div>
  );
};

export default SignUp;