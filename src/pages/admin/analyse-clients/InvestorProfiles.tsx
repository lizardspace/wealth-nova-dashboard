import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  ChartContainer,
  ChartConfig
} from "@/components/ui/chart";
import {
  Users,
  Search,
  Filter,
  RefreshCw,
  Download,
  BarChart3,
  PieChart,
  Calendar,
  TrendingUp,
  UserPlus,
  Eye,
  Edit,
  MoreHorizontal,
  Activity,
  Shield,
  Target,
  Star,
  AlertTriangle,
  CheckCircle,
  DollarSign,
  Home as HomeIcon,
  Building,
  ArrowUpDown,
  ChevronDown,
  X as ClearIcon,
  Grid3x3,
  Table2
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import {
  ResponsiveContainer,
  PieChart as RechartsPie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend as RechartsLegend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Doughnut
} from 'recharts';

// Chart configuration for modern charts
const chartConfig = {
  riskScore: {
    label: "Score de Risque",
    color: "hsl(var(--primary))",
  },
  percentage: {
    label: "Pourcentage",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

// Simulation des données Supabase
const mockInvestorProfiles = [
  {
    user_id: '1',
    last_name: 'Dubois',
    first_name: 'Marie',
    risk_tolerance: 'Prudent',
    reaction_to_drop: 'Vente immédiate',
    profile_type: 'Conservateur',
    risk_asset_percentage: 25,
    investment_horizon: 3,
    investment_horizon_category: 'Court terme',
    risk_score: 3
  },
  {
    user_id: '2',
    last_name: 'Martin',
    first_name: 'Pierre',
    risk_tolerance: 'Équilibré',
    reaction_to_drop: 'Maintien des positions',
    profile_type: 'Modéré',
    risk_asset_percentage: 60,
    investment_horizon: 7,
    investment_horizon_category: 'Moyen terme',
    risk_score: 6
  },
  {
    user_id: '3',
    last_name: 'Leroy',
    first_name: 'Sophie',
    risk_tolerance: 'Dynamique',
    reaction_to_drop: 'Renforcement',
    profile_type: 'Agressif',
    risk_asset_percentage: 85,
    investment_horizon: 15,
    investment_horizon_category: 'Long terme',
    risk_score: 8
  },
  {
    user_id: '4',
    last_name: 'Bernard',
    first_name: 'Jean',
    risk_tolerance: 'Conservateur',
    reaction_to_drop: 'Réduction partielle',
    profile_type: 'Prudent',
    risk_asset_percentage: 15,
    investment_horizon: 2,
    investment_horizon_category: 'Court terme',
    risk_score: 2
  },
  {
    user_id: '5',
    last_name: 'Moreau',
    first_name: 'Claire',
    risk_tolerance: 'Dynamique',
    reaction_to_drop: 'Opportunité d\'achat',
    profile_type: 'Agressif',
    risk_asset_percentage: 90,
    investment_horizon: 20,
    investment_horizon_category: 'Long terme',
    risk_score: 9
  }
];

interface InvestorProfile {
  user_id: string;
  last_name: string;
  first_name: string;
  risk_tolerance: string;
  reaction_to_drop: string;
  profile_type: string;
  risk_asset_percentage: number;
  investment_horizon: number;
  investment_horizon_category: string;
  risk_score: number;
}

type ViewMode = 'table' | 'cards' | 'analytics';
type SortField = 'name' | 'risk_score' | 'risk_asset_percentage' | 'investment_horizon';
type SortDirection = 'asc' | 'desc';

const InvestorProfiles: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [investorProfiles, setInvestorProfiles] = useState<InvestorProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRiskTolerance, setFilterRiskTolerance] = useState<string>('');
  const [filterHorizonCategory, setFilterHorizonCategory] = useState<string>('');
  const [filterRiskScore, setFilterRiskScore] = useState<[number, number]>([0, 10]);
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedProfiles, setSelectedProfiles] = useState<string[]>([]);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [profileDetailOpen, setProfileDetailOpen] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<InvestorProfile | null>(null);

  const fetchInvestorProfiles = async () => {
    setLoading(true);
    try {
      // Simulation d'appel API
      await new Promise(resolve => setTimeout(resolve, 1000));
      setInvestorProfiles(mockInvestorProfiles);
    } catch (error) {
      console.error('Error fetching investor profiles:', error);
      toast({
        title: "Erreur",
        description: "Échec du chargement des profils investisseurs",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvestorProfiles();
  }, []);

  // Fonctions utilitaires
  const getRiskToleranceVariant = (riskTolerance: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (riskTolerance?.toLowerCase()) {
      case 'prudent':
      case 'conservateur':
        return 'secondary';
      case 'équilibré':
      case 'modéré':
        return 'outline';
      case 'dynamique':
      case 'agressif':
        return 'destructive';
      default:
        return 'default';
    }
  };

  const getHorizonCategoryVariant = (category: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (category) {
      case 'Court terme':
        return 'destructive';
      case 'Moyen terme':
        return 'outline';
      case 'Long terme':
        return 'secondary';
      default:
        return 'default';
    }
  };

  const getRiskScoreIcon = (score: number) => {
    if (score <= 3) return <CheckCircle className="w-4 h-4 text-green-600" />;
    if (score <= 6) return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
    return <Shield className="w-4 h-4 text-red-600" />;
  };

  const getRiskScoreColor = (score: number): string => {
    if (score <= 3) return 'text-green-600';
    if (score <= 6) return 'text-yellow-600';
    return 'text-red-600';
  };

  // Filtrage et tri avancés
  const filteredAndSortedProfiles = useMemo(() => {
    let filtered = investorProfiles.filter(profile => {
      const nameMatch = `${profile.first_name} ${profile.last_name}`.toLowerCase().includes(searchTerm.toLowerCase());
      const riskMatch = !filterRiskTolerance || profile.risk_tolerance === filterRiskTolerance;
      const horizonMatch = !filterHorizonCategory || profile.investment_horizon_category === filterHorizonCategory;
      const scoreMatch = profile.risk_score >= filterRiskScore[0] && profile.risk_score <= filterRiskScore[1];
      
      return nameMatch && riskMatch && horizonMatch && scoreMatch;
    });

    // Tri
    filtered.sort((a, b) => {
      let valueA: any, valueB: any;
      
      switch (sortField) {
        case 'name':
          valueA = `${a.first_name} ${a.last_name}`.toLowerCase();
          valueB = `${b.first_name} ${b.last_name}`.toLowerCase();
          break;
        case 'risk_score':
          valueA = a.risk_score;
          valueB = b.risk_score;
          break;
        case 'risk_asset_percentage':
          valueA = a.risk_asset_percentage;
          valueB = b.risk_asset_percentage;
          break;
        case 'investment_horizon':
          valueA = a.investment_horizon;
          valueB = b.investment_horizon;
          break;
        default:
          return 0;
      }
      
      if (valueA < valueB) return sortDirection === 'asc' ? -1 : 1;
      if (valueA > valueB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [investorProfiles, searchTerm, filterRiskTolerance, filterHorizonCategory, filterRiskScore, sortField, sortDirection]);

  // Pagination
  const paginatedProfiles = useMemo(() => {
    const startIndex = page * rowsPerPage;
    return filteredAndSortedProfiles.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredAndSortedProfiles, page, rowsPerPage]);

  // Calculs statistiques avancés
  const stats = useMemo(() => {
    if (investorProfiles.length === 0) return {};

    const riskToleranceStats = investorProfiles.reduce((acc, profile) => {
      const risk = profile.risk_tolerance || 'Non défini';
      acc[risk] = (acc[risk] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const horizonStats = investorProfiles.reduce((acc, profile) => {
      const horizon = profile.investment_horizon_category || 'Non défini';
      acc[horizon] = (acc[horizon] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const averageRiskPercentage = investorProfiles.reduce((sum, profile) => sum + (profile.risk_asset_percentage || 0), 0) / investorProfiles.length;
    const averageHorizon = investorProfiles.reduce((sum, profile) => sum + (profile.investment_horizon || 0), 0) / investorProfiles.length;
    const averageRiskScore = investorProfiles.reduce((sum, profile) => sum + (profile.risk_score || 0), 0) / investorProfiles.length;

    const riskScoreDistribution = investorProfiles.reduce((acc, profile) => {
      const scoreRange = profile.risk_score <= 3 ? 'Faible (1-3)' : 
                        profile.risk_score <= 6 ? 'Modéré (4-6)' : 'Élevé (7-10)';
      acc[scoreRange] = (acc[scoreRange] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      riskToleranceStats,
      horizonStats,
      riskScoreDistribution,
      averageRiskPercentage,
      averageHorizon,
      averageRiskScore,
      totalProfiles: investorProfiles.length,
      dynamicProfiles: Object.entries(riskToleranceStats).reduce((sum, [risk, count]) => {
        return ['dynamique', 'agressif'].includes(risk.toLowerCase()) ? sum + count : sum;
      }, 0)
    };
  }, [investorProfiles]);

  // Données pour les graphiques avancés
  const chartData = useMemo(() => {
    if (!stats.riskToleranceStats) return {};

    const riskToleranceChart = {
      labels: Object.keys(stats.riskToleranceStats),
      datasets: [
        {
          data: Object.values(stats.riskToleranceStats),
          backgroundColor: [
            theme.palette.success.main,
            theme.palette.warning.main,
            theme.palette.error.main,
            theme.palette.grey[500],
          ],
          borderColor: [
            theme.palette.success.dark,
            theme.palette.warning.dark,
            theme.palette.error.dark,
            theme.palette.grey[700],
          ],
          borderWidth: 2,
        },
      ],
    };

    const horizonChart = {
      labels: Object.keys(stats.horizonStats),
      datasets: [
        {
          data: Object.values(stats.horizonStats),
          backgroundColor: [
            theme.palette.error.main,
            theme.palette.warning.main,
            theme.palette.success.main,
            theme.palette.grey[500],
          ],
          borderColor: [
            theme.palette.error.dark,
            theme.palette.warning.dark,
            theme.palette.success.dark,
            theme.palette.grey[700],
          ],
          borderWidth: 2,
        },
      ],
    };

    const riskScoreChart = {
      labels: Object.keys(stats.riskScoreDistribution || {}),
      datasets: [
        {
          label: 'Nombre d\'investisseurs',
          data: Object.values(stats.riskScoreDistribution || {}),
          backgroundColor: [
            theme.palette.success.light,
            theme.palette.warning.light,
            theme.palette.error.light,
          ],
          borderColor: [
            theme.palette.success.dark,
            theme.palette.warning.dark,
            theme.palette.error.dark,
          ],
          borderWidth: 2,
        },
      ],
    };

    const radarChart = {
      labels: ['Tolérance Risque', 'Horizon Long', '% Actifs Risqués', 'Score Élevé', 'Réactivité'],
      datasets: [
        {
          label: 'Profil Moyen',
          data: [
            (stats.averageRiskScore || 0) * 10,
            (stats.averageHorizon || 0) * 5,
            stats.averageRiskPercentage || 0,
            (stats.averageRiskScore || 0) * 10,
            70 // Valeur fictive pour la réactivité
          ],
          backgroundColor: theme.palette.primary.main + '20',
          borderColor: theme.palette.primary.main,
          borderWidth: 2,
        },
      ],
    };

    return {
      riskToleranceChart,
      horizonChart,
      riskScoreChart,
      radarChart
    };
  }, [stats, theme]);

  // Gestionnaires d'événements
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleSelectProfile = (profileId: string) => {
    setSelectedProfiles(prev => 
      prev.includes(profileId) 
        ? prev.filter(id => id !== profileId)
        : [...prev, profileId]
    );
  };

  const handleSelectAllProfiles = () => {
    if (selectedProfiles.length === paginatedProfiles.length) {
      setSelectedProfiles([]);
    } else {
      setSelectedProfiles(paginatedProfiles.map(profile => profile.user_id));
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilterRiskTolerance('');
    setFilterHorizonCategory('');
    setFilterRiskScore([0, 10]);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchInvestorProfiles();
    setRefreshing(false);
    toast({
      title: "Succès",
      description: "Données actualisées avec succès"
    });
  };

  const handleExportData = () => {
    const data = filteredAndSortedProfiles.map(profile => ({
      Nom: `${profile.first_name} ${profile.last_name}`,
      'Tolérance Risque': profile.risk_tolerance,
      'Réaction Baisse': profile.reaction_to_drop,
      'Type Profil': profile.profile_type,
      'Score Risque': profile.risk_score,
      '% Actifs Risqués': profile.risk_asset_percentage,
      'Horizon (ans)': profile.investment_horizon,
      'Catégorie Horizon': profile.investment_horizon_category
    }));

    const csv = [
      Object.keys(data[0]).join(','),
      ...data.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'profils_investisseurs.csv';
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Export réussi",
      description: "Données exportées avec succès"
    });
  };

  const openProfileDetail = (profile: InvestorProfile) => {
    setSelectedProfile(profile);
    setProfileDetailOpen(true);
  };

  const renderProfileDetailContent = () => {
    if (!selectedProfile) return null;
    
    return (
      <>
        <DialogHeader>
          <div className="flex items-center space-x-3">
            <Avatar className="h-12 w-12">
              <AvatarFallback className="bg-primary text-primary-foreground">
                {selectedProfile.first_name.charAt(0)}{selectedProfile.last_name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <DialogTitle className="text-xl">
                {selectedProfile.first_name} {selectedProfile.last_name}
              </DialogTitle>
              <DialogDescription>
                Profil {selectedProfile.profile_type} - Score de risque: {selectedProfile.risk_score}/10
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-6">
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Évaluation du Risque
              </h3>
              <div className="space-y-4">
                <div>
                  <Label className="text-sm text-muted-foreground">Score de risque</Label>
                  <div className="flex items-center space-x-3 mt-2">
                    <Slider 
                      value={[selectedProfile.risk_score]} 
                      max={10} 
                      step={1} 
                      className="flex-1" 
                      disabled 
                    />
                    <Badge variant={selectedProfile.risk_score >= 7 ? 'destructive' : selectedProfile.risk_score >= 4 ? 'outline' : 'secondary'}>
                      {selectedProfile.risk_score}/10
                    </Badge>
                  </div>
                </div>
                
                <div>
                  <Label className="text-sm text-muted-foreground">Pourcentage d'actifs risqués</Label>
                  <div className="flex items-center space-x-3 mt-2">
                    <Progress value={selectedProfile.risk_asset_percentage} className="flex-1" />
                    <span className="text-sm font-medium">{selectedProfile.risk_asset_percentage}%</span>
                  </div>
                </div>
                
                <div>
                  <Label className="text-sm text-muted-foreground">Tolérance au risque</Label>
                  <div className="mt-2">
                    <Badge variant={getRiskToleranceVariant(selectedProfile.risk_tolerance)}>
                      {selectedProfile.risk_tolerance}
                    </Badge>
                  </div>
                </div>
                
                <div>
                  <Label className="text-sm text-muted-foreground">Réaction à une baisse de marché</Label>
                  <p className="mt-2 text-sm">{selectedProfile.reaction_to_drop}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Horizon d'Investissement
              </h3>
              <div className="space-y-4">
                <div>
                  <Label className="text-sm text-muted-foreground">Durée (années)</Label>
                  <div className="flex items-center space-x-3 mt-2">
                    <Slider 
                      value={[selectedProfile.investment_horizon]} 
                      max={30} 
                      step={1} 
                      className="flex-1" 
                      disabled 
                    />
                    <Badge variant={getHorizonCategoryVariant(selectedProfile.investment_horizon_category)}>
                      {selectedProfile.investment_horizon} ans
                    </Badge>
                  </div>
                </div>
                
                <div>
                  <Label className="text-sm text-muted-foreground">Catégorie d'horizon</Label>
                  <div className="mt-2">
                    <Badge variant={getHorizonCategoryVariant(selectedProfile.investment_horizon_category)}>
                      {selectedProfile.investment_horizon_category}
                    </Badge>
                  </div>
                </div>
                
                <div className="mt-6 p-4 rounded-lg bg-muted/50">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    Recommandations
                  </h4>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Allocation suggérée:</span> {getSuggestedAllocation(selectedProfile)}</p>
                    <p><span className="font-medium">Stratégie:</span> {getSuggestedStrategy(selectedProfile)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <DialogFooter className="flex justify-between">
          <Button variant="outline" onClick={() => setSelectedProfile(null)}>
            Fermer
          </Button>
          <Button>
            <Edit className="w-4 h-4 mr-2" />
            Modifier
          </Button>
        </DialogFooter>
      </>
    );
  };

  // Rendu des composants
  const renderStatsCards = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card className="glass-card border-white/20 hover:shadow-lg transition-all duration-300 relative overflow-hidden">
        <div className="absolute inset-0 gradient-primary opacity-5"></div>
        <CardContent className="p-6 relative z-10">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground font-medium">
                Profils Totaux
              </p>
              <p className="text-3xl font-bold tracking-tight">
                {stats.totalProfiles || 0}
              </p>
              <p className="text-xs text-muted-foreground">
                {filteredAndSortedProfiles.length !== stats.totalProfiles ? 
                  `${filteredAndSortedProfiles.length} filtrés` : 'Tous affichés'}
              </p>
            </div>
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Users className="w-6 h-6 text-primary" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="glass-card border-white/20 hover:shadow-lg transition-all duration-300 relative overflow-hidden">
        <div className="absolute inset-0 gradient-success opacity-5"></div>
        <CardContent className="p-6 relative z-10">
          <div className="flex items-center justify-between">
            <div className="space-y-2 flex-1">
              <p className="text-sm text-muted-foreground font-medium">
                % Actifs Risqués Moyen
              </p>
              <p className="text-3xl font-bold tracking-tight">
                {(stats.averageRiskPercentage || 0).toFixed(1)}%
              </p>
              <Progress 
                value={stats.averageRiskPercentage || 0} 
                className="h-2 mt-2"
              />
            </div>
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center ml-4">
              <PieChart className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="glass-card border-white/20 hover:shadow-lg transition-all duration-300 relative overflow-hidden">
        <div className="absolute inset-0 gradient-warning opacity-5"></div>
        <CardContent className="p-6 relative z-10">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground font-medium">
                Horizon Moyen
              </p>
              <p className="text-3xl font-bold tracking-tight">
                {(stats.averageHorizon || 0).toFixed(1)} ans
              </p>
              <p className="text-xs text-muted-foreground">
                Score: {(stats.averageRiskScore || 0).toFixed(1)}/10
              </p>
            </div>
            <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
              <Calendar className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="glass-card border-white/20 hover:shadow-lg transition-all duration-300 relative overflow-hidden">
        <div className="absolute inset-0 gradient-gold opacity-5"></div>
        <CardContent className="p-6 relative z-10">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground font-medium">
                Profils Dynamiques
              </p>
              <p className="text-3xl font-bold tracking-tight">
                {stats.dynamicProfiles || 0}
              </p>
              <p className="text-xs text-muted-foreground">
                {stats.totalProfiles > 0 ? Math.round(((stats.dynamicProfiles || 0) / stats.totalProfiles) * 100) : 0}% du total
              </p>
            </div>
            <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderCharts = () => {
    const riskToleranceData = Object.entries(stats.riskToleranceStats || {}).map(([risk, count]) => ({
      name: risk,
      value: count,
      fill: risk.toLowerCase().includes('prudent') || risk.toLowerCase().includes('conservateur') ? '#10b981' :
            risk.toLowerCase().includes('équilibré') || risk.toLowerCase().includes('modéré') ? '#f59e0b' : '#ef4444'
    }));

    const riskScoreData = Object.entries(stats.riskScoreDistribution || {}).map(([range, count]) => ({
      name: range,
      value: count,
      fill: range.includes('Faible') ? '#10b981' : range.includes('Modéré') ? '#f59e0b' : '#ef4444'
    }));

    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card className="glass-card border-white/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="w-5 h-5" />
              Répartition par Tolérance au Risque
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPie>
                  <RechartsTooltip />
                  <RechartsLegend />
                  {riskToleranceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </RechartsPie>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="glass-card border-white/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Distribution des Scores de Risque
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={riskScoreData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <RechartsTooltip />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="glass-card border-white/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Horizon d'Investissement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-red-600">
                    {stats.horizonStats?.['Court terme'] || 0}
                  </div>
                  <Badge variant="destructive">Court terme</Badge>
                </div>
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-yellow-600">
                    {stats.horizonStats?.['Moyen terme'] || 0}
                  </div>
                  <Badge variant="outline">Moyen terme</Badge>
                </div>
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-green-600">
                    {stats.horizonStats?.['Long terme'] || 0}
                  </div>
                  <Badge variant="secondary">Long terme</Badge>
                </div>
              </div>
              <div className="pt-4">
                <p className="text-sm text-muted-foreground text-center">
                  Répartition des horizons d'investissement par client
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-white/20 lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Résumé des Métriques
            </CardTitle>
            <CardDescription>
              Vue d'ensemble des principales métriques de profils d'investisseurs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 rounded-lg bg-muted/50">
                <div className="text-2xl font-bold text-primary">
                  {(stats.averageRiskScore || 0).toFixed(1)}
                </div>
                <p className="text-sm text-muted-foreground">Score risque moyen</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-muted/50">
                <div className="text-2xl font-bold text-green-600">
                  {(stats.averageRiskPercentage || 0).toFixed(0)}%
                </div>
                <p className="text-sm text-muted-foreground">Actifs risqués moyen</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-muted/50">
                <div className="text-2xl font-bold text-blue-600">
                  {(stats.averageHorizon || 0).toFixed(1)}
                </div>
                <p className="text-sm text-muted-foreground">Horizon moyen (ans)</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-muted/50">
                <div className="text-2xl font-bold text-orange-600">
                  {stats.dynamicProfiles || 0}
                </div>
                <p className="text-sm text-muted-foreground">Profils dynamiques</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderFilters = () => (
    <Card className="glass-card border-white/20 mb-8">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Recherche et Filtres</CardTitle>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={clearFilters}
              className="glass border-white/30 hover:glass-card"
            >
              <ClearIcon className="w-4 h-4 mr-2" />
              Effacer
            </Button>
            <Dialog open={filterDialogOpen} onOpenChange={setFilterDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="glass border-white/30 hover:glass-card">
                  <Filter className="w-4 h-4 mr-2" />
                  Filtres Avancés
                </Button>
              </DialogTrigger>
              <DialogContent className="glass-card border-white/20">
                <DialogHeader>
                  <DialogTitle>Filtres Avancés</DialogTitle>
                  <DialogDescription>
                    Affinez votre recherche avec des critères spécifiques
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-6 py-4">
                  <div className="space-y-2">
                    <Label>Score de Risque: {filterRiskScore[0]} - {filterRiskScore[1]}</Label>
                    <Slider
                      value={filterRiskScore}
                      onValueChange={(value) => setFilterRiskScore(value as [number, number])}
                      max={10}
                      min={0}
                      step={1}
                      className="py-4"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setFilterDialogOpen(false)}>
                    Annuler
                  </Button>
                  <Button onClick={() => { setFilterDialogOpen(false); setPage(0); }}>
                    Appliquer
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          <div className="md:col-span-4 space-y-2">
            <Label htmlFor="search">Rechercher un investisseur</Label>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="search"
                placeholder="Nom ou prénom..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 glass border-white/30 hover:border-white/50 focus:border-primary/50"
              />
            </div>
          </div>
          
          <div className="md:col-span-3 space-y-2">
            <Label>Tolérance au Risque</Label>
            <Select value={filterRiskTolerance} onValueChange={setFilterRiskTolerance}>
              <SelectTrigger className="glass border-white/30 hover:border-white/50">
                <SelectValue placeholder="Toutes" />
              </SelectTrigger>
              <SelectContent className="glass-card border-white/20">
                <SelectItem value="">Toutes</SelectItem>
                <SelectItem value="Prudent">Prudent</SelectItem>
                <SelectItem value="Conservateur">Conservateur</SelectItem>
                <SelectItem value="Équilibré">Équilibré</SelectItem>
                <SelectItem value="Modéré">Modéré</SelectItem>
                <SelectItem value="Dynamique">Dynamique</SelectItem>
                <SelectItem value="Agressif">Agressif</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="md:col-span-3 space-y-2">
            <Label>Horizon d'Investissement</Label>
            <Select value={filterHorizonCategory} onValueChange={setFilterHorizonCategory}>
              <SelectTrigger className="glass border-white/30 hover:border-white/50">
                <SelectValue placeholder="Tous" />
              </SelectTrigger>
              <SelectContent className="glass-card border-white/20">
                <SelectItem value="">Tous</SelectItem>
                <SelectItem value="Court terme">Court terme</SelectItem>
                <SelectItem value="Moyen terme">Moyen terme</SelectItem>
                <SelectItem value="Long terme">Long terme</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="md:col-span-2">
            <Button 
              onClick={handleRefresh} 
              disabled={refreshing}
              className="w-full"
            >
              {refreshing ? (
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
              ) : (
                <RefreshCw className="w-4 h-4 mr-2" />
              )}
              Actualiser
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderTable = () => (
    <Card className="glass-card border-white/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Table2 className="h-5 w-5 text-primary" />
            <CardTitle>Liste des Profils ({filteredAndSortedProfiles.length})</CardTitle>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1 text-sm text-muted-foreground">
              <Checkbox 
                checked={selectedProfiles.length === paginatedProfiles.length && paginatedProfiles.length > 0}
                onCheckedChange={handleSelectAllProfiles}
              />
              <span>{selectedProfiles.length} sélectionné(s)</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={selectedProfiles.length === paginatedProfiles.length && paginatedProfiles.length > 0}
                  onCheckedChange={handleSelectAllProfiles}
                />
              </TableHead>
              <TableHead>
                <Button 
                  variant="ghost" 
                  onClick={() => handleSort('name')}
                  className="h-auto p-0 font-semibold hover:bg-transparent"
                >
                  Investisseur
                  {sortField === 'name' && (
                    <ArrowUpDown className={`w-4 h-4 ml-1 ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                  )}
                </Button>
              </TableHead>
              <TableHead>Tolérance au Risque</TableHead>
              <TableHead>Réaction à la Baisse</TableHead>
              <TableHead>
                <Button 
                  variant="ghost" 
                  onClick={() => handleSort('risk_score')}
                  className="h-auto p-0 font-semibold hover:bg-transparent"
                >
                  Score Risque
                  {sortField === 'risk_score' && (
                    <ArrowUpDown className={`w-4 h-4 ml-1 ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                  )}
                </Button>
              </TableHead>
              <TableHead className="text-right">
                <Button 
                  variant="ghost" 
                  onClick={() => handleSort('risk_asset_percentage')}
                  className="h-auto p-0 font-semibold hover:bg-transparent"
                >
                  % Actifs Risqués
                  {sortField === 'risk_asset_percentage' && (
                    <ArrowUpDown className={`w-4 h-4 ml-1 ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                  )}
                </Button>
              </TableHead>
              <TableHead className="text-right">
                <Button 
                  variant="ghost" 
                  onClick={() => handleSort('investment_horizon')}
                  className="h-auto p-0 font-semibold hover:bg-transparent"
                >
                  Horizon (ans)
                  {sortField === 'investment_horizon' && (
                    <ArrowUpDown className={`w-4 h-4 ml-1 ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                  )}
                </Button>
              </TableHead>
              <TableHead>Catégorie Horizon</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedProfiles.length > 0 ? (
              paginatedProfiles.map((profile) => (
                <TableRow key={profile.user_id} className="hover:bg-muted/50 transition-colors">
                  <TableCell>
                    <Checkbox
                      checked={selectedProfiles.includes(profile.user_id)}
                      onCheckedChange={() => handleSelectProfile(profile.user_id)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                          {profile.first_name.charAt(0)}{profile.last_name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{profile.first_name} {profile.last_name}</p>
                        <p className="text-sm text-muted-foreground">{profile.profile_type}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getRiskToleranceVariant(profile.risk_tolerance)}>
                      {profile.risk_tolerance}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">{profile.reaction_to_drop}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {getRiskScoreIcon(profile.risk_score)}
                      <span className={`font-medium ${getRiskScoreColor(profile.risk_score)}`}>
                        {profile.risk_score}/10
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="space-y-1">
                      <Progress 
                        value={profile.risk_asset_percentage} 
                        className="h-2"
                      />
                      <span className="text-sm font-medium">{profile.risk_asset_percentage}%</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-medium">{profile.investment_horizon}</TableCell>
                  <TableCell>
                    <Badge variant={getHorizonCategoryVariant(profile.investment_horizon_category)}>
                      {profile.investment_horizon_category}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => setSelectedProfile(profile)}
                          className="hover:bg-primary/10"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="glass-card border-white/20 max-w-2xl">
                        {renderProfileDetailContent()}
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                  <div className="flex flex-col items-center space-y-2">
                    <Users className="w-8 h-8 text-muted-foreground/50" />
                    <p>Aucun profil ne correspond aux critères de recherche</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        
        <div className="flex items-center justify-between px-6 py-4 border-t border-border">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <span>Lignes par page:</span>
            <Select
              value={rowsPerPage.toString()}
              onValueChange={(value) => {
                setRowsPerPage(parseInt(value));
                setPage(0);
              }}
            >
              <SelectTrigger className="w-20 h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <span>
              {page * rowsPerPage + 1}-{Math.min((page + 1) * rowsPerPage, filteredAndSortedProfiles.length)} sur {filteredAndSortedProfiles.length}
            </span>
            <div className="flex items-center space-x-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(0)}
                disabled={page === 0}
                className="h-8 w-8 p-0"
              >
                <ChevronDown className="w-4 h-4 rotate-90" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(page - 1)}
                disabled={page === 0}
                className="h-8 w-8 p-0"
              >
                <ChevronDown className="w-4 h-4 rotate-90" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(page + 1)}
                disabled={page >= Math.ceil(filteredAndSortedProfiles.length / rowsPerPage) - 1}
                className="h-8 w-8 p-0"
              >
                <ChevronDown className="w-4 h-4 -rotate-90" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(Math.ceil(filteredAndSortedProfiles.length / rowsPerPage) - 1)}
                disabled={page >= Math.ceil(filteredAndSortedProfiles.length / rowsPerPage) - 1}
                className="h-8 w-8 p-0"
              >
                <ChevronDown className="w-4 h-4 -rotate-90" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderProfileCards = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {paginatedProfiles.map((profile) => (
        <Card key={profile.user_id} className="glass-card border-white/20 hover:shadow-lg transition-all duration-300 relative overflow-hidden group">
          <div className="absolute inset-0 gradient-primary opacity-5 group-hover:opacity-10 transition-opacity"></div>
          <CardContent className="p-6 relative z-10">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {profile.first_name.charAt(0)}{profile.last_name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold tracking-tight">{profile.first_name} {profile.last_name}</h3>
                  <p className="text-sm text-muted-foreground">{profile.profile_type}</p>
                </div>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setSelectedProfile(profile)}
                    className="hover:bg-primary/10 glass"
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="glass-card border-white/20 max-w-2xl">
                  {renderProfileDetailContent()}
                </DialogContent>
              </Dialog>
            </div>

            <div className="space-y-4">
              <div>
                <Label className="text-sm text-muted-foreground">Tolérance au risque</Label>
                <div className="flex items-center justify-between mt-2">
                  <Badge variant={getRiskToleranceVariant(profile.risk_tolerance)}>
                    {profile.risk_tolerance}
                  </Badge>
                  <div className="flex items-center space-x-1">
                    {getRiskScoreIcon(profile.risk_score)}
                    <span className={`text-sm font-medium ${getRiskScoreColor(profile.risk_score)}`}>
                      {profile.risk_score}/10
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-muted-foreground">% Actifs risqués</Label>
                  <div className="mt-2 space-y-2">
                    <Progress value={profile.risk_asset_percentage} className="h-2" />
                    <span className="text-sm font-medium">{profile.risk_asset_percentage}%</span>
                  </div>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Horizon</Label>
                  <div className="mt-2 space-y-2">
                    <Badge variant={getHorizonCategoryVariant(profile.investment_horizon_category)}>
                      {profile.investment_horizon_category}
                    </Badge>
                    <p className="text-sm font-medium">{profile.investment_horizon} ans</p>
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-sm text-muted-foreground">Réaction à une baisse</Label>
                <p className="text-sm mt-1">{profile.reaction_to_drop}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );



  // Fonctions utilitaires pour les recommandations
  const getSuggestedAllocation = (profile: InvestorProfile) => {
    if (profile.risk_score <= 3) return "80% Obligations, 15% Actions, 5% Liquidités";
    if (profile.risk_score <= 6) return "50% Actions, 40% Obligations, 10% Alternatives";
    return "80% Actions, 15% Alternatives, 5% Obligations";
  };

  const getSuggestedStrategy = (profile: InvestorProfile) => {
    if (profile.risk_score <= 3) return "Stratégie défensive avec accent sur la préservation du capital";
    if (profile.risk_score <= 6) return "Approche équilibrée entre croissance et stabilité";
    return "Stratégie offensive axée sur la croissance à long terme";
  };

  return (
    <TooltipProvider>
      <div className="space-y-8 animate-fade-in p-6">
        {/* Enhanced Header */}
        <div className="glass-card p-8 rounded-2xl relative overflow-hidden border-white/20">
          <div className="absolute inset-0 gradient-primary opacity-5"></div>
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full gradient-eparnova flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight gradient-text bg-gradient-to-r from-eparnova-blue via-eparnova-green to-eparnova-gold bg-clip-text text-transparent">
                  Analyse des Profils Investisseurs
                </h1>
                <p className="text-muted-foreground mt-1">
                  Analysez et gérez les profils de risque de vos clients
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleRefresh}
                    disabled={refreshing}
                    className="glass border-white/30 hover:glass-card"
                  >
                    <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Actualiser les données</TooltipContent>
              </Tooltip>
              <Button 
                onClick={() => {}} 
                className="gradient-eparnova hover:opacity-90 text-white font-medium"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Nouveau Profil
              </Button>
            </div>
          </div>
        </div>

        {renderStatsCards()}
        
        <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as ViewMode)} className="space-y-6">
          <div className="flex items-center justify-between">
            <TabsList className="glass border-white/20">
              <TabsTrigger value="table" className="flex items-center gap-2">
                <Table2 className="w-4 h-4" />
                Tableau
              </TabsTrigger>
              <TabsTrigger value="cards" className="flex items-center gap-2">
                <Grid3x3 className="w-4 h-4" />
                Cartes
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Analytics
              </TabsTrigger>
            </TabsList>
            <Button 
              variant="outline" 
              onClick={handleExportData}
              className="glass border-white/30 hover:glass-card"
            >
              <Download className="w-4 h-4 mr-2" />
              Exporter
            </Button>
          </div>

          {renderFilters()}

          {loading ? (
            <Card className="glass-card border-white/20">
              <CardContent className="flex items-center justify-center py-16">
                <div className="flex flex-col items-center space-y-4">
                  <div className="w-8 h-8 border-4 border-current border-t-transparent rounded-full animate-spin" />
                  <p className="text-muted-foreground">Chargement des profils...</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <>
              <TabsContent value="table" className="space-y-4">
                {renderTable()}
              </TabsContent>
              <TabsContent value="cards" className="space-y-4">
                {renderProfileCards()}
              </TabsContent>
              <TabsContent value="analytics" className="space-y-4">
                {renderCharts()}
              </TabsContent>
            </>
          )}
        </Tabs>

        {renderProfileDetail()}
      </div>
    </TooltipProvider>
  );
};

export default InvestorProfiles;
