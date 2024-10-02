// src/services/ProdutoService.js
import api from './api';

/**
 * Serviço para gerenciar Produtos
 */
class ProdutoService {
  /**
   * Obtém todos os produtos
   * @returns {Promise<Array>} - Lista de produtos
   */
  async obterTodos() {
    try {
      const response = await api.get('/produto');
      console.log('Resposta do backend (obterTodos):', response.data);
      return response.data.listaProdutos; // Ajuste conforme a estrutura da resposta do backend
    } catch (error) {
      console.error('Erro ao buscar produtos:', error.response ? error.response.data : error.message);
      throw new Error(error.response?.data?.mensagem || 'Erro ao buscar produtos');
    }
  }

  /**
   * Cadastra um novo produto
   * @param {Object} produto - Dados do produto
   * @returns {Promise<Object>} - Resposta da API
   */
  async cadastrar(produto) {
    try {
      const response = await api.post('/produto', produto);
      console.log('Resposta do backend (cadastrar):', response.data);
      return response.data;
    } catch (error) {
      console.error('Erro ao cadastrar produto:', error.response ? error.response.data : error.message);
      throw new Error(error.response?.data?.mensagem || 'Erro ao cadastrar produto');
    }
  }

  /**
   * Edita um produto existente
   * @param {number|string} id - ID do produto
   * @param {Object} produto - Dados atualizados do produto
   * @returns {Promise<Object>} - Resposta da API
   */
  async editar(id, produto) {
    try {
      const response = await api.put(`/produto/${id}`, produto); // Atualizado para incluir o ID na URL
      console.log('Resposta do backend (editar):', response.data);
      return response.data;
    } catch (error) {
      console.error('Erro ao editar produto:', error.response ? error.response.data : error.message);
      throw new Error(error.response?.data?.mensagem || 'Erro ao editar produto');
    }
  }

  /**
   * Exclui um produto
   * @param {number|string} id - ID do produto
   * @returns {Promise<Object>} - Resposta da API
   */
  async excluir(id) {
    try {
      const response = await api.delete(`/produto/${id}`); // Atualizado para incluir o ID na URL
      console.log('Resposta do backend (excluir):', response.data);
      return response.data;
    } catch (error) {
      console.error('Erro ao excluir produto:', error.response ? error.response.data : error.message);
      throw new Error(error.response?.data?.mensagem || 'Erro ao excluir produto');
    }
  }

  /**
   * Filtra produtos com base em um termo de pesquisa
   * @param {string} termo - Termo de pesquisa
   * @returns {Promise<Array>} - Lista de produtos filtrados
   */
  async filtrar(termo) {
    try {
      const response = await api.get(`/produto?search=${encodeURIComponent(termo)}`);
      console.log('Resposta do backend (filtrar):', response.data);
      return response.data.listaProdutos; // Ajuste conforme a estrutura da resposta do backend
    } catch (error) {
      console.error('Erro ao buscar produtos:', error.response ? error.response.data : error.message);
      throw new Error(error.response?.data?.mensagem || 'Erro ao buscar produtos');
    }
  }
}

const produtoService = new ProdutoService();
export default produtoService;
