import React, { useState } from "react";
import { Link } from "react-router-dom";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";

import Swal from "sweetalert2";

import { auth, firestore } from "../Firebase_db";

function Signup() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      // Validar la longitud de la contraseña y el formato del correo electrónico
      if (password.length < 6) {
        Swal.fire({
          icon: "error",
          title: "¡Error!",
          text: "La contraseña debe tener al menos 6 caracteres.",
        });
        return;
      }

      if (!email.match(/^[a-zA-Z0-9._%+-]+@(gmail|hotmail|yahoo)\.com$/)) {
        Swal.fire({
          icon: "error",
          title: "¡Error!",
          text: "Por favor, ingresa un correo válido de Gmail, Hotmail o Yahoo.",
        });
        return;
      }

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const userId = userCredential.user.uid;

      const db = getFirestore();

      const userRef = doc(db, "usuarios", userId);

      const userSnapshot = await getDoc(userRef);
      if (userSnapshot.exists()) {
        return;
      }

      await setDoc(userRef, {
        apellido1: lastName,
        apellido2: "",
        correo: email,
        fechaNacimiento: "",
        fotoPerfil: "https://via.placeholder.com/150",
        intereses: "",
        lugarResidencia: "",
        nombre: firstName,
        amigos: [],
        solicitudes: [],
      });

      Swal.fire({
        icon: "success",
        title: "¡Registro exitoso!",
        text: "Tu cuenta ha sido creada correctamente. ¡Bienvenido!",
      });

      window.location.href = "/";
    } catch (error) {
      console.error("Error al registrar usuario:", error);
    }
  };

  return (
    <div className="signup template d-flex justify-content-center align-items-center vh-100 bg-primary">
      <div className="form_container p-5 rounded bg-white">
        <form onSubmit={handleSignup}>
          <h3 className="text-center">Registrarse</h3>
          <div className="my-4">
            <input
              type="text"
              placeholder="Ingrese su nombre"
              className="form-control"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <div className="my-4">
            <input
              type="text"
              placeholder="Ingrese su apellido"
              className="form-control"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
          <div className="my-4">
            <input
              type="email"
              placeholder="ingrese su email (ej: @gmail.com)"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="my-4">
            <input
              type="password"
              placeholder="contraseña (mínimo 6 caracteres)"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="d-grid mt-2">
            <button type="submit" className="btn btn-primary">
              Registrarse
            </button>
          </div>
          <p className="text-end mt-2">
            ¿Ya tienes una cuenta?{" "}
            <Link to="/" className="ms-2">
              {" "}
              Iniciar sesión
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Signup;
