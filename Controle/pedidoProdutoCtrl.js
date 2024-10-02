
import PedidoProduto from '../Modelo/pedidoProduto.js';

export default class PedidoProdutoCtrl {
  
  async associarProduto(req, res) {
    const { pedido_id, produto_id, quantidade } = req.body;

    
    console.log(`Recebendo dados para associar produto: pedido_id=${pedido_id}, produto_id=${produto_id}, quantidade=${quantidade}`);

    // Validação dos dados
    if (!pedido_id || !produto_id || !quantidade) {
      return res.status(400).json({ status: false, mensagem: 'Os campos pedido_id, produto_id e quantidade são obrigatórios.' });
    }

    try {
      const pedidoProduto = new PedidoProduto(pedido_id, produto_id, quantidade);
      await pedidoProduto.associarProduto();
      res.json({ status: true, mensagem: 'Produto associado ao pedido com sucesso!' });
    } catch (erro) {
      console.error('Erro ao associar produto ao pedido:', erro.message);
      res.status(500).json({ status: false, mensagem: 'Erro ao associar produto ao pedido: ' + erro.message });
    }
  }

  // Método para associar múltiplos produtos a múltiplos pedidos em lote
  async associarProdutosEmLote(req, res) {
    const { associacoes } = req.body;

    console.log('Recebendo associações em lote:', associacoes);

    if (!Array.isArray(associacoes) || associacoes.length === 0) {
      return res.status(400).json({ status: false, mensagem: 'Nenhuma associação fornecida.' });
    }

    // Validar cada associação
    for (const associacao of associacoes) {
      const { pedido_id, produto_id, quantidade } = associacao;
      if (!pedido_id || !produto_id || !quantidade) {
        return res.status(400).json({ status: false, mensagem: 'Cada associação deve conter pedido_id, produto_id e quantidade.' });
      }
    }

    try {
      const pedidoProduto = new PedidoProduto();
      await pedidoProduto.associarProdutosEmLote(associacoes);
      res.json({ status: true, mensagem: 'Produtos associados aos pedidos com sucesso!' });
    } catch (erro) {
      console.error('Erro ao associar produtos em lote:', erro.message);
      res.status(500).json({ status: false, mensagem: 'Erro ao associar produtos aos pedidos: ' + erro.message });
    }
  }

  // Método para obter todos os produtos associados a um pedido
  async obterProdutosPorPedido(req, res) {
    const { pedidoId } = req.params;
    console.log(`Recebendo requisição para obter produtos do pedido ID: ${pedidoId}`); // Log inicial
    try {
      const pedidoProduto = new PedidoProduto();
      const listaProdutos = await pedidoProduto.consultarProdutosPorPedido(pedidoId);
      console.log('Lista de produtos obtida:', listaProdutos); // Log dos dados obtidos
      res.json({ status: true, listaProdutos });
    } catch (erro) {
      console.error('Erro ao obter produtos do pedido:', erro.message);
      res.status(500).json({ status: false, mensagem: 'Erro ao obter produtos do pedido: ' + erro.message });
    }
  }

  // Método para atualizar a quantidade de um produto em um pedido
  async atualizarQuantidade(req, res) {
    const { pedidoId, produtoId } = req.params;
    const { quantidade } = req.body;

    console.log(`Recebendo dados para atualizar quantidade: pedidoId=${pedidoId}, produtoId=${produtoId}, quantidade=${quantidade}`);

    if (!quantidade) {
      return res.status(400).json({ status: false, mensagem: 'A quantidade é obrigatória.' });
    }

    try {
      const pedidoProduto = new PedidoProduto(pedidoId, produtoId, quantidade);
      await pedidoProduto.atualizarQuantidade();
      res.json({ status: true, mensagem: 'Quantidade do produto atualizada com sucesso!' });
    } catch (erro) {
      console.error('Erro ao atualizar quantidade do produto:', erro.message);
      res.status(500).json({ status: false, mensagem: 'Erro ao atualizar quantidade do produto: ' + erro.message });
    }
  }

  // Método para remover a associação entre produto e pedido
  async removerAssociacao(req, res) {
    const { pedidoId, produtoId } = req.params;
    console.log(`Recebendo requisição para remover associação: pedidoId=${pedidoId}, produtoId=${produtoId}`);
    try {
      const pedidoProduto = new PedidoProduto(pedidoId, produtoId);
      await pedidoProduto.removerAssociacao();
      res.json({ status: true, mensagem: 'Produto removido do pedido com sucesso!' });
    } catch (erro) {
      console.error('Erro ao remover produto do pedido:', erro.message);
      res.status(500).json({ status: false, mensagem: 'Erro ao remover produto do pedido: ' + erro.message });
    }
  }
}
