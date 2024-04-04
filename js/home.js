const BASE_URL = "https://notes-api.dicoding.dev/v2";

class NotesApi {
  static async searchComponent(query) {
    try {
      const response = await fetch(`${BASE_URL}/notes/search?t=${query}`);
      if (!response.ok) {
        throw new Error("Something went wrong");
      }
      const responseJson = await response.json();
      const { notes } = responseJson; // Mengambil notes dari responseJson
      if (notes.length > 0) {
        return notes; // Mengembalikan notes jika ada
      } else {
        throw new Error(`'${query}' is not found`);
      }
    } catch (error) {
      throw new Error(error.message); // Melempar error jika terjadi kesalahan
    }
  }
}

export default NotesApi;
