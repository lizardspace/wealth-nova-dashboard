
import React, { useState } from 'react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Download, FileSpreadsheet, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Interface pour le type des champs d'export
interface ExportFields {
  nomPrenom: boolean;
  dateNaissance: boolean;
  email: boolean;
  telephone: boolean;
  patrimoineEstime: boolean;
  abonne: boolean;
  encoursReel: boolean;
  encoursTheorique: boolean;
  scoreIA: boolean;
  statutProfil: boolean;
  objetPatrimoniaux: boolean;
  produitsDetenus: boolean;
  simulationsEffectuees: boolean;
  rendezvousProgrammes: boolean;
  rencontresEffectuees: boolean;
  dateDerniereConnexion: boolean;
  derniereActivite: boolean;
}

const ExportDonneesPage = () => {
  const { toast } = useToast();
  const [format, setFormat] = useState<'csv' | 'xlsx'>('xlsx');
  
  // Initialisation des champs avec les valeurs par défaut
  const [selectedFields, setSelectedFields] = useState<ExportFields>({
    nomPrenom: true,
    dateNaissance: true,
    email: true,
    telephone: true,
    patrimoineEstime: true,
    abonne: true,
    encoursReel: true,
    encoursTheorique: true,
    scoreIA: true,
    statutProfil: false,
    objetPatrimoniaux: false,
    produitsDetenus: false,
    simulationsEffectuees: false,
    rendezvousProgrammes: false,
    rencontresEffectuees: false,
    dateDerniereConnexion: false,
    derniereActivite: false
  });

  // Fonction pour sélectionner tous les champs
  const selectAll = () => {
    // Créer un nouvel objet avec toutes les propriétés à true
    const allSelected = Object.keys(selectedFields).reduce((acc, key) => {
      acc[key as keyof ExportFields] = true;
      return acc;
    }, {} as ExportFields);
    
    setSelectedFields(allSelected);
  };

  // Fonction pour désélectionner tous les champs
  const deselectAll = () => {
    // Créer un nouvel objet avec toutes les propriétés à false
    const allDeselected = Object.keys(selectedFields).reduce((acc, key) => {
      acc[key as keyof ExportFields] = false;
      return acc;
    }, {} as ExportFields);
    
    setSelectedFields(allDeselected);
  };

  // Fonction pour mettre à jour un champ spécifique
  const toggleField = (field: keyof ExportFields) => {
    setSelectedFields({
      ...selectedFields,
      [field]: !selectedFields[field]
    });
  };

  // Fonction pour générer l'export
  const handleExport = () => {
    // Compter le nombre de champs sélectionnés
    const selectedCount = Object.values(selectedFields).filter(Boolean).length;

    toast({
      title: `Export ${format.toUpperCase()} lancé`,
      description: `Export de ${selectedCount} colonnes en cours de génération...`,
      duration: 3000,
    });
    
    // Simuler un délai de génération
    setTimeout(() => {
      toast({
        title: "Export terminé",
        description: `Le fichier ${format.toUpperCase()} est prêt à être téléchargé`,
        duration: 5000,
      });
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Export des données clients</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Configurer l'export</CardTitle>
          <CardDescription>
            Sélectionnez les informations à inclure dans votre export et choisissez le format.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="fields" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="fields">Champs à exporter</TabsTrigger>
              <TabsTrigger value="filters">Filtres</TabsTrigger>
              <TabsTrigger value="format">Format et options</TabsTrigger>
            </TabsList>
            
            <TabsContent value="fields" className="space-y-4">
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={selectAll} size="sm">
                  Tout sélectionner
                </Button>
                <Button variant="outline" onClick={deselectAll} size="sm">
                  Tout désélectionner
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Groupe: Informations personnelles */}
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Informations personnelles</h3>
                  <div className="space-y-1.5">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="nomPrenom" 
                        checked={selectedFields.nomPrenom} 
                        onCheckedChange={() => toggleField('nomPrenom')}
                      />
                      <Label htmlFor="nomPrenom">Nom et prénom</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="dateNaissance" 
                        checked={selectedFields.dateNaissance} 
                        onCheckedChange={() => toggleField('dateNaissance')}
                      />
                      <Label htmlFor="dateNaissance">Date de naissance</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="email" 
                        checked={selectedFields.email} 
                        onCheckedChange={() => toggleField('email')}
                      />
                      <Label htmlFor="email">Email</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="telephone" 
                        checked={selectedFields.telephone} 
                        onCheckedChange={() => toggleField('telephone')}
                      />
                      <Label htmlFor="telephone">Téléphone</Label>
                    </div>
                  </div>
                </div>
                
                {/* Groupe: Situation financière */}
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Situation financière</h3>
                  <div className="space-y-1.5">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="patrimoineEstime" 
                        checked={selectedFields.patrimoineEstime} 
                        onCheckedChange={() => toggleField('patrimoineEstime')}
                      />
                      <Label htmlFor="patrimoineEstime">Patrimoine estimé</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="encoursReel" 
                        checked={selectedFields.encoursReel} 
                        onCheckedChange={() => toggleField('encoursReel')}
                      />
                      <Label htmlFor="encoursReel">Encours réel</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="encoursTheorique" 
                        checked={selectedFields.encoursTheorique} 
                        onCheckedChange={() => toggleField('encoursTheorique')}
                      />
                      <Label htmlFor="encoursTheorique">Encours théorique</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="produitsDetenus" 
                        checked={selectedFields.produitsDetenus} 
                        onCheckedChange={() => toggleField('produitsDetenus')}
                      />
                      <Label htmlFor="produitsDetenus">Produits détenus</Label>
                    </div>
                  </div>
                </div>
                
                {/* Groupe: Activité client */}
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Activité client</h3>
                  <div className="space-y-1.5">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="abonne" 
                        checked={selectedFields.abonne} 
                        onCheckedChange={() => toggleField('abonne')}
                      />
                      <Label htmlFor="abonne">Statut abonnement</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="dateDerniereConnexion" 
                        checked={selectedFields.dateDerniereConnexion} 
                        onCheckedChange={() => toggleField('dateDerniereConnexion')}
                      />
                      <Label htmlFor="dateDerniereConnexion">Dernière connexion</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="derniereActivite" 
                        checked={selectedFields.derniereActivite} 
                        onCheckedChange={() => toggleField('derniereActivite')}
                      />
                      <Label htmlFor="derniereActivite">Dernière activité</Label>
                    </div>
                  </div>
                </div>
                
                {/* Groupe: Intelligence artificielle */}
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Intelligence artificielle</h3>
                  <div className="space-y-1.5">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="scoreIA" 
                        checked={selectedFields.scoreIA} 
                        onCheckedChange={() => toggleField('scoreIA')}
                      />
                      <Label htmlFor="scoreIA">Score patrimonial IA</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="statutProfil" 
                        checked={selectedFields.statutProfil} 
                        onCheckedChange={() => toggleField('statutProfil')}
                      />
                      <Label htmlFor="statutProfil">Statut du profil</Label>
                    </div>
                  </div>
                </div>
                
                {/* Groupe: Objectifs et simulations */}
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Objectifs et simulations</h3>
                  <div className="space-y-1.5">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="objetPatrimoniaux" 
                        checked={selectedFields.objetPatrimoniaux} 
                        onCheckedChange={() => toggleField('objetPatrimoniaux')}
                      />
                      <Label htmlFor="objetPatrimoniaux">Objectifs patrimoniaux</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="simulationsEffectuees" 
                        checked={selectedFields.simulationsEffectuees} 
                        onCheckedChange={() => toggleField('simulationsEffectuees')}
                      />
                      <Label htmlFor="simulationsEffectuees">Simulations effectuées</Label>
                    </div>
                  </div>
                </div>
                
                {/* Groupe: Rendez-vous */}
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Rendez-vous</h3>
                  <div className="space-y-1.5">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="rendezvousProgrammes" 
                        checked={selectedFields.rendezvousProgrammes} 
                        onCheckedChange={() => toggleField('rendezvousProgrammes')}
                      />
                      <Label htmlFor="rendezvousProgrammes">RDV programmés</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="rencontresEffectuees" 
                        checked={selectedFields.rencontresEffectuees} 
                        onCheckedChange={() => toggleField('rencontresEffectuees')}
                      />
                      <Label htmlFor="rencontresEffectuees">Rencontres effectuées</Label>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="filters">
              <div className="bg-muted/50 rounded-md p-4 text-center">
                <Users className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                <h3 className="text-sm font-medium">Filtres clients</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Cette fonctionnalité permet de filtrer les clients à inclure dans l'export selon différents critères.
                </p>
                <Button variant="outline" className="mt-4" disabled>
                  Bientôt disponible
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="format" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center space-x-2">
                      <FileSpreadsheet className="h-5 w-5 text-green-600" />
                      <CardTitle className="text-base">Format Excel (XLSX)</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Format complet avec mise en forme, filtres et onglets multiples.
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      variant={format === 'xlsx' ? 'default' : 'outline'} 
                      className="w-full" 
                      onClick={() => setFormat('xlsx')}
                    >
                      Sélectionner XLSX
                    </Button>
                  </CardFooter>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center space-x-2">
                      <FileSpreadsheet className="h-5 w-5 text-blue-600" />
                      <CardTitle className="text-base">Format CSV</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Format simple compatible avec tous les logiciels, séparateur au choix.
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      variant={format === 'csv' ? 'default' : 'outline'} 
                      className="w-full" 
                      onClick={() => setFormat('csv')}
                    >
                      Sélectionner CSV
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="text-sm text-muted-foreground">
            {Object.values(selectedFields).filter(Boolean).length} champs sélectionnés
          </div>
          <Button onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Générer l'export {format.toUpperCase()}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ExportDonneesPage;
