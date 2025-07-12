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
  Tab,
  Divider
} from '@mui/material';
import {
  Euro as EuroIcon,
  Receipt as ReceiptIcon,
  Home as HomeIcon,
  PieChart as PieChartIcon,
  Timeline as TimelineIcon
} from '@mui/icons-material';
import { supabase } from '../../../lib/supabase';
import { PieChart, Pie, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

interface FiscaliteData {
  totalIR: number;
  totalIFI: number;
  dernierIR: {
    annee: number;
    montant: number;
  } | null;
  dernierIFI: {
    annee: number;
    montant: number;
  } | null;
  evolutionIR: {
    annee: number;
    montant: number;
  }[];
  evolutionIFI: {
    annee: number;
    montant: number;
  }[];
  repartition: {
    name: string;
    value: number;
    color: string;
  }[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const FiscaliteOverviewPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [fiscaliteData, setFiscaliteData] = useState<FiscaliteData | null>(null);
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

    const fetchFiscaliteData = async () => {
      setLoading(true);
      try {
        // Récupérer les données IR
        const { data: irData } = await supabase
          .from('impotrevenu')
          .select('annee, reduction_impot, pv_immo_base_pfu, pv_immo_base_ir, option_fiscale')
          .eq('user_id', userId)
          .order('annee', { ascending: false });

        // Récupérer les données IFI
        const { data: ifiData } = await supabase
          .from('ifi')
          .select('annee, ifi')
          .eq('user_id', userId)
          .order('annee', { ascending: false });

        // Calculer les totaux et préparer les données
        const totalIR = irData?.reduce((sum, item) => {
          const pvImmo = item.option_fiscale === 'PFU' ? item.pv_immo_base_pfu : item.pv_immo_base_ir;
          return sum + (item.reduction_impot || 0) + (pvImmo || 0);
        }, 0) || 0;

        const totalIFI = ifiData?.reduce((sum, item) => sum + (item.ifi || 0), 0) || 0;

        const dernierIR = irData?.[0] ? {
          annee: irData[0].annee,
          montant: (irData[0].reduction_impot || 0) + 
                  (irData[0].option_fiscale === 'PFU' ? irData[0].pv_immo_base_pfu : irData[0].pv_immo_base_ir || 0)
        } : null;

        const dernierIFI = ifiData?.[0] ? {
          annee: ifiData[0].annee,
          montant: ifiData[0].ifi
        } : null;

        const evolutionIR = irData?.map(item => ({
          annee: item.annee,
          montant: (item.reduction_impot || 0) + 
                  (item.option_fiscale === 'PFU' ? item.pv_immo_base_pfu : item.pv_immo_base_ir || 0)
        })).reverse() || [];

        const evolutionIFI = ifiData?.map(item => ({
          annee: item.annee,
          montant: item.ifi
        })).reverse() || [];

        const repartition = [
          { name: 'IR', value: totalIR, color: COLORS[0] },
          { name: 'IFI', value: totalIFI, color: COLORS[1] }
        ].filter(item => item.value > 0);

        setFiscaliteData({
          totalIR,
          totalIFI,
          dernierIR,
          dernierIFI,
          evolutionIR,
          evolutionIFI,
          repartition
        });
      } catch (error) {
        console.error('Error fetching fiscalite data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFiscaliteData();
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

  if (!fiscaliteData) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h6">Aucune donnée fiscale disponible</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Vue d'ensemble fiscale
      </Typography>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6} lg={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <ReceiptIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Total IR</Typography>
              </Box>
              <Typography variant="h4">
                {fiscaliteData.totalIR.toLocaleString('fr-FR')} €
              </Typography>
              {fiscaliteData.dernierIR && (
                <Typography variant="body2" color="text.secondary">
                  {fiscaliteData.dernierIR.montant.toLocaleString('fr-FR')} € en {fiscaliteData.dernierIR.annee}
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6} lg={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <HomeIcon color="secondary" sx={{ mr: 1 }} />
                <Typography variant="h6">Total IFI</Typography>
              </Box>
              <Typography variant="h4">
                {fiscaliteData.totalIFI.toLocaleString('fr-FR')} €
              </Typography>
              {fiscaliteData.dernierIFI && (
                <Typography variant="body2" color="text.secondary">
                  {fiscaliteData.dernierIFI.montant.toLocaleString('fr-FR')} € en {fiscaliteData.dernierIFI.annee}
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6} lg={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <EuroIcon color="success" sx={{ mr: 1 }} />
                <Typography variant="h6">Total fiscal</Typography>
              </Box>
              <Typography variant="h4">
                {(fiscaliteData.totalIR + fiscaliteData.totalIFI).toLocaleString('fr-FR')} €
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Cumul des impôts
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6} lg={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <PieChartIcon color="warning" sx={{ mr: 1 }} />
                <Typography variant="h6">Répartition</Typography>
              </Box>
              <Typography variant="h4">
                {fiscaliteData.repartition.length} catégories
              </Typography>
              <Typography variant="body2" color="text.secondary">
                IR / IFI
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 3 }}>
        <Tab label="Résumé" icon={<PieChartIcon />} />
        <Tab label="Évolution" icon={<TimelineIcon />} />
        <Tab label="Détails" icon={<ReceiptIcon />} />
      </Tabs>

      {activeTab === 0 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Répartition des impôts
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={fiscaliteData.repartition}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {fiscaliteData.repartition.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} €`, 'Montant']} />
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
                        <TableCell>Type</TableCell>
                        <TableCell align="right">Montant (€)</TableCell>
                        <TableCell align="right">Part</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {fiscaliteData.repartition.map((item) => (
                        <TableRow key={item.name}>
                          <TableCell>{item.name}</TableCell>
                          <TableCell align="right">{item.value.toLocaleString('fr-FR')}</TableCell>
                          <TableCell align="right">
                            {Math.round((item.value / (fiscaliteData.totalIR + fiscaliteData.totalIFI)) * 100)}%
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow>
                        <TableCell><strong>Total</strong></TableCell>
                        <TableCell align="right"><strong>{(fiscaliteData.totalIR + fiscaliteData.totalIFI).toLocaleString('fr-FR')}</strong></TableCell>
                        <TableCell align="right"><strong>100%</strong></TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {activeTab === 1 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Évolution de l'IR
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={fiscaliteData.evolutionIR}>
                    <XAxis dataKey="annee" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value} €`, 'Montant']} />
                    <Legend />
                    <Bar dataKey="montant" name="IR (€)" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Évolution de l'IFI
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={fiscaliteData.evolutionIFI}>
                    <XAxis dataKey="annee" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value} €`, 'Montant']} />
                    <Legend />
                    <Bar dataKey="montant" name="IFI (€)" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {activeTab === 2 && (
        <Paper sx={{ p: 2, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Détails fiscaux
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Impôt sur le Revenu
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body1">
                      <strong>Total cumulé:</strong> {fiscaliteData.totalIR.toLocaleString('fr-FR')} €
                    </Typography>
                    {fiscaliteData.dernierIR && (
                      <Typography variant="body2" color="text.secondary">
                        Dernière déclaration: {fiscaliteData.dernierIR.montant.toLocaleString('fr-FR')} € en {fiscaliteData.dernierIR.annee}
                      </Typography>
                    )}
                  </Box>
                  <Typography variant="subtitle2" gutterBottom>
                    Évolution sur {fiscaliteData.evolutionIR.length} années:
                  </Typography>
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Année</TableCell>
                          <TableCell align="right">Montant (€)</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {fiscaliteData.evolutionIR.map((item) => (
                          <TableRow key={item.annee}>
                            <TableCell>{item.annee}</TableCell>
                            <TableCell align="right">{item.montant.toLocaleString('fr-FR')}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Impôt sur la Fortune Immobilière
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body1">
                      <strong>Total cumulé:</strong> {fiscaliteData.totalIFI.toLocaleString('fr-FR')} €
                    </Typography>
                    {fiscaliteData.dernierIFI && (
                      <Typography variant="body2" color="text.secondary">
                        Dernière déclaration: {fiscaliteData.dernierIFI.montant.toLocaleString('fr-FR')} € en {fiscaliteData.dernierIFI.annee}
                      </Typography>
                    )}
                  </Box>
                  <Typography variant="subtitle2" gutterBottom>
                    Évolution sur {fiscaliteData.evolutionIFI.length} années:
                  </Typography>
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Année</TableCell>
                          <TableCell align="right">Montant (€)</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {fiscaliteData.evolutionIFI.map((item) => (
                          <TableRow key={item.annee}>
                            <TableCell>{item.annee}</TableCell>
                            <TableCell align="right">{item.montant.toLocaleString('fr-FR')}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Paper>
      )}
    </Box>
  );
};

export default FiscaliteOverviewPage;