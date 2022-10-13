import React, { useEffect, useState } from 'react'
import { Routes, Route, Link } from 'react-router-dom';
import Create from './components/Create';
import Home from './components/Home';
import NavbarComp from './components/NavbarComp';
import Wallet from './components/Wallet';
import Token from './components/Token';
import { auth } from './utils/Auth';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function App() {

  const [ isAuth, setIsAuth ] = useState(null);

  useEffect(() => {
    const init = async () => {
      setIsAuth(await auth.init())
    }
    init();
  }, [])

  function setAuth(isAuth) {
    setIsAuth(isAuth);
  }

  return (
    <>
      <div style={{ minHeight:'100%', backgroundColor:'#282c34' }}>
        <NavbarComp isAuth={isAuth} setAuth={setAuth} />
        <Link to="/create"></Link>
        <Routes>
          <Route path="/" element={<Home isAuth={isAuth} />} />
          <Route path="/wallet" element={<Wallet isAuth={isAuth} />} />
          <Route path="/create" element={<Create isAuth={isAuth} />} />
          <Route path="/token/:id" element={<Token isAuth={isAuth} />} />
        </Routes>
      </div>
    </>
  )
}
