import { useState } from "react";
import { Header } from "./components/Header/header";
import { Row, Col } from "antd";
import "./App.css";

function App() {
  return (
    <>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={8}>
          <Header />
        </Col>
      </Row>
    </>
  );
}

export default App;
