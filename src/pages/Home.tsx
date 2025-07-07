
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ChefHat, BookOpen, Plus, Edit, User } from 'lucide-react';

export default function Home() {
  const userName = localStorage.getItem('userName');

  const features = [
    {
      icon: BookOpen,
      title: 'Explorar Receitas',
      description: 'Descubra receitas deliciosas para todas as ocasiões',
      link: '/receitas',
      color: 'text-culinary-salmon-500'
    },
    {
      icon: Plus,
      title: 'Criar Receita',
      description: 'Compartilhe suas criações culinárias',
      link: '/nova',
      color: 'text-culinary-cream-600'
    },
    {
      icon: Edit,
      title: 'Editar Receitas',
      description: 'Gerencie e atualize suas receitas favoritas',
      link: '/editar',
      color: 'text-culinary-brown-600'
    },
    {
      icon: User,
      title: 'Meu Perfil',
      description: 'Visualize suas informações pessoais',
      link: '/perfil',
      color: 'text-culinary-salmon-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-culinary-cream-50 to-culinary-brown-50">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="animate-float mb-8">
            <ChefHat className="h-24 w-24 mx-auto text-culinary-salmon-500" />
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold font-poppins mb-6 text-black animate-fade-in">
            Receitas da Vovó
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-fade-in">
            {userName ? `Bem-vindo de volta, ${userName}!` : 'Bem-vindo ao'} seu cantinho especial para descobrir, criar e compartilhar receitas incríveis
          </p>
          
          {!userName && (
            <NavLink to="/login">
              <Button size="lg" className="bg-culinary-salmon-500 hover:bg-culinary-salmon-600 text-white">
                Começar Agora
              </Button>
            </NavLink>
          )}
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 font-poppins">
            Explore as Funcionalidades
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="group glass-card hover-lift border-0 shadow-lg">
                <CardContent className="p-6 text-center">
                  <feature.icon className={`h-12 w-12 mx-auto mb-4 ${feature.color} group-hover:scale-110 transition-transform`} />
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground mb-4">{feature.description}</p>
                  <NavLink to={feature.link}>
                    <Button variant="outline" className="w-full group-hover:bg-culinary-salmon-50">
                      Acessar
                    </Button>
                  </NavLink>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 px-4 bg-white/50">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="animate-fade-in">
              <div className="text-4xl font-bold text-culinary-salmon-600 mb-2">100+</div>
              <p className="text-muted-foreground">Receitas Disponíveis</p>
            </div>
            <div className="animate-fade-in">
              <div className="text-4xl font-bold text-culinary-cream-600 mb-2">50+</div>
              <p className="text-muted-foreground">Categorias Diferentes</p>
            </div>
            <div className="animate-fade-in">
              <div className="text-4xl font-bold text-culinary-brown-600 mb-2">1K+</div>
              <p className="text-muted-foreground">Usuários Satisfeitos</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
