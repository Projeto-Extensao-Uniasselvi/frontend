export default class LoginService {
  _baseUrl = "https://publicacoes-api.onrender.com/api/v1";
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
      .post(`${this._baseUrl}/login`, {
        email: email,
        senha: password,
      })
      .then((response) => {
        const token = response.data.token_de_acesso;
        sessionStorage.setItem("token", token);
        window.location.href = "./painel.html";
      })
      .catch((error) => {
        alert("Email ou senha inválidos!");
        console.error(error);
      });
  }

  // Para implementar no painel admin
  logout() {
    sessionStorage.removeItem("token");
    window.location.href = "./admin/login.html";
  }

};
