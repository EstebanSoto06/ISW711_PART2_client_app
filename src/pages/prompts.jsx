import React, { useState, useEffect } from "react";
import { ListGroup } from 'react-bootstrap';
import {faAdd, faEdit, faEject, faFilter, faRefresh, faTrashAlt} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import NavigationBar from "../components/navigationBar";
import Dropdown from "../components/dropdown";
import { useUserContext } from '../authContext/authContext';
import jwtDecode from "jwt-decode";
import ModalResponse from "../components/modal";

const PromptsPage = () =>{
    const [response, setResponse] = useState("");
    const [modalShow, setModalShow] = useState(false);
    const { user } = useUserContext();
    const [messageContent, setMessage] = useState("");
    const [type, setType] = useState("completion");
    const [tag, setTag] = useState("Default");
    const [editing, setEditing] = useState(false);
    const [editID, setEditID] = useState("");
    const [instruction, setInstruction] = useState("");
    let [data, setData] = useState([]);
    let [tags, setTags] = useState([]);

    const [typeFilter, setTypeFilter] = useState("");
    const [tagFilter, setTagFilter] = useState("");

    const REACT_APP_OPENAI_KEY = process.env.JWT_SECRET;

    const tokenData = JSON.parse(sessionStorage.getItem('token'));
    const token = tokenData.token;

    useEffect(() => {
        getUserPrompts(jwtDecode(user.token).userId);
        getUserTags(jwtDecode(user.token).userId);
    }, [])

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
            const tagList = userTags.map((item) =>item.name);

            setTags(tagList);
          }
        } catch (err) {
          alert(`Fallo en tiempo de respuesta` + err);
        };
    };
    
    async function getUserPrompts(userID) {
        try {
          const userResponse = await fetch("http://localhost:3001/api/prompts?userID="+userID,
          {
            headers: { 'Authorization': `Bearer ${token}`}
          });
          if (!userResponse.ok) {
            window.alert('Error al obtener los prompts');
          } else {
            const userPrompts = await userResponse.json();  
            
            setData(userPrompts);
          }
        } catch (err) {
          alert(`Fallo en tiempo de respuesta` + err);
        };
    };

    async function deletePromptRequest(id){
        try {
            const response = await fetch(`http://localhost:3001/api/prompts?id=${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}`}
            });
    
            if (!response.ok) {
                throw new Error('Failed to delete promptRequest');
            } else {
                alert("Prompt eliminado correctamente");
                getData();
            }
        } catch (error) {
            console.error("Error while making the fetch request", error);
        }
      };

    const handleDelete = (id) => {
        deletePromptRequest(id);
    }

    const handleSubmit = async (type) => {
        if (messageContent === ""){
            alert(`Contenido del prompt vacío`);
        } else {
            getUserPrompts(jwtDecode(user.token).userId);
            let object = {};

            if (type === "edit"){ 
                object = {
                    model: "text-davinci-002",
                    messages: {content: messageContent, instructions: instruction}
                }
            } else {
                object = {
                    model: "gpt-3.5-turbo",
                        messages: [
                        { role: "user", content: messageContent }
                        ]
                }
            }

            const data = {
                tag: tag,
                type: type,
                userID: jwtDecode(user.token).userId,
                data: object
            }

            if (type === "edit"){
                try {
                    const response = await fetch("http://localhost:3001/api/prompts", {
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
                    document.getElementById("messageInput").value = "";
                    document.getElementById("instructionInput").value = "";
                } catch (error) {
                    console.error("Error while making the fetch request", error);
                }
            } else if (type === "image"){
                try {
                    const response = await fetch("http://localhost:3001/api/prompts", {
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
                    document.getElementById("messageInput").value = "";
                } catch (error) {
                    console.error("Error while making the fetch request", error);
                }
            } else {
                try {
                    const response = await fetch("http://localhost:3001/api/prompts", {
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
                    document.getElementById("messageInput").value = "";
                } catch (error) {
                    console.error("Error while making the fetch request", error);
                }
            }   
        }
    };

    function getData(){
        getUserPrompts(jwtDecode(user.token).userId);
        setData(data);
        console.log(data);
        console.log(tags);
    };

    async function requestAI (messageContent, type, instruction) {
        setType(type);

        if (type === "edit"){
            const prompt = "'" + messageContent + "' " + instruction; 

            const edit = await fetch("https://api.openai.com/v1/engines/text-davinci-002/completions", {
                method: "POST",
                headers: {
                    Authorization : `Bearer ${REACT_APP_OPENAI_KEY}`,
                    "Content-Type" : "application/json",
                },
                body: JSON.stringify({
                    prompt: prompt
                })
            });
            if (!edit.ok) {
                throw new Error("Network response was not ok");
            } else {
                const generatedEdit = await edit.json(); 
                const response = generatedEdit.choices[0].text;
                console.log(response);
                openModal(response);
            }
        } else if (type === "image"){
            const image = await fetch("https://api.openai.com/v1/images/generations", {
                method: 'POST',
                headers: {
                    Authorization : `Bearer ${REACT_APP_OPENAI_KEY}`,
                    "Content-Type" : "application/json"
                },
                body: JSON.stringify({
                    "prompt": messageContent,
                    "n": 1,
                    "size": "1024x1024"
                })
            });
            if (!image.ok) {
                throw new Error("Network response was not ok");
            }
            const generatedImage = await image.json(); 
            const response = generatedImage.data[0].url;
            console.log(response);
            openModal(response);
        } else {
            const completion = await fetch("https://api.openai.com/v1/chat/completions", {
                method: "POST",
                headers: {
                    Authorization : `Bearer ${REACT_APP_OPENAI_KEY}`,
                    "Content-Type" : "application/json"
                },
                body: JSON.stringify({
                    model: "gpt-3.5-turbo",
                    messages: [{role: "user", content: messageContent}]
                })
            });
            if (!completion.ok) {
                throw new Error("Network response was not ok");
            } else {
                const generatedCompletion = await completion.json(); 
                const response = generatedCompletion.choices[0].message.content;
                console.log(response);
                openModal(response);
            }
        }     
    };

    async function editPrompt(id){
        if (messageContent=== ""){
            alert(`Verifica que los campos contengan datos`);
        } else {
            // Condicionar el tipo de prompt que se guarda
            if (type === "edit"){
                const data = {
                    tag: tag,
                    type: type,
                    data: {
                        model: "text-davinci-002",
                        messages: {content: messageContent, instructions: instruction}
                    }
                };
            
                try {
                    const response = await fetch(`http://localhost:3001/api/prompts?id=${id}`, {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify(data)
                    });
                    
                    if (!response.ok) {
                        throw new Error('Failed to edit prompt');
                    } else {
                        alert("Prompt edit");
                        getData();
                        setEditing(false);
                        document.getElementById("messageInput").value = "";
                        document.getElementById("instructionInput").value = "";
                    }
                } catch (error) {
                    console.error("Error while making the fetch request", error);
                }
            } else {
                const data = {
                    tag: tag,
                    type: type,
                    data: {
                        model: "gpt-3.5-turbo",
                        messages: [{ role: "user", content: messageContent }]
                    }
                };
            
                try {
                    const response = await fetch(`http://localhost:3001/api/prompts?id=${id}`, {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify(data)
                    });
                    
                    if (!response.ok) {
                        throw new Error('Failed to edit prompt');
                    } else {
                        alert("Prompt edit");
                        getData();
                        setEditing(false);
                        document.getElementById("messageInput").value = "";
                    }
                } catch (error) {
                    console.error("Error while making the fetch request", error);
                }
            };
        };   
    };

    const handleEdit = (id, type, tag, message, instruction) => {
        setEditing(true);
        setMessage(message);
        setType(type);
        setTag(tag);
        setEditID(id);
        document.getElementById("messageInput").value = message;
        if (type === "edit") {
            document.getElementById("instructionInput").value = instruction;
        }
    };

    const openModal = (response) => {
        setResponse(response);
        setModalShow(true);
    };

    const filterPrompts = async () => {  
        const userID = jwtDecode(user.token).userId;
        const tag = tagFilter;
        const type = typeFilter;

        try {
        const response = await fetch("http://localhost:3002/api/graphql", {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify(
                {
                    "query": `query { promptsByUserID(userID: \"${userID}\", tag: \"${tag}\"type: \"${type}\" ) { type tag data } }`
                }
              ),
        });

        const result = await response.json();
        setData(result.data.promptsByUserID);
        } catch (error) {
        console.error("Error fetching prompts:", error);
        }
    };

    return (
        <>
        <NavigationBar/>
        <div className="mx-5 my-2 fs-5">MY PROMPTS</div>
        <div className="mx-5 d-flex align-items-center ">
            <div style={{ maxWidth: '250px', marginRight: '10px' }}><Dropdown id="typeSelect" options={["", "completion", "image", "edit"]} onSelect={setTypeFilter} selectedOption={typeFilter} /></div>
            <div style={{ maxWidth: '250px', marginRight: '10px' }}><Dropdown options={[[""], ...tags]} onSelect={setTagFilter} selectedOption={tagFilter} /></div>
            <button className="btn btn-primary" onClick={() => filterPrompts()}><FontAwesomeIcon icon={faFilter} /></button>
            <button className="mx-2 btn btn-primary" onClick={() => getData()}>Clear Filters</button>
        </div>
        <ListGroup horizontal className="d-flex mx-5 my-2">
            <ListGroup.Item className="w-50 text-center list-group-item-dark">TAG</ListGroup.Item>
            <ListGroup.Item className="w-50 text-center list-group-item-dark">TYPE</ListGroup.Item>
            <ListGroup.Item className="w-50 text-center list-group-item-dark">MODEL</ListGroup.Item>
            <ListGroup.Item className="w-50 text-center list-group-item-dark">MESSAGE</ListGroup.Item>
            <ListGroup.Item className="list-group-item-primary">EDIT</ListGroup.Item>
            <ListGroup.Item className="list-group-item-success">EJECUTE</ListGroup.Item>
            <ListGroup.Item className="list-group-item-danger">DELETE</ListGroup.Item>
        </ListGroup>
        <ModalResponse  show={modalShow} response={response} onClose={() => setModalShow(false)} type={type}></ModalResponse>
        {data.map((item, index) => (
        <ListGroup key={index} horizontal className="d-flex mx-5">
            <ListGroup.Item className="w-25">{item.tag}</ListGroup.Item>
            <ListGroup.Item className="w-25">{item.type}</ListGroup.Item>
            <ListGroup.Item className="w-25">{item.data.model}</ListGroup.Item> 
            <ListGroup.Item className="w-25">
                {item.type === "edit" ? 
                ("Input: " + item.data.messages.content + " \nInstruction: " + item.data.messages.instructions)
                : (item.data.messages[0].content)}
            </ListGroup.Item>
            <ListGroup.Item><button className="btn btn-primary" onClick={() => handleEdit(item._id, item.type, item.tag, item.data.messages[0].content, item.data.messages.instructions)}><FontAwesomeIcon icon={faEdit} /></button></ListGroup.Item>
            <ListGroup.Item>
                {item.type === "edit" ? 
                (<button className="btn btn-success" onClick={() => requestAI(item.data.messages.content, item.type, item.data.messages.instructions)}><FontAwesomeIcon icon={faEject} /></button>)
                : (<button className="btn btn-success" onClick={() => requestAI(item.data.messages[0].content, item.type, "")}><FontAwesomeIcon icon={faEject} /></button>)}
            </ListGroup.Item>
            <ListGroup.Item><button className="btn btn-danger" onClick={() => handleDelete(item._id)}><FontAwesomeIcon icon={faTrashAlt} /></button></ListGroup.Item>
        </ListGroup>
        ))}
        <button className="btn btn-primary mx-5 my-2 me-auto" onClick={getData}>REFRESH DATA <FontAwesomeIcon icon={faRefresh}/></button>
        <div className="mx-5 my-2 fs-5">ADD NEW PROMPT</div>
        <ListGroup horizontal className="d-flex mx-5 my-2">
            <ListGroup.Item className="list-group-item-dark">MESSAGE</ListGroup.Item>
            {type === "edit" ?
            (<><ListGroup.Item className="w-100 list-group-item-dark"><input id="messageInput" type="text" placeholder="Write a message..." style={{width: "100%"}} onChange={(e) => setMessage(e.target.value)}/></ListGroup.Item>
            <ListGroup.Item className="w-100 list-group-item-dark"><input id="instructionInput" type="text" placeholder="Write a instruction..." style={{width: "100%"}} onChange={(e) => setInstruction(e.target.value)}/></ListGroup.Item></>)
            :(<ListGroup.Item className="w-100 list-group-item-dark"><input id="messageInput" type="text" placeholder="Write a message..." style={{width: "100%"}} onChange={(e) => setMessage(e.target.value)}/></ListGroup.Item>)
            }
            <ListGroup.Item className="w-50 list-group-item-dark"><Dropdown id="typeSelect" options = {["completion","image","edit"]} onSelect={setType} selectedOption={type}/></ListGroup.Item>
            <ListGroup.Item className="w-50 list-group-item-dark"><Dropdown options = {tags} onSelect={setTag} selectedOption={tag}/></ListGroup.Item>
            {editing ?
            (<ListGroup.Item className="list-group-item-dark"><button className="btn btn-primary" onClick={() => editPrompt(editID)}><FontAwesomeIcon icon={faEdit}/></button></ListGroup.Item>)
            :(<ListGroup.Item className="list-group-item-dark"><button className="btn btn-primary" onClick={() => handleSubmit(type)}><FontAwesomeIcon icon={faAdd}/></button></ListGroup.Item>)} 
        </ListGroup>
        </>
    )
};

export default PromptsPage;