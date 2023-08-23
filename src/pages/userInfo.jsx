import React, { useState, useEffect } from "react";
import {faUser, faEdit, faCheck, faX, faUnlockAlt, faCancel, faSave} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import NavigationBar from "../components/navigationBar";
import { useUserContext } from '../authContext/authContext';
import jwtDecode from "jwt-decode";

const UserInfo = () =>{
    const { user } = useUserContext();
    let [data, setData] = useState([]);
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [newPasswordConfirm, setNewPasswordConfirm] = useState("");
    const [TwoFA, setTwoFA] = useState();
    const [editing, setEditing] = useState(false);

    const tokenData = JSON.parse(sessionStorage.getItem('token'));
    const token = tokenData.token;

    useEffect(() => {
        getUserInfo(jwtDecode(user.token).userId);
    }, [])

    async function getUserInfo(userID) {
        try {
          const userResponse = await fetch("http://localhost:3001/api/users?id="+userID,
          {
            headers: { 'Authorization': `Bearer ${token}`}
          });
          if (!userResponse.ok) {
            window.alert('Error al obtener los tags');
          } else {
            const userInfo = await userResponse.json();  
            
            setData(userInfo);
          }
        } catch (err) {
          alert(`Fallo en tiempo de respuesta` + err);
        };
    };

    async function editUser(id){
        if (email== "" || username=="" || oldPassword=="" || oldPassword==""){
            alert(`Verifica que los campos contengan datos`);
        } else {
            if (oldPassword != data.password) {
                alert("Incorrect password");
            } else {
                if (newPassword === newPasswordConfirm){
                    const data = {
                        email: email,
                        password: newPassword,
                        username: username,
                        twoFA: TwoFA,
                        verified: true
                    };
                    try {
                        const response = await fetch(`http://localhost:3001/api/users?id=${id}`, {
                            method: 'PATCH',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${token}`
                            },
                            body: JSON.stringify(data)
                        });
                
                        if (!response.ok) {
                            throw new Error('Failed to verify user');
                        } else {
                            alert("Profile information edited");
                            getUserInfo(jwtDecode(user.token).userId);
                        }
                        setEditing(false);
                    } catch (error) {
                        console.error("Error while making the fetch request", error);
                    }
                } else {
                    alert("Passwords does not match")
                }
            }  
        };
    };

    const twoFASetter = () => {
        if (TwoFA){
            setTwoFA(false);
        } else {
            setTwoFA(true);
        }
        console.log(TwoFA);
    }

    const handleEdit = (username, email) => {
        setEditing(true);
        setUsername(username);
        setEmail(email);
    };

    return (
        <>
        <NavigationBar/>
        <div className="mx-5 my-2 fs-5">MY PROFILE</div>
        <div className="container mt-5">
            <div className="row">
                <div className="col-md-4">
                    <div className="text-center">
                        <FontAwesomeIcon icon={faUser} size="5x" />
                    </div>
                    <h2 className="mt-3 text-center">{data.username}</h2>
                    <p>ID: {data._id}</p>
                    <p>Email: {data.email}</p>
                    <p>Verified: {data.verified ? 
                        (<FontAwesomeIcon icon={faCheck}/>) 
                        : (<FontAwesomeIcon icon={faX} />)}
                    </p>
                    <p>
                        {data.admin ? "User type: Admin " : "User type: User"}
                        {data.admin ? <FontAwesomeIcon icon={faUnlockAlt} /> : <FontAwesomeIcon icon={faUser} />}
                    </p>
                </div>
                <div className="col-md-8">
                    <h3>Profile Information</h3>
                    <p>Hello, welcome to your profile page.</p>
                    <p>Here you can find your account information and edit it.</p>
                    <div>
                        {editing ? 
                        (
                            <div className="p-2">
                                USERNAME
                                <input className="mb-2" id="usernameInput" value={username} type="text" placeholder="Username..." style={{width: "100%"}} onChange={(e) => setUsername(e.target.value)}/>
                                EMAIL
                                <input className="mb-2" id="emailInput" value={email} type="text" placeholder="Email..." style={{width: "100%"}} onChange={(e) => setEmail(e.target.value)}/>
                                OLD PASSWORD
                                <input className="mb-2" type="text" placeholder="Your Password..." style={{width: "100%"}} onChange={(e) => setOldPassword(e.target.value)}/>
                                NEW PASSWORD
                                <input  type="text" placeholder="New Password..." style={{width: "100%"}} onChange={(e) => setNewPassword(e.target.value)}/>
                                CONFIRM NEW PASSWORD
                                <input className="mb-2" type="text" placeholder="Confirm New Password..." style={{width: "100%"}} onChange={(e) => setNewPasswordConfirm(e.target.value)}/>
                                <p className="mb-2">2 FACTOR AUTHENTICATION: {TwoFA ? 
                                    (<div><button  className="btn btn-success" onClick={() => twoFASetter()}><FontAwesomeIcon icon={faCheck}/></button></div>) 
                                    : (<div><button  className="btn btn-danger" onClick={() => twoFASetter()}><FontAwesomeIcon icon={faX} /></button></div>)}
                                </p>
                                <div className="d-flex justify-content-center align-items-center">
                                    <button className="btn btn-danger mx-2" onClick={() => setEditing(false)}>
                                        CANCEL EDIT <FontAwesomeIcon icon={faCancel} className="ml-2" />
                                    </button>
                                    <button className="btn btn-primary" onClick={() => editUser(jwtDecode(user.token).userId)}>
                                        SAVE CHANGES <FontAwesomeIcon icon={faSave} className="ml-2" />
                                    </button>
                                </div>
                            </div>
                        )
                        : (
                            <div className="text-center">
                                <button className="btn btn-primary" onClick={() => handleEdit(data.username, data.email)}>
                                    <FontAwesomeIcon icon={faEdit} className="mr-2" />
                                    Edit Profile
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}

export default UserInfo;