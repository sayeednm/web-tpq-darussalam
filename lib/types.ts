export interface Santri {
  id?: string
  nama: string
  tempatLahir: string
  tanggalLahir: string
  jenisKelamin: 'L' | 'P'
  alamat: string
  namaAyah: string
  namaIbu: string
  noHpOrtu: string
  kelasId: string
  tanggalMasuk: string
  status: 'aktif' | 'nonaktif' | 'lulus'
  createdAt?: string
  updatedAt?: string
}

export interface Guru {
  id?: string
  nama: string
  tempatLahir: string
  tanggalLahir: string
  jenisKelamin: 'L' | 'P'
  alamat: string
  noHp: string
  email: string
  jabatan: string
  kelasAjar: string[]
  tanggalMasuk: string
  status: 'aktif' | 'nonaktif'
  createdAt?: string
  updatedAt?: string
}

export interface Kelas {
  id?: string
  nama: string
  level: string
  guruId: string
  namaGuru?: string
  kapasitas: number
  createdAt?: string
}

export interface Absensi {
  id?: string
  tanggal: string
  santriId?: string
  guruId?: string
  namaSantri?: string
  namaGuru?: string
  kelasId: string
  status: 'hadir' | 'izin' | 'sakit' | 'alpha'
  keterangan?: string
  createdAt?: string
}

export interface Penilaian {
  id?: string
  santriId: string
  namaSantri: string
  kelasId: string
  tanggal: string
  jilid: string
  halaman: number
  nilai: 'A' | 'B' | 'C'
  catatan?: string
  guruId: string
  namaGuru: string
  createdAt?: string
}

export interface Pembayaran {
  id?: string
  santriId: string
  namaSantri: string
  kelasId: string
  bulan: string
  tahun: number
  jumlah: number
  status: 'lunas' | 'belum' | 'cicil'
  tanggalBayar?: string
  keterangan?: string
  createdAt?: string
}
