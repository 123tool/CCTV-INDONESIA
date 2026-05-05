## Intelijen Indonesia & CCTV OSINT Dashboard

**​Tool riset keamanan siber yang dirancang untuk memetakan perangkat IoT (CCTV) yang terkonfigurasi secara publik di wilayah Indonesia dan global.**

Alat ini mengintegrasikan data Shodan dengan Google Maps API untuk analisis lokasi yang presisi.

## ​Fitur
- ​**Geo-Location Mapping :** Visualisasi titik koordinat IP secara real-time di atas peta Google Maps.
- **​Anonymizer Image Proxy :** Fitur keamanan untuk melihat siaran tanpa membocorkan alamat IP asli pengguna ke target.
- **Multi-Vendor Dorking :** Filter pencarian otomatis untuk perangkat Hikvision, Dahua, dan vendor populer lainnya.
- **​Local History Database :** Penyimpanan otomatis hasil pemindaian ke database lokal (history.db) menggunakan NeDB.
- **​Export Data :** Kemampuan untuk mengunduh daftar target ke dalam format file .txt.

## ​Prasyarat Sistem 
- ​**Sistem Operasi :** Xubuntu 24.04 LTS atau Linux berbasis Debian lainnya.
- **Runtime :** Node.js & NPM terinstal
- ​**API Keys :** ​
  1. Shodan API Key (Dapatkan di shodan.io).
  2. Google Maps API Key (Dapatkan di Google Cloud Console).
  
## ​Panduan Instalasi
​1. **Setup Folder Proyek**
​Buka terminal Xubuntu Bos dan jalankan :
```
mkdir cctv-pro-maps && cd cctv-pro-maps
```
2. **Instalasi Dependensi**
​Inisialisasi Node.js dan pasang library yang diperlukan :
```
npm init -y
npm install express axios dotenv nedb path
```
3. **Konfigurasi API (.env)**
- ​Buat file bernama .env di direktori utama :
```
nano .env
```
- Masukkan kunci API Bos ke dalam file tersebut :
```
SHODAN_API_KEY=MASUKKAN_KEY_SHODAN_BOS
GOOGLE_MAPS_API_KEY=MASUKKAN_KEY_GOOGLE_MAPS_BOS
PORT=3000
```

## Cara Pengoperasian
1. **Menjalankan Server :**
```
node server.js
```
2. **Akses Dashboard :**
Buka browser dan arahkan ke alamat
```
http://localhost:3000.
```
3. **Eksekusi Scan :**
- ​Ketik nama kota (contoh: "Jakarta") atau pilih vendor tertentu.
- Klik EXECUTE HARVEST untuk memulai pemindaian.
- ​Gunakan tombol LOCATE untuk melakukan zoom-in ke posisi perangkat di peta.

## (Disclaimer)

​Alat ini dibuat oleh (SPY-E) untuk tujuan Edukasi, OSINT, dan Riset Keamanan Siber. Penggunaan alat ini untuk tindakan ilegal yang melanggar hukum privasi atau UU ITE sepenuhnya menjadi tanggung jawab pengguna. Selalu gunakan VPN untuk lapisan keamanan tambahan saat melakukan riset jaringan.

​© 2026 SPY-E | 123Tool Project
