import NotesApi from "./notes-api.js";

class NotesComponent extends HTMLElement {
  constructor() {
    super();
    // Inisialisasi array kosong untuk menyimpan catatan
    this.notes = [];
    // Menghubungkan shadow DOM dengan mode 'open'
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    // Memuat catatan saat komponen terhubung ke DOM
    this.loadNotes();
    // Menyiapkan listener untuk formulir pencarian
    this.setupSearchListener();
  }

  async loadNotes() {
    try {
      // Memuat catatan dari NotesApi
      this.notes = await NotesApi.getAllNotes();
      // Merender catatan yang dimuat
      this.renderNotes();
    } catch (error) {
      console.error("Gagal memuat catatan:", error);
    }
  }

  // Menyiapkan listener untuk formulir pencarian
  setupSearchListener() {
    const searchInput = this.shadowRoot.getElementById("searchInput");
    const okButton = this.shadowRoot.getElementById("okButton");

    const searchHandler = async () => {
      const searchTerm = searchInput.value.toLowerCase();
      try {
        // Mengambil catatan yang sesuai dengan kata kunci dari NotesApi
        const notes = await NotesApi.searchNotes(searchTerm);
        // Merender catatan yang sesuai dengan hasil pencarian
        this.renderNotes(notes);
      } catch (error) {
        console.error("Pencarian gagal:", error);
      }
    };

    okButton.addEventListener("click", searchHandler);
    searchInput.addEventListener("input", searchHandler);
  }

  // Merender catatan ke dalam elemen shadow DOM
  renderNotes(notes = this.notes) {
    const notesContainer = this.shadowRoot.querySelector("#notes-container");
    notesContainer.innerHTML = ""; // Mengosongkan kontainer catatan sebelum merender yang baru

    notes.forEach((note) => {
      const noteElement = document.createElement("div");
      noteElement.classList.add("note-content");
      noteElement.innerHTML = `
          <h2>${note.title}</h2>
          <p>${note.body}</p>
          <p>Dibuat pada: ${note.createdAt}</p>
          <p>Diarsipkan: ${note.archived}</p>
      `;
      notesContainer.appendChild(noteElement);
    });
  }
}

// Mendefinisikan elemen kustom 'notes-component'
customElements.define("notes-component", NotesComponent);

class SearchComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.renderSearchBar();
    this.setupSearchListener();
    this.addStyles();
  }

  renderSearchBar() {
    const searchBar = document.createElement("div");
    searchBar.innerHTML = `
          <div id="search-container">
            <input type="text" id="searchInput" placeholder="Search notes...">
            <button id="okButton">OK</button> <!-- Tombol OK -->
          </div>
        `;

    this.shadowRoot.appendChild(searchBar);
  }

  setupSearchListener() {
    const searchInput = this.shadowRoot.getElementById("searchInput");
    const okButton = this.shadowRoot.getElementById("okButton"); // Mendapatkan referensi tombol OK

    const searchHandler = async () => {
      const searchTerm = searchInput.value.toLowerCase();
      try {
        // Mengambil catatan yang sesuai dengan kata kunci dari NotesApi
        const notes = await NotesApi.searchNotes(searchTerm);
        // Mengirimkan event custom dengan hasil pencarian
        this.dispatchEvent(new CustomEvent("search", { detail: { notes } }));
      } catch (error) {
        console.error("Pencarian gagal:", error);
      }
    };

    okButton.addEventListener("click", searchHandler); // Menambahkan event listener untuk tombol OK
    searchInput.addEventListener("input", searchHandler); // Menambahkan event listener untuk input pencarian
  }

  addStyles() {
    const style = document.createElement("style");
    style.textContent = `
                /* Style for the search input */
                #search-container {
                    display: flex;
                    align-items: center; /* Memastikan input dan tombol OK berada dalam satu baris */
                }
    
                #searchInput {
                    width: 30%; /* Lebar input search */
                    padding: 15px;
                    border: 1px solid #ccc;
                    border-radius: 5px;
                    font-size: 16px;
                    box-sizing: border-box;
                    margin-right: 10px; /* Jarak antara input search dan tombol OK */
                }
    
                #okButton {
                    padding: 15px;
                    background-color: #007bff; /* Warna latar belakang tombol OK */
                    color: white; /* Warna teks tombol OK */
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                    transition: background-color 0.3s ease; /* Transisi warna latar belakang saat hover */
                }
    
                #okButton:hover {
                    background-color: #0056b3; /* Warna latar belakang saat hover */
                }
    
                #okButton:focus {
                    outline: none; /* Menghilangkan focus border pada tombol OK */
                }
            `;

    this.shadowRoot.appendChild(style);
  }
}

customElements.define("search-component", SearchComponent);
