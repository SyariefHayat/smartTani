### 1. Persiapan Awal (Fork & Setup)

Langkah pertama adalah membuat salinan project ini di akun pribadimu agar kamu bebas bereksperimen.

1.  **Fork Repositori:** Klik tombol **Fork** di pojok kanan atas halaman GitHub SmartTani ini.
2.  **Clone ke Lokal:** Buka terminal, arahkan ke folder tempat kamu menyimpan project, lalu jalankan:
    ```bash
    git clone https://github.com/[USERNAME_GITHUB_KAMU]/smart_tani.git
    cd smart_tani
    ```
3.  **Hubungkan ke Upstream:** Agar tetap sinkron dengan update terbaru dari tim, jalankan:
    ```bash
    git remote add upstream https://github.com/SyariefHayat/smartTani.git
    ```
4.  **Install Dependensi:**
    ```bash
    npm install
    ```

---

### 2. Memulai Tugas (GitHub Issues)

Kami menggunakan **Issues** sebagai daftar antrean kerja. Begini cara mengambil tugas:

1.  **Cari Issue:** Buka tab **Issues** di repo utama. Cari label `good first issue` atau yang sesuai dengan halaman/fitur yang ingin kamu kerjakan.
2.  **Assign Diri Sendiri:** Jika sudah menemukan yang cocok, berikan komentar: *"I'm interested in this issue, may I work on it?"*. Moderator akan menunjukmu sebagai `Assignee`.
3.  **Buat Branch Baru:** **PENTING!** Jangan pernah koding langsung di branch `main`. Selalu buat branch baru dari `main` yang sudah ter-update:
    ```bash
    git checkout main
    git pull upstream main
    git checkout -b feature/issue-[NOMOR_ISSUE]-[nama-singkat-tugas]
    # Contoh: git checkout -b feature/issue-1-setup-constants
    ```

---

### 3. Proses Pengerjaan (Koding & Commit)

1.  **Koding:** Ikuti instruksi di kolom `### Tasks` pada issue tersebut.
2.  **Gunakan Konvensi:** Pastikan mengikuti panduan aset atau konstanta yang sudah ditentukan (cek di body issue).
3.  **Commit Berkala:** Gunakan pesan commit yang deskriptif menggunakan format [Conventional Commits](https://www.conventionalcommits.org/):
    ```bash
    # Contoh pesan commit
    git add .
    git commit -m "feat: setup types untuk konstanta halaman beranda (#12)"
    ```
    *(Tips: Selalu sertakan nomor issue dalam kurung jika memungkinkan)*.

---

### 4. Mengirimkan Perubahan (Pull Request)

Setelah selesai, saatnya mengirimkan hasil kerjamu untuk di-review oleh Senior Developer.

1.  **Sinkronisasi Terakhir:** Pastikan tidak ada konflik dengan kode terbaru:
    ```bash
    git fetch upstream
    git merge upstream/main
    ```
2.  **Push ke GitHub-mu:**
    ```bash
    git push origin HEAD
    ```
3.  **Buka Pull Request (PR):**
    - Di halaman GitHub-mu, akan muncul tombol **Compare & pull request**. Klik tombol tersebut.
    - **Judul PR:** Gunakan format `feat: [Deskripsi Singkat] (Resolves #[NOMOR_ISSUE])`.
      *Contoh: `feat: implementasi konstanta footer (Resolves #11)`*
    - **Deskripsi PR:** Jelaskan secara singkat apa saja yang kamu ubah atau tambahkan. Lampirkan screenshot jika ada perubahan tampilan (UI).
    - Klik **Create pull request**.

---

### 💡 Tips Sukses Pull Request
- **Resolves Keyword:** Menggunakan kata `Resolves #nomor` di judul atau deskripsi PR akan otomatis menutup issue terkait saat PR di-merge.
- **Code Review:** Jika Senior memberikan feedback atau meminta perubahan (*Requested Changes*), jangan berkecil hati! Itu bagian dari proses belajar. Cukup perbaiki kodenya di komputer, commit, dan push lagi ke branch yang sama. PR akan terupdate otomatis.

Jika bingung, jangan ragu bertanya di tab **Discussions** atau langsung di komentar issue! Selamat berkarya! 🚀

