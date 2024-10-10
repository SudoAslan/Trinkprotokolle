import 'bootstrap/dist/css/bootstrap.min.css';
import { useContext, useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import {LoginContext, useLoginContext} from './LoginContext';
import { LinkContainer } from 'react-router-bootstrap';
import { deleteLogin, getLogin } from '../backend/api';
import { LoginDialog } from './LoginDialog';

//  type Role= {
//   setAdminOrNot: (value: string) => void;
//  };
//123_abc_ABC
export function Header() {
    const [click, setClick] = useState(false)
    const { loginInfo, setLoginInfo } = useLoginContext();
    const [admin, setAdmin] = useState(false)
  
    
    async function doLogout(){
      await deleteLogin()
      await getLogin()
      setLoginInfo(undefined!)
      setClick(false);
    }
    
    useEffect(() => {
      if (loginInfo && loginInfo.role === "a") {
        setAdmin(true);
      } else {
        setAdmin(false);
      }
    }, [loginInfo]);
  
    return (
      <>
      
       <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <LinkContainer to="/">
            <Navbar.Brand>Trinkprotokolle</Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <LinkContainer to="/">
                <Nav.Link>Home</Nav.Link>
              </LinkContainer>
               {loginInfo
                ?  
                //damit ich auf die Startseite komme
                <LinkContainer to="/">
                <Nav.Link onClick={doLogout}>Logout</Nav.Link>
                </LinkContainer>
                :
                <Nav.Link onClick={() => setClick(true)}>Login</Nav.Link>
              }
              {click && <LoginDialog setClick={setClick}></LoginDialog>}
              { (loginInfo && admin) && 
              <LinkContainer to="/admin">
                <Nav.Link>Admin</Nav.Link>
              </LinkContainer>
              }
  
              {
              loginInfo&&
              <LinkContainer to="/prefs">
                <Nav.Link>Prefs</Nav.Link>
              </LinkContainer>
              }
              { loginInfo&&
                 <LinkContainer to="/protokoll/neu">
                 <Nav.Link>Neues Protokoll</Nav.Link>
               </LinkContainer>
              }
              
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      </>
  
    );
  }