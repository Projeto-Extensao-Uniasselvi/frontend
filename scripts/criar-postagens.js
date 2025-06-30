

document.addEventListener("DOMContentLoaded", () => {
  const botaoPostar = document.getElementById("postar");

  botaoPostar.addEventListener("click", async () => {
    const titulo = document.getElementById("titulo").value;
    const conteudo = document.getElementById("conteudo").innerHTML; 

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Você precisa estar logado.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/v1/publicacoes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ titulo, conteudo })
      });

      if (response.ok) {
        alert("Postagem criada com sucesso!");
        document.getElementById("titulo").value = "";
        document.getElementById("conteudo").innerHTML = "";
      } else {
        const data = await response.json();
        console.error("Erro na API:", data);
        alert("Erro ao criar postagem.");
      }
    } catch (error) {
      console.error("Erro de rede:", error);
      alert("Não foi possível conectar com o servidor.");
    }
  });
});
