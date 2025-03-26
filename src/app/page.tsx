import { Footer } from '@/components/layout/footer'
import { Header } from '@/components/layout/header'
import { Cases } from '@/components/sections/cases'
import { Company } from '@/components/sections/company'
import { Hero } from '@/components/sections/hero'
import { Process } from '@/components/sections/process'
import { Services } from '@/components/sections/services'

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Services />
        <Process />
        <Cases />
        <Company />
      </main>
      <Footer />
    </>
  )
}
