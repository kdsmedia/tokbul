// server.js

const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const { WebcastPushConnection } = require('tiktok-live-connector');
const path = require('path');

// Buat aplikasi Express dan server HTTP
const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// --- Variabel Global untuk State Aplikasi ---

// Koneksi tunggal ke TikTok Live
let tiktokLiveConnection;

// Data sesi pengguna (disimpan di memori)
let userLikes = {}; // Menyimpan total likes per pengguna
let userGifts = {}; // Menyimpan total gifts per pengguna
let userShares = {}; // Menyimpan total shares per pengguna

// Array gambar yang akan ditampilkan untuk jumlah like tertentu
const profilePictures = [
    'public/images/image1.jpg', // Gambar untuk 1 like
    'public/images/image2.jpg', // Gambar untuk 2 likes
    'public/images/image3.jpg', // Gambar untuk 3 likes
    // Tambahkan lebih banyak gambar sesuai kebutuhan
];


// --- Fungsi Helper ---

/**
 * Mengirim pesan ke semua klien WebSocket yang terhubung.
 * @param {object} data Objek data yang akan dikirim.
 */
function broadcast(data) {
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(data));
        }
    });
}

/**
 * Memperbarui data like pengguna dan menyiarkan pembaruan gambar profil.
 * @param {object} data Data event 'like' dari TikTok.
 */
function updateUserLikes(data) {
    const { uniqueId, likeCount, profilePictureUrl } = data;
    userLikes[uniqueId] = (userLikes[uniqueId] || 0) + likeCount;

    // Tentukan gambar yang akan ditampilkan berdasarkan jumlah total like
    // Math.min digunakan untuk memastikan kita tidak keluar dari batas array
    const pictureIndex = Math.min(userLikes[uniqueId] - 1, profilePictures.length - 1);
    const updatedPictureUrl = profilePictures[pictureIndex] || profilePictureUrl; // Gunakan gambar asli jika indeks tidak valid

    // Siarkan pembaruan ke semua klien
    broadcast({
        type: 'updateProfilePicture',
        username: uniqueId,
        pictureUrl: updatedPictureUrl,
        likes: userLikes[uniqueId],
        gifts: userGifts[uniqueId] || 0,
        shares: userShares[uniqueId] || 0
    });
}

/**
 * Memperbarui data gift pengguna.
 * @param {object} data Data event 'gift' dari TikTok.
 */
function updateUserGifts(data) {
    const { uniqueId, repeatCount } = data;
    userGifts[uniqueId] = (userGifts[uniqueId] || 0) + repeatCount;
}

/**
 * Memperbarui data share pengguna.
 * @param {object} data Data event 'share' dari TikTok.
 */
function updateUserShares(data) {
    const { uniqueId } = data;
    userShares[uniqueId] = (userShares[uniqueId] || 0) + 1;
}


// --- Pengaturan Server ---

