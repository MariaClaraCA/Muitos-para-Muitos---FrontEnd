import { Router } from 'express';
import ClienteCtrl from '../Controle/ClienteCtrl.js';
import { autenticarToken } from '../Middleware/authMiddleware.js';

const clienteCtrl = new ClienteCtrl();
const rotaCliente = Router();

rotaCliente.get('/', autenticarToken, clienteCtrl.consultar);
rotaCliente.get('/:codigo', autenticarToken, clienteCtrl.obterPorCodigo);
rotaCliente.post('/', autenticarToken, clienteCtrl.gravar);
rotaCliente.put('/:codigo', autenticarToken, clienteCtrl.atualizar);
rotaCliente.delete('/:codigo', autenticarToken, clienteCtrl.excluir);

export default rotaCliente;
