
import React, { useState } from 'react';
import {
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { 
  FileText,
  Download,
  Filter,
  UserPlus,
  Users,
  FilePlus
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from '@/lib/supabase';

// Types et données fictives
type FieldCategory = 'personal' | 'financial' | 'fiscal' | 'products' | 'simulations' | 'scores';

interface ExportField {
  id: string;
  label: string;
  category: FieldCategory;
  selected: boolean;
}

const exportFields: ExportField[] = [
  // Données personnelles
  { id: 'nom', label: 'Nom', category: 'personal', selected: true },
  { id: 'prenom', label: 'Prénom', category: 'personal', selected: true },
  { id: 'dateNaissance', label: 'Date de naissance', category: 'personal', selected: true },
  { id: 'adresse', label: 'Adresse complète', category: 'personal', selected: false },
  { id: 'email', label: 'Email', category: 'personal', selected: true },
  { id: 'telephone', label: 'Téléphone', category: 'personal', selected: true },
  { id: 'profession', label: 'Profession', category: 'personal', selected: false },
  { id: 'situationFamiliale', label: 'Situation familiale', category: 'personal', selected: false },
  { id: 'enfantsACharge', label: 'Enfants à charge', category: 'personal', selected: false },
  
  // Données financières
  { id: 'patrimoineGlobal', label: 'Patrimoine global', category: 'financial', selected: true },
  { id: 'actifs', label: 'Total des actifs', category: 'financial', selected: true },
  { id: 'passifs', label: 'Total des passifs', category: 'financial', selected: true },
  { id: 'liquidites', label: 'Liquidités', category: 'financial', selected: true },
  { id: 'immobilier', label: 'Actifs immobiliers', category: 'financial', selected: false },
  { id: 'valeursMobilieres', label: 'Valeurs mobilières', category: 'financial', selected: false },
  { id: 'epargneRetraite', label: 'Épargne retraite', category: 'financial', selected: false },
  { id: 'assuranceVie', label: 'Assurance vie', category: 'financial', selected: false },
  { id: 'creditImmobilier', label: 'Crédits immobiliers', category: 'financial', selected: false },
  { id: 'creditConsommation', label: 'Crédits à la consommation', category: 'financial', selected: false },
  { id: 'revenusAnnuels', label: 'Revenus annuels', category: 'financial', selected: false },
  { id: 'chargesAnnuelles', label: 'Charges annuelles', category: 'financial', selected: false },
  
  // Données fiscales
  { id: 'trancheImpot', label: 'Tranche d\'impôt', category: 'fiscal', selected: false },
  { id: 'revenuFiscalReference', label: 'Revenu fiscal de référence', category: 'fiscal', selected: false },
  { id: 'partsImpot', label: 'Nombre de parts', category: 'fiscal', selected: false },
  { id: 'imposableIFI', label: 'Assujetti IFI', category: 'fiscal', selected: false },
  { id: 'montantIFI', label: 'Montant IFI', category: 'fiscal', selected: false },
  { id: 'reductionsImpots', label: 'Réductions d\'impôts', category: 'fiscal', selected: false },
  
  // Produits souscrits
  { id: 'produitsSouscrits', label: 'Liste des produits', category: 'products', selected: false },
  { id: 'datesProduits', label: 'Dates de souscription', category: 'products', selected: false },
  { id: 'montantsProduits', label: 'Montants investis', category: 'products', selected: false },
  { id: 'performanceProduits', label: 'Performance des produits', category: 'products', selected: false },
  { id: 'fraisProduits', label: 'Frais des produits', category: 'products', selected: false },
  
  // Simulations
  { id: 'simulationsRealisees', label: 'Simulations réalisées', category: 'simulations', selected: false },
  { id: 'resultatsSimulation', label: 'Résultats des simulations', category: 'simulations', selected: false },
  { id: 'datesDerniereSimulation', label: 'Dates dernière simulation', category: 'simulations', selected: false },
  { id: 'typesSimulation', label: 'Types de simulation', category: 'simulations', selected: false },
  
  // Scores et profils
  { id: 'scorePatrimonial', label: 'Score patrimonial', category: 'scores', selected: true },
  { id: 'profilRisque', label: 'Profil de risque', category: 'scores', selected: true },
  { id: 'objectifsPatrimoniaux', label: 'Objectifs patrimoniaux', category: 'scores', selected: false },
  { id: 'horizonInvestissement', label: 'Horizon d\'investissement', category: 'scores', selected: false },
];

export default function ExportDonneesPage() {
  const [activeTab, setActiveTab] = useState<string>('fields');
  const [fields, setFields] = useState<ExportField[]>(exportFields);
  const [clients, setClients] = useState<any[]>([]);
  const [format, setFormat] = useState<string>('csv');
  const [selectedCategory, setSelectedCategory] = useState<FieldCategory | 'all'>('all');
  const [selectAllClients, setSelectAllClients] = useState(false);
  const [selectAllFields, setSelectAllFields] = useState(false);

  React.useEffect(() => {
    const fetchClients = async () => {
      const { data, error } = await supabase.from('clients').select('*');
      if (error) {
        console.error('Error fetching clients:', error);
      } else {
        setClients(data.map(client => ({ ...client, selected: false })));
      }
    };

    fetchClients();
  }, []);

  const handleFieldToggle = (fieldId: string) => {
    setFields(fields.map(field => 
      field.id === fieldId ? { ...field, selected: !field.selected } : field
    ));
  };

  const handleClientToggle = (clientId: number) => {
    setClients(clients.map(client => 
      client.id === clientId ? { ...client, selected: !client.selected } : client
    ));
  };

  const handleSelectAllClients = () => {
    const newSelectAll = !selectAllClients;
    setSelectAllClients(newSelectAll);
    setClients(clients.map(client => ({ ...client, selected: newSelectAll })));
  };

  const handleSelectAllFields = () => {
    const newSelectAll = !selectAllFields;
    setSelectAllFields(newSelectAll);
    setFields(fields.map(field => 
      selectedCategory === 'all' || field.category === selectedCategory 
        ? { ...field, selected: newSelectAll } 
        : field
    ));
  };

  const handleCategoryChange = (category: FieldCategory | 'all') => {
    setSelectedCategory(category);
    setSelectAllFields(false);
  };

  const filteredFields = selectedCategory === 'all'
    ? fields
    : fields.filter(field => field.category === selectedCategory);

  const selectedFieldsCount = fields.filter(field => field.selected).length;
  const selectedClientsCount = clients.filter(client => client.selected).length;
  
  const handleExport = () => {
    const fieldsToExport = fields.filter(f => f.selected);
    const clientsToExport = clients.filter(c => c.selected);
    
    console.log('Exporting data:', {
      clients: clientsToExport,
      fields: fieldsToExport,
      format
    });
    
    // Dans une application réelle, cela déclencherait l'export des données
    alert(`Export ${format.toUpperCase()} généré avec ${clientsToExport.length} clients et ${fieldsToExport.length} champs.`);
  };

  const getCategoryLabel = (category: FieldCategory): string => {
    switch(category) {
      case 'personal': return 'Données personnelles';
      case 'financial': return 'Données financières';
      case 'fiscal': return 'Fiscalité';
      case 'products': return 'Produits souscrits';
      case 'simulations': return 'Simulations';
      case 'scores': return 'Scores et profils';
      default: return category;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Export de données clients</h1>
          <p className="text-muted-foreground">Sélectionnez les champs et les clients à exporter</p>
        </div>
        <div className="space-x-2">
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filtrer
          </Button>
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Prévisualiser
          </Button>
          <Button onClick={handleExport}>
            <FileText className="h-4 w-4 mr-2" />
            Exporter
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Paramètres d'export</CardTitle>
            <CardDescription>Configurez votre export de données</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Format d'export</Label>
              <Select value={format} onValueChange={setFormat}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="csv">CSV</SelectItem>
                  <SelectItem value="excel">Excel</SelectItem>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="json">JSON</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Résumé de la sélection</Label>
              <Card>
                <CardContent className="p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Clients sélectionnés:</span>
                    <Badge variant={selectedClientsCount > 0 ? "default" : "outline"}>
                      {selectedClientsCount} / {clients.length}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Champs sélectionnés:</span>
                    <Badge variant={selectedFieldsCount > 0 ? "default" : "outline"}>
                      {selectedFieldsCount} / {fields.length}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Format:</span>
                    <Badge variant="secondary" className="uppercase">
                      {format}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="space-y-2">
              <Label>Modèles d'export</Label>
              <div className="space-y-2">
                <Button variant="outline" className="w-full flex justify-start">
                  <FilePlus className="h-4 w-4 mr-2" />
                  Export complet
                </Button>
                <Button variant="outline" className="w-full flex justify-start">
                  <FilePlus className="h-4 w-4 mr-2" />
                  Export financier
                </Button>
                <Button variant="outline" className="w-full flex justify-start">
                  <FilePlus className="h-4 w-4 mr-2" />
                  Export fiscal
                </Button>
                <Button variant="outline" className="w-full flex justify-start">
                  <FilePlus className="h-4 w-4 mr-2" />
                  Enregistrer ce modèle...
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Données à exporter</CardTitle>
                <TabsList>
                  <TabsTrigger value="fields">Champs</TabsTrigger>
                  <TabsTrigger value="clients">Clients</TabsTrigger>
                </TabsList>
              </div>
              <CardDescription>
                {activeTab === 'fields' ? 
                  "Sélectionnez les champs à inclure dans l'export" : 
                  "Sélectionnez les clients à inclure dans l'export"}
              </CardDescription>
            </CardHeader>

            <CardContent>
              <TabsContent value="fields" className="mt-0 space-y-4">
                <div className="flex flex-wrap gap-2 mb-4">
                  <Select 
                    value={selectedCategory} 
                    onValueChange={(value) => handleCategoryChange(value as FieldCategory | 'all')}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Catégorie" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes les catégories</SelectItem>
                      <SelectItem value="personal">Données personnelles</SelectItem>
                      <SelectItem value="financial">Données financières</SelectItem>
                      <SelectItem value="fiscal">Fiscalité</SelectItem>
                      <SelectItem value="products">Produits souscrits</SelectItem>
                      <SelectItem value="simulations">Simulations</SelectItem>
                      <SelectItem value="scores">Scores et profils</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleSelectAllFields}
                  >
                    {selectAllFields ? 'Désélectionner tout' : 'Sélectionner tout'}
                  </Button>
                </div>

                <ScrollArea className="h-[400px] pr-4">
                  <div className="space-y-6">
                    {/* Group fields by category */}
                    {(selectedCategory === 'all' ? 
                      Array.from(new Set(fields.map(f => f.category))) : 
                      [selectedCategory]
                    ).map(category => (
                      <div key={category} className="space-y-3">
                        <h3 className="font-medium">{getCategoryLabel(category as FieldCategory)}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {fields
                            .filter(field => field.category === category)
                            .map(field => (
                              <div key={field.id} className="flex items-center space-x-2">
                                <Checkbox 
                                  id={`field-${field.id}`}
                                  checked={field.selected}
                                  onCheckedChange={() => handleFieldToggle(field.id)}
                                />
                                <label
                                  htmlFor={`field-${field.id}`}
                                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                  {field.label}
                                </label>
                              </div>
                            ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="clients" className="mt-0 space-y-4">
                <div className="flex flex-wrap gap-2 mb-4">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleSelectAllClients}
                  >
                    {selectAllClients ? 'Désélectionner tout' : 'Sélectionner tout'}
                  </Button>
                  
                  <Badge className="ml-auto">
                    {selectedClientsCount} clients sélectionnés
                  </Badge>
                </div>

                <ScrollArea className="h-[400px] pr-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {clients.map(client => (
                      <div key={client.id} className="flex items-center space-x-2 border p-3 rounded-md">
                        <Checkbox 
                          id={`client-${client.id}`}
                          checked={client.selected}
                          onCheckedChange={() => handleClientToggle(client.id)}
                        />
                        <div className="flex-1">
                          <label
                            htmlFor={`client-${client.id}`}
                            className="font-medium"
                          >
                            {client.nom} {client.prenom}
                          </label>
                          <p className="text-xs text-muted-foreground">ID: {client.id}</p>
                        </div>
                        <Button size="icon" variant="ghost" className="h-8 w-8">
                          <UserPlus className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>
      </div>
      
      <div className="flex justify-end space-x-2">
        <Button variant="outline">Annuler</Button>
        <Button 
          disabled={selectedFieldsCount === 0 || selectedClientsCount === 0}
          onClick={handleExport}
        >
          <Download className="h-4 w-4 mr-2" />
          Générer l'export
        </Button>
      </div>
    </div>
  );
}
