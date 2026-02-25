import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import Stats from '@/components/Stats'
import Keunggulan from '@/components/Keunggulan'
import MetodeUmmi from '@/components/MetodeUmmi'
import Program from '@/components/Program'
import Galeri from '@/components/Galeri'
import Daftar from '@/components/Daftar'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <Stats />
      <Keunggulan />
      <MetodeUmmi />
      <Program />
      <Galeri />
      <Daftar />
      <Footer />
    </main>
  )
}
