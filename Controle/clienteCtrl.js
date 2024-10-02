
import Cliente from '../Modelo/Cliente.js';

export default class ClienteCtrl {
  async gravar(req, res) {
    const { nome } = req.body;
    const cliente = new Cliente(0, nome);
    try {
      await cliente.gravar();
      res.json({ status: true, mensagem: 'Cliente incluído com sucesso!' });
    } catch (erro) {
      console.error('Erro ao gravar cliente:', erro.message);
      res.status(500).json({ status: false, mensagem: 'Erro ao incluir cliente: ' + erro.message });
    }
  }

  async atualizar(req, res) {
    const { nome } = req.body;
    const { codigo } = req.params;
    const cliente = new Cliente(codigo, nome);
    try {
      await cliente.atualizar();
      res.json({ status: true, mensagem: 'Cliente atualizado com sucesso!' });
    } catch (erro) {
      console.error('Erro ao atualizar cliente:', erro.message);
      res.status(500).json({ status: false, mensagem: 'Erro ao atualizar cliente: ' + erro.message });
    }
  }

  async excluir(req, res) {
    const { codigo } = req.params;
    const cliente = new Cliente(codigo);
    try {
      await cliente.excluir();
      res.json({ status: true, mensagem: 'Cliente excluído com sucesso!' });
    } catch (erro) {
      console.error('Erro ao excluir cliente:', erro.message);
      res.status(500).json({ status: false, mensagem: 'Erro ao excluir cliente: ' + erro.message });
    }
  }

  async consultar(req, res) {
    const termo = req.query.search || '';
    try {
      const cliente = new Cliente();
      const listaClientes = await cliente.consultar(termo);
      res.json({ status: true, listaClientes });
    } catch (erro) {
      console.error('Erro ao consultar clientes:', erro.message);
      res.status(500).json({ status: false, mensagem: 'Erro ao consultar clientes: ' + erro.message });
    }
  }
  async obterPorCodigo(req, res) {
    const { codigo } = req.params;
    try {
      const cliente = new Cliente();
      const resultado = await cliente.consultarPorCodigo(codigo);
      if (resultado) {
        res.json({ status: true, cliente: resultado });
      } else {
        res.status(404).json({ status: false, mensagem: 'Cliente não encontrado' });
      }
    } catch (erro) {
      console.error('Erro ao obter cliente por código:', erro.message);
      res.status(500).json({ status: false, mensagem: 'Erro ao obter cliente: ' + erro.message });
    }
  }
}
