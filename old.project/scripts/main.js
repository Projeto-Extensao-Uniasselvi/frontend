import LoginService from "./services/login.js";

class Main {
  constructor () {
    this._loginService = new LoginService;
  }
}

new Main();