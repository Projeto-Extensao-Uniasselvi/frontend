class Login {
  baseUrl = "https://publicacoes-api.onrender.com/api/v1";
  email = document.getElementById("email");
  password = document.getElementById("password");
  loginBtn = document.getElementById("loginButton");

  constructor() {
    this.loginBtn.addEventListener(
      "click", () => 
        this.login()
    );
  }

  async login() {
    const email = this.email.value;
    const password = this.password.value;
    axios
      .post(`${this.baseUrl}/login`, {
        email: email,
        senha: password,
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

new Login();
