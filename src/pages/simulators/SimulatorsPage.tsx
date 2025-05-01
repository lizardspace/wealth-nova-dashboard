
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Home, Landmark, PiggyBank, Calculator } from 'lucide-react';
import { Link } from 'react-router-dom';

const simulators = [
  {
    id: 'retirement',
    title: 'Simulateur Retraite',
    description: 'Estimez vos besoins pour une retraite sereine',
    icon: PiggyBank,
    color: 'text-eparnova-blue',
  },
  {
    id: 'real-estate',
    title: 'Simulateur Crédit Immobilier',
    description: 'Calculez votre capacité d\'emprunt immobilier',
    icon: Home,
    color: 'text-eparnova-green',
  },
  {
    id: 'savings',
    title: 'Simulateur d\'Épargne',
    description: 'Projetez l\'évolution de votre épargne',
    icon: Calculator,
    color: 'text-eparnova-gold',
  },
  {
    id: 'inheritance',
    title: 'Simulateur Succession',
    description: 'Anticipez la transmission de votre patrimoine',
    icon: Landmark,
    color: 'text-purple-500',
  },
  {
    id: 'investment',
    title: 'Simulateur d\'Investissement',
    description: 'Comparez différentes stratégies de placement',
    icon: Activity,
    color: 'text-blue-500',
  },
];

const SimulatorsPage = () => {
  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-eparnova-blue">Simulateurs</h1>
        <p className="text-muted-foreground mt-1">Utilisez nos outils de simulation pour préparer votre avenir financier</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {simulators.map((simulator) => (
          <Link key={simulator.id} to={`/simulators/${simulator.id}`}>
            <Card className="h-full hover:shadow-md transition-all cursor-pointer border border-transparent hover:border-eparnova-blue/20">
              <CardHeader>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${simulator.color} bg-opacity-10 bg-current`}>
                  <simulator.icon className={`h-6 w-6 ${simulator.color}`} />
                </div>
                <CardTitle className="text-xl">{simulator.title}</CardTitle>
                <CardDescription>{simulator.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">
                  Cliquez pour commencer la simulation
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="bg-muted/20 rounded-lg p-6 mt-8">
        <h2 className="text-xl font-bold text-eparnova-blue mb-2">Besoin d'aide avec les simulations ?</h2>
        <p className="text-muted-foreground mb-4">
          Nos conseillers peuvent vous aider à interpréter les résultats et à élaborer une stratégie adaptée à votre situation.
        </p>
        <Link to="/appointments" className="text-eparnova-blue font-medium hover:underline">
          Prendre rendez-vous avec un conseiller →
        </Link>
      </div>
    </div>
  );
};

export default SimulatorsPage;
