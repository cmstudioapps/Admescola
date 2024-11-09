const data = new Date

let dia = data.getDate()
let mes = data.getMonth() + 1
let ano = data.getFullYear()
let hora = data.getHours()
let minuto = data.getMinutes()
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDWDe3o7EB5vUfAZ1dNzj7nLZ4Ieh0m6Lg",
  authDomain: "escola-97256.firebaseapp.com",
  databaseURL: "https://escola-97256-default-rtdb.firebaseio.com",
  projectId: "escola-97256",
  storageBucket: "escola-97256.appspot.com",
  messagingSenderId: "765009682973",
  appId: "1:765009682973:web:d245f17dcdde0a28959cf4"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

function enviar() {
  const email = document.getElementById('email').value;
  const senha = document.getElementById('senha').value;

  // Autenticação do usuário
  firebase.auth().signInWithEmailAndPassword(email, senha)
    .then(userCredential => {
      return userCredential.user.getIdToken(); // Obtém o token de autenticação
    })
    .then(idToken => {
      
      if(confirm("Tem certeza?")) {
      enviarDados(idToken); // Chama a função para enviar os dados
      }
    })
    .catch(error => {
      console.error("Erro de autenticação:", error);
      alert("Você não tem acesso a este recurso, ou sua senha e e-mail de acesso estão erradas.")
    });
}

function enviarDados(idToken) {
  const imagem = document.getElementById('imagem').files[0];
  const legenda = document.getElementById('legenda').value;
  const link = document.getElementById('link').value;

  // Upload da imagem ao Firebase Storage
  const storageRef = firebase.storage().ref('imagens/' + imagem.name);
  storageRef.put(imagem)
    .then(snapshot => {
      return snapshot.ref.getDownloadURL(); // Obtém a URL da imagem
    })
    .then(urlImagem => {
      // Dados a serem enviados ao Firebase Realtime Database
      let posterID = Math.floor(Math.random() * 3000) + 1;
      const url = 'https://escola-97256-default-rtdb.firebaseio.com/postes/' + posterID + '/.json';
      const dados = {
        IMG: urlImagem, // URL da imagem
        LG: legenda,
        Link: link,
        Dia: dia,
        Mes: mes,
        Ano: ano,
        Hora: hora,
        Minuto: minuto
      };

      return fetch(url, {
        method: 'PATCH',

        body: JSON.stringify(dados)
      });
    })
    .then(response => response.json())
    .then(data => {
      console.log("Dados enviados com sucesso:", data);
      alert("A postagem foi enviada com sucesso e está disponível para todos os alunos.")
    })
    .catch(error => {
      console.error("Erro ao enviar dados:", error);
      alert("erro ao enviar a postagem")
    });
}