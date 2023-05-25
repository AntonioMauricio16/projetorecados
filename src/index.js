import  express, { request } from "express";
import cors from "cors";

const app = express();
const bcrypt = require('bcrypt');
app.use(express.json());
app.use(cors());
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

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
  const existe = users.some((users) => users.email === user.email );
  if (existe) {
    return response.status(400).json({
      sucesso: false,
      dados: null,
      mensagem: "Outro usuário já está cadastrado com este e-mail.",
    });
    
  }
  
  bcrypt.hash(user.senha, saltRounds, function(err, hash) {
    if(hash){
        users.push({
            id: Math.floor(Math.random()*67676),
            nome: user.nome,
            email: user.email,
            senha: hash
        }); 
      }  

  });
  return response.status(400).json({
    sucesso: false,
    dados: null,
    mensagem: " Usuário  cadastrado!.",
  });

});
//criação d login

app.post(`/login`, (request, response) => {
    const dadosDoUsuario = request.body;
  
    const emailCorreto = users.some(
      (user) => user.email === dadosDoUsuario.email
    );
  
    const senhaCorreta = users.some(
      (user) => user.password === dadosDoUsuario.password
    );
  
    if (!emailCorreto || !senhaCorreta) {
      return response.status(400).json({
        success: false,
        message: `Email ou senha estão incorretos`,
        data: {},
      });
    }
  
    users.forEach((usuario) => (usuario.logado = false));
  
    const user = users.find((user) => user.email === dadosDoUsuario.email);
  
    user.logado = true;
  
    return response.json({
      success: true,
      message: `Usuário logado com sucesso`,
      data: {},
    });
  });
  
// criação de recados
const listaRecados = [];

app.get(`/list`, (request, response) => {
  return response.json(listaRecados);
});

app.post(`/recados`, (request, response) => {
  const dados = request.body;

  const usuario = users.find((user) => user.logado === true);

  if (!usuario) {
    return response.status(400).json({
      success: false,
      message: `Necessario fazer login para criar um post`,
      data: {},
    });
  }

  //Fazer validacao dos dados do recado

  const novoRecado = {
    id: new Date().getTime(),
    titulo: dados.titulo,
    descricao: dados.descricao,
    autor: usuario,
  };

  listaRecados.push(novoRecado);
  return response.status(201).json({
    success: true,
    message: `Recado criado com sucesso`,
    data: novoRecado,
  });
});

/*Atualizacao dos recados*/
app.get(`/atualizar/:idR`, (request, response) => {
  return response.json(recadoAtualizado);
});
const recadoAtualizado = [];
app.put('/atualizar/:idR', (request, response) => {
    
  
    const { id } = request.params; 
    const { titulo, descricao } = request.body 
    const userIndex = recadoAtualizado.findIndex(user => user.id === id);
  
  
    if(userIndex > 0){
        return response.status(400).json({ error: 'User not found'});
    }
  
    const user = {
        id,
        titulo,
        descricao,
        
    };
  recadoAtualizado[userIndex] = user;
  recadoAtualizado.push(user);
      
  return response.json(user);
  });

  //deletar recados
app.delete(`/recados/:id`, (request, response) => {
    const params = request.params;
  
    const recadoExiste = listaRecados.findIndex(
      (recado) => recado.id === params.id
    );
  
    if (recadoExiste > 0) {
      return response.status(400).json(`Recado nao encontrado`);
    }
  
    listaRecados.splice(recadoExiste, 1);
  
    return response.json(`Recado deletado`);
  });
