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
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Search, FileDown, ArrowUpDown, TrendingUp } from 'lucide-react';

// Données fictives pour les encours théoriques
const historicData = [
  {
    mois: 'Jan',
    immobilier: 1200000,
    assuranceVie: 580000,
    per: 320000,
    epargne: 350000,
    autre: 150000,
  },
  {
    mois: 'Fév',
    immobilier: 1220000,
    assuranceVie: 600000,
    per: 335000,
    epargne: 360000,
    autre: 155000,
  },
  {
    mois: 'Mars',
    immobilier: 1250000,
    assuranceVie: 625000,
    per: 345000,
    epargne: 375000,
    autre: 165000,
  },
  {
    mois: 'Avr',
    immobilier: 1250000,
    assuranceVie: 650000,
    per: 360000,
    epargne: 390000,
    autre: 170000,
  },
  {
    mois: 'Mai',
    immobilier: 1250000,
    assuranceVie: 680000,
    per: 380000,
    epargne: 405000,
    autre: 185000,
  },
  {
    mois: 'Juin',
    immobilier: 1270000,
    assuranceVie: 700000,
    per: 400000,
    epargne: 425000,
    autre: 205000,
  },
];

// Données pour la répartition par actif
const repartitionData = [
  { name: 'Immobilier', value: 1270000, color: '#8B5CF6' },
  { name: 'Assurance Vie', value: 700000, color: '#D946EF' },
  { name: 'PER', value: 400000, color: '#F97316' },
  { name: 'Épargne', value: 425000, color: '#0EA5E9' },
  { name: 'Autre', value: 205000, color: '#22D3EE' },
];

// Données pour les opportunités de conversion
const opportunitesData = [
  {
    id: 1,
    nom: 'Dupont',
    prenom: 'Jean',
    encoursTheorique: 750000,
    encoursReel: 350000,
    potentiel: 400000,
    tauxConversion: 47,
    dernierContact: '15/04/2025',
    produits: 'Immobilier, Assurance vie',
  },
  {
    id: 2,
    nom: 'Martin',
    prenom: 'Sophie',
    encoursTheorique: 620000,
    encoursReel: 420000,
    potentiel: 200000,
    tauxConversion: 68,
    dernierContact: '02/04/2025',
    produits: 'Assurance vie, PER',
  },
  {
    id: 3,
    nom: 'Bernard',
    prenom: 'Pierre',
    encoursTheorique: 900000,
    encoursReel: 180000,
    potentiel: 720000,
    tauxConversion: 20,
    dernierContact: '22/03/2025',
    produits: 'Immobilier, Épargne',
  },
  {
    id: 4,
    nom: 'Petit',
    prenom: 'Marie',
    encoursTheorique: 750000,
    encoursReel: 550000,
    potentiel: 200000,
    tauxConversion: 73,
    dernierContact: '12/04/2025',
    produits: 'Assurance vie, PER, SCPI',
  },
  {
    id: 5,
    nom: 'Robert',
    prenom: 'Antoine',
    encoursTheorique: 480000,
    encoursReel: 400000,
    potentiel: 80000,
    tauxConversion: 83,
    dernierContact: '10/04/2025',
    produits: 'Assurance vie, PER',
  },
];

// Données pour les clients
const clientsData = [
  {
    id: 1,
    nom: 'Dupont',
    prenom: 'Jean',
    immobilier: 380000,
    assuranceVie: 180000,
    per: 120000,
    epargne: 50000,
    autre: 20000,
    total: 750000,
  },
  {
    id: 2,
    nom: 'Martin',
    prenom: 'Sophie',
    immobilier: 220000,
    assuranceVie: 250000,
    per: 80000,
    epargne: 60000,
    autre: 10000,
    total: 620000,
  },
  {
    id: 3,
    nom: 'Bernard',
    prenom: 'Pierre',
    immobilier: 650000,
    assuranceVie: 110000,
    per: 40000,
    epargne: 80000,
    autre: 20000,
    total: 900000,
  },
  {
    id: 4,
    nom: 'Petit',
    prenom: 'Marie',
    immobilier: 280000,
    assuranceVie: 290000,
    per: 150000,
    epargne: 30000,
    autre: 0,
    total: 750000,
  },
  {
    id: 5,
    nom: 'Robert',
    prenom: 'Antoine',
    immobilier: 0,
    assuranceVie: 200000,
    per: 110000,
    epargne: 130000,
    autre: 40000,
    total: 480000,
  },
];

