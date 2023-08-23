import React, { useState, useEffect } from 'react';
import {
  MDBBtn,
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBModalFooter,
} from 'mdb-react-ui-kit';

export default function ModalResponse({show, response, onClose, type}) {

  return (
    <>
      <MDBModal show={show} tabIndex='-1'>
        <MDBModalDialog>
          <MDBModalContent>
            <MDBModalHeader>
              <MDBModalTitle>AI RESPONSE</MDBModalTitle>
              <MDBBtn className='btn-close' color='none' onClick={onClose}></MDBBtn>
            </MDBModalHeader>
            {type === "image" ?
            (<img src={response} alt="AI Response" style={{ width: '100%', height: 'auto' }} />)
            : (<MDBModalBody>{response}</MDBModalBody>)
            }
            <MDBModalFooter>
              <MDBBtn onClick={onClose}>Close</MDBBtn>
            </MDBModalFooter>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
    </>
  );
}