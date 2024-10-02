

import Produto from "../Modelo/produto.js";
import conectar from "./conexao.js";

export default class ProdutoDAO {
    async gravar(produto) {
        if (produto instanceof Produto) {
            const sql = `INSERT INTO produto (prod_descricao, prod_precoCusto, prod_precoVenda, prod_dataValidade, prod_qtdEstoque) 
                         VALUES (?, ?, ?, ?, ?)`;
            const parametros = [produto.descricao, produto.precoCusto, produto.precoVenda, produto.dataValidade, produto.qtdEstoque];
            const conexao = await conectar();
            try {
                const [result] = await conexao.execute(sql, parametros);
                produto.codigo = result.insertId; 
            } catch (erro) {
                console.error("Erro ao gravar produto:", erro.message);
                throw erro;
            } finally {
                await conexao.release();
            }
        }
    }

    



    async atualizar(produto) {
        if (produto instanceof Produto) {
            const sql = `UPDATE produto SET prod_descricao = ?, prod_precoCusto = ?, prod_precoVenda = ?, prod_dataValidade = ?, prod_qtdEstoque = ? WHERE prod_codigo = ?`;
            const parametros = [produto.descricao, produto.precoCusto, produto.precoVenda, produto.dataValidade, produto.qtdEstoque, produto.codigo];
            const conexao = await conectar();
            try {
                await conexao.execute(sql, parametros);
            } catch (erro) {
                console.error("Erro ao atualizar produto:", erro.message);
                throw erro;
            } finally {
                await conexao.release();
            }
        }
    }

    async excluir(produto) {
        if (produto instanceof Produto) {
            const sql = `DELETE FROM produto WHERE prod_codigo = ?`;
            const parametros = [produto.codigo];
            const conexao = await conectar();
            try {
                await conexao.execute(sql, parametros);
            } catch (erro) {
                console.error("Erro ao excluir produto:", erro.message);
                throw erro;
            } finally {
                await conexao.release();
            }
        }
    }

    async consultar(termo) {
        const conexao = await conectar();
        let listaProdutos = [];
        try {
            const sqlConsulta = isNaN(parseInt(termo)) ?
                `SELECT * FROM produto WHERE prod_descricao LIKE ? ORDER BY prod_descricao` :
                `SELECT * FROM produto WHERE prod_codigo = ? ORDER BY prod_descricao`;
            const parametrosConsulta = isNaN(parseInt(termo)) ? ['%' + termo + '%'] : [termo];

            const [registros] = await conexao.execute(sqlConsulta, parametrosConsulta);

            for (const registro of registros) {
                const produto = new Produto(
                    registro.prod_codigo,
                    registro.prod_descricao,
                    registro.prod_precoCusto,
                    registro.prod_precoVenda,
                    registro.prod_dataValidade,
                    registro.prod_qtdEstoque
                );
                listaProdutos.push(produto);
            }
        } catch (erro) {
            console.error("Erro ao consultar produtos:", erro.message);
            throw erro;
        } finally {
            await conexao.release();
        }
        return listaProdutos;
    }
}

