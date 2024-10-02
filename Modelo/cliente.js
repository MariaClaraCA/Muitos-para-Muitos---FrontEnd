import ClienteDAO from '../Persistencia/clienteDAO.js';
import conectar from '../Persistencia/conexao.js';
export default class Cliente {
    #codigo;
    #nome;

    constructor(codigo = 0, nome = '') {
        this.#codigo = codigo;
        this.#nome = nome;
    }

    get codigo() {
        return this.#codigo;
    }

    set codigo(novoCodigo) {
        this.#codigo = novoCodigo;
    }

    get nome() {
        return this.#nome;
    }

    set nome(novoNome) {
        this.#nome = novoNome;
    }

    toJSON() {
        return {
            codigo: this.#codigo,
            nome: this.#nome
        };
    }

    async gravar() {
        const clienteDAO = new ClienteDAO();
        await clienteDAO.gravar(this);
    }

    async atualizar() {
        const clienteDAO = new ClienteDAO();
        await clienteDAO.atualizar(this);
    }

    async excluir() {
        const clienteDAO = new ClienteDAO();
        await clienteDAO.excluir(this);
    }

    async consultar(termo) {
        const conexao = await conectar();
        let listaClientes = [];
        try {
          let sqlConsulta = 'SELECT * FROM cliente';
          let parametrosConsulta = [];
    
          if (termo) {
            sqlConsulta += ' WHERE cli_nome LIKE ? ORDER BY cli_nome';
            parametrosConsulta.push('%' + termo + '%');
          } else {
            sqlConsulta += ' ORDER BY cli_nome';
          }
    
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
