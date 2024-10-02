import jwt from 'jsonwebtoken';


export default class LoginCtrl {
    async login(req, res) {
        const { username, password } = req.body;

        
        if (username === 'admin' && password === 'senha123') {
           
            const token = jwt.sign({ username }, 'secreta123', { expiresIn: '1h' });
            res.json({ status: true, token });
        } else {
            res.status(401).json({ status: false, mensagem: 'Usuário ou senha inválidos.' });
        }
    }
}
