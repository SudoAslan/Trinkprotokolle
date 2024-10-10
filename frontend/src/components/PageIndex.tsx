import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { LoadingIndicator } from "./LoadingIndicator";
import { Card, Badge, Col, Row } from 'react-bootstrap';
import { ProtokollResource } from "../Resources";
import { deleteLogin, getAlleProtokolle } from "../backend/api";
import { useLoginContext } from "./LoginContext";
import { PageError } from "./PageError";

export function PageIndex() {
  const [myProtokolle, setProtokolle] = useState<ProtokollResource[]>([]);
  const [load, setLoad] = useState(true);
  const { loginInfo } = useLoginContext();
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function data() {
      try {
        let daten = await getAlleProtokolle();
        setProtokolle(daten);
        setLoad(false);
      } catch (err) {
        if (err instanceof Error) {
          setError(err);
          await deleteLogin();
        }
      }
    }
    data();
  }, [loginInfo]);

  if (error) {
    return <PageError />;
  }

  if (load) {
    return <LoadingIndicator />;
  }

  return (
    <>
      <h1>Protokoll Anzahl <Badge bg="secondary">{myProtokolle.length}</Badge></h1>
      <Row xs={1} md={2} lg={4} className="g-4">
        {myProtokolle.map((protokoll) => (
          <Col key={protokoll.id}>
            <Card className="card-shadow card-hover">
              <Card.Body>
                <Card.Title>Protokoll von Patient: {protokoll.patient}</Card.Title>
                <Card.Text>
                  <span style={{ fontWeight: "bold" }}>Public:</span> <span style={{ color: protokoll.public ? "green" : "red" }}>
                    {protokoll.public ? "Ja" : "Nein"}
                  </span>
                  <br />
                  <span style={{ fontWeight: "bold" }}>Closed:</span> <span style={{ color: protokoll.closed ? "green" : "red" }}>
                    {protokoll.closed ? "Ja" : "Nein"}
                  </span><br />
                  <span style={{ fontWeight: "bold" }}>Ersteller Name:</span> {protokoll.erstellerName}<br />
                  <span style={{ fontWeight: "bold" }}>Gesamtmenge:</span> {protokoll.gesamtMenge}
                </Card.Text>
                <Link to={`/protokoll/${protokoll.id}`}>Mehr Anzeigen</Link>
              </Card.Body>
              <Card.Footer>
                <small className="text-muted">Erstellt am: {protokoll.datum}</small><br />
                <small className="text-muted">UpdatetAt: {protokoll.updatedAt}</small>
              </Card.Footer>
            </Card>
          </Col>
        ))}
      </Row>
    </>
  );
}
