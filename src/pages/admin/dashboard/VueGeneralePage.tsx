
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle, 
  CardFooter
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
  CalendarClock, 
  Mail,
  MessageSquare,
  BarChart,
  PieChart,
  Phone,
  FileText
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import {
  BarChart as ReBarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart as RePieChart,
  Pie,
  Cell
} from 'recharts';
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

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
  { month: 'Jan', reels: 1200000, theoriques: 2800000, disponible: 580000 },
  { month: 'Fév', reels: 1350000, theoriques: 2900000, disponible: 620000 },
  { month: 'Mar', reels: 1450000, theoriques: 3000000, disponible: 640000 },
  { month: 'Avr', reels: 1600000, theoriques: 3050000, disponible: 590000 },
  { month: 'Mai', reels: 1750000, theoriques: 3100000, disponible: 620000 },
  { month: 'Juin', reels: 1900000, theoriques: 3200000, disponible: 580000 },
];

const alertesData = [
  { name: 'Profils incomplets', value: 42, color: '#8B5CF6' },
  { name: 'Projets non finalisés', value: 58, color: '#F97316' },
  { name: 'Clients inactifs', value: 35, color: '#D946EF' },
  { name: 'Optimisations possibles', value: 87, color: '#0EA5E9' },
];

const COLORS = ['#8B5CF6', '#F97316', '#D946EF', '#0EA5E9'];

const activitesRecentes = [
  { client: "Jean Dupont", action: "Souscription", date: "Aujourd'hui, 14:25", montant: "15 000€", produit: "Assurance-vie" },
  { client: "Marie Martin", action: "Rachat partiel", date: "Aujourd'hui, 11:10", montant: "5 000€", produit: "SCPI Rendement" },
  { client: "Antoine Fernet", action: "Adhésion", date: "Hier, 16:30", montant: "-", produit: "Abonnement Premium" },
  { client: "Sophie Legrand", action: "Versement libre", date: "Hier, 10:15", montant: "7 500€", produit: "PER" },
  { client: "Pierre Dubois", action: "Résiliation", date: "22/05/2025", montant: "-", produit: "Protection Revenus" },
  { client: "Emma Blanc", action: "Souscription", date: "21/05/2025", montant: "75 000€", produit: "SCPI Européenne" },
];

const prochainRDV = [
  { client: "Philippe Martin", theme: "Bilan patrimonial annuel", date: "Aujourd'hui", heure: "15:30" },
  { client: "Claire Moreau", theme: "Étude retraite", date: "Aujourd'hui", heure: "17:00" },
  { client: "Thomas Leroy", theme: "Optimisation fiscale", date: "Demain", heure: "10:00" },
  { client: "Nathalie Petit", theme: "Investissement locatif", date: "Demain", heure: "14:30" },
  { client: "Julien Roux", theme: "Succession", date: "Après-demain", heure: "11:15" },
];

// Données pour la répartition des classes d'actifs
const classesActifs = [
  { name: 'Immobilier', value: 45 },
  { name: 'Actions', value: 20 },
  { name: 'Obligations', value: 15 },
  { name: 'Monétaire', value: 10 },
  { name: 'Alternatif', value: 10 },
];

