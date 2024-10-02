
import React from 'react';
import { Navbar, Nav, Container, Button, NavDropdown } from 'react-bootstrap';
import { NavLink, useNavigate } from 'react-router-dom';
import authService from '../services/AuthService';

function NavigationBar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    
    if (window.confirm('Tem certeza que deseja sair?')) {
      authService.logout();
      navigate('/login');
    }
  };

 
  const getNavLinkClass = ({ isActive }) => (isActive ? 'nav-link active' : 'nav-link');

  return (
    <Navbar bg="light" expand="lg" collapseOnSelect>
      <Container>
        <Navbar.Brand as={NavLink} to="/">
          Meu Sistema
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        {authService.isAuthenticated() && (
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              {/* Link para Clientes */}
              <Nav.Link as={NavLink} to="/clientes" className={getNavLinkClass}>
                Clientes
              </Nav.Link>

              {/* Link para Produtos */}
              <Nav.Link as={NavLink} to="/produtos" className={getNavLinkClass}>
                Produtos
              </Nav.Link>

              {/* Link para Pedidos */}
              <Nav.Link as={NavLink} to="/pedidos" className={getNavLinkClass}>
                Pedidos
              </Nav.Link>

              {/* Dropdown para Gerenciamento de Pedido-Produto */}
              <NavDropdown title="Pedido-Produto" id="pedido-produto-dropdown">
                <NavDropdown.Item as={NavLink} to="/pedido-produto">
                  Gerenciar Pedido-Produto
                </NavDropdown.Item>
                {/* Adicione mais itens aqui se necessário */}
              </NavDropdown>
            </Nav>

            {/* Botão de Logout */}
            <Button variant="outline-danger" onClick={handleLogout}>
              Logout
            </Button>
          </Navbar.Collapse>
        )}
      </Container>
    </Navbar>
  );
}

export default NavigationBar;
