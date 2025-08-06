import React, { useState, useEffect } from 'react';
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Shield,
  Users,
  Heart,
  DollarSign,
  TrendingUp,
  Search,
  Filter,
  AlertCircle,
  ArrowLeft,
  PieChart,
  BarChart3,
  RefreshCw,
  Target,
  Wallet,
  ShieldCheck,
  Clock,
  CheckCircle,
  XCircle,
  Award,
  Zap,
  Activity,
  Star,
} from 'lucide-react';
import { supabase } from './../../../lib/supabase';
import { useToast } from '@/components/ui/use-toast';

interface InsuranceAnalysis {
  user_id: string;
  last_name: string;
  first_name: string;
  life_insurance_count: number;
  total_life_insurance_value: number;
  prevoyance_count: number;
  total_death_capital: number;
  total_monthly_death_pension: number;
  total_annual_premium: number;
  life_insurance_category: string;
  life_insurance_value_category: string;
}

const InsuranceAnalysis: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [insuranceAnalyses, setInsuranceAnalyses] = useState<InsuranceAnalysis[]>([]);
  const [filteredAnalyses, setFilteredAnalyses] = useState<InsuranceAnalysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterHasLifeInsurance, setFilterHasLifeInsurance] = useState<string>('all');
  const [filterHasPrevoyance, setFilterHasPrevoyance] = useState<string>('all');
  const [filterLifeInsuranceCategory, setFilterLifeInsuranceCategory] = useState<string>('all');
  const [filterLifeInsuranceValueCategory, setFilterLifeInsuranceValueCategory] = useState<string>('all');

  const fetchInsuranceAnalyses = async () => {
    setRefreshing(true);
    try {
      const { data, error } = await supabase
        .from('insurance_analysis')
        .select('*')
        .order('total_life_insurance_value', { ascending: false });

      if (error) throw error;
      setInsuranceAnalyses(data || []);
      setFilteredAnalyses(data || []);
    } catch (error) {
      console.error('Error fetching insurance analyses:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les analyses d'assurance",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchInsuranceAnalyses();
  }, [toast]);

  // Apply filters whenever any filter changes
  useEffect(() => {
    const filtered = insuranceAnalyses.filter(analysis => {
      const nameMatch = `${analysis.first_name} ${analysis.last_name}`.toLowerCase().includes(searchTerm.toLowerCase());
      
      const lifeInsuranceMatch = filterHasLifeInsurance === 'all' || 
        (filterHasLifeInsurance === 'true' && analysis.life_insurance_count > 0) ||
        (filterHasLifeInsurance === 'false' && analysis.life_insurance_count === 0);
      
      const prevoyanceMatch = filterHasPrevoyance === 'all' || 
        (filterHasPrevoyance === 'true' && analysis.prevoyance_count > 0) ||
        (filterHasPrevoyance === 'false' && analysis.prevoyance_count === 0);
      
      const lifeInsuranceCategoryMatch = filterLifeInsuranceCategory === 'all' || 
        analysis.life_insurance_category === filterLifeInsuranceCategory;
      
      const lifeInsuranceValueCategoryMatch = filterLifeInsuranceValueCategory === 'all' || 
        analysis.life_insurance_value_category === filterLifeInsuranceValueCategory;
      
      return nameMatch && lifeInsuranceMatch && prevoyanceMatch && 
             lifeInsuranceCategoryMatch && lifeInsuranceValueCategoryMatch;
    });
    
    setFilteredAnalyses(filtered);
  }, [
    searchTerm, 
    filterHasLifeInsurance, 
    filterHasPrevoyance, 
    filterLifeInsuranceCategory, 
    filterLifeInsuranceValueCategory, 
    insuranceAnalyses
  ]);

  const formatCurrency = (amount: number) => {
    if (amount === null || amount === undefined) return 'N/A';
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getInsuranceCoverageBadge = (deathCapital: number, lifeInsuranceValue: number) => {
    const totalCoverage = (deathCapital || 0) + (lifeInsuranceValue || 0);
    if (totalCoverage === 0) return { label: 'Aucune couverture', variant: 'destructive', color: 'text-red-600' };
    if (totalCoverage < 100000) return { label: 'Couverture faible', variant: 'outline', color: 'text-orange-600' };
    if (totalCoverage < 500000) return { label: 'Couverture moyenne', variant: 'secondary', color: 'text-blue-600' };
    if (totalCoverage < 1000000) return { label: 'Couverture élevée', variant: 'default', color: 'text-green-600' };
    return { label: 'Couverture très élevée', variant: 'default', color: 'text-emerald-600' };
  };

  const getPremiumCategoryBadge = (premium: number) => {
    if (premium === null || premium === undefined || premium === 0) 
      return { label: 'Aucune prime', variant: 'outline', color: 'text-gray-600' };
    if (premium < 1000) return { label: 'Prime faible', variant: 'default', color: 'text-green-600' };
    if (premium < 5000) return { label: 'Prime moyenne', variant: 'secondary', color: 'text-blue-600' };
    if (premium < 10000) return { label: 'Prime élevée', variant: 'outline', color: 'text-orange-600' };
    return { label: 'Prime très élevée', variant: 'destructive', color: 'text-red-600' };
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  };

  // Statistics calculations
  const totalLifeInsuranceValue = insuranceAnalyses.reduce((sum, analysis) => sum + (analysis.total_life_insurance_value || 0), 0);
  const totalDeathCapital = insuranceAnalyses.reduce((sum, analysis) => sum + (analysis.total_death_capital || 0), 0);
  const totalAnnualPremiums = insuranceAnalyses.reduce((sum, analysis) => sum + (analysis.total_annual_premium || 0), 0);
  const averageLifeInsuranceValue = insuranceAnalyses.length > 0 ? totalLifeInsuranceValue / insuranceAnalyses.length : 0;
  const averageDeathCapital = insuranceAnalyses.length > 0 ? totalDeathCapital / insuranceAnalyses.length : 0;
  const averageAnnualPremium = insuranceAnalyses.length > 0 ? totalAnnualPremiums / insuranceAnalyses.length : 0;

  const usersWithLifeInsurance = insuranceAnalyses.filter(analysis => analysis.life_insurance_count > 0).length;
  const usersWithPrevoyance = insuranceAnalyses.filter(analysis => analysis.prevoyance_count > 0).length;
  const usersWithBothInsurances = insuranceAnalyses.filter(analysis => 
    analysis.life_insurance_count > 0 && analysis.prevoyance_count > 0
  ).length;

  // Coverage level distribution
  const coverageLevelStats = insuranceAnalyses.reduce((acc, analysis) => {
    const level = getInsuranceCoverageBadge(analysis.total_death_capital, analysis.total_life_insurance_value);
    acc[level.label] = (acc[level.label] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Premium category distribution
  const premiumCategoryStats = insuranceAnalyses.reduce((acc, analysis) => {
    const category = getPremiumCategoryBadge(analysis.total_annual_premium);
    acc[category.label] = (acc[category.label] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const handleRefresh = async () => {
    await fetchInsuranceAnalyses();
    toast({
      title: "✅ Données actualisées",
      description: "Les analyses d'assurance ont été mises à jour avec succès",
    });
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setFilterHasLifeInsurance('all');
    setFilterHasPrevoyance('all');
    setFilterLifeInsuranceCategory('all');
    setFilterLifeInsuranceValueCategory('all');
  };

  const lifeInsuranceCategories = [
    { value: 'all', label: 'Toutes' },
    { value: 'Aucune', label: 'Aucune assurance vie' },
    { value: 'Une', label: 'Une assurance vie' },
    { value: 'Deux', label: 'Deux assurances vie' },
    { value: 'Plusieurs', label: 'Plusieurs assurances vie' }
  ];

  const lifeInsuranceValueCategories = [
    { value: 'all', label: 'Toutes' },
    { value: 'Aucune', label: 'Aucune valeur' },
    { value: 'Faible', label: 'Valeur faible (<50k€)' },
    { value: 'Moyenne', label: 'Valeur moyenne (50k-200k€)' },
    { value: 'Élevée', label: 'Valeur élevée (>200k€)' }
  ];

  return (
    <TooltipProvider>
      <div className="space-y-8 animate-fade-in p-6">
        {/* Enhanced Header with glassmorphism */}
        <div className="glass-card p-8 rounded-2xl relative overflow-hidden border-white/20">
          <div className="absolute inset-0 gradient-primary opacity-5"></div>
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/admin/analyse-clients')}
                className="glass hover:glass-card transition-all duration-200"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-eparnova-blue via-eparnova-green to-eparnova-gold bg-clip-text text-transparent">
                  Analyse des Assurances
                </h1>
                <p className="text-muted-foreground mt-2 text-lg">
                  Analyse détaillée de la couverture d'assurance vie et prévoyance
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-2">
                <Shield className="h-10 w-10 text-eparnova-blue animate-float" />
                <Heart className="h-8 w-8 text-eparnova-green animate-float" style={{animationDelay: '1s'}} />
              </div>
              <Button
                onClick={handleRefresh}
                disabled={refreshing}
                variant="outline"
                size="icon"
                className="glass border-white/30 hover:glass-card"
              >
                <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </div>
          {/* Decorative elements */}
          <div className="absolute top-4 right-4 w-24 h-24 gradient-success rounded-full opacity-10 animate-float"></div>
          <div className="absolute bottom-4 left-4 w-20 h-20 gradient-warning rounded-full opacity-10 animate-float" style={{animationDelay: '2s'}}></div>
        </div>

        {/* Enhanced Main Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="glass-card border-white/20 hover:shadow-lg transition-all duration-300 relative overflow-hidden">
            <div className="absolute inset-0 gradient-primary opacity-5"></div>
            <CardContent className="p-6 relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Clients</p>
                  <p className="text-3xl font-bold text-foreground">{insuranceAnalyses.length}</p>
                  <p className="text-xs text-muted-foreground mt-1">clients analysés</p>
                </div>
                <div className="p-3 gradient-primary rounded-xl">
                  <Users className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-white/20 hover:shadow-lg transition-all duration-300 relative overflow-hidden">
            <div className="absolute inset-0 gradient-success opacity-5"></div>
            <CardContent className="p-6 relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Assurance Vie</p>
                  <p className="text-3xl font-bold text-blue-600">{usersWithLifeInsurance}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {((usersWithLifeInsurance / (insuranceAnalyses.length || 1)) * 100).toFixed(1)}% du total
                  </p>
                </div>
                <div className="p-3 gradient-success rounded-xl">
                  <Shield className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-white/20 hover:shadow-lg transition-all duration-300 relative overflow-hidden">
            <div className="absolute inset-0 gradient-warning opacity-5"></div>
            <CardContent className="p-6 relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Prévoyance</p>
                  <p className="text-3xl font-bold text-orange-600">{usersWithPrevoyance}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {((usersWithPrevoyance / (insuranceAnalyses.length || 1)) * 100).toFixed(1)}% du total
                  </p>
                </div>
                <div className="p-3 gradient-warning rounded-xl">
                  <Heart className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-white/20 hover:shadow-lg transition-all duration-300 relative overflow-hidden">
            <div className="absolute inset-0 gradient-gold opacity-5"></div>
            <CardContent className="p-6 relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Couverture Complète</p>
                  <p className="text-3xl font-bold text-emerald-600">{usersWithBothInsurances}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {((usersWithBothInsurances / (insuranceAnalyses.length || 1)) * 100).toFixed(1)}% du total
                  </p>
                </div>
                <div className="p-3 gradient-gold rounded-xl">
                  <Star className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Financial Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="glass-card border-white/20 hover:shadow-lg transition-all duration-300">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                <Target className="h-4 w-4 mr-2 text-blue-500" />
                Valeur Assurance Vie Moyenne
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-blue-600">{formatCurrency(averageLifeInsuranceValue)}</p>
              <p className="text-sm text-muted-foreground mt-1">
                Total: {formatCurrency(totalLifeInsuranceValue)}
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card border-white/20 hover:shadow-lg transition-all duration-300">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                <ShieldCheck className="h-4 w-4 mr-2 text-green-500" />
                Capital Décès Moyen
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(averageDeathCapital)}</p>
              <p className="text-sm text-muted-foreground mt-1">
                Total: {formatCurrency(totalDeathCapital)}
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card border-white/20 hover:shadow-lg transition-all duration-300">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                <Clock className="h-4 w-4 mr-2 text-orange-500" />
                Prime Annuelle Moyenne
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-orange-600">{formatCurrency(averageAnnualPremium)}</p>
              <p className="text-sm text-muted-foreground mt-1">par client</p>
            </CardContent>
          </Card>

          <Card className="glass-card border-white/20 hover:shadow-lg transition-all duration-300">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                <DollarSign className="h-4 w-4 mr-2 text-purple-500" />
                Total Primes Annuelles
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-purple-600">{formatCurrency(totalAnnualPremiums)}</p>
              <p className="text-sm text-muted-foreground mt-1">toutes assurances</p>
            </CardContent>
          </Card>
        </div>

        {/* Distribution Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="glass-card border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5 text-eparnova-blue" />
                <span>Niveaux de Couverture</span>
              </CardTitle>
              <CardDescription>Répartition par niveau de couverture globale</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(coverageLevelStats).map(([level, count]) => {
                const badgeInfo = getInsuranceCoverageBadge(0, 0);
                const percentage = insuranceAnalyses.length > 0 ? (count / insuranceAnalyses.length) * 100 : 0;
                
                return (
                  <div key={level} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Badge variant={badgeInfo.variant as any} className={badgeInfo.color}>
                        {level}
                      </Badge>
                      <span className="text-sm font-medium">
                        {count} ({percentage.toFixed(1)}%)
                      </span>
                    </div>
                    <Progress value={percentage} className="h-2" />
                  </div>
                );
              })}
            </CardContent>
          </Card>

          <Card className="glass-card border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <PieChart className="h-5 w-5 text-eparnova-green" />
                <span>Catégories de Primes</span>
              </CardTitle>
              <CardDescription>Répartition par niveau de prime annuelle</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(premiumCategoryStats).map(([category, count]) => {
                const badgeInfo = getPremiumCategoryBadge(0);
                const percentage = insuranceAnalyses.length > 0 ? (count / insuranceAnalyses.length) * 100 : 0;
                
                return (
                  <div key={category} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Badge variant={badgeInfo.variant as any} className={badgeInfo.color}>
                        {category}
                      </Badge>
                      <span className="text-sm font-medium">
                        {count} ({percentage.toFixed(1)}%)
                      </span>
                    </div>
                    <Progress value={percentage} className="h-2" />
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Filters */}
        <Card className="glass-card border-white/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Filter className="h-5 w-5 text-eparnova-blue" />
                <CardTitle className="text-lg">Filtres et Recherche</CardTitle>
              </div>
              <Button
                onClick={handleClearFilters}
                variant="outline"
                size="sm"
                className="glass border-white/30 hover:glass-card"
                disabled={!searchTerm && filterHasLifeInsurance === 'all' && filterHasPrevoyance === 'all' && filterLifeInsuranceCategory === 'all' && filterLifeInsuranceValueCategory === 'all'}
              >
                Réinitialiser
              </Button>
            </div>
            <CardDescription>Affinez votre recherche avec les filtres ci-dessous</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Rechercher un client</label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Nom ou prénom..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 glass border-white/30 hover:border-white/50 focus:border-blue-300/50"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Assurance Vie</label>
                <Select value={filterHasLifeInsurance} onValueChange={setFilterHasLifeInsurance}>
                  <SelectTrigger className="glass border-white/30 hover:border-white/50">
                    <SelectValue placeholder="Tous" />
                  </SelectTrigger>
                  <SelectContent className="glass-card border-white/20">
                    <SelectItem value="all">Tous</SelectItem>
                    <SelectItem value="true">Avec Assurance Vie</SelectItem>
                    <SelectItem value="false">Sans Assurance Vie</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Prévoyance</label>
                <Select value={filterHasPrevoyance} onValueChange={setFilterHasPrevoyance}>
                  <SelectTrigger className="glass border-white/30 hover:border-white/50">
                    <SelectValue placeholder="Tous" />
                  </SelectTrigger>
                  <SelectContent className="glass-card border-white/20">
                    <SelectItem value="all">Tous</SelectItem>
                    <SelectItem value="true">Avec Prévoyance</SelectItem>
                    <SelectItem value="false">Sans Prévoyance</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Catégorie Assurance Vie</label>
                <Select value={filterLifeInsuranceCategory} onValueChange={setFilterLifeInsuranceCategory}>
                  <SelectTrigger className="glass border-white/30 hover:border-white/50">
                    <SelectValue placeholder="Toutes" />
                  </SelectTrigger>
                  <SelectContent className="glass-card border-white/20">
                    {lifeInsuranceCategories.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Catégorie Valeur</label>
                <Select value={filterLifeInsuranceValueCategory} onValueChange={setFilterLifeInsuranceValueCategory}>
                  <SelectTrigger className="glass border-white/30 hover:border-white/50">
                    <SelectValue placeholder="Toutes" />
                  </SelectTrigger>
                  <SelectContent className="glass-card border-white/20">
                    {lifeInsuranceValueCategories.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex justify-between items-center mt-6 pt-4 border-t border-white/10">
              <div className="text-sm text-muted-foreground">
                {filteredAnalyses.length} client(s) trouvé(s) sur {insuranceAnalyses.length} au total
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Data Table */}
        <Card className="glass-card border-white/20">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Wallet className="h-5 w-5 text-eparnova-blue" />
              <span>Détail par Client</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-eparnova-blue"></div>
                <span className="ml-3 text-muted-foreground">Chargement des analyses...</span>
              </div>
            ) : (
              <div className="rounded-lg border border-white/20 overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-white/5 hover:bg-white/10">
                      <TableHead className="font-semibold">Client</TableHead>
                      <TableHead className="font-semibold text-center">Nb Assurance Vie</TableHead>
                      <TableHead className="font-semibold text-right">Valeur Assurance Vie</TableHead>
                      <TableHead className="font-semibold text-center">Nb Prévoyance</TableHead>
                      <TableHead className="font-semibold text-right">Capital Décès</TableHead>
                      <TableHead className="font-semibold text-right">Rente Décès</TableHead>
                      <TableHead className="font-semibold text-right">Prime Annuelle</TableHead>
                      <TableHead className="font-semibold">Niveau Couverture</TableHead>
                      <TableHead className="font-semibold">Catégorie Prime</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAnalyses.length > 0 ? (
                      filteredAnalyses.map((analysis) => {
                        const coverageLevel = getInsuranceCoverageBadge(
                          analysis.total_death_capital, 
                          analysis.total_life_insurance_value
                        );
                        const premiumCategory = getPremiumCategoryBadge(analysis.total_annual_premium);
                        
                        return (
                          <TableRow key={analysis.user_id} className="hover:bg-white/5 transition-colors">
                            <TableCell>
                              <div className="flex items-center space-x-3">
                                <Avatar className="h-9 w-9">
                                  <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm font-medium">
                                    {getInitials(analysis.first_name, analysis.last_name)}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium text-foreground">
                                    {analysis.first_name} {analysis.last_name}
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    ID: {analysis.user_id.slice(0, 8)}...
                                  </p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="text-center">
                              <Badge 
                                variant={analysis.life_insurance_count > 0 ? "default" : "outline"}
                                className="font-medium"
                              >
                                {analysis.life_insurance_count}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right font-medium text-blue-600">
                              {formatCurrency(analysis.total_life_insurance_value)}
                            </TableCell>
                            <TableCell className="text-center">
                              <Badge 
                                variant={analysis.prevoyance_count > 0 ? "secondary" : "outline"}
                                className="font-medium"
                              >
                                {analysis.prevoyance_count}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right font-medium text-green-600">
                              {formatCurrency(analysis.total_death_capital)}
                            </TableCell>
                            <TableCell className="text-right font-medium text-teal-600">
                              {formatCurrency(analysis.total_monthly_death_pension)}
                            </TableCell>
                            <TableCell className="text-right font-medium text-purple-600">
                              {formatCurrency(analysis.total_annual_premium)}
                            </TableCell>
                            <TableCell>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Badge variant={coverageLevel.variant as any} className={coverageLevel.color}>
                                    {coverageLevel.label}
                                  </Badge>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <div className="text-sm">
                                    <p>Capital décès: {formatCurrency(analysis.total_death_capital)}</p>
                                    <p>Assurance vie: {formatCurrency(analysis.total_life_insurance_value)}</p>
                                    <p><strong>Total: {formatCurrency((analysis.total_death_capital || 0) + (analysis.total_life_insurance_value || 0))}</strong></p>
                                  </div>
                                </TooltipContent>
                              </Tooltip>
                            </TableCell>
                            <TableCell>
                              <Badge variant={premiumCategory.variant as any} className={premiumCategory.color}>
                                {premiumCategory.label}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    ) : (
                      <TableRow>
                        <TableCell colSpan={9} className="text-center py-12">
                          <div className="flex flex-col items-center space-y-2">
                            <Shield className="h-12 w-12 text-muted-foreground opacity-50" />
                            <p className="text-muted-foreground">Aucun résultat trouvé</p>
                            <p className="text-sm text-muted-foreground">Essayez de modifier vos critères de recherche</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
};

export default InsuranceAnalysis;