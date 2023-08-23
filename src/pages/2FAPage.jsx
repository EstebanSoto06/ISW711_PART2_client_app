import React, { useState } from "react";
import "../login/loginForm.css";
import { Link, useNavigate } from 'react-router-dom';
import { useUserContext } from '../authContext/authContext';
import jwtDecode from "jwt-decode";

const TwoFApage = () => {
    const [code, setCode] = useState("");
    const { user } = useUserContext();
    const navigate = useNavigate();

    const handleVerification = async (event) => {
        event.preventDefault();
        if (code == jwtDecode(user.token).twoFAcode){
            navigate('/mainPage');
        } else {
            window.alert('Code invalid or incorrect');
        }
    }

    return (
        <div className="login-form">
        <form>
            <h2>TWO FACTOR AUTHENTICATION</h2>
            <input
            type="text"
            placeholder="Your code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            />
            <button  className="my-2 btn btn-secondary" onClick={handleVerification}>Verify</button>
        </form>
        </div>
    );
};

export default TwoFApage;