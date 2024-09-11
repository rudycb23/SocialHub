import React, { useState, useEffect } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import Login from "./components/Login";
import PublicacionesFeed from "./components/PublicacionesFeed";
import MiPerfil from "./components/MiPerfil";
import PerfilAmigo from "./components/PerfilAmigo";
import Signup from "./components/Signup";
import Navbar from "./components/BarraNav";
import SearchBar from "./components/SearchBar";
import SolicitudesAmistad from "./components/SolicitudesAmistad";
import Footer from "./components/Footer";
import AboutPage from "./components/AboutPage";
import ContactPage from "./components/ContactPage";
import TermsAndPrivacyPage from "./components/TermsAndPrivacyPage";
import EquipoDesarrollo from "./components/Equipo";
import NotFound from "./components/404page";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

const App = () => {
  const { pathname } = useLocation();
  const mostrarNavbar = !["/", "/Signup", "/404-page-not-found"].some(
    (path) => path === pathname
  );

  return (
    <div className="App bg-primary">
      {mostrarNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/Signup" element={<Signup />} />
        <Route path="/Mi-Feed" element={<PublicacionesFeed />} />
        <Route path="/mi-perfil" element={<MiPerfil />} />
        <Route path="/buscar-amigos" element={<SearchBar />} />
        <Route path="/perfil/:userId" element={<PerfilAmigo />} />
        <Route path="/solicitud-de-amigos" element={<SolicitudesAmistad />} />
        <Route path="/acerca-de-SocialHub" element={<AboutPage />} />
        <Route path="/contacto" element={<ContactPage />} />
        <Route path="/terminos&condiciones" element={<TermsAndPrivacyPage />} />
        <Route path="/equipo-de-proyecto" element={<EquipoDesarrollo />} />
        <Route path="/404-page-not-found" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/404-page-not-found" />} />
      </Routes>
      <Footer />
    </div>
  );
};

export default App;
