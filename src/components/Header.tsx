import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { VistaLogo } from "./VistaLogo";
import { useAuthStore } from "@/stores/auth.store";
import { LogOut, User } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";

export function Header() {
  const { isAuth, logout } = useAuthStore();
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate({ to: "/auth/login" });
  };

  return (
    <header className="max-w-6xl mx-auto fixed top-0 left-0 right-0 z-50 bg-white rounded-full mt-6 shadow-lg border border-gray-100">
      <div className="max-w-6xl mx-auto px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <VistaLogo size="lg" isLink={true} />

            <nav className="hidden md:flex items-center space-x-8">
              <a
                href="#"
                className="text-gray-600 hover:text-gray-900 transition-colors text-sm"
              >
                Como funciona
              </a>
              <a
                href="#"
                className="text-gray-600 hover:text-gray-900 transition-colors text-sm"
              >
                Blog
              </a>
            </nav>
          </div>

          {!isAuth ? (
            <div className="flex items-center space-x-2">
              <Link to="/auth/register">
                <Button variant="outline" className="rounded-full">
                  Cadastrar
                </Button>
              </Link>
              <Link to="/auth/login">
                <Button variant="default" className="rounded-full">
                  Entrar
                </Button>
              </Link>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <nav className="hidden md:flex items-center space-x-4 mr-4">
                <Link to="/">
                  <Button variant="ghost" className="text-gray-600 hover:text-gray-900">
                    Buscar Candidatos
                  </Button>
                </Link>
                <Link to="/analyses">
                  <Button variant="ghost" className="text-gray-600 hover:text-gray-900">
                    Minhas Análises
                  </Button>
                </Link>
              </nav>
              
              <Link to="/profile">
                <Button variant="outline" className="rounded-full">
                  <User className="w-4 h-4" /> Perfil
                </Button>
              </Link>

              <Button variant="outline" className="rounded-full text-red-500" onClick={handleLogout}>
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
