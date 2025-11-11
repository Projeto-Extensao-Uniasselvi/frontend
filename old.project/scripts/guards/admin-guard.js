async function adminGuard() {
  const baseUrl = "https://publicacoes-api.onrender.com/api/v1";
  const token = sessionStorage.getItem("token");

  if (!token) window.location.href = "/admin/login.html";

  try {
    const params = { "limite": 1 };
    const headers = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    };

    const response = await axios.get(`${baseUrl}/usuarios`, { headers, params });
    const usuarios = response.data.usuarios;
    if(!usuarios) throw new Error("Falha ao autenticar usuário");
  } catch (err) {
    console.error("Falha ao validar token", err);
    sessionStorage.removeItem("token");
    window.location.href = "/admin/login.html";
  }

}

adminGuard()