
import PedidoDAO from '../Persistencia/PedidoDAO.js';
import conectar from '../Persistencia/conexao.js';

export default class Pedido {
    #codigo;
    #descricao;
    #valorTotal;
    #dataPedido;
    #cli_codigo;

    constructor(codigo = 0, descricao = '', valorTotal = 0, dataPedido = null, cli_codigo = 0) {
        this.#codigo = codigo;
        this.#descricao = descricao;
        this.#valorTotal = valorTotal;
        this.#dataPedido = dataPedido;
        this.#cli_codigo = cli_codigo;
    }

    
    get codigo() {
        return this.#codigo;
    }

    set codigo(novoCodigo) {
        this.#codigo = novoCodigo;
    }

    get descricao() {
        return this.#descricao;
    }

    set descricao(novaDescricao) {
        this.#descricao = novaDescricao;
    }

    get valorTotal() {
        return this.#valorTotal;
    }

    set valorTotal(novoValorTotal) {
        this.#valorTotal = novoValorTotal;
    }

    get dataPedido() {
        return this.#dataPedido;
    }

    set dataPedido(novaDataPedido) {
        this.#dataPedido = novaDataPedido;
    }

    get cli_codigo() {
        return this.#cli_codigo;
    }

    set cli_codigo(novoCliCodigo) {
        this.#cli_codigo = novoCliCodigo;
    }

    
    toJSON() {
        return {
            codigo: this.#codigo,
            descricao: this.#descricao,
            valorTotal: this.#valorTotal,
            dataPedido: this.#dataPedido,
            cli_codigo: this.#cli_codigo
        };
    }

   
    async gravar() {
        const pedidoDAO = new PedidoDAO();
        await pedidoDAO.gravar(this);
    }

    async atualizar() {
        const pedidoDAO = new PedidoDAO();
        await pedidoDAO.atualizar(this);
    }

    async excluir() {
        const pedidoDAO = new PedidoDAO();
        await pedidoDAO.excluir(this);
    }

    
    async consultar(termo) {
        const conexao = await conectar();
        let listaPedidos = [];
        try {
            let sqlConsulta = 'SELECT * FROM pedido';
            let parametrosConsulta = [];

            if (termo) {
                sqlConsulta += ' WHERE ped_descricao LIKE ? ORDER BY ped_descricao';
                parametrosConsulta.push('%' + termo + '%');
            } else {
                sqlConsulta += ' ORDER BY ped_descricao';
            }

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
