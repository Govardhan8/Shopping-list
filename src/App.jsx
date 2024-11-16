import { useState } from "react";
import { Container, Row, Col, Form, Button, Table } from "react-bootstrap";
import Select from "react-select";
import data from "./constants";
import { TrashIcon } from "@heroicons/react/24/solid";
import jsPDF from "jspdf";
import "jspdf-autotable";

export default function App() {
  const [selectedItem, setSelectedItem] = useState(null);
  const [quantity, setQuantity] = useState("");
  const [items, setItems] = useState([]);

  const options = data.map((item) => ({ value: item, label: item }));

  const handleAddItem = () => {
    if (selectedItem && quantity) {
      setItems((prevItems) => [...prevItems, { name: selectedItem, quantity }]);
      // Clear inputs
      setSelectedItem(null);
      setQuantity("");
    }
  };

  const handleDeleteItem = (index) => {
    setItems((prevItems) => prevItems.filter((_, i) => i !== index));
  };

  const downloadPdf = () => {
    const doc = new jsPDF();

    // Title
    doc.text("Items List", 20, 10);

    // Table data
    const tableColumn = ["#", "Item Name", "Quantity"];
    const tableRows = items.map((item, index) => [
      index + 1,
      item.name,
      item.quantity,
    ]);

    // AutoTable plugin generates the table
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });

    // Save the PDF
    doc.save("items-list.pdf");
  };

  return (
    <Container>
      <h1 className="m-4 text-center">Add Items to Your List</h1>
      <Row className="mb-3">
        <Col className="mt-1" md="6" sm="6" xs="8">
          <Select
            options={options}
            value={
              selectedItem ? { value: selectedItem, label: selectedItem } : null
            }
            onChange={(option) => setSelectedItem(option?.value || null)}
            placeholder="Search an item"
            isClearable
          />
        </Col>
        <Col className="mt-1" md="3" sm="3" xs="4">
          <Form.Control
            placeholder="Quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
        </Col>
        <Col
          className="mt-1 d-flex justify-content-center"
          md="3"
          sm="3"
          xs="12"
        >
          <Button
            variant="primary"
            onClick={handleAddItem}
            className="w-100"
            disabled={!(selectedItem && quantity)}
          >
            Add Item
          </Button>
        </Col>
      </Row>
      {items.length > 0 && (
        <>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>#</th>
                <th>Item Name</th>
                <th>Quantity</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item.name}</td>
                  <td>{item.quantity}</td>
                  <td>
                    <TrashIcon
                      style={{
                        width: 24,
                        height: 24,
                        color: "red",
                        cursor: "pointer",
                      }}
                      onClick={() => handleDeleteItem(index)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Button variant="success" onClick={downloadPdf}>
            Download PDF
          </Button>
        </>
      )}
    </Container>
  );
}
