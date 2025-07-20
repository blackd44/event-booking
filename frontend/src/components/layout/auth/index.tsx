import { Header } from '../dafault/header'
import { Outlet } from 'react-router-dom'

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex flex-col gradient-bg-light">
      <Header />
      <main className='grow'>
        <Outlet />
      </main>
    </div>
  )
}
