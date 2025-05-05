
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft,
  User,
  BriefcaseIcon,
  Package,
  Clock,
  Bell,
  Phone,
  Video,
  Users
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import AppointmentModal from '@/components/appointments/AppointmentModal';

// Mock client data for demonstration
const mockClientData = {
  id: 1,
  nom: "Dupont",
  prenom: "Jean",
  dateNaissance: "15/04/1975",
  telephone: "06 12 34 56 78",
  email: "jean.dupont@email.com",
  adresse: "123 Avenue des Champs-Élysées, 75008 Paris",
  situationFamiliale: "Marié",
  enfants: 2,
  profession: "Cadre supérieur",
  societe: "Entreprise SA",
  patrimoineGlobal: 850000,
  actifs: 920000,
  passifs: 70000,
  scoreIA: 85,
  profilRisque: "Dynamique",
  revenus: 95000,
  charges: 45000,
  ir: 12500,
  ifi: 0,
  prets: [
    { type: "Immobilier", montant: 280000, tauxInteret: "1.2%", mensualite: 950, echeance: "2045" },
    { type: "Consommation", montant: 15000, tauxInteret: "3.5%", mensualite: 350, echeance: "2026" }
  ],
  produits: [
    { id: 1, type: "Assurance vie", nom: "Contrat Premium", montant: 150000, dateOuverture: "12/03/2020", performance: "+4.2%" },
    { id: 2, type: "PEA", nom: "PEA Actions Europe", montant: 75000, dateOuverture: "05/09/2018", performance: "+5.8%" },
    { id: 3, type: "SCPI", nom: "SCPI Rendement", montant: 50000, dateOuverture: "18/11/2022", performance: "+3.8%" }
  ],
  repartitionActifs: {
    immobilier: 65,
    actions: 15,
    obligations: 8,
    monetaire: 5,
    autres: 7
  },
  objectifs: ["Préparation retraite", "Optimisation fiscale", "Constitution patrimoine"],
  historique: [
    { date: "15/04/2025", type: "Connexion", description: "Connexion à l'espace client" },
    { date: "12/04/2025", type: "Simulation", description: "Simulation épargne retraite" },
    { date: "01/04/2025", type: "Document", description: "Téléchargement relevé annuel" }
  ],
  rendezVous: [
    { id: 1, date: "20/05/2025", heure: "14:00", type: "video", theme: "Bilan patrimonial", conseiller: "Marie Lambert", statut: "confirmed" },
    { id: 2, date: "06/03/2025", heure: "10:30", type: "in-person", theme: "Signature contrat assurance vie", conseiller: "Paul Bernard", statut: "done" }
  ],
  alertes: [
    { id: 1, type: "opportunity", titre: "Épargne dormante", description: "25 000€ sur compte courant sans rendement", date: "10/04/2025", priorite: "high" },
    { id: 2, type: "profile", titre: "Mise à jour KYC", description: "Justificatif d'identité à renouveler", date: "05/04/2025", priorite: "medium" }
  ]
};

