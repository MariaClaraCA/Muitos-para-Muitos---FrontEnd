
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
import pedidoService from '../services/PedidoService';
import clienteService from '../services/ClienteService';

function PedidoCadastro() {
  const [validado, setValidado] = useState(false);
  const [descricao, setDescricao] = useState('');
  const [valorTotal, setValorTotal] = useState('');
  const [dataPedido, setDataPedido] = useState('');
  const [clientes, setClientes] = useState([]);
  const [cli_codigo, setCli_codigo] = useState('');
  const [mostrarAlerta, setMostrarAlerta] = useState(false);
  const [mensagemAlerta, setMensagemAlerta] = useState('');
  const [erroCadastro, setErroCadastro] = useState('');
  const [listaPedidos, setListaPedidos] = useState([]);
  const [editando, setEditando] = useState(false);
  const [idOriginal, setIdOriginal] = useState(null);
  const [termoBusca, setTermoBusca] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [idParaExcluir, setIdParaExcluir] = useState(null);

  useEffect(() => {
    listarPedidos();
    listarClientes();
  }, []);

 
  const listarPedidos = async () => {
    try {
      const dados = await pedidoService.obterTodos();
      console.log('Dados obtidos:', dados);
      if (Array.isArray(dados)) {
        dados.sort((a, b) => a.descricao.localeCompare(b.descricao));
        setListaPedidos(dados);
      } else {
        setListaPedidos([]);
      }
    } catch (error) {
      console.error('Erro ao listar pedidos:', error);
      setErroCadastro(error.message);
    }
  };


  const listarClientes = async () => {
    try {
      const dados = await clienteService.obterTodos();
      console.log('Clientes obtidos:', dados);
      if (Array.isArray(dados)) {
        dados.sort((a, b) => a.nome.localeCompare(b.nome));
        setClientes(dados);
      } else {
        setClientes([]);
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
        const pedidoData = {
          descricao,
          valorTotal: parseFloat(valorTotal),
          dataPedido,
          cli_codigo: parseInt(cli_codigo),
        };

        if (editando) {
          await pedidoService.editar(idOriginal, pedidoData);
          setEditando(false);
          setIdOriginal(null);
          setMensagemAlerta('Pedido editado com sucesso!');
        } else {
          await pedidoService.cadastrar(pedidoData);
          setMensagemAlerta('Pedido cadastrado com sucesso!');
        }
        listarPedidos();
        setMostrarAlerta(true);
        
        setDescricao('');
        setValorTotal('');
        setDataPedido('');
        setCli_codigo('');
        setValidado(false);
        setErroCadastro('');
      } catch (error) {
        console.error('Erro ao salvar pedido:', error);
        setErroCadastro(error.message);
      }
    }
  };


  const handleEditar = (pedido) => {
    setEditando(true);
    setIdOriginal(pedido.codigo); 
    setDescricao(pedido.descricao);
    setValorTotal(pedido.valorTotal);
    setDataPedido(pedido.dataPedido);
    setCli_codigo(pedido.cli_codigo);
  };


  const handleConfirmarExcluir = (id) => {
    setIdParaExcluir(id);
    setShowModal(true);
  };

  
  const handleExcluir = async () => {
    try {
      await pedidoService.excluir(idParaExcluir);
      listarPedidos();
      setMensagemAlerta('Pedido excluído com sucesso!');
      setMostrarAlerta(true);
    } catch (error) {
      console.error('Erro ao excluir pedido:', error);
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
        const dados = await pedidoService.filtrar(termo);
        console.log('Dados filtrados:', dados);
        if (Array.isArray(dados)) {
          dados.sort((a, b) => a.descricao.localeCompare(b.descricao));
          setListaPedidos(dados);
        } else {
          setListaPedidos([]);
        }
      } catch (error) {
        console.error('Erro ao buscar pedidos:', error);
        setErroCadastro(error.message);
      }
    } else {
      listarPedidos();
    }
  };

  return (
    <Container>
      <h1 className="mb-4">Cadastro de Pedidos</h1>
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
        <Form.Group controlId="formDescricao">
          <Form.Label>Descrição do Pedido</Form.Label>
          <Form.Control
            required
            type="text"
            placeholder="Descrição"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
          />
          <Form.Control.Feedback type="invalid">
            Por favor, insira a descrição do pedido.
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="formValorTotal" className="mt-3">
          <Form.Label>Valor Total</Form.Label>
          <Form.Control
            required
            type="number"
            step="0.01"
            placeholder="Valor Total"
            value={valorTotal}
            onChange={(e) => setValorTotal(e.target.value)}
          />
          <Form.Control.Feedback type="invalid">
            Por favor, insira o valor total do pedido.
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="formDataPedido" className="mt-3">
          <Form.Label>Data do Pedido</Form.Label>
          <Form.Control
            required
            type="date"
            placeholder="Data do Pedido"
            value={dataPedido}
            onChange={(e) => setDataPedido(e.target.value)}
          />
          <Form.Control.Feedback type="invalid">
            Por favor, insira a data do pedido.
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="formCliente" className="mt-3">
          <Form.Label>Cliente</Form.Label>
          <Form.Control
            as="select"
            required
            value={cli_codigo}
            onChange={(e) => setCli_codigo(e.target.value)}
          >
            <option value="">Selecione um cliente</option>
            {clientes.map((cliente) => (
              <option key={cliente.codigo} value={cliente.codigo}>
                {cliente.nome}
              </option>
            ))}
          </Form.Control>
          <Form.Control.Feedback type="invalid">
            Por favor, selecione um cliente.
          </Form.Control.Feedback>
        </Form.Group>

        <Button variant="primary" type="submit" className="mt-3">
          {editando ? 'Salvar Alterações' : 'Cadastrar'}
        </Button>
      </Form>

      <h2 className="mt-5">Lista de Pedidos</h2>
      <InputGroup className="mb-3">
        <FormControl
          placeholder="Buscar pedidos"
          value={termoBusca}
          onChange={handleBusca}
        />
      </InputGroup>
      {listaPedidos.length > 0 ? (
        <ListGroup>
          {listaPedidos.map((pedido) => {
            const cliente = clientes.find(c => c.codigo === pedido.cli_codigo);
            return (
              <ListGroup.Item
                key={pedido.codigo}
                className="d-flex justify-content-between align-items-center"
              >
                <div>
                  <strong>{pedido.descricao}</strong> - R${pedido.valorTotal ? parseFloat(pedido.valorTotal).toFixed(2) : '0.00'} -{' '}
                  {new Date(pedido.dataPedido).toLocaleDateString()} - Cliente: {cliente ? cliente.nome : 'Desconhecido'}
                </div>
                <div>
                  <Button
                    variant="warning"
                    size="sm"
                    className="me-2"
                    onClick={() => handleEditar(pedido)}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleConfirmarExcluir(pedido.codigo)}
                  >
                    Excluir
                  </Button>
                </div>
              </ListGroup.Item>
            );
          })}
        </ListGroup>
      ) : (
        <p>Nenhum pedido encontrado.</p>
      )}

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Exclusão</Modal.Title>
        </Modal.Header>
        <Modal.Body>Tem certeza de que deseja excluir este pedido?</Modal.Body>
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

export default PedidoCadastro;
