# Cara Setting Nomor WhatsApp untuk Form Pendaftaran

## 📱 Mengubah Nomor WhatsApp

### Langkah 1: Buka File Daftar.tsx

Buka file: `components/Daftar.tsx`

### Langkah 2: Cari Baris Nomor WhatsApp

Cari baris sekitar line 25-26:

```typescript
// Nomor WhatsApp TPQ (ganti dengan nomor WhatsApp TPQ Anda)
const phoneNumber = '6289528036024' // Format: 62 + nomor tanpa 0 di depan
```

### Langkah 3: Ganti dengan Nomor WhatsApp TPQ Anda

**Format yang BENAR:**
- Awali dengan kode negara: `62` (untuk Indonesia)
- Hilangkan angka `0` di depan nomor
- Tidak ada spasi, tanda `-`, atau karakter lain

**Contoh:**

❌ **SALAH:**
```typescript
const phoneNumber = '081234567890'     // Masih ada 0 di depan
const phoneNumber = '62 812-3456-7890' // Ada spasi dan tanda -
const phoneNumber = '+6281234567890'   // Ada tanda +
```

✅ **BENAR:**
```typescript
const phoneNumber = '6281234567890'    // Format yang benar!
```

**Contoh Konversi:**

| Nomor Asli | Format WhatsApp |
|------------|-----------------|
| 0812-3456-7890 | 6281234567890 |
| 0857-1234-5678 | 6285712345678 |
| 0821-9876-5432 | 6282198765432 |

### Langkah 4: Save & Test

1. Save file `components/Daftar.tsx`
2. Refresh website
3. Isi form pendaftaran
4. Klik "Kirim via WhatsApp"
5. Akan otomatis membuka WhatsApp dengan pesan yang sudah terformat

## 📝 Format Pesan WhatsApp

Pesan yang dikirim akan terformat seperti ini:

```
*PENDAFTARAN SANTRI BARU*
*TPQ Darussalam*

*Nama Lengkap:* Ahmad Zaki
*Usia:* 7 tahun
*Email Orang Tua:* orangtua@email.com
*No. Telepon:* 0812-3456-7890
*Program:* Kelas Dasar (6-12 Tahun)
*Pesan:* Ingin tanya jadwal pembelajaran

_Terima kasih telah mendaftar di TPQ Darussalam!_
```

## 🎨 Kustomisasi Pesan (Opsional)

Jika ingin mengubah format pesan, edit bagian ini di `components/Daftar.tsx`:

```typescript
const message = `*PENDAFTARAN SANTRI BARU*
*TPQ Darussalam*

*Nama Lengkap:* ${formData.nama}
*Usia:* ${formData.usia} tahun
*Email Orang Tua:* ${formData.email}
*No. Telepon:* ${formData.telepon}
*Program:* ${formData.program}
${formData.pesan ? `*Pesan:* ${formData.pesan}` : ''}

_Terima kasih telah mendaftar di TPQ Darussalam!_`
```

**Tips Formatting:**
- `*teks*` = Bold
- `_teks_` = Italic
- `~teks~` = Strikethrough
- ` ``` teks ``` ` = Monospace

## 🔧 Troubleshooting

### Masalah: WhatsApp tidak terbuka

**Solusi:**
1. Pastikan format nomor benar (62xxx tanpa 0 di depan)
2. Pastikan nomor WhatsApp aktif
3. Coba buka di browser berbeda
4. Pastikan WhatsApp terinstall (untuk mobile)

### Masalah: Pesan tidak terformat dengan baik

**Solusi:**
1. Pastikan menggunakan backtick (`) bukan quote (')
2. Jangan ubah karakter `*` dan `_` untuk formatting
3. Gunakan `${formData.nama}` untuk variable

### Masalah: Form tidak terkirim

**Solusi:**
1. Pastikan semua field required terisi
2. Check console browser untuk error (F12)
3. Pastikan tidak ada typo di kode

## 📱 Testing

### Test di Desktop:
1. Isi form pendaftaran
2. Klik "Kirim via WhatsApp"
3. WhatsApp Web akan terbuka di tab baru
4. Pesan sudah terisi otomatis
5. Tinggal klik Send

### Test di Mobile:
1. Isi form pendaftaran
2. Klik "Kirim via WhatsApp"
3. Aplikasi WhatsApp akan terbuka
4. Pesan sudah terisi otomatis
5. Tinggal klik Send

## 🎯 Fitur Form Pendaftaran

✅ **Validasi otomatis** - Semua field wajib terisi
✅ **Format WhatsApp** - Pesan terformat rapi dengan bold & italic
✅ **Responsive** - Bekerja di desktop & mobile
✅ **User-friendly** - Langsung buka WhatsApp, tidak perlu copy-paste
✅ **Professional** - Pesan terstruktur dan mudah dibaca

## 🔐 Privasi

⚠️ **Catatan Penting:**
- Data form TIDAK disimpan di database
- Data langsung dikirim ke WhatsApp
- Tidak ada tracking atau penyimpanan data
- Privasi calon santri terjaga

## 📊 Alternatif: Multiple Admin

Jika ingin pesan masuk ke beberapa admin, Anda bisa:

1. **Buat WhatsApp Group** untuk admin TPQ
2. **Gunakan nomor group** sebagai phoneNumber
3. Semua admin akan menerima notifikasi

Atau buat dropdown untuk pilih admin:

```typescript
<select name="admin">
  <option value="6281234567890">Ustadz Ahmad</option>
  <option value="6285678901234">Ustadzah Fatimah</option>
</select>
```

---

**Selamat! Form pendaftaran sudah terhubung dengan WhatsApp!** 🎉

Calon santri bisa langsung mendaftar dan pesannya masuk ke WhatsApp TPQ secara otomatis!
