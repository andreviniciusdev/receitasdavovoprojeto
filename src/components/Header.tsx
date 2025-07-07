
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChefHat, User, LogOut } from 'lucide-react';

export function Header() {
  const navigate = useNavigate();
  const userName = localStorage.getItem('userName');
  
  const handleLogout = () => {
    localStorage.removeItem('userName');
    navigate('/login');
  };

  const navItems = [
    { to: '/', label: 'Home' },
    { to: '/receitas', label: 'Receitas' },
    { to: '/nova', label: 'Nova Receita' },
    { to: '/editar', label: 'Editar' },
    { to: '/perfil', label: 'Perfil' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center space-x-6">
          <NavLink to="/" className="flex items-center space-x-2 text-2xl font-bold text-black">
            <ChefHat className="h-8 w-8" />
            <span className="font-poppins">Receitas da Vovó</span>
          </NavLink>
          
          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors hover:text-culinary-salmon-600 ${
                    isActive ? 'text-culinary-salmon-600 border-b-2 border-culinary-salmon-600' : 'text-muted-foreground'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="flex items-center space-x-4">
          {userName && (
            <span className="hidden sm:block text-sm text-muted-foreground">
              Olá, {userName}!
            </span>
          )}
          {userName ? (
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
            </Button>
          ) : (
            <NavLink to="/login">
              <Button variant="ghost" size="sm">
                <User className="h-4 w-4 mr-2" />
                Login
              </Button>
            </NavLink>
          )}
        </div>
      </div>
    </header>
  );
}
