import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
} from 'recharts';

// Données fictives
const encoursTotalData = [
  { name: 'Jan', reels: 1200000, theoriques: 2800000 },
  { name: 'Fév', reels: 1300000, theoriques: 2900000 },
  { name: 'Mars', reels: 1500000, theoriques: 3000000 },
  { name: 'Avr', reels: 1700000, theoriques: 2950000 },
  { name: 'Mai', reels: 1950000, theoriques: 3100000 },
];

const repartitionActifs = [
  { name: 'Immobilier', value: 55 },
  { name: 'Assurance vie', value: 20 },
  { name: 'PER', value: 10 },
  { name: 'Liquidités', value: 8 },
  { name: 'Actions', value: 5 },
  { name: 'Autre', value: 2 },
];

const COLORS = ['#8B5CF6', '#D946EF', '#F97316', '#0EA5E9', '#22D3EE', '#A3E635'];

const clientsEncoursData = [
  {
    id: 1,
    nom: 'Dupont',
    prenom: 'Jean',
    encoursReel: 350000,
    encoursTheorique: 750000,
    tauxConversion: 46.6,
  },
  {
    id: 2,
    nom: 'Martin',
    prenom: 'Sophie',
    encoursReel: 420000,
    encoursTheorique: 620000,
    tauxConversion: 67.7,
  },
  {
    id: 3,
    nom: 'Bernard',
    prenom: 'Pierre',
    encoursReel: 180000,
    encoursTheorique: 900000,
    tauxConversion: 20.0,
  },
  {
    id: 4,
    nom: 'Petit',
    prenom: 'Marie',
    encoursReel: 550000,
    encoursTheorique: 750000,
    tauxConversion: 73.3,
  },
  {
    id: 5,
    nom: 'Robert',
    prenom: 'Antoine',
    encoursReel: 400000,
    encoursTheorique: 480000,
    tauxConversion: 83.3,
  },
];

const VueGlobalePage = () => {
  const [periode, setPeriode] = useState('6mois');

  const totalReels = clientsEncoursData.reduce((sum, client) => sum + (client.encoursReel || 0), 0);
  const totalTheoriques = clientsEncoursData.reduce(
    (sum, client) => sum + (client.encoursTheorique || 0),
    0
  );
  const tauxConversionGlobal =
    totalTheoriques > 0 ? ((totalReels / totalTheoriques) * 100).toFixed(1) : '0.0';

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Vue globale des portefeuilles</h1>
        <div className="flex gap-2">
          <Select value={periode} onValueChange={setPeriode}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Période" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1mois">1 mois</SelectItem>
              <SelectItem value="3mois">3 mois</SelectItem>
              <SelectItem value="6mois">6 mois</SelectItem>
              <SelectItem value="1an">1 an</SelectItem>
              <SelectItem value="3ans">3 ans</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">Exporter</Button>
        </div>
      </div>

      {/* Tuiles récapitulatives */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Encours réel</CardDescription>
            <CardTitle className="text-2xl text-blue-600">
              {(totalReels / 1000000).toFixed(2)} M€
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">+12,5% depuis 3 mois</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Encours théorique</CardDescription>
            <CardTitle className="text-2xl">{(totalTheoriques / 1000000).toFixed(2)} M€</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">+5,2% depuis 3 mois</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Taux de conversion</CardDescription>
            <CardTitle className="text-2xl text-emerald-600">{tauxConversionGlobal}%</CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={parseFloat(tauxConversionGlobal)} className="h-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Clients actifs</CardDescription>
            <CardTitle className="text-2xl">125 / 342</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">36,5% du total</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="evolution" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="evolution">Évolution temporelle</TabsTrigger>
          <TabsTrigger value="repartition">Répartition des actifs</TabsTrigger>
          <TabsTrigger value="topclients">Top clients</TabsTrigger>
        </TabsList>

        {/* Onglet 1: Évolution temporelle */}
        <TabsContent value="evolution">
          <Card>
            <CardHeader>
              <CardTitle>Évolution des encours</CardTitle>
              <CardDescription>
                Évolution des encours réels et théoriques sur la période
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              {/* Augmenté la hauteur de 380px à 400px */}
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={encoursTotalData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={value => `${(Number(value) / 1000000).toFixed(2)} M€`} />
                  <Legend wrapperStyle={{ paddingTop: '15px' }} />
                  <Line
                    type="monotone"
                    dataKey="reels"
                    name="Encours réels"
                    stroke="#8B5CF6"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="theoriques"
                    name="Encours théoriques"
                    stroke="#64748B"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet 2: Répartition des actifs */}
        <TabsContent value="repartition">
          <Card>
            <CardHeader>
              <CardTitle>Répartition par classe d'actifs</CardTitle>
              <CardDescription>Distribution des encours par type d'actifs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="h-[320px]">
                  {/* Augmenté la hauteur de 280px à 320px */}
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                      <Pie
                        data={repartitionActifs}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={110}
                        /* Ajusté le rayon pour mieux s'adapter à la nouvelle hauteur */
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {repartitionActifs.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={value => `${value}%`} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="h-[320px]">
                  {/* Augmenté la hauteur de 280px à 320px */}
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={repartitionActifs}
                      layout="vertical"
                      margin={{ top: 20, right: 30, left: 40, bottom: 5 }}
                      /* Augmenté la marge gauche pour mieux afficher les étiquettes */
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" width={100} />
                      {/* Défini une largeur fixe pour les étiquettes */}
                      <Tooltip formatter={value => `${value}%`} />
                      <Legend wrapperStyle={{ paddingTop: '15px' }} />
                      <Bar dataKey="value" name="Pourcentage" fill="#8B5CF6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet 3: Top clients */}
        <TabsContent value="topclients">
          <Card>
            <CardHeader>
              <CardTitle>Top 5 clients par encours</CardTitle>
              <CardDescription>Clients disposant des encours les plus importants</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Client</th>
                      <th className="text-right py-3 px-4">Encours réel</th>
                      <th className="text-right py-3 px-4">Encours théorique</th>
                      <th className="text-right py-3 px-4">Taux de conversion</th>
                      <th className="text-center py-3 px-4">Progression</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clientsEncoursData.map(client => (
                      <tr key={client.id} className="border-b hover:bg-muted/50">
                        <td className="py-3 px-4">
                          {client.prenom} {client.nom}
                        </td>
                        <td className="text-right py-3 px-4 font-medium">
                          {new Intl.NumberFormat('fr-FR', {
                            style: 'currency',
                            currency: 'EUR',
                            maximumFractionDigits: 0,
                          }).format(client.encoursReel)}
                        </td>
                        <td className="text-right py-3 px-4">
                          {new Intl.NumberFormat('fr-FR', {
                            style: 'currency',
                            currency: 'EUR',
                            maximumFractionDigits: 0,
                          }).format(client.encoursTheorique)}
                        </td>
                        <td className="text-right py-3 px-4">
                          <span
                            className={`font-medium ${client.tauxConversion > 50 ? 'text-emerald-600' : 'text-amber-600'}`}
                          >
                            {client.tauxConversion}%
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="w-full flex items-center">
                            <Progress value={client.tauxConversion} className="h-2" />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VueGlobalePage;
