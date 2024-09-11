import React from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";

const ContactPage = () => {
  return (
    <div className="login template d-flex justify-content-center align-items-center vh-100">
      <Container>
        <Row className="justify-content-center">
          <Col md={8} className="p-5 rounded bg-white">
            <h1>Contacto</h1>
            <p>
              ¡Nos encantaría escuchar de ti! Puedes ponerte en contacto con
              nosotros a través de los siguientes medios:
            </p>
            <ul className="text-left">
              <li>Correo electrónico: soporte@socialhub.com</li>
              <li>Teléfono: +1234567890</li>
              <li>Redes Sociales: social-hub-redes</li>
            </ul>
            <p className="text-left">
              O puedes completar el formulario a continuación:
            </p>
            <Form>
              <Form.Group controlId="formBasicName">
                <Form.Label>Nombre:</Form.Label>
                <Form.Control type="text" placeholder="Ingresa tu nombre" />
              </Form.Group>

              <Form.Group controlId="formBasicEmail">
                <Form.Label>Correo electrónico:</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Ingresa tu correo electrónico"
                />
              </Form.Group>

              <Form.Group controlId="formBasicMessage">
                <Form.Label>Mensaje:</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Escribe tu mensaje aquí"
                />
              </Form.Group>

              <Button className="mt-3" variant="primary" type="submit">
                Enviar
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ContactPage;
