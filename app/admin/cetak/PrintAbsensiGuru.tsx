'use client'

import { Guru } from '@/lib/types'

const BULAN = [
  'Januari','Februari','Maret','April','Mei','Juni',
  'Juli','Agustus','September','Oktober','November','Desember'
]

function getActiveDays(bulan: number, tahun: number) {
  const total = new Date(tahun, bulan + 1, 0).getDate()
  return Array.from({ length: total }, (_, i) => i + 1)
}

interface Props {
  guruList: Guru[]
  bulan: number
  tahun: number
}

export default function PrintAbsensiGuru({ guruList, bulan, tahun }: Props) {
  const days = getActiveDays(bulan, tahun)

  // Kelompokkan per 7 hari supaya muat di kertas A4
  const chunkSize = 7
  const chunks: number[][] = []
  for (let i = 0; i < days.length; i += chunkSize) {
    chunks.push(days.slice(i, i + chunkSize))
  }

  return (
    <div className="print-area p-4" style={{ fontFamily: 'Arial, sans-serif', fontSize: '9px' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '4px' }}>
          <img src="/logo-tpq.png" alt="Logo" style={{ width: '50px', height: '50px', objectFit: 'contain' }} />
          <div>
            <div style={{ fontSize: '13px', fontWeight: 'bold', textTransform: 'uppercase' }}>
              Daftar Absen Ustadz / Ustadzah
            </div>
            <div style={{ fontSize: '12px', fontWeight: 'bold' }}>TKA-TPA &amp; TQA — TPQ Darussalam</div>
            <div style={{ fontSize: '10px' }}>
              Unit : Darussalam &nbsp;&nbsp; Bulan : <strong>{BULAN[bulan]} {tahun}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Render per chunk 7 hari */}
      {chunks.map((chunk, ci) => (
        <div key={ci} style={{ marginBottom: '16px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
            <thead>
              {/* Baris 1: header tanggal */}
              <tr>
                <th rowSpan={3} style={{ ...thStyle, width: '20px' }}>No</th>
                <th rowSpan={3} style={{ ...thStyle, width: '90px' }}>Nama</th>
                {chunk.map(d => (
                  <th key={`tgl-${d}`} colSpan={4} style={thStyle}>
                    Tgl {d}/{bulan + 1}/{String(tahun).slice(-2)}
                  </th>
                ))}
              </tr>
              {/* Baris 2: Datang / Pulang */}
              <tr>
                {chunk.map(d => [
                  <th key={`dth-${d}`} colSpan={2} style={thStyle}>Datang</th>,
                  <th key={`pth-${d}`} colSpan={2} style={thStyle}>Pulang</th>,
                ])}
              </tr>
              {/* Baris 3: Pukul / TTD */}
              <tr>
                {chunk.map(d => [
                  <th key={`pk1-${d}`} style={{ ...thStyle, width: '24px' }}>Pukul</th>,
                  <th key={`td1-${d}`} style={{ ...thStyle, width: '28px' }}>TTD</th>,
                  <th key={`pk2-${d}`} style={{ ...thStyle, width: '24px' }}>Pukul</th>,
                  <th key={`td2-${d}`} style={{ ...thStyle, width: '28px' }}>TTD</th>,
                ])}
              </tr>
            </thead>
            <tbody>
              {guruList.length === 0 ? (
                <tr>
                  <td colSpan={2 + chunk.length * 4} style={{ textAlign: 'center', padding: '10px', color: '#999' }}>
                    Tidak ada data guru
                  </td>
                </tr>
              ) : (
                guruList.map((g, idx) => (
                  <tr key={g.id}>
                    <td style={tdStyle}>{idx + 1}</td>
                    <td style={{ ...tdStyle, textAlign: 'left', paddingLeft: '3px' }}>{g.nama}</td>
                    {chunk.map(d => [
                      <td key={`a-${d}`} style={tdStyle}></td>,
                      <td key={`b-${d}`} style={tdStyle}></td>,
                      <td key={`c-${d}`} style={tdStyle}></td>,
                      <td key={`e-${d}`} style={tdStyle}></td>,
                    ])}
                  </tr>
                ))
              )}
              {/* Baris kosong tambahan */}
              {Array.from({ length: Math.max(0, 5 - guruList.length) }).map((_, i) => (
                <tr key={`empty-${i}`}>
                  <td style={tdStyle}>&nbsp;</td>
                  <td style={tdStyle}>&nbsp;</td>
                  {chunk.map(d => [
                    <td key={`ea-${d}`} style={tdStyle}>&nbsp;</td>,
                    <td key={`eb-${d}`} style={tdStyle}>&nbsp;</td>,
                    <td key={`ec-${d}`} style={tdStyle}>&nbsp;</td>,
                    <td key={`ed-${d}`} style={tdStyle}>&nbsp;</td>,
                  ])}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}

      {/* Footer TTD */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px', fontSize: '10px' }}>
        <div style={{ textAlign: 'center', width: '160px' }}>
          <div>Mengetahui,</div>
          <div>Kepala Sekolah</div>
          <div style={{ marginTop: '50px', borderTop: '1px solid black', paddingTop: '4px' }}>
            (__________________)
          </div>
        </div>
        <div style={{ textAlign: 'center', width: '160px' }}>
          <div>Koordinator</div>
          <div style={{ marginTop: '50px', borderTop: '1px solid black', paddingTop: '4px' }}>
            (__________________)
          </div>
        </div>
      </div>
    </div>
  )
}

const thStyle: React.CSSProperties = {
  border: '1px solid black',
  padding: '2px 1px',
  textAlign: 'center',
  backgroundColor: '#f0fdf4',
  fontWeight: 'bold',
  fontSize: '7px',
}

const tdStyle: React.CSSProperties = {
  border: '1px solid black',
  padding: '1px',
  textAlign: 'center',
  height: '20px',
  fontSize: '8px',
}
