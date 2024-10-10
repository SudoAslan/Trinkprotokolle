import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { LoadingIndicator } from "./LoadingIndicator";
import { Container, Row, Col, Card, Button, Modal, CardGroup, Badge } from "react-bootstrap";
import { EintragResource, ProtokollResource } from "../Resources";
import { getAlleEintraege, getProtokoll, deleteProtokoll, deleteLogin, userId } from "../backend/api";
import { useLoginContext } from "./LoginContext";
import { PageError } from "./PageError";
import { LinkContainer } from "react-router-bootstrap";
import { Bearbeiten } from "./Bearbeiten";

export function PageProtokoll() {
  const params = useParams();
  let protokollId = params.protokollId;

  const [protokoll, setProtokoll] = useState<ProtokollResource | null>(null);
  const [eintraege, setEintrag] = useState<EintragResource[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [show, setShow] = useState(false);
  const [deletea, setDelete] = useState(false);
  const { loginInfo } = useLoginContext();

  async function protokollBearbeiten() {
    setShow(true);
  }

  useEffect(() => {
    async function loadProtokoll() {
      try {
        let proto = await getProtokoll(protokollId!);
        let eint = await getAlleEintraege(protokollId!);
        setProtokoll(proto);
        setEintrag(eint);
      } catch (error) {
        if (error instanceof Error) {
          setError(error);
          await deleteLogin();
        }
      }
    }
    loadProtokoll();
  }, [protokollId]);

  if (error) {
    return <PageError />;
  }

  if (!protokoll) {
    return <LoadingIndicator />;
  }

  return (
    <>
      <h3>
        Einträge für dieses Protokoll <Badge bg="secondary">{eintraege.length}</Badge>
      </h3>

      <CardGroup>
        <Card>
          <Card.Body>
            <Card.Title>Protokoll von Patient: {protokoll.patient}</Card.Title>
            <Card.Text>
              <span style={{ fontWeight: "bold" }}>Datum:</span> {protokoll.datum}<br />
              <span style={{ fontWeight: "bold" }}>Public:</span> <span style={{ color: protokoll.public ? "green" : "red" }}>
                {protokoll.public ? "Ja" : "Nein"}
              </span><br />
              <span style={{ fontWeight: "bold" }}>Closed:</span> <span style={{ color: protokoll.closed ? "green" : "red" }}>
                {protokoll.closed ? "Ja" : "Nein"}
              </span><br />
              <span style={{ fontWeight: "bold" }}>Ersteller Name:</span> {protokoll.erstellerName}<br />
              <span style={{ fontWeight: "bold" }}>Gesamtmenge:</span> {protokoll.gesamtMenge}
            </Card.Text>
            {loginInfo && userId === protokoll.ersteller && (
              <>
                <Button variant="outline-danger" className="mr-2" onClick={() => setDelete(true)}>Löschen</Button>
                <Button variant="outline-primary" onClick={protokollBearbeiten}>Editieren</Button>
                <LinkContainer to={`/protokoll/${protokollId}/eintrag/neu`}>
                  <Button variant="outline-primary">Neuer Eintrag</Button>
                </LinkContainer>
              </>
            )}
            {show && <Bearbeiten setShow={setShow} show />}
            <Modal
              show={deletea}
              onHide={() => setDelete(false)}
              backdrop="static"
              keyboard={false}
            >
              <Modal.Header closeButton>
                <Modal.Title>Protokoll löschen</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <p>Möchten Sie dieses Protokoll wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.</p>
                <div className="d-flex justify-content-end">
                  <Button variant="secondary" onClick={() => setDelete(false)} className="me-5">Abbrechen</Button>
                  <LinkContainer to="/">
                    <Button variant="danger" className="me-5" onClick={async () => {
                      await deleteProtokoll(protokollId!);
                      setDelete(false);
                    }}>Löschen</Button>
                  </LinkContainer>
                </div>
              </Modal.Body>
            </Modal>
          </Card.Body>
          <Card.Footer>
            <small className="text-muted">UpdatetAt: {protokoll.updatedAt}</small>
          </Card.Footer>
        </Card>
      </CardGroup>

      {eintraege.map((ein, i: number = 0) => (
        <CardGroup key={ein.id}>
          <Card>
            <Card.Body>
              <Card.Title>{i + 1}. Eintrag</Card.Title>
              <Card.Text>
                <span style={{ fontWeight: "bold" }}>Getränk:</span> {ein.getraenk}<br />
                <span style={{ fontWeight: "bold" }}>Menge:</span> {ein.menge}<br />
                <span style={{ fontWeight: "bold" }}>Kommentar:</span> {ein.kommentar}<br />
                <span style={{ fontWeight: "bold" }}>Ersteller Name:</span> {ein.erstellerName}<br />
              </Card.Text>
              <Link to={`/eintrag/${ein.id}`}>Details</Link>
            </Card.Body>
            <Card.Footer>
              <small className="text-muted">CreatedAt: {ein.createdAt}</small>
            </Card.Footer>
          </Card>
        </CardGroup>
      ))}
    </>
  );
}
