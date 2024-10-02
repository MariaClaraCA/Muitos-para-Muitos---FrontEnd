// src/services/PedidoProdutoService.js
import api from './api';

/**
 * Serviço para gerenciar associações entre Pedidos e Produtos (Relacionamento Muitos para Muitos)
 */
class PedidoProdutoService {
  /**
   * Associa um produto a um pedido
   * @param {Object} pedidoProduto - Objeto contendo pedido_id, produto_id e quantidade
   * @returns {Promise<Object>} - Resposta da API
   */
  async associarProduto(pedidoProduto) {
    try {
      const response = await api.post('/pedidoproduto', pedidoProduto); // Corrigido para minúsculas
      console.log('Resposta do backend (associarProduto):', response.data);
      return response.data; // Espera-se um objeto com { status: true, mensagem: '...' }
    } catch (error) {
      console.error('Erro ao associar produto ao pedido:', error.response ? error.response.data : error.message);
      throw new Error(error.response?.data?.mensagem || 'Erro ao associar produto ao pedido');
    }
  }

  /**
   * Associa múltiplos produtos a múltiplos pedidos em lote
   * @param {Array} associacoes - Array de objetos contendo pedido_id, produto_id e quantidade
   * @returns {Promise<Object>} - Resposta da API
   */
  async associarProdutosEmLote(associacoes) {
    try {
      const response = await api.post('/pedidoproduto/lote', { associacoes }); // Corrigido para minúsculas
      console.log('Resposta do backend (associarProdutosEmLote):', response.data);
      return response.data; // Espera-se um objeto com { status: true, mensagem: '...' }
    } catch (error) {
      console.error('Erro ao associar produtos em lote:', error.response ? error.response.data : error.message);
      throw new Error(error.response?.data?.mensagem || 'Erro ao associar produtos aos pedidos');
    }
  }

  /**
   * Obtém todos os produtos associados a um pedido específico
   * @param {number|string} pedidoId - ID do pedido
   * @returns {Promise<Object>} - Resposta da API com { status: true, listaProdutos: [...] }
   */
  async obterProdutosPorPedido(pedidoId) {
    try {
      const response = await api.get(`/pedidoproduto/pedido/${pedidoId}`); // Corrigido com backticks e minúsculas
      console.log('Resposta do backend (obterProdutosPorPedido):', response.data);
      return response.data; // Espera-se um objeto com { status: true, listaProdutos: [...] }
    } catch (error) {
      console.error('Erro ao obter produtos do pedido:', error.response ? error.response.data : error.message);
      throw new Error(error.response?.data?.mensagem || 'Erro ao obter produtos do pedido');
    }
  }

  /**
   * Remove a associação entre um produto e um pedido
   * @param {number|string} pedidoId - ID do pedido
   * @param {number|string} produtoId - ID do produto
   * @returns {Promise<Object>} - Resposta da API
   */
  async removerAssociacao(pedidoId, produtoId) {
    try {
      const response = await api.delete(`/pedidoproduto/pedido/${pedidoId}/produto/${produtoId}`); // Corrigido com backticks e minúsculas
      console.log('Resposta do backend (removerAssociacao):', response.data);
      return response.data; // Espera-se um objeto com { status: true, mensagem: '...' }
    } catch (error) {
      console.error('Erro ao remover associação de produto ao pedido:', error.response ? error.response.data : error.message);
      throw new Error(error.response?.data?.mensagem || 'Erro ao remover associação de produto ao pedido');
    }
  }

  /**
   * Atualiza a quantidade de um produto em um pedido
   * @param {number|string} pedidoId - ID do pedido
   * @param {number|string} produtoId - ID do produto
   * @param {number} quantidade - Nova quantidade
   * @returns {Promise<Object>} - Resposta da API
   */
  async atualizarQuantidade(pedidoId, produtoId, quantidade) {
    try {
      const response = await api.put(`/pedidoproduto/pedido/${pedidoId}/produto/${produtoId}`, { quantidade }); // Corrigido com backticks e minúsculas
      console.log('Resposta do backend (atualizarQuantidade):', response.data);
      return response.data; // Espera-se um objeto com { status: true, mensagem: '...' }
    } catch (error) {
      console.error('Erro ao atualizar quantidade do produto no pedido:', error.response ? error.response.data : error.message);
      throw new Error(error.response?.data?.mensagem || 'Erro ao atualizar quantidade do produto no pedido');
    }
  }
}

const pedidoProdutoService = new PedidoProdutoService();
export default pedidoProdutoService;
