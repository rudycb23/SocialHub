import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import "../App.css";

const AboutPage = () => {
  return (
    <div className="about-page vh-100 text-white d-flex justify-content-center align-items-center">
      <Container className="text-center">
        <Row>
          <Col md={12}>
            <h1 className="mb-4">Acerca de nuestra aplicación</h1>
            <p>
              Bienvenido a Social Hub, una plataforma dedicada a conectar
              personas de todo el mundo y facilitar la interacción en línea. En
              Social Hub, creemos en construir comunidades vibrantes donde cada
              individuo pueda expresarse libremente, compartir sus intereses y
              conectar con otros de manera significativa.
            </p>
            <p>
              Nuestra misión es proporcionar una plataforma segura, inclusiva y
              enriquecedora que fomente el intercambio de ideas, la creatividad
              y la colaboración entre nuestros usuarios. Queremos que Social Hub
              sea un espacio donde puedas conectarte con amigos, familiares y
              nuevos conocidos de manera auténtica y significativa.
            </p>
            <p>
              Si tienes alguna pregunta o comentario, no dudes en{" "}
              <a className="text-white" href="/contact">
                contactarnos
              </a>
              .
            </p>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AboutPage;
