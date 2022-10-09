import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { auth } from '../utils/Auth';

export default function Token({isAuth}) {

  const [token, setToken] = useState();
  const params = useParams();

  useEffect(() => {
    const returnToken = async () => {
      try {
        //await auth.init();
        const tokenInfo = await auth.nftservice.getTokenInfo(Number(params.id));
        setToken(tokenInfo);
      } catch(e) {
        console.log(e);
      }
    }
    returnToken();
  }, [])

  return (
    <label>{token ? token.ok.metadata[0].name : "" }</label>
  )
}
