import React, { useEffect, useRef, useState } from 'react'
import "bootstrap/dist/css/bootstrap.min.css";
import { Form , Card, Input, Row, Button, Label, Col, Alert, Spinner } from 'react-bootstrap';  
import { auth } from '../utils/Auth';
import { useNavigate } from 'react-router-dom';

export default function Create({isAuth}) {

  const navigate = useNavigate();

  const [ name, setName ] = useState("");
  const [ price, setPrice ] = useState(0.00);
  const [ file, setFile ] = useState();
  const [ src, setSrc ] = useState();
  const [ loading, setLoading ] = useState(false);

  function handleFile() {
    setSrc(URL.createObjectURL(file.files[0]));
  }

  function handleName(name) {
    setName(name);
  }

  function handlePrice(price) {
    setPrice(price);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const picture = file.files[0];
    const blob = new Blob([picture],{type: picture.type}); 
    const arrayBuffer = [...new Uint8Array(await blob.arrayBuffer())];

    try {
      await auth.init();
      const loggedIn = await auth.client.isAuthenticated();
      if(loggedIn) {
        let token = await auth.nftservice.mintForMyself(false, file.type, arrayBuffer, name)
        await auth.sale.sale(token.Ok[0], Number(price));
        navigate(`/token/${token.Ok[0]}`);
      }
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <>
    { isAuth == true ?
      <div style={{ width: '50%', margin: 'auto' }}>
        <form onSubmit={handleSubmit} style={{ marginTop: '1em', textAlign: 'left' }}>
          <Form.Label style={{ float: "left" }}>Upload an image</Form.Label>
          <Form.Control id="file" type="file" ref={(ref) => setFile(ref)} onChange={handleFile} required></Form.Control>
          <Form.Label style={{ float: "left" }}>Set a name</Form.Label>
          <Form.Control type="text" placeholder="Name" value={name} onChange={(e) => handleName(e.target.value)} required />
          <Form.Label style={{ float: "left" }}>Set a price</Form.Label>
          <Form.Control type="number" step="0.01" placeholder="Price" value={price} onChange={(e) => handlePrice(e.target.value)} required />
          {
            loading ? <Spinner
              style={{ marginTop: '1em' }}
              animation="border"
              variant="light"/> :
            <Button style={{ marginTop: '1em' }} variant="outline-light" type="submit">Create</Button>
          }
        </form> 
        <div style={{ marginTop: '1em', textAlign: 'left' }}>
          <Row>
            <Col md={6}>
              <Card className='card border-light bg-transparent text-white' style={{ maxWidth: '250px', maxHeight: '290px', margin: 'auto'}} >  
                <Card.Img variant="top" src={src} style={{ objectFit: 'cover', height: '220px'}} />  
                <Card.Body>  
                  <Card.Title>{name}</Card.Title>  
                </Card.Body>  
              </Card>
            </Col>  
            <Col md={6}><span>This is your preview</span></Col>
          </Row>
        </div>
      </div>
      : <Alert>Login with Internet Identity to create new Nfts!</Alert>
    }
    </>
  );
}