
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
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
import { Search, FileDown, ArrowUpDown } from 'lucide-react';
import { useEncoursReelsData } from '@/hooks/useEncoursReelsData';

const COLORS = ['#8B5CF6', '#D946EF', '#F97316', '#0EA5E9', '#22D3EE'];

const EncoursReelsPage = () => {
  const [periode, setPeriode] = useState("6mois");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortColumn, setSortColumn] = useState("total");
  const [sortDirection, setSortDirection] = useState("desc");
  const { loading, error, encoursData, repartitionData, clientsData, totalEncours } = useEncoursReelsData();

  if (loading) {
    return <div>Chargement...</div>;
  }

  if (error) {
    return <div>Erreur: {error}</div>;
  }
  
  // Préparation des données pour l'affichage des tableaux
  const formattedClients = [...clientsData].sort((a, b) => {
    if (sortDirection === "asc") {
      return a[sortColumn as keyof typeof a] > b[sortColumn as keyof typeof b] ? 1 : -1;
    } else {
      return a[sortColumn as keyof typeof a] < b[sortColumn as keyof typeof b] ? 1 : -1;
    }
  }).filter(client => 
    client.nom.toLowerCase().includes(searchTerm.toLowerCase()) || 
    client.prenom.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("desc");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Encours réels</h1>
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total encours réels</CardDescription>
            <CardTitle className="text-2xl text-blue-600">
              {(totalEncours / 1000000).toFixed(2)} M€
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              +14,2% depuis le début de l'année
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Clients avec encours</CardDescription>
            <CardTitle className="text-2xl">125</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              +8 nouveaux ce mois-ci
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Encours moyen par client</CardDescription>
            <CardTitle className="text-2xl">135 600 €</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              +5,5% depuis le dernier trimestre
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Onglets d'analyse */}
      <Tabs defaultValue="evolution" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="evolution">Évolution temporelle</TabsTrigger>
          <TabsTrigger value="repartition">Répartition</TabsTrigger>
          <TabsTrigger value="clients">Détail par client</TabsTrigger>
        </TabsList>
        
        {/* Onglet 1: Évolution temporelle */}
        <TabsContent value="evolution">
          <Card>
            <CardHeader>
              <CardTitle>Évolution des encours réels</CardTitle>
              <CardDescription>
                Encours sous gestion Eparnova par mois et par produit
              </CardDescription>
            </CardHeader>
            <CardContent className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={encoursData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mois" />
                  <YAxis />
                  <Tooltip formatter={(value) => `${(value as number / 1000).toFixed(0)} K€`} />
                  <Legend />
                  <Line type="monotone" dataKey="assuranceVie" name="Assurance Vie" stroke="#8B5CF6" strokeWidth={2} />
                  <Line type="monotone" dataKey="per" name="PER" stroke="#D946EF" strokeWidth={2} />
                  <Line type="monotone" dataKey="immobilier" name="Immobilier" stroke="#F97316" strokeWidth={2} />
                  <Line type="monotone" dataKey="scpi" name="SCPI" stroke="#0EA5E9" strokeWidth={2} />
                  <Line type="monotone" dataKey="autre" name="Autre" stroke="#22D3EE" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Onglet 2: Répartition */}
        <TabsContent value="repartition">
          <Card>
            <CardHeader>
              <CardTitle>Répartition des encours réels par produit</CardTitle>
              <CardDescription>
                Distribution des actifs sous gestion Eparnova
              </CardDescription>
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
                      <Tooltip formatter={(value) => `${(value as number / 1000).toFixed(0)} K€`} />
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
                      <Tooltip formatter={(value) => `${(value as number / 1000).toFixed(0)} K€`} />
                      <Bar dataKey="value" name="Montant" fill="#8B5CF6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Onglet 3: Liste clients */}
        <TabsContent value="clients">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                <div>
                  <CardTitle>Encours réels par client</CardTitle>
                  <CardDescription>
                    Détail des encours sous gestion par client
                  </CardDescription>
                </div>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher un client..."
                    className="pl-8 w-full md:w-auto"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
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
                        onClick={() => handleSort('scpi')}
                      >
                        <div className="flex items-center justify-end">
                          SCPI
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
                    {formattedClients.map((client) => (
                      <tr key={client.id} className="border-b hover:bg-muted/50">
                        <td className="py-3 px-4 font-medium">
                          {client.prenom} {client.nom}
                        </td>
                        <td className="text-right py-3 px-4">
                          {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(client.assuranceVie)}
                        </td>
                        <td className="text-right py-3 px-4">
                          {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(client.per)}
                        </td>
                        <td className="text-right py-3 px-4">
                          {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(client.scpi)}
                        </td>
                        <td className="text-right py-3 px-4">
                          {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(client.autre)}
                        </td>
                        <td className="text-right py-3 px-4 font-medium text-blue-600">
                          {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(client.total)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-muted/50">
                      <td className="py-3 px-4 font-medium">TOTAL</td>
                      <td className="text-right py-3 px-4 font-medium">
                        {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(
                          formattedClients.reduce((sum, client) => sum + client.assuranceVie, 0)
                        )}
                      </td>
                      <td className="text-right py-3 px-4 font-medium">
                        {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(
                          formattedClients.reduce((sum, client) => sum + client.per, 0)
                        )}
                      </td>
                      <td className="text-right py-3 px-4 font-medium">
                        {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(
                          formattedClients.reduce((sum, client) => sum + client.scpi, 0)
                        )}
                      </td>
                      <td className="text-right py-3 px-4 font-medium">
                        {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(
                          formattedClients.reduce((sum, client) => sum + client.autre, 0)
                        )}
                      </td>
                      <td className="text-right py-3 px-4 font-medium text-blue-600">
                        {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(
                          formattedClients.reduce((sum, client) => sum + client.total, 0)
                        )}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EncoursReelsPage;
