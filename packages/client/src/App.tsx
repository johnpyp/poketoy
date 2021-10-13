import "./App.css";

import { Container } from "@chakra-ui/react";
import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import { Header } from "./components/Header";
import { Account } from "./pages/Account";
import { Landing } from "./pages/Landing";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";

export const App: React.FC = () => {
  return (
    <>
      <Router>
        <Header></Header>
        <Container maxW="container.xl">
          <Switch>
            <Route path="/login" component={Login} />
            <Route path="/register" component={Register} />
            <Route path="/account" component={Account} />
            <Route path="/" component={Landing} />
          </Switch>
        </Container>
      </Router>
    </>
  );
};
