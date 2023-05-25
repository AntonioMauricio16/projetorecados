
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


let usuarios = [];


//esse e nosso midlaware que valida se tem id no array usuario para criar um recado //
function validaPeloId(request, response, next) {
  const usuarioId = request.params.id;
  const usuarioValidado = usuarios.find(usuario => usuario.id === Number(usuarioId));

  if (usuarioValidado) {
    next(); // Se o usuário for encontrado, chama o próximo middleware ou rota
  } else {
    response.status(404).send("Usuário não encontrado");
  }
}

//ele vai criar nosso usuario// utilizando metodo post //
  app.post('/usuarios',async (request,response)=>{
      let { nome,email,senha}= request.body;
      let validaUarioccdastrado = usuarios.find(user => user.email === email)
      if(validaUarioccdastrado){
          response.status(409).send("usuario ja existente")
      }else{
          let id = Math.floor(Math.random()*6767);
          let senhaCriptografada = await bcrypt.hash(senha, 10);
          let novoUsuario = {id, nome, email, senhaCriptografada, recado:[]};
          usuarios.push(novoUsuario);
          response.status(201).send("criado com sucesso");
      }
  });

//criando login // utilizando metodo post //
  app.post('/login', async (request, response) => {
    let { email, senha } = request.body;
    let emailVerificado = usuarios.find(user => user.email === email);
    
    if (!emailVerificado) {
      return response.status(401).send('Email ou senha inválidos');
    }
    
    let senhaComparada = await bcrypt.compare(senha, emailVerificado.senhaCriptografada);
    
    if (!senhaComparada) {
      return response.status(401).send('Email ou senha inválidos');
    }else{ 
      response.status(202).json(emailVerificado.id);
     
    }
  });

//vamos ler quem ta dentro do array // utilizando metodo get //
  app.get('/usuarios', (request,response)=>{
    response.status(202).json(usuarios);
  })

//criamos os recados no array de usuarios// utilizando metodo post //
  app.post("/usuarios/:id/recado",validaPeloId, (request,response)=>{
      const novoRecado = request.body;
      let recadoCriado = {
          id: Math.floor(Math.random()*1425),
          titulo: novoRecado.titulo,
          descricao: novoRecado.descricao
      };
      const id = request.params.id;

      let IdParaRecado = usuarios.findIndex(usuario=> usuario.id === Number(id));

      usuarios[IdParaRecado].recado.push(recadoCriado);

    return response.status(201).send("Recado criado com sucesso")
  });
// vou listar so o recado do usuario selecionado

app.get("/usuarios/:id/recado", (req, res) => {
  const usuarioId = parseInt(req.params.id);

  const usuario = usuarios.find((user) => user.id === usuarioId);

  if (!usuario) {
    return res.status(404).json("Usuário não encontrado.");
  }

  const page = req.query.page || 1;
  const pages = Math.ceil(usuario.recado?.length / 3);
  const indice = (page - 1) * 3;
  const aux = [...usuario.recado]; // spread operator
  const result = aux.splice(indice, 3);

  return res
    .status(201)
    .json({ total: usuario.recado.length, recados: result, pages });
});


//vamos alterar o recado do usuario // utilizando metodo o put //
  app.put('/usuarios/:id/recado/:recadoId',validaPeloId,(req, res) => {
      const usuarioId = req.params.id; // obtém o ID do usuário a partir da URL
      const recadoId = req.params.recadoId; // obtém o ID do recado a partir da URL
    
      // Encontra o usuário pelo ID
      const usuario = usuarios.find(user => user.id === Number(usuarioId));

      // Encontra o recado pelo ID
      
      const recado = usuario.recado.find(recado => recado.id === Number(recadoId));
    
      
      if (!recado ) {
        return res.status(404).send('Recado não encontrado');
      }
    
      if (usuario === undefined && recado === recado) {
        return res.status(404).send('Usuario não encontrado');
      }
    
      // Atualiza o recado
      recado.titulo = req.body.titulo;
      recado.descricao = req.body.descricao;
    
      res.status(200).send('Recado atualizado com sucesso');
    });

// excluindo o recado por ID // utilizando metodo delete //
  app.delete('/usuarios/:id/recado/:idRecado', (request, response)=>{
    const id = Number(request.params.id);
    const idRecado = Number(request.params.idRecado);
    const indexDoUsuario = usuarios.findIndex(usuario => usuario.id === id);

    //verifica se tem o id no array usuarios
        if (indexDoUsuario < 0) {
        response.status(404).send("Usuário não encontrado.");
        return;
        }

    //pega o index do array usuarios
    const indexDoRecado = usuarios[indexDoUsuario].recado.findIndex(recado => recado.id === idRecado);

    // verifica se tem o id no array recado
        if (indexDoRecado < 0) {
        response.status(404).send("Recado não encontrado.");
        return;
        }

    //pega o id do array recado no array usuarios e exclui    
    usuarios[indexDoUsuario].recado.splice(indexDoRecado, 1);
    response.status(202).send("Recado excluído com sucesso.");
  });
  
  app.listen(1425, ()=>{
      console.log("servidor rodando")
  });
