
document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("lista-postagens");

  try {
    const response = await axios.get("http://localhost:3000/api/v1/publicacoes");
    const postagens = response.data;

    if (!Array.isArray(postagens) || postagens.length === 0) {
      container.innerHTML = "<p class='text-gray-600'>Nenhuma postagem encontrada.</p>";
      return;
    }

    container.innerHTML = "";

    postagens.forEach((post) => {
      const postHTML = `
        <article class="mb-8 border-b pb-4">
          <h2 class="text-2xl font-bold mb-2">${post.titulo}</h2>
          <div class="text-gray-700">${post.conteudo}</div>
        </article>
      `;
      container.innerHTML += postHTML;
    });
  } catch (error) {
    console.error("Erro ao carregar postagens:", error);
    container.innerHTML = "<p class='text-red-600'>Erro ao carregar postagens.</p>";
  }
});
