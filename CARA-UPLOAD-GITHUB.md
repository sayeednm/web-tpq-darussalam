# Cara Upload Project ke GitHub

## 📋 Persiapan

### 1. Pastikan Anda Punya Akun GitHub
- Jika belum punya, daftar di: https://github.com/signup
- Login ke akun GitHub Anda

### 2. Buat Repository Baru di GitHub

1. Buka https://github.com/new
2. Isi informasi repository:
   - **Repository name**: `tpq-darussalam-landing-page` (atau nama lain yang Anda inginkan)
   - **Description**: `Landing page modern untuk TPQ Darussalam dengan Metode Ummi`
   - **Public** atau **Private**: Pilih sesuai kebutuhan
   - **JANGAN** centang "Add a README file" (karena kita sudah punya)
3. Klik **Create repository**

## 🚀 Upload ke GitHub

### Langkah 1: Copy URL Repository
Setelah repository dibuat, GitHub akan menampilkan URL seperti:
```
https://github.com/username/tpq-darussalam-landing-page.git
```
Copy URL tersebut.

### Langkah 2: Jalankan Command Berikut

Buka terminal/command prompt di folder project, lalu jalankan:

```bash
# Tambahkan remote repository (ganti URL dengan URL repository Anda)
git remote add origin https://github.com/username/tpq-darussalam-landing-page.git

# Push ke GitHub
git branch -M main
git push -u origin main
```

**ATAU jika sudah ada branch master:**
```bash
git remote add origin https://github.com/username/tpq-darussalam-landing-page.git
git push -u origin master
```

### Langkah 3: Masukkan Kredensial
Jika diminta username dan password:
- **Username**: username GitHub Anda
- **Password**: Gunakan **Personal Access Token** (bukan password biasa)

#### Cara Membuat Personal Access Token:
1. Buka: https://github.com/settings/tokens
2. Klik **Generate new token** → **Generate new token (classic)**
3. Beri nama: `TPQ Darussalam Upload`
4. Centang scope: **repo** (full control)
5. Klik **Generate token**
6. **COPY token** yang muncul (hanya muncul sekali!)
7. Gunakan token ini sebagai password saat push

## ✅ Verifikasi

Setelah berhasil push:
1. Buka repository Anda di GitHub
2. Refresh halaman
3. Semua file project sudah ada di GitHub!

## 📝 Update Project di Masa Depan

Jika Anda melakukan perubahan dan ingin update ke GitHub:

```bash
# Tambahkan semua perubahan
git add .

# Commit dengan pesan
git commit -m "Update: deskripsi perubahan"

# Push ke GitHub
git push
```

## 🌐 Deploy ke Vercel (Opsional)

Untuk membuat website online dan bisa diakses publik:

### 1. Buka Vercel
- Kunjungi: https://vercel.com
- Login dengan akun GitHub

### 2. Import Project
- Klik **Add New** → **Project**
- Pilih repository `tpq-darussalam-landing-page`
- Klik **Import**

### 3. Deploy
- Framework Preset: **Next.js** (otomatis terdeteksi)
- Klik **Deploy**
- Tunggu beberapa menit

### 4. Website Online!
Vercel akan memberikan URL seperti:
```
https://tpq-darussalam-landing-page.vercel.app
```

Website Anda sudah online dan bisa diakses siapa saja! 🎉

## 🔧 Troubleshooting

### Error: "remote origin already exists"
```bash
git remote remove origin
git remote add origin https://github.com/username/repo.git
```

### Error: "failed to push"
```bash
git pull origin main --rebase
git push origin main
```

### Lupa Personal Access Token
Buat token baru di: https://github.com/settings/tokens

## 📚 File yang Sudah Di-commit

✅ Semua komponen React
✅ Konfigurasi Next.js & Tailwind
✅ File dokumentasi (README, CARA-TAMBAH-LOGO, dll)
✅ .gitignore (node_modules tidak akan di-upload)

## ⚠️ Catatan Penting

- **node_modules** tidak akan di-upload (sudah ada di .gitignore)
- Setelah clone dari GitHub, jalankan `npm install` untuk install dependencies
- Logo dan foto perlu ditambahkan manual ke folder `public/`

## 🎯 Next Steps

1. ✅ Upload ke GitHub (Anda di sini)
2. 🌐 Deploy ke Vercel untuk website online
3. 📸 Tambahkan foto asli ke galeri
4. 🎨 Tambahkan logo TPQ dan Metode Ummi
5. 📱 Share link website ke orang tua santri!

---

**Selamat! Project Anda sudah siap di-upload ke GitHub!** 🚀
