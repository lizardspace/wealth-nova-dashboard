import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Checkbox
} from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { FileDown, Check } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const ExportDonneesPage = () => {
  const { toast } = useToast();
  const [selectedFields, setSelectedFields] = useState({
    nomPrenom: true,
    dateNaissance: true,
    email: true,
    telephone: true,
    patrimoineEstime: true,
    abonne: true,
    encoursReel: true,
    encoursTheorique: true,
    scoreIA: true,
    objetPatrimoniaux: false,
    produitsSouscrits: false,
    adresse: false,
    situationFamiliale: false,
    enfants: false,
    profession: false,
    revenuAnnuel: false,
    derniereActivite: false
  });

  const handleCheckboxChange = (field: string, checked: boolean) => {
    setSelectedFields(prev => ({
      ...prev,
      [field]: checked
    }));
  };

  const handleSelectAll = () => {
    const allSelected = {
      nomPrenom: true,
      dateNaissance: true,
      email: true,
      telephone: true,
      patrimoineEstime: true,
      abonne: true,
      encoursReel: true,
      encoursTheorique: true,
      scoreIA: true,
      objetPatrimoniaux: true,
      produitsSouscrits: true,
      adresse: true,
      situationFamiliale: true,
      enfants: true,
      profession: true,
      revenuAnnuel: true,
      derniereActivite: true
    };

    setSelectedFields(allSelected);
  };

  const handleUnselectAll = () => {
    const allUnselected = {
      nomPrenom: false,
      dateNaissance: false,
      email: false,
      telephone: false,
      patrimoineEstime: false,
      abonne: false,
      encoursReel: false,
      encoursTheorique: false,
      scoreIA: false,
      objetPatrimoniaux: false,
      produitsSouscrits: false,
      adresse: false,
      situationFamiliale: false,
      enfants: false,
      profession: false,
      revenuAnnuel: false,
      derniereActivite: false
    };

    setSelectedFields(allUnselected);
  };

  const handleExport = () => {
    const selectedCount = Object.values(selectedFields).filter(Boolean).length;
    
    toast({
      title: "Export lancé",
      description: `Export de ${selectedCount} champs pour tous les clients en cours...`,
      duration: 3000,
    });
    
    // Simulation d'un délai pour l'export
    setTimeout(() => {
      toast({
        title: "Export terminé",
        description: "Le fichier a été téléchargé avec succès.",
        duration: 5000,
      });
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Export des données clients</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sélection des champs à exporter</CardTitle>
          <CardDescription>
            Choisissez les informations clients à inclure dans l'export CSV ou XLSX
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Informations générales</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <Checkbox 
                    id="nomPrenom" 
                    checked={selectedFields.nomPrenom}
                    onCheckedChange={(checked) => handleCheckboxChange('nomPrenom', checked as boolean)}
                  />
                  <label htmlFor="nomPrenom" className="text-sm">Nom et prénom</label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox 
                    id="dateNaissance" 
                    checked={selectedFields.dateNaissance}
                    onCheckedChange={(checked) => handleCheckboxChange('dateNaissance', checked as boolean)}
                  />
                  <label htmlFor="dateNaissance" className="text-sm">Date de naissance</label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox 
                    id="email" 
                    checked={selectedFields.email}
                    onCheckedChange={(checked) => handleCheckboxChange('email', checked as boolean)}
                  />
                  <label htmlFor="email" className="text-sm">Adresse email</label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox 
                    id="telephone" 
                    checked={selectedFields.telephone}
                    onCheckedChange={(checked) => handleCheckboxChange('telephone', checked as boolean)}
                  />
                  <label htmlFor="telephone" className="text-sm">Numéro de téléphone</label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox 
                    id="adresse" 
                    checked={selectedFields.adresse}
                    onCheckedChange={(checked) => handleCheckboxChange('adresse', checked as boolean)}
                  />
                  <label htmlFor="adresse" className="text-sm">Adresse postale</label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox 
                    id="situationFamiliale" 
                    checked={selectedFields.situationFamiliale}
                    onCheckedChange={(checked) => handleCheckboxChange('situationFamiliale', checked as boolean)}
                  />
                  <label htmlFor="situationFamiliale" className="text-sm">Situation familiale</label>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Données financières</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <Checkbox 
                    id="patrimoineEstime" 
                    checked={selectedFields.patrimoineEstime}
                    onCheckedChange={(checked) => handleCheckboxChange('patrimoineEstime', checked as boolean)}
                  />
                  <label htmlFor="patrimoineEstime" className="text-sm">Patrimoine estimé</label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox 
                    id="encoursReel" 
                    checked={selectedFields.encoursReel}
                    onCheckedChange={(checked) => handleCheckboxChange('encoursReel', checked as boolean)}
                  />
                  <label htmlFor="encoursReel" className="text-sm">Encours réel</label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox 
                    id="encoursTheorique" 
                    checked={selectedFields.encoursTheorique}
                    onCheckedChange={(checked) => handleCheckboxChange('encoursTheorique', checked as boolean)}
                  />
                  <label htmlFor="encoursTheorique" className="text-sm">Encours théorique</label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox 
                    id="revenuAnnuel" 
                    checked={selectedFields.revenuAnnuel}
                    onCheckedChange={(checked) => handleCheckboxChange('revenuAnnuel', checked as boolean)}
                  />
                  <label htmlFor="revenuAnnuel" className="text-sm">Revenu annuel</label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox 
                    id="produitsSouscrits" 
                    checked={selectedFields.produitsSouscrits}
                    onCheckedChange={(checked) => handleCheckboxChange('produitsSouscrits', checked as boolean)}
                  />
                  <label htmlFor="produitsSouscrits" className="text-sm">Produits souscrits</label>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Autres informations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <Checkbox 
                    id="abonne" 
                    checked={selectedFields.abonne}
                    onCheckedChange={(checked) => handleCheckboxChange('abonne', checked as boolean)}
                  />
                  <label htmlFor="abonne" className="text-sm">Statut d'abonnement</label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox 
                    id="scoreIA" 
                    checked={selectedFields.scoreIA}
                    onCheckedChange={(checked) => handleCheckboxChange('scoreIA', checked as boolean)}
                  />
                  <label htmlFor="scoreIA" className="text-sm">Score IA</label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox 
                    id="objetPatrimoniaux" 
                    checked={selectedFields.objetPatrimoniaux}
                    onCheckedChange={(checked) => handleCheckboxChange('objetPatrimoniaux', checked as boolean)}
                  />
                  <label htmlFor="objetPatrimoniaux" className="text-sm">Objectifs patrimoniaux</label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox 
                    id="profession" 
                    checked={selectedFields.profession}
                    onCheckedChange={(checked) => handleCheckboxChange('profession', checked as boolean)}
                  />
                  <label htmlFor="profession" className="text-sm">Profession</label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox 
                    id="derniereActivite" 
                    checked={selectedFields.derniereActivite}
                    onCheckedChange={(checked) => handleCheckboxChange('derniereActivite', checked as boolean)}
                  />
                  <label htmlFor="derniereActivite" className="text-sm">Date dernière activité</label>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleSelectAll}
              >
                <Check className="mr-1 h-4 w-4" />
                Tout sélectionner
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleUnselectAll}
              >
                Tout désélectionner
              </Button>
            </div>

            <Button onClick={handleExport}>
              <FileDown className="mr-2 h-4 w-4" />
              Exporter les données (CSV)
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExportDonneesPage;
