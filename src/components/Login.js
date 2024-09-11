import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import Swal from "sweetalert2";
import { Container, Row, Col, Form, Button } from "react-bootstrap";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const auth = getAuth();
      await signInWithEmailAndPassword(auth, email, password);
      Swal.fire({
        icon: "success",
        title: "¡Inicio de sesión exitoso!",
        text: "Bienvenido a nuestra plataforma. Esperamos que tengas una experiencia increíble.",
      });
      navigate("/Mi-Feed");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error en el inicio de sesión",
        text: "La combinación de correo electrónico y contraseña no coincide. Por favor, verifica tus credenciales e inténtalo de nuevo.",
      });
    }
  };

  return (
    <Container fluid className="vh-100 d-flex justify-content-center align-items-center">
      <Row>
        <Col md={12} lg={12}>
          <div className="form_container p-5 rounded bg-white">
            <Form onSubmit={handleLogin}>
              <h3 className="text-center">Login</h3>
              <Form.Group className="mb-3">
                <Form.Label>Email:</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Ingrese su correo electrónico"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Password:</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Ingrese su contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Form.Group>
              <div className="d-grid">
                <Button type="submit" variant="primary">Iniciar sesión</Button>
              </div>
              <p className="text-end mt-2">
                ¿No tienes una cuenta? <Link to="/Signup" className="ms-2">Registrarse</Link>
              </p>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default Login;
