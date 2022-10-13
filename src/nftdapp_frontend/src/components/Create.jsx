import React, { useEffect, useRef, useState } from 'react'
import "bootstrap/dist/css/bootstrap.min.css";
import {Form , Card, Input, Row, Button, Label, Col, Alert} from 'react-bootstrap';  
import { auth } from '../utils/Auth';

export default function Create({isAuth}) {

  const [name, setName] = useState("");
  const [file, setFile] = useState();
  const [src, setSrc] = useState();

  function handleFile() {
    setSrc(URL.createObjectURL(file.files[0]));
  }

  function handleName(name) {
    setName(name);
  }

  async function handleSubmit() {
    const picture = file.files[0];
    const blob = new Blob([picture],{type: picture.type}); 
    const arrayBuffer = [...new Uint8Array(await blob.arrayBuffer())];

    try {
      await auth.init();
      const loggedIn = await auth.client.isAuthenticated();
      if(loggedIn) {
        await auth.nftservice.mintForMyself(false, file.type, arrayBuffer, name);
      }
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <>
    { isAuth == true ?
      <div>
        <form onSubmit={handleSubmit} style={{ marginTop: '1em', textAlign: 'left' }}>
          <Form.Label style={{ float: "left" }}>Upload an image</Form.Label>
          <Form.Control id="file" type="file" ref={(ref) => setFile(ref)} onChange={handleFile} required></Form.Control>
          <Form.Label style={{ float: "left" }}>Set a name</Form.Label>
          <Form.Control type="text" placeholder="Name" value={name} onChange={(e) => handleName(e.target.value)} required />
          <Button variant="outline-light" type="submit">Create</Button>
        </form> 
        <div style={{ margin: 'auto', width: '50%', textAlign: 'left' }}>
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
/*
<Form.Group className="mb-3" controlId="formFile">
<Form.Label>Upload an image</Form.Label>
<Form.Control type="file" ref={(ref) => setFile(ref)} required />
</Form.Group>
<Form.Group className="mb-3" controlId="formBasicPassword">
<Form.Label>Name</Form.Label>
<Form.Control type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
</Form.Group>
<Form.Group className="mb-3">
<Button variant="outline-light" type="submit">
  Submit
</Button>
</Form.Group>
*/
