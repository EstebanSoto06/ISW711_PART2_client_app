import React from "react";
import Card from '../components/card';
import NavigationBar from "../components/navigationBar";
import { useUserContext } from '../authContext/authContext';
import jwtDecode from "jwt-decode";

const MainPage = () =>{
  const { user } = useUserContext();

  const tokenData = JSON.parse(sessionStorage.getItem('token'));
  const token = tokenData.token;

  const isAdmin = user?.token ? jwtDecode(user.token).permission.includes('admin') : false;
    return (
      <div>
        <NavigationBar/>
        <h1 className='mx-2'>MY OWN AI PROMPTS APP</h1>
        <div className='d-flex flex-wrap flex-row mx-2 my-2'>
        <div className='col-md-4 col-12'>
          <Card
            title="My Prompts"
            info="Here you can create, edit, delete and use your own prompts using OpenAI's API."
            linkTo="/promptsPage"
          />
        </div>
        <div className='col-md-4 col-12'>
          <Card
            title="My Tags"
            info="Here you can create, edit, delete and use your own tags for your prompts."
            linkTo="/tagsPage"
          />
        </div>
        <div className='col-md-4 col-12'>
          {isAdmin ? (<Card
                                title="Users"
                                info="Here you can create, edit, delete and use registered users."
                                linkTo="/usersPage"
                              />) : (<span></span>)}
          </div>
          </div>
        <footer>
          <p>Copyright 2023</p>
        </footer>
      </div>
    );
};

export default MainPage;