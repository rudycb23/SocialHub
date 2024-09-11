import React, { useState, useEffect } from "react";
import {
  getFirestore,
  collection,
  onSnapshot,
  query,
  where,
  doc,
  updateDoc,
  getDocs,
  arrayUnion,
  deleteDoc,
} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import Swal from "sweetalert2";

const SolicitudesAmistad = () => {
  const [solicitudesRecibidas, setSolicitudesRecibidas] = useState([]);
  const [solicitudesEnviadas, setSolicitudesEnviadas] = useState([]);
  const [userEmail, setUserEmail] = useState(null);
  const [users, setUsers] = useState({});

  useEffect(() => {
    const cargarSolicitudes = async () => {
      try {
        const auth = getAuth();
        const firestoreInstance = getFirestore();

        const authUser = await new Promise((resolve, reject) => {
          const unsubscribe = onAuthStateChanged(
            auth,
            (user) => {
              resolve(user);
              unsubscribe();
            },
            (error) => reject(error)
          );
        });

        if (!authUser) {
          console.log("Usuario no autenticado");
          return;
        }

        const userEmail = authUser.email;
        setUserEmail(userEmail);

        cargarSolicitudesRecibidas(firestoreInstance, userEmail);
        cargarSolicitudesEnviadas(firestoreInstance, userEmail);
      } catch (error) {
        console.error("Error al cargar solicitudes de amistad:", error.message);
      }
    };

    cargarSolicitudes();
  }, []);

  useEffect(() => {
    const obtenerUsuarios = async () => {
      try {
        const firestoreInstance = getFirestore();
        const usersSnapshot = await getDocs(
          collection(firestoreInstance, "usuarios")
        );
        const usersData = {};
        usersSnapshot.forEach((doc) => {
          const userData = doc.data();
          if (userData && userData.correo) {
            usersData[userData.correo] = {
              id: doc.id,
              ...userData,
            };
          }
        });
        setUsers(usersData);
      } catch (error) {
        console.error("Error al obtener usuarios:", error.message);
      }
    };

    obtenerUsuarios();
  }, []);

  const cargarSolicitudesRecibidas = (firestoreInstance, userEmail) => {
    const solicitudesRecibidasQuery = query(
      collection(firestoreInstance, "solicitudesAmistad"),
      where("estado", "==", "pendiente"),
      where("usuarioReceptor", "==", userEmail)
    );

    const unsubscribeSnapshotRecibidas = onSnapshot(
      solicitudesRecibidasQuery,
      (snapshot) => {
        const solicitudesData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          enviada: false,
        }));
        setSolicitudesRecibidas(solicitudesData);
      }
    );

    return unsubscribeSnapshotRecibidas;
  };

  const cargarSolicitudesEnviadas = (firestoreInstance, userEmail) => {
    const solicitudesEnviadasQuery = query(
      collection(firestoreInstance, "solicitudesAmistad"),
      where("estado", "==", "pendiente"),
      where("usuarioSolicitante", "==", userEmail)
    );

    const unsubscribeSnapshotEnviadas = onSnapshot(
      solicitudesEnviadasQuery,
      (snapshot) => {
        const solicitudesData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          enviada: true,
        }));
        setSolicitudesEnviadas(solicitudesData);
      }
    );

    return unsubscribeSnapshotEnviadas;
  };

  const aceptarSolicitud = async (solicitudId, solicitudData) => {
    try {
      const firestoreInstance = getFirestore();
      const solicitudRef = doc(
        firestoreInstance,
        "solicitudesAmistad",
        solicitudId
      );

      await updateDoc(solicitudRef, {
        estado: "aceptada",
      });

      const solicitanteQuery = query(
        collection(firestoreInstance, "usuarios"),
        where("correo", "==", solicitudData.usuarioSolicitante)
      );
      const solicitanteSnapshot = await getDocs(solicitanteQuery);
      const solicitanteDoc = solicitanteSnapshot.docs[0];
      const solicitanteId = solicitanteDoc.id;

      const receptorQuery = query(
        collection(firestoreInstance, "usuarios"),
        where("correo", "==", solicitudData.usuarioReceptor)
      );
      const receptorSnapshot = await getDocs(receptorQuery);
      const receptorDoc = receptorSnapshot.docs[0];
      const receptorId = receptorDoc.id;

      const solicitanteDocRef = doc(
        firestoreInstance,
        "usuarios",
        solicitanteId
      );
      await updateDoc(solicitanteDocRef, {
        amigos: arrayUnion(receptorId),
      });

      const receptorDocRef = doc(firestoreInstance, "usuarios", receptorId);
      await updateDoc(receptorDocRef, {
        amigos: arrayUnion(solicitanteId),
      });

      await deleteDoc(solicitudRef);
    } catch (error) {
      console.error("Error al aceptar la solicitud de amistad:", error.message);
    }
  };

  const formatFecha = (fecha) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(fecha).toLocaleDateString(undefined, options);
  };

  const mostrarConfirmacionAceptar = (solicitud) => {
    Swal.fire({
      title: "¿Listo para una nueva amistad?",
      text: `¿Estás seguro de que deseas aceptar la solicitud de amistad de ${solicitud.usuarioSolicitante}? `,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, aceptar!",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        aceptarSolicitud(solicitud.id, solicitud);
        Swal.fire({
          title: "¡Nueva amistad aceptada!",
          icon: "success",
          timer: 1500,
          timerProgressBar: true,
          showConfirmButton: false,
        });
      }
    });
  };

  return (
    <div className="mt-5 pt-5 text-white">
      <h2>Solicitudes de amistad recientes</h2>
      <ul className="d-flex flex-column align-items-start py-2 border border-dark rounded-1 text-dark bg-light">
        {solicitudesRecibidas.map((solicitud) => (
          <li key={solicitud.id} className="solicitud-item">
            <div className="d-flex align-items-center">
              {users[solicitud.usuarioSolicitante] && (
                <Link
                  to={`/perfil/${users[solicitud.usuarioSolicitante].id}`}
                  style={{ textDecoration: "none" }}
                >
                  <img
                    src={users[solicitud.usuarioSolicitante].fotoPerfil}
                    alt="Foto de perfil"
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                      marginRight: "10px",
                    }}
                  />
                  {userEmail === solicitud.usuarioSolicitante
                    ? solicitud.usuarioReceptor
                    : solicitud.usuarioSolicitante}
                </Link>
              )}
              <div>
                <span className="m-2">
                  Fecha: {formatFecha(solicitud.fechaSolicitud)}
                </span>
                {userEmail && solicitud.usuarioReceptor === userEmail && (
                  <>
                    <span className="badge bg-success m-2">Recibida</span>
                    <Button
                      variant="primary"
                      onClick={() => mostrarConfirmacionAceptar(solicitud)} // Cambiado a mostrarConfirmacionAceptar
                    >
                      Aceptar
                    </Button>
                  </>
                )}
              </div>
            </div>
          </li>
        ))}
        {solicitudesEnviadas.map((solicitud) => (
          <li key={solicitud.id}>
            <div className="d-flex align-items-center">
              {users[solicitud.usuarioReceptor] && (
                <Link
                  to={`/perfil/${users[solicitud.usuarioReceptor].id}`}
                  style={{ textDecoration: "none" }}
                >
                  <img
                    src={users[solicitud.usuarioReceptor].fotoPerfil}
                    alt="Foto de perfil"
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                      marginRight: "10px",
                    }}
                  />
                  {solicitud.usuarioReceptor}
                </Link>
              )}
              <div>
                <span className=" m-2">
                  Fecha: {formatFecha(solicitud.fechaSolicitud)}
                </span>{" "}
                <span className="badge bg-warning m-2">Enviada</span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SolicitudesAmistad;
