
import Pedido from '../Modelo/Pedido.js';
import conectar from './conexao.js';

export default class PedidoDAO {

  async gravar(pedido) {
    if (pedido instanceof Pedido) {
      const sql = 'INSERT INTO pedido (ped_descricao, ped_valorTotal, ped_dataPedido, cli_codigo) VALUES (?, ?, ?, ?)';
      const parametros = [pedido.descricao, pedido.valorTotal, pedido.dataPedido, pedido.cli_codigo];
      const conexao = await conectar();
      try {
        const [resultado] = await conexao.execute(sql, parametros);
        pedido.codigo = resultado.insertId;
      } catch (erro) {
        console.error('Erro ao gravar pedido:', erro.message);
        throw erro;
      } finally {
        await conexao.release();
      }
    } else {
      throw new Error('O objeto fornecido não é uma instância de Pedido.');
    }
  }

 
  async atualizar(pedido) {
    if (pedido instanceof Pedido) {
      const sql = 'UPDATE pedido SET ped_descricao = ?, ped_valorTotal = ?, ped_dataPedido = ?, cli_codigo = ? WHERE ped_codigo = ?';
      const parametros = [pedido.descricao, pedido.valorTotal, pedido.dataPedido, pedido.cli_codigo, pedido.codigo];
      const conexao = await conectar();
      try {
        const [resultado] = await conexao.execute(sql, parametros);
        if (resultado.affectedRows === 0) {
          throw new Error('Nenhum pedido foi atualizado. Verifique se o código está correto.');
        }
      } catch (erro) {
        console.error('Erro ao atualizar pedido:', erro.message);
        throw erro;
      } finally {
        await conexao.release();
      }
    } else {
      throw new Error('O objeto fornecido não é uma instância de Pedido.');
    }
  }

  
  async excluir(pedido) {
    if (pedido instanceof Pedido) {
      const sql = 'DELETE FROM pedido WHERE ped_codigo = ?';
      const parametros = [pedido.codigo];
      const conexao = await conectar();
      try {
        const [resultado] = await conexao.execute(sql, parametros);
        if (resultado.affectedRows === 0) {
          throw new Error('Nenhum pedido foi excluído. Verifique se o código está correto.');
        }
      } catch (erro) {
        console.error('Erro ao excluir pedido:', erro.message);
        throw erro;
      } finally {
        await conexao.release();
      }
    } else {
      throw new Error('O objeto fornecido não é uma instância de Pedido.');
    }
  }

 
  async consultar(termo) {
    const conexao = await conectar();
    let listaPedidos = [];
    try {
      let sqlConsulta = 'SELECT * FROM pedido';
      let parametrosConsulta = [];

      if (termo) {
        sqlConsulta += ' WHERE ped_descricao LIKE ?';
        parametrosConsulta.push(`%${termo}%`);
      }

      sqlConsulta += ' ORDER BY ped_descricao';

      const [registros] = await conexao.execute(sqlConsulta, parametrosConsulta);

      for (const registro of registros) {
        const pedido = new Pedido(
          registro.ped_codigo,
          registro.ped_descricao,
          registro.ped_valorTotal,
          registro.ped_dataPedido,
          registro.cli_codigo
        );
        listaPedidos.push(pedido);
      }
    } catch (erro) {
      console.error('Erro ao consultar pedidos:', erro.message);
      throw erro;
    } finally {
      await conexao.release();
    }
    return listaPedidos;
  }

  
  async consultarPorCodigo(codigo) {
    const conexao = await conectar();
    try {
      const sql = 'SELECT * FROM pedido WHERE ped_codigo = ?';
      const [registros] = await conexao.execute(sql, [codigo]);

      if (registros.length > 0) {
        const registro = registros[0];
        return new Pedido(
          registro.ped_codigo,
          registro.ped_descricao,
          registro.ped_valorTotal,
          registro.ped_dataPedido,
          registro.cli_codigo
        );
      } else {
        return null;
      }
    } catch (erro) {
      console.error('Erro ao consultar pedido por código:', erro.message);
      throw erro;
    } finally {
      await conexao.release();
    }
  }
}
