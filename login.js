import jwt from 'jsonwebtoken';

export const login = (req, res) => {
    const { username, password } = req.body;

    console.log('Dados recebidos no login:', { username, password });
    
    if (username === 'admin' && password === 'senha123') {
        const token = jwt.sign({ username }, 'secreta123', { expiresIn: '1h' });
        res.json({ status: true, token });
    } else {
        res.status(401).json({ status: false, mensagem: 'Usuário ou senha inválidos.' });
    }
};