const COLORS = ['#8B5CF6', '#D946EF', '#F97316', '#0EA5E9', '#22D3EE'];

const EncoursTheoriquesPage = () => {
  const [periode, setPeriode] = useState('6mois');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortColumn, setSortColumn] = useState('total');
  const [sortDirection, setSortDirection] = useState('desc');
  const [opportunitesTab, setOpportunitesTab] = useState('potentiel');

  // Calcul du total des encours
  const totalEncours = repartitionData.reduce((sum, item) => sum + item.value, 0);
  const totalEncoursReel = opportunitesData.reduce((sum, item) => sum + item.encoursReel, 0);
  const potentielTotal = opportunitesData.reduce((sum, item) => sum + item.potentiel, 0);

  // Préparation des données pour l'affichage des tableaux
  const formattedClients = [...clientsData]
    .sort((a, b) => {
      if (sortDirection === 'asc') {
        return a[sortColumn as keyof typeof a] > b[sortColumn as keyof typeof b] ? 1 : -1;
      } else {
        return a[sortColumn as keyof typeof a] < b[sortColumn as keyof typeof b] ? 1 : -1;
      }
    })
    .filter(
      client =>
        client.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.prenom.toLowerCase().includes(searchTerm.toLowerCase())
    );

  // Préparation des données pour l'affichage des opportunités
  const formattedOpportunites = [...opportunitesData].sort((a, b) => {
    if (opportunitesTab === 'potentiel') {
      return b.potentiel - a.potentiel;
    } else if (opportunitesTab === 'conversion') {
      return a.tauxConversion - b.tauxConversion;
    } else {
      return (
        new Date(b.dernierContact.split('/').reverse().join('-')).getTime() -
        new Date(a.dernierContact.split('/').reverse().join('-')).getTime()
      );
    }
  });

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('desc');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Encours théoriques</h1>
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
          <Button variant="outline">
            <FileDown className="mr-2 h-4 w-4" />
            Exporter
          </Button>
        </div>
      </div>

      {/* Tuiles récapitulatives */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total encours théoriques</CardDescription>
            <CardTitle className="text-2xl">{(totalEncours / 1000000).toFixed(2)} M€</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">+8,5% depuis le début de l'année</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total encours réels</CardDescription>
            <CardTitle className="text-2xl text-blue-600">
              {(totalEncoursReel / 1000000).toFixed(2)} M€
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              Taux de conversion: {((totalEncoursReel / totalEncours) * 100).toFixed(1)}%
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Potentiel de conversion</CardDescription>
            <CardTitle className="text-2xl text-amber-600">
              {(potentielTotal / 1000000).toFixed(2)} M€
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-sm text-muted-foreground">
              <TrendingUp className="mr-1 h-4 w-4 text-amber-600" />
              Opportunité de croissance
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Clients avec encours</CardDescription>
            <CardTitle className="text-2xl">342</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">+21 depuis le dernier trimestre</div>
          </CardContent>
        </Card>
      </div>

      {/* Onglets d'analyse */}
      <Tabs defaultValue="evolution" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="evolution">Évolution temporelle</TabsTrigger>
          <TabsTrigger value="repartition">Répartition</TabsTrigger>
          <TabsTrigger value="opportunites">Opportunités</TabsTrigger>
          <TabsTrigger value="clients">Détail par client</TabsTrigger>
        </TabsList>

        {/* Onglet 1: Évolution temporelle */}
        <TabsContent value="evolution">
          <Card>
            <CardHeader>
              <CardTitle>Évolution des encours théoriques</CardTitle>
              <CardDescription>
                Suivi des encours déclarés ou estimés hors gestion Eparnova
              </CardDescription>
            </CardHeader>
            <CardContent className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={historicData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mois" />
                  <YAxis />
                  <Tooltip formatter={value => `${((value as number) / 1000).toFixed(0)} K€`} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="immobilier"
                    name="Immobilier"
                    stroke="#8B5CF6"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="assuranceVie"
                    name="Assurance Vie"
                    stroke="#D946EF"
                    strokeWidth={2}
                  />
                  <Line type="monotone" dataKey="per" name="PER" stroke="#F97316" strokeWidth={2} />
                  <Line
                    type="monotone"
                    dataKey="epargne"
                    name="Épargne"
                    stroke="#0EA5E9"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="autre"
                    name="Autre"
                    stroke="#22D3EE"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet 2: Répartition */}
        <TabsContent value="repartition">
          <Card>
            <CardHeader>
              <CardTitle>Répartition des encours théoriques par classe d'actif</CardTitle>
              <CardDescription>Vue globale des actifs hors gestion Eparnova</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={repartitionData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {repartitionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={value => `${((value as number) / 1000).toFixed(0)} K€`} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={repartitionData}
                      layout="vertical"
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" />
                      <Tooltip formatter={value => `${((value as number) / 1000).toFixed(0)} K€`} />
                      <Bar dataKey="value" name="Montant" fill="#8B5CF6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet 3: Opportunités */}
        <TabsContent value="opportunites">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                <div>
                  <CardTitle>Opportunités de conversion</CardTitle>
                  <CardDescription>Potentiel d'encours convertibles pour Eparnova</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={opportunitesTab === 'potentiel' ? 'default' : 'outline'}
                    onClick={() => setOpportunitesTab('potentiel')}
                    size="sm"
                  >
                    Potentiel
                  </Button>
                  <Button
                    variant={opportunitesTab === 'conversion' ? 'default' : 'outline'}
                    onClick={() => setOpportunitesTab('conversion')}
                    size="sm"
                  >
                    Taux de conversion
                  </Button>
                  <Button
                    variant={opportunitesTab === 'contact' ? 'default' : 'outline'}
                    onClick={() => setOpportunitesTab('contact')}
                    size="sm"
                  >
                    Dernier contact
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Client</th>
                      <th className="text-right py-3 px-4">Encours théorique</th>
                      <th className="text-right py-3 px-4">Encours réel</th>
                      <th className="text-right py-3 px-4">Potentiel</th>
                      <th className="text-center py-3 px-4">Taux de conversion</th>
                      <th className="text-left py-3 px-4">Produits principaux</th>
                      <th className="text-center py-3 px-4">Dernier contact</th>
                      <th className="text-center py-3 px-4">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {formattedOpportunites.map(client => (
                      <tr key={client.id} className="border-b hover:bg-muted/50">
                        <td className="py-3 px-4 font-medium">
                          {client.prenom} {client.nom}
                        </td>
                        <td className="text-right py-3 px-4">
                          {new Intl.NumberFormat('fr-FR', {
                            style: 'currency',
                            currency: 'EUR',
                            maximumFractionDigits: 0,
                          }).format(client.encoursTheorique)}
                        </td>
                        <td className="text-right py-3 px-4">
                          {new Intl.NumberFormat('fr-FR', {
                            style: 'currency',
                            currency: 'EUR',
                            maximumFractionDigits: 0,
                          }).format(client.encoursReel)}
                        </td>
                        <td className="text-right py-3 px-4 font-medium text-amber-600">
                          {new Intl.NumberFormat('fr-FR', {
                            style: 'currency',
                            currency: 'EUR',
                            maximumFractionDigits: 0,
                          }).format(client.potentiel)}
                        </td>
                        <td className="py-3 px-4">
                          <div className="w-full flex flex-col items-center">
                            <span
                              className={`text-sm font-medium ${client.tauxConversion > 50 ? 'text-emerald-600' : 'text-amber-600'}`}
                            >
                              {client.tauxConversion}%
                            </span>
                            <Progress value={client.tauxConversion} className="h-2 w-full mt-1" />
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm">{client.produits}</td>
                        <td className="text-center py-3 px-4">{client.dernierContact}</td>
                        <td className="text-center py-3 px-4">
                          <Button size="sm" variant="outline">
                            Contacter
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet 4: Liste clients */}
        <TabsContent value="clients">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                <div>
                  <CardTitle>Encours théoriques par client</CardTitle>
                  <CardDescription>Détail des encours hors gestion par client</CardDescription>
                </div>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher un client..."
                    className="pl-8 w-full md:w-auto"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Client</th>
                      <th
                        className="text-right py-3 px-4 cursor-pointer hover:bg-muted/50"
                        onClick={() => handleSort('immobilier')}
                      >
                        <div className="flex items-center justify-end">
                          Immobilier
                          <ArrowUpDown className="ml-1 h-3 w-3" />
                        </div>
                      </th>
                      <th
                        className="text-right py-3 px-4 cursor-pointer hover:bg-muted/50"
                        onClick={() => handleSort('assuranceVie')}
                      >
                        <div className="flex items-center justify-end">
                          Assurance Vie
                          <ArrowUpDown className="ml-1 h-3 w-3" />
                        </div>
                      </th>
                      <th
                        className="text-right py-3 px-4 cursor-pointer hover:bg-muted/50"
                        onClick={() => handleSort('per')}
                      >
                        <div className="flex items-center justify-end">
                          PER
                          <ArrowUpDown className="ml-1 h-3 w-3" />
                        </div>
                      </th>
                      <th
                        className="text-right py-3 px-4 cursor-pointer hover:bg-muted/50"
                        onClick={() => handleSort('epargne')}
                      >
                        <div className="flex items-center justify-end">
                          Épargne
                          <ArrowUpDown className="ml-1 h-3 w-3" />
                        </div>
                      </th>
                      <th
                        className="text-right py-3 px-4 cursor-pointer hover:bg-muted/50"
                        onClick={() => handleSort('autre')}
                      >
                        <div className="flex items-center justify-end">
                          Autre
                          <ArrowUpDown className="ml-1 h-3 w-3" />
                        </div>
                      </th>
                      <th
                        className="text-right py-3 px-4 cursor-pointer hover:bg-muted/50"
                        onClick={() => handleSort('total')}
                      >
                        <div className="flex items-center justify-end">
                          Total
                          <ArrowUpDown className="ml-1 h-3 w-3" />
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {formattedClients.map(client => (
                      <tr key={client.id} className="border-b hover:bg-muted/50">
                        <td className="py-3 px-4 font-medium">
                          {client.prenom} {client.nom}
                        </td>
                        <td className="text-right py-3 px-4">
                          {client.immobilier > 0
                            ? new Intl.NumberFormat('fr-FR', {
                                style: 'currency',
                                currency: 'EUR',
                                maximumFractionDigits: 0,
                              }).format(client.immobilier)
                            : '—'}
                        </td>
                        <td className="text-right py-3 px-4">
                          {client.assuranceVie > 0
                            ? new Intl.NumberFormat('fr-FR', {
                                style: 'currency',
                                currency: 'EUR',
                                maximumFractionDigits: 0,
                              }).format(client.assuranceVie)
                            : '—'}
                        </td>
                        <td className="text-right py-3 px-4">
                          {client.per > 0
                            ? new Intl.NumberFormat('fr-FR', {
                                style: 'currency',
                                currency: 'EUR',
                                maximumFractionDigits: 0,
                              }).format(client.per)
                            : '—'}
                        </td>
                        <td className="text-right py-3 px-4">
                          {client.epargne > 0
                            ? new Intl.NumberFormat('fr-FR', {
                                style: 'currency',
                                currency: 'EUR',
                                maximumFractionDigits: 0,
                              }).format(client.epargne)
                            : '—'}
                        </td>
                        <td className="text-right py-3 px-4">
                          {client.autre > 0
                            ? new Intl.NumberFormat('fr-FR', {
                                style: 'currency',
                                currency: 'EUR',
                                maximumFractionDigits: 0,
                              }).format(client.autre)
                            : '—'}
                        </td>
                        <td className="text-right py-3 px-4 font-medium">
                          {new Intl.NumberFormat('fr-FR', {
                            style: 'currency',
                            currency: 'EUR',
                            maximumFractionDigits: 0,
                          }).format(client.total)}
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

export default EncoursTheoriquesPage;
