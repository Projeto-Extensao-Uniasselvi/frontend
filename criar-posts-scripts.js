function editor() {
  return {
    view: 'visual',
    paragraphTag: 'p',
    plainText: '',
    wordCount: 0,

    format(command) {
      document.execCommand(command, false, null);
    },

    formatBlock() {
      document.execCommand('formatBlock', false, this.paragraphTag);
    },

    addLink() {
      const url = prompt("Digite a URL:");
      if (url) {
        document.execCommand("createLink", false, url);
      }
    },

    uploadImage(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const img = document.createElement('img');
          img.src = e.target.result;
          img.classList.add('max-w-full', 'my-2');
          this.$refs.editor.appendChild(img);
        };
        reader.readAsDataURL(file);
      }
    },

    updateWordCount() {
      const text = this.$refs.editor.innerText || '';
      this.wordCount = text.trim().split(/\s+/).filter(Boolean).length;
      this.plainText = this.$refs.editor.innerHTML;
    }
  }
}


document.querySelectorAll(".btn-format").forEach((btn) => {
  btn.addEventListener("click", () => {
    const command = btn.getAttribute("data-command");
    document.execCommand(command, false, null);
  });
});


document.getElementById("upload-image").addEventListener("change", function () {
  const file = this.files[0];
  if (file && file.type.startsWith("image/")) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const img = document.createElement("img");
      img.src = e.target.result;
      img.classList.add("my-2", "max-w-xs");
      document.getElementById("editor").appendChild(img);
    };
    reader.readAsDataURL(file);
  }
});

document.getElementById("postar").addEventListener("click", () => {
  const titulo = document.getElementById("titulo").value;
  const email = document.getElementById("email").value;
  const conteudo = document.getElementById("editor").innerHTML;

  console.log("Título:", titulo);
  console.log("Email:", email);
  console.log("Conteúdo:", conteudo);

  alert("Postagem simulada! Veja o console para os dados.");
});
