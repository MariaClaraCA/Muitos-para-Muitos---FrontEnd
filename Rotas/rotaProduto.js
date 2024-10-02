

import { Router } from "express";
import ProdutoCtrl from "../Controle/produtoCtrl.js";

const produtoCtrl = new ProdutoCtrl();
const rotaProduto = new Router();

rotaProduto
    .get('/', produtoCtrl.consultar)
    .get('/:termo', produtoCtrl.consultar)
    .post('/', produtoCtrl.gravar)
    .put('/', produtoCtrl.atualizar)
    .delete('/', produtoCtrl.excluir);

export default rotaProduto;
