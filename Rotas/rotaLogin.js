
import express from 'express';
import jwt from 'jsonwebtoken';

const rotaLogin = express.Router();

rotaLogin.post('/', (req, res) => {
  const { usuario, senha } = req.body;

  if (usuario === 'admin' && senha === 'admin') {
    const token = jwt.sign({ usuario }, 'seu-segredo', { expiresIn: '1h' });
    res.json({ token });
  } else {
    res.status(401).json({ mensagem: 'Usuário ou senha inválidos' });
  }
});

export default rotaLogin;
