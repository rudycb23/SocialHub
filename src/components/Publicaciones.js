import React, { useState, useEffect } from "react";
import {
  BsFillHeartFill,
  BsFillHandThumbsDownFill,
  BsFillHandThumbsUpFill,
} from "react-icons/bs";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  orderBy,
  where,
} from "firebase/firestore";
import { firestore } from "../Firebase_db";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Swal from "sweetalert2";

const Publicaciones = () => {
  const [userEmail, setUserEmail] = useState(null);
  const [nuevaPublicacion, setNuevaPublicacion] = useState("");
  const [publicaciones, setPublicaciones] = useState([]);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserEmail(user.email);
      } else {
        setUserEmail(null);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!userEmail) return;

    const cargarPublicaciones = async () => {
      try {
        const querySnapshot = await getDocs(
          query(
            collection(firestore, "publicaciones"),
            orderBy("fecha_publicacion", "desc"),
            where("usuario", "==", userEmail)
          )
        );
        const publicacionesData = [];
        querySnapshot.forEach((doc) => {
          publicacionesData.push({ id: doc.id, ...doc.data() });
        });
        setPublicaciones(publicacionesData);
      } catch (error) {
        console.error("Error al cargar publicaciones: ", error);
      }
    };
    cargarPublicaciones();
  }, [userEmail]);

  const handleChange = (e) => {
    setNuevaPublicacion(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nuevaPublicacionObj = {
      texto: nuevaPublicacion,
      fecha_publicacion: new Date().toISOString(),
      reacciones: {},
      comentarios: [],
      usuario: userEmail,
    };

    try {
      const docRef = await addDoc(
        collection(firestore, "publicaciones"),
        nuevaPublicacionObj
      );

      setPublicaciones([nuevaPublicacionObj, ...publicaciones]);
      setNuevaPublicacion("");
    } catch (error) {
      console.error("Error al agregar documento: ", error);
    }
  };

  const handleEliminarPublicacion = async (id) => {
    if (!id) {
      console.error("El ID de la publicación es inválido.");
      return;
    }

    try {
      await deleteDoc(doc(collection(firestore, "publicaciones"), id));
      const nuevasPublicaciones = publicaciones.filter(
        (publicacion) => publicacion.id !== id
      );
      setPublicaciones(nuevasPublicaciones);
    } catch (error) {
      console.error("Error al eliminar publicación: ", error);
    }
  };

  const handleEliminarComentario = async (publicacionId, comentarioId) => {
    try {
      const nuevasPublicaciones = [...publicaciones];
      const publicacionIndex = nuevasPublicaciones.findIndex(
        (publicacion) => publicacion.id === publicacionId
      );
      if (publicacionIndex !== -1) {
        const comentarios = nuevasPublicaciones[publicacionIndex].comentarios;
        const nuevosComentarios = comentarios.filter(
          (comentario) => comentario.id !== comentarioId
        );
        nuevasPublicaciones[publicacionIndex].comentarios = nuevosComentarios;
        setPublicaciones(nuevasPublicaciones);
      }
    } catch (error) {
      console.error("Error al eliminar comentario: ", error);
    }
  };

  const handleReaccionarPublicacion = (id, tipo) => {
    const nuevasPublicaciones = [...publicaciones];
    const publicacion = nuevasPublicaciones.find((pub) => pub.id === id);

    if (!publicacion.reacciones[tipo]) {
      publicacion.reacciones[tipo] = 1;
    } else {
      publicacion.reacciones[tipo]++;
    }

    setPublicaciones(nuevasPublicaciones);
  };

  return (
    <div className="my-3 py-4">
      <div className="container bg-light py-4">
        <h2>Crear una nueva publicación</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <textarea
              className="form-control"
              rows="3"
              placeholder="Escribe tu publicación aquí"
              value={nuevaPublicacion}
              onChange={handleChange}
            ></textarea>
          </div>
          <button type="submit" className="btn btn-primary my-3">
            Publicar
          </button>
        </form>

        <hr />

        <h2>Publicaciones recientes</h2>
        {publicaciones.map((publicacion) => (
          <div className="card mb-3 bg-white" key={publicacion.id}>
            <div className="card-body d-flex justify-content-between align-items-center">
              <div>
                <p className="card-text">{publicacion.texto}</p>
                <div
                  className="btn-group mr-2"
                  role="group"
                  aria-label="Reacciones"
                >
                  <button
                    type="button"
                    className="btn btn-outline-primary"
                    onClick={() =>
                      handleReaccionarPublicacion(publicacion.id, "meGusta")
                    }
                  >
                    <BsFillHeartFill /> Me gusta (
                    {publicacion.reacciones.meGusta || 0})
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() =>
                      handleReaccionarPublicacion(publicacion.id, "noMeGusta")
                    }
                  >
                    <BsFillHandThumbsDownFill /> No me gusta (
                    {publicacion.reacciones.noMeGusta || 0})
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-danger"
                    onClick={() =>
                      handleReaccionarPublicacion(publicacion.id, "meEncanta")
                    }
                  >
                    <BsFillHandThumbsUpFill /> Me encanta (
                    {publicacion.reacciones.meEncanta || 0})
                  </button>
                </div>
                <div className="comentarios">
                  <h3>Comentarios</h3>
                  {publicacion.comentarios.map((comentario) => (
                    <div key={comentario.id}>
                      <p>{comentario.texto}</p>
                      <button
                        type="button"
                        className="btn btn-danger"
                        onClick={() =>
                          handleEliminarComentario(
                            publicacion.id,
                            comentario.id
                          )
                        }
                      >
                        Eliminar Comentario
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              <button
                type="button"
                className="btn btn-danger"
                onClick={() => handleEliminarPublicacion(publicacion.id)}
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Publicaciones;
