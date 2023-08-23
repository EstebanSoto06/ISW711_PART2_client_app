import React, { useState, useEffect } from "react";
import { ListGroup } from 'react-bootstrap';
import {faAdd, faEdit, faRefresh, faTrashAlt} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import NavigationBar from "../components/navigationBar";
import { useUserContext } from '../authContext/authContext';
import jwtDecode from "jwt-decode";

const TagsPage = () =>{
    const { user } = useUserContext();
    let [data, setData] = useState([]);
    const [tagContent, setTag] = useState("");
    const [editing, setEditing] = useState(false);
    const [editID, setEditID] = useState("");

    useEffect(() => {
        getUserTags(jwtDecode(user.token).userId);
    }, [])

    const tokenData = JSON.parse(sessionStorage.getItem('token'));
    const token = tokenData.token;

    async function getUserTags(userID) {
        try {
          const userResponse = await fetch("http://localhost:3001/api/tags?userID="+userID,
          {
            headers: { 'Authorization': `Bearer ${token}`}
          });
          if (!userResponse.ok) {
            window.alert('Error al obtener los tags');
          } else {
            const userTags = await userResponse.json();  
            
            setData(userTags);
          }
        } catch (err) {
          alert(`Fallo en tiempo de respuesta` + err);
        };
    };

    async function newTag(){
        const data = {
            userID: jwtDecode(user.token).userId,
            name: tagContent
        };

        try {
            const response = await fetch("http://localhost:3001/api/tags", {
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
            document.getElementById("input").value = "";
        } catch (error) {
            console.error("Error while making the fetch request", error);
        };
    };

    async function deleteTag(id){
        try {
            const response = await fetch(`http://localhost:3001/api/tags?id=${id}`, 
            {
            method: 'DELETE',
            headers: {'Authorization': `Bearer ${token}`}
            });
            if (!response.ok) {
                throw new Error('Failed to delete tag');
            } else {
                alert("Tagt eliminado correctamente");
                getData();
            }
        } catch (error) {
            console.error("Error while making the fetch request", error);
        }
    };

    async function editTag(id){
        console.log("si entra");
        const data = {
            name: tagContent
        };

        if (tagContent === ""){
            alert(`Verifica que los campos contengan datos`);
        } else {
            try {
                const response = await fetch(`http://localhost:3001/api/tags?id=${id}`, {
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
                    alert("Tag edited");
                    getData();
                    setEditing(false);
                    document.getElementById("tagInput").value = "";
                }
            } catch (error) {
                console.error("Error while making the fetch request", error);
            }
        };
    };

    const handleSubmit = async () => {
        getUserTags(jwtDecode(user.token).userId);

        if (tagContent === ""){
            alert(`Nombre del tag vacío`);
        } else {
            newTag();
        };
    };

    const handleDelete = (id) => {
        deleteTag(id);
    };

    const handleEdit = (id, tag) => {
        setEditing(true);
        setTag(tag);
        setEditID(id);
        document.getElementById("tagInput").value = tag;
    };

    function getData(){
        getUserTags(jwtDecode(user.token).userId);
        setData(data);
    };

    return (
        <>
        <NavigationBar/>
        <div className="mx-5 my-2 fs-5">MY TAGS</div>
        <ListGroup horizontal className="d-flex mx-5 my-2">
            <ListGroup.Item className="w-25 text-center list-group-item-dark">ID</ListGroup.Item>
            <ListGroup.Item className="w-25 text-center list-group-item-dark">TAG</ListGroup.Item>
            <ListGroup.Item className="list-group-item-primary">EDIT</ListGroup.Item>
            <ListGroup.Item className="list-group-item-danger">DELETE</ListGroup.Item>
        </ListGroup>
        {data.map((item, index) => (
        <ListGroup key={index} horizontal className="d-flex mx-5">
            <ListGroup.Item className="w-25">{item._id}</ListGroup.Item>
            <ListGroup.Item className="w-25">{item.name}</ListGroup.Item>
            <ListGroup.Item><button className="btn btn-primary"  onClick={() => handleEdit(item._id, item.name)}><FontAwesomeIcon icon={faEdit} /></button></ListGroup.Item>
            <ListGroup.Item><button className="btn btn-danger" onClick={() => handleDelete(item._id)}><FontAwesomeIcon icon={faTrashAlt} /></button></ListGroup.Item>
        </ListGroup>
        ))}
        <button className="btn btn-primary mx-5 my-2 me-auto" onClick={getData}>REFRESH DATA <FontAwesomeIcon icon={faRefresh}/></button>
        <div className="mx-5 my-2 fs-5">ADD NEW TAG</div>
        <ListGroup horizontal className="d-flex mx-5 my-2">
            <ListGroup.Item className="list-group-item-dark">MESSAGE</ListGroup.Item>
            <ListGroup.Item className="w-100 list-group-item-dark"><input id="tagInput" type="text" placeholder="tag's name" style={{width: "100%"}} onChange={(e) => setTag(e.target.value)}/></ListGroup.Item>
            {editing ?
            (<ListGroup.Item className="list-group-item-dark"><button className="btn btn-primary" onClick={() => editTag(editID)}><FontAwesomeIcon icon={faEdit}/></button></ListGroup.Item>)
            :(<ListGroup.Item className="list-group-item-dark"><button className="btn btn-primary" onClick={() => handleSubmit()}><FontAwesomeIcon icon={faAdd}/></button></ListGroup.Item>)}     
        </ListGroup>
        </>
    )
}

export default TagsPage;