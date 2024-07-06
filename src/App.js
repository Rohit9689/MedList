import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Button, Table, Modal, Form } from 'react-bootstrap';

const App = () => {
  const [medicines, setMedicines] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newMedicine, setNewMedicine] = useState({
    name: '',
    manufacturer: '',
    price: '',
    label: '',
    quantity: '',
    type: '', 
  });
  const [autocompleteResults, setAutocompleteResults] = useState([]);
  const [autocompleteVisible, setAutocompleteVisible] = useState(false);

  const types = ['allopathy', 'otc', 'fmcg']; 

  useEffect(() => {
    axios.get('https://dev.entrolabs.com/snomed/pharmapold/audit/?getAuditMedicines=true&page=1&sku_type=&sku_name=')
      .then(response => {
        setMedicines(response.data.results || []);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleAddMedicine = () => {
    setMedicines([...medicines, newMedicine]);
    setShowAddModal(false);
    setNewMedicine({ name: '', manufacturer: '', price: '', label: '', quantity: '', type: '' });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewMedicine(prevState => ({
      ...prevState,
      [name]: value
    }));
    if (name === 'name' && value.length > 1) {
      axios.get('https://dev.entrolabs.com/snomed/pharmapold/new/search.php?q=${value}')
        .then(response => {
          setAutocompleteResults(response.data.sku || []);
          setAutocompleteVisible(true);
        })
        .catch(error => {
          console.error('Error fetching autocomplete data:', error);
        });
    } else {
      setAutocompleteVisible(false);
    }
  };

  const handleSelectAutocomplete = (selectedMedicine) => {
    setNewMedicine({
      name: selectedMedicine.name,
      manufacturer: selectedMedicine.manufacturer,
      price: selectedMedicine.price,
      label: selectedMedicine.label,
      quantity: selectedMedicine.quantity,
      type: newMedicine.type,
    });
    setAutocompleteVisible(false);
  };

  const filteredMedicines = medicines.filter(medicine =>
    medicine.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container>
      <Row className="my-4">
        <Col>
          <input
            type="text"
            placeholder="Search medicines..."
            value={searchTerm}
            onChange={handleSearch}
            className="form-control"
          />
        </Col>
        <Col className="text-right">
          <Button onClick={() => setShowAddModal(true)}>Add Medicine</Button>
        </Col>
      </Row>
      <Row>
        <Col>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Name</th>
                <th>Manufacturer</th>
                <th>Price</th>
                <th>Label</th>
                <th>Quantity</th>
                <th>Type</th> 
              </tr>
            </thead>
            <tbody>
              {filteredMedicines.map((medicine, index) => (
                <tr key={index}>
                  <td>{medicine.name}</td>
                  <td>{medicine.manufacturer}</td>
                  <td>{medicine.price}</td>
                  <td>{medicine.label}</td>
                  <td>{medicine.quantity}</td>
                  <td>{medicine.type}</td> 
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Medicine</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formMedicineName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={newMedicine.name}
                onChange={handleChange}
                placeholder="Enter medicine name"
              />
              {autocompleteVisible && autocompleteResults.length > 0 && (
                <div className="autocomplete-dropdown">
                  {autocompleteResults.map((result, index) => (
                    <div
                      key={index}
                      className="autocomplete-item"
                      onClick={() => handleSelectAutocomplete(result)}
                      style={{borderColor:'1px solid black'}}
                    >
                     
                     <span>{result.name}<br/>{result.manufacturer} | {result.label} | {result.price}</span>

                    </div>
                  ))}
                </div>
              )}
            </Form.Group>
            <Form.Group controlId="formManufacturer">
              <Form.Label>Manufacturer</Form.Label>
              <Form.Control
                type="text"
                name="manufacturer"
                value={newMedicine.manufacturer}
                onChange={handleChange}
                placeholder="Enter manufacturer"
              />
            </Form.Group>
            <Form.Group controlId="formPrice">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                name="price"
                value={newMedicine.price}
                onChange={handleChange}
                placeholder="Enter price"
              />
            </Form.Group>
            <Form.Group controlId="formLabel">
              <Form.Label>Label</Form.Label>
              <Form.Control
                type="text"
                name="label"
                value={newMedicine.label}
                onChange={handleChange}
                placeholder="Enter label"
              />
            </Form.Group>
            <Form.Group controlId="formQuantity">
              <Form.Label>Quantity</Form.Label>
              <Form.Control
                type="number"
                name="quantity"
                value={newMedicine.quantity}
                onChange={handleChange}
                placeholder="Enter quantity"
              />
            </Form.Group>
            <Form.Group controlId="formType">
              <Form.Label>SKU Type</Form.Label>
              <Form.Control
                as="select"
                name="type"
                value={newMedicine.type}
                onChange={handleChange}
              >
                <option value="">Select type</option>
                {types.map((type, index) => (
                  <option key={index} value={type}>{type}</option>
                ))}
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>Close</Button>
          <Button variant="primary" onClick={handleAddMedicine}>Add Medicine</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default App;






