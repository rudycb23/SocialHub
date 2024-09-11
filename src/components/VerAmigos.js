import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { Row, Col } from "react-bootstrap";
import { firestore } from "../Firebase_db"; 

const VerAmigos = ({ userId }) => {
  const [amigosData, setAmigosData] = useState([]);

  useEffect(() => {
    const fetchAmigosData = async () => {
      try {

        const userDoc = await getDoc(doc(firestore, "usuarios", userId));
        if (userDoc.exists()) {
          const amigosIds = userDoc.data().amigos || [];
          const amigosData = [];
          for (const amigoId of amigosIds) {
            const amigoDoc = await getDoc(doc(firestore, "amigos", amigoId));
            if (amigoDoc.exists()) {
              amigosData.push(amigoDoc.data());
            }
          }
          setAmigosData(amigosData);
        }
      } catch (error) {
        console.error("Error al obtener los datos de los amigos:", error);
      }
    };

    fetchAmigosData();
  }, [userId]);

  return (
    <div className="mt-5 bg-light">
      <h2>Amigos</h2>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {amigosData.map((amigoData) => (
          <li key={amigoData.id} style={{ marginBottom: "10px" }}>
            <Row>
              <Col sm={{ span: 2, offset: 2 }}>
                <div>
                  <Link
                    to={`/perfil/${amigoData.id}`}
                    style={{ textDecoration: "none" }}
                  >
                    {`${amigoData.nombre} ${amigoData.apellido1} ${amigoData.apellido2}`}
                  </Link>
                </div>
              </Col>
            </Row>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default VerAmigos;
