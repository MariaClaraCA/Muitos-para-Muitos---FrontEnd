

import Produto from "../Modelo/produto.js";

export default class ProdutoCtrl {
    async gravar(requisicao, resposta) {
        const dados = requisicao.body;
        const produto = new Produto(0, dados.descricao, dados.precoCusto, dados.precoVenda, dados.dataValidade, dados.qtdEstoque);
        try {
            await produto.gravar();
            resposta.json({ status: true, mensagem: "Produto incluído com sucesso!" });
        } catch (erro) {
            resposta.status(500).json({ status: false, mensagem: "Erro ao registrar o produto: " + erro.message });
        }
    }

    async atualizar(requisicao, resposta) {
        const dados = requisicao.body;
        const produto = new Produto(dados.codigo, dados.descricao, dados.precoCusto, dados.precoVenda, dados.dataValidade, dados.qtdEstoque);
        try {
            await produto.atualizar();
            resposta.json({ status: true, mensagem: "Produto atualizado com sucesso!" });
        } catch (erro) {
            resposta.status(500).json({ status: false, mensagem: "Erro ao atualizar o produto: " + erro.message });
        }
    }

    async excluir(requisicao, resposta) {
        const dados = requisicao.body;
        const produto = new Produto(dados.codigo);
        try {
            await produto.excluir();
            resposta.json({ status: true, mensagem: "Produto excluído com sucesso!" });
        } catch (erro) {
            resposta.status(500).json({ status: false, mensagem: "Erro ao excluir o produto: " + erro.message });
        }
    }

    async consultar(requisicao, resposta) {
        const termo = requisicao.params.termo || '';
        const produto = new Produto();
        try {
            const listaProdutos = await produto.consultar(termo);
            resposta.json({ status: true, listaProdutos });
        } catch (erro) {
            resposta.status(500).json({ status: false, mensagem: "Erro ao consultar produtos: " + erro.message });
        }
    }
}
