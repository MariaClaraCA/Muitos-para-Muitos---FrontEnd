// src/services/PedidoService.js
import api from './api';

/**
 * Serviço para gerenciar Pedidos
 */
class PedidoService {
  /**
   * Obtém todos os pedidos
   * @returns {Promise<Array>} - Lista de pedidos
   */
  async obterTodos() {
    try {
      const response = await api.get('/pedido');
      console.log('Resposta do backend (obterTodos):', response.data);
      return response.data.listaPedidos; // Ajuste conforme a estrutura da resposta do backend
    } catch (error) {
      console.error('Erro ao buscar pedidos:', error.response ? error.response.data : error.message);
      throw new Error(error.response?.data?.mensagem || 'Erro ao buscar pedidos');
    }
  }

  /**
   * Cadastra um novo pedido
   * @param {Object} pedido - Dados do pedido
   * @returns {Promise<Object>} - Resposta da API
   */
  async cadastrar(pedido) {
    try {
      const response = await api.post('/pedido', pedido);
      console.log('Resposta do backend (cadastrar):', response.data);
      return response.data;
    } catch (error) {
      console.error('Erro ao cadastrar pedido:', error.response ? error.response.data : error.message);
      throw new Error(error.response?.data?.mensagem || 'Erro ao cadastrar pedido');
    }
  }

  /**
   * Edita um pedido existente
   * @param {number|string} id - ID do pedido
   * @param {Object} pedido - Dados atualizados do pedido
   * @returns {Promise<Object>} - Resposta da API
   */
  async editar(id, pedido) {
    try {
      const response = await api.put(`/pedido/${id}`, pedido); // Inclui o ID na URL
      console.log('Resposta do backend (editar):', response.data);
      return response.data;
    } catch (error) {
      console.error('Erro ao editar pedido:', error.response ? error.response.data : error.message);
      throw new Error(error.response?.data?.mensagem || 'Erro ao editar pedido');
    }
  }

  /**
   * Exclui um pedido
   * @param {number|string} id - ID do pedido
   * @returns {Promise<Object>} - Resposta da API
   */
  async excluir(id) {
    try {
      const response = await api.delete(`/pedido/${id}`); // Inclui o ID na URL
      console.log('Resposta do backend (excluir):', response.data);
      return response.data;
    } catch (error) {
      console.error('Erro ao excluir pedido:', error.response ? error.response.data : error.message);
      throw new Error(error.response?.data?.mensagem || 'Erro ao excluir pedido');
    }
  }

  /**
   * Filtra pedidos com base em um termo de pesquisa
   * @param {string} termo - Termo de pesquisa
   * @returns {Promise<Array>} - Lista de pedidos filtrados
   */
  async filtrar(termo) {
    try {
      const response = await api.get(`/pedido?search=${encodeURIComponent(termo)}`);
      console.log('Resposta do backend (filtrar):', response.data);
      return response.data.listaPedidos; // Ajuste conforme a estrutura da resposta do backend
    } catch (error) {
      console.error('Erro ao buscar pedidos:', error.response ? error.response.data : error.message);
      throw new Error(error.response?.data?.mensagem || 'Erro ao buscar pedidos');
    }
  }
}

const pedidoService = new PedidoService();
export default pedidoService;
