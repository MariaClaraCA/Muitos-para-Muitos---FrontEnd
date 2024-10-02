
import { Router } from 'express';
import PedidoCtrl from '../Controle/pedidoCtrl.js';
import { autenticarToken } from '../Middleware/authMiddleware.js';

const pedidoCtrl = new PedidoCtrl();
const rotaPedido = Router();


rotaPedido.post('/', autenticarToken, (req, res) => pedidoCtrl.gravar(req, res));
rotaPedido.put('/:codigo', autenticarToken, (req, res) => pedidoCtrl.atualizar(req, res));
rotaPedido.delete('/:codigo', autenticarToken, (req, res) => pedidoCtrl.excluir(req, res));
rotaPedido.get('/', autenticarToken, (req, res) => pedidoCtrl.consultar(req, res));
rotaPedido.get('/:codigo', autenticarToken, (req, res) => pedidoCtrl.obterPorCodigo(req, res));

export default rotaPedido;
