import React, { useState } from 'react';
import { Download, Database, FileText, Loader2, File, FileSpreadsheet, FileCode } from 'lucide-react';

const MultiFormatExporter = () => {
  const [selectedTables, setSelectedTables] = useState(new Set());
  const [isExporting, setIsExporting] = useState(false);
  const [exportStatus, setExportStatus] = useState({});

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
      { 
        id: 1, 
        nom: 'Dupont Jean', 
        email: 'jean.dupont@example.com', 
        date_creation: '2024-01-15', 
        montant: 1500.50, 
        statut: 'Actif',
        telephone: '+33 1 23 45 67 89',
        adresse: '123 Rue de la Paix, 75001 Paris'
      },
      { 
        id: 2, 
        nom: 'Martin Sophie', 
        email: 'sophie.martin@example.com', 
        date_creation: '2024-02-20', 
        montant: 2300.75, 
        statut: 'En attente',
        telephone: '+33 1 98 76 54 32',
        adresse: '456 Avenue des Champs, 69000 Lyon'
      },
      { 
        id: 3, 
        nom: 'Bernard Michel', 
        email: 'michel.bernard@example.com', 
        date_creation: '2024-03-10', 
        montant: 980.25, 
        statut: 'Inactif',
        telephone: '+33 4 56 78 90 12',
        adresse: '789 Boulevard Central, 13000 Marseille'
      }
    ];
    return Promise.resolve({ data: sampleData, error: null });
  };

  // Fonction utilitaire pour télécharger un fichier
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

  // Fonctions d'export par format
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
          // Échapper les guillemets et encapsuler les valeurs contenant des virgules
          const stringValue = String(value);
          if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
            return `"${stringValue.replace(/"/g, '""')}"`;
          }
          return stringValue;
        }).join(',')
      )
    ].join('\n');
    
    const filename = `${tableName}_export_${new Date().toISOString().split('T')[0]}.csv`;
    downloadFile('\ufeff' + csvContent, filename, 'text/csv'); // BOM pour Excel
  };

  const exportToExcelCSV = (data, tableName) => {
    // Version CSV optimisée pour Excel avec séparateur point-virgule (format français)
    if (!data || data.length === 0) {
      const csvContent = 'Message\n"Aucune donnée disponible"';
      downloadFile(csvContent, `${tableName}_export_${new Date().toISOString().split('T')[0]}.csv`, 'text/csv');
      return;
    }
    
    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(';'), // Séparateur point-virgule pour Excel français
      ...data.map(row => 
        headers.map(header => {
          const value = row[header] || '';
          const stringValue = String(value);
          if (stringValue.includes(';') || stringValue.includes('"') || stringValue.includes('\n')) {
            return `"${stringValue.replace(/"/g, '""')}"`;
          }
          return stringValue;
        }).join(';')
      )
    ].join('\n');
    
    const filename = `${tableName}_export_excel_${new Date().toISOString().split('T')[0]}.csv`;
    downloadFile('\ufeff' + csvContent, filename, 'text/csv');
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
      `-- Généré le ${new Date().toLocaleString('fr-FR')}`,
      `-- Nombre d'enregistrements: ${data.length}`,
      '',
      `-- Structure de la table`,
      `DROP TABLE IF EXISTS ${tableName};`,
      `CREATE TABLE ${tableName} (`,
      headers.map((header, index) => {
        const isLast = index === headers.length - 1;
        return `    ${header} VARCHAR(255)${isLast ? '' : ','}`;
      }).join('\n'),
      ');',
      '',
      `-- Insertion des données`,
      ...data.map(row => {
        const values = headers.map(header => {
          const value = row[header];
          if (value === null || value === undefined) return 'NULL';
          if (typeof value === 'string') return `'${value.replace(/'/g, "''")}'`;
          return value;
        }).join(', ');
        return `INSERT INTO ${tableName} (${headers.join(', ')}) VALUES (${values});`;
      }),
      '',
      `-- Fin de l'export`
    ].join('\n');
    
    const filename = `${tableName}_export_${new Date().toISOString().split('T')[0]}.sql`;
    downloadFile(sqlContent, filename, 'text/plain');
  };

  const exportToHTML = (data, tableName) => {
    const tableInfo = [...tables, ...souscriptionTables].find(t => t.name === tableName);
    
    if (!data || data.length === 0) {
      const htmlContent = `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Export ${tableName}</title>
    <style>
        body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            margin: 40px; 
            line-height: 1.6; 
            color: #333;
        }
        .header { 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white; 
            padding: 30px; 
            border-radius: 10px; 
            margin-bottom: 30px;
        }
        .header h1 { margin: 0; font-size: 2.5em; }
        .header p { margin: 10px 0 0 0; opacity: 0.9; }
        .info { 
            background-color: #f8f9fa; 
            padding: 20px; 
            border-radius: 8px; 
            border-left: 4px solid #007bff;
            margin: 20px 0; 
        }
        .footer { 
            margin-top: 40px; 
            padding: 20px; 
            text-align: center; 
            color: #6c757d; 
            border-top: 1px solid #dee2e6;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Export de ${tableInfo?.label || tableName}</h1>
        <p>${tableInfo?.description || 'Export de données'}</p>
    </div>
    <div class="info">
        <p><strong>📅 Date d'export :</strong> ${new Date().toLocaleString('fr-FR')}</p>
        <p><strong>📊 Statut :</strong> Aucune donnée disponible</p>
        <p><strong>🗂️ Table :</strong> ${tableName}</p>
    </div>
    <div class="footer">
        <p>Document généré automatiquement par l'outil d'export de données</p>
    </div>
</body>
</html>`;
      downloadFile(htmlContent, `${tableName}_export_${new Date().toISOString().split('T')[0]}.html`, 'text/html');
      return;
    }
    
    const headers = Object.keys(data[0]);
    const htmlContent = `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Export ${tableName}</title>
    <style>
        body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            margin: 40px; 
            line-height: 1.6; 
            color: #333;
        }
        .header { 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white; 
            padding: 30px; 
            border-radius: 10px; 
            margin-bottom: 30px;
        }
        .header h1 { margin: 0; font-size: 2.5em; }
        .header p { margin: 10px 0 0 0; opacity: 0.9; }
        .info { 
            background-color: #f8f9fa; 
            padding: 20px; 
            border-radius: 8px; 
            border-left: 4px solid #007bff;
            margin: 20px 0; 
        }
        .table-container { 
            overflow-x: auto; 
            margin: 30px 0;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            border-radius: 8px;
        }
        table { 
            width: 100%; 
            border-collapse: collapse; 
            background: white;
        }
        th, td { 
            border: 1px solid #dee2e6; 
            padding: 12px 15px; 
            text-align: left; 
        }
        th { 
            background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
            color: white; 
            font-weight: 600;
            position: sticky;
            top: 0;
        }
        tr:nth-child(even) { background-color: #f8f9fa; }
        tr:hover { background-color: #e3f2fd; transition: background-color 0.3s; }
        .stats { 
            display: flex; 
            gap: 20px; 
            margin: 20px 0; 
        }
        .stat-card { 
            background: white; 
            padding: 15px; 
            border-radius: 8px; 
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            flex: 1;
        }
        .stat-number { 
            font-size: 2em; 
            font-weight: bold; 
            color: #007bff; 
        }
        .footer { 
            margin-top: 40px; 
            padding: 20px; 
            text-align: center; 
            color: #6c757d; 
            border-top: 1px solid #dee2e6;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Export de ${tableInfo?.label || tableName}</h1>
        <p>${tableInfo?.description || 'Export de données'}</p>
    </div>
    
    <div class="info">
        <p><strong>📅 Date d'export :</strong> ${new Date().toLocaleString('fr-FR')}</p>
        <p><strong>🗂️ Table :</strong> ${tableName}</p>
    </div>
    
    <div class="stats">
        <div class="stat-card">
            <div class="stat-number">${data.length}</div>
            <div>Enregistrements</div>
        </div>
        <div class="stat-card">
            <div class="stat-number">${headers.length}</div>
            <div>Colonnes</div>
        </div>
    </div>
    
    <div class="table-container">
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
    </div>
    
    <div class="footer">
        <p>Document généré automatiquement le ${new Date().toLocaleString('fr-FR')}</p>
        <p>Outil d'export de données - ${data.length} enregistrement${data.length > 1 ? 's' : ''} exporté${data.length > 1 ? 's' : ''}</p>
    </div>
</body>
</html>`;
    
    const filename = `${tableName}_export_${new Date().toISOString().split('T')[0]}.html`;
    downloadFile(htmlContent, filename, 'text/html');
  };

  const exportToJSON = (data, tableName) => {
    const tableInfo = [...tables, ...souscriptionTables].find(t => t.name === tableName);
    
    const jsonContent = {
      metadata: {
        table: tableName,
        label: tableInfo?.label || tableName,
        description: tableInfo?.description || '',
        exportDate: new Date().toISOString(),
        exportDateFormatted: new Date().toLocaleString('fr-FR'),
        recordCount: data ? data.length : 0,
        columns: data && data.length > 0 ? Object.keys(data[0]) : []
      },
      data: data || []
    };
    
    const filename = `${tableName}_export_${new Date().toISOString().split('T')[0]}.json`;
    downloadFile(JSON.stringify(jsonContent, null, 2), filename, 'application/json');
  };

  const exportTables = async (format) => {
    if (selectedTables.size === 0) {
      alert('Veuillez sélectionner au moins une table à exporter.');
      return;
    }

    setIsExporting(true);
    setExportStatus({});

    const tablePromises = Array.from(selectedTables).map(tableName => {
      return new Promise(async (resolve) => {
        try {
          setExportStatus(prev => ({ ...prev, [tableName]: 'loading' }));
          
          const { data, error } = await mockSupabaseData(tableName);
          
          if (error) {
            throw new Error(`Erreur Supabase: ${error.message}`);
          }
          
          // Export selon le format sélectionné
          switch (format) {
            case 'csv':
              exportToCSV(data, tableName);
              break;
            case 'excel':
              exportToExcelCSV(data, tableName);
              break;
            case 'sql':
              exportToSQL(data, tableName);
              break;
            case 'html':
              exportToHTML(data, tableName);
              break;
            case 'json':
              exportToJSON(data, tableName);
              break;
            default:
              throw new Error('Format d\'export non supporté');
          }
          
          setExportStatus(prev => ({ ...prev, [tableName]: 'success' }));
          resolve();
        } catch (error) {
          console.error(`Erreur lors de l'export de ${tableName}:`, error);
          setExportStatus(prev => ({ ...prev, [tableName]: 'error' }));
          alert(`Erreur lors de l'export de ${tableName}: ${error.message}`);
          resolve();
        }
      });
    });
    
    try {
      await Promise.all(tablePromises);
    } finally {
      setIsExporting(false);
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
          Sélectionnez les tables et choisissez le format d'export
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
          </div>
        </div>
      </div>

      {/* Boutons d'export */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Formats d'export disponibles</h3>
        <div className="flex flex-wrap gap-4">
          <button
            onClick={() => exportTables('csv')}
            disabled={selectedTables.size === 0 || isExporting}
            className={`flex items-center gap-2 px-6 py-2 text-white rounded-lg transition-colors text-sm ${
              selectedTables.size === 0 || isExporting
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isExporting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <File className="w-4 h-4" />
            )}
            Exporter en CSV (.csv)
          </button>

          <button
            onClick={() => exportTables('excel')}
            disabled={selectedTables.size === 0 || isExporting}
            className={`flex items-center gap-2 px-6 py-2 text-white rounded-lg transition-colors text-sm ${
              selectedTables.size === 0 || isExporting
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            {isExporting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <FileSpreadsheet className="w-4 h-4" />
            )}
            Exporter en Excel (.csv)
          </button>

          <button
            onClick={() => exportTables('sql')}
            disabled={selectedTables.size === 0 || isExporting}
            className={`flex items-center gap-2 px-6 py-2 text-white rounded-lg transition-colors text-sm ${
              selectedTables.size === 0 || isExporting
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-purple-600 hover:bg-purple-700'
            }`}
          >
            {isExporting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <FileCode className="w-4 h-4" />
            )}
            Exporter en SQL (.sql)
          </button>

          <button
            onClick={() => exportTables('html')}
            disabled={selectedTables.size === 0 || isExporting}
            className={`flex items-center gap-2 px-6 py-2 text-white rounded-lg transition-colors text-sm ${
              selectedTables.size === 0 || isExporting
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            {isExporting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <FileText className="w-4 h-4" />
            )}
            Exporter en HTML (.html)
          </button>

          <button
            onClick={() => exportTables('json')}
            disabled={selectedTables.size === 0 || isExporting}
            className={`flex items-center gap-2 px-6 py-2 text-white rounded-lg transition-colors text-sm ${
              selectedTables.size === 0 || isExporting
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-yellow-600 hover:bg-yellow-700'
            }`}
          >
            {isExporting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <FileCode className="w-4 h-4" />
            )}
            Exporter en JSON (.json)
          </button>
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