import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Button, Modal, Form, Col, CardGroup, Card } from "react-bootstrap";
import { EintragResource } from "../Resources";
import { getEintrag, putEintrag, deleteEintrag, userId, deleteLogin } from "../backend/api";
import { useLoginContext } from "./LoginContext";
import { LoadingIndicator } from "./LoadingIndicator";
import { PageError } from "./PageError";
import { LinkContainer } from "react-router-bootstrap";

export function PageEintrag() {
    const params = useParams();
    const eintragId = params.eintragId;
    const [getraenkeError, setGetraenkeError] = useState("");
    const [kommentarError, setKommentarError] = useState("");
    const [mengeError, setMengeError] = useState("");
    const [eintrag, setEintrag] = useState<EintragResource | null>(null);
    const [error, setError] = useState<Error | null>(null);
    const [eintragDelete, setEintragDelete] = useState(false);
    const [eintragBearbeiten, setEintragBearbeiten] = useState(false);
    const [getraenk, setGetraenk] = useState("");
    const [menge, setMenge] = useState<number | "">("");
    const [kommentar, setKommentar] = useState<string | "">("");
    const { loginInfo } = useLoginContext();

    async function validate() {
        // Validate getraenk
        if (getraenk.length < 1 || getraenk.length > 100) {
            setGetraenkeError("Name muss zwischen 1 und 100 Zeichen lang sein");
        } else {
            setGetraenkeError("");
        }

        // Validate kommentar (only if it has a value)
        if (kommentar && (kommentar.length > 1000 || kommentar.length < 1)) {
            setKommentarError("Kommentar muss zwischen 1 und 1000 Zeichen lang sein");
        } else {
            setKommentarError("");
        }

        // Validate menge
        if (menge !== "" && menge > 3000) {
            setMengeError("Menge darf nicht mehr als 3000 ml sein");
        } else {
            setMengeError("");
        }
    }

    useEffect(() => {
        async function loadEintrag() {
            try {
                const eintragData = await getEintrag(eintragId!);
                setEintrag(eintragData);
                setGetraenk(eintragData.getraenk);
                setMenge(eintragData.menge);
                setKommentar(eintragData.kommentar || ""); // Ensure kommentar is initialized as empty string if null
            } catch (error) {
                if (error instanceof Error) {
                    setError(error);
                    await deleteLogin();
                }
            }
        }
        loadEintrag();
    }, [eintragId]);

    async function updateEintrag() {
        if (eintragId) {
            await putEintrag(eintragId, getraenk, menge !== "" ? menge : 0, kommentar || "", userId, eintrag!.protokoll!);
            setEintragBearbeiten(false); // Close the edit modal after update
        }
    }

    if (error) {
        return <PageError />;
    }

    if (!eintrag) {
        return <LoadingIndicator />;
    }

    return (
        <>
            <CardGroup>
                <Card>
                    <Card.Body>
                        <Card.Title>Eintrag</Card.Title>
                        <Card.Text>
                            Getränk: {eintrag.getraenk}<br />
                            Menge: {eintrag.menge}<br />
                            Kommentar: {eintrag.kommentar}<br />
                            Ersteller Name: {eintrag.erstellerName}<br />
                            {loginInfo && userId === eintrag.ersteller && (
                                <>
                                    <Button variant="outline-primary" onClick={() => setEintragDelete(true)}>Löschen</Button>
                                    <Button variant="outline-primary" onClick={() => setEintragBearbeiten(true)}>Editieren</Button>
                                </>
                            )}
                        </Card.Text>
                        <LinkContainer to="/">
                            <Button variant="primary" size="lg" className="mt-3">Home</Button>
                        </LinkContainer>
                    </Card.Body>
                    <Card.Footer>
                        <small className="text-muted">CreatedAt: {eintrag.createdAt}</small>
                    </Card.Footer>
                </Card>
            </CardGroup>

            <Modal
                show={eintragDelete}
                onHide={() => setEintragDelete(false)}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Eintrag löschen</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Möchten Sie diesen Eintrag wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.</p>
                    <div className="d-flex justify-content-end">
                        <Button variant="secondary" onClick={() => setEintragDelete(false)} className="me-2">Abbrechen</Button>
                        <Button variant="danger" onClick={async () => {
                            await deleteEintrag(eintragId!);
                            setEintragDelete(false);
                        }}>Löschen</Button>
                    </div>
                </Modal.Body>
            </Modal>

            <Modal show={eintragBearbeiten} onHide={() => setEintragBearbeiten(false)} backdrop="static" keyboard={false}>
                <Modal.Header closeButton>
                    <Modal.Title>Eintrag Bearbeiten</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group as={Col} controlId="formGetraenk">
                            <Form.Label>Getränk</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Was haben Sie getrunken"
                                value={getraenk}
                                onChange={(e) => setGetraenk(e.target.value)}
                                onBlur={validate}
                                isInvalid={!!getraenkeError}
                            />
                            <Form.Control.Feedback type="invalid">
                                {getraenkeError}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Menge</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="Menge in ml"
                                value={menge === "" ? "" : menge}
                                onChange={(e) => setMenge(e.target.value === "" ? "" : parseInt(e.target.value, 10))}
                                onBlur={validate}
                                isInvalid={!!mengeError}
                            />
                            <Form.Control.Feedback type="invalid">
                                {mengeError}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Kommentar</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Bemerkung"
                                value={kommentar}
                                onChange={(e) => setKommentar(e.target.value || "")}
                                onBlur={validate}
                                isInvalid={!!kommentarError}
                            />
                            <Form.Control.Feedback type="invalid">
                                {kommentarError}
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setEintragBearbeiten(false)}>
                        Abbrechen
                    </Button>
                    <Button variant="primary" onClick={updateEintrag}>
                        Speichern
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
