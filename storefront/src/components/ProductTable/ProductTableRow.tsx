import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Modal, Table, Form, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookmark as farFaBookmark, faShoppingCart } from '@fortawesome/pro-regular-svg-icons';
import { faBookmark as fasFaBookmark } from '@fortawesome/pro-solid-svg-icons';

import { Product } from '../../generated/graphql';

import './producttable.scss';

export interface ProductTableRowProps {
  otherData: {
    saved: boolean,
    status?: string | undefined,
  },
  product: Product,
  addItem?: any
}
export const ProductTableRow: React.FC<ProductTableRowProps> = ({ otherData: {
  saved,
  status},
  product: {
    name,
    id,
    variants,
    attributes,
    pricing
  },
  addItem
}) => {
  const [show, setShow] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [quantitySelected, setQuantitySelected] = useState(1)

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleAddToCart = (event: React.SyntheticEvent) => {
    event.preventDefault()
    if(variants && variants[0]) {
      addItem(variants[0].id, quantitySelected)
    }
    setShowAlert(true)
    setTimeout(() => {
      handleClose()
      setShowAlert(false)
    }, 3500)
  }

  const unitPrice = (pricing?.priceRangeUndiscounted?.start?.gross.amount || 0).toFixed(2)

  function getAttributeValue (slugName: string): any {
    const matchingAttribute = attributes.filter(
      ({attribute: {slug}}) => slug === slugName)
    return matchingAttribute[0] && matchingAttribute[0].values[0]?.name
  }

  return (<tr>
    <td className="pr-0">
      {saved ? <FontAwesomeIcon icon={fasFaBookmark} className="text-primary" />
        : <FontAwesomeIcon icon={farFaBookmark} />}
    </td>
    <td>
      <div className="small">
        <strong className="text-uppercase">{getAttributeValue("manufacturer")}</strong> {variants && variants[0]?.sku}
      </div>
      <Link style={{textDecoration: "underline"}} to={`/products/${id}`}>{name}</Link>
      <div className="small mt-1">
        Spec Code: {getAttributeValue("spec-code")} | Ordering Code: {getAttributeValue("ordering-code")}
      </div>
    </td>
    <td className="text-center">{status}</td>
    <td className="text-center">{variants && variants[0]?.quantityAvailable}</td>
    <td className="text-center">${unitPrice}</td>
    <td className="text-center">
      <Button variant="primary" onClick={handleShow}>
        Select Quantity
      </Button>

      <Modal
        show={show}
        onHide={handleClose}
        size="lg"
        centered
      >
        <Form>
          <Modal.Header>
            <Modal.Title className="mb-0">Select Quantity to Order</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Alert 
              variant="primary"
              show={showAlert}
              dismissible
              onClose={() => {
                setShowAlert(false)
                handleClose()
              }}>
              Item has been added to your cart!
            </Alert>
            <Table borderless className="mb-0">
              <thead>
                <tr>
                  <th>Available Quantity</th>
                  <th>Quantity<span className="text-danger">*</span></th>
                  <th>Unit Price</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{variants && variants[0]?.quantityAvailable}</td>
                  <td>
                    <Form.Group controlId="quantity">
                      <Form.Label className="sr-only">Quantity</Form.Label>
                      <Form.Control 
                        type="number"
                        style={{'maxWidth' : '80px'}}
                        required 
                        min={1}
                        max={(variants && variants[0]?.quantityAvailable )|| 1}
                        value={quantitySelected}
                        onChange={(e) => setQuantitySelected(parseInt(e.currentTarget.value))}
                      />
                    </Form.Group>
                  </td>
                  <td>${unitPrice}</td>
                  <td>${(quantitySelected * parseInt(unitPrice)).toFixed(2)}</td>
                </tr>
              </tbody>
            </Table>

            <em>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</em>
          </Modal.Body>
          <Modal.Footer>
            <Button disabled={showAlert} type="submit" variant="primary" onClick={handleAddToCart}>
              Add to Order <FontAwesomeIcon icon={faShoppingCart} />
            </Button>
            <Button variant="link" onClick={handleClose}>
              Cancel
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </td>
  </tr>)
}