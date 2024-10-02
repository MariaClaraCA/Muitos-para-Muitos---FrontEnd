
import Pedido from '../Modelo/Pedido.js';

export default class PedidoCtrl {
  
  async gravar(req, res) {
    const { descricao, valorTotal, dataPedido, cli_codigo } = req.body;
    const pedido = new Pedido(0, descricao, valorTotal, dataPedido, cli_codigo);
    try {
      await pedido.gravar();
      res.json({ status: true, mensagem: 'Pedido incluído com sucesso!' });
    } catch (erro) {
      console.error('Erro ao gravar pedido:', erro.message);
      res.status(500).json({ status: false, mensagem: 'Erro ao incluir pedido: ' + erro.message });
    }
  }

  
  async atualizar(req, res) {
    const { descricao, valorTotal, dataPedido, cli_codigo } = req.body;
    const { codigo } = req.params;
    const pedido = new Pedido(codigo, descricao, valorTotal, dataPedido, cli_codigo);
    try {
      await pedido.atualizar();
      res.json({ status: true, mensagem: 'Pedido atualizado com sucesso!' });
    } catch (erro) {
      console.error('Erro ao atualizar pedido:', erro.message);
      res.status(500).json({ status: false, mensagem: 'Erro ao atualizar pedido: ' + erro.message });
    }
  }

  
  async excluir(req, res) {
    const { codigo } = req.params;
    const pedido = new Pedido(codigo);
    try {
      await pedido.excluir();
      res.json({ status: true, mensagem: 'Pedido excluído com sucesso!' });
    } catch (erro) {
      console.error('Erro ao excluir pedido:', erro.message);
      res.status(500).json({ status: false, mensagem: 'Erro ao excluir pedido: ' + erro.message });
    }
  }

  
  async consultar(req, res) {
    const termo = req.query.search || '';
    try {
      const pedido = new Pedido();
      const listaPedidos = await pedido.consultar(termo);
      res.json({ status: true, listaPedidos });
    } catch (erro) {
      console.error('Erro ao consultar pedidos:', erro.message);
      res.status(500).json({ status: false, mensagem: 'Erro ao consultar pedidos: ' + erro.message });
    }
  }

  
  async obterPorCodigo(req, res) {
    const { codigo } = req.params;
    try {
      const pedido = new Pedido();
      const resultado = await pedido.consultarPorCodigo(codigo);
      if (resultado) {
        res.json({ status: true, pedido: resultado });
      } else {
        res.status(404).json({ status: false, mensagem: 'Pedido não encontrado' });
      }
    } catch (erro) {
      console.error('Erro ao obter pedido por código:', erro.message);
      res.status(500).json({ status: false, mensagem: 'Erro ao obter pedido: ' + erro.message });
    }
  }
}
