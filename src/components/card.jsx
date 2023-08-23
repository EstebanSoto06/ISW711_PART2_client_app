import React from 'react';
import { Link } from 'react-router-dom';
import {
  MDBCard,
  MDBCardBody,
  MDBCardTitle,
  MDBCardText,
  MDBBtn
} from 'mdb-react-ui-kit';
import './card.css';

export default function Card(props) {
  const { title, info, linkTo } = props;

  return (
    <MDBCard background='dark' className='text-white custom-background p-2 mx-1 my-3'>
      <MDBCardBody>
        <MDBCardTitle>{title}</MDBCardTitle>
        <MDBCardText>
          {info}
        </MDBCardText>
        <Link to={linkTo}><MDBBtn>Go to the page</MDBBtn></Link>
      </MDBCardBody>
    </MDBCard>
  )
}