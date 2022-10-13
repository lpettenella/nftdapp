import React, { useEffect, useState } from 'react';
import {Container ,Card, Col, Button, Row} from 'react-bootstrap';  
import { _arrayBufferToBase64 } from '../utils/Utils';
import { Link } from 'react-router-dom';
import { auth } from '../utils/Auth';

export default function NftCard( {token} ) {

  const [price, setPrice] = useState();

  useEffect(() => {
    const getPrice = async () => {
      let tokenPrice = await auth.sale.getTokenPrice(token.index);
      if(tokenPrice.length > 0)
        setPrice(Number(tokenPrice) + " ICP");
    }
    getPrice();
  }, [])

  var array = _arrayBufferToBase64(token.metadata[0].location.InCanister);
  const src = "data:"+token.metadata[0].filetype+";base64," + array;
  const link = `/#/token/${token.index}`
  
  return (
    <>
      <Col xs={12} md={6} lg={3} >
        <Card className='card border-light bg-transparent text-white' style={{ maxWidth: '250px', maxHeight: '290px', margin: 'auto'}} >  
          <Card.Img variant="top" src={src} style={{ objectFit: 'cover', minHeight: '220px'}} />  
          <Card.Body> 
            <p style={{ textAlign: 'left' }}>
              {token.metadata[0].name} <span style={{ float: 'right', color: 'green' }}><b>{price}</b></span> 
            </p>  
            <a href={link} className='stretched-link' />
          </Card.Body>  
        </Card>  
      </Col>
    </>
  )
}

let link = document.createElement('a');
    link.href = "#";
    link.className = "stretched-link"
    link.onclick = function() { renderNft(token.index, authClient); }