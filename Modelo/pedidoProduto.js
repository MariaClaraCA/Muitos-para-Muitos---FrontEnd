// models/PedidoProduto.js
import PedidoProdutoDAO from '../Persistencia/pedidoProdutoDAO.js';

export default class PedidoProduto {
  #pedidoId;
  #produtoId;
  #quantidade;

  constructor(pedidoId = 0, produtoId = 0, quantidade = 1) {
    this.#pedidoId = pedidoId;
    this.#produtoId = produtoId;
    this.#quantidade = quantidade;
  }

  // Getters e Setters (opcional)

  // Método para converter a instância para JSON
  toJSON() {
    return {
      pedido_id: this.#pedidoId, // Alterado para snake_case
      produto_id: this.#produtoId, // Alterado para snake_case
      quantidade: this.#quantidade,
    };
  }

  // Métodos para manipulação de pedidos e produtos no banco de dados

  /**
   * Associa um produto a um pedido
   */
  async associarProduto() {
    const pedidoProdutoDAO = new PedidoProdutoDAO();
    await pedidoProdutoDAO.associarProduto(this.toJSON()); // Passa o objeto com campos corretos
  }

  /**
   * Associa múltiplos produtos a múltiplos pedidos em lote
   * @param {Array} associacoes - Array de objetos contendo pedido_id, produto_id e quantidade
   */
  async associarProdutosEmLote(associacoes) {
    const pedidoProdutoDAO = new PedidoProdutoDAO();
    await pedidoProdutoDAO.associarProdutosEmLote(associacoes);
  }

  /**
   * Atualiza a quantidade de um produto em um pedido
   */
  async atualizarQuantidade() {
    const pedidoProdutoDAO = new PedidoProdutoDAO();
    await pedidoProdutoDAO.atualizarQuantidade(this.#pedidoId, this.#produtoId, this.#quantidade);
  }

  /**
   * Remove a associação de um produto a um pedido
   */
  async removerAssociacao() {
    const pedidoProdutoDAO = new PedidoProdutoDAO();
    await pedidoProdutoDAO.removerAssociacao(this.#pedidoId, this.#produtoId);
  }

  /**
   * Consulta produtos associados a um pedido específico
   * @param {number|string} pedidoId - ID do pedido
   * @returns {Promise<Array>} - Lista de produtos associados
   */
  async consultarProdutosPorPedido(pedidoId) {
    const pedidoProdutoDAO = new PedidoProdutoDAO();
    return await pedidoProdutoDAO.consultarProdutosPorPedido(pedidoId);
  }
}
