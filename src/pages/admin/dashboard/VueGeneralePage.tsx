
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  Users, 
  Briefcase, 
  AlertTriangle, 
  Brain,
  CalendarClock 
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

// Données fictives pour le dashboard
const clientsData = [
  { month: 'Jan', total: 120, nouveaux: 15 },
  { month: 'Fév', total: 135, nouveaux: 18 },
  { month: 'Mar', total: 153, nouveaux: 22 },
  { month: 'Avr', total: 175, nouveaux: 24 },
  { month: 'Mai', total: 199, nouveaux: 15 },
  { month: 'Juin', total: 214, nouveaux: 12 },
];

const encoursData = [
  { month: 'Jan', reels: 1200000, theoriques: 2800000 },
  { month: 'Fév', reels: 1350000, theoriques: 2900000 },
  { month: 'Mar', reels: 1450000, theoriques: 3000000 },
  { month: 'Avr', reels: 1600000, theoriques: 3050000 },
  { month: 'Mai', reels: 1750000, theoriques: 3100000 },
  { month: 'Juin', reels: 1900000, theoriques: 3200000 },
];

const alertesData = [
  { name: 'Profils incomplets', value: 42 },
  { name: 'Projets non finalisés', value: 58 },
  { name: 'Clients inactifs', value: 35 },
  { name: 'Optimisations possibles', value: 87 },
];

const COLORS = ['#8B5CF6', '#F97316', '#D946EF', '#0EA5E9'];