const VueGeneralePage = () => {
  const [periode, setPeriode] = React.useState("6mois");
  
  // Calculs statistiques
  const encoursReelsActuel = encoursData[encoursData.length - 1].reels;
  const encoursTheoriquesActuel = encoursData[encoursData.length - 1].theoriques;
  const encoursDisponibleActuel = encoursData[encoursData.length - 1].disponible;
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
        <Card className="overflow-hidden">
          <CardHeader className="pb-2 bg-gradient-to-r from-blue-50 to-blue-100">
            <CardDescription>Encours théorique global</CardDescription>
            <CardTitle className="text-2xl text-blue-700">
              {(encoursTheoriquesActuel / 1000000).toFixed(2)} M€
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-sm text-muted-foreground flex items-center">
              <ArrowUpRight className="mr-1 h-4 w-4 text-emerald-500" />
              +4,2% depuis 30 jours
            </div>
            <Button variant="link" className="p-0 h-auto text-xs mt-1" onClick={() => window.location.href = '/admin/portfolios/theoriques'}>
              Voir détails
            </Button>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader className="pb-2 bg-gradient-to-r from-emerald-50 to-emerald-100">
            <CardDescription>Encours réel sous gestion</CardDescription>
            <CardTitle className="text-2xl text-emerald-700">
              {(encoursReelsActuel / 1000000).toFixed(2)} M€
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-sm text-muted-foreground flex items-center">
              <ArrowUpRight className="mr-1 h-4 w-4 text-emerald-500" />
              +8,6% depuis 30 jours
            </div>
            <Button variant="link" className="p-0 h-auto text-xs mt-1" onClick={() => window.location.href = '/admin/portfolios/reels'}>
              Voir détails
            </Button>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader className="pb-2 bg-gradient-to-r from-amber-50 to-amber-100">
            <CardDescription>Épargne disponible</CardDescription>
            <CardTitle className="text-2xl text-amber-700">
              {(encoursDisponibleActuel / 1000000).toFixed(2)} M€
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-sm text-muted-foreground flex items-center">
              <ArrowDownRight className="mr-1 h-4 w-4 text-red-500" />
              -6,8% depuis 30 jours
            </div>
            <Button variant="link" className="p-0 h-auto text-xs mt-1">
              Opportunités d'investissement
            </Button>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader className="pb-2 bg-gradient-to-r from-purple-50 to-purple-100">
            <CardDescription>Conversion R/T</CardDescription>
            <CardTitle className="text-2xl text-purple-700">
              {tauxConversion.toFixed(1)}%
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <Progress value={tauxConversion} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              <span>Objectif: 75%</span>
              <Button variant="link" className="p-0 h-auto text-xs" onClick={() => window.location.href = '/admin/portfolios/analyse'}>
                Analyser les écarts
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Classes d'actifs */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Répartition des actifs</CardTitle>
            <CardDescription>Allocation globale du portefeuille</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]"> {/* Augmenté la hauteur de 264px à 300px */}
              <ResponsiveContainer width="100%" height="100%">
                <RePieChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}> {/* Ajout des marges */}
                  <Pie
                    data={classesActifs}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {classesActifs.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </RePieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4">
              <Button variant="outline" size="sm" className="w-full">
                Ajuster l'allocation cible
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Opportunités identifiées */}
        <Card className="col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-between">
              <span>Opportunités</span>
              <Badge className="bg-amber-500">{totalAlertes}</Badge>
            </CardTitle>
            <CardDescription>Actions commerciales prioritaires</CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <ScrollArea className="h-[340px] pr-4"> {/* Augmenté la hauteur de 272px à 340px */}
              <div className="space-y-3">
                <OpportunityItem 
                  icon={AlertTriangle} 
                  iconColor="text-amber-500" 
                  title="42 profils incomplets" 
                  description="Données manquantes pour recommandations"
                  action="Relancer"
                  onClick={() => window.location.href = '/admin/alertes/profils-incomplets'}
                />
                
                <OpportunityItem 
                  icon={Users} 
                  iconColor="text-blue-500" 
                  title="35 clients inactifs (30j+)" 
                  description="Risque de désabonnement"
                  action="Contacter"
                  onClick={() => window.location.href = '/admin/alertes/inactifs'}
                />
                
                <OpportunityItem 
                  icon={Brain} 
                  iconColor="text-purple-500" 
                  title="87 optimisations possibles" 
                  description="Suggestions IA pour amélioration"
                  action="Étudier"
                  onClick={() => window.location.href = '/admin/ia/recommandations'}
                />
                
                <OpportunityItem 
                  icon={BarChart} 
                  iconColor="text-emerald-500" 
                  title="23 clients sous-investis" 
                  description="Épargne disponible importante"
                  action="Proposer"
                />
                
                <OpportunityItem 
                  icon={AlertTriangle} 
                  iconColor="text-red-500" 
                  title="8 contrats en déséquilibre" 
                  description="Allocation non conforme au profil"
                  action="Réaligner"
                />
              </div>
            </ScrollArea>
          </CardContent>
          <CardFooter className="border-t pt-4">
            <Button variant="outline" size="sm" className="w-full">
              Voir toutes les opportunités
            </Button>
          </CardFooter>
        </Card>

        {/* Mouvements récents */}
        <Card className="col-span-1">
          <CardHeader className="pb-2">
            <CardTitle>Mouvements récents</CardTitle>
            <CardDescription>Actions clients et transactions</CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <ScrollArea className="h-[340px] pr-4"> {/* Augmenté la hauteur de 272px à 340px */}
              <div className="space-y-3">
                {activitesRecentes.map((activite, index) => (
                  <div key={index} className="border rounded-md p-2 text-sm">
                    <div className="flex justify-between">
                      <span className="font-medium">{activite.client}</span>
                      <Badge 
                        variant={activite.action === "Résiliation" ? "destructive" : 
                                activite.action === "Rachat partiel" ? "outline" : 
                                "default"}
                        className="text-xs"
                      >
                        {activite.action}
                      </Badge>
                    </div>
                    <div className="flex justify-between mt-1 text-muted-foreground">
                      <span>{activite.produit}</span>
                      <span>{activite.montant !== "-" && activite.montant}</span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {activite.date}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
          <CardFooter className="border-t pt-4">
            <div className="w-full flex gap-2">
              <Select defaultValue="all">
                <SelectTrigger className="text-xs h-8">
                  <SelectValue placeholder="Type d'action" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les actions</SelectItem>
                  <SelectItem value="souscription">Souscriptions</SelectItem>
                  <SelectItem value="rachat">Rachats</SelectItem>
                  <SelectItem value="resiliation">Résiliations</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm" className="ml-auto">
                Historique complet
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>

      {/* Agenda et évolution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <CalendarClock className="mr-2 h-5 w-5" />
              Prochains rendez-vous
            </CardTitle>
            <CardDescription>Planning sur 3 jours</CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="space-y-4">
              {prochainRDV.map((rdv, index) => (
                <div key={index} className="border rounded-md p-3">
                  <div className="flex justify-between">
                    <span className="font-medium">{rdv.client}</span>
                    <Badge variant="outline" className="text-xs">
                      {rdv.date}, {rdv.heure}
                    </Badge>
                  </div>
                  <div className="mt-1 text-sm text-muted-foreground">
                    {rdv.theme}
                  </div>
                  <div className="mt-2 flex gap-2">
                    <Button size="sm" variant="outline" className="h-7 px-2 text-xs">
                      <FileText className="h-3 w-3 mr-1" />
                      Fiche
                    </Button>
                    <Button size="sm" variant="outline" className="h-7 px-2 text-xs">
                      <Mail className="h-3 w-3 mr-1" />
                      Email
                    </Button>
                    <Button size="sm" variant="outline" className="h-7 px-2 text-xs">
                      <Phone className="h-3 w-3 mr-1" />
                      Appel
                    </Button>
                    <Button size="sm" variant="outline" className="h-7 px-2 text-xs">
                      <MessageSquare className="h-3 w-3 mr-1" />
                      Notes
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="border-t pt-4">
            <Button variant="outline" className="w-full" onClick={() => window.location.href = '/admin/rendez-vous'}>
              Voir le planning complet
            </Button>
          </CardFooter>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Évolution des encours</CardTitle>
            <CardDescription>
              Comparaison théorique/réel et épargne disponible
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[420px]"> {/* Augmenté la hauteur de 396px à 420px */}
            <ResponsiveContainer width="100%" height="100%">
              <LineChart 
                data={encoursData} 
                margin={{ top: 20, right: 30, left: 30, bottom: 15 }} {/* Augmenté les marges */}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => `${(Number(value) / 1000000).toFixed(2)} M€`} />
                <Legend wrapperStyle={{ paddingTop: '15px' }} />
                <Line 
                  type="monotone" 
                  dataKey="reels" 
                  name="Encours réels" 
                  stroke="#10B981" 
                  strokeWidth={2} 
                />
                <Line 
                  type="monotone" 
                  dataKey="theoriques" 
                  name="Encours théoriques" 
                  stroke="#3B82F6" 
                  strokeWidth={2} 
                />
                <Line 
                  type="monotone" 
                  dataKey="disponible" 
                  name="Épargne disponible" 
                  stroke="#F59E0B" 
                  strokeWidth={2} 
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Composant pour chaque élément d'opportunité
const OpportunityItem = ({ 
  icon: Icon, 
  iconColor, 
  title, 
  description, 
  action, 
  onClick 
}: { 
  icon: React.ElementType, 
  iconColor: string, 
  title: string, 
  description: string, 
  action: string, 
  onClick?: () => void 
}) => {
  return (
    <div className="border rounded-md p-3">
      <div className="flex items-start justify-between">
        <div className="flex items-start">
          <div className={`${iconColor} mr-3 mt-0.5`}>
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <div className="font-medium text-sm">{title}</div>
            <div className="text-xs text-muted-foreground">{description}</div>
          </div>
        </div>
        <Button onClick={onClick} size="sm" className="h-7 text-xs">
          {action}
        </Button>
      </div>
    </div>
  );
};

export default VueGeneralePage;
