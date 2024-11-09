
function enviar() {

  // Obtenha o valor do email
const email = document.getElementById('email').value;

// Obtenha o valor da senha
const senha = document.getElementById('senha').value;


firebase.auth().signInWithEmailAndPassword(email, senha)
  .then(userCredential => {
    return userCredential.user.getIdToken(); // Obtém o token de autenticação
  })
  .then(idToken => {
    // Chame a função enviarDados aqui passando o idToken
    
    if(confirm("Tem certeza que quer continuar?")) {
    enviarDados(idToken);
    }
  })
  .catch(error => {
    console.error("Erro de autenticação:", error);
    alert("Tivemos um problema, talvez você não tem acesso a este recurso, por favor verifique se o e-mail e a senha estão corretos.")
  });
  
}

function enviarDados(idToken) {
  


// Obtenha o arquivo de imagem
const imagem = document.getElementById('imagem').files[0];

// Obtenha o valor da legenda
const legenda = document.getElementById('legenda').value;

// Obtenha o valor do link
const link = document.getElementById('link').value;
  
  
  
  
  let posterID = Math.fl(Math.random()*3000)+1
  const url = 'https://escola-97256-default-rtdb.firebaseio.com/postes/'+posterID+'.json';
  const dados = {
    IMG: imagem,
    LG: legenda,
    Link: link
  };

  fetch(url, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + idToken
    },
    body: JSON.stringify(dados)
  })
  .then(response => response.json())
  .then(data => {
    console.log("Dados enviados com sucesso:", data);
    alert("A postagem foi enviada, todos os alunos poderão ver agora.")
  })
  .catch(error => {
    console.error("Erro ao enviar dados:", error);
  });
}