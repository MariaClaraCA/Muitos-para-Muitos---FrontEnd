import ProdutoDAO from "../Persistencia/produtoDAO.js";

export default class Produto {
    #codigo;
    #descricao;
    #precoCusto;
    #precoVenda;
    #dataValidade;
    #qtdEstoque;

    constructor(codigo = 0, descricao = '', precoCusto = 0.0, precoVenda = 0.0, dataValidade = '', qtdEstoque = 0) {
        this.#codigo = codigo;
        this.#descricao = descricao;
        this.#precoCusto = precoCusto;
        this.#precoVenda = precoVenda;
        this.#dataValidade = dataValidade;
        this.#qtdEstoque = qtdEstoque;
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

    get precoCusto() {
        return this.#precoCusto;
    }

    set precoCusto(novoPrecoCusto) {
        this.#precoCusto = novoPrecoCusto;
    }

    get precoVenda() {
        return this.#precoVenda;
    }

    set precoVenda(novoPrecoVenda) {
        this.#precoVenda = novoPrecoVenda;
    }

    get dataValidade() {
        return this.#dataValidade;
    }

    set dataValidade(novaDataValidade) {
        this.#dataValidade = novaDataValidade;
    }

    get qtdEstoque() {
        return this.#qtdEstoque;
    }

    set qtdEstoque(novaQtdEstoque) {
        this.#qtdEstoque = novaQtdEstoque;
    }

    toJSON() {
        return {
            codigo: this.#codigo,
            descricao: this.#descricao,
            precoCusto: this.#precoCusto,
            precoVenda: this.#precoVenda,
            dataValidade: this.#dataValidade,
            qtdEstoque: this.#qtdEstoque
        };
    }

    async gravar() {
        const produtoDAO = new ProdutoDAO();
        await produtoDAO.gravar(this);
    }

    async atualizar() {
        const produtoDAO = new ProdutoDAO();
        await produtoDAO.atualizar(this);
    }

    async excluir() {
        const produtoDAO = new ProdutoDAO();
        await produtoDAO.excluir(this);
    }

    async consultar(termo) {
        const produtoDAO = new ProdutoDAO();
        return await produtoDAO.consultar(termo);
    }
}
