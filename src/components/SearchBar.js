import React, { useState } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { Link } from "react-router-dom";

const SearchBar = () => {
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const firestore = getFirestore();

  const handleChange = async (event) => {
    const text = event.target.value;
    setSearchText(text);

    try {
      const usersRef = collection(firestore, "usuarios");
      const userQuery = query(
        usersRef,
        where("nombre", ">=", text),
        where("nombre", "<=", text + "\uf8ff")
      );

      const querySnapshot = await getDocs(userQuery);
      let results = [];
      querySnapshot.forEach((doc) => {
        results.push({ id: doc.id, ...doc.data() });
      });

      if (results.length === 0) {
        const userQueryByLastNames = query(
          usersRef,
          where("apellido1", ">=", text),
          where("apellido1", "<=", text + "\uf8ff")
        );

        const querySnapshotByLastNames = await getDocs(userQueryByLastNames);

        querySnapshotByLastNames.forEach((doc) => {
          results.push({ id: doc.id, ...doc.data() });
        });
      }

      setSearchResults(results);
    } catch (error) {
      console.error("Error al buscar usuarios:", error);
    }
  };

  return (
    <div className="mt-5 text-white">
      <Form>
        <Form.Control
          type="text"
          value={searchText}
          onChange={handleChange}
          placeholder="Buscar por nombre o apellido..."
        />
      </Form>
      {searchText && (
        <div className="search-results bg-light">
          {searchResults.length > 0 ? (
            <ul style={{ listStyle: "none", padding: 0 }}>
              {searchResults.map((user) => (
                <li key={user.id} style={{ marginBottom: "10px" }}>
                  <Row>
                    <Col sm={{ span: 2, offset: 2 }}>
                      <div>
                        <img
                          src={user.fotoPerfil}
                          alt="Foto de perfil"
                          style={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "50%",
                            marginRight: "10px",
                          }}
                        />
                        {user.id && (
                          <Link
                            to={`/perfil/${user.id}`}
                            style={{ textDecoration: "none" }}
                          >
                            {`${user.nombre} ${user.apellido1} ${user.apellido2}`}
                          </Link>
                        )}
                      </div>
                    </Col>
                  </Row>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-danger">No se encontraron coincidencias.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
