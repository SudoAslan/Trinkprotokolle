import { useEffect, useState } from 'react';
import { Button, Modal, Form, Col } from 'react-bootstrap';
import { putProtokoll, getProtokoll, userId } from '../backend/api';
import { useParams } from 'react-router-dom';

type HelpProp = {
  show: boolean;
  setShow: (value: boolean) => void;
};

export function Bearbeiten({ setShow, show }: HelpProp) {
  const params = useParams();
  const protokollId = params.protokollId;

  const handleClose = () => setShow(false);

  const [patientError, setPatientError] = useState("");
  const [auswahlError, setAuswahl] = useState("");
  const [patient, setPatient] = useState("");
  const [publiic, setPublic] = useState<boolean | null>(null);
  const [closed, setClosed] = useState<boolean | null>(null);
  const [datum, setDatum] = useState("");

  useEffect(() => {
    async function loadProtokoll() {
      if (protokollId && show) {
        try {
          const protokoll = await getProtokoll(protokollId);

          // Pre-fill the form with the existing data
          setPatient(protokoll.patient);
          setPublic(protokoll.public ?? null);
          setClosed(protokoll.closed ?? null);
          setDatum(protokoll.datum);
        } catch (err) {
          console.error("Failed to load protokoll:", err);
        }
      }
    }
    loadProtokoll();
  }, [protokollId, show]);

  async function validate() {
    if (patient.length < 3 || patient.length > 1000) {
      setPatientError("Name muss länger als 3 Zeichen sein und kleiner als 1000.");
    } else {
      setPatientError(""); // Clear the error if validation passes
    }

    if (publiic === null || closed === null) {
      setAuswahl("Bitte treffen Sie eine Auswahl.");
    } else {
      setAuswahl(""); // Clear the error if validation passes
    }
  }

  async function editProtokoll() {
    validate();
    if (!patientError && !auswahlError) {
      try {
        await putProtokoll(patient, datum, publiic!, closed!, userId, protokollId!);
        handleClose();
      } catch (err) {
        console.error("Failed to edit protokoll:", err);
      }
    }
  }

  return (
    <>
      <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false}>
        <Modal.Header closeButton>
          <Modal.Title>Protokoll Bearbeiten</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Patient</Form.Label>
              <Form.Control
                type="text"
                placeholder="Zu Pflegenden"
                value={patient}
                onChange={(e) => setPatient(e.target.value)}
                onBlur={validate}
                isInvalid={!!patientError}
              />
              <Form.Control.Feedback type="invalid">
                {patientError}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Col} controlId="formPublic">
              <Form.Label>Public</Form.Label>
              <Form.Control
                as="select"
                value={publiic !== null ? publiic.toString() : ""}
                onChange={(e) => setPublic(e.target.value === "true")}
                onBlur={validate}
                isInvalid={!!auswahlError}
              >
                <option value="">Auswählen...</option>
                <option value="true">Ja</option>
                <option value="false">Nein</option>
              </Form.Control>
              <Form.Control.Feedback type="invalid">
                {auswahlError}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Col} controlId="formClosed">
              <Form.Label>Closed</Form.Label>
              <Form.Control
                as="select"
                value={closed !== null ? closed.toString() : ""}
                onChange={(e) => setClosed(e.target.value === "true")}
                onBlur={validate}
                isInvalid={!!auswahlError}
              >
                <option value="">Auswählen...</option>
                <option value="true">Ja</option>
                <option value="false">Nein</option>
              </Form.Control>
              <Form.Control.Feedback type="invalid">
                {auswahlError}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Col} controlId="formDatum">
              <Form.Label>Datum</Form.Label>
              <Form.Control
                type="date"
                value={datum}
                onChange={(e) => setDatum(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Abbrechen
          </Button>
          <Button type="submit" variant="primary" onClick={editProtokoll}>
            Speichern
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
