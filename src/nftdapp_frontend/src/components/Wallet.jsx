import React, { useEffect, useState } from 'react';
import TokenList from './TokenList';
import { auth } from '../utils/Auth';

export default function Wallet({isAuth}) {
  
  const [ tokenList, setTokenList ] = useState([]);

  useEffect(() => {
    const init = async () => {
      try {
        await auth.init();
        const principal = await auth.client.getIdentity().getPrincipal();
        const yourTokens = await auth.nftservice.getUserTokens(principal);
        console.log (yourTokens);
        setTokenList(yourTokens);
      } catch (e) {
        console.log(e);
      }
    }
    init();
  }, []) 

  return (
      <TokenList tokenList={tokenList} />
  )
}
