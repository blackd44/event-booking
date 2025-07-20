import Footer from './footer'
import { Header } from './header'
import { Outlet } from 'react-router-dom'

export default function DefaultLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className='grow'>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
