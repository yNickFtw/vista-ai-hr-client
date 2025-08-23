
import { Header } from '@/components/Header'
import { useAuthStore } from '@/stores/auth.store'
import { createFileRoute, Navigate, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/(private-routes)')({
  component: RouteComponent,
})

function RouteComponent() {

  const { isAuth } = useAuthStore();

  if (!isAuth) {
    return <Navigate to="/auth/login" />
  }

  return (
    <>
      <div className="w-full px-4 py-10">
        <Header />
      </div>
      <Outlet />
    </>
  ) 
}
