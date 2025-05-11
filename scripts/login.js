class Login {
  urlBase = "https://publicacoes-api.onrender.com/api/v1";
  email = document.getElementById("email");
  senha = document.getElementById("password");
  btnLogin = document.getElementById("loginButton");

  constructor(){
    this.btnLogin.addEventListener(
      "click", () =>
        this.login()
    );
  }

  async login() {
    const email = this.email.value;
    const senha = this.senha.value;
    axios
      .post(`${this.urlBase}/login`, {
        email: email,
        senha: senha,
      })
      .then((response) => {
        const token = response.data.token_de_acesso;
        localStorage.setItem("token", token);
        window.location.href = "./painel-administrativo.html";
      })
      .catch((error) => {
        alert("Email ou senha inválidos!");
        console.error(error);
      });
  }
}

new Login;
