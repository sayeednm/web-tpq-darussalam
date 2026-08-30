'use client'

import { Santri, Kelas, Guru } from '@/lib/types'

const BULAN = [
  'Januari','Februari','Maret','April','Mei','Juni',
  'Juli','Agustus','September','Oktober','November','Desember'
]

function getDaysInMonth(bulan: number, tahun: number) {
  return new Date(tahun, bulan + 1, 0).getDate()
}

interface Props {
  santriList: Santri[]
  kelas?: Kelas
  guru?: Guru
  bulan: number
  tahun: number
}

export default function PrintDaftarHadir({ santriList, kelas, guru, bulan, tahun }: Props) {
  const totalDays = getDaysInMonth(bulan, tahun)
  const days = Array.from({ length: totalDays }, (_, i) => i + 1)

  return (
    <div className="print-area p-4" style={{ fontFamily: 'Arial, sans-serif', fontSize: '10px' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '4px' }}>
          <img src="/logo-tpq.png" alt="Logo" style={{ width: '50px', height: '50px', objectFit: 'contain' }} />
          <div>
            <div style={{ fontSize: '13px', fontWeight: 'bold', textTransform: 'uppercase' }}>
              Daftar Hadir Ngaji Metode Ummi
            </div>
            <div style={{ fontSize: '12px', fontWeight: 'bold' }}>TPQ Darussalam Kemantren</div>
            <div style={{ fontSize: '11px' }}>Tahun Ajaran {tahun}/{tahun + 1}</div>
          </div>
        </div>
      </div>

      {/* Info */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '10px' }}>
        <div>
          <span>Jilid / Tgk : </span>
          <span style={{ borderBottom: '1px solid black', display: 'inline-block', minWidth: '80px' }}>&nbsp;</span>
        </div>
        <div>
          <span>Bulan : </span>
          <span style={{ fontWeight: 'bold' }}>{BULAN[bulan]} {tahun}</span>
        </div>
        <div>
          <span>Kelas : </span>
          <span style={{ fontWeight: 'bold' }}>{kelas?.nama || '-'}</span>
        </div>
        <div>
          <span>Hal / No.Surat / Ayat : </span>
          <span style={{ borderBottom: '1px solid black', display: 'inline-block', minWidth: '80px' }}>&nbsp;</span>
        </div>
      </div>

      {/* Tabel */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          tableLayout: 'fixed',
        }}>
          <colgroup>
            <col style={{ width: '24px' }} />
            <col style={{ width: '120px' }} />
            {days.map(d => <col key={d} style={{ width: '18px' }} />)}
          </colgroup>
          <thead>
            <tr>
              <th style={thStyle}>No</th>
              <th style={thStyle}>Nama</th>
              {days.map(d => (
                <th key={d} style={{ ...thStyle, fontSize: '9px', padding: '2px 1px' }}>{d}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {santriList.length === 0 ? (
              <tr>
                <td colSpan={2 + totalDays} style={{ textAlign: 'center', padding: '20px', color: '#999' }}>
                  Tidak ada santri di kelas ini
                </td>
              </tr>
            ) : (
              santriList.map((s, idx) => (
                <tr key={s.id}>
                  <td style={tdStyle}>{idx + 1}</td>
                  <td style={{ ...tdStyle, textAlign: 'left', paddingLeft: '4px' }}>{s.nama}</td>
                  {days.map(d => (
                    <td key={d} style={{ ...tdStyle, minHeight: '18px' }}>&nbsp;</td>
                  ))}
                </tr>
              ))
            )}
            {/* Baris kosong tambahan sampai 25 baris */}
            {Array.from({ length: Math.max(0, 25 - santriList.length) }).map((_, i) => (
              <tr key={`empty-${i}`}>
                <td style={tdStyle}>&nbsp;</td>
                <td style={tdStyle}>&nbsp;</td>
                {days.map(d => <td key={d} style={tdStyle}>&nbsp;</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer TTD */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px', fontSize: '10px' }}>
        <div style={{ textAlign: 'center', width: '160px' }}>
          <div>Koordinator</div>
          <div style={{ marginTop: '50px', borderTop: '1px solid black', paddingTop: '4px' }}>
            (__________________)
          </div>
        </div>
        <div style={{ textAlign: 'center', width: '160px' }}>
          <div>Ustadz / ah</div>
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
  fontSize: '9px',
}

const tdStyle: React.CSSProperties = {
  border: '1px solid black',
  padding: '2px',
  textAlign: 'center',
  height: '20px',
  fontSize: '9px',
}
