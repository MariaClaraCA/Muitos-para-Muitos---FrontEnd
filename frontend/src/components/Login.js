
import React, { useState } from 'react';
import { Button, Form, Container, Alert } from 'react-bootstrap';
import authService from '../services/AuthService';
import { useNavigate } from 'react-router-dom';
import api from '../services/api'; 

function Login() {
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      
      const response = await api.post('/login', { usuario, senha });
      const { token } = response.data;

      if (!token) {
        throw new Error('Token não recebido do servidor');
      }

      authService.login(token);
      navigate('/clientes');
    } catch (error) {
      console.error('Erro no login:', error);
      setErro('Usuário ou senha inválidos');
    }
  };

  return (
    <Container>
      <h1 className="mb-4">Login</h1>
      {erro && (
        <Alert variant="danger" onClose={() => setErro('')} dismissible>
          {erro}
        </Alert>
      )}
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formUsuario">
          <Form.Label>Usuário</Form.Label>
          <Form.Control
            required
            type="text"
            placeholder="Usuário"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="formSenha">
          <Form.Label>Senha</Form.Label>
          <Form.Control
            required
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />
        </Form.Group>

        <Button variant="primary" type="submit" className="mt-3">
          Entrar
        </Button>
      </Form>
    </Container>
  );
}

export default Login;
