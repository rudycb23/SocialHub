import React, { useState, useEffect } from "react";
import {
  BsFillHeartFill,
  BsFillHandThumbsDownFill,
  BsFillHandThumbsUpFill,
} from "react-icons/bs";
import {
  collection,
  getDocs,
  query,
  orderBy,
  where,
  getDoc,
  doc as firestoreDoc,
} from "firebase/firestore";
import { firestore } from "../Firebase_db";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const PublicacionesFeed = () => {
  const [userId, setUserId] = useState(null);
  const [publicacionesAmigos, setPublicacionesAmigos] = useState([]);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        setUserId(null);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!userId) return;

    const cargarPublicacionesAmigos = async () => {
      try {
        const usuarioSnapshot = await getDoc(
          firestoreDoc(firestore, "usuarios", userId)
        );
        const usuario = usuarioSnapshot.data();
        const listaAmigos = usuario.amigos || [];
        const publicacionesQuerySnapshot = await getDocs(
          query(
            collection(firestore, "publicaciones"),
            where("usuario", "in", [userId, ...listaAmigos]),
            orderBy("fecha_publicacion", "desc")
          )
        );

        const publicacionesData = [];
        await Promise.all(
          publicacionesQuerySnapshot.docs.map(async (documento) => {
            const publicacion = { id: documento.id, ...documento.data() };
            const comentariosSnapshot = await getDocs(
              query(
                collection(firestore, "comentarios"),
                where("publicacionId", "==", documento.id)
              )
            );
            const comentariosData = comentariosSnapshot.docs.map(
              (comentarioDoc) => ({
                id: comentarioDoc.id,
                ...comentarioDoc.data(),
              })
            );
            publicacion.comentarios = comentariosData;

            const usuarioPublicacion = await getDoc(
              firestoreDoc(firestore, "usuarios", publicacion.usuario)
            );
            const { nombre, apellido1 } = usuarioPublicacion.data();
            publicacion.nombre = nombre;
            publicacion.apellido1 = apellido1;

            publicacionesData.push(publicacion);
          })
        );

        setPublicacionesAmigos(publicacionesData);
      } catch (error) {
        console.error("Error al cargar las publicaciones de amigos: ", error);
      }
    };

    cargarPublicacionesAmigos();
  }, [userId]);
  const formatDate = (dateTimeString) => {
    const date = new Date(dateTimeString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    let hours = date.getHours();
    const meridian = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12; // Convertir las 0 horas a 12 AM
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${day}-${month}-${year} ${hours}:${minutes} ${meridian}`;
  };

  const handleReaccionarPublicacion = (id, tipo) => {
    console.log("Reacting to publication:", id, " with reaction type:", tipo);
  };

  return (
    <div className="my-3 py-4">
      <div className="container-fluid bg-light py-4">
        <h2 className="mt-5">Publicaciones de tus amigos</h2>
        {publicacionesAmigos.map((publicacion) => (
          <div className="card mb-3 bg-white" key={publicacion.id}>
            <div className="card-body d-flex justify-content-between align-items-center">
              <div>
                <p className="card-text">{publicacion.texto}</p>
                <p className="card-text">
                  Publicado por: {publicacion.nombre} {publicacion.apellido1} -{" "}
                  {formatDate(publicacion.fecha_publicacion)}
                </p>
                <div
                  className="btn-group mr-2"
                  role="group"
                  aria-label="Reacciones"
                >
                  <button
                    type="button"
                    className="btn btn-outline-danger"
                    onClick={() =>
                      handleReaccionarPublicacion(publicacion.id, "meGusta")
                    }
                  >
                    <BsFillHeartFill className="m-auto" /> (
                    {publicacion.reacciones.meGusta || 0})
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-primary"
                    onClick={() =>
                      handleReaccionarPublicacion(publicacion.id, "meEncanta")
                    }
                  >
                    <BsFillHandThumbsUpFill className="m-auto" /> (
                    {publicacion.reacciones.meEncanta || 0})
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() =>
                      handleReaccionarPublicacion(publicacion.id, "noMeGusta")
                    }
                  >
                    <BsFillHandThumbsDownFill className="m-auto" /> (
                    {publicacion.reacciones.noMeGusta || 0})
                  </button>
                </div>
                <div className="comentarios">
                  {publicacion.comentarios.map((comentario) => (
                    <div key={comentario.id}>
                      <p>{comentario.texto}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PublicacionesFeed;
