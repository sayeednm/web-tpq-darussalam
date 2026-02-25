# Cara Menambahkan Foto Asli ke Galeri

## 📸 Langkah-langkah Menambahkan Foto

### 1. Siapkan Foto
- Format: JPG, PNG, atau WebP
- Ukuran yang disarankan: 800x600 pixels atau 4:3 ratio
- Ukuran file: Maksimal 500KB per foto (compress jika perlu)
- Nama file: gunakan nama yang deskriptif (contoh: `belajar-metode-ummi.jpg`)

### 2. Buat Folder Galeri
Buat folder baru di dalam `public/`:
```
public/
└── galeri/
    ├── belajar-1.jpg
    ├── hafalan-1.jpg
    ├── kebersamaan-1.jpg
    └── ...
```

### 3. Update Kode Galeri

Buka file `components/Galeri.tsx` dan update array `photos`:

**SEBELUM (Placeholder):**
```typescript
const photos = [
  {
    id: 1,
    category: 'belajar',
    title: 'Pembelajaran Metode Ummi',
    description: 'Santri sedang belajar membaca Al-Qur&apos;an',
    placeholder: 'BookOpen',  // ← Hapus ini
  },
  // ...
]
```

**SESUDAH (Foto Asli):**
```typescript
const photos = [
  {
    id: 1,
    category: 'belajar',
    title: 'Pembelajaran Metode Ummi',
    description: 'Santri sedang belajar membaca Al-Qur&apos;an',
    image: '/galeri/belajar-1.jpg',  // ← Tambah ini
  },
  // ...
]
```

### 4. Update Bagian Render

Cari bagian render foto (sekitar baris 130-145) dan ganti:

**SEBELUM:**
```tsx
<div className="relative h-64 bg-gradient-to-br from-emerald-100 to-emerald-200 flex items-center justify-center">
  <IconComponent className="w-24 h-24 text-emerald-600" />
</div>
```

**SESUDAH:**
```tsx
<div className="relative h-64 overflow-hidden">
  <img 
    src={photo.image} 
    alt={photo.title}
    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
  />
</div>
```

## 🎨 Contoh Lengkap dengan Foto Asli

```typescript
const photos = [
  {
    id: 1,
    category: 'belajar',
    title: 'Pembelajaran Metode Ummi',
    description: 'Santri sedang belajar membaca Al-Qur&apos;an dengan Metode Ummi',
    image: '/galeri/belajar-metode-ummi.jpg',
  },
  {
    id: 2,
    category: 'hafalan',
    title: 'Setoran Hafalan',
    description: 'Santri menyetorkan hafalan kepada ustadz',
    image: '/galeri/setoran-hafalan.jpg',
  },
  {
    id: 3,
    category: 'kebersamaan',
    title: 'Kegiatan Bersama',
    description: 'Suasana kebersamaan santri TPQ Darussalam',
    image: '/galeri/kegiatan-bersama.jpg',
  },
  {
    id: 4,
    category: 'belajar',
    title: 'Kelas Pra-TK',
    description: 'Pembelajaran untuk santri usia dini',
    image: '/galeri/kelas-pra-tk.jpg',
  },
  {
    id: 5,
    category: 'hafalan',
    title: 'Wisuda Tahfidz',
    description: 'Wisuda santri yang telah menyelesaikan hafalan',
    image: '/galeri/wisuda-tahfidz.jpg',
  },
  {
    id: 6,
    category: 'kebersamaan',
    title: 'Kegiatan Outdoor',
    description: 'Kegiatan outdoor learning santri',
    image: '/galeri/outdoor-learning.jpg',
  },
]
```

## 📝 Tips Foto yang Bagus

### Konten Foto:
- ✅ Santri sedang belajar Al-Qur'an
- ✅ Suasana kelas yang kondusif
- ✅ Interaksi ustadz dengan santri
- ✅ Kegiatan hafalan
- ✅ Wisuda atau acara khusus
- ✅ Fasilitas TPQ (ruang kelas, perpustakaan)

### Teknis:
- ✅ Pencahayaan yang baik
- ✅ Fokus yang tajam
- ✅ Komposisi yang menarik
- ✅ Hindari foto blur atau gelap
- ✅ Pastikan privasi anak terjaga (blur wajah jika perlu)

### Editing:
- Brightness & Contrast yang seimbang
- Crop ke ratio 4:3 atau 16:9
- Compress untuk web (gunakan tools seperti TinyPNG)
- Tambahkan watermark jika perlu

## 🔒 Privasi & Izin

⚠️ **PENTING:**
- Pastikan sudah ada izin dari orang tua untuk publikasi foto anak
- Blur wajah anak jika belum ada izin
- Jangan tampilkan informasi pribadi anak
- Fokus pada aktivitas, bukan close-up wajah

## 🚀 Optimasi Performance

Untuk website yang lebih cepat:

1. **Compress foto** sebelum upload
   - Gunakan: TinyPNG, Squoosh, atau ImageOptim
   - Target: < 200KB per foto

2. **Gunakan format modern**
   - WebP untuk browser modern
   - Fallback ke JPG untuk browser lama

3. **Lazy loading** (sudah otomatis dengan Framer Motion)

## 📱 Responsive

Foto akan otomatis responsive:
- Mobile: 1 kolom
- Tablet: 2 kolom
- Desktop: 3 kolom

## 🎯 Kategori yang Tersedia

1. **Semua Foto** - Menampilkan semua foto
2. **Kegiatan Belajar** - Foto pembelajaran di kelas
3. **Hafalan** - Foto kegiatan hafalan & wisuda
4. **Kebersamaan** - Foto kegiatan bersama & outdoor

Anda bisa menambah kategori baru di array `categories` jika diperlukan!
