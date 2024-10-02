import Cliente from '../Modelo/Cliente.js';
import conectar from './conexao.js';

export default class ClienteDAO {
  async gravar(cliente) {
    if (cliente instanceof Cliente) {
      const sql = 'INSERT INTO cliente(cli_nome) VALUES(?)';
      const parametros = [cliente.nome];
      const conexao = await conectar();
      try {
        const [resultado] = await conexao.execute(sql, parametros);
        cliente.codigo = resultado.insertId;
      } catch (erro) {
        console.error('Erro ao gravar cliente:', erro.message);
        throw erro;
      } finally {
        await conexao.release();
      }
    }
  }

  async atualizar(cliente) {
    if (cliente instanceof Cliente) {
      const sql = 'UPDATE cliente SET cli_nome = ? WHERE cli_codigo = ?';
      const parametros = [cliente.nome, cliente.codigo];
      const conexao = await conectar();
      try {
        await conexao.execute(sql, parametros);
      } catch (erro) {
        console.error('Erro ao atualizar cliente:', erro.message);
        throw erro;
      } finally {
        await conexao.release();
      }
    }
  }

  async excluir(cliente) {
    if (cliente instanceof Cliente) {
      const sql = 'DELETE FROM cliente WHERE cli_codigo = ?';
      const parametros = [cliente.codigo];
      const conexao = await conectar();
      try {
        await conexao.execute(sql, parametros);
      } catch (erro) {
        console.error('Erro ao excluir cliente:', erro.message);
        throw erro;
      } finally {
        await conexao.release();
      }
    }
  }

  async consultar(termo) {
    const conexao = await conectar();
    let listaClientes = [];
    try {
      let sqlConsulta = 'SELECT * FROM cliente';
      let parametrosConsulta = [];

      if (termo) {
        sqlConsulta += ' WHERE cli_nome LIKE ?';
        parametrosConsulta.push('%' + termo + '%');
      }

      sqlConsulta += ' ORDER BY cli_nome';

      const [registros] = await conexao.execute(sqlConsulta, parametrosConsulta);

      for (const registro of registros) {
        const cliente = new Cliente(registro.cli_codigo, registro.cli_nome);
        listaClientes.push(cliente);
      }
    } catch (erro) {
      console.error('Erro ao consultar clientes:', erro.message);
      throw erro;
    } finally {
      await conexao.release();
    }
    return listaClientes;
  }

  async consultarPorCodigo(codigo) {
    const conexao = await conectar();
    try {
      const sql = 'SELECT * FROM cliente WHERE cli_codigo = ?';
      const [registros] = await conexao.execute(sql, [codigo]);

      if (registros.length > 0) {
        const registro = registros[0];
        return new Cliente(registro.cli_codigo, registro.cli_nome);
      } else {
        return null;
      }
    } catch (erro) {
      console.error('Erro ao consultar cliente por código:', erro.message);
      throw erro;
    } finally {
      await conexao.release();
    }
  }
}
