
import React, { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, UserPlus, Filter, BarChart, BriefcaseIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Données fictives pour la démo
const mockClients = [
  { id: 1, nom: "Dupont", prenom: "Jean", dateNaissance: "15/04/1975", telephone: "06 12 34 56 78", email: "jean.dupont@email.com", abonnement: true, scoreIA: 85, statutProfil: "complet", derniereActivite: "10/04/2025", patrimoineGlobal: 850000, actifs: 920000, passifs: 70000 },
  { id: 2, nom: "Martin", prenom: "Sophie", dateNaissance: "22/07/1980", telephone: "06 23 45 67 89", email: "sophie.martin@email.com", abonnement: true, scoreIA: 72, statutProfil: "complet", derniereActivite: "12/04/2025", patrimoineGlobal: 650000, actifs: 790000, passifs: 140000 },
  { id: 3, nom: "Bernard", prenom: "Pierre", dateNaissance: "30/11/1965", telephone: "06 34 56 78 90", email: "pierre.bernard@email.com", abonnement: false, scoreIA: 65, statutProfil: "incomplet", derniereActivite: "05/03/2025", patrimoineGlobal: 420000, actifs: 490000, passifs: 70000 },
  { id: 4, nom: "Petit", prenom: "Marie", dateNaissance: "18/09/1990", telephone: "06 45 67 89 01", email: "marie.petit@email.com", abonnement: false, scoreIA: 91, statutProfil: "complet", derniereActivite: "15/04/2025", patrimoineGlobal: 1250000, actifs: 1400000, passifs: 150000 },
  { id: 5, nom: "Robert", prenom: "Antoine", dateNaissance: "07/06/1972", telephone: "06 56 78 90 12", email: "antoine.robert@email.com", abonnement: true, scoreIA: 78, statutProfil: "complet", derniereActivite: "08/04/2025", patrimoineGlobal: 720000, actifs: 920000, passifs: 200000 }
];

const ListeClientsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredClients, setFilteredClients] = useState(mockClients);
  const [filter, setFilter] = useState({
    abonnement: "all",
    statut: "all",
    score: "all"
  });
  const navigate = useNavigate();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    
    applyFilters(term, filter);
  };

  const handleFilterChange = (key: string, value: string) => {
    const newFilter = { ...filter, [key]: value };
    setFilter(newFilter);
    applyFilters(searchTerm, newFilter);
  };

  const applyFilters = (term: string, currentFilter: typeof filter) => {
    let results = mockClients;
    
    // Apply search term
    if (term) {
      results = results.filter(client => 
        client.nom.toLowerCase().includes(term) || 
        client.prenom.toLowerCase().includes(term) || 
        client.email.toLowerCase().includes(term)
      );
    }

    // Apply abonnement filter
    if (currentFilter.abonnement !== "all") {
      const isSubscribed = currentFilter.abonnement === "true";
      results = results.filter(client => client.abonnement === isSubscribed);
    }

    // Apply statut filter
    if (currentFilter.statut !== "all") {
      results = results.filter(client => client.statutProfil === currentFilter.statut);
    }

    // Apply score filter
    if (currentFilter.score !== "all") {
      switch(currentFilter.score) {
        case "high":
          results = results.filter(client => client.scoreIA >= 80);
          break;
        case "medium":
          results = results.filter(client => client.scoreIA >= 60 && client.scoreIA < 80);
          break;
        case "low":
          results = results.filter(client => client.scoreIA < 60);
          break;
      }
    }
    
    setFilteredClients(results);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('fr-FR', { 
      style: 'currency', 
      currency: 'EUR',
      maximumFractionDigits: 0 
    }).format(value);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Liste des clients</h1>
        <Button 
          className="flex items-center gap-2"
          onClick={() => navigate("/admin/clients/new")}
        >
          <UserPlus className="h-4 w-4" />
          Nouveau client
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recherche et filtres</CardTitle>
          <CardDescription>
            Recherchez des clients par nom, prénom ou email et appliquez des filtres
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un client..."
                value={searchTerm}
                onChange={handleSearch}
                className="pl-8"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Select 
                defaultValue={filter.abonnement}
                onValueChange={(value) => handleFilterChange('abonnement', value)}
              >
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Abonnement" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous</SelectItem>
                  <SelectItem value="true">Abonnés</SelectItem>
                  <SelectItem value="false">Non abonnés</SelectItem>
                </SelectContent>
              </Select>
              
              <Select 
                defaultValue={filter.statut}
                onValueChange={(value) => handleFilterChange('statut', value)}
              >
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Statut profil" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous</SelectItem>
                  <SelectItem value="complet">Complets</SelectItem>
                  <SelectItem value="incomplet">Incomplets</SelectItem>
                </SelectContent>
              </Select>
              
              <Select 
                defaultValue={filter.score}
                onValueChange={(value) => handleFilterChange('score', value)}
              >
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Score IA" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous</SelectItem>
                  <SelectItem value="high">Élevé (80+)</SelectItem>
                  <SelectItem value="medium">Moyen (60-79)</SelectItem>
                  <SelectItem value="low">Faible (&lt;60)</SelectItem>
                </SelectContent>
              </Select>
              
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6 overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="whitespace-nowrap">Nom</TableHead>
                <TableHead className="whitespace-nowrap">Prénom</TableHead>
                <TableHead className="whitespace-nowrap">Patrimoine global</TableHead>
                <TableHead className="whitespace-nowrap">Téléphone</TableHead>
                <TableHead className="whitespace-nowrap">Email</TableHead>
                <TableHead className="whitespace-nowrap">Abonnement</TableHead>
                <TableHead className="whitespace-nowrap">Score IA</TableHead>
                <TableHead className="whitespace-nowrap">Statut</TableHead>
                <TableHead className="whitespace-nowrap">Dernière activité</TableHead>
                <TableHead className="whitespace-nowrap">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClients.map((client) => (
                <TableRow 
                  key={client.id}
                  className="cursor-pointer hover:bg-muted"
                  onClick={() => navigate(`/admin/clients/${client.id}`)}
                >
                  <TableCell className="font-medium">{client.nom}</TableCell>
                  <TableCell>{client.prenom}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <BriefcaseIcon className="h-4 w-4 text-muted-foreground"/>
                      <span>{formatCurrency(client.patrimoineGlobal)}</span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Actifs: {formatCurrency(client.actifs)} / Passifs: {formatCurrency(client.passifs)}
                    </div>
                  </TableCell>
                  <TableCell>{client.telephone}</TableCell>
                  <TableCell>{client.email}</TableCell>
                  <TableCell>
                    <Badge variant={client.abonnement ? "default" : "outline"}>
                      {client.abonnement ? "Abonné" : "Non abonné"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      className={`${
                        client.scoreIA > 80 ? "bg-green-100 text-green-800" : 
                        client.scoreIA > 60 ? "bg-yellow-100 text-yellow-800" : 
                        "bg-red-100 text-red-800"
                      }`}
                    >
                      {client.scoreIA}/100
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={client.statutProfil === "complet" ? "default" : "destructive"}>
                      {client.statutProfil}
                    </Badge>
                  </TableCell>
                  <TableCell>{client.derniereActivite}</TableCell>
                  <TableCell>
                    <div className="flex space-x-1">
                      <Button size="icon" variant="outline" className="h-8 w-8">
                        <BarChart className="h-4 w-4" />
                        <span className="sr-only">Analyser</span>
                      </Button>
                      <Button size="icon" variant="outline" className="h-8 w-8">
                        <BriefcaseIcon className="h-4 w-4" />
                        <span className="sr-only">Portfolio</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ListeClientsPage;
