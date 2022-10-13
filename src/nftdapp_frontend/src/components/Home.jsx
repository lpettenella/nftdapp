import React, { useEffect, useState} from 'react';
import TokenList from './TokenList';
import { auth } from '../utils/Auth';

export default function Home({isAuth}) {
  
  const [ tokenList, setTokenList ] = useState([]);

  useEffect(() => {
    const init = async () => {
      //await auth.init()
      try {
        const allTokens = await auth.nftservice.getAllTokens();
        setTokenList(allTokens);
        console.log("ga")
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
      <TokenList tokenList={tokenList} />
  )
}
