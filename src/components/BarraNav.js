import React, { useState, useEffect } from "react";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { Link } from "react-router-dom";
import { FaUserAlt, FaSearch, FaUserFriends } from "react-icons/fa";
import { ImExit, ImProfile } from "react-icons/im";
import { HiHome } from "react-icons/hi";
import { GrCircleInformation, GrGroup } from "react-icons/gr";
import { BiSupport } from "react-icons/bi";
import { CgFileDocument } from "react-icons/cg";
import logo from "../assets/logo512.png";

function BarraNav() {
  const [userData, setUserData] = useState(null);
  const [collapsed, setCollapsed] = useState(true);
  const auth = getAuth();
  const firestore = getFirestore();
  const navigate = useNavigate();

  const obtenerDatosUsuario = async (user) => {
    try {
      const userQuery = query(
        collection(firestore, "usuarios"),
        where("correo", "==", user.email)
      );
      const querySnapshot = await getDocs(userQuery);
      querySnapshot.forEach((doc) => {
        setUserData(doc.data());
      });
    } catch (error) {
      console.error("Error al obtener datos de usuario:", error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        obtenerDatosUsuario(user);
      } else {
        setUserData(null);
      }
    });

    return () => unsubscribe();
  }, [auth, firestore]);

  const handleCerrarSesion = async () => {
    const confirmacion = await Swal.fire({
      title: "¿Estás seguro?",
      text: "¿Quieres cerrar sesión?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, cerrar sesión",
      cancelButtonText: "Cancelar",
    });

    if (confirmacion.isConfirmed) {
      try {
        await signOut(auth);

        Swal.fire({
          title: "¡Gracias por utilizar la plataforma!",
          icon: "success",
          timer: 1500,
          timerProgressBar: true,
          showConfirmButton: false,
        });

        setTimeout(() => {
          navigate("/");
        }, 3000);
      } catch (error) {
        console.error("Error al cerrar sesión:", error);
      }
    }
  };

  const handleNavbarToggle = () => {
    setCollapsed(!collapsed);
  };

  const handleNavItemClick = () => {
    if (!collapsed) {
      setCollapsed(true);
    }
  };

  return (
    <>
      <Navbar
        expand="lg"
        className="bg-body-tertiary fixed-top"
        style={{ zIndex: 1000, marginBottom: 0 }} // Establecer marginBottom en 0
        expanded={!collapsed}
      >
        <Container>
          <Navbar.Brand href="/Mi-Feed">
            <img
              className="mb-1"
              src={logo}
              alt="Social Hub Logo"
              style={{
                maxHeight: "30px",
                borderRadius: "50%",
                objectFit: "cover",
                border: "5px solid #fff",
                boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
              }}
            />{" "}
            Social Hub
          </Navbar.Brand>
          <Navbar.Toggle
            onClick={handleNavbarToggle}
            aria-controls="basic-navbar-nav"
          />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="m-auto">
              <Link
                to="/Mi-Feed"
                className="nav-link"
                onClick={handleNavItemClick}
              >
                <HiHome className="mb-1" /> Inicio
              </Link>
              <Link
                to="/Mi-Perfil"
                className="nav-link"
                onClick={handleNavItemClick}
              >
                <ImProfile className="mb-1" /> Mi Perfil
              </Link>
              <Link
                to="/buscar-amigos"
                className="nav-link"
                onClick={handleNavItemClick}
              >
                <FaSearch className="mb-1" /> Buscar Amigos
              </Link>
              <Link
                to="/solicitud-de-amigos"
                className="nav-link"
                onClick={handleNavItemClick}
              >
                <FaUserFriends className="mb-1" /> Solicitudes de Amistad
              </Link>
              <NavDropdown title="Acciones" id="basic-nav-dropdown">
                <NavDropdown.Item>
                  <Link to="/contacto" onClick={handleNavItemClick}>
                    <BiSupport className="mb-1" /> Contáctanos
                  </Link>
                </NavDropdown.Item>
                <NavDropdown.Item>
                  <Link to="/acerca-de-SocialHub" onClick={handleNavItemClick}>
                    <GrCircleInformation className="mb-1" /> Sobre Nosotros
                  </Link>
                </NavDropdown.Item>
                <NavDropdown.Item>
                  <Link
                    to="/terminos&condiciones"
                    onClick={handleNavItemClick}
                  >
                    <CgFileDocument className="mb-1" /> Términos y Condiciones
                  </Link>
                </NavDropdown.Item>
                <NavDropdown.Item>
                  <Link to="/equipo-de-proyecto" onClick={handleNavItemClick}>
                    <GrGroup className="mb-1" /> Equipo de Desarrollo
                  </Link>
                </NavDropdown.Item>
                <NavDropdown.Item onClick={handleCerrarSesion}>
                  <ImExit className="mb-1" /> Salir
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
            {userData && (
              <Nav>
                <Nav.Item className="text-end">
                  <span className="nav-link disabled text-dark">
                    <FaUserAlt className="mb-1" /> {userData.nombre}{" "}
                    {userData.apellido1}
                  </span>
                </Nav.Item>
              </Nav>
            )}
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}

export default BarraNav;
