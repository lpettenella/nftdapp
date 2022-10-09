import React, { useEffect, useState } from 'react'
import "bootstrap/dist/css/bootstrap.min.css";
import {Form , Container, Input, Row, Button, Label, Col, Alert} from 'react-bootstrap';  
import { auth } from '../utils/Auth';

export default function Create() {

  const [name, setName] = useState("");
  const [file, setFile] = useState();

  async function handleSubmit(e) {
    const picture = file.files[0];
    const blob = new Blob([picture],{type: picture.type}); 
    const arrayBuffer = [...new Uint8Array(await blob.arrayBuffer())];

    try {
      await auth.init();
      await auth.nftservice.mintForMyself(false, file.type, arrayBuffer, name);
    } catch (e) {
      console.log(e)
    }
  }


  return (
    <form onSubmit={handleSubmit}>
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
    </form>
  );
}