const ClientDetailPage = () => {
  const { clientId } = useParams<{ clientId: string }>();
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('fr-FR', { 
      style: 'currency', 
      currency: 'EUR',
      maximumFractionDigits: 0 
    }).format(value);
  };

  const renderAppointmentTypeIcon = (type: string) => {
    switch(type) {
      case 'video':
        return <Video className="h-4 w-4 text-blue-500" />;
      case 'call':
        return <Phone className="h-4 w-4 text-green-500" />;
      case 'in-person':
      default:
        return <Users className="h-4 w-4 text-purple-500" />;
    }
  };

  const handleNewAppointment = (data: any) => {
    console.log("Nouveau rendez-vous:", data);
    // Implement actual saving logic here
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/admin/clients">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">
            {mockClientData.prenom} {mockClientData.nom}
          </h1>
          <Badge>{mockClientData.profilRisque}</Badge>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsAppointmentModalOpen(true)}>
            Nouveau RDV
          </Button>
          <Button>
            Éditer le profil
          </Button>
        </div>
      </div>

      <Tabs defaultValue="identity" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="identity" className="flex items-center gap-1">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Identité</span>
          </TabsTrigger>
          <TabsTrigger value="patrimony" className="flex items-center gap-1">
            <BriefcaseIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Patrimoine</span>
          </TabsTrigger>
          <TabsTrigger value="products" className="flex items-center gap-1">
            <Package className="h-4 w-4" />
            <span className="hidden sm:inline">Produits</span>
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span className="hidden sm:inline">Historique</span>
          </TabsTrigger>
          <TabsTrigger value="crm" className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Suivi CRM</span>
          </TabsTrigger>
          <TabsTrigger value="alerts" className="flex items-center gap-1">
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Alertes</span>
          </TabsTrigger>
        </TabsList>

        {/* Onglet Identité */}
        <TabsContent value="identity">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Informations personnelles</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="space-y-4">
                  <div className="grid grid-cols-2 gap-2">
                    <dt className="text-sm font-medium text-muted-foreground">Nom</dt>
                    <dd>{mockClientData.nom}</dd>
                    <dt className="text-sm font-medium text-muted-foreground">Prénom</dt>
                    <dd>{mockClientData.prenom}</dd>
                    <dt className="text-sm font-medium text-muted-foreground">Date de naissance</dt>
                    <dd>{mockClientData.dateNaissance}</dd>
                    <dt className="text-sm font-medium text-muted-foreground">Téléphone</dt>
                    <dd>{mockClientData.telephone}</dd>
                    <dt className="text-sm font-medium text-muted-foreground">Email</dt>
                    <dd>{mockClientData.email}</dd>
                    <dt className="text-sm font-medium text-muted-foreground">Adresse</dt>
                    <dd>{mockClientData.adresse}</dd>
                  </div>
                </dl>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Situation familiale et professionnelle</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="space-y-4">
                  <div className="grid grid-cols-2 gap-2">
                    <dt className="text-sm font-medium text-muted-foreground">Situation familiale</dt>
                    <dd>{mockClientData.situationFamiliale}</dd>
                    <dt className="text-sm font-medium text-muted-foreground">Nombre d'enfants</dt>
                    <dd>{mockClientData.enfants}</dd>
                    <dt className="text-sm font-medium text-muted-foreground">Profession</dt>
                    <dd>{mockClientData.profession}</dd>
                    <dt className="text-sm font-medium text-muted-foreground">Société</dt>
                    <dd>{mockClientData.societe}</dd>
                  </div>
                </dl>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Onglet Patrimoine */}
        <TabsContent value="patrimony">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Vue d'ensemble patrimoniale</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="space-y-4">
                  <div className="grid grid-cols-2 gap-2">
                    <dt className="text-sm font-medium text-muted-foreground">Patrimoine global</dt>
                    <dd className="font-bold">{formatCurrency(mockClientData.patrimoineGlobal)}</dd>
                    <dt className="text-sm font-medium text-muted-foreground">Actifs</dt>
                    <dd className="text-green-600">{formatCurrency(mockClientData.actifs)}</dd>
                    <dt className="text-sm font-medium text-muted-foreground">Passifs</dt>
                    <dd className="text-red-600">{formatCurrency(mockClientData.passifs)}</dd>
                    <dt className="text-sm font-medium text-muted-foreground">Score IA</dt>
                    <dd>
                      <Badge className={
                        mockClientData.scoreIA > 80 ? "bg-green-100 text-green-800" : 
                        mockClientData.scoreIA > 60 ? "bg-yellow-100 text-yellow-800" : 
                        "bg-red-100 text-red-800"
                      }>
                        {mockClientData.scoreIA}/100
                      </Badge>
                    </dd>
                    <dt className="text-sm font-medium text-muted-foreground">Profil de risque</dt>
                    <dd>{mockClientData.profilRisque}</dd>
                  </div>
                </dl>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Revenus et fiscalité</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="space-y-4">
                  <div className="grid grid-cols-2 gap-2">
                    <dt className="text-sm font-medium text-muted-foreground">Revenus annuels</dt>
                    <dd>{formatCurrency(mockClientData.revenus)}</dd>
                    <dt className="text-sm font-medium text-muted-foreground">Charges annuelles</dt>
                    <dd>{formatCurrency(mockClientData.charges)}</dd>
                    <dt className="text-sm font-medium text-muted-foreground">Impôt sur le revenu</dt>
                    <dd>{formatCurrency(mockClientData.ir)}</dd>
                    <dt className="text-sm font-medium text-muted-foreground">IFI</dt>
                    <dd>{formatCurrency(mockClientData.ifi)}</dd>
                  </div>
                </dl>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Emprunts en cours</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>Capital restant</TableHead>
                      <TableHead>Taux</TableHead>
                      <TableHead>Mensualité</TableHead>
                      <TableHead>Échéance</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockClientData.prets.map((pret, index) => (
                      <TableRow key={index}>
                        <TableCell>{pret.type}</TableCell>
                        <TableCell>{formatCurrency(pret.montant)}</TableCell>
                        <TableCell>{pret.tauxInteret}</TableCell>
                        <TableCell>{pret.mensualite}€/mois</TableCell>
                        <TableCell>{pret.echeance}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Objectifs patrimoniaux</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {mockClientData.objectifs.map((objectif, index) => (
                    <Badge key={index} variant="outline">{objectif}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Onglet Produits */}
        <TabsContent value="products">
          <Card>
            <CardHeader>
              <CardTitle>Produits souscrits</CardTitle>
              <CardDescription>
                Liste des produits financiers détenus par le client
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Nom</TableHead>
                    <TableHead>Montant</TableHead>
                    <TableHead>Date d'ouverture</TableHead>
                    <TableHead>Performance</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockClientData.produits.map((produit) => (
                    <TableRow key={produit.id}>
                      <TableCell>{produit.type}</TableCell>
                      <TableCell>{produit.nom}</TableCell>
                      <TableCell>{formatCurrency(produit.montant)}</TableCell>
                      <TableCell>{produit.dateOuverture}</TableCell>
                      <TableCell className={produit.performance.startsWith('+') ? "text-green-600" : "text-red-600"}>
                        {produit.performance}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          Détails
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Historique */}
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Historique des actions</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Description</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockClientData.historique.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.date}</TableCell>
                      <TableCell>{item.type}</TableCell>
                      <TableCell>{item.description}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet CRM */}
        <TabsContent value="crm">
          <Card>
            <CardHeader>
              <CardTitle>Rendez-vous</CardTitle>
              <div className="flex justify-between items-center">
                <CardDescription>Historique et planification des rendez-vous</CardDescription>
                <Button size="sm" onClick={() => setIsAppointmentModalOpen(true)}>
                  Nouveau RDV
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Heure</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Thème</TableHead>
                    <TableHead>Conseiller</TableHead>
                    <TableHead>Statut</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockClientData.rendezVous.map((rdv) => (
                    <TableRow key={rdv.id}>
                      <TableCell>{rdv.date}</TableCell>
                      <TableCell>{rdv.heure}</TableCell>
                      <TableCell className="flex items-center gap-1">
                        {renderAppointmentTypeIcon(rdv.type)}
                        <span>
                          {rdv.type === 'video' ? 'Visio' : 
                           rdv.type === 'call' ? 'Téléphone' : 'Présentiel'}
                        </span>
                      </TableCell>
                      <TableCell>{rdv.theme}</TableCell>
                      <TableCell>{rdv.conseiller}</TableCell>
                      <TableCell>
                        <Badge
                          variant={rdv.statut === "confirmed" ? "outline" : 
                                 rdv.statut === "done" ? "secondary" : "default"}
                        >
                          {rdv.statut === "confirmed" ? "À venir" : 
                           rdv.statut === "done" ? "Terminé" : "À confirmer"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Alertes */}
        <TabsContent value="alerts">
          <Card>
            <CardHeader>
              <CardTitle>Alertes et opportunités</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockClientData.alertes.map((alerte) => (
                  <Card key={alerte.id} className={
                    alerte.priorite === 'high' ? 'border-red-300' : 
                    alerte.priorite === 'medium' ? 'border-yellow-300' : 'border-blue-300'
                  }>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-base">{alerte.titre}</CardTitle>
                        <Badge variant={
                          alerte.type === 'opportunity' ? 'default' : 'outline'
                        }>
                          {alerte.type === 'opportunity' ? 'Opportunité' : 'Alerte'}
                        </Badge>
                      </div>
                      <CardDescription>{alerte.date}</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-sm">{alerte.description}</p>
                      <div className="flex justify-end mt-2">
                        <Button size="sm">Traiter</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <AppointmentModal 
        isOpen={isAppointmentModalOpen}
        onClose={() => setIsAppointmentModalOpen(false)}
        onSave={handleNewAppointment}
      />
    </div>
  );
};

export default ClientDetailPage;
