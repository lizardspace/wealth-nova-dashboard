import React, { useState, useEffect } from 'react';
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
  FilePlus,
  Loader2
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';
import { toast } from 'sonner';
import Papa from 'papaparse';
import { getAllTables, getTableColumns } from '@/lib/supabase';

// Types pour les données Supabase
type FieldCategory = 'personal' | 'financial' | 'fiscal' | 'products' | 'simulations' | 'scores';

interface ExportField {
  id:string;
  label: string;
  category: string;
  selected: boolean;
  table?: string;
  column?: string;
}

interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  selected: boolean;
  civilite?: string;
  date_naissance?: string;
  part_fiscale?: number;
}

// Configuration des champs d'export basée sur le schéma Supabase
const exportFields: ExportField[] = [
  // Données personnelles (table users)
  { id: 'civilite', label: 'Civilité', category: 'personal', selected: true, table: 'users', column: 'civilite' },
  { id: 'nom', label: 'Nom', category: 'personal', selected: true, table: 'users', column: 'last_name' },
  { id: 'prenom', label: 'Prénom', category: 'personal', selected: true, table: 'users', column: 'first_name' },
  { id: 'email', label: 'Email', category: 'personal', selected: true, table: 'users', column: 'email' },
  { id: 'dateNaissance', label: 'Date de naissance', category: 'personal', selected: true, table: 'users', column: 'date_naissance' },
  { id: 'partFiscale', label: 'Part fiscale', category: 'personal', selected: false, table: 'users', column: 'part_fiscale' },

  // Données personnelles (table personalinfo)
  { id: 'telephone', label: 'Téléphone', category: 'personal', selected: true, table: 'personalinfo', column: 'phone' },
  { id: 'age', label: 'Âge', category: 'personal', selected: false, table: 'personalinfo', column: 'age' },
  { id: 'adresse', label: 'Adresse complète', category: 'personal', selected: false, table: 'personalinfo', column: 'address' },
  { id: 'codePostal', label: 'Code postal', category: 'personal', selected: false, table: 'personalinfo', column: 'postal_code' },
  { id: 'ville', label: 'Ville', category: 'personal', selected: false, table: 'personalinfo', column: 'city' },
  { id: 'situationMatrimoniale', label: 'Situation matrimoniale', category: 'personal', selected: false, table: 'personalinfo', column: 'situation_matrimoniale' },
  { id: 'contratMariage', label: 'Contrat de mariage', category: 'personal', selected: false, table: 'personalinfo', column: 'contrat_mariage' },
  { id: 'enfantsACharge', label: 'Enfants à charge', category: 'personal', selected: false, table: 'personalinfo', column: 'nb_enfants_charge' },
  { id: 'profession', label: 'Profession', category: 'personal', selected: false, table: 'personalinfo', column: 'profession' },
  { id: 'objectifsPatrimoniaux', label: 'Objectifs patrimoniaux', category: 'personal', selected: false, table: 'personalinfo', column: 'objectifs_patrimoniaux' },

  // Données financières (table personalinfo)
  { id: 'revenuAnnuel', label: 'Revenu annuel', category: 'financial', selected: true, table: 'personalinfo', column: 'revenu_annuel' },
  { id: 'capaciteEpargne', label: 'Capacité d\'épargne', category: 'financial', selected: true, table: 'personalinfo', column: 'capacite_epargne' },
  { id: 'epargnePrecaution', label: 'Épargne de précaution', category: 'financial', selected: true, table: 'personalinfo', column: 'epargne_precaution' },

  // Données financières (table patrimoineimmo)
  { id: 'valeurBiens', label: 'Valeur des biens immobiliers', category: 'financial', selected: false, table: 'patrimoineimmo', column: 'valeur_biens' },
  { id: 'mensualitesCredit', label: 'Mensualités crédit', category: 'financial', selected: false, table: 'patrimoineimmo', column: 'mensualites_credit' },

  // Données financières (table retraite)
  { id: 'montantEpargneRetraite', label: 'Montant épargne retraite', category: 'financial', selected: false, table: 'retraite', column: 'montant_epargne' },

  // Données financières (table traindevie)
  { id: 'trainDeVieTotal', label: 'Train de vie total', category: 'financial', selected: false, table: 'traindevie', column: 'total' },

  // Données fiscales (table impotrevenu)
  { id: 'revenuFiscalReference', label: 'Revenu fiscal de référence', category: 'fiscal', selected: false, table: 'impotrevenu', column: 'revenu_fiscal_reference' },
  { id: 'deductionRevenu', label: 'Déduction revenu', category: 'fiscal', selected: false, table: 'impotrevenu', column: 'deduction_revenu' },
  { id: 'reductionImpot', label: 'Réduction d\'impôt', category: 'fiscal', selected: false, table: 'impotrevenu', column: 'reduction_impot' },
  { id: 'optionFiscale', label: 'Option fiscale', category: 'fiscal', selected: false, table: 'impotrevenu', column: 'option_fiscale' },

  // Données fiscales (table ifi)
  { id: 'ifiMontant', label: 'Montant IFI', category: 'fiscal', selected: false, table: 'ifi', column: 'ifi' },
  { id: 'ifiReduction', label: 'Réduction IFI', category: 'fiscal', selected: false, table: 'ifi', column: 'reduction' },

  // Produits souscrits
  { id: 'comptesBancaires', label: 'Comptes bancaires', category: 'products', selected: false, table: 'comptebancaire' },
  { id: 'assurancesVie', label: 'Assurances vie', category: 'products', selected: false, table: 'assurancevie' },
  { id: 'biensImmobiliers', label: 'Biens immobiliers', category: 'products', selected: false, table: 'bienimmobilier' },
  { id: 'credits', label: 'Crédits', category: 'products', selected: false, table: 'credit' },
  { id: 'contratsPrevoyance', label: 'Contrats prévoyance', category: 'products', selected: false, table: 'prevoyance' },
  { id: 'autrePatrimoine', label: 'Autre patrimoine', category: 'products', selected: false, table: 'autrepatrimoine' },
  { id: 'contratCapitalisation', label: 'Contrat de capitalisation', category: 'products', selected: false, table: 'contratcapitalisation' },
  { id: 'entrepriseParticipation', label: 'Entreprise et participation', category: 'products', selected: false, table: 'entrepriseparticipation' },
  { id: 'retraiteComplementaire', label: 'Retraite complémentaire', category: 'products', selected: false, table: 'retraitecomplementaire' },

  // Simulations et analyses (table fiscalite)
  { id: 'connaissanceFiscale', label: 'Connaissance fiscale', category: 'simulations', selected: false, table: 'fiscalite', column: 'connaissance_fiscale' },
  { id: 'dispositifsUtilises', label: 'Dispositifs utilisés', category: 'simulations', selected: false, table: 'fiscalite', column: 'dispositifs_utilises' },

  // Simulations et analyses (table patrimoinefinancier)
  { id: 'horizonInvestissement', label: 'Horizon d\'investissement', category: 'simulations', selected: false, table: 'patrimoinefinancier', column: 'horizon_investissement' },
  { id: 'repartitionActifRisque', label: 'Répartition actif risque', category: 'simulations', selected: false, table: 'patrimoinefinancier', column: 'repartition_activ_risque' },

  // Scores et profils (table profileinvestisseur)
  { id: 'scoreInvestisseur', label: 'Score investisseur', category: 'scores', selected: true, table: 'profileinvestisseur', column: 'score' },
  { id: 'profilInvestisseur', label: 'Profil investisseur', category: 'scores', selected: true, table: 'profileinvestisseur', column: 'profil' },
  { id: 'toleranceRisque', label: 'Tolérance au risque', category: 'scores', selected: false, table: 'profileinvestisseur', column: 'tolerance_risque' },
  { id: 'reactionBaisse', label: 'Réaction à la baisse', category: 'scores', selected: false, table: 'profileinvestisseur', column: 'reaction_baisse' },
  { id: 'produitsComplexes', label: 'Produits complexes', category: 'scores', selected: false, table: 'profileinvestisseur', column: 'produits_complexes' },
];