// Sajikan file statis dari direktori 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Tangani koneksi WebSocket
wss.on('connection', (ws) => {
    console.log('Klien WebSocket baru terhubung.');

    // Kirim pesan konfirmasi ke klien yang baru terhubung
    ws.send(JSON.stringify({ type: 'connected' }));

    // Tangani pesan yang masuk dari klien
    ws.on('message', (message) => {
        let data;
        try {
            data = JSON.parse(message);
        } catch (error) {
            console.error('Pesan tidak valid diterima:', message);
            return;
        }
        
        // Hanya proses pesan dengan tipe 'connect'
        if (data.type === 'connect' && data.username) {
            const tiktokUsername = data.username;
            console.log(`Menerima permintaan untuk terhubung ke TikTok user: ${tiktokUsername}`);

            // Jika sudah ada koneksi, putuskan dulu
            if (tiktokLiveConnection) {
                console.log('Memutuskan koneksi lama...');
                tiktokLiveConnection.disconnect();
            }

            // Buat instance koneksi baru
            tiktokLiveConnection = new WebcastPushConnection(tiktokUsername);

            // Hubungkan ke stream
            tiktokLiveConnection.connect().then(state => {
                console.info(`Berhasil terhubung ke Room ID: ${state.roomId}`);
                // Kirim pesan sukses hanya ke klien yang meminta
                ws.send(JSON.stringify({ type: 'connectionSuccess', message: `Terhubung ke @${tiktokUsername}` }));
            }).catch(err => {
                console.error('Gagal terhubung ke TikTok', err);
                // Kirim pesan gagal hanya ke klien yang meminta
                ws.send(JSON.stringify({ type: 'connectionFailed', message: `Gagal terhubung. Pastikan @${tiktokUsername} sedang live.` }));
            });
            
            // --- Atur Event Listeners untuk Koneksi TikTok ---
            // Ini akan menyiarkan event ke SEMUA klien yang terhubung

            tiktokLiveConnection.on('chat', (data) => {
                console.log(`${data.uniqueId} menulis: ${data.comment}`);
                broadcast({
                    type: 'chat',
                    userName: data.uniqueId,
                    comment: data.comment
                });
            });

            tiktokLiveConnection.on('member', (data) => {
                console.log(`${data.uniqueId} bergabung!`);
                broadcast({ type: 'floating-photo', profilePictureUrl: data.profilePictureUrl, userName: data.uniqueId });
                broadcast({ type: 'play-sound', sound: 'sounds/hallo.mp3' });
            });

            tiktokLiveConnection.on('like', (data) => {
                console.log(`${data.uniqueId} mengirim ${data.likeCount} suka`);
                updateUserLikes(data); // Perbarui statistik like
                
                // Kirim event untuk animasi foto melayang
                broadcast({ type: 'floating-photo', profilePictureUrl: data.profilePictureUrl, userName: data.uniqueId, count: data.likeCount });
            });

            tiktokLiveConnection.on('gift', (data) => {
                // Proses gift hanya jika bukan bagian dari streak yang sedang berjalan
                if (data.giftType === 1 && !data.repeatEnd) {
                    return;
                }
                
                console.log(`${data.uniqueId} mengirim gift ${data.giftName} x${data.repeatCount}`);
                updateUserGifts(data); // Perbarui statistik gift

                broadcast({ type: 'big-photo', profilePictureUrl: data.profilePictureUrl, userName: data.uniqueId });
                broadcast({ type: 'play-sound', sound: 'sounds/winner.mp3' });
            });

            tiktokLiveConnection.on('share', (data) => {
                console.log(`${data.uniqueId} membagikan stream!`);
                updateUserShares(data); // Perbarui statistik share

                broadcast({ type: 'floating-photo', profilePictureUrl: data.profilePictureUrl, userName: data.uniqueId });
                broadcast({ type: 'play-sound', sound: 'sounds/kentut.mp3' });
            });
            
            tiktokLiveConnection.on('envelope', (data) => {
                console.log('Amplop diterima:', data);
                broadcast({ type: 'play-sound', sound: 'sounds/anjay.mp3' });
            });

            tiktokLiveConnection.on('roomUser', (data) => {
                // console.log(`Jumlah penonton: ${data.viewerCount}`); // Bisa terlalu 'berisik' di log
                broadcast({ type: 'roomUser', viewerCount: data.viewerCount });
            });

            tiktokLiveConnection.on('disconnected', () => {
                console.log('Koneksi ke TikTok terputus.');
                broadcast({ type: 'tiktokDisconnected', message: 'Koneksi ke TikTok Live terputus.' });
            });
            
            tiktokLiveConnection.on('streamEnd', (actionId) => {
                console.log('Stream TikTok telah berakhir.');
                broadcast({ type: 'streamEnded', message: 'Stream TikTok telah berakhir.' });
                if (tiktokLiveConnection) {
                    tiktokLiveConnection.disconnect();
                }
            });
        }
    });

    ws.on('close', () => {
        console.log('Klien WebSocket terputus.');
        // Kita tidak memutuskan koneksi TikTok di sini agar tetap berjalan untuk klien lain.
    });
});

// Jalankan server
const port = 8084;
server.listen(port, () => {
    console.log(`Server berjalan di http://localhost:${port}`);
});
