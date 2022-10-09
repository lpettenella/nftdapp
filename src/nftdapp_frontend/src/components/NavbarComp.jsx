import React, { useEffect, useState } from 'react'
import { Button } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link } from 'react-router-dom';
import { auth } from '../utils/Auth';

export default function NavbarComp( {isAuth, setAuth} ) {

  const handleLogin = async () => {
    await auth.login()
      .then(() => setAuth(true));
  }

  const handleLogout = async () => {
    await auth.logout()
      .then(() => setAuth(false));
  }

  return (
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
      <Container fluid>
        <Navbar.Brand href="/">Popeft</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="">Home</Nav.Link>
            <Nav.Link as={Link} to="wallet">Wallet</Nav.Link>
            <Nav.Link as={Link} to="create">Create</Nav.Link>
          </Nav>
          <Nav>
            { isAuth == null ? null : isAuth ?
              <Nav className="me-auto">
                <Navbar.Text>Your principal id: {auth.principal}</Navbar.Text>
                <Button variant="outline-light" onClick={() => handleLogout()}>Logout</Button>
              </Nav>
              :
              <Button variant="outline-light" onClick={() => handleLogin()}>Login with Internet Identity</Button>
            }
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}