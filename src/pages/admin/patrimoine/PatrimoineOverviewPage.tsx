import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Tabs,
  Tab
} from '@mui/material';
import {
  Home as HomeIcon,
  AccountBalance as BankIcon,
  Business as BusinessIcon,
  Assessment as ChartIcon,
  CreditCard as CreditIcon,
  Diamond as OtherIcon
} from '@mui/icons-material';
import { supabase } from '../../../lib/supabase';
import { PieChart, Pie, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface PatrimoineData {
  total: number;
  immobilier: number;
  bancaire: number;
  entreprise: number;
  assurance: number;
  credit: number;
  autre: number;
  details: {
    type: string;
    value: number;
    percentage: number;
  }[];
}

const PatrimoineOverviewPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [patrimoineData, setPatrimoineData] = useState<PatrimoineData | null>(null);
  const [activeTab, setActiveTab] = useState(0);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setUserId(user.id);
    };

    fetchUser();
  }, []);

  useEffect(() => {
    if (!userId) return;

    const fetchPatrimoineData = async () => {
      setLoading(true);
      try {
        // Récupérer les données de toutes les tables
        const { data: biensData } = await supabase
          .from('bienimmobilier')
          .select('value')
          .eq('user_id', userId);

        const { data: comptesData } = await supabase
          .from('comptebancaire')
          .select('value')
          .eq('user_id', userId);

        const { data: entreprisesData } = await supabase
          .from('entrepriseparticipation')
          .select('value')
          .eq('user_id', userId);

        const { data: assurancesData } = await supabase
          .from('assurancevie')
          .select('value')
          .eq('user_id', userId);

        const { data: creditsData } = await supabase
          .from('credit')
          .select('capital_restant_du')
          .eq('user_id', userId);

        const { data: autresData } = await supabase
          .from('autrepatrimoine')
          .select('value')
          .eq('user_id', userId);

        // Calculer les totaux
        const totalImmobilier = biensData?.reduce((sum, item) => sum + (item.value || 0), 0) || 0;
        const totalBancaire = comptesData?.reduce((sum, item) => sum + (item.value || 0), 0) || 0;
        const totalEntreprise = entreprisesData?.reduce((sum, item) => sum + (item.value || 0), 0) || 0;
        const totalAssurance = assurancesData?.reduce((sum, item) => sum + (item.value || 0), 0) || 0;
        const totalCredit = creditsData?.reduce((sum, item) => sum + (item.capital_restant_du || 0), 0) || 0;
        const totalAutre = autresData?.reduce((sum, item) => sum + (item.value || 0), 0) || 0;

        const totalPatrimoine = totalImmobilier + totalBancaire + totalEntreprise + totalAssurance - totalCredit + totalAutre;

        // Préparer les données pour les graphiques
        const details = [
          { type: 'Immobilier', value: totalImmobilier },
          { type: 'Comptes bancaires', value: totalBancaire },
          { type: 'Entreprises', value: totalEntreprise },
          { type: 'Assurances vie', value: totalAssurance },
          { type: 'Crédits', value: -totalCredit },
          { type: 'Autres', value: totalAutre }
        ].filter(item => item.value !== 0)
         .map(item => ({
           ...item,
           percentage: Math.round((item.value / totalPatrimoine) * 100)
         }));

        setPatrimoineData({
          total: totalPatrimoine,
          immobilier: totalImmobilier,
          bancaire: totalBancaire,
          entreprise: totalEntreprise,
          assurance: totalAssurance,
          credit: totalCredit,
          autre: totalAutre,
          details
        });
      } catch (error) {
        console.error('Error fetching patrimoine data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPatrimoineData();
  }, [userId]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!patrimoineData) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h6">Aucune donnée de patrimoine disponible</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Vue d'ensemble du patrimoine
      </Typography>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6} lg={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <HomeIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Patrimoine total</Typography>
              </Box>
              <Typography variant="h4">
                {patrimoineData.total.toLocaleString('fr-FR')} €
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6} lg={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <HomeIcon color="secondary" sx={{ mr: 1 }} />
                <Typography variant="h6">Immobilier</Typography>
              </Box>
              <Typography variant="h4">
                {patrimoineData.immobilier.toLocaleString('fr-FR')} €
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {Math.round((patrimoineData.immobilier / patrimoineData.total) * 100)}% du total
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6} lg={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <BankIcon color="success" sx={{ mr: 1 }} />
                <Typography variant="h6">Comptes bancaires</Typography>
              </Box>
              <Typography variant="h4">
                {patrimoineData.bancaire.toLocaleString('fr-FR')} €
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {Math.round((patrimoineData.bancaire / patrimoineData.total) * 100)}% du total
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6} lg={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <BusinessIcon color="warning" sx={{ mr: 1 }} />
                <Typography variant="h6">Entreprises</Typography>
              </Box>
              <Typography variant="h4">
                {patrimoineData.entreprise.toLocaleString('fr-FR')} €
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {Math.round((patrimoineData.entreprise / patrimoineData.total) * 100)}% du total
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 3 }}>
        <Tab label="Résumé" />
        <Tab label="Détails" />
        <Tab label="Graphiques" />
      </Tabs>

      {activeTab === 0 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Répartition du patrimoine
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={patrimoineData.details}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="type"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {patrimoineData.details.map((entry, index) => (
                        <Pie key={`cell-${index}`} fill={`#${Math.floor(Math.random()*16777215).toString(16)}`} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} €`, 'Valeur']} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Détails par catégorie
                </Typography>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Catégorie</TableCell>
                        <TableCell align="right">Valeur (€)</TableCell>
                        <TableCell align="right">Part</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {patrimoineData.details.map((item) => (
                        <TableRow key={item.type}>
                          <TableCell>{item.type}</TableCell>
                          <TableCell align="right">{item.value.toLocaleString('fr-FR')}</TableCell>
                          <TableCell align="right">{item.percentage}%</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {activeTab === 1 && (
        <Paper sx={{ p: 2, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Détails complets
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <HomeIcon color="secondary" sx={{ mr: 1 }} />
                    <Typography variant="h6">Immobilier</Typography>
                  </Box>
                  <Typography variant="body1">
                    Valeur totale: {patrimoineData.immobilier.toLocaleString('fr-FR')} €
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Représente {Math.round((patrimoineData.immobilier / patrimoineData.total) * 100)}% de votre patrimoine
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <BankIcon color="success" sx={{ mr: 1 }} />
                    <Typography variant="h6">Comptes bancaires</Typography>
                  </Box>
                  <Typography variant="body1">
                    Valeur totale: {patrimoineData.bancaire.toLocaleString('fr-FR')} €
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Représente {Math.round((patrimoineData.bancaire / patrimoineData.total) * 100)}% de votre patrimoine
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <BusinessIcon color="warning" sx={{ mr: 1 }} />
                    <Typography variant="h6">Entreprises</Typography>
                  </Box>
                  <Typography variant="body1">
                    Valeur totale: {patrimoineData.entreprise.toLocaleString('fr-FR')} €
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Représente {Math.round((patrimoineData.entreprise / patrimoineData.total) * 100)}% de votre patrimoine
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <ChartIcon color="info" sx={{ mr: 1 }} />
                    <Typography variant="h6">Assurances vie</Typography>
                  </Box>
                  <Typography variant="body1">
                    Valeur totale: {patrimoineData.assurance.toLocaleString('fr-FR')} €
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Représente {Math.round((patrimoineData.assurance / patrimoineData.total) * 100)}% de votre patrimoine
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <CreditIcon color="error" sx={{ mr: 1 }} />
                    <Typography variant="h6">Crédits</Typography>
                  </Box>
                  <Typography variant="body1">
                    Montant restant: {patrimoineData.credit.toLocaleString('fr-FR')} €
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <OtherIcon color="action" sx={{ mr: 1 }} />
                    <Typography variant="h6">Autres actifs</Typography>
                  </Box>
                  <Typography variant="body1">
                    Valeur totale: {patrimoineData.autre.toLocaleString('fr-FR')} €
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Représente {Math.round((patrimoineData.autre / patrimoineData.total) * 100)}% de votre patrimoine
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Paper>
      )}

      {activeTab === 2 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Répartition en valeur absolue
                </Typography>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={patrimoineData.details}>
                    <XAxis dataKey="type" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value} €`, 'Valeur']} />
                    <Legend />
                    <Bar dataKey="value" name="Valeur (€)" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Répartition en pourcentage
                </Typography>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={patrimoineData.details}>
                    <XAxis dataKey="type" />
                    <YAxis unit="%" />
                    <Tooltip formatter={(value) => [`${value}%`, 'Pourcentage']} />
                    <Legend />
                    <Bar dataKey="percentage" name="Pourcentage (%)" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default PatrimoineOverviewPage;