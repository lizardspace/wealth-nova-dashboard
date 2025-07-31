import React, { useState } from 'react';
import { Download, Database, FileText, Loader2 } from 'lucide-react';
import * as XLSX from 'xlsx';

const ExcelExporter = () => {
  const [selectedTables, setSelectedTables] = useState(new Set());
  const [isExporting, setIsExporting] = useState(false);
  const [exportStatus, setExportStatus] = useState({});

  // Liste des tables extraites du schéma
  const tables = [
    { name: 'assurancevie', label: 'Assurance Vie', description: 'Contrats d\'assurance vie' },
    { name: 'autrepatrimoine', label: 'Autre Patrimoine', description: 'Autres éléments du patrimoine' },
    { name: 'bienimmobilier', label: 'Bien Immobilier', description: 'Biens immobiliers' },
    { name: 'budget', label: 'Budget', description: 'Données budgétaires' },
    { name: 'comptebancaire', label: 'Compte Bancaire', description: 'Comptes bancaires et placements' },
    { name: 'contacts', label: 'Contacts', description: 'Messages de contact' },
    { name: 'contratcapitalisation', label: 'Contrat Capitalisation', description: 'Contrats de capitalisation' },
    { name: 'credit', label: 'Crédit', description: 'Crédits et emprunts' },
    { name: 'entreprise', label: 'Entreprise', description: 'Informations entreprise' },
    { name: 'entrepriseparticipation', label: 'Participation Entreprise', description: 'Participations d\'entreprise' },
    { name: 'equipements_energetiques', label: 'Équipements Énergétiques', description: 'Équipements énergétiques' },
    { name: 'family', label: 'Famille', description: 'Relations familiales' },
    { name: 'family_invitations', label: 'Invitations Famille', description: 'Invitations familiales' },
    { name: 'fiscalite', label: 'Fiscalité', description: 'Données fiscales' },
    { name: 'ifi', label: 'IFI', description: 'Impôt sur la Fortune Immobilière' },
    { name: 'impotrevenu', label: 'Impôt Revenu', description: 'Impôt sur le revenu' },
    { name: 'mission', label: 'Mission', description: 'Documents de mission' },
    { name: 'patrimoinefinancier', label: 'Patrimoine Financier', description: 'Patrimoine financier' },
    { name: 'patrimoineimmo', label: 'Patrimoine Immobilier', description: 'Patrimoine immobilier' },
    { name: 'personalinfo', label: 'Informations Personnelles', description: 'Informations personnelles' },
    { name: 'pioneers', label: 'Pionniers', description: 'Utilisateurs pionniers' },
    { name: 'prevoyance', label: 'Prévoyance', description: 'Contrats de prévoyance' },
    { name: 'profileinvestisseur', label: 'Profil Investisseur', description: 'Profils d\'investisseur' },
    { name: 'projetsvie', label: 'Projets de Vie', description: 'Projets de vie' },
    { name: 'releve_compteurs', label: 'Relevé Compteurs', description: 'Relevés de compteurs' },
    { name: 'retraite', label: 'Retraite', description: 'Données de retraite' },
    { name: 'retraitecomplementaire', label: 'Retraite Complémentaire', description: 'Retraite complémentaire' },
    { name: 'statements', label: 'Relevés', description: 'Relevés de compte' },
    { name: 'traindevie', label: 'Train de Vie', description: 'Dépenses du train de vie' },
    { name: 'users', label: 'Utilisateurs', description: 'Données utilisateurs' }
  ];

  // Tables de souscription groupées
  const souscriptionTables = [
    { name: 'souscription_formulaire_activite', label: 'Activité', description: 'Activités professionnelles' },
    { name: 'souscription_formulaire_cosouscripteur', label: 'Co-souscripteur', description: 'Informations co-souscripteur' },
    { name: 'souscription_formulaire_financialdata', label: 'Données Financières', description: 'Données financières de souscription' },
    { name: 'souscription_formulaire_fundorigindetails', label: 'Origine des Fonds', description: 'Détails origine des fonds' },
    { name: 'souscription_formulaire_patrimoine', label: 'Patrimoine', description: 'Patrimoine de souscription' },
    { name: 'souscription_formulaire_ppe', label: 'PPE', description: 'Personnes Politiquement Exposées' },
    { name: 'souscription_formulaire_souscripteur', label: 'Souscripteur', description: 'Informations souscripteur' },
    { name: 'souscription_formulaire_subscription', label: 'Souscription', description: 'Données de souscription' },
    { name: 'souscription_formulaire_taxresidence', label: 'Résidence Fiscale', description: 'Résidence fiscale' }
  ];

  const handleTableSelection = (tableName) => {
    const newSelection = new Set(selectedTables);
    if (newSelection.has(tableName)) {
      newSelection.delete(tableName);
    } else {
      newSelection.add(tableName);
    }
    setSelectedTables(newSelection);
  };

  const selectAllTables = () => {
    const allTableNames = [...tables, ...souscriptionTables].map(t => t.name);
    setSelectedTables(new Set(allTableNames));
  };

  const deselectAllTables = () => {
    setSelectedTables(new Set());
  };

  // Fonction pour télécharger un fichier Excel
  const downloadExcel = (workbook, filename) => {
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Mock function to simulate Supabase data fetch
  const mockSupabaseData = (tableName) => {
    // Retourne des données de test pour la démonstration
    const sampleData = [
      { id: 1, nom: 'Exemple 1', date_creation: '2024-01-15', montant: 1500.50 },
      { id: 2, nom: 'Exemple 2', date_creation: '2024-02-20', montant: 2300.75 },
      { id: 3, nom: 'Exemple 3', date_creation: '2024-03-10', montant: 980.25 }
    ];
    return Promise.resolve({ data: sampleData, error: null });
  };

  // Export avec création d'un fichier Excel séparé pour chaque table
  const exportTable = async (tableName) => {
    try {
      setExportStatus(prev => ({ ...prev, [tableName]: 'loading' }));
      
      // Récupérer toutes les données de la table depuis Supabase
      // Remplacez cette ligne par votre appel Supabase réel :
      // const { data, error } = await supabase.from(tableName).select('*');
      const { data, error } = await mockSupabaseData(tableName);
      
      if (error) {
        throw new Error(`Erreur Supabase: ${error.message}`);
      }
      
      // Créer un nouveau workbook Excel
      const workbook = XLSX.utils.book_new();
      
      if (!data || data.length === 0) {
        console.warn(`Aucune donnée trouvée pour la table ${tableName}`);
        // Créer une feuille avec un message
        const emptySheet = XLSX.utils.json_to_sheet([
          { Message: `Aucune donnée disponible pour la table ${tableName}` }
        ]);
        XLSX.utils.book_append_sheet(workbook, emptySheet, 'Données');
      } else {
        // Convertir les données JSON en feuille Excel
        const worksheet = XLSX.utils.json_to_sheet(data);
        
        // Ajuster la largeur des colonnes automatiquement
        const columnWidths = [];
        const headers = Object.keys(data[0]);
        headers.forEach((header, index) => {
          const maxLength = Math.max(
            header.length,
            ...data.map(row => String(row[header] || '').length)
          );
          columnWidths[index] = { wch: Math.min(maxLength + 2, 50) };
        });
        worksheet['!cols'] = columnWidths;
        
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Données');
      }
      
      // Créer le nom de fichier
      const filename = `${tableName}_export_${new Date().toISOString().split('T')[0]}.xlsx`;
      
      // Télécharger le fichier
      downloadExcel(workbook, filename);
      
      setExportStatus(prev => ({ ...prev, [tableName]: 'success' }));
      
    } catch (error) {
      console.error(`Erreur lors de l'export de ${tableName}:`, error);
      setExportStatus(prev => ({ ...prev, [tableName]: 'error' }));
      
      // Optionnel: afficher un message d'erreur à l'utilisateur
      alert(`Erreur lors de l'export de ${tableName}: ${error.message}`);
    }
  };

  // Export de toutes les tables sélectionnées dans un seul fichier Excel
  const exportAllTablesInOneFile = async () => {
    if (selectedTables.size === 0) {
      alert('Veuillez sélectionner au moins une table à exporter.');
      return;
    }

    setIsExporting(true);
    setExportStatus({});

    try {
      // Créer un nouveau workbook Excel
      const workbook = XLSX.utils.book_new();

      // Exporter chaque table dans une feuille séparée
      for (const tableName of selectedTables) {
        try {
          setExportStatus(prev => ({ ...prev, [tableName]: 'loading' }));
          
          // Récupérer les données
          const { data, error } = await mockSupabaseData(tableName);
          
          if (error) {
            throw new Error(`Erreur Supabase: ${error.message}`);
          }
          
          let worksheet;
          if (!data || data.length === 0) {
            // Créer une feuille avec un message
            worksheet = XLSX.utils.json_to_sheet([
              { Message: `Aucune donnée disponible pour cette table` }
            ]);
          } else {
            // Convertir les données JSON en feuille Excel
            worksheet = XLSX.utils.json_to_sheet(data);
            
            // Ajuster la largeur des colonnes
            const columnWidths = [];
            const headers = Object.keys(data[0]);
            headers.forEach((header, index) => {
              const maxLength = Math.max(
                header.length,
                ...data.map(row => String(row[header] || '').length)
              );
              columnWidths[index] = { wch: Math.min(maxLength + 2, 50) };
            });
            worksheet['!cols'] = columnWidths;
          }
          
          // Nom de la feuille (limité à 31 caractères pour Excel)
          const sheetName = tableName.length > 31 ? tableName.substring(0, 31) : tableName;
          XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
          
          setExportStatus(prev => ({ ...prev, [tableName]: 'success' }));
          
        } catch (error) {
          console.error(`Erreur lors de l'export de ${tableName}:`, error);
          setExportStatus(prev => ({ ...prev, [tableName]: 'error' }));
        }
      }
      
      // Télécharger le fichier Excel avec toutes les tables
      const filename = `tables_export_${new Date().toISOString().split('T')[0]}.xlsx`;
      downloadExcel(workbook, filename);
      
    } finally {
      setIsExporting(false);
    }
  };

  const exportSelectedTables = async () => {
    if (selectedTables.size === 0) {
      alert('Veuillez sélectionner au moins une table à exporter.');
      return;
    }

    setIsExporting(true);
    setExportStatus({});

    const tablePromises = Array.from(selectedTables).map(tableName => exportTable(tableName));
    
    try {
      await Promise.all(tablePromises);
    } finally {
      setIsExporting(false);
    }
  };

  const getStatusIcon = (tableName) => {
    const status = exportStatus[tableName];
    switch (status) {
      case 'loading':
        return <Loader2 className="w-4 h-4 animate-spin text-blue-500" />;
      case 'success':
        return <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
          <div className="w-2 h-2 bg-white rounded-full"></div>
        </div>;
      case 'error':
        return <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
          <div className="w-1 h-1 bg-white rounded-full"></div>
        </div>;
      default:
        return null;
    }
  };

  const TableGroup = ({ title, tables, icon: Icon }) => (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center gap-2 mb-4">
        <Icon className="w-5 h-5 text-gray-600" />
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        <span className="text-sm text-gray-500">({tables.length} tables)</span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {tables.map((table) => (
          <div
            key={table.name}
            className={`p-3 border rounded-lg cursor-pointer transition-all ${
              selectedTables.has(table.name)
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            }`}
            onClick={() => handleTableSelection(table.name)}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedTables.has(table.name)}
                  onChange={() => handleTableSelection(table.name)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="font-medium text-sm text-gray-800">{table.label}</span>
              </div>
              {getStatusIcon(table.name)}
            </div>
            <p className="text-xs text-gray-600">{table.description}</p>
            <p className="text-xs text-gray-400 mt-1 font-mono">{table.name}</p>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Export Excel des Tables</h1>
        <p className="text-gray-600">
          Sélectionnez les tables que vous souhaitez exporter au format Excel (.xlsx)
        </p>
      </div>

      {/* Actions */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex gap-2">
            <button
              onClick={selectAllTables}
              className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Tout sélectionner
            </button>
            <button
              onClick={deselectAllTables}
              className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Tout désélectionner
            </button>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              {selectedTables.size} table{selectedTables.size > 1 ? 's' : ''} sélectionnée{selectedTables.size > 1 ? 's' : ''}
            </span>
            <div className="flex gap-2">
              <button
                onClick={exportSelectedTables}
                disabled={selectedTables.size === 0 || isExporting}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition-colors text-sm"
              >
                {isExporting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Download className="w-4 h-4" />
                )}
                Fichiers séparés
              </button>
              <button
                onClick={exportAllTablesInOneFile}
                disabled={selectedTables.size === 0 || isExporting}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg transition-colors text-sm"
              >
                {isExporting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Download className="w-4 h-4" />
                )}
                Un seul fichier
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tables principales */}
      <div className="space-y-6">
        <TableGroup 
          title="Tables Principales" 
          tables={tables} 
          icon={Database}
        />
        
        <TableGroup 
          title="Formulaires de Souscription" 
          tables={souscriptionTables} 
          icon={FileText}
        />
      </div>

      {/* Statut des exports */}
      {Object.keys(exportStatus).length > 0 && (
        <div className="mt-8 bg-white rounded-lg border border-gray-200 p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Statut des exports</h3>
          <div className="space-y-2">
            {Object.entries(exportStatus).map(([tableName, status]) => (
              <div key={tableName} className="flex items-center justify-between py-2">
                <span className="text-sm font-medium text-gray-700">{tableName}</span>
                <div className="flex items-center gap-2">
                  {getStatusIcon(tableName)}
                  <span className={`text-sm ${
                    status === 'success' ? 'text-green-600' : 
                    status === 'error' ? 'text-red-600' : 
                    'text-blue-600'
                  }`}>
                    {status === 'loading' ? 'En cours...' : 
                     status === 'success' ? 'Terminé' : 
                     status === 'error' ? 'Erreur' : status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ExcelExporter;