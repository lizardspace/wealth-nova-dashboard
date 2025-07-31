import React, { useState } from 'react';
import { Download, Database, FileText, Loader2, File, FileSpreadsheet, FileCode, FileImage } from 'lucide-react';
import * as XLSX from 'xlsx';

const MultiFormatExporter = () => {
  const [selectedTables, setSelectedTables] = useState(new Set());
  const [selectedFormat, setSelectedFormat] = useState('excel');
  const [isExporting, setIsExporting] = useState(false);
  const [exportStatus, setExportStatus] = useState({});

  // Configuration des formats d'export
  const exportFormats = {
    excel: {
      name: 'Excel (.xlsx)',
      icon: FileSpreadsheet,
      color: 'green',
      description: 'Fichier Excel avec formatage et colonnes ajustées'
    },
    csv: {
      name: 'CSV (.csv)',
      icon: File,
      color: 'blue',
      description: 'Fichier texte séparé par virgules'
    },
    sql: {
      name: 'SQL (.sql)',
      icon: FileCode,
      color: 'purple',
      description: 'Script SQL avec instructions INSERT'
    },
    word: {
      name: 'Word (.docx)',
      icon: FileText,
      color: 'indigo',
      description: 'Document Word avec mise en page professionnelle'
    },
    json: {
      name: 'JSON (.json)',
      icon: FileCode,
      color: 'yellow',
      description: 'Format JSON structuré'
    }
  };

  // Liste des tables
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

  // Mock data
  const mockSupabaseData = (tableName) => {
    const sampleData = [
      { id: 1, nom: 'Exemple 1', email: 'exemple1@test.com', date_creation: '2024-01-15', montant: 1500.50, statut: 'Actif' },
      { id: 2, nom: 'Exemple 2', email: 'exemple2@test.com', date_creation: '2024-02-20', montant: 2300.75, statut: 'En attente' },
      { id: 3, nom: 'Exemple 3', email: 'exemple3@test.com', date_creation: '2024-03-10', montant: 980.25, statut: 'Inactif' }
    ];
    return Promise.resolve({ data: sampleData, error: null });
  };

  // Fonctions d'export par format
  const exportToExcel = (data, tableName) => {
    const workbook = XLSX.utils.book_new();
    
    if (!data || data.length === 0) {
      const emptySheet = XLSX.utils.json_to_sheet([
        { Message: `Aucune donnée disponible pour la table ${tableName}` }
      ]);
      XLSX.utils.book_append_sheet(workbook, emptySheet, 'Données');
    } else {
      const worksheet = XLSX.utils.json_to_sheet(data);
      
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
      
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Données');
    }
    
    const filename = `${tableName}_export_${new Date().toISOString().split('T')[0]}.xlsx`;
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    downloadFile(excelBuffer, filename, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  };

  const exportToCSV = (data, tableName) => {
    if (!data || data.length === 0) {
      const csvContent = 'Message\n"Aucune donnée disponible"';
      downloadFile(csvContent, `${tableName}_export_${new Date().toISOString().split('T')[0]}.csv`, 'text/csv');
      return;
    }
    
    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header] || '';
          return typeof value === 'string' && value.includes(',') ? `"${value}"` : value;
        }).join(',')
      )
    ].join('\n');
    
    const filename = `${tableName}_export_${new Date().toISOString().split('T')[0]}.csv`;
    downloadFile(csvContent, filename, 'text/csv');
  };

  const exportToSQL = (data, tableName) => {
    if (!data || data.length === 0) {
      const sqlContent = `-- Aucune donnée disponible pour la table ${tableName}\n-- ${new Date().toISOString()}`;
      downloadFile(sqlContent, `${tableName}_export_${new Date().toISOString().split('T')[0]}.sql`, 'text/plain');
      return;
    }
    
    const headers = Object.keys(data[0]);
    const sqlContent = [
      `-- Export SQL pour la table ${tableName}`,
      `-- Généré le ${new Date().toLocaleString()}`,
      '',
      `-- Structure de la table (exemple)`,
      `CREATE TABLE IF NOT EXISTS ${tableName} (`,
      headers.map(header => `  ${header} VARCHAR(255)`).join(',\n'),
      ');',
      '',
      `-- Données`,
      ...data.map(row => {
        const values = headers.map(header => {
          const value = row[header];
          if (value === null || value === undefined) return 'NULL';
          if (typeof value === 'string') return `'${value.replace(/'/g, "''")}'`;
          return value;
        }).join(', ');
        return `INSERT INTO ${tableName} (${headers.join(', ')}) VALUES (${values});`;
      })
    ].join('\n');
    
    const filename = `${tableName}_export_${new Date().toISOString().split('T')[0]}.sql`;
    downloadFile(sqlContent, filename, 'text/plain');
  };

  const exportToWord = (data, tableName) => {
    if (!data || data.length === 0) {
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Export ${tableName}</title>
          <style>
            body { font-family: 'Calibri', sans-serif; margin: 40px; }
            h1 { color: #2c3e50; border-bottom: 3px solid #3498db; padding-bottom: 10px; }
            .info { background-color: #ecf0f1; padding: 15px; border-radius: 5px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <h1>Export de la table : ${tableName}</h1>
          <div class="info">
            <p><strong>Date d'export :</strong> ${new Date().toLocaleString()}</p>
            <p><strong>Statut :</strong> Aucune donnée disponible</p>
          </div>
        </body>
        </html>
      `;
      downloadFile(htmlContent, `${tableName}_export_${new Date().toISOString().split('T')[0]}.html`, 'text/html');
      return;
    }
    
    const headers = Object.keys(data[0]);
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Export ${tableName}</title>
        <style>
          body { font-family: 'Calibri', sans-serif; margin: 40px; line-height: 1.6; }
          h1 { color: #2c3e50; border-bottom: 3px solid #3498db; padding-bottom: 10px; }
          .info { background-color: #ecf0f1; padding: 15px; border-radius: 5px; margin: 20px 0; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          th, td { border: 1px solid #bdc3c7; padding: 12px; text-align: left; }
          th { background-color: #3498db; color: white; font-weight: bold; }
          tr:nth-child(even) { background-color: #f8f9fa; }
          tr:hover { background-color: #e8f4f8; }
          .summary { margin: 20px 0; font-style: italic; color: #7f8c8d; }
        </style>
      </head>
      <body>
        <h1>Export de la table : ${tableName}</h1>
        <div class="info">
          <p><strong>Date d'export :</strong> ${new Date().toLocaleString()}</p>
          <p><strong>Nombre d'enregistrements :</strong> ${data.length}</p>
        </div>
        
        <table>
          <thead>
            <tr>
              ${headers.map(header => `<th>${header}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            ${data.map(row => `
              <tr>
                ${headers.map(header => `<td>${row[header] || ''}</td>`).join('')}
              </tr>
            `).join('')}
          </tbody>
        </table>
        
        <div class="summary">
          Document généré automatiquement depuis l'application d'export de données.
        </div>
      </body>
      </html>
    `;
    
    const filename = `${tableName}_export_${new Date().toISOString().split('T')[0]}.html`;
    downloadFile(htmlContent, filename, 'text/html');
  };

  const exportToJSON = (data, tableName) => {
    const jsonContent = {
      metadata: {
        table: tableName,
        exportDate: new Date().toISOString(),
        recordCount: data ? data.length : 0
      },
      data: data || []
    };
    
    const filename = `${tableName}_export_${new Date().toISOString().split('T')[0]}.json`;
    downloadFile(JSON.stringify(jsonContent, null, 2), filename, 'application/json');
  };

  const downloadFile = (content, filename, mimeType) => {
    const blob = new Blob([content], { type: mimeType });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const exportTable = async (tableName) => {
    try {
      setExportStatus(prev => ({ ...prev, [tableName]: 'loading' }));
      
      const { data, error } = await mockSupabaseData(tableName);
      
      if (error) {
        throw new Error(`Erreur Supabase: ${error.message}`);
      }
      
      // Export selon le format sélectionné
      switch (selectedFormat) {
        case 'excel':
          exportToExcel(data, tableName);
          break;
        case 'csv':
          exportToCSV(data, tableName);
          break;
        case 'sql':
          exportToSQL(data, tableName);
          break;
        case 'word':
          exportToWord(data, tableName);
          break;
        case 'json':
          exportToJSON(data, tableName);
          break;
        default:
          throw new Error('Format d\'export non supporté');
      }
      
      setExportStatus(prev => ({ ...prev, [tableName]: 'success' }));
      
    } catch (error) {
      console.error(`Erreur lors de l'export de ${tableName}:`, error);
      setExportStatus(prev => ({ ...prev, [tableName]: 'error' }));
      alert(`Erreur lors de l'export de ${tableName}: ${error.message}`);
    }
  };

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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Export Multi-Format des Tables</h1>
        <p className="text-gray-600">
          Sélectionnez les tables et le format d'export souhaité
        </p>
      </div>

      {/* Sélection du format */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Format d'export</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {Object.entries(exportFormats).map(([key, format]) => {
            const IconComponent = format.icon;
            return (
              <div
                key={key}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  selectedFormat === key
                    ? `border-${format.color}-500 bg-${format.color}-50`
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
                onClick={() => setSelectedFormat(key)}
              >
                <div className="flex flex-col items-center text-center">
                  <IconComponent className={`w-8 h-8 mb-2 ${
                    selectedFormat === key ? `text-${format.color}-600` : 'text-gray-500'
                  }`} />
                  <span className="font-medium text-sm text-gray-800">{format.name}</span>
                  <p className="text-xs text-gray-500 mt-1">{format.description}</p>
                </div>
              </div>
            );
          })}
        </div>
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
            <button
              onClick={exportSelectedTables}
              disabled={selectedTables.size === 0 || isExporting}
              className={`flex items-center gap-2 px-6 py-2 text-white rounded-lg transition-colors text-sm ${
                selectedTables.size === 0 || isExporting
                  ? 'bg-gray-400 cursor-not-allowed'
                  : `bg-${exportFormats[selectedFormat].color}-600 hover:bg-${exportFormats[selectedFormat].color}-700`
              }`}
            >
              {isExporting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              Exporter en {exportFormats[selectedFormat].name}
            </button>
          </div>
        </div>
      </div>

      {/* Tables */}
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

export default MultiFormatExporter;