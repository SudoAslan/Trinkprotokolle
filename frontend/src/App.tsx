// App.js
import React, { useEffect, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { Route, Routes } from 'react-router-dom';
import { Container, Nav, Navbar, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { ErrorFallback } from './components/ErrorFallback';
import { PageIndex } from './components/PageIndex';
import { PageAdmin } from './components/PageAdmin';
import { PageEintrag } from './components/PageEintrag';
import { PagePrefs } from './components/PagePrefs';
import { LoginContext, LoginInfo} from './components/LoginContext';
import {PageProtokoll} from './components/PageProtokoll';
import { Header } from './components/Header';
import { CreateProtokoll } from './components/CreateProtokoll';
import { CreateEintrag } from './components/CreateEintrag';
import { getLogin } from './backend/api';



function App() {
  const [loginInfo, setLoginInfo] = React.useState<LoginInfo | false | undefined>(undefined);

  useEffect(() => {
    (async() => {
    const loginFromServer = await getLogin();
    if(loginFromServer){
      console.log("app   "+loginFromServer.userId)
    }
    setLoginInfo(loginFromServer);
    })();
    },[]);

  return (
    <>
    <ErrorBoundary FallbackComponent={ErrorFallback}>
    <LoginContext.Provider value={{ loginInfo, setLoginInfo }}>
      <Header></Header>
        <Routes>
          <Route path="*" element={<PageIndex />} />
          <Route path="/protokoll/:protokollId" element={<PageProtokoll />} />
          <Route path="/admin" element={<PageAdmin />} />
          <Route path="/prefs" element={<PagePrefs />} />
          <Route path="/eintrag/:eintragId" element={<PageEintrag />} />
          <Route path="/protokoll/neu" element={<CreateProtokoll/>} />
         <Route path="/protokoll/:protokollId/eintrag/neu" element={<CreateEintrag/>} /> 

        </Routes>
        </LoginContext.Provider>
      </ErrorBoundary>




    </>
  );

}

export default App;