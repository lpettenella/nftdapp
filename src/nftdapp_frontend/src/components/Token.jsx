import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { _arrayBufferToBase64 } from '../utils/Utils';
import { Modal, Button, Col, Row, Form, Spinner, Image } from '../../../../node_modules/react-bootstrap/esm/index';
import { Principal } from "@dfinity/principal";
import { useNavigate } from 'react-router-dom';
import { auth } from '../utils/Auth';

export default function Token({isAuth}) {

  const [ token, setToken ] = useState();
  const [ price, setPrice ] = useState(0);
  const [ image, setImage ] = useState();
  const [ address, setAddress ] = useState("");
  const [ show, setShow ] = useState(false);
  const [ loading, setLoading ] = useState(false);
  
  const params = useParams();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  
  useEffect(() => {
    const returnToken = async () => {
      try {
        //await auth.init();
        const tokenInfo = await auth.nftservice.getTokenInfo(Number(params.id));
        const price = await auth.sale.getTokenPrice(tokenInfo.ok.index);
        setToken(tokenInfo);
        if(price != null)
          setPrice(price);
        setSrc(tokenInfo);
      } catch(e) {
        console.log(e);
      }
    }
    returnToken();
  }, [])

  function setSrc(tokenInfo) {
    if (tokenInfo.ok.metadata[0].location.InCanister) {
      const base64 = _arrayBufferToBase64(tokenInfo.ok.metadata[0].location.InCanister);
      const srcImg = "data:"+tokenInfo.ok.metadata[0].filetype+";base64," + base64;
      setImage(srcImg);
    }
  }

  const handleTransfer = async (e) => {
    try {
      e.preventDefault();
      setLoading(true);
      await auth.nftservice.transfer(Principal.fromText(address), token.ok.index);
      const tokenInfo = await auth.nftservice.getTokenInfo(Number(params.id));
      setToken(tokenInfo);
      handleClose();
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <>
      <Row>
        <Col md={6} sm={12} >
          <p style={{ textAlign: 'center' }}>
            <Image src={image} style={{ maxWidth: '100%' }} />
          </p>
        </Col>
        <Col md={3} sm={6}>
          {token ? 
          <div style={{ margin: '1em' }}>
            <h2 className='colorwhite'>{token.ok.metadata[0].name}</h2>
            <p style={{ textAlign: 'left' }}>
              <span>Owner</span>
              <span className='truncateLongTexts colorwhite' style={{ float: 'right' }}>{String(token.ok.owner)}</span>
            </p>
            <p style={{ textAlign: 'left' }}>
              <span>Price</span>
              <span className='colorwhite' style={{ float: 'right' }}>{price}</span>
            </p>
            { (String(token.ok.owner) === String(auth.principal)) ?
            <Button variant='light' onClick={handleShow}>Transfer</Button> : <></>
            }
          </div>
            : ""
          }
        </Col>
      </Row>

      <Modal className='my-modal' show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title className='colorwhite'>Transfer Token</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form onSubmit={handleTransfer}>
              <Form.Label>Transfer to</Form.Label>  
              <Form.Control type="text" placeholder="Put the Identity" value={address} onChange={(e) => setAddress(e.target.value)} required />
              { loading ? 
                <Spinner
                style={{ marginBottom: 27 }}
                animation="border"
                variant="light"/> :
                <Button variant="outline-light" type="submit">Transfer</Button>
              }
              </Form>
        </Modal.Body>
      </Modal>
    </>
  )
}
