// dao/PedidoProdutoDAO.js
import conectar from './conexao.js';

export default class PedidoProdutoDAO {
  /**
   * Associa um produto a um pedido no banco de dados
   * @param {Object} pedidoProduto - Objeto contendo pedido_id, produto_id e quantidade
   */
  async associarProduto(pedidoProduto) {
    const { pedido_id, produto_id, quantidade } = pedidoProduto;
    const sql = `INSERT INTO pedido_produto (pedido_id, produto_id, quantidade) 
                 VALUES (?, ?, ?);`; // Query entre backticks
    const parametros = [pedido_id, produto_id, quantidade];
    const conexao = await conectar();
    try {
      await conexao.execute(sql, parametros);
      console.log(`Produto ${produto_id} associado ao pedido ${pedido_id} com quantidade ${quantidade}.`);
    } catch (erro) {
      console.error("Erro ao associar produto ao pedido:", erro.message);
      throw erro;
    } finally {
      await conexao.release();
    }
  }

  /**
   * Associa múltiplos produtos a múltiplos pedidos em lote
   * @param {Array} associacoes - Array de objetos contendo pedido_id, produto_id e quantidade
   */
  async associarProdutosEmLote(associacoes) {
    const conexao = await conectar();
    const sql = `INSERT INTO pedido_produto (pedido_id, produto_id, quantidade) 
                 VALUES (?, ?, ?);`; // Query entre backticks
    try {
      // Iniciar uma transação
      await conexao.beginTransaction();
      console.log('Iniciando transação para associar produtos em lote.');

      for (const associacao of associacoes) {
        const { pedido_id, produto_id, quantidade } = associacao;
        const parametros = [pedido_id, produto_id, quantidade];
        await conexao.execute(sql, parametros);
        console.log(`Produto ${produto_id} associado ao pedido ${pedido_id} com quantidade ${quantidade}.`);
      }

      // Commit da transação
      await conexao.commit();
      console.log('Transação concluída com sucesso.');
    } catch (erro) {
      // Rollback em caso de erro
      await conexao.rollback();
      console.error("Erro ao associar produtos em lote:", erro.message);
      throw erro;
    } finally {
      await conexao.release();
    }
  }

  /**
   * Atualiza a quantidade de um produto em um pedido
   * @param {number|string} pedidoId - ID do pedido
   * @param {number|string} produtoId - ID do produto
   * @param {number} quantidade - Nova quantidade
   */
  async atualizarQuantidade(pedidoId, produtoId, quantidade) {
    const sql = `UPDATE pedido_produto 
                 SET quantidade = ? 
                 WHERE pedido_id = ? AND produto_id = ?;`; // Query entre backticks
    const parametros = [quantidade, pedidoId, produtoId];
    const conexao = await conectar();
    try {
      const [resultado] = await conexao.execute(sql, parametros);
      if (resultado.affectedRows === 0) {
        throw new Error('Nenhuma associação encontrada para atualizar.');
      }
      console.log(`Quantidade atualizada para ${quantidade} no pedido ${pedidoId} e produto ${produtoId}.`);
    } catch (erro) {
      console.error("Erro ao atualizar quantidade do produto no pedido:", erro.message);
      throw erro;
    } finally {
      await conexao.release();
    }
  }

  /**
   * Remove a associação de um produto a um pedido
   * @param {number|string} pedidoId - ID do pedido
   * @param {number|string} produtoId - ID do produto
   */
  async removerAssociacao(pedidoId, produtoId) {
    const sql = `DELETE FROM pedido_produto 
                 WHERE pedido_id = ? AND produto_id = ?;`; // Query entre backticks
    const parametros = [pedidoId, produtoId];
    const conexao = await conectar();
    try {
      const [resultado] = await conexao.execute(sql, parametros);
      if (resultado.affectedRows === 0) {
        throw new Error('Nenhuma associação encontrada para remover.');
      }
      console.log(`Produto ${produtoId} removido do pedido ${pedidoId}.`);
    } catch (erro) {
      console.error("Erro ao remover associação de produto ao pedido:", erro.message);
      throw erro;
    } finally {
      await conexao.release();
    }
  }

  /**
   * Consulta todos os produtos associados a um pedido específico
   * @param {number|string} pedidoId - ID do pedido
   * @returns {Promise<Array>} - Lista de produtos associados
   */
  async consultarProdutosPorPedido(pedidoId) {
    const sql = `SELECT pp.pedido_id, pp.produto_id, pp.quantidade, p.ped_descricao, pr.prod_descricao 
                 FROM pedido_produto pp
                 JOIN pedido p ON pp.pedido_id = p.ped_codigo
                 JOIN produto pr ON pp.produto_id = pr.prod_codigo
                 WHERE pp.pedido_id = ?;`; // Query entre backticks
    const parametros = [pedidoId];
    const conexao = await conectar();
    try {
      const [registros] = await conexao.execute(sql, parametros);
      console.log(`Produtos associados ao pedido ${pedidoId}:`, registros);
      return registros; // Retorna os registros com os detalhes da associação entre pedidos e produtos
    } catch (erro) {
      console.error("Erro ao consultar produtos do pedido:", erro.message);
      throw erro;
    } finally {
      await conexao.release();
    }
  }
}
