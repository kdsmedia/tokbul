# belekok
# tokbul

# Belekok

Belekok adalah aplikasi berbasis Node.js yang mengintegrasikan Express dan WebSocket untuk menciptakan pengalaman interaktif dalam siaran langsung TikTok. Dengan menggunakan `tiktok-live-connector`, aplikasi ini memungkinkan pengguna untuk berinteraksi secara real-time dengan siaran, mengelola likes, gifts, dan shares dari pengguna lain.

## Deskripsi

Aplikasi ini menyimpan data interaksi pengguna seperti jumlah likes, gifts, dan shares, serta memperbarui informasi tersebut secara instan. Dengan memanfaatkan WebSocket, Belekok mampu memberikan pembaruan gambar profil pengguna berdasarkan interaksi yang dilakukan, sehingga meningkatkan pengalaman pengguna selama siaran langsung.

Setiap kali seorang pengguna mengirimkan like, gift, atau melakukan share, aplikasi akan menangani event tersebut dan memberikan umpan balik visual, seperti gambar profil yang mengambang, efek suara, dan update jumlah likes. Ini menciptakan suasana yang lebih hidup dan interaktif bagi penonton.

## Fitur

- **Koneksi TikTok**: Menghubungkan aplikasi ke siaran langsung TikTok menggunakan username.
- **Real-time Interaksi**: Menerima dan menampilkan likes, gifts, dan shares secara langsung.
- **Pembaruan Gambar Profil**: Memperbarui gambar profil pengguna berdasarkan jumlah interaksi yang diterima.
- **Efek Suara**: Menambahkan efek suara saat menerima likes, gifts, dan shares untuk meningkatkan pengalaman interaktif.
- **Statistik Pengguna**: Menyimpan dan menampilkan jumlah likes, gifts, dan shares per pengguna.
- **Floating Profile Pictures**: Menampilkan gambar profil pengguna yang mengambang saat berinteraksi.
- **Chat Monitoring**: Menangkap dan menampilkan chat pengguna selama siaran langsung.
- **Room User Count**: Menampilkan jumlah penonton yang sedang aktif di dalam siaran.

## Cara Menggunakan

### Instalasi

1. **Clone repositori**:

   - **CMD (Windows)**:
     ```bash
     git clone https://github.com/kdsmedia/belekok.git
     ```

   - **Termux (Android)**:
     ```bash
     pkg install git
     git clone https://github.com/kdsmedia/belekok.git
     ```

   - **Linux**:
     ```bash
     sudo apt-get install git
     git clone https://github.com/kdsmedia/belekok.git
     ```

2. **Masuk ke direktori proyek**:
     ```bash
     cd belekok
     ```
   
### Jalankan

     ```
     npm start
     ```

###========================================================================================================================


Server akan berjalan di http://localhost:8084. Anda dapat mengakses aplikasi melalui browser menggunakan URL ini.

Penggunaan Aplikasi
Koneksi ke TikTok: Setelah server berjalan, Anda perlu menghubungkan aplikasi ke siaran langsung TikTok dengan menggunakan username TikTok Anda. Kirimkan permintaan koneksi melalui WebSocket.

Interaksi: Setelah terhubung, aplikasi akan mulai menerima event seperti likes, gifts, dan shares. Anda dapat melihat efek visual langsung di aplikasi saat interaksi terjadi.

Monitoring: Aplikasi akan terus memperbarui informasi pengguna secara real-time, seperti jumlah likes, gifts, dan shares yang diterima oleh setiap pengguna yang berinteraksi.



## Kontak Penulis

Jika Anda memiliki pertanyaan atau umpan balik, silakan hubungi penulis di:

- **Nama**: Sidhanie
- **Email**: [altomedia@gmail.com](mailto:appsidhanie@gmail.com)


### Media Sosial

- [![Telegram](https://img.shields.io/badge/Telegram-0088cc?style=for-the-badge&logo=telegram&logoColor=white)](https://t.me/@sidhanie06)
- [![Instagram](https://img.shields.io/badge/Instagram-E4405F?style=for-the-badge&logo=instagram&logoColor=white)](https://instagram.com/@sidhanie06)
- [![TikTok](https://img.shields.io/badge/TikTok-000000?style=for-the-badge&logo=tiktok&logoColor=white)](https://tiktok.com/@sidhanie06)
- [![YouTube](https://img.shields.io/badge/YouTube-FF0000?style=for-the-badge&logo=youtube&logoColor=white)](https://youtube.com/@sidhanie06)


### Donasi

Jika Anda ingin mendukung pengembangan proyek ini, Anda dapat melakukan donasi melalui PayPal:

[![Donate with PayPal](https://img.shields.io/badge/Donate-PayPal-0070ba?style=for-the-badge&logo=paypal&logoColor=white)](https://paypal.me/sidhanie)



## Disclaimer

Proyek ini dilindungi oleh hak cipta. Semua kode, dokumentasi, dan materi yang terkait dengan proyek ini tidak boleh disalin, dimodifikasi, atau disebarluaskan tanpa izin tertulis dari penulis. Penggunaan materi ini harus sesuai dengan ketentuan lisensi MIT yang berlaku. 

Dengan menggunakan proyek ini, Anda setuju untuk mematuhi semua ketentuan yang disebutkan dalam lisensi. Setiap pelanggaran terhadap ketentuan ini dapat mengakibatkan tindakan hukum.


## Lisensi

MIT
