import React, { useState, useEffect } from "react";
import { ListGroup } from 'react-bootstrap';
import {faAdd, faCheck, faEdit, faRefresh, faTrashAlt, faX} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import NavigationBar from "../components/navigationBar";

const UsersPage = () =>{
    let [data, setData] = useState([]);
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [editing, setEditing] = useState(false);
    const [editID, setEditID] = useState("");

    const tokenData = JSON.parse(sessionStorage.getItem('token'));
    const token = tokenData.token;

    useEffect(() => {
        getUsers();
    }, [])

    async function getUsers() {
        try {
          const userResponse = await fetch("http://localhost:3001/api/users",
          {
            headers: { 'Authorization': `Bearer ${token}`,}
          });
          if (!userResponse.ok) {
            window.alert('Error getting users');
          } else {
            const users = await userResponse.json();  
            
            setData(users);
          }
        } catch (err) {
          alert(`Error: ` + err);
        };
    };

    async function newUser(){
        const data = {
            email: email,
            password: password,
            username: username
        };

        try {
            const response = await fetch("http://localhost:3001/api/users", {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            getData();
        } catch (error) {
            console.error("Error while making the fetch request", error);
        };
    };

    async function deleteUser(id){
        try {
            const response = await fetch(`http://localhost:3001/api/users?id=${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
                },
            });
    
            if (!response.ok) {
                throw new Error('Failed to delete user');
            } else {
                alert("User eliminado correctamente");
                getData();
            }
        } catch (error) {
            console.error("Error while making the fetch request", error);
        }
    };

    async function verifyUser(id){
        const data = {
            verified: true, 
            username: username
        }

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
                alert("User verificado");
                getData();
            }
        } catch (error) {
            console.error("Error while making the fetch request", error);
        }
    }

    async function unverifyUser(id){
        const data = {
            verified: false
        }

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
                alert("User verified");
                getData();
            }
        } catch (error) {
            console.error("Error while making the fetch request", error);
        }
    }

    async function editUser(id){
        const data = {
            email: email,
            password: password,
            username: username
        };

        if (email=== "" || username==="" || password===""){
            alert(`Verifica que los campos contengan datos`);
        } else {
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
                    alert("User edited");
                    getData();
                    setEditing(false);
                    document.getElementById("emailInput").value = "";
                    document.getElementById("usernameInput").value = "";
                    document.getElementById("passwordInput").value = "";
                }
            } catch (error) {
                console.error("Error while making the fetch request", error);
            }
        };
    };

    const handleSubmit = async () => {
        getUsers();

        if (email=== "" || username==="" || password===""){
            alert(`Verifica que los campos contengan datos`);
        } else {
            newUser();
            document.getElementById("emailInput").value = "";
            document.getElementById("usernameInput").value = "";
            document.getElementById("passwordInput").value = "";
        };
    };

    const handleDelete = (id) => {
        deleteUser(id);
    };

    const handleEdit = (id, email, username, password) => {
        setEditing(true);
        setEmail(email);
        setUsername(username);
        setPassword(password);
        setEditID(id);
        document.getElementById("emailInput").value = email;
        document.getElementById("usernameInput").value = username;
        document.getElementById("passwordInput").value = password;
    };

    function getData(){
        getUsers();
        setData(data);
    };

    return (
        <>
        <NavigationBar/>
        <div className="mx-5 my-2 fs-5">MY TAGS</div>
        <ListGroup horizontal className="d-flex mx-5 my-2">
            <ListGroup.Item className="w-25 text-center list-group-item-dark">ID</ListGroup.Item>
            <ListGroup.Item className="w-25 text-center list-group-item-dark">EMAIL</ListGroup.Item>
            <ListGroup.Item className="w-25 text-center list-group-item-dark">USERNAME</ListGroup.Item>
            <ListGroup.Item className="w-25 text-center list-group-item-dark">PASSWORD</ListGroup.Item>
            <ListGroup.Item className="text-center list-group-item-dark">VERIFIED</ListGroup.Item>
            <ListGroup.Item className="list-group-item-primary">EDIT</ListGroup.Item>
            <ListGroup.Item className="list-group-item-danger">DELETE</ListGroup.Item>
        </ListGroup>
        {data.map((item, index) => (
        <ListGroup key={index} horizontal className="d-flex mx-5">
            <ListGroup.Item className="w-50">{item._id}</ListGroup.Item>
            <ListGroup.Item className="w-50">{item.email}</ListGroup.Item>
            <ListGroup.Item className="w-50">{item.username}</ListGroup.Item>
            <ListGroup.Item className="w-50">{item.password}</ListGroup.Item>
            {item.verified ? 
            (<ListGroup.Item><button className="btn btn-success"  onClick={() => unverifyUser(item._id)}><FontAwesomeIcon icon={faCheck} /></button></ListGroup.Item>) 
            : (<ListGroup.Item><button className="btn btn-danger" onClick={() => verifyUser(item._id)}><FontAwesomeIcon icon={faX} /></button></ListGroup.Item>)}
            <ListGroup.Item><button className="btn btn-primary" onClick={() => handleEdit(item._id, item.email, item.username, item.password)}><FontAwesomeIcon icon={faEdit} /></button></ListGroup.Item>
            <ListGroup.Item><button className="btn btn-danger" onClick={() => handleDelete(item._id)}><FontAwesomeIcon icon={faTrashAlt} /></button></ListGroup.Item>
        </ListGroup>
        ))}
        <button className="btn btn-primary mx-5 my-2 me-auto" onClick={getData}>REFRESH DATA <FontAwesomeIcon icon={faRefresh}/></button>
        <div className="mx-5 my-2 fs-5">ADD NEW TAG</div>
        <ListGroup horizontal className="d-flex mx-5 my-2">
            <ListGroup.Item className="w-50 list-group-item-dark">ADD USER</ListGroup.Item>
            <ListGroup.Item className="w-100 list-group-item-dark"><input id="emailInput" type="text" placeholder="email" style={{width: "100%"}} onChange={(e) => setEmail(e.target.value)}/></ListGroup.Item>
            <ListGroup.Item className="w-100 list-group-item-dark"><input id="usernameInput" type="text" placeholder="username" style={{width: "100%"}} onChange={(e) => setUsername(e.target.value)}/></ListGroup.Item>
            <ListGroup.Item className="w-100 list-group-item-dark"><input id="passwordInput" type="text" placeholder="password" style={{width: "100%"}} onChange={(e) => setPassword(e.target.value)}/></ListGroup.Item>
            {editing ?
            (<ListGroup.Item className="list-group-item-dark"><button className="btn btn-primary" onClick={() => editUser(editID)}><FontAwesomeIcon icon={faEdit}/></button></ListGroup.Item>)
            :(<ListGroup.Item className="list-group-item-dark"><button className="btn btn-primary" onClick={() => handleSubmit()}><FontAwesomeIcon icon={faAdd}/></button></ListGroup.Item>)}     
        </ListGroup>
        </>
    )
}

export default UsersPage;