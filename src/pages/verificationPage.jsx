import React, { useState } from "react";
import "../login/loginForm.css";
import { Link, useNavigate } from 'react-router-dom';
import { useUserContext } from '../authContext/authContext';
import jwtDecode from "jwt-decode";

const Verification = () => {
    const [code, setCode] = useState("");
    const { user } = useUserContext();
    const navigate = useNavigate();

    async function verifyUser(id){
        const data = {
            verified: true, 
        }

        try {
            const response = await fetch(`http://localhost:3001/api/users?id=${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    // Using an admin token for do the request
                    'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NGFhZmIxNjY1ZjdjZWFiODRhNWE3ODEiLCJuYW1lIjoiQWRtaW4iLCJwZXJtaXNzaW9uIjpbImNyZWF0ZSIsImVkaXQiLCJkZWxldGUiLCJhZG1pbiJdLCJpYXQiOjE2OTI0OTUxNzh9.5U6_qmpT1logezHOhmr5FH2tmN5ESBGZooy4uc2cxk4`
                },
                body: JSON.stringify(data)
            });
    
            if (!response.ok) {
                throw new Error('Failed to verify user');
            } else {
                alert("User verificado");
            }
        } catch (error) {
            console.error("Error while making the fetch request", error);
        }
    }

    const handleVerification = async (event) => {
        event.preventDefault();
        if (code == jwtDecode(user.token).twoFAcode){
            verifyUser(jwtDecode(user.token).userID);
            navigate('/mainPage');
        } else {
            window.alert('Verification code invalid or incorrect');
        }
    }

    return (
        <div className="login-form">
        <form>
            <h2>VERIFICATION PAGE</h2>
            <input
            type="text"
            placeholder="Verification Code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            />
            <button  className="my-2 btn btn-secondary" onClick={handleVerification}>Verify</button>
        </form>
        </div>
    );
};

export default Verification;