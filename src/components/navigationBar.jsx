import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUserContext } from '../authContext/authContext';
import jwtDecode from "jwt-decode";
import { Button, Container, Nav, Navbar } from 'react-bootstrap';
import {faUser} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const NavigationBar = () => {
    const { user, setUser } = useUserContext();
    const navigate = useNavigate()

    const handleLogOut = async () => {
        sessionStorage.removeItem('token');
        setUser(null);
        navigate('/')
    }

    const isAdmin = user?.token ? jwtDecode(user.token).permission.includes('admin') : false;

    return (
        <>
            <Navbar expand="lg" className='bg-dark'>
                <Container>
                    <Navbar.Brand className='text-white'>Welcome back {jwtDecode(user.token).name}  <Link to="/userInfo" className="text-decoration-none"><FontAwesomeIcon icon={faUser} /></Link>
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" className='bg-white' />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="ms-auto">
                            <Nav.Link as={Link} to='/mainPage' className='text-white'>MainPage</Nav.Link>
                            <Nav.Link as={Link} to='/promptsPage' className='text-white'>Prompts</Nav.Link>
                            <Nav.Link as={Link} to='/tagsPage' className='text-white'>Tags</Nav.Link>
                            {isAdmin ? (
                                <Nav.Link as={Link} to='/usersPage' className='text-white'>Users</Nav.Link>
                            ) : (
                                <Nav.Link as="span" disabled>Users</Nav.Link>
                            )}
                            <Button className='mx-5' onClick={handleLogOut}>Log Out</Button>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </>
    )
};

export default NavigationBar;