export default function ExportDonneesPage() {
  const supabase = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const [activeTab, setActiveTab] = useState<string>('fields');
  const [fields, setFields] = useState<ExportField[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [format, setFormat] = useState<string>('csv');
  const [selectedCategory, setSelectedCategory] = useState<string | 'all'>('all');
  const [selectAllUsers, setSelectAllUsers] = useState(false);
  const [selectAllFields, setSelectAllFields] = useState(false);
  const [loading, setLoading] = useState(true);
  const [usersLoading, setUsersLoading] = useState(true);
  const [exportLoading, setExportLoading] = useState(false);
  const [tables, setTables] = useState<string[]>([]);

  useEffect(() => {
    const fetchSchema = async () => {
      setLoading(true);
      const tableNames = await getAllTables();
      setTables(tableNames);

      const allFields: ExportField[] = [];
      for (const tableName of tableNames) {
        const columns = await getTableColumns(tableName);
        for (const column of columns) {
          allFields.push({
            id: `${tableName}-${column}`,
            label: `${tableName}.${column}`,
            category: tableName as FieldCategory,
            selected: false,
            table: tableName,
            column: column,
          });
        }
      }
      setFields(allFields);
      setLoading(false);
    };

    fetchSchema();
  }, []);

  // Récupération des utilisateurs depuis Supabase
  useEffect(() => {
    const fetchUsers = async () => {
      setUsersLoading(true);
      try {
        const { data, error } = await supabase
          .from('users')
          .select('id, first_name, last_name, email, civilite, date_naissance, part_fiscale')
          .order('last_name', { ascending: true });

        if (error) throw error;

        setUsers(data.map(user => ({
          ...user,
          selected: false
        })));
      } catch (error) {
        console.error('Erreur lors du chargement des utilisateurs:', error);
        toast.error('Erreur lors du chargement des utilisateurs');
      } finally {
        setUsersLoading(false);
      }
    };

    fetchUsers();
  }, [supabase]);

  const handleFieldToggle = (fieldId: string) => {
    setFields(fields.map(field => 
      field.id === fieldId ? { ...field, selected: !field.selected } : field
    ));
  };

  const handleUserToggle = (userId: string) => {
    setUsers(users.map(user =>
      user.id === userId ? { ...user, selected: !user.selected } : user
    ));
  };

  const handleSelectAllUsers = () => {
    const newSelectAll = !selectAllUsers;
    setSelectAllUsers(newSelectAll);
    setUsers(users.map(user => ({ ...user, selected: newSelectAll })));
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

  const handleCategoryChange = (category: string | 'all') => {
    setSelectedCategory(category);
    setSelectAllFields(false);
  };

  const filteredFields = selectedCategory === 'all'
    ? fields
    : fields.filter(field => field.category === selectedCategory);

  const selectedFieldsCount = fields.filter(field => field.selected).length;
  const selectedUsersCount = users.filter(user => user.selected).length;
  
  const handleExport = async () => {
    if (selectedFieldsCount === 0 || selectedUsersCount === 0) {
      toast.warning('Veuillez sélectionner au moins un champ et un client');
      return;
    }

    setExportLoading(true);
    try {
      const fieldsToExport = fields.filter(f => f.selected);
      const usersToExport = users.filter(u => u.selected);
      const userIds = usersToExport.map(u => u.id);

      const fieldsByTable = fieldsToExport.reduce((acc, field) => {
        if (field.table) {
          if (!acc[field.table]) {
            acc[field.table] = [];
          }
          acc[field.table].push(field.column);
        }
        return acc;
      }, {} as Record<string, string[]>);

      const selectQueries = Object.entries(fieldsByTable).map(([table, columns]) => {
        if (table === 'users') {
          return columns.join(',');
        }
        return `${table}(${columns.join(',')})`;
      });

      // Récupérer les données depuis Supabase
      const { data, error } = await supabase
        .from('users')
        .select(`
          *,
          personalinfo (*),
          profileinvestisseur (*),
          patrimoineimmo (*),
          retraite (*),
          traindevie (*),
          impotrevenu (*),
          ifi (*),
          comptebancaire (*),
          assurancevie (*),
          bienimmobilier (*),
          credit (*),
          prevoyance (*),
          fiscalite (*),
          patrimoinefinancier (*),
          autrepatrimoine (*),
          contratcapitalisation (*),
          entrepriseparticipation (*),
          retraitecomplementaire (*)
        `)
        .in('id', userIds);

      if (error) throw error;

      if (!data || data.length === 0) {
        throw new Error('Aucune donnée trouvée pour les utilisateurs sélectionnés');
      }

      // Formater les données pour l'export
      const formattedData = data.map((user: any) => {
        const result: Record<string, any> = {};
        fieldsToExport.forEach(field => {
          if (field.table === 'users') {
            result[field.label] = user[field.column as keyof typeof user];
          } else if (field.table && user[field.table]) {
            const tableData = user[field.table];
            if (Array.isArray(tableData)) {
              // For one-to-many relationships, we can export the count or a summary
              result[field.label] = tableData.length;
            } else if (typeof tableData === 'object' && tableData !== null) {
              // For one-to-one relationships
              result[field.label] = tableData[field.column as keyof typeof tableData];
            }
          } else {
            result[field.label] = null;
          }
        });
        return result;
      });

      // Générer le fichier selon le format
      if (format === 'csv') {
        const csv = Papa.unparse(formattedData);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `export_clients_${new Date().toISOString().slice(0, 10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else if (format === 'json') {
        const json = JSON.stringify(formattedData, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `export_clients_${new Date().toISOString().slice(0, 10)}.json`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else if (format === 'excel') {
        // Pour Excel, on pourrait utiliser une librairie comme xlsx
        // Ici on génère un CSV comme solution simple
        const csv = Papa.unparse(formattedData);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `export_clients_${new Date().toISOString().slice(0, 10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }

      toast.success(`Export ${format.toUpperCase()} généré avec succès!`);
    } catch (error) {
      console.error('Erreur lors de l\'export:', error);
      toast.error('Erreur lors de l\'export des données');
    } finally {
      setExportLoading(false);
    }
  };

  const getCategoryLabel = (category: string): string => {
    return category.charAt(0).toUpperCase() + category.slice(1);
  };


  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Export de données clients</h1>
          <p className="text-muted-foreground">Sélectionnez les champs et les clients à exporter depuis la base Supabase</p>
        </div>
        <div className="space-x-2">
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filtrer
          </Button>
          <Button variant="outline" onClick={handleExport} disabled={exportLoading}>
            <Download className="h-4 w-4 mr-2" />
            Prévisualiser
          </Button>
          <Button onClick={handleExport} disabled={exportLoading || selectedFieldsCount === 0 || selectedUsersCount === 0}>
            {exportLoading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <FileText className="h-4 w-4 mr-2" />
            )}
            Exporter
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Paramètres d'export</CardTitle>
            <CardDescription>Configurez votre export de données Supabase</CardDescription>
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
                    <Badge variant={selectedUsersCount > 0 ? "default" : "outline"}>
                      {selectedUsersCount} / {users.length}
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
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Tables impliquées:</span>
                    <Badge variant="outline">
                      {new Set(fields.filter(f => f.selected).map(f => f.table).filter(Boolean)).size}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
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
                  "Sélectionnez les champs à inclure dans l'export (basé sur le schéma Supabase)" :
                  "Sélectionnez les clients à inclure dans l'export"}
              </CardDescription>
            </CardHeader>

            <CardContent>
              <TabsContent value="fields" className="mt-0 space-y-4">
                <div className="flex flex-wrap gap-2 mb-4">
                  <Select
                    value={selectedCategory}
                    onValueChange={(value) => handleCategoryChange(value as string | 'all')}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Catégorie" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes les catégories</SelectItem>
                      {tables.map(table => (
                        <SelectItem key={table} value={table}>{getCategoryLabel(table)}</SelectItem>
                      ))}
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
                    {(selectedCategory === 'all' ? 
                      Array.from(new Set(fields.map(f => f.category))) : 
                      [selectedCategory]
                    ).map(category => (
                      <div key={category} className="space-y-3">
                        <h3 className="font-medium">{getCategoryLabel(category as FieldCategory)}</h3>
                        <div className="grid grid-cols-1 gap-3">
                          {fields
                            .filter(field => field.category === category)
                            .map(field => (
                              <div key={field.id} className="flex items-center justify-between space-x-2 p-2 border rounded-md">
                                <div className="flex items-center space-x-2">
                                  <Checkbox
                                    id={`field-${field.id}`}
                                    checked={field.selected}
                                    onCheckedChange={() => handleFieldToggle(field.id)}
                                  />
                                  <div>
                                    <label
                                      htmlFor={`field-${field.id}`}
                                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    >
                                      {field.label}
                                    </label>
                                    {field.table && (
                                      <p className="text-xs text-muted-foreground">
                                        {field.table}{field.column ? `.${field.column}`: ''}
                                      </p>
                                    )}
                                  </div>
                                </div>
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
                    onClick={handleSelectAllUsers}
                    disabled={usersLoading}
                  >
                    {selectAllUsers ? 'Désélectionner tout' : 'Sélectionner tout'}
                  </Button>
                  
                  <Badge className="ml-auto">
                    {selectedUsersCount} clients sélectionnés
                  </Badge>
                </div>

                <ScrollArea className="h-[400px] pr-4">
                  {usersLoading ? (
                    <div className="flex items-center justify-center h-32">
                      <Loader2 className="h-6 w-6 animate-spin" />
                      <span className="ml-2">Chargement des clients...</span>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {users.map(user => (
                        <div key={user.id} className="flex items-center space-x-2 border p-3 rounded-md">
                          <Checkbox
                            id={`user-${user.id}`}
                            checked={user.selected}
                            onCheckedChange={() => handleUserToggle(user.id)}
                          />
                          <div className="flex-1">
                            <label
                              htmlFor={`user-${user.id}`}
                              className="font-medium"
                            >
                              {user.civilite} {user.last_name} {user.first_name}
                            </label>
                            <p className="text-xs text-muted-foreground">{user.email}</p>
                            <p className="text-xs text-muted-foreground">ID: {user.id}</p>
                          </div>
                          <Button size="icon" variant="ghost" className="h-8 w-8">
                            <UserPlus className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>
      </div>
      
      <div className="flex justify-end space-x-2">
        <Button variant="outline">Annuler</Button>
        <Button 
          disabled={selectedFieldsCount === 0 || selectedUsersCount === 0 || exportLoading}
          onClick={handleExport}
        >
          {exportLoading ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Download className="h-4 w-4 mr-2" />
          )}
          Générer l'export
        </Button>
      </div>
    </div>
  );
}
