import React from 'react'
import NftCard from './NftCard'
import {Container, Row} from 'react-bootstrap';  

export default function TokenList( {tokenList} ) {
  return (
    <Container className='p-4'> 
      <Row className='g-3'> 
        {
          tokenList.map(token => {
            return <NftCard key={token.index} token={token} />
          })
        }
      </Row>
    </Container>
  )
}
