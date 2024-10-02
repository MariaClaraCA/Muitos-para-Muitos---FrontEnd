
import express from 'express';
import cors from 'cors';
import rotaLogin from './Rotas/rotaLogin.js'; 
import rotaCliente from './Rotas/rotaCliente.js'; 
import rotaProduto from './Rotas/rotaProduto.js';
import rotaPedido from './Rotas/rotaPedido.js';
import rotaPedidoProduto from './Rotas/rotaPedidoProduto.js';

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.use('/login', rotaLogin); 


app.use('/cliente', rotaCliente); 
app.use('/produto', rotaProduto);
app.use('/pedido', rotaPedido);
app.use('/pedidoproduto', rotaPedidoProduto);


const porta = 3000;
app.listen(porta, () => {
    console.log(`Servidor escutando na porta ${porta}.`);
});
