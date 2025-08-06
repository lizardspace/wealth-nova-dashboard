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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  TooltipProvider,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Users,
  Euro,
  Receipt,
  TrendingUp,
  Search,
  Filter,
  AlertCircle,
  RefreshCw,
  Calculator,
  Target,
  BookOpen,
  PieChart,
  BarChart3,
  Award,
  Star,
  Activity,
  Shield,
  Eye,
  EyeOff,
  Download,
  CheckCircle,
  XCircle,
  Brain,
  Lightbulb,
} from 'lucide-react';
import { supabase } from './../../../lib/supabase';
import { useToast } from '@/components/ui/use-toast';

interface TaxAnalysis {
  user_id: string;
  last_name: string;
  first_name: string;
  taxable_income: number;
  tax_option: string;
  wealth_tax: number;
  total_tax_deductions: number;
  fiscal_knowledge: string;
  uses_tax_devices: boolean;
  income_category: string;
  impot_revenu_status?: string;
  ifi_status?: string;
  fiscalite_status?: string;
}

const TaxAnalysis: React.FC = () => {
  const { toast } = useToast();
  const [taxAnalyses, setTaxAnalyses] = useState<TaxAnalysis[]>([]);
  const [filteredAnalyses, setFilteredAnalyses] = useState<TaxAnalysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTaxOption, setFilterTaxOption] = useState('all');
  const [filterIncomeCategory, setFilterIncomeCategory] = useState('all');
  const [filterFiscalKnowledge, setFilterFiscalKnowledge] = useState('all');
  const [showDebugMode, setShowDebugMode] = useState(false);

  // Mock data for demonstration (replace with real Supabase call in production)
  const mockData: TaxAnalysis[] = [
    {
      user_id: '8547ec9f-2d61-44ee-856f-3ec204d6718e',
      last_name: 'RECIPON',
      first_name: 'Vianney',
      taxable_income: 45000,
      tax_option: 'Barème IR',
      wealth_tax: 0,
      total_tax_deductions: 2500,
      fiscal_knowledge: 'Bonne',
      uses_tax_devices: false,
      income_category: 'Moyen',
      impot_revenu_status: 'OK',
      ifi_status: 'MISSING',
      fiscalite_status: 'OK'
    },
    {
      user_id: '9da798fe-d202-4e71-a197-c2fa86822e7e',
      last_name: 'Bard de Coutance',
      first_name: 'Paul',
      taxable_income: 85000,
      tax_option: 'PFU',
      wealth_tax: 3200,
      total_tax_deductions: 1800,
      fiscal_knowledge: 'Expert',
      uses_tax_devices: true,
      income_category: 'Élevé',
      impot_revenu_status: 'OK',
      ifi_status: 'OK',
      fiscalite_status: 'OK'
    },
    {
      user_id: 'abbeef9b-8cd0-4536-9cca-70b6156166ab',
      last_name: 'Bard de Coutance',
      first_name: 'Axel',
      taxable_income: 32000,
      tax_option: 'Barème IR',
      wealth_tax: 0,
      total_tax_deductions: 1200,
      fiscal_knowledge: 'Bonne',
      uses_tax_devices: false,
      income_category: 'Moyen',
      impot_revenu_status: 'OK',
      ifi_status: 'MISSING',
      fiscalite_status: 'OK'
    },
    {
      user_id: 'c8d960c1-2ba2-40f9-b40d-fc62bf1018a9',
      last_name: 'Durand',
      first_name: 'Marie',
      taxable_income: 58000,
      tax_option: 'PFU',
      wealth_tax: 0,
      total_tax_deductions: 3100,
      fiscal_knowledge: 'Moyenne',
      uses_tax_devices: true,
      income_category: 'Moyen',
      impot_revenu_status: 'OK',
      ifi_status: 'MISSING',
      fiscalite_status: 'OK'
    },
    {
      user_id: 'd123456a-1234-5678-9abc-def123456789',
      last_name: 'Martin',
      first_name: 'Jean',
      taxable_income: 120000,
      tax_option: 'Barème IR',
      wealth_tax: 8500,
      total_tax_deductions: 5200,
      fiscal_knowledge: 'Expert',
      uses_tax_devices: true,
      income_category: 'Élevé',
      impot_revenu_status: 'OK',
      ifi_status: 'OK',
      fiscalite_status: 'OK'
    },
    {
      user_id: 'e987654b-9876-5432-1abc-def987654321',
      last_name: 'Lefebvre',
      first_name: 'Sophie',
      taxable_income: 28000,
      tax_option: 'Barème IR',
      wealth_tax: 0,
      total_tax_deductions: 800,
      fiscal_knowledge: 'Faible',
      uses_tax_devices: false,
      income_category: 'Faible',
      impot_revenu_status: 'OK',
      ifi_status: 'MISSING',
      fiscalite_status: 'OK'
    }
  ];

  const fetchTaxData = async () => {
    setRefreshing(true);
    try {
      // In production, replace with actual Supabase call:
      // const { data, error } = await supabase
      //   .from('tax_analysis')
      //   .select('*')
      //   .order('taxable_income', { ascending: false });
      
      // For now, using mock data
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate loading
      const data = mockData;
      
      const processedData = data.map(item => ({
        ...item,
        taxable_income: Number(item.taxable_income) || 0,
        wealth_tax: Number(item.wealth_tax) || 0,
        total_tax_deductions: Number(item.total_tax_deductions) || 0,
        uses_tax_devices: Boolean(item.uses_tax_devices),
        tax_option: item.tax_option || 'Non défini',
        fiscal_knowledge: item.fiscal_knowledge || 'Non défini',
        income_category: item.income_category || 'Non défini'
      }));

      setTaxAnalyses(processedData);
      setFilteredAnalyses(processedData);
      
      toast({
        title: "✅ Données chargées",
        description: `${processedData.length} analyses fiscales chargées avec succès`,
      });
    } catch (error) {
      console.error('Error fetching tax analyses:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les analyses fiscales",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTaxData();
  }, [toast]);

  // Apply filters whenever any filter changes
  useEffect(() => {
    const filtered = taxAnalyses.filter(analysis => {
      const nameMatch = `${analysis.first_name} ${analysis.last_name}`.toLowerCase().includes(searchTerm.toLowerCase());
      const taxOptionMatch = filterTaxOption === 'all' || analysis.tax_option === filterTaxOption;
      const incomeCategoryMatch = filterIncomeCategory === 'all' || analysis.income_category === filterIncomeCategory;
      const knowledgeMatch = filterFiscalKnowledge === 'all' || analysis.fiscal_knowledge === filterFiscalKnowledge;
      
      return nameMatch && taxOptionMatch && incomeCategoryMatch && knowledgeMatch;
    });
    
    setFilteredAnalyses(filtered);
  }, [searchTerm, filterTaxOption, filterIncomeCategory, filterFiscalKnowledge, taxAnalyses]);

  const formatCurrency = (amount: number) => {
    if (amount === null || amount === undefined || isNaN(amount)) return 'N/A';
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getTaxOptionBadge = (option: string) => {
    switch (option) {
      case 'PFU':
        return { variant: 'default', color: 'text-blue-600' };
      case 'Barème IR':
        return { variant: 'secondary', color: 'text-purple-600' };
      default:
        return { variant: 'outline', color: 'text-gray-600' };
    }
  };

  const getFiscalKnowledgeBadge = (knowledge: string) => {
    switch (knowledge) {
      case 'Expert':
        return { variant: 'default', color: 'text-green-600' };
      case 'Bonne':
        return { variant: 'secondary', color: 'text-blue-600' };
      case 'Moyenne':
        return { variant: 'outline', color: 'text-orange-600' };
      case 'Faible':
        return { variant: 'destructive', color: 'text-red-600' };
      default:
        return { variant: 'outline', color: 'text-gray-600' };
    }
  };

  const getIncomeCategoryBadge = (category: string) => {
    switch (category) {
      case 'Élevé':
        return { variant: 'destructive', color: 'text-red-600' };
      case 'Moyen':
        return { variant: 'secondary', color: 'text-orange-600' };
      case 'Faible':
        return { variant: 'outline', color: 'text-blue-600' };
      default:
        return { variant: 'outline', color: 'text-gray-600' };
    }
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  };

  // Statistics calculations
  const validAnalyses = taxAnalyses.filter(a => a.taxable_income > 0);
  const totalTaxableIncome = taxAnalyses.reduce((sum, analysis) => sum + (analysis.taxable_income || 0), 0);
  const totalWealthTax = taxAnalyses.reduce((sum, analysis) => sum + (analysis.wealth_tax || 0), 0);
  const totalDeductions = taxAnalyses.reduce((sum, analysis) => sum + (analysis.total_tax_deductions || 0), 0);
  const averageIncome = validAnalyses.length > 0 ? totalTaxableIncome / validAnalyses.length : 0;
  const usersWithDevices = taxAnalyses.filter(a => a.uses_tax_devices).length;
  const usersWithWealth = taxAnalyses.filter(a => (a.wealth_tax || 0) > 0).length;

  // Distribution statistics
  const taxOptionStats = taxAnalyses.reduce((acc, analysis) => {
    const option = analysis.tax_option || 'Non défini';
    acc[option] = (acc[option] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const fiscalKnowledgeStats = taxAnalyses.reduce((acc, analysis) => {
    const knowledge = analysis.fiscal_knowledge || 'Non défini';
    acc[knowledge] = (acc[knowledge] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const incomeCategoryStats = taxAnalyses.reduce((acc, analysis) => {
    const category = analysis.income_category || 'Non défini';
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Data quality statistics
  const usersWithIncomeData = taxAnalyses.filter(u => u.impot_revenu_status === 'OK').length;
  const usersWithIfiData = taxAnalyses.filter(u => u.ifi_status === 'OK').length;
  const usersWithFiscalData = taxAnalyses.filter(u => u.fiscalite_status === 'OK').length;
  const dataCompleteness = taxAnalyses.length > 0 ? (usersWithIncomeData / taxAnalyses.length) * 100 : 0;

  const handleRefresh = async () => {
    await fetchTaxData();
    toast({
      title: "✅ Données actualisées",
      description: "Les analyses fiscales ont été mises à jour avec succès",
    });
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setFilterTaxOption('all');
    setFilterIncomeCategory('all');
    setFilterFiscalKnowledge('all');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-eparnova-blue"></div>
          <span className="text-lg text-muted-foreground">Chargement des analyses fiscales...</span>
        </div>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="space-y-8 animate-fade-in p-6">
        {/* Enhanced Header with glassmorphism */}
        <div className="glass-card p-8 rounded-2xl relative overflow-hidden border-white/20">
          <div className="absolute inset-0 gradient-primary opacity-5"></div>
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-eparnova-blue via-eparnova-green to-eparnova-gold bg-clip-text text-transparent">
                  Analyse Fiscale des Clients
                </h1>
                <p className="text-muted-foreground mt-2 text-lg">
                  Dashboard de suivi et d'analyse des profils fiscaux
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-2">
                <Receipt className="h-10 w-10 text-eparnova-blue animate-float" />
                <Calculator className="h-8 w-8 text-eparnova-green animate-float" style={{animationDelay: '1s'}} />
              </div>
              <Button
                onClick={() => setShowDebugMode(!showDebugMode)}
                variant="outline"
                size="icon"
                className={`glass border-white/30 hover:glass-card ${showDebugMode ? 'bg-yellow-500/20' : ''}`}
              >
                {showDebugMode ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
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
          <div className="absolute top-4 right-4 w-24 h-24 gradient-warning rounded-full opacity-10 animate-float"></div>
          <div className="absolute bottom-4 left-4 w-20 h-20 gradient-success rounded-full opacity-10 animate-float" style={{animationDelay: '2s'}}></div>
        </div>

        {/* Debug Panel */}
        {showDebugMode && (
          <Card className="glass-card border-yellow-200/50 bg-yellow-50/10">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertCircle className="h-5 w-5 text-yellow-600" />
                <span>Diagnostic des Données</span>
              </CardTitle>
              <CardDescription>Qualité et complétude des données fiscales</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Données Revenus</p>
                  <div className="flex items-center space-x-2">
                    <Progress value={(usersWithIncomeData / taxAnalyses.length) * 100} className="flex-1" />
                    <span className="text-sm font-medium">{usersWithIncomeData}/{taxAnalyses.length}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Données IFI</p>
                  <div className="flex items-center space-x-2">
                    <Progress value={(usersWithIfiData / taxAnalyses.length) * 100} className="flex-1" />
                    <span className="text-sm font-medium">{usersWithIfiData}/{taxAnalyses.length}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Préférences Fiscales</p>
                  <div className="flex items-center space-x-2">
                    <Progress value={(usersWithFiscalData / taxAnalyses.length) * 100} className="flex-1" />
                    <span className="text-sm font-medium">{usersWithFiscalData}/{taxAnalyses.length}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Complétude Globale</p>
                  <div className="flex items-center space-x-2">
                    <Progress value={dataCompleteness} className="flex-1" />
                    <Badge variant={dataCompleteness >= 70 ? "default" : "destructive"}>
                      {dataCompleteness.toFixed(1)}%
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Enhanced Main Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="glass-card border-white/20 hover:shadow-lg transition-all duration-300 relative overflow-hidden">
            <div className="absolute inset-0 gradient-primary opacity-5"></div>
            <CardContent className="p-6 relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Clients Analysés</p>
                  <p className="text-3xl font-bold text-foreground">{taxAnalyses.length}</p>
                  <p className="text-xs text-muted-foreground mt-1">{validAnalyses.length} avec données complètes</p>
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
                  <p className="text-sm font-medium text-muted-foreground">Revenu Fiscal Moyen</p>
                  <p className="text-3xl font-bold text-green-600">{formatCurrency(averageIncome)}</p>
                  <p className="text-xs text-muted-foreground mt-1">Total: {formatCurrency(totalTaxableIncome)}</p>
                </div>
                <div className="p-3 gradient-success rounded-xl">
                  <Euro className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-white/20 hover:shadow-lg transition-all duration-300 relative overflow-hidden">
            <div className="absolute inset-0 gradient-warning opacity-5"></div>
            <CardContent className="p-6 relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">IFI Total</p>
                  <p className="text-3xl font-bold text-red-600">{formatCurrency(totalWealthTax)}</p>
                  <p className="text-xs text-muted-foreground mt-1">{usersWithWealth} clients concernés</p>
                </div>
                <div className="p-3 gradient-warning rounded-xl">
                  <Receipt className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-white/20 hover:shadow-lg transition-all duration-300 relative overflow-hidden">
            <div className="absolute inset-0 gradient-gold opacity-5"></div>
            <CardContent className="p-6 relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Déductions Totales</p>
                  <p className="text-3xl font-bold text-purple-600">{formatCurrency(totalDeductions)}</p>
                  <p className="text-xs text-muted-foreground mt-1">{usersWithDevices} utilisent dispositifs</p>
                </div>
                <div className="p-3 gradient-gold rounded-xl">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Distribution Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="glass-card border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <PieChart className="h-5 w-5 text-eparnova-blue" />
                <span>Options Fiscales</span>
              </CardTitle>
              <CardDescription>Répartition par type d'imposition</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(taxOptionStats).map(([option, count]) => {
                const badgeInfo = getTaxOptionBadge(option);
                const percentage = taxAnalyses.length > 0 ? (count / taxAnalyses.length) * 100 : 0;
                
                return (
                  <div key={option} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Badge variant={badgeInfo.variant as any} className={badgeInfo.color}>
                        {option}
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
                <Brain className="h-5 w-5 text-eparnova-green" />
                <span>Connaissance Fiscale</span>
              </CardTitle>
              <CardDescription>Niveau d'expertise des clients</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(fiscalKnowledgeStats).map(([knowledge, count]) => {
                const badgeInfo = getFiscalKnowledgeBadge(knowledge);
                const percentage = taxAnalyses.length > 0 ? (count / taxAnalyses.length) * 100 : 0;
                
                return (
                  <div key={knowledge} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Badge variant={badgeInfo.variant as any} className={badgeInfo.color}>
                        {knowledge}
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
                <BarChart3 className="h-5 w-5 text-eparnova-gold" />
                <span>Catégories de Revenus</span>
              </CardTitle>
              <CardDescription>Répartition par tranche de revenus</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(incomeCategoryStats).map(([category, count]) => {
                const badgeInfo = getIncomeCategoryBadge(category);
                const percentage = taxAnalyses.length > 0 ? (count / taxAnalyses.length) * 100 : 0;
                
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
                disabled={!searchTerm && filterTaxOption === 'all' && filterIncomeCategory === 'all' && filterFiscalKnowledge === 'all'}
              >
                Réinitialiser
              </Button>
            </div>
            <CardDescription>Affinez votre recherche avec les filtres ci-dessous</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
                <label className="text-sm font-medium">Option Fiscale</label>
                <Select value={filterTaxOption} onValueChange={setFilterTaxOption}>
                  <SelectTrigger className="glass border-white/30 hover:border-white/50">
                    <SelectValue placeholder="Toutes les options" />
                  </SelectTrigger>
                  <SelectContent className="glass-card border-white/20">
                    <SelectItem value="all">Toutes les options</SelectItem>
                    {Object.keys(taxOptionStats).map(option => (
                      <SelectItem key={option} value={option}>{option}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Catégorie de Revenu</label>
                <Select value={filterIncomeCategory} onValueChange={setFilterIncomeCategory}>
                  <SelectTrigger className="glass border-white/30 hover:border-white/50">
                    <SelectValue placeholder="Toutes les catégories" />
                  </SelectTrigger>
                  <SelectContent className="glass-card border-white/20">
                    <SelectItem value="all">Toutes les catégories</SelectItem>
                    <SelectItem value="Faible">Faible</SelectItem>
                    <SelectItem value="Moyen">Moyen</SelectItem>
                    <SelectItem value="Élevé">Élevé</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Connaissance Fiscale</label>
                <Select value={filterFiscalKnowledge} onValueChange={setFilterFiscalKnowledge}>
                  <SelectTrigger className="glass border-white/30 hover:border-white/50">
                    <SelectValue placeholder="Tous les niveaux" />
                  </SelectTrigger>
                  <SelectContent className="glass-card border-white/20">
                    <SelectItem value="all">Tous les niveaux</SelectItem>
                    <SelectItem value="Expert">Expert</SelectItem>
                    <SelectItem value="Bonne">Bonne</SelectItem>
                    <SelectItem value="Moyenne">Moyenne</SelectItem>
                    <SelectItem value="Faible">Faible</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex justify-between items-center mt-6 pt-4 border-t border-white/10">
              <div className="text-sm text-muted-foreground">
                {filteredAnalyses.length} client(s) trouvé(s) sur {taxAnalyses.length} au total
              </div>
              <Button
                variant="outline"
                size="sm"
                className="glass border-white/30 hover:glass-card"
              >
                <Download className="h-4 w-4 mr-2" />
                Exporter CSV
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Data Table */}
        <Card className="glass-card border-white/20">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-eparnova-blue" />
              <span>Détail par Client</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="glass border-white/20">
                <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
                <TabsTrigger value="detailed">Analyse détaillée</TabsTrigger>
                <TabsTrigger value="rankings">Classements</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-4 mt-6">
                <div className="rounded-lg border border-white/20 overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-white/5 hover:bg-white/10">
                        <TableHead className="font-semibold">Client</TableHead>
                        <TableHead className="font-semibold text-right">Revenu Fiscal</TableHead>
                        <TableHead className="font-semibold">Option Fiscale</TableHead>
                        <TableHead className="font-semibold text-right">IFI</TableHead>
                        <TableHead className="font-semibold text-right">Déductions</TableHead>
                        <TableHead className="font-semibold">Connaissance</TableHead>
                        <TableHead className="font-semibold text-center">Dispositifs</TableHead>
                        <TableHead className="font-semibold">Catégorie</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredAnalyses.length > 0 ? (
                        filteredAnalyses.map((analysis) => {
                          const taxOptionBadge = getTaxOptionBadge(analysis.tax_option);
                          const knowledgeBadge = getFiscalKnowledgeBadge(analysis.fiscal_knowledge);
                          const categoryBadge = getIncomeCategoryBadge(analysis.income_category);
                          
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
                              <TableCell className="text-right font-medium text-green-600">
                                {formatCurrency(analysis.taxable_income)}
                              </TableCell>
                              <TableCell>
                                <Badge variant={taxOptionBadge.variant as any} className={taxOptionBadge.color}>
                                  {analysis.tax_option}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right font-medium text-red-600">
                                {formatCurrency(analysis.wealth_tax)}
                              </TableCell>
                              <TableCell className="text-right font-medium text-purple-600">
                                {formatCurrency(analysis.total_tax_deductions)}
                              </TableCell>
                              <TableCell>
                                <Badge variant={knowledgeBadge.variant as any} className={knowledgeBadge.color}>
                                  {analysis.fiscal_knowledge}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-center">
                                {analysis.uses_tax_devices ? (
                                  <Tooltip>
                                    <TooltipTrigger>
                                      <CheckCircle className="h-5 w-5 text-green-600 mx-auto" />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>Utilise des dispositifs fiscaux</p>
                                    </TooltipContent>
                                  </Tooltip>
                                ) : (
                                  <Tooltip>
                                    <TooltipTrigger>
                                      <XCircle className="h-5 w-5 text-gray-400 mx-auto" />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>N'utilise pas de dispositifs fiscaux</p>
                                    </TooltipContent>
                                  </Tooltip>
                                )}
                              </TableCell>
                              <TableCell>
                                <Badge variant={categoryBadge.variant as any} className={categoryBadge.color}>
                                  {analysis.income_category}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          );
                        })
                      ) : (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center py-12">
                            <div className="flex flex-col items-center space-y-2">
                              <Receipt className="h-12 w-12 text-muted-foreground opacity-50" />
                              <p className="text-muted-foreground">Aucun résultat trouvé</p>
                              <p className="text-sm text-muted-foreground">Essayez de modifier vos critères de recherche</p>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              <TabsContent value="detailed" className="space-y-4 mt-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="glass border-white/10">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Activity className="h-5 w-5 text-blue-500" />
                        <span>Analyse de l'Efficacité Fiscale</span>
                      </CardTitle>
                      <CardDescription>Ratio déductions/revenus par client</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {filteredAnalyses
                        .filter(a => a.taxable_income > 0)
                        .sort((a, b) => (b.total_tax_deductions / b.taxable_income) - (a.total_tax_deductions / a.taxable_income))
                        .slice(0, 5)
                        .map((analysis, index) => {
                          const ratio = (analysis.total_tax_deductions / analysis.taxable_income) * 100;
                          return (
                            <div key={analysis.user_id} className="flex items-center justify-between p-3 glass rounded-lg">
                              <div className="flex items-center space-x-3">
                                <Badge variant="outline" className="w-8 h-8 rounded-full flex items-center justify-center">
                                  {index + 1}
                                </Badge>
                                <div>
                                  <p className="font-medium">{analysis.first_name} {analysis.last_name}</p>
                                  <p className="text-sm text-muted-foreground">
                                    {formatCurrency(analysis.total_tax_deductions)} / {formatCurrency(analysis.taxable_income)}
                                  </p>
                                </div>
                              </div>
                              <Badge variant={ratio > 10 ? "default" : ratio > 5 ? "secondary" : "outline"}>
                                {ratio.toFixed(1)}%
                              </Badge>
                            </div>
                          );
                        })}
                    </CardContent>
                  </Card>

                  <Card className="glass border-white/10">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Lightbulb className="h-5 w-5 text-yellow-500" />
                        <span>Recommandations</span>
                      </CardTitle>
                      <CardDescription>Suggestions d'optimisation fiscale</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="p-4 glass rounded-lg border-l-4 border-blue-500">
                        <div className="flex items-center space-x-2 mb-2">
                          <Users className="h-4 w-4 text-blue-600" />
                          <h4 className="font-semibold text-blue-800">Clients sans dispositifs</h4>
                        </div>
                        <p className="text-sm text-gray-600">
                          {taxAnalyses.filter(a => !a.uses_tax_devices && a.taxable_income > 50000).length} clients avec revenus élevés pourraient bénéficier de dispositifs fiscaux
                        </p>
                      </div>

                      <div className="p-4 glass rounded-lg border-l-4 border-orange-500">
                        <div className="flex items-center space-x-2 mb-2">
                          <Brain className="h-4 w-4 text-orange-600" />
                          <h4 className="font-semibold text-orange-800">Formation fiscale</h4>
                        </div>
                        <p className="text-sm text-gray-600">
                          {taxAnalyses.filter(a => a.fiscal_knowledge === 'Faible' || a.fiscal_knowledge === 'Moyenne').length} clients pourraient bénéficier d'une formation fiscale
                        </p>
                      </div>

                      <div className="p-4 glass rounded-lg border-l-4 border-green-500">
                        <div className="flex items-center space-x-2 mb-2">
                          <Shield className="h-4 w-4 text-green-600" />
                          <h4 className="font-semibold text-green-800">Optimisation IFI</h4>
                        </div>
                        <p className="text-sm text-gray-600">
                          {usersWithWealth} clients concernés par l'IFI pourraient optimiser leur stratégie patrimoniale
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="rankings" className="space-y-6 mt-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Top Revenus */}
                  <Card className="glass border-white/10">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Award className="h-5 w-5 text-gold-500" />
                        <span>Top 5 Revenus</span>
                      </CardTitle>
                      <CardDescription>Clients avec les revenus fiscaux les plus élevés</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {[...filteredAnalyses]
                        .sort((a, b) => b.taxable_income - a.taxable_income)
                        .slice(0, 5)
                        .map((analysis, index) => (
                          <div key={analysis.user_id} className="flex items-center justify-between p-3 glass rounded-lg">
                            <div className="flex items-center space-x-3">
                              <Badge variant="outline" className="w-8 h-8 rounded-full flex items-center justify-center">
                                {index + 1}
                              </Badge>
                              <div>
                                <p className="font-medium">{analysis.first_name} {analysis.last_name}</p>
                                <p className="text-sm text-muted-foreground">Revenu fiscal</p>
                              </div>
                            </div>
                            <span className="font-bold text-green-600">
                              {formatCurrency(analysis.taxable_income)}
                            </span>
                          </div>
                        ))}
                    </CardContent>
                  </Card>

                  {/* Top Déductions */}
                  <Card className="glass border-white/10">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Star className="h-5 w-5 text-purple-500" />
                        <span>Top 5 Déductions</span>
                      </CardTitle>
                      <CardDescription>Clients avec les déductions fiscales les plus importantes</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {[...filteredAnalyses]
                        .sort((a, b) => b.total_tax_deductions - a.total_tax_deductions)
                        .slice(0, 5)
                        .map((analysis, index) => (
                          <div key={analysis.user_id} className="flex items-center justify-between p-3 glass rounded-lg">
                            <div className="flex items-center space-x-3">
                              <Badge variant="outline" className="w-8 h-8 rounded-full flex items-center justify-center">
                                {index + 1}
                              </Badge>
                              <div>
                                <p className="font-medium">{analysis.first_name} {analysis.last_name}</p>
                                <p className="text-sm text-muted-foreground">Total déductions</p>
                              </div>
                            </div>
                            <span className="font-bold text-purple-600">
                              {formatCurrency(analysis.total_tax_deductions)}
                            </span>
                          </div>
                        ))}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
};

export default TaxAnalysis;