
let paragrafos = [];
  let contador = 0;

  function addParagraph() {
    contador++;
    const id = `p${contador}`;

    // Adiciona ao array
    paragrafos.push({ id, texto: '', imagem: null, imagemAntes: false });

    // Cria elemento HTML
    const div = document.createElement('div');
    div.className = "paragrafo border border-gray-300 rounded p-4 relative";
    div.setAttribute('data-id', id);
    console.log(div);
    div.innerHTML = `
      <textarea class="texto w-full border p-2 mb-4" placeholder="Digite o parágrafo..."></textarea>
      <input type="file" class="imagem mb-3" accept="image/*">
      <label class="flex items-center gap-2 text-sm text-gray-700">
        <input type="checkbox" class="antes"> Imagem antes do parágrafo
      </label>
      <div class="flex justify-end mt-2">
        <button type="button" class="bg-red-600 text-white px-3 py-1 rounded remover">Remover</button>
      </div>
    `;

    // Eventos para atualizar o array
    div.querySelector('.texto').addEventListener('input', (e) => {
      const item = paragrafos.find(p => p.id === id);
      item.texto = e.target.value;
    });

    div.querySelector('.imagem').addEventListener('change', (e) => {
      const item = paragrafos.find(p => p.id === id);
      item.imagem = e.target.files[0] || null;
    });

    div.querySelector('.antes').addEventListener('change', (e) => {
      const item = paragrafos.find(p => p.id === id);
      item.imagemAntes = e.target.checked;
    });

    div.querySelector('.remover').addEventListener('click', () => {
      paragrafos = paragrafos.filter(p => p.id !== id);
      div.remove();
    });

    document.getElementById('paragrafosContainer').appendChild(div);
  }

  // Exemplo: pegar JSON dos parágrafos no submit
  document.getElementById('postForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    console.log(paragrafos);
    // aqui vc já tem todos os parágrafos mapeados
  });

// function removeParagraph(button) {
//     button.parentElement.remove();
//   }

// function addParagraph() {
//   const container = document.getElementById('paragraphsContainer');

//   const div = document.createElement('div');
//   div.className = "relative border border-gray-300 rounded-lg p-4";
//   div.innerHTML = `
//     <button type="button"
//       class="absolute bottom-2 right-2 bg-red-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-600"
//       onclick="removeParagraph(this)">
//         Remover
//       </button>

//       <input type="text" placeholder="Digite o parágrafo"
//         class="w-full p-2 border border-gray-300 rounded mb-3">

//       <input type="file" accept="image/*" class="mb-3">

//       <label class="flex items-center gap-2 text-sm text-gray-700">
//         <input type="checkbox" class="h-4 w-4 text-blue-600 border-gray-300 rounded">
//         Imagem antes do parágrafo
//       </label>
//     `;

//   container.appendChild(div);
// }
