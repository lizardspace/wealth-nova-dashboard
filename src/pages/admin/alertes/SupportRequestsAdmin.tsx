import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// Initialisation du client Supabase
const supabaseUrl = 'https://xoxbpdkqvtulavbpfmgu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhveGJwZGtxdnR1bGF2YnBmbWd1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ3NDk0MjMsImV4cCI6MjA2MDMyNTQyM30.XVzmmTfjcMNDchCd7ed-jG3N8WoLuD3RyDZguyZh1EM';
const supabase = createClient(supabaseUrl, supabaseKey);

const SupportRequestsAdmin = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const requestsPerPage = 10;

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);
        const { data, error: supabaseError } = await supabase
          .from('support_requests_vitrine')
          .select('*')
          .order('date_creation', { ascending: false });

        if (supabaseError) throw supabaseError;

        setRequests(data || []);
      } catch (err) {
        setError('Erreur lors du chargement des demandes');
        console.error('Supabase error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  // Filtrer les demandes selon le terme de recherche
  const filteredRequests = requests.filter(request => {
    const searchContent = `${request.nom} ${request.prenom} ${request.email} ${request.telephone} ${request.message}`.toLowerCase();
    return searchContent.includes(searchTerm.toLowerCase());
  });

  // Pagination
  const indexOfLastRequest = currentPage * requestsPerPage;
  const indexOfFirstRequest = indexOfLastRequest - requestsPerPage;
  const currentRequests = filteredRequests.slice(indexOfFirstRequest, indexOfLastRequest);
  const totalPages = Math.ceil(filteredRequests.length / requestsPerPage);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  if (loading) return <div className="loading">Chargement en cours...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="admin-requests-container">
      <h1>Demandes de Support</h1>
      
      <div className="admin-toolbar">
        <div className="search-box">
          <input
            type="text"
            placeholder="Rechercher dans les demandes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="stats">
          Total: {filteredRequests.length} demandes
        </div>
      </div>

      <div className="requests-table-container">
        <table className="requests-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Nom/Prénom</th>
              <th>Email</th>
              <th>Téléphone</th>
              <th>Message</th>
            </tr>
          </thead>
          <tbody>
            {currentRequests.length > 0 ? (
              currentRequests.map(request => (
                <tr key={request.id}>
                  <td>{formatDate(request.date_creation)}</td>
                  <td>{request.prenom} {request.nom}</td>
                  <td><a href={`mailto:${request.email}`}>{request.email}</a></td>
                  <td>{request.telephone || 'Non fourni'}</td>
                  <td className="message-cell">{request.message}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="no-results">
                  {searchTerm ? 'Aucun résultat pour votre recherche' : 'Aucune demande trouvée'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button 
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Précédent
          </button>
          
          <span>Page {currentPage} sur {totalPages}</span>
          
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Suivant
          </button>
        </div>
      )}

      <style jsx>{`
        .admin-requests-container {
          padding: 20px;
          max-width: 1200px;
          margin: 0 auto;
        }
        
        h1 {
          color: #333;
          margin-bottom: 20px;
        }
        
        .admin-toolbar {
          display: flex;
          justify-content: space-between;
          margin-bottom: 20px;
          align-items: center;
          flex-wrap: wrap;
          gap: 15px;
        }
        
        .search-box input {
          padding: 8px 12px;
          min-width: 250px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 14px;
        }
        
        .stats {
          background: #f0f0f0;
          padding: 8px 12px;
          border-radius: 4px;
          font-weight: bold;
          font-size: 14px;
        }
        
        .requests-table-container {
          overflow-x: auto;
          margin-bottom: 20px;
          background: white;
          border-radius: 8px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        
        .requests-table {
          width: 100%;
          border-collapse: collapse;
        }
        
        .requests-table th, .requests-table td {
          padding: 12px 15px;
          text-align: left;
          border-bottom: 1px solid #eee;
        }
        
        .requests-table th {
          background-color: #f8f9fa;
          font-weight: 600;
          position: sticky;
          top: 0;
          white-space: nowrap;
        }
        
        .requests-table tr:hover {
          background-color: #f9f9f9;
        }
        
        .message-cell {
          max-width: 300px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        
        .no-results {
          text-align: center;
          padding: 20px;
          color: #666;
        }
        
        .pagination {
          display: flex;
          justify-content: center;
          align-items: center;
          margin-top: 20px;
          gap: 15px;
        }
        
        .pagination button {
          padding: 8px 16px;
          background: #4CAF50;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
        }
        
        .pagination button:disabled {
          background: #cccccc;
          cursor: not-allowed;
        }
        
        .loading, .error {
          text-align: center;
          padding: 40px;
          font-size: 18px;
        }
        
        .error {
          color: #d9534f;
        }

        @media (max-width: 768px) {
          .admin-toolbar {
            flex-direction: column;
            align-items: stretch;
          }
          
          .search-box input {
            width: 100%;
          }
          
          .requests-table th, .requests-table td {
            padding: 8px 10px;
            font-size: 14px;
          }
        }
      `}</style>
    </div>
  );
};

export default SupportRequestsAdmin;