import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import { ProductTable } from '../ProductTable/ProductTable';
import { SearchBar } from '../SearchBar/SearchBar';
import { useProductListQuery, AttributeInput } from '../../generated/graphql';
import { ProductFilters } from '../ProductFilters/ProductFilters';
import { ItemAddedAlert } from '../AddToCart/ItemAddedAlert';

export interface SearchContainerProps {
  addItem: any
};

export const SearchContainer: React.FC<SearchContainerProps> = ({addItem}) => {
  const useQuery = () => {
    return new URLSearchParams(useLocation().search);
  }
  const query = useQuery();
  const initialSearchQuery = query.get('q');
  const [searchQuery, setSearchquery] = useState(initialSearchQuery|| '');
  const [attributes, setAttributes] = useState<Array<AttributeInput>>([]);
  const [showAlert, setShowAlert] = useState(false);
  const [selectedQuantity, setSelectedQuantity ] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState("");
  const { loading, error, data} = useProductListQuery({
    variables: {filter: {search: searchQuery, attributes: attributes, isPublished: true}, first: 100}
});

  let results: any = [];
  if (data) {
    results = data.products?.edges.map(({node}) => {
      return {
        otherData: {
          saved: false,
          status: "Incoming Stock",
        },
        product: node
      }
    }) || []
  }
  return (
    <>
    <ItemAddedAlert 
      productName={selectedProduct || "Item"}
      quantity={selectedQuantity}
      show={showAlert}
      hideAlert={() => setShowAlert(false)}
    />
    <Container onClick={() => showAlert && setShowAlert(false)}>
      <Row>
        <Col lg={2}>
          <ProductFilters setFilters={(filters: AttributeInput[]) => {setAttributes(filters)}} />
        </Col>
        <Col>
          <SearchBar initialSearchQuery={initialSearchQuery} updateSearchQuery={(searchString) => { return (setSearchquery(searchString))}} />
          <ProductTable 
            loading={loading}
            productData={results}
            addItem={addItem}
            updateSelectedProduct={(productName: string) => setSelectedProduct(productName)}
            updateSelectedQuantity={(quantity: number) => setSelectedQuantity(quantity)}
            showItemAddedAlert={ () => setShowAlert(true)}
          />
        </Col>
      </Row>
    </Container>
    </>
  )
}
