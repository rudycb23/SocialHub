import { Container, Row, Col, Accordion } from "react-bootstrap";

function TermsAndPrivacyPage() {
  return (
    <Container className="vh-100">
      <Row>
        <Col md={12} className="d-flex justify-content-start ">
          <Accordion className="text-white mt-5 pt-3 custom-accordion">
            <Accordion.Item eventKey="0">
              <Accordion.Header className="">
                Términos y Condiciones
              </Accordion.Header>
              <Accordion.Body className="text-center ">
                <p className="text-left">
                  Estos términos y condiciones rigen el uso de la aplicación
                  Social Hub y todos sus servicios relacionados. Al acceder y
                  utilizar esta aplicación, aceptas cumplir con estos términos y
                  condiciones en su totalidad. Si no estás de acuerdo con alguno
                  de estos términos, no utilices nuestra aplicación.
                </p>
                <ul className="">
                  <li className="text-left">
                    <strong>Uso de la Aplicación:</strong>
                    <p className="text-left ">
                      La aplicación Social Hub está destinada únicamente para
                      uso personal y no comercial. No debes utilizar esta
                      aplicación de ninguna manera que pueda causar daño a la
                      aplicación o a terceros.
                    </p>
                  </li>
                  <li className="text-left ">
                    <strong>Cuentas de Usuario:</strong>
                    <p className="text-left">
                      Para acceder a ciertas características de la aplicación,
                      puedes ser requerido a crear una cuenta de usuario. Es tu
                      responsabilidad mantener la confidencialidad de tu
                      contraseña y cuenta, y eres responsable de todas las
                      actividades que ocurran bajo tu cuenta.
                    </p>
                  </li>
                  <li className="text-left">
                    <strong>Contenido del Usuario:</strong>
                    <p className="text-left">
                      Al utilizar nuestra aplicación, puedes proporcionar
                      contenido, como comentarios o imágenes. Al hacerlo, nos
                      otorgas el derecho no exclusivo, libre de regalías,
                      sublicenciable y transferible para usar, reproducir,
                      modificar, adaptar, distribuir y mostrar dicho contenido
                      en relación con la operación de nuestra aplicación.
                    </p>
                  </li>
                  <li className="text-left">
                    <strong>Modificaciones:</strong>
                    <p className="text-left">
                      Nos reservamos el derecho de modificar o actualizar estos
                      términos y condiciones en cualquier momento. Es tu
                      responsabilidad revisar periódicamente estos términos y
                      condiciones para estar al tanto de las actualizaciones.
                    </p>
                  </li>
                </ul>
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="1">
              <Accordion.Header className="">
                Política de Privacidad
              </Accordion.Header>
              <Accordion.Body className="text-center">
                <p className="text-left">
                  Esta política de privacidad describe cómo recopilamos,
                  almacenamos y utilizamos la información que recabamos a través
                  de nuestra aplicación Social Hub.
                </p>
                <ul>
                  <li className="text-left">
                    <strong>Información que Recopilamos:</strong>
                    <p className="text-left">
                      Recopilamos información personal que nos proporcionas
                      voluntariamente al registrarte o utilizar nuestra
                      aplicación. Esta información puede incluir tu nombre,
                      dirección de correo electrónico, y otra información
                      relevante.
                    </p>
                  </li>
                  <li className="text-left">
                    <strong>Uso de la Información:</strong>
                    <p className="text-left">
                      Utilizamos la información que recopilamos para
                      proporcionar y mejorar nuestros servicios, comunicarnos
                      contigo, personalizar tu experiencia de usuario y cumplir
                      con nuestras obligaciones legales.
                    </p>
                  </li>
                  <li className="text-left">
                    <strong>Seguridad de la Información:</strong>
                    <p className="text-left">
                      Implementamos medidas de seguridad para proteger tu
                      información contra el acceso no autorizado, el uso
                      indebido o la divulgación no autorizada.
                    </p>
                  </li>
                  <li className="text-left">
                    <strong>Cambios en la Política de Privacidad:</strong>
                    <p className="text-left">
                      Nos reservamos el derecho de modificar esta política de
                      privacidad en cualquier momento. Te notificaremos
                      cualquier cambio significativo a través de nuestra
                      aplicación o por otros medios.
                    </p>
                  </li>
                </ul>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </Col>
      </Row>
    </Container>
  );
}

export default TermsAndPrivacyPage;
