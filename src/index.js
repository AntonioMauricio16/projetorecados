import express from 'express';
import bcrypt, { hash } from "bcrypt";
const app = express();
app.use(express.json());

app.get('/', (request, response) => {
return response.json('OK');

});

app.listen(8080, () => console.log('Servidor iniciado'));

//lista de usuarios
let users = [];

app.get(`/user`, (request, response) => {
  return response.json(users);
});
//criação de usuario
app.post(`/user`, (request, response) => {
  const user = request.body;
  const saltRounds = 10;
    
  bcrypt.hash(user.senha, saltRounds, function(err, hash) {
    if(hash){
        users.push({
            id: Math.floor(Math.random()*67676),
            nome: user.nome,
            email: user.email,
            senha: hash
        }); 
        const dados = request.body;
const novoUsuario = {
  id: Math.floor(Math.random()*67676),
  nome: dados.nome,
  email: dados.email,
  senha: dados.email,
};
const existe = users.some((users) => users.email === novoUsuario.email );
if (existe) {
  return response.status(400).json({
    sucesso: false,
    dados: null,
    mensagem: "Outro usuário já está cadastrado com este e-mail.",
  });
}
users.push({
  id: Math.floor(Math.random() * 67676),
  nome: user.nome,
  email: user.email,
 senha: hash
});

if (
  !user.email ||
  !user.email.includes("@") ||
  !user.email.includes(".com")
) {
  return response.status(400).json({
    sucesso: false,
    dados: null,
    mensagem:
      "É obrigatório informar um e-mail válido para cadastro do usuário",
  });
}

return response.status(201).json();
       
    } else {
        return response.status(400).json("Ocorreu um erro:" + err)
    }
  });
});


