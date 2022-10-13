import React, { useEffect, useState } from 'react';
import TokenList from './TokenList';
import { Alert } from 'react-bootstrap';  
import { auth } from '../utils/Auth';

export default function Wallet({isAuth}) {
  
  const [ tokenList, setTokenList ] = useState([]);

  useEffect(() => {
    const init = async () => {
      try {
        await auth.init();
        const principal = await auth.client.getIdentity().getPrincipal();
        const yourTokens = await auth.nftservice.getUserTokens(principal);
        setTokenList(yourTokens);
      } catch (e) {
        console.log(e);
      }
    }
    const interval = setInterval(() => {
      init();
    }, 5000);

    init();
    return () => clearInterval(interval);
  }, []) 

  return (
    <>
    { isAuth ?
      <TokenList tokenList={tokenList} /> 
      : <Alert>Login with Internet Identity to see your Nfts!</Alert>
    }
    </>
  )
}
