'use client'

import { Guru } from '@/lib/types'

const BULAN = [
  'Januari','Februari','Maret','April','Mei','Juni',
  'Juli','Agustus','September','Oktober','November','Desember'
]

interface Props {
  guru?: Guru
  bulan: number
  tahun: number
}

const ROWS = 26 // jumlah baris (pertemuan) dalam sebulan

export default function PrintJurnalGuru({ guru, bulan, tahun }: Props) {
  const rows = Array.from({ length: ROWS }, (_, i) => i + 1)

  return (
    <div className="print-area p-4" style={{ fontFamily: 'Arial, sans-serif', fontSize: '9px' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '4px' }}>
          <img src="/logo-tpq.png" alt="Logo" style={{ width: '50px', height: '50px', objectFit: 'contain' }} />
          <div>
            <div style={{ fontSize: '13px', fontWeight: 'bold', textTransform: 'uppercase' }}>
              Jurnal Harian Mengajar Ustadzah
            </div>
            <div style={{ fontSize: '12px', fontWeight: 'bold' }}>TPQ Darussalam Kemantren</div>
            <div style={{ fontSize: '11px' }}>Tahun Ajaran {tahun}/{tahun + 1}</div>
          </div>
        </div>
      </div>

      {/* Info */}
      <div style={{ display: 'flex', gap: '24px', marginBottom: '8px', fontSize: '10px' }}>
        <div>
          Bulan : <strong>{BULAN[bulan]} {tahun}</strong>
        </div>
        <div>
          Nama Ustadzah : <strong>{guru?.nama || '-'}</strong>
        </div>
      </div>

      {/* Tabel */}
      <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
        <colgroup>
          <col style={{ width: '22px' }} />  {/* TM */}
          <col style={{ width: '30px' }} />  {/* Tgl */}
          <col style={{ width: '30px' }} />  {/* Jld/Surat */}
          <col style={{ width: '30px' }} />  {/* Hal/Ayat */}
          <col style={{ width: '20px' }} />  {/* Juz */}
          <col style={{ width: '24px' }} />  {/* Ghorib Hal */}
          <col style={{ width: '50px' }} />  {/* Ghorib Materi */}
          <col style={{ width: '24px' }} />  {/* Tajwid Hal */}
          <col style={{ width: '50px' }} />  {/* Tajwid Materi */}
          <col style={{ width: '40px' }} />  {/* Hafalan Surat */}
          <col style={{ width: '28px' }} />  {/* Hafalan Ayat */}
          <col style={{ width: '45px' }} />  {/* Materi Latin */}
          <col style={{ width: '30px' }} />  {/* Paraf */}
        </colgroup>
        <thead>
          <tr>
            <th rowSpan={2} style={thStyle}>TM</th>
            <th rowSpan={2} style={thStyle}>Tgl</th>
            <th colSpan={3} style={thStyle}>Ummi / Al-Qur'an</th>
            <th colSpan={2} style={thStyle}>Ghorib</th>
            <th colSpan={2} style={thStyle}>Tajwid</th>
            <th colSpan={2} style={thStyle}>Hafalan</th>
            <th rowSpan={2} style={thStyle}>Materi Latin</th>
            <th rowSpan={2} style={thStyle}>Paraf</th>
          </tr>
          <tr>
            <th style={thStyle}>Jld/Surat</th>
            <th style={thStyle}>Hal/Ayat</th>
            <th style={thStyle}>Juz</th>
            <th style={thStyle}>Hal</th>
            <th style={thStyle}>Materi</th>
            <th style={thStyle}>Hal</th>
            <th style={thStyle}>Materi</th>
            <th style={thStyle}>Surat</th>
            <th style={thStyle}>Ayat</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(i => (
            <tr key={i}>
              <td style={tdStyle}>{i}</td>
              <td style={tdStyle}></td>
              <td style={tdStyle}></td>
              <td style={tdStyle}></td>
              <td style={tdStyle}></td>
              <td style={tdStyle}></td>
              <td style={tdStyle}></td>
              <td style={tdStyle}></td>
              <td style={tdStyle}></td>
              <td style={tdStyle}></td>
              <td style={tdStyle}></td>
              <td style={tdStyle}></td>
              <td style={tdStyle}></td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Footer TTD */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px', fontSize: '10px' }}>
        <div style={{ textAlign: 'center', width: '180px' }}>
          <div>Sidoarjo, {BULAN[bulan]} {tahun}</div>
          <div>Ustadzah</div>
          <div style={{ marginTop: '50px', borderTop: '1px solid black', paddingTop: '4px' }}>
            ({guru?.nama || '__________________'})
          </div>
        </div>
      </div>
    </div>
  )
}

const thStyle: React.CSSProperties = {
  border: '1px solid black',
  padding: '3px 2px',
  textAlign: 'center',
  backgroundColor: '#f0fdf4',
  fontWeight: 'bold',
  fontSize: '8px',
}

const tdStyle: React.CSSProperties = {
  border: '1px solid black',
  padding: '1px 2px',
  textAlign: 'center',
  height: '18px',
  fontSize: '8px',
}
