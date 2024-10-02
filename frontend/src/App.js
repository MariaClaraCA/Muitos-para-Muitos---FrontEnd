
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ClienteCadastro from './components/ClienteCadastro';
import ProdutoCadastro from './components/ProdutoCadastro';
import PedidoCadastro from './components/PedidoCadastro';
import Login from './components/Login';
import PrivateRoute from './components/PrivateRoute';
import NavigationBar from './components/NavigationBar';
import PedidoProdutoCadastro from './components/PedidoProdutoCadastro';
import 'bootstrap/dist/css/bootstrap.min.css';


function App() {
  return (
    <Router>
      <NavigationBar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/clientes"
          element={
            <PrivateRoute>
              <ClienteCadastro />
            </PrivateRoute>
          }
        />
        <Route
          path="/produtos"
          element={
            <PrivateRoute>
              <ProdutoCadastro />
            </PrivateRoute>
          }
        />
        <Route
          path="/pedidos"
          element={
            <PrivateRoute>
              <PedidoCadastro />
            </PrivateRoute>
          }
          />
          <Route
            path="/pedido-produto"
            element={
              <PrivateRoute>
                <PedidoProdutoCadastro />
              </PrivateRoute>
            }
        />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <ClienteCadastro />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
