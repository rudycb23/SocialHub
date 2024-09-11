import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import "../App.css";

import logoTeam from "../assets/logoTeam.png";
import rudyImg from "../assets/Rudy.png";
import brendaImg from "../assets/Brenda.png";
import darcyImg from "../assets/Darcy.png";
import dianaImg from "../assets/Diana.png";
import luisImg from "../assets/Luis.png";
import margarethImg from "../assets/Margareth.png";

class Equipo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      equipo: [
        {
          nombre: "Rudy",
          apellido: "Campos",
          apellido2: "Badilla",
          cargo: "Desarrollador Frontend",
          imagen: rudyImg,
        },
        {
          nombre: "Brenda",
          apellido: "Marchena",
          apellido2: "Jiménez",
          cargo: "Diseñadora UX/UI",
          imagen: brendaImg,
        },
        {
          nombre: "Darcy",
          apellido: "Solís",
          apellido2: "Rojas",
          cargo: "Tester de Calidad (QA)",
          imagen: darcyImg,
        },
        {
          nombre: "Diana",
          apellido: "Villalta",
          apellido2: "Quiros",
          cargo: "Gestora de Proyecto / Scrum Master",
          imagen: dianaImg,
        },
        {
          nombre: "Luis",
          apellido: "Ortiz",
          apellido2: "Castillo",
          cargo: "Desarrollador Backend",
          imagen: luisImg,
        },
        {
          nombre: "Margareth",
          apellido: "Martinez",
          apellido2: "Alfaro",
          cargo: "Especialista en Seguridad y Privacidad",
          imagen: margarethImg,
        },
      ],
    };
  }

  render() {
    return (
      <Container className="mt-5 py-4 ">
        <img className="logoTeam mb-2" src={logoTeam} alt="Logo del equipo" />
        <h1 className="my-3 text-white">Equipo de Desarrollo de SocialHub</h1>
        <Row>
          {this.state.equipo.map((equipo, index) => (
            <Col key={index} sm={12} md={6} lg={4} className="mb-4">
              <Card className="custom-card bg-black">
                <Card.Img
                  variant="top"
                  src={equipo.imagen}
                  className="card-img-equipo mt-2 card-img-equipo"
                />
                <Card.Body className="card-body-equipo mt-1 mb-3 p-1 bg-black text-white">
                  <Card.Title className="card-title-equipo">
                    {equipo.nombre} {equipo.apellido} {equipo.apellido2}
                  </Card.Title>
                  <Card.Text>{equipo.cargo}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    );
  }
}

export default Equipo;
