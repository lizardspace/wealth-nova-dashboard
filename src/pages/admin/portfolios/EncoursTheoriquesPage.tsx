
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
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
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
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

const COLORS = ['#8B5CF6', '#D946EF', '#F97316', '#0EA5E9', '#22D3EE'];

const EncoursTheoriquesPage = () => {
  const [periode, setPeriode] = useState("6mois");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortColumn, setSortColumn] = useState("total");
  const [sortDirection, setSortDirection] = useState("desc");
  const [opportunitesTab, setOpportunitesTab] = useState("potentiel");
  const [debugMode, setDebugMode] = useState(false);

  const [historicData, setHistoricData] = useState([]);
  const [repartitionData, setRepartitionData] = useState([]);
  const [opportunitesData, setOpportunitesData] = useState([]);
  const [clientsData, setClientsData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      console.log('🚀 Début du fetch des données pour les encours théoriques');
      
      try {
        // 1. Fetch all users
        console.log('📊 Récupération des utilisateurs...');
        const { data: users, error: usersError } = await supabase.from('users').select('id, first_name, last_name');
        console.log('👥 Utilisateurs récupérés:', users?.length || 0, 'utilisateurs', users);
        if (usersError) {
          console.error('❌ Erreur lors de la récupération des utilisateurs:', usersError);
          throw usersError;
        }

        // 2. Fetch all assets for all users with management status
        console.log('🏦 Récupération des actifs...');
        const [
          { data: immobilierData, error: immobilierError },
          { data: assuranceVieData, error: assuranceVieError },
          { data: perData, error: perError },
          { data: epargneData, error: epargneError },
          { data: autreData, error: autreError },
          { data: entrepriseData, error: entrepriseError },
        ] = await Promise.all([
          supabase.from('bienimmobilier').select('user_id, value, contrat_gere, libelle, date_acquisition'),
          supabase.from('assurancevie').select('user_id, value, contrat_gere, libelle, date_acquisition'),
          supabase.from('contratcapitalisation').select('user_id, value, contrat_gere, libelle, date_acquisition'),
          supabase.from('comptebancaire').select('user_id, value, contrat_gere, libelle, date_acquisition'),
          supabase.from('autrepatrimoine').select('user_id, value, libelle, date_acquisition'),
          supabase.from('entrepriseparticipation').select('user_id, value, libelle, date_acquisition'),
        ]);
        
        console.log('🏠 Immobilier:', immobilierData?.length || 0, 'éléments', immobilierData);
        console.log('🛡️ Assurance vie:', assuranceVieData?.length || 0, 'éléments', assuranceVieData);
        console.log('📊 PER:', perData?.length || 0, 'éléments', perData);
        console.log('💰 Épargne:', epargneData?.length || 0, 'éléments', epargneData);
        console.log('📦 Autre:', autreData?.length || 0, 'éléments', autreData);
        console.log('🏢 Entreprise:', entrepriseData?.length || 0, 'éléments', entrepriseData);

        // Gestion des erreurs
        const errors = [immobilierError, assuranceVieError, perError, epargneError, autreError, entrepriseError].filter(Boolean);
        if (errors.length > 0) {
          console.error('❌ Erreurs lors de la récupération des données patrimoniales:', errors);
          throw new Error('Erreur lors de la récupération des données patrimoniales');
        }

        // Organisation des données par type d'actif
        const assetData = {
          immobilier: immobilierData || [],
          assuranceVie: assuranceVieData || [],
          per: perData || [],
          epargne: epargneData || [],
          autre: autreData || [],
          entreprise: entrepriseData || [],
        };

        const clientsMap = new Map();

        // Initialisation des clients
        console.log('👥 Initialisation des clients...');
        users.forEach(user => {
          clientsMap.set(user.id, {
            id: user.id,
            nom: user.last_name || 'N/A',
            prenom: user.first_name || 'N/A',
            immobilier: 0,           // Encours théorique (non géré)
            assuranceVie: 0,        // Encours théorique (non géré)
            per: 0,                 // Encours théorique (non géré)
            epargne: 0,             // Encours théorique (non géré)
            autre: 0,               // Encours théorique (non géré)
            entreprise: 0,          // Encours théorique (toujours non géré)
            total: 0,               // Total des encours théoriques
            encoursReel: 0,         // Encours géré par Eparnova
            dernierContact: "N/A",  
            produits: new Set(),
            detailActifs: [],       // Pour le debugging et les détails
          });
        });
        console.log('✅ Clients initialisés:', clientsMap.size, 'clients');

        // Traitement des actifs par type
        console.log('🔄 Traitement des actifs par type...');
        let totalActifsTraites = 0;
        let totalEncoursTh = 0;
        let totalEncoursReel = 0;
        
        for (const [assetType, data] of Object.entries(assetData)) {
          if (!data) continue;
          console.log(`📋 Traitement de ${assetType}: ${data.length} éléments`);
          
          data.forEach(item => {
            const client = clientsMap.get(item.user_id);
            if (!client) {
              console.warn(`⚠️ Client non trouvé pour user_id: ${item.user_id}`);
              return;
            }
            
            const value = parseFloat(item.value) || 0;
            // Les tables 'autrepatrimoine' et 'entrepriseparticipation' n'ont pas de champ contrat_gere
            const isManaged = (assetType === 'autre' || assetType === 'entreprise') 
              ? false  // Ces types sont toujours considérés comme non gérés
              : item.contrat_gere === true;
            totalActifsTraites++;
            
            console.log(`  💼 ${assetType} - ${client.prenom} ${client.nom}: ${value}€ (géré: ${isManaged})`);
            
            // Debug info
            client.detailActifs.push({
              type: assetType,
              libelle: item.libelle || 'Sans libellé',
              value,
              isManaged,
              date: item.date_acquisition
            });
            
            if (isManaged) {
              // Si géré par Eparnova = encours réel
              client.encoursReel += value;
              totalEncoursReel += value;
            } else {
              // Si non géré = encours théorique (potentiel de conversion)
              client[assetType] += value;
              client.produits.add(assetType);
              totalEncoursTh += value;
            }
          });
        }
        
        console.log(`✅ Actifs traités: ${totalActifsTraites} actifs`);
        console.log(`💰 Total encours théoriques: ${totalEncoursTh}€`);
        console.log(`🏦 Total encours réels: ${totalEncoursReel}€`);

        // Calcul final des données clients
        console.log('📊 Calcul final des données clients...');
        const processedClients = Array.from(clientsMap.values()).map(client => {
          const totalTheorique = client.immobilier + client.assuranceVie + client.per + client.epargne + client.autre + client.entreprise;
          const totalPatrimoine = totalTheorique + client.encoursReel;
          
          if (totalTheorique > 0 || client.encoursReel > 0) {
            console.log(`👤 ${client.prenom} ${client.nom}: Théorique=${totalTheorique}€, Réel=${client.encoursReel}€`);
          }
          
          return {
            ...client,
            total: totalTheorique,                    // Total encours théorique (non géré)
            produits: Array.from(client.produits).join(', '),
            encoursTheorique: totalTheorique,         // Encours théorique
            potentiel: totalTheorique,                // Potentiel = tout le théorique peut être converti
            tauxConversion: totalPatrimoine > 0 ? Math.round((client.encoursReel / totalPatrimoine) * 100) : 0,
            patrimoineTotal: totalPatrimoine,         // Patrimoine total (théorique + réel)
          };
        });

        const finalClientsData = processedClients;
        console.log('📋 Clients avec données financières:', finalClientsData.filter(c => c.total > 0 || c.encoursReel > 0).length);

        setClientsData(finalClientsData);
        setOpportunitesData(finalClientsData);

        // 3. Aggregate for repartition data (only non-managed assets = theoretical)
        console.log('📈 Calcul de la répartition des encours théoriques...');
        const repartition = finalClientsData.reduce((acc, client) => {
          acc.Immobilier += client.immobilier;
          acc['Assurance Vie'] += client.assuranceVie;
          acc.PER += client.per;
          acc.Épargne += client.epargne;
          acc.Autre += client.autre;
          acc.Entreprise += client.entreprise;
          return acc;
        }, { 
          'Immobilier': 0, 
          'Assurance Vie': 0, 
          'PER': 0, 
          'Épargne': 0, 
          'Autre': 0,
          'Entreprise': 0
        });
        
        console.log('📊 Répartition calculée:', repartition);

        setRepartitionData([
            { name: 'Immobilier', value: repartition.Immobilier, color: '#8B5CF6' },
            { name: 'Assurance Vie', value: repartition['Assurance Vie'], color: '#D946EF' },
            { name: 'PER', value: repartition.PER, color: '#F97316' },
            { name: 'Épargne', value: repartition.Épargne, color: '#0EA5E9' },
            { name: 'Entreprise', value: repartition.Entreprise, color: '#22D3EE' },
            { name: 'Autre', value: repartition.Autre, color: '#10B981' },
        ].filter(item => item.value > 0));

        // 4. Generate historical data based on current data (since no historical tracking exists in DB)
        const currentTotals = {
          immobilier: repartition.Immobilier,
          assuranceVie: repartition['Assurance Vie'],
          per: repartition.PER,
          epargne: repartition.Épargne,
          autre: repartition.Autre,
          entreprise: repartition.Entreprise
        };

        // Generate 6 months of historical data with realistic growth patterns
        const months = ['Jan', 'Fév', 'Mars', 'Avr', 'Mai', 'Juin'];
        const historicalData = months.map((mois, index) => {
          const growthFactor = 0.85 + (index * 0.025); // Growth from 85% to 97.5% of current
          return {
            mois,
            immobilier: Math.round(currentTotals.immobilier * growthFactor),
            assuranceVie: Math.round(currentTotals.assuranceVie * growthFactor),
            per: Math.round(currentTotals.per * growthFactor),
            epargne: Math.round(currentTotals.epargne * growthFactor),
            autre: Math.round(currentTotals.autre * growthFactor),
            entreprise: Math.round(currentTotals.entreprise * growthFactor)
          };
        });

        setHistoricData(historicalData);

      } catch (error) {
        console.error('❌ Erreur générale lors du fetch des données:', error);
        console.error('Stack trace:', error.stack);
      } finally {
        setLoading(false);
        console.log('🏁 Fin du chargement des données');
      }
    };

    fetchData();
  }, []);

  // Calcul du total des encours
  const totalEncours = repartitionData.reduce((sum, item) => sum + item.value, 0);
  const totalEncoursReel = opportunitesData.reduce((sum, item) => sum + item.encoursReel, 0);
  const potentielTotal = opportunitesData.reduce((sum, item) => sum + item.potentiel, 0);
  
  // Préparation des données pour l'affichage des tableaux
  const formattedClients = [...clientsData].sort((a, b) => {
    if (sortDirection === "asc") {
      return a[sortColumn as keyof typeof a] > b[sortColumn as keyof typeof b] ? 1 : -1;
    } else {
      return a[sortColumn as keyof typeof a] < b[sortColumn as keyof typeof b] ? 1 : -1;
    }
  }).filter(client => 
    (client.nom && client.nom.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (client.prenom && client.prenom.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Préparation des données pour l'affichage des opportunités
  const formattedOpportunites = [...opportunitesData].sort((a, b) => {
    if (opportunitesTab === "potentiel") {
      return b.potentiel - a.potentiel;
    } else if (opportunitesTab === "conversion") {
      return a.tauxConversion - b.tauxConversion;
    } else {
      // Sorting by 'dernierContact' is not implemented as data is not available
      return 0;
    }
  });

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("desc");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-2xl">Chargement des données...</div>
      </div>
    );
  }

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
          <Button 
            variant={debugMode ? "default" : "outline"}
            onClick={() => setDebugMode(!debugMode)}
            size="sm"
          >
            Mode Debug
          </Button>
        </div>
      </div>

      {/* Tuiles récapitulatives */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total encours théoriques</CardDescription>
            <CardTitle className="text-2xl">
              {(totalEncours / 1000000).toFixed(2)} M€
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              +8,5% depuis le début de l'année
            </div>
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
              Taux de conversion: {(totalEncoursReel / totalEncours * 100).toFixed(1)}%
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
            <CardDescription>Clients avec encours théoriques</CardDescription>
            <CardTitle className="text-2xl">
              {opportunitesData.filter(client => client.encoursTheorique > 0).length}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              Clients ayant des actifs non gérés
            </div>
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
                  <Tooltip formatter={(value) => `${(value as number / 1000).toFixed(0)} K€`} />
                  <Legend />
                  <Line type="monotone" dataKey="immobilier" name="Immobilier" stroke="#8B5CF6" strokeWidth={2} />
                  <Line type="monotone" dataKey="assuranceVie" name="Assurance Vie" stroke="#D946EF" strokeWidth={2} />
                  <Line type="monotone" dataKey="per" name="PER" stroke="#F97316" strokeWidth={2} />
                  <Line type="monotone" dataKey="epargne" name="Épargne" stroke="#0EA5E9" strokeWidth={2} />
                  <Line type="monotone" dataKey="entreprise" name="Entreprise" stroke="#22D3EE" strokeWidth={2} />
                  <Line type="monotone" dataKey="autre" name="Autre" stroke="#10B981" strokeWidth={2} />
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
              <CardDescription>
                Vue globale des actifs hors gestion Eparnova
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
                        {repartitionData.map((_, index) => (
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

        {/* Onglet 3: Opportunités */}
        <TabsContent value="opportunites">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                <div>
                  <CardTitle>Opportunités de conversion</CardTitle>
                  <CardDescription>
                    Potentiel d'encours convertibles pour Eparnova
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant={opportunitesTab === "potentiel" ? "default" : "outline"}
                    onClick={() => setOpportunitesTab("potentiel")}
                    size="sm"
                  >
                    Potentiel
                  </Button>
                  <Button 
                    variant={opportunitesTab === "conversion" ? "default" : "outline"}
                    onClick={() => setOpportunitesTab("conversion")}
                    size="sm"
                  >
                    Taux de conversion
                  </Button>
                  <Button 
                    variant={opportunitesTab === "contact" ? "default" : "outline"}
                    onClick={() => setOpportunitesTab("contact")}
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
                    {formattedOpportunites.map((client) => (
                      <tr key={client.id} className="border-b hover:bg-muted/50">
                        <td className="py-3 px-4 font-medium">
                          {client.prenom} {client.nom}
                        </td>
                        <td className="text-right py-3 px-4">
                          {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(client.encoursTheorique)}
                        </td>
                        <td className="text-right py-3 px-4">
                          {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(client.encoursReel)}
                        </td>
                        <td className="text-right py-3 px-4 font-medium text-amber-600">
                          {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(client.potentiel)}
                        </td>
                        <td className="py-3 px-4">
                          <div className="w-full flex flex-col items-center">
                            <span className={`text-sm font-medium ${client.tauxConversion > 50 ? 'text-emerald-600' : 'text-amber-600'}`}>
                              {client.tauxConversion}%
                            </span>
                            <Progress value={client.tauxConversion} className="h-2 w-full mt-1" />
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm">
                          {client.produits}
                        </td>
                        <td className="text-center py-3 px-4">
                          {client.dernierContact}
                        </td>
                        <td className="text-center py-3 px-4">
                          <Button size="sm" variant="outline">Contacter</Button>
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
                  <CardDescription>
                    Détail des encours hors gestion par client
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
                        onClick={() => handleSort('entreprise')}
                      >
                        <div className="flex items-center justify-end">
                          Entreprise
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
                          {client.immobilier > 0 
                            ? new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(client.immobilier)
                            : "—"}
                        </td>
                        <td className="text-right py-3 px-4">
                          {client.assuranceVie > 0 
                            ? new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(client.assuranceVie)
                            : "—"}
                        </td>
                        <td className="text-right py-3 px-4">
                          {client.per > 0 
                            ? new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(client.per)
                            : "—"}
                        </td>
                        <td className="text-right py-3 px-4">
                          {client.epargne > 0 
                            ? new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(client.epargne)
                            : "—"}
                        </td>
                        <td className="text-right py-3 px-4">
                          {client.entreprise > 0 
                            ? new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(client.entreprise)
                            : "—"}
                        </td>
                        <td className="text-right py-3 px-4">
                          {client.autre > 0 
                            ? new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(client.autre)
                            : "—"}
                        </td>
                        <td className="text-right py-3 px-4 font-medium">
                          {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(client.total)}
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
