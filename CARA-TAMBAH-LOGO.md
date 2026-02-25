# Cara Menambahkan Logo

## Ada 2 Logo yang Berbeda:

### 1. Logo TPQ Darussalam (untuk Navbar)
- Simpan logo TPQ dengan nama `logo-tpq.png`
- Letakkan di folder `public/`
- Path lengkap: `public/logo-tpq.png`
- Logo ini akan muncul di **Navbar** (pojok kiri atas)

### 2. Logo Metode Ummi (untuk Hero Section)
- Simpan logo Metode Ummi dengan nama `logo-ummi.png`
- Letakkan di folder `public/`
- Path lengkap: `public/logo-ummi.png`
- Logo ini akan muncul di **Hero Section** (bagian kanan hero)

## Langkah-langkah:

### 1. Siapkan Kedua Logo
- **Logo TPQ Darussalam**: Logo institusi/lembaga TPQ Anda
- **Logo Metode Ummi**: Logo resmi dari Ummi Foundation
- Format yang disarankan: PNG dengan background transparan

### 2. Simpan Logo ke Project
Simpan kedua file logo ke folder `public/`:
```
public/
├── logo-tpq.png      (Logo TPQ Darussalam)
└── logo-ummi.png     (Logo Metode Ummi)
```

### 3. Logo Akan Otomatis Muncul
Setelah file logo disimpan:
- **Logo TPQ** akan muncul di **Navbar** (pojok kiri atas)
- **Logo Metode Ummi** akan muncul di **Hero Section** (bagian kanan)

### 4. Alternatif: Gunakan Logo dari URL
Jika Anda memiliki logo yang sudah di-hosting online, edit file berikut:

**File: `components/Navbar.tsx`**
```tsx
// Ganti baris ini:
src="/logo-ummi.png"
// Menjadi:
src="https://url-logo-anda.com/logo-ummi.png"
```

**File: `components/Hero.tsx`**
```tsx
// Ganti baris ini:
src="/logo-ummi.png"
// Menjadi:
src="https://url-logo-anda.com/logo-ummi.png"
```

### 5. Ukuran Logo yang Disarankan
- **Navbar**: 40x40 pixels (akan di-resize otomatis)
- **Hero Section**: 128x128 pixels (akan di-resize otomatis)
- Format: PNG dengan background transparan
- Resolusi: Minimal 256x256 pixels untuk kualitas terbaik

### Catatan Penting:
- Logo Metode Ummi adalah trademark resmi Ummi Foundation
- Pastikan Anda memiliki izin untuk menggunakan logo tersebut
- Jika belum ada logo, sistem akan menampilkan icon placeholder (icon buku)

## Kontak Ummi Foundation:
Untuk mendapatkan logo resmi dan izin penggunaan, hubungi:
- Website: Cari "Ummi Foundation Surabaya" atau "Metode Ummi"
- Atau hubungi koordinator Metode Ummi di daerah Anda
