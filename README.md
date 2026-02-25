# TPQ Darussalam - Landing Page

Landing page modern untuk TPQ Darussalam dengan Metode Ummi.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Animation**: Framer Motion
- **Language**: TypeScript

## Fitur

- ✅ Responsive design (mobile-first)
- ✅ Modern & clean UI dengan palet warna Islami
- ✅ Smooth animations dengan Framer Motion
- ✅ SEO-friendly
- ✅ Accessibility compliant
- ✅ Fast performance

## Instalasi

1. Install dependencies:
```bash
npm install
```

2. Jalankan development server:
```bash
npm run dev
```

3. Buka browser di [http://localhost:3000](http://localhost:3000)

## Build untuk Production

```bash
npm run build
npm start
```

## Struktur Project

```
├── app/
│   ├── layout.tsx       # Root layout
│   ├── page.tsx         # Home page
│   └── globals.css      # Global styles
├── components/
│   ├── Navbar.tsx       # Navigation bar
│   ├── Hero.tsx         # Hero section
│   ├── Keunggulan.tsx   # Features section
│   ├── MetodeUmmi.tsx   # Ummi method section
│   ├── Program.tsx      # Programs section
│   ├── Daftar.tsx       # Registration form
│   └── Footer.tsx       # Footer
└── public/              # Static assets
```

## Customization

### Warna
Edit `tailwind.config.js` untuk mengubah palet warna:
- Primary: Emerald (hijau)
- Accent: Amber (emas)

### Konten
Edit file komponen di folder `components/` untuk mengubah teks dan konten.

### Kontak
Update informasi kontak di `components/Footer.tsx`

## License

© 2026 TPQ Darussalam. All rights reserved.
