// routes/pedidoProdutoRota.js
import { Router } from 'express';
import PedidoProdutoCtrl from '../Controle/PedidoProdutoCtrl.js';
import { autenticarToken } from '../Middleware/authMiddleware.js'; // Middleware de autenticação

const pedidoProdutoCtrl = new PedidoProdutoCtrl();
const rotaPedidoProduto = Router();

// Rota para associar um produto a um pedido
rotaPedidoProduto.post('/', autenticarToken, (req, res) => pedidoProdutoCtrl.associarProduto(req, res));

// Rota para associar múltiplos produtos a múltiplos pedidos em lote
rotaPedidoProduto.post('/lote', autenticarToken, (req, res) => pedidoProdutoCtrl.associarProdutosEmLote(req, res));

// Rota para obter produtos associados a um pedido
rotaPedidoProduto.get('/pedido/:pedidoId', autenticarToken, (req, res) => pedidoProdutoCtrl.obterProdutosPorPedido(req, res));

// Rota para atualizar a quantidade de um produto em um pedido
rotaPedidoProduto.put('/pedido/:pedidoId/produto/:produtoId', autenticarToken, (req, res) => pedidoProdutoCtrl.atualizarQuantidade(req, res));

// Rota para remover a associação entre produto e pedido
rotaPedidoProduto.delete('/pedido/:pedidoId/produto/:produtoId', autenticarToken, (req, res) => pedidoProdutoCtrl.removerAssociacao(req, res));

export default rotaPedidoProduto;
