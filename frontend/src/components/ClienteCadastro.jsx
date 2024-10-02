
import React, { useState, useEffect } from 'react';
import {
  Button,
  Form,
  Container,
  Alert,
  ListGroup,
  InputGroup,
  FormControl,
  Modal,
} from 'react-bootstrap';
import clienteService from '../services/ClienteService';

function ClienteCadastro() {
  const [validado, setValidado] = useState(false);
  const [nome, setNome] = useState('');
  const [mostrarAlerta, setMostrarAlerta] = useState(false);
  const [mensagemAlerta, setMensagemAlerta] = useState('');
  const [erroCadastro, setErroCadastro] = useState('');
  const [listaClientes, setListaClientes] = useState([]);
  const [editando, setEditando] = useState(false);
  const [idOriginal, setIdOriginal] = useState(null);
  const [termoBusca, setTermoBusca] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [idParaExcluir, setIdParaExcluir] = useState(null);

  useEffect(() => {
    listarClientes();
  }, []);

  const listarClientes = async () => {
    try {
      const dados = await clienteService.obterTodos();
      console.log('Dados obtidos:', dados);
      if (Array.isArray(dados)) {
        dados.sort((a, b) => a.nome.localeCompare(b.nome));
        setListaClientes(dados);
      } else {
        setListaClientes([]);
      }
    } catch (error) {
      console.error('Erro ao listar clientes:', error);
      setErroCadastro(error.message);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
      setValidado(true);
    } else {
      try {
        if (editando) {
          await clienteService.editar(idOriginal, { nome });
          setEditando(false);
          setIdOriginal(null);
          setMensagemAlerta('Cliente editado com sucesso!');
        } else {
          await clienteService.cadastrar({ nome });
          setMensagemAlerta('Cliente cadastrado com sucesso!');
        }
        listarClientes();
        setMostrarAlerta(true);
        setNome('');
        setValidado(false);
        setErroCadastro('');
      } catch (error) {
        console.error('Erro ao salvar cliente:', error);
        setErroCadastro(error.message);
      }
    }
  };

  const handleEditar = (cliente) => {
    setEditando(true);
    setIdOriginal(cliente.codigo); 
    setNome(cliente.nome); 
  };

  const handleConfirmarExcluir = (id) => {
    setIdParaExcluir(id);
    setShowModal(true);
  };

  const handleExcluir = async () => {
    try {
      await clienteService.excluir(idParaExcluir);
      listarClientes();
      setMensagemAlerta('Cliente excluído com sucesso!');
      setMostrarAlerta(true);
    } catch (error) {
      console.error('Erro ao excluir cliente:', error);
      setErroCadastro(error.message);
    } finally {
      setShowModal(false);
    }
  };

  const handleBusca = async (event) => {
    const termo = event.target.value;
    setTermoBusca(termo);
    if (termo) {
      try {
        const dados = await clienteService.filtrar(termo);
        console.log('Dados filtrados:', dados);
        if (Array.isArray(dados)) {
          dados.sort((a, b) => a.nome.localeCompare(b.nome));
          setListaClientes(dados);
        } else {
          setListaClientes([]);
        }
      } catch (error) {
        console.error('Erro ao buscar clientes:', error);
        setErroCadastro(error.message);
      }
    } else {
      listarClientes();
    }
  };

  return (
    <Container>
      <h1 className="mb-4">Cadastro de Clientes</h1>
      {mostrarAlerta && (
        <Alert
          variant="success"
          onClose={() => setMostrarAlerta(false)}
          dismissible
        >
          {mensagemAlerta}
        </Alert>
      )}
      {erroCadastro && (
        <Alert
          variant="danger"
          onClose={() => setErroCadastro('')}
          dismissible
        >
          {erroCadastro}
        </Alert>
      )}
      <Form noValidate validated={validado} onSubmit={handleSubmit}>
        <Form.Group controlId="formNome">
          <Form.Label>Nome do Cliente</Form.Label>
          <Form.Control
            required
            type="text"
            placeholder="Nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
          <Form.Control.Feedback type="invalid">
            Por favor, insira o nome do cliente.
          </Form.Control.Feedback>
        </Form.Group>

        <Button variant="primary" type="submit" className="mt-3">
          {editando ? 'Salvar Alterações' : 'Cadastrar'}
        </Button>
      </Form>

      <h2 className="mt-5">Lista de Clientes</h2>
      <InputGroup className="mb-3">
        <FormControl
          placeholder="Buscar clientes"
          value={termoBusca}
          onChange={handleBusca}
        />
      </InputGroup>
      {listaClientes.length > 0 ? (
        <ListGroup>
          {listaClientes.map((cliente) => (
            <ListGroup.Item
              key={cliente.codigo}
              className="d-flex justify-content-between align-items-center"
            >
              <div>
                <strong>{cliente.nome}</strong>
              </div>
              <div>
                <Button
                  variant="warning"
                  size="sm"
                  className="me-2"
                  onClick={() => handleEditar(cliente)}
                >
                  Editar
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleConfirmarExcluir(cliente.codigo)}
                >
                  Excluir
                </Button>
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>
      ) : (
        <p>Nenhum cliente encontrado.</p>
      )}

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Exclusão</Modal.Title>
        </Modal.Header>
        <Modal.Body>Tem certeza de que deseja excluir este cliente?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleExcluir}>
            Excluir
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default ClienteCadastro;
