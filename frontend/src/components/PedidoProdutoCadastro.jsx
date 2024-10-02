// src/components/PedidoProdutoCadastro.jsx
import React, { useState, useEffect } from 'react';
import { Button, Form, Container, Alert, ListGroup, Modal, Spinner } from 'react-bootstrap';
import PedidoProdutoService from '../services/PedidoProdutoService';
import PedidoService from '../services/PedidoService';
import ProdutoService from '../services/ProdutoService';
import Select from 'react-select';

function PedidoProdutoCadastro() {
  const [validado, setValidado] = useState(false);
  const [pedidosSelecionados, setPedidosSelecionados] = useState([]);
  const [produtosSelecionados, setProdutosSelecionados] = useState([]);
  const [quantidade, setQuantidade] = useState(1);
  const [pedidos, setPedidos] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [listaPedidoProdutos, setListaPedidoProdutos] = useState([]);
  const [erroCadastro, setErroCadastro] = useState('');
  const [mostrarAlerta, setMostrarAlerta] = useState(false);
  const [mensagemAlerta, setMensagemAlerta] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [idParaExcluir, setIdParaExcluir] = useState(null);
  const [carregandoPedidos, setCarregandoPedidos] = useState(false);
  const [carregandoProdutos, setCarregandoProdutos] = useState(false);
  const [carregandoLista, setCarregandoLista] = useState(false);

  // Carregar pedidos e produtos na montagem
  useEffect(() => {
    listarPedidos();
    listarProdutos();
  }, []);

  const listarPedidos = async () => {
    setCarregandoPedidos(true);
    try {
      const dados = await PedidoService.obterTodos();
      console.log('Pedidos recebidos:', dados); // Verifique se os pedidos estão sendo carregados

      // Verifique se os campos codigo e descricao existem
      if (dados.length > 0 && (dados[0].codigo === undefined || dados[0].descricao === undefined)) {
        console.error('Os campos codigo ou descricao não existem nos dados recebidos.');
        setErroCadastro('Erro ao carregar pedidos: Campos inválidos.');
        return;
      }

      // Transformar os dados em opções para o React-Select
      const options = dados.map(pedido => ({
        value: pedido.codigo,        // Alterado de pedido.ped_codigo para pedido.codigo
        label: pedido.descricao,     // Alterado de pedido.ped_descricao para pedido.descricao
      }));
      console.log('Opções de pedidos mapeadas:', options); // Log das opções mapeadas
      setPedidos(options);
    } catch (error) {
      console.error('Erro ao carregar pedidos:', error.response ? error.response.data : error.message);
      setErroCadastro('Erro ao carregar pedidos');
    } finally {
      setCarregandoPedidos(false);
    }
  };

  const listarProdutos = async () => {
    setCarregandoProdutos(true);
    try {
      const dados = await ProdutoService.obterTodos();
      console.log('Produtos recebidos:', dados); // Verifique se os produtos estão sendo carregados

      // Verifique se os campos codigo e descricao existem
      if (dados.length > 0 && (dados[0].codigo === undefined || dados[0].descricao === undefined)) {
        console.error('Os campos codigo ou descricao não existem nos dados recebidos.');
        setErroCadastro('Erro ao carregar produtos: Campos inválidos.');
        return;
      }

      // Transformar os dados em opções para o React-Select
      const options = dados.map(produto => ({
        value: produto.codigo,        // Alterado de produto.prod_codigo para produto.codigo
        label: produto.descricao,     // Alterado de produto.prod_descricao para produto.descricao
      }));
      console.log('Opções de produtos mapeadas:', options); // Log das opções mapeadas
      setProdutos(options);
    } catch (error) {
      console.error('Erro ao carregar produtos:', error.response ? error.response.data : error.message);
      setErroCadastro('Erro ao carregar produtos');
    } finally {
      setCarregandoProdutos(false);
    }
  };

  const listarPedidoProdutos = async (pedidoId) => {
    if (!pedidoId) {
      setListaPedidoProdutos([]);
      return;
    }
    setCarregandoLista(true);
    try {
      const dados = await PedidoProdutoService.obterProdutosPorPedido(pedidoId);
      console.log('Dados recebidos da API:', dados); // Log para depuração

      if (dados && dados.status) {
        if (Array.isArray(dados.listaProdutos)) {
          setListaPedidoProdutos(dados.listaProdutos);
          setErroCadastro('');
        } else {
          console.error('listaProdutos não é um array:', dados.listaProdutos);
          setErroCadastro('Formato de dados inesperado.');
          setListaPedidoProdutos([]);
        }
      } else {
        setErroCadastro(dados ? (dados.mensagem || 'Erro ao listar produtos do pedido') : 'Erro desconhecido.');
        setListaPedidoProdutos([]);
      }
    } catch (error) {
      console.error('Erro ao listar produtos do pedido:', error.response ? error.response.data : error.message);
      setErroCadastro('Erro ao listar produtos do pedido');
      setListaPedidoProdutos([]);
    } finally {
      setCarregandoLista(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setValidado(true);
    let formValido = true;
    let erro = '';

    if (pedidosSelecionados.length === 0) {
      formValido = false;
      erro += 'Selecione pelo menos um pedido.\n';
    }
    if (produtosSelecionados.length === 0) {
      formValido = false;
      erro += 'Selecione pelo menos um produto.\n';
    }
    if (quantidade < 1) {
      formValido = false;
      erro += 'Quantidade deve ser pelo menos 1.\n';
    }

    if (!formValido) {
      setErroCadastro(erro.trim());
      return;
    } else {
      setErroCadastro('');
    }

    try {
      // Criar todas as combinações de pedido e produto
      const associacoes = [];
      pedidosSelecionados.forEach(pedido => {
        produtosSelecionados.forEach(produto => {
          associacoes.push({
            pedido_id: pedido.value,        // Agora está correto
            produto_id: produto.value,      // Agora está correto
            quantidade: parseInt(quantidade, 10),
          });
        });
      });

      console.log('Associações a serem enviadas:', associacoes);

      // Verificar se há associações com undefined
      associacoes.forEach((assoc, index) => {
        if (assoc.pedido_id === undefined || assoc.produto_id === undefined) {
          console.error(`Associação na posição ${index} tem pedido_id ou produto_id undefined:`, assoc);
        }
      });

      // Enviar múltiplas requisições individuais
      const promises = associacoes.map(associacao =>
        PedidoProdutoService.associarProduto(associacao)
      );

      const resultados = await Promise.all(promises);

      console.log('Resultados das associações:', resultados);

      // Verificar resultados e atualizar o estado
      setMensagemAlerta('Produtos associados aos pedidos com sucesso!');
      setMostrarAlerta(true);

      // Atualizar a lista de produtos associados para cada pedido
      pedidosSelecionados.forEach(pedido => listarPedidoProdutos(pedido.value));

      // Resetar os campos
      setPedidosSelecionados([]);
      setProdutosSelecionados([]);
      setQuantidade(1);
      setValidado(false);
      setErroCadastro('');
    } catch (error) {
      console.error('Erro ao associar produtos aos pedidos:', error);
      setErroCadastro(error.message || 'Erro ao associar produtos aos pedidos');
    }
  };

  const handleConfirmarExcluir = (pedidoId, produtoId) => {
    setIdParaExcluir({ pedidoId, produtoId });
    setShowModal(true);
  };

  const handleExcluir = async () => {
    try {
      const { pedidoId, produtoId } = idParaExcluir;
      const response = await PedidoProdutoService.removerAssociacao(pedidoId, produtoId);
      console.log('Resposta após remover associação:', response);

      if (response.status) {
        setMensagemAlerta('Produto removido do pedido com sucesso!');
        setMostrarAlerta(true);
        await listarPedidoProdutos(pedidoId);
      } else {
        console.error('Erro ao remover associação:', response.mensagem);
        setErroCadastro(response.mensagem || 'Erro ao remover associação');
      }
    } catch (error) {
      console.error('Erro ao remover associação:', error.response ? error.response.data : error.message);
      setErroCadastro(error.message || 'Erro ao remover associação');
    } finally {
      setShowModal(false);
    }
  };

  const renderizarListaProdutos = () => {
    if (!Array.isArray(listaPedidoProdutos)) {
      return <p>Nenhum produto associado a este pedido.</p>;
    }

    if (listaPedidoProdutos.length === 0) {
      return <p>Nenhum produto associado a este pedido.</p>;
    }

    return (
      <ListGroup>
        {listaPedidoProdutos.map((pedidoProduto) => (
          <ListGroup.Item
            key={`${pedidoProduto.pedido_id}-${pedidoProduto.produto_id}`} // Uso correto de template literals
            className="d-flex justify-content-between align-items-center"
          >
            <div>
              <strong>{pedidoProduto.descricao || pedidoProduto.prod_descricao}</strong> - Quantidade: {pedidoProduto.quantidade}
            </div>
            <div>
              <Button
                variant="danger"
                size="sm"
                onClick={() => handleConfirmarExcluir(pedidoProduto.pedido_id, pedidoProduto.produto_id)}
              >
                Remover
              </Button>
            </div>
          </ListGroup.Item>
        ))}
      </ListGroup>
    );
  };

  return (
    <Container>
      <h1>Associar Produtos a Pedidos</h1>

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
        <Alert variant="danger" onClose={() => setErroCadastro('')} dismissible>
          {erroCadastro}
        </Alert>
      )}

      <Form noValidate validated={validado} onSubmit={handleSubmit}>
        {/* Seleção Múltipla de Pedidos */}
        <Form.Group controlId="formPedidos">
          <Form.Label>Pedidos</Form.Label>
          {carregandoPedidos ? (
            <Spinner animation="border" size="sm" />
          ) : (
            <Select
              isMulti
              options={pedidos}
              value={pedidosSelecionados}
              onChange={(selected) => {
                console.log('Pedidos selecionados:', selected);
                setPedidosSelecionados(selected);
              }}
              placeholder="Selecione os pedidos..."
            />
          )}
          {validado && pedidosSelecionados.length === 0 && (
            <div className="text-danger">Selecione pelo menos um pedido.</div>
          )}
        </Form.Group>

        {/* Seleção Múltipla de Produtos */}
        <Form.Group controlId="formProdutos" className="mt-3">
          <Form.Label>Produtos</Form.Label>
          {carregandoProdutos ? (
            <Spinner animation="border" size="sm" />
          ) : (
            <Select
              isMulti
              options={produtos}
              value={produtosSelecionados}
              onChange={(selected) => {
                console.log('Produtos selecionados:', selected);
                setProdutosSelecionados(selected);
              }}
              placeholder="Selecione os produtos..."
            />
          )}
          {validado && produtosSelecionados.length === 0 && (
            <div className="text-danger">Selecione pelo menos um produto.</div>
          )}
        </Form.Group>

        {/* Quantidade */}
        <Form.Group controlId="formQuantidade" className="mt-3">
          <Form.Label>Quantidade</Form.Label>
          <Form.Control
            required
            type="number"
            min="1"
            value={quantidade}
            onChange={(e) => {
              console.log('Quantidade alterada para:', e.target.value);
              setQuantidade(e.target.value);
            }}
          />
          <Form.Control.Feedback type="invalid">
            Insira a quantidade.
          </Form.Control.Feedback>
        </Form.Group>

        <Button variant="primary" type="submit" className="mt-3">
          Associar Produtos aos Pedidos
        </Button>
      </Form>

      <h2 className="mt-5">Produtos Associados aos Pedidos</h2>
      {carregandoLista ? <Spinner animation="border" /> : renderizarListaProdutos()}

      {/* Modal de Confirmação de Exclusão */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Exclusão</Modal.Title>
        </Modal.Header>
        <Modal.Body>Deseja remover este produto do pedido?</Modal.Body>
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

export default PedidoProdutoCadastro;
