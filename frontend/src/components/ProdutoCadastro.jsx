
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
import produtoService from '../services/ProdutoService';

function ProdutoCadastro() {
  const [validado, setValidado] = useState(false);
  const [descricao, setDescricao] = useState("");
  const [precoCusto, setPrecoCusto] = useState("");
  const [precoVenda, setPrecoVenda] = useState("");
  const [dataValidade, setDataValidade] = useState("");
  const [qtdEstoque, setQtdEstoque] = useState("");
  const [mostrarAlerta, setMostrarAlerta] = useState(false);
  const [mensagemAlerta, setMensagemAlerta] = useState("");
  const [erroCadastro, setErroCadastro] = useState("");
  const [listaProdutos, setListaProdutos] = useState([]);
  const [editando, setEditando] = useState(false);
  const [idOriginal, setIdOriginal] = useState(null);
  const [termoBusca, setTermoBusca] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [idParaExcluir, setIdParaExcluir] = useState(null);

  useEffect(() => {
    listarProdutos();
  }, []);

  const listarProdutos = async () => {
    try {
      const dados = await produtoService.obterTodos();
      console.log('Dados obtidos:', dados);
      if (Array.isArray(dados)) {
        dados.sort((a, b) => a.descricao.localeCompare(b.descricao));
        setListaProdutos(dados);
        console.log('Lista de produtos atualizada:', dados);
      } else {
        setListaProdutos([]);
        console.log('Dados não são um array. Lista de produtos limpa.');
      }
    } catch (error) {
      console.error('Erro ao listar produtos:', error);
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
        const produto = {
          descricao,
          precoCusto: parseFloat(precoCusto),
          precoVenda: parseFloat(precoVenda),
          dataValidade,
          qtdEstoque: parseInt(qtdEstoque, 10),
        };

        if (editando) {
          await produtoService.editar(idOriginal, produto);
          setEditando(false);
          setIdOriginal(null);
          setMensagemAlerta('Produto editado com sucesso!');
        } else {
          await produtoService.cadastrar(produto);
          setMensagemAlerta('Produto cadastrado com sucesso!');
        }
        listarProdutos();
        setMostrarAlerta(true);
        setDescricao("");
        setPrecoCusto("");
        setPrecoVenda("");
        setDataValidade("");
        setQtdEstoque("");
        setValidado(false);
        setErroCadastro("");
      } catch (error) {
        console.error('Erro ao salvar produto:', error);
        setErroCadastro(error.message);
      }
    }
  };

  const handleEditar = (produto) => {
    setEditando(true);
    setIdOriginal(produto.codigo); 
    setDescricao(produto.descricao);
    setPrecoCusto(produto.precoCusto);
    setPrecoVenda(produto.precoVenda);
    setDataValidade(produto.dataValidade ? produto.dataValidade.substring(0, 10) : '');
    setQtdEstoque(produto.qtdEstoque);
  };

  const handleConfirmarExcluir = (id) => {
    setIdParaExcluir(id);
    setShowModal(true);
  };

  const handleExcluir = async () => {
    try {
      await produtoService.excluir(idParaExcluir);
      listarProdutos();
      setMensagemAlerta('Produto excluído com sucesso!');
      setMostrarAlerta(true);
    } catch (error) {
      console.error('Erro ao excluir produto:', error);
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
        const dados = await produtoService.filtrar(termo);
        console.log('Dados filtrados:', dados);
        if (Array.isArray(dados)) {
          dados.sort((a, b) => a.descricao.localeCompare(b.descricao));
          setListaProdutos(dados);
        } else {
          setListaProdutos([]);
        }
      } catch (error) {
        console.error('Erro ao buscar produtos:', error);
        setErroCadastro(error.message);
      }
    } else {
      listarProdutos();
    }
  };

  return (
    <Container>
      <h1 className="mb-4">Cadastro de Produtos</h1>
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
          <Form.Label>Descrição do Produto</Form.Label>
          <Form.Control
            required
            type="text"
            placeholder="Descrição"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
          />
          <Form.Control.Feedback type="invalid">
            Por favor, insira a descrição do produto.
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="formPrecoCusto" className="mt-3">
          <Form.Label>Preço de Custo</Form.Label>
          <Form.Control
            required
            type="number"
            step="0.01"
            placeholder="Preço de Custo"
            value={precoCusto}
            onChange={(e) => setPrecoCusto(e.target.value)}
          />
          <Form.Control.Feedback type="invalid">
            Por favor, insira o preço de custo.
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="formPrecoVenda" className="mt-3">
          <Form.Label>Preço de Venda</Form.Label>
          <Form.Control
            required
            type="number"
            step="0.01"
            placeholder="Preço de Venda"
            value={precoVenda}
            onChange={(e) => setPrecoVenda(e.target.value)}
          />
          <Form.Control.Feedback type="invalid">
            Por favor, insira o preço de venda.
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="formDataValidade" className="mt-3">
          <Form.Label>Data de Validade</Form.Label>
          <Form.Control
            type="date"
            value={dataValidade}
            onChange={(e) => setDataValidade(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="formQtdEstoque" className="mt-3">
          <Form.Label>Quantidade em Estoque</Form.Label>
          <Form.Control
            required
            type="number"
            placeholder="Quantidade"
            value={qtdEstoque}
            onChange={(e) => setQtdEstoque(e.target.value)}
          />
          <Form.Control.Feedback type="invalid">
            Por favor, insira a quantidade em estoque.
          </Form.Control.Feedback>
        </Form.Group>

        <Button variant="primary" type="submit" className="mt-3">
          {editando ? 'Salvar Alterações' : 'Cadastrar'}
        </Button>
      </Form>

      <h2 className="mt-5">Lista de Produtos</h2>
      <InputGroup className="mb-3">
        <FormControl
          placeholder="Buscar produtos"
          value={termoBusca}
          onChange={handleBusca}
        />
      </InputGroup>
      {listaProdutos.length > 0 ? (
        <ListGroup>
          {listaProdutos.map((produto) => (
            <ListGroup.Item
              key={produto.codigo}
              className="d-flex justify-content-between align-items-center"
            >
              <div>
                <strong>{produto.descricao}</strong> - R$ {Number(produto.precoVenda).toFixed(2)}
              </div>
              <div>
                <Button
                  variant="warning"
                  size="sm"
                  className="me-2"
                  onClick={() => handleEditar(produto)}
                >
                  Editar
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleConfirmarExcluir(produto.codigo)}
                >
                  Excluir
                </Button>
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>
      ) : (
        <p>Nenhum produto encontrado.</p>
      )}

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Exclusão</Modal.Title>
        </Modal.Header>
        <Modal.Body>Tem certeza de que deseja excluir este produto?</Modal.Body>
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

export default ProdutoCadastro;
