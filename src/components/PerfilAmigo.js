import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  getFirestore,
  doc,
  getDoc,
  collection,
  addDoc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { Button, Modal } from "react-bootstrap"; 
import Swal from "sweetalert2";

const PerfilAmigo = () => {
  const { userId } = useParams();
  const [datosUsuario, setDatosUsuario] = useState({
    nombre: "",
    apellido1: "",
    apellido2: "",
    correo: "",
    fechaNacimiento: "",
    intereses: "",
    lugarResidencia: "",
    fotoPerfil: "",
    amigos: [],
    cantidadAmigos: 0,
  });
  const [modalShow, setModalShow] = useState(false); 

  useEffect(() => {
    const cargarDatosUsuario = async () => {
      try {
        const firestoreInstance = getFirestore();
        const userDocRef = doc(firestoreInstance, "usuarios", userId);
        const userDocSnapshot = await getDoc(userDocRef);
        if (userDocSnapshot.exists()) {
          const userData = userDocSnapshot.data();
          setDatosUsuario(userData);
          setDatosUsuario((prevState) => ({
            ...prevState,
            cantidadAmigos: userData.amigos.length,
          }));
        } else {
          console.error("El usuario no existe en la base de datos.");
        }
      } catch (error) {
        console.error("Error al cargar datos de usuario:", error.message);
      }
    };

    cargarDatosUsuario();
  }, [userId]);

  const enviarSolicitudAmistad = async (correoReceptor) => {
    try {
      const auth = getAuth();
      const currentUser = auth.currentUser;

      if (currentUser) {
        const confirmacion = await Swal.fire({
          title: "¿Enviar solicitud de amistad?",
          text: `¿Deseas enviar una solicitud de amistad a ${datosUsuario.nombre} ${datosUsuario.apellido1}?`,
          icon: "question",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Si, enviar solicitud!",
          cancelButtonText: "Cancelar",
        });

        if (confirmacion.isConfirmed) {
          const firestoreInstance = getFirestore();
          const solicitudRef = collection(
            firestoreInstance,
            "solicitudesAmistad"
          );

          await addDoc(solicitudRef, {
            usuarioSolicitante: currentUser.email,
            usuarioReceptor: correoReceptor,
            estado: "pendiente",
            fechaSolicitud: new Date().toISOString(),
          });

          Swal.fire({
            title: "¡Solicitud enviada!",
            text: `¡La solicitud de amistad para ${datosUsuario.nombre} ${datosUsuario.apellido1} ha sido enviada con éxito!`,
            icon: "success",
          });
        }
      } else {
        console.log("Usuario no autenticado");
      }
    } catch (error) {
      console.error("Error al enviar solicitud de amistad:", error.message);
    }
  };

  return (
    <div className="mt-5 pt-4 text-white">
      <h2>Estás viendo el perfil de: </h2>
      <div
        className="text-black"
        style={{
          maxWidth: "600px",
          margin: "0 auto",
          backgroundColor: "#f5f5f5",
          padding: "20px",
          border: "1px solid #ddd",
          borderRadius: "10px",
          boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
        }}
      >
        <div style={{ marginBottom: "20px", textAlign: "center" }}>
          <img
            src={datosUsuario.fotoPerfil}
            alt="Foto de perfil"
            style={{
              width: "150px",
              height: "150px",
              borderRadius: "50%",
              objectFit: "cover",
              border: "5px solid #fff",
              boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
              cursor: "pointer",
            }}
            onClick={() => setModalShow(true)} 
          />
          <h2
            style={{
              fontSize: "24px",
              color: "#333",
              marginTop: "10px",
              marginBottom: "20px",
            }}
          >
            {datosUsuario.nombre} {datosUsuario.apellido1}{" "}
            {datosUsuario.apellido2}
          </h2>
        </div>
        <div>
          <p style={{ marginBottom: "10px" }}>
            <strong>Correo:</strong> {datosUsuario.correo}
          </p>
          <p style={{ marginBottom: "10px" }}>
            <strong>Fecha de Nacimiento:</strong> {datosUsuario.fechaNacimiento}
          </p>
          <p style={{ marginBottom: "10px" }}>
            <strong>Intereses:</strong> {datosUsuario.intereses}
          </p>
          <p style={{ marginBottom: "10px" }}>
            <strong>Lugar de Residencia:</strong> {datosUsuario.lugarResidencia}
          </p>
          <p style={{ marginBottom: "10px" }}>
            <strong>Cantidad de Amigos:</strong>{" "}
            {datosUsuario.cantidadAmigos || 0}
          </p>
        </div>
        <div
          className="mt-5"
          style={{ textAlign: "center", marginTop: "10px" }}
        >
          <Button
            variant="primary"
            onClick={() => enviarSolicitudAmistad(datosUsuario.correo)}
          >
            Enviar solicitud de amistad
          </Button>
        </div>
      </div>
      <Modal show={modalShow} onHide={() => setModalShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Foto de perfil</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <img
            src={datosUsuario.fotoPerfil}
            alt="Foto de perfil"
            style={{
              width: "100%",
              height: "auto",
            }}
          />
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default PerfilAmigo;
