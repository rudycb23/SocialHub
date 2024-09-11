import React, { useState, useEffect, useRef } from "react";
import { getAuth } from "firebase/auth";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  getDoc,
  doc,
  setDoc,
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Modal, Button } from "react-bootstrap";
import MisPublicaciones from "./MisPublicaciones";
import VerAmigos from "./VerAmigos";
import { Link } from "react-router-dom";

const MiPerfil = () => {
  const [datosUsuario, setDatosUsuario] = useState({
    nombre: "",
    apellido1: "",
    apellido2: "",
    correo: "",
    fechaNacimiento: "",
    intereses: "",
    lugarResidencia: "",
    fotoPerfil: "",
    cantamigos: 0,
  });

  const [editando, setEditando] = useState(false);
  const [fotoPerfilFile, setFotoPerfilFile] = useState(null);
  const [guardarDatosActivo, setGuardarDatosActivo] = useState(false);
  const [guardarFotoPerfilActivo, setGuardarFotoPerfilActivo] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const fileInputRef = useRef(null);

  const interesesOptions = {
    deportista: "Apasionado por el fútbol",
    surfista: "Fanático del surf",
    naturaleza: "Amante de la naturaleza",
    gastronomia: "Aficionado a la gastronomía",
    aventura: "Aventurero en la selva",
    sostenibilidad: "Interesado en la sostenibilidad",
    musica: "Fanático de la música",
    montanna: "Aventurero en la montaña",
    fotografia: "Apasionado por la fotografía",
    historia_cultura: "Interesado en la historia y cultura",
    series_peliculas: "Aficionado a series y películas",
    videojuegos: "Gamer",
    teatro_cine: "Amante del teatro y cine",
    restaurantes: "Explorador gastronómico",
    conciertos: "Fanático de conciertos",
  };

  const lugarResidenciaOptions = {
    alajuela: "Alajuela",
    cartago: "Cartago",
    guanacaste: "Guanacaste",
    heredia: "Heredia",
    limon: "Limón",
    puntarenas: "Puntarenas",
    sanjose: "San José",
  };

  useEffect(() => {
    const cargarDatosUsuario = async () => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;
        if (user) {
          const firestoreInstance = getFirestore();
          const userQuery = query(
            collection(firestoreInstance, "usuarios"),
            where("correo", "==", user.email)
          );
          const querySnapshot = await getDocs(userQuery);
          querySnapshot.forEach(async (doc) => {
            const userData = doc.data();
            setDatosUsuario(userData);

            if (userData.fotoPerfil) {
              setDatosUsuario((prevState) => ({
                ...prevState,
                fotoPerfil: userData.fotoPerfil,
              }));
            }
          });
        }
      } catch (error) {
        console.error("Error al cargar datos de usuario:", error);
      }
    };

    cargarDatosUsuario();
  }, []);

  const handleFotoPerfilChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setFotoPerfilFile(file);
      setGuardarFotoPerfilActivo(true);
      setDatosUsuario((prevState) => ({
        ...prevState,
        fotoPerfil: URL.createObjectURL(file),
      }));
    }
  };

  const handleEditar = () => {
    setEditando(true);
  };

  const handleGuardarDatos = async () => {
    try {
      const firestoreInstance = getFirestore();
      const auth = getAuth();
      const user = auth.currentUser;

      if (user) {
        const usuarioQuerySnapshot = await getDocs(
          query(
            collection(firestoreInstance, "usuarios"),
            where("correo", "==", user.email)
          )
        );
        if (!usuarioQuerySnapshot.empty) {
          const usuarioDocRef = usuarioQuerySnapshot.docs[0].ref;
          await setDoc(
            usuarioDocRef,
            {
              nombre: datosUsuario.nombre,
              apellido1: datosUsuario.apellido1,
              apellido2: datosUsuario.apellido2,
              fechaNacimiento: datosUsuario.fechaNacimiento,
              intereses: datosUsuario.intereses,
              lugarResidencia: datosUsuario.lugarResidencia,
            },
            { merge: true }
          );
          console.log("Datos del usuario guardados en Firestore");
        } else {
          console.error("No se encontró el documento del usuario en Firestore");
        }
      } else {
        console.error("No se pudo obtener el usuario actual");
      }

      setGuardarDatosActivo(false);
      setEditando(false);
    } catch (error) {
      console.error("Error al guardar los datos en Firestore:", error);
    }
  };

  const handleGuardarFotoPerfil = async () => {
    try {
      const firestoreInstance = getFirestore();
      const auth = getAuth();
      const user = auth.currentUser;
      if (fotoPerfilFile) {
        const storage = getStorage();
        const storageRef = ref(
          storage,
          `fotoPerfil/${user.email}/${fotoPerfilFile.name}`
        );
        await uploadBytes(storageRef, fotoPerfilFile);
        const fotoPerfilURL = await getDownloadURL(storageRef);
        setDatosUsuario((prevState) => ({
          ...prevState,
          fotoPerfil: fotoPerfilURL,
        }));

        if (user) {
          const usuarioQuerySnapshot = await getDocs(
            query(
              collection(firestoreInstance, "usuarios"),
              where("correo", "==", user.email)
            )
          );
          if (!usuarioQuerySnapshot.empty) {
            const usuarioDocRef = usuarioQuerySnapshot.docs[0].ref;
            await setDoc(
              usuarioDocRef,
              { fotoPerfil: fotoPerfilURL },
              { merge: true }
            );
            console.log(
              "URL de la foto de perfil guardada en Firestore:",
              fotoPerfilURL
            );
          } else {
            console.error(
              "No se encontró el documento del usuario en Firestore"
            );
          }
        } else {
          console.error("No se pudo obtener el usuario actual");
        }
      }
      setGuardarFotoPerfilActivo(false);
      setEditando(false);
    } catch (error) {
      console.error("Error al guardar la foto de perfil en Firestore:", error);
    }
  };

  const handleChange = (e, campo) => {
    const valor = e.target.value;
    setDatosUsuario((prevState) => ({
      ...prevState,
      [campo]: valor,
    }));
    setGuardarDatosActivo(true);
  };

  const [cantidadAmigos, setCantidadAmigos] = useState(0);
  const obtenerCantidadAmigos = async () => {
    try {
      const auth = getAuth();
      const currentUser = auth.currentUser;

      if (currentUser) {
        const firestoreInstance = getFirestore();

        const userDocRef = doc(firestoreInstance, "usuarios", currentUser.uid);
        const userDocSnapshot = await getDoc(userDocRef);
        const userData = userDocSnapshot.data();

        const cantamigos = userData.amigos;

        setCantidadAmigos(cantamigos.length);
      }
    } catch (error) {
      console.error("Error al obtener la cantidad de amigos:", error);
    }
  };

  useEffect(() => {
    obtenerCantidadAmigos();
  }, []);

  return (
    <div
      className="mt-5"
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
      </div>
      <Modal show={modalShow} onHide={() => setModalShow(false)} centered>
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
    <div style={{ textAlign: "center", marginTop: "10px" }}>
      <input
        type="file"
        accept="image/*"
        onChange={handleFotoPerfilChange}
        style={{ display: "none" }}
        ref={fileInputRef}
      />
      <button
        onClick={() => fileInputRef.current.click()}
        style={{
          backgroundColor: "#007bff",
          color: "#fff",
          padding: "10px 20px",
          borderRadius: "5px",
          border: "none",
          cursor: "pointer",
          boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
        }}
      >
        Cambiar Foto de Perfil
      </button>
    </div>
  </Modal.Body>
</Modal>

      <div style={{ marginBottom: "20px", textAlign: "center" }}>
        <h2
          style={{
            fontSize: "24px",
            color: "#333",
            marginTop: "10px",
            marginBottom: "20px",
          }}
        >
          {editando ? (
            <>
              <input
                type="text"
                value={datosUsuario.nombre}
                onChange={(e) => handleChange(e, "nombre")}
                style={{
                  marginRight: "10px",
                  fontSize: "inherit",
                  padding: "5px 10px",
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                }}
              />
              <input
                type="text"
                value={datosUsuario.apellido1}
                onChange={(e) => handleChange(e, "apellido1")}
                style={{
                  marginRight: "10px",
                  fontSize: "inherit",
                  padding: "5px 10px",
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                }}
              />
              <input
                type="text"
                value={datosUsuario.apellido2}
                onChange={(e) => handleChange(e, "apellido2")}
                style={{
                  fontSize: "inherit",
                  padding: "5px 10px",
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                }}
              />
            </>
          ) : (
            <>
              {datosUsuario.nombre} {datosUsuario.apellido1}{" "}
              {datosUsuario.apellido2}
            </>
          )}
        </h2>
      </div>
      <div>
        <p style={{ marginBottom: "10px" }}>
          <strong>Correo:</strong> {datosUsuario.correo}
        </p>
        <p style={{ marginBottom: "10px" }}>
          <strong>Fecha de Nacimiento:</strong>{" "}
          {editando ? (
            <input
              type="date"
              value={datosUsuario.fechaNacimiento}
              onChange={(e) => handleChange(e, "fechaNacimiento")}
              style={{
                fontSize: "inherit",
                padding: "5px 10px",
                borderRadius: "5px",
                border: "1px solid #ccc",
              }}
            />
          ) : (
            datosUsuario.fechaNacimiento
          )}
        </p>
        <p style={{ marginBottom: "10px" }}>
          <strong>Intereses:</strong>{" "}
          {editando ? (
            <select
              value={datosUsuario.intereses}
              onChange={(e) => handleChange(e, "intereses")}
              style={{
                fontSize: "inherit",
                padding: "5px 10px",
                borderRadius: "5px",
                border: "1px solid #ccc",
              }}
            >
              {Object.entries(interesesOptions).map(([key, value]) => (
                <option key={key} value={key}>
                  {value}
                </option>
              ))}
            </select>
          ) : (
            interesesOptions[datosUsuario.intereses]
          )}
        </p>

        <p style={{ marginBottom: "10px" }}>
          <strong>Lugar de residencia:</strong>{" "}
          {editando ? (
            <select
              value={datosUsuario.lugarResidencia}
              onChange={(e) => handleChange(e, "lugarResidencia")}
              style={{
                fontSize: "inherit",
                padding: "5px 10px",
                borderRadius: "5px",
                border: "1px solid #ccc",
              }}
            >
              {Object.entries(lugarResidenciaOptions).map(([key, value]) => (
                <option key={key} value={key}>
                  {value}
                </option>
              ))}
            </select>
          ) : (
            lugarResidenciaOptions[datosUsuario.lugarResidencia]
          )}
        </p>

        <p>
          <strong>Cantidad de Amigos:</strong> {cantidadAmigos}
        </p>
      </div>

      <div style={{ textAlign: "center", marginTop: "10px" }}>
        {guardarDatosActivo && (
          <button
            onClick={handleGuardarDatos}
            style={{
              backgroundColor: "#007bff",
              color: "#fff",
              padding: "10px 20px",
              borderRadius: "5px",
              border: "none",
              cursor: "pointer",
              boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
              marginRight: "10px",
            }}
          >
            Guardar Datos
          </button>
        )}
        {guardarFotoPerfilActivo && (
          <button
            onClick={handleGuardarFotoPerfil}
            style={{
              backgroundColor: "#007bff",
              color: "#fff",
              padding: "10px 20px",
              borderRadius: "5px",
              border: "none",
              cursor: "pointer",
              boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
            }}
          >
            Guardar Foto de Perfil
          </button>
        )}
        {!guardarDatosActivo && !guardarFotoPerfilActivo && (
          <button
            onClick={handleEditar}
            style={{
              backgroundColor: "#28a745",
              color: "#fff",
              padding: "10px 20px",
              borderRadius: "5px",
              border: "none",
              cursor: "pointer",
              boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
            }}
          >
            Editar
          </button>
        )}
      </div>

      <MisPublicaciones />
    </div>
  );
};

export default MiPerfil;