const VueGeneralePage = () => {
  const [periode, setPeriode] = React.useState("6mois");
  
  // Calculs statistiques
  const encoursReelsActuel = encoursData[encoursData.length - 1].reels;
  const encoursTheoriquesActuel = encoursData[encoursData.length - 1].theoriques;
  const tauxConversion = (encoursReelsActuel / encoursTheoriquesActuel) * 100;
  
  const clientsActuels = clientsData[clientsData.length - 1].total;
  const nouveauxClients = clientsData[clientsData.length - 1].nouveaux;
  const tauxCroissance = ((clientsData[clientsData.length - 1].total - clientsData[clientsData.length - 2].total) / clientsData[clientsData.length - 2].total) * 100;
  
  const totalAlertes = alertesData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Tableau de bord</h1>
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
            </SelectContent>
          </Select>
          <Button variant="outline">Exporter</Button>
        </div>
      </div>

      {/* Rangée de statistiques clés */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Encours réels</CardDescription>
            <CardTitle className="text-2xl text-blue-600">
              {(encoursReelsActuel / 1000000).toFixed(2)} M€
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground flex items-center">
              <ArrowUpRight className="mr-1 h-4 w-4 text-emerald-500" />
              +8,6% depuis 30 jours
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Taux de conversion</CardDescription>
            <CardTitle className="text-2xl text-emerald-600">{tauxConversion.toFixed(1)}%</CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={tauxConversion} className="h-2" />
            <div className="text-xs text-muted-foreground mt-2">
              Encours réels / encours théoriques
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Clients actifs</CardDescription>
            <CardTitle className="text-2xl">{clientsActuels}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground flex items-center">
              <ArrowUpRight className="mr-1 h-4 w-4 text-emerald-500" />
              {tauxCroissance.toFixed(1)}% de croissance
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Alertes totales</CardDescription>
            <CardTitle className="text-2xl text-amber-500">{totalAlertes}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              {alertesData[0].value} profils incomplets
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contenu principal en onglets */}
      <Tabs defaultValue="evolution" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="evolution">Évolution</TabsTrigger>
          <TabsTrigger value="clients">Clients</TabsTrigger>
          <TabsTrigger value="alertes">Alertes</TabsTrigger>
          <TabsTrigger value="actions">Actions prioritaires</TabsTrigger>
        </TabsList>
        
        {/* Onglet Évolution */}
        <TabsContent value="evolution">
          <Card>
            <CardHeader>
              <CardTitle>Évolution des encours</CardTitle>
              <CardDescription>
                Suivi des encours réels et théoriques sur la période sélectionnée
              </CardDescription>
            </CardHeader>
            <CardContent className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={encoursData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => `${(Number(value) / 1000000).toFixed(2)} M€`} />
                  <Legend />
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
        
        {/* Onglet Clients */}
        <TabsContent value="clients">
          <Card>
            <CardHeader>
              <CardTitle>Évolution client</CardTitle>
              <CardDescription>
                Suivi de la base client et nouveaux clients
              </CardDescription>
            </CardHeader>
            <CardContent className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={clientsData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="total" name="Total clients" fill="#8B5CF6" />
                  <Bar dataKey="nouveaux" name="Nouveaux clients" fill="#0EA5E9" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Onglet Alertes */}
        <TabsContent value="alertes">
          <Card>
            <CardHeader>
              <CardTitle>Distribution des alertes</CardTitle>
              <CardDescription>
                Répartition par type d'alerte nécessitant une action
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={alertesData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {alertesData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="space-y-4">
                  {alertesData.map((alerte, index) => (
                    <div key={index} className="flex items-center">
                      <div 
                        className="h-3 w-3 rounded-full mr-2" 
                        style={{ backgroundColor: COLORS[index % COLORS.length] }} 
                      />
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium">{alerte.name}</span>
                          <span className="text-sm">{alerte.value}</span>
                        </div>
                        <Progress value={(alerte.value / totalAlertes) * 100} className="h-1" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Onglet Actions prioritaires */}
        <TabsContent value="actions">
          <Card>
            <CardHeader>
              <CardTitle>Actions prioritaires</CardTitle>
              <CardDescription>
                Tâches nécessitant une attention immédiate
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border rounded-md p-4">
                  <div className="flex items-center">
                    <Users className="h-5 w-5 mr-2 text-blue-500" />
                    <h3 className="text-sm font-semibold">15 clients inactifs depuis 30 jours</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Prévoir une campagne de réengagement et des relances personnalisées.
                  </p>
                  <div className="mt-3 flex justify-end">
                    <Button size="sm" variant="outline">Voir les clients</Button>
                  </div>
                </div>

                <div className="border rounded-md p-4">
                  <div className="flex items-center">
                    <AlertTriangle className="h-5 w-5 mr-2 text-amber-500" />
                    <h3 className="text-sm font-semibold">23 profils incomplets</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Des informations essentielles manquent pour des recommandations optimales.
                  </p>
                  <div className="mt-3 flex justify-end">
                    <Button size="sm" variant="outline">Consulter</Button>
                  </div>
                </div>

                <div className="border rounded-md p-4">
                  <div className="flex items-center">
                    <Briefcase className="h-5 w-5 mr-2 text-emerald-500" />
                    <h3 className="text-sm font-semibold">8 projets immobiliers en attente</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Des simulations ont été effectuées sans suite après 14 jours.
                  </p>
                  <div className="mt-3 flex justify-end">
                    <Button size="sm" variant="outline">Détails</Button>
                  </div>
                </div>

                <div className="border rounded-md p-4">
                  <div className="flex items-center">
                    <Brain className="h-5 w-5 mr-2 text-purple-500" />
                    <h3 className="text-sm font-semibold">42 recommandations IA non consultées</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Des opportunités d'optimisation patrimoniale automatisées à examiner.
                  </p>
                  <div className="mt-3 flex justify-end">
                    <Button size="sm" variant="outline">Examiner</Button>
                  </div>
                </div>

                <div className="border rounded-md p-4">
                  <div className="flex items-center">
                    <CalendarClock className="h-5 w-5 mr-2 text-indigo-500" />
                    <h3 className="text-sm font-semibold">5 rendez-vous à replanifier</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Rendez-vous annulés nécessitant une nouvelle planification.
                  </p>
                  <div className="mt-3 flex justify-end">
                    <Button size="sm" variant="outline">Calendrier</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VueGeneralePage;
