
import api from './api';

class ClienteService {
  async obterTodos() {
    try {
      const response = await api.get('/cliente');
      console.log('Resposta do backend:', response.data);
      return response.data.listaClientes; 
    } catch (error) {
      console.error(error);
      throw new Error('Erro ao buscar clientes');
    }
  }

  async cadastrar(cliente) {
    try {
      const response = await api.post('/cliente', cliente);
      return response.data;
    } catch (error) {
      console.error(error);
      throw new Error('Erro ao cadastrar cliente');
    }
  }

  async editar(id, cliente) {
    try {
      const response = await api.put(`/cliente/${id}`, cliente);
      return response.data;
    } catch (error) {
      console.error(error);
      throw new Error('Erro ao editar cliente');
    }
  }

  async excluir(id) {
    try {
      const response = await api.delete(`/cliente/${id}`);
      return response.data;
    } catch (error) {
      console.error(error);
      throw new Error('Erro ao excluir cliente');
    }
  }

  async filtrar(termo) {
    try {
      const response = await api.get(`/cliente?search=${encodeURIComponent(termo)}`);
      return response.data.listaClientes; 
    } catch (error) {
      console.error(error);
      throw new Error('Erro ao buscar clientes');
    }
  }
}

const clienteService = new ClienteService();
export default clienteService;
