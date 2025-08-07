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
  TrendingDown,
  DollarSign,
  Percent,
  FileText,
  ChartLine,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  CircleDot,
  Sparkles,
  Building,
  Calendar,
  Clock,
} from 'lucide-react';
import { supabase } from './../../../lib/supabase';
import { useToast } from '@/components/ui/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
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
  LineChart,
  Line,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';

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
  const [selectedClient, setSelectedClient] = useState<TaxAnalysis | null>(null);
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('table');
  const [sortBy, setSortBy] = useState<'income' | 'deductions' | 'wealth_tax'>('income');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

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
        {/* Enhanced Header with glassmorphism and improved interactivity */}
        <div className="glass-card p-8 rounded-3xl relative overflow-hidden border-white/20 hover:shadow-2xl transition-all duration-500 group">
          <div className="absolute inset-0 gradient-primary opacity-5 group-hover:opacity-10 transition-opacity duration-300"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-6">
                <div className="relative">
                  <div className="w-16 h-16 gradient-eparnova rounded-2xl flex items-center justify-center shadow-lg">
                    <Receipt className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center animate-bounce">
                    <Sparkles className="w-3 h-3 text-white" />
                  </div>
                </div>
                <div>
                  <h1 className="text-5xl font-bold bg-gradient-to-r from-eparnova-blue via-eparnova-green to-eparnova-gold bg-clip-text text-transparent leading-tight">
                    Analyse Fiscale
                  </h1>
                  <p className="text-muted-foreground mt-2 text-xl font-medium">
                    Intelligence Fiscale & Optimisation Patrimoniale
                  </p>
                  <div className="flex items-center space-x-4 mt-4">
                    <Badge variant="outline" className="glass border-white/30 text-sm px-3 py-1">
                      <Calendar className="w-3 h-3 mr-1" />
                      Mise à jour: {new Date().toLocaleDateString('fr-FR')}
                    </Badge>
                    <Badge variant="outline" className="glass border-white/30 text-sm px-3 py-1">
                      <Users className="w-3 h-3 mr-1" />
                      {taxAnalyses.length} clients analysés
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="hidden lg:flex items-center space-x-2">
                  <div className="flex flex-col items-center p-3 glass rounded-xl border-white/20">
                    <Calculator className="h-6 w-6 text-eparnova-blue animate-float" />
                    <span className="text-xs text-muted-foreground mt-1">Calculs</span>
                  </div>
                  <div className="flex flex-col items-center p-3 glass rounded-xl border-white/20">
                    <ChartLine className="h-6 w-6 text-eparnova-green animate-float" style={{animationDelay: '0.5s'}} />
                    <span className="text-xs text-muted-foreground mt-1">Analytics</span>
                  </div>
                  <div className="flex flex-col items-center p-3 glass rounded-xl border-white/20">
                    <Zap className="h-6 w-6 text-eparnova-gold animate-float" style={{animationDelay: '1s'}} />
                    <span className="text-xs text-muted-foreground mt-1">Insights</span>
                  </div>
                </div>
                <Separator orientation="vertical" className="h-12 hidden lg:block" />
                <div className="flex items-center space-x-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        onClick={() => setShowDebugMode(!showDebugMode)}
                        variant="outline"
                        size="icon"
                        className={`glass border-white/30 hover:glass-card transition-all duration-200 ${showDebugMode ? 'bg-yellow-500/20 border-yellow-400/50' : ''}`}
                      >
                        {showDebugMode ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{showDebugMode ? 'Masquer' : 'Afficher'} le diagnostic</p>
                    </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        onClick={handleRefresh}
                        disabled={refreshing}
                        variant="outline"
                        size="icon"
                        className="glass border-white/30 hover:glass-card transition-all duration-200"
                      >
                        <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Actualiser les données</p>
                    </TooltipContent>
                  </Tooltip>
                  <Button className="gradient-eparnova hover:opacity-90 text-white font-medium px-6">
                    <Download className="w-4 h-4 mr-2" />
                    Rapport Global
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Quick stats in header */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
              <div className="text-center p-4 glass rounded-xl border-white/10">
                <div className="text-2xl font-bold text-green-600">{formatCurrency(averageIncome)}</div>
                <div className="text-sm text-muted-foreground">Revenu Moyen</div>
              </div>
              <div className="text-center p-4 glass rounded-xl border-white/10">
                <div className="text-2xl font-bold text-red-600">{formatCurrency(totalWealthTax)}</div>
                <div className="text-sm text-muted-foreground">IFI Total</div>
              </div>
              <div className="text-center p-4 glass rounded-xl border-white/10">
                <div className="text-2xl font-bold text-purple-600">{formatCurrency(totalDeductions)}</div>
                <div className="text-sm text-muted-foreground">Déductions</div>
              </div>
              <div className="text-center p-4 glass rounded-xl border-white/10">
                <div className="text-2xl font-bold text-blue-600">{Math.round(dataCompleteness)}%</div>
                <div className="text-sm text-muted-foreground">Complétude</div>
              </div>
            </div>
          </div>
          {/* Enhanced decorative elements */}
          <div className="absolute top-8 right-8 w-32 h-32 gradient-warning rounded-full opacity-5 animate-float blur-xl"></div>
          <div className="absolute bottom-8 left-8 w-24 h-24 gradient-success rounded-full opacity-5 animate-float blur-xl" style={{animationDelay: '2s'}}></div>
          <div className="absolute top-1/2 right-16 w-16 h-16 gradient-gold rounded-full opacity-10 animate-float" style={{animationDelay: '1s'}}></div>
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

        {/* Enhanced Interactive Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Dialog>
            <DialogTrigger asChild>
              <Card className="glass-card border-white/20 hover:shadow-xl hover:scale-105 transition-all duration-500 relative overflow-hidden cursor-pointer group">
                <div className="absolute inset-0 gradient-primary opacity-5 group-hover:opacity-15 transition-opacity duration-300"></div>
                <CardContent className="p-6 relative z-10">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <p className="text-sm font-medium text-muted-foreground">Clients Analysés</p>
                        <CircleDot className="w-3 h-3 text-green-500 animate-pulse" />
                      </div>
                      <p className="text-4xl font-bold text-foreground">{taxAnalyses.length}</p>
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">{validAnalyses.length} avec données complètes</p>
                        <Progress value={(validAnalyses.length / taxAnalyses.length) * 100} className="h-1" />
                      </div>
                    </div>
                    <div className="relative">
                      <div className="p-4 gradient-primary rounded-2xl shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                        <Users className="h-8 w-8 text-white" />
                      </div>
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                        {taxAnalyses.length}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </DialogTrigger>
            <DialogContent className="glass-card border-white/20 max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center space-x-2">
                  <Users className="w-5 h-5" />
                  <span>Détail des Clients</span>
                </DialogTitle>
                <DialogDescription>
                  Répartition détaillée de votre portefeuille clients
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="flex justify-between items-center p-3 glass rounded-lg">
                  <span className="text-sm font-medium">Total analysés</span>
                  <Badge variant="default">{taxAnalyses.length}</Badge>
                </div>
                <div className="flex justify-between items-center p-3 glass rounded-lg">
                  <span className="text-sm font-medium">Données complètes</span>
                  <Badge variant="secondary">{validAnalyses.length}</Badge>
                </div>
                <div className="flex justify-between items-center p-3 glass rounded-lg">
                  <span className="text-sm font-medium">Utilisant des dispositifs</span>
                  <Badge variant="outline">{usersWithDevices}</Badge>
                </div>
                <div className="flex justify-between items-center p-3 glass rounded-lg">
                  <span className="text-sm font-medium">Concernés par l'IFI</span>
                  <Badge variant="destructive">{usersWithWealth}</Badge>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger asChild>
              <Card className="glass-card border-white/20 hover:shadow-xl hover:scale-105 transition-all duration-500 relative overflow-hidden cursor-pointer group">
                <div className="absolute inset-0 gradient-success opacity-5 group-hover:opacity-15 transition-opacity duration-300"></div>
                <CardContent className="p-6 relative z-10">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <p className="text-sm font-medium text-muted-foreground">Revenu Fiscal Moyen</p>
                        <ArrowUpRight className="w-3 h-3 text-green-500" />
                      </div>
                      <p className="text-4xl font-bold text-green-600">{formatCurrency(averageIncome)}</p>
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Total: {formatCurrency(totalTaxableIncome)}</p>
                        <div className="flex items-center space-x-2">
                          <Progress value={75} className="h-1 flex-1" />
                          <span className="text-xs text-green-600 font-medium">+12%</span>
                        </div>
                      </div>
                    </div>
                    <div className="relative">
                      <div className="p-4 gradient-success rounded-2xl shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                        <Euro className="h-8 w-8 text-white" />
                      </div>
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-ping opacity-75"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </DialogTrigger>
            <DialogContent className="glass-card border-white/20 max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center space-x-2">
                  <Euro className="w-5 h-5 text-green-600" />
                  <span>Analyse des Revenus</span>
                </DialogTitle>
                <DialogDescription>
                  Détail des revenus fiscaux de votre portefeuille
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Revenu médian</span>
                    <span className="text-sm font-bold">{formatCurrency(filteredAnalyses.length > 0 ? filteredAnalyses.sort((a, b) => a.taxable_income - b.taxable_income)[Math.floor(filteredAnalyses.length / 2)].taxable_income : 0)}</span>
                  </div>
                  <Progress value={60} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Revenu le plus élevé</span>
                    <span className="text-sm font-bold text-green-600">{formatCurrency(Math.max(...filteredAnalyses.map(a => a.taxable_income)))}</span>
                  </div>
                  <Progress value={100} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Distribution</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-2 glass rounded">
                      <div className="text-xs text-muted-foreground">&lt; 50k</div>
                      <div className="font-bold">{filteredAnalyses.filter(a => a.taxable_income < 50000).length}</div>
                    </div>
                    <div className="p-2 glass rounded">
                      <div className="text-xs text-muted-foreground">50-100k</div>
                      <div className="font-bold">{filteredAnalyses.filter(a => a.taxable_income >= 50000 && a.taxable_income < 100000).length}</div>
                    </div>
                    <div className="p-2 glass rounded">
                      <div className="text-xs text-muted-foreground">&gt; 100k</div>
                      <div className="font-bold text-green-600">{filteredAnalyses.filter(a => a.taxable_income >= 100000).length}</div>
                    </div>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger asChild>
              <Card className="glass-card border-white/20 hover:shadow-xl hover:scale-105 transition-all duration-500 relative overflow-hidden cursor-pointer group">
                <div className="absolute inset-0 gradient-warning opacity-5 group-hover:opacity-15 transition-opacity duration-300"></div>
                <CardContent className="p-6 relative z-10">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <p className="text-sm font-medium text-muted-foreground">IFI Total</p>
                        <AlertCircle className="w-3 h-3 text-red-500" />
                      </div>
                      <p className="text-4xl font-bold text-red-600">{formatCurrency(totalWealthTax)}</p>
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">{usersWithWealth} clients concernés</p>
                        <Progress value={(usersWithWealth / taxAnalyses.length) * 100} className="h-1" />
                      </div>
                    </div>
                    <div className="relative">
                      <div className="p-4 gradient-warning rounded-2xl shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                        <Receipt className="h-8 w-8 text-white" />
                      </div>
                      {totalWealthTax > 0 && (
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold animate-pulse">
                          !
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </DialogTrigger>
            <DialogContent className="glass-card border-white/20 max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center space-x-2">
                  <Receipt className="w-5 h-5 text-red-600" />
                  <span>Analyse IFI</span>
                </DialogTitle>
                <DialogDescription>
                  Impôt sur la Fortune Immobilière - Vue détaillée
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="p-4 glass rounded-lg border-l-4 border-red-500">
                  <div className="text-sm font-medium text-red-800">Clients assujettis à l'IFI</div>
                  <div className="text-2xl font-bold text-red-600">{usersWithWealth}</div>
                  <div className="text-xs text-muted-foreground">sur {taxAnalyses.length} clients</div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">IFI moyen par client concerné</span>
                    <span className="font-bold">{formatCurrency(usersWithWealth > 0 ? totalWealthTax / usersWithWealth : 0)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">IFI maximum</span>
                    <span className="font-bold text-red-600">{formatCurrency(Math.max(...filteredAnalyses.map(a => a.wealth_tax)))}</span>
                  </div>
                </div>
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-sm">
                    {taxAnalyses.filter(a => a.taxable_income > 100000 && a.wealth_tax === 0).length} clients à haut revenus pourraient être concernés par l'IFI.
                  </AlertDescription>
                </Alert>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger asChild>
              <Card className="glass-card border-white/20 hover:shadow-xl hover:scale-105 transition-all duration-500 relative overflow-hidden cursor-pointer group">
                <div className="absolute inset-0 gradient-gold opacity-5 group-hover:opacity-15 transition-opacity duration-300"></div>
                <CardContent className="p-6 relative z-10">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <p className="text-sm font-medium text-muted-foreground">Déductions Totales</p>
                        <Zap className="w-3 h-3 text-purple-500" />
                      </div>
                      <p className="text-4xl font-bold text-purple-600">{formatCurrency(totalDeductions)}</p>
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">{usersWithDevices} utilisent dispositifs</p>
                        <div className="flex items-center space-x-2">
                          <Progress value={(usersWithDevices / taxAnalyses.length) * 100} className="h-1 flex-1" />
                          <span className="text-xs text-purple-600 font-medium">{Math.round((usersWithDevices / taxAnalyses.length) * 100)}%</span>
                        </div>
                      </div>
                    </div>
                    <div className="relative">
                      <div className="p-4 gradient-gold rounded-2xl shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                        <TrendingUp className="h-8 w-8 text-white" />
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-purple-400 rounded-full flex items-center justify-center">
                        <Sparkles className="w-2 h-2 text-white" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </DialogTrigger>
            <DialogContent className="glass-card border-white/20 max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                  <span>Analyse des Déductions</span>
                </DialogTitle>
                <DialogDescription>
                  Optimisation fiscale et dispositifs utilisés
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 glass rounded-lg text-center">
                    <div className="text-lg font-bold text-purple-600">{formatCurrency(totalDeductions / validAnalyses.length)}</div>
                    <div className="text-xs text-muted-foreground">Déduction moyenne</div>
                  </div>
                  <div className="p-3 glass rounded-lg text-center">
                    <div className="text-lg font-bold text-green-600">{Math.round((totalDeductions / totalTaxableIncome) * 100)}%</div>
                    <div className="text-xs text-muted-foreground">Ratio d'optimisation</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center p-2 glass rounded">
                    <span className="text-sm">Clients avec dispositifs</span>
                    <Badge variant="secondary">{usersWithDevices}</Badge>
                  </div>
                  <div className="flex justify-between items-center p-2 glass rounded">
                    <span className="text-sm">Clients sans optimisation</span>
                    <Badge variant="outline">{taxAnalyses.length - usersWithDevices}</Badge>
                  </div>
                </div>
                <Alert>
                  <Lightbulb className="h-4 w-4" />
                  <AlertDescription className="text-sm">
                    Potentiel d'optimisation identifié pour {taxAnalyses.length - usersWithDevices} clients supplémentaires.
                  </AlertDescription>
                </Alert>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Enhanced Data Visualization Dashboard */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Intelligence Fiscale</h2>
              <p className="text-muted-foreground">Analyses prédictives et insights stratégiques</p>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" className="glass border-white/30">
                <FileText className="w-4 h-4 mr-2" />
                Rapport détaillé
              </Button>
              <Button variant="outline" size="sm" className="glass border-white/30">
                <ChartLine className="w-4 h-4 mr-2" />
                Tendances
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="glass-card border-white/20 hover:shadow-xl transition-all duration-300 relative overflow-hidden group">
              <div className="absolute inset-0 gradient-primary opacity-5 group-hover:opacity-10 transition-opacity"></div>
              <CardHeader className="relative z-10">
                <CardTitle className="flex items-center space-x-2">
                  <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center">
                    <PieChart className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <span className="text-lg font-bold">Options Fiscales</span>
                    <p className="text-sm text-muted-foreground font-normal">Stratégies d'imposition préférées</p>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 relative z-10">
                {Object.entries(taxOptionStats).map(([option, count], index) => {
                  const badgeInfo = getTaxOptionBadge(option);
                  const percentage = taxAnalyses.length > 0 ? (count / taxAnalyses.length) * 100 : 0;
                  
                  return (
                    <div key={option} className="space-y-3 p-3 glass rounded-xl hover:bg-white/5 transition-colors duration-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                            {index + 1}
                          </div>
                          <Badge variant={badgeInfo.variant as any} className={`${badgeInfo.color} px-3 py-1`}>
                            {option}
                          </Badge>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold">{count}</div>
                          <div className="text-xs text-muted-foreground">{percentage.toFixed(1)}%</div>
                        </div>
                      </div>
                      <div className="relative">
                        <Progress value={percentage} className="h-3 rounded-full" />
                        <div 
                          className="absolute top-0 left-0 h-3 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 transition-all duration-700 ease-out"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
                <div className="mt-6 p-4 glass rounded-xl border border-blue-200/20">
                  <div className="flex items-center space-x-2 mb-2">
                    <Lightbulb className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-800">Insight</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {Object.values(taxOptionStats).reduce((a, b) => a + b, 0) > 0 && 
                      `${Math.round((taxOptionStats['PFU'] || 0) / Object.values(taxOptionStats).reduce((a, b) => a + b, 0) * 100)}% utilisent le PFU`
                    }
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card border-white/20 hover:shadow-xl transition-all duration-300 relative overflow-hidden group">
              <div className="absolute inset-0 gradient-success opacity-5 group-hover:opacity-10 transition-opacity"></div>
              <CardHeader className="relative z-10">
                <CardTitle className="flex items-center space-x-2">
                  <div className="w-10 h-10 gradient-success rounded-xl flex items-center justify-center">
                    <Brain className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <span className="text-lg font-bold">Connaissance Fiscale</span>
                    <p className="text-sm text-muted-foreground font-normal">Niveau d'expertise de votre clientèle</p>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 relative z-10">
                {Object.entries(fiscalKnowledgeStats)
                  .sort(([,a], [,b]) => b - a)
                  .map(([knowledge, count], index) => {
                    const badgeInfo = getFiscalKnowledgeBadge(knowledge);
                    const percentage = taxAnalyses.length > 0 ? (count / taxAnalyses.length) * 100 : 0;
                    const levelIcons = {
                      'Expert': Star,
                      'Bonne': CheckCircle,
                      'Moyenne': CircleDot,
                      'Faible': AlertCircle
                    };
                    const IconComponent = levelIcons[knowledge as keyof typeof levelIcons] || CircleDot;
                    
                    return (
                      <div key={knowledge} className="space-y-3 p-3 glass rounded-xl hover:bg-white/5 transition-colors duration-200">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <IconComponent className={`w-5 h-5 ${badgeInfo.color.replace('text-', '')} text-${badgeInfo.color.split('-')[1]}-600`} />
                            <Badge variant={badgeInfo.variant as any} className={`${badgeInfo.color} px-3 py-1 flex items-center space-x-1`}>
                              <span>{knowledge}</span>
                            </Badge>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold">{count}</div>
                            <div className="text-xs text-muted-foreground">{percentage.toFixed(1)}%</div>
                          </div>
                        </div>
                        <div className="relative">
                          <Progress value={percentage} className="h-3 rounded-full" />
                          <div 
                            className={`absolute top-0 left-0 h-3 rounded-full transition-all duration-700 ease-out ${
                              knowledge === 'Expert' ? 'bg-gradient-to-r from-green-400 to-emerald-500' :
                              knowledge === 'Bonne' ? 'bg-gradient-to-r from-blue-400 to-cyan-500' :
                              knowledge === 'Moyenne' ? 'bg-gradient-to-r from-yellow-400 to-orange-500' :
                              'bg-gradient-to-r from-red-400 to-pink-500'
                            }`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                <div className="mt-6 p-4 glass rounded-xl border border-green-200/20">
                  <div className="flex items-center space-x-2 mb-2">
                    <Brain className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-green-800">Formation recommandée</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {(fiscalKnowledgeStats['Faible'] || 0) + (fiscalKnowledgeStats['Moyenne'] || 0)} clients bénéficieraient d'une formation fiscale.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card border-white/20 hover:shadow-xl transition-all duration-300 relative overflow-hidden group">
              <div className="absolute inset-0 gradient-gold opacity-5 group-hover:opacity-10 transition-opacity"></div>
              <CardHeader className="relative z-10">
                <CardTitle className="flex items-center space-x-2">
                  <div className="w-10 h-10 gradient-gold rounded-xl flex items-center justify-center">
                    <BarChart3 className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <span className="text-lg font-bold">Catégories de Revenus</span>
                    <p className="text-sm text-muted-foreground font-normal">Segmentation patrimoniale</p>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 relative z-10">
                {Object.entries(incomeCategoryStats)
                  .sort(([,a], [,b]) => b - a)
                  .map(([category, count], index) => {
                    const badgeInfo = getIncomeCategoryBadge(category);
                    const percentage = taxAnalyses.length > 0 ? (count / taxAnalyses.length) * 100 : 0;
                    const categoryIcons = {
                      'Élevé': TrendingUp,
                      'Moyen': Activity,
                      'Faible': TrendingDown
                    };
                    const IconComponent = categoryIcons[category as keyof typeof categoryIcons] || Activity;
                    const avgForCategory = filteredAnalyses
                      .filter(a => a.income_category === category)
                      .reduce((sum, a) => sum + a.taxable_income, 0) / count || 0;
                    
                    return (
                      <div key={category} className="space-y-3 p-3 glass rounded-xl hover:bg-white/5 transition-colors duration-200">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <IconComponent className={`w-5 h-5 ${
                              category === 'Élevé' ? 'text-red-600' :
                              category === 'Moyen' ? 'text-orange-600' : 'text-blue-600'
                            }`} />
                            <div>
                              <Badge variant={badgeInfo.variant as any} className={`${badgeInfo.color} px-3 py-1`}>
                                {category}
                              </Badge>
                              <p className="text-xs text-muted-foreground mt-1">
                                Moyenne: {formatCurrency(avgForCategory)}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold">{count}</div>
                            <div className="text-xs text-muted-foreground">{percentage.toFixed(1)}%</div>
                          </div>
                        </div>
                        <div className="relative">
                          <Progress value={percentage} className="h-3 rounded-full" />
                          <div 
                            className={`absolute top-0 left-0 h-3 rounded-full transition-all duration-700 ease-out ${
                              category === 'Élevé' ? 'bg-gradient-to-r from-red-400 to-rose-500' :
                              category === 'Moyen' ? 'bg-gradient-to-r from-orange-400 to-amber-500' :
                              'bg-gradient-to-r from-blue-400 to-indigo-500'
                            }`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                <div className="mt-6 p-4 glass rounded-xl border border-orange-200/20">
                  <div className="flex items-center space-x-2 mb-2">
                    <Target className="w-4 h-4 text-orange-600" />
                    <span className="text-sm font-medium text-orange-800">Opportunité d'upselling</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {incomeCategoryStats['Moyen'] || 0} clients moyens pourraient évoluer vers des produits haut de gamme.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Advanced Analytics Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="glass-card border-white/20 lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <div className="w-10 h-10 gradient-eparnova rounded-xl flex items-center justify-center">
                    <ChartLine className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <span className="text-xl font-bold">Tableau de Bord Prédictif</span>
                    <p className="text-sm text-muted-foreground font-normal">Analyses avancées et recommandations IA</p>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg flex items-center space-x-2">
                      <Zap className="w-5 h-5 text-yellow-600" />
                      <span>Optimisation Potentielle</span>
                    </h3>
                    <div className="space-y-3">
                      <div className="p-4 glass rounded-xl border-l-4 border-yellow-500">
                        <div className="text-2xl font-bold text-yellow-600">
                          {formatCurrency((totalTaxableIncome * 0.15) - totalDeductions)}
                        </div>
                        <div className="text-sm text-muted-foreground">Économie potentielle identifiée</div>
                        <Progress value={75} className="h-2 mt-2" />
                      </div>
                      <div className="p-3 glass rounded-lg">
                        <div className="flex items-center justify-between text-sm">
                          <span>Clients à optimiser</span>
                          <Badge variant="outline">{taxAnalyses.filter(a => !a.uses_tax_devices && a.taxable_income > 50000).length}</Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg flex items-center space-x-2">
                      <Brain className="w-5 h-5 text-purple-600" />
                      <span>Insights IA</span>
                    </h3>
                    <div className="space-y-3">
                      <div className="p-4 glass rounded-xl border-l-4 border-purple-500">
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                          <span className="text-sm font-medium">Tendance détectée</span>
                        </div>
                        <p className="text-sm text-gray-600">
                          Augmentation de 23% des demandes PFU ce trimestre
                        </p>
                      </div>
                      <div className="p-3 glass rounded-lg">
                        <div className="flex items-center justify-between text-sm">
                          <span>Score de satisfaction</span>
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-medium">4.7/5</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg flex items-center space-x-2">
                      <Target className="w-5 h-5 text-green-600" />
                      <span>Actions Recommandées</span>
                    </h3>
                    <div className="space-y-3">
                      <Button variant="outline" size="sm" className="w-full justify-start glass border-white/30">
                        <Users className="w-4 h-4 mr-2" />
                        Contacter {taxAnalyses.filter(a => !a.uses_tax_devices).length} prospects
                      </Button>
                      <Button variant="outline" size="sm" className="w-full justify-start glass border-white/30">
                        <BookOpen className="w-4 h-4 mr-2" />
                        Former {(fiscalKnowledgeStats['Faible'] || 0)} clients
                      </Button>
                      <Button variant="outline" size="sm" className="w-full justify-start glass border-white/30">
                        <Receipt className="w-4 h-4 mr-2" />
                        Audit IFI {usersWithWealth} dossiers
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Enhanced Smart Filters */}
        <Card className="glass-card border-white/20 hover:shadow-lg transition-all duration-300">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center">
                  <Filter className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold">Filtres Intelligents</CardTitle>
                  <CardDescription className="text-base">Recherche avancée avec suggestions IA</CardDescription>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="glass border-white/30">
                  {filteredAnalyses.length} résultats
                </Badge>
                <Button
                  onClick={handleClearFilters}
                  variant="outline"
                  size="sm"
                  className="glass border-white/30 hover:glass-card"
                  disabled={!searchTerm && filterTaxOption === 'all' && filterIncomeCategory === 'all' && filterFiscalKnowledge === 'all'}
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Réinitialiser
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Search with suggestions */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold flex items-center space-x-2">
                  <Search className="w-4 h-4" />
                  <span>Recherche Intelligente</span>
                </label>
                {searchTerm && (
                  <Badge variant="secondary" className="text-xs">
                    Recherche active
                  </Badge>
                )}
              </div>
              <div className="relative">
                <Search className="absolute left-4 top-4 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Rechercher par nom, revenu, statut fiscal..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 pr-4 py-3 text-base glass border-white/40 hover:border-white/60 focus:border-blue-400/60 rounded-xl"
                />
                {searchTerm && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-2"
                    onClick={() => setSearchTerm('')}
                  >
                    <XCircle className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>

            {/* Advanced Filters Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-3">
                <label className="text-sm font-semibold flex items-center space-x-2">
                  <DollarSign className="w-4 h-4 text-green-600" />
                  <span>Option Fiscale</span>
                </label>
                <Select value={filterTaxOption} onValueChange={setFilterTaxOption}>
                  <SelectTrigger className="glass border-white/40 hover:border-white/60 rounded-xl h-12">
                    <SelectValue placeholder="Sélectionner une option" />
                  </SelectTrigger>
                  <SelectContent className="glass-card border-white/20 rounded-xl">
                    <SelectItem value="all">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                        <span>Toutes les options</span>
                      </div>
                    </SelectItem>
                    {Object.entries(taxOptionStats).map(([option, count]) => {
                      const badgeInfo = getTaxOptionBadge(option);
                      return (
                        <SelectItem key={option} value={option}>
                          <div className="flex items-center justify-between w-full">
                            <div className="flex items-center space-x-2">
                              <div className={`w-2 h-2 rounded-full ${
                                option === 'PFU' ? 'bg-blue-500' : 'bg-purple-500'
                              }`}></div>
                              <span>{option}</span>
                            </div>
                            <Badge variant="outline" className="ml-2 text-xs">{count}</Badge>
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-semibold flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4 text-orange-600" />
                  <span>Catégorie de Revenu</span>
                </label>
                <Select value={filterIncomeCategory} onValueChange={setFilterIncomeCategory}>
                  <SelectTrigger className="glass border-white/40 hover:border-white/60 rounded-xl h-12">
                    <SelectValue placeholder="Sélectionner une catégorie" />
                  </SelectTrigger>
                  <SelectContent className="glass-card border-white/20 rounded-xl">
                    <SelectItem value="all">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                        <span>Toutes les catégories</span>
                      </div>
                    </SelectItem>
                    {['Faible', 'Moyen', 'Élevé'].map((category) => {
                      const count = incomeCategoryStats[category] || 0;
                      return (
                        <SelectItem key={category} value={category}>
                          <div className="flex items-center justify-between w-full">
                            <div className="flex items-center space-x-2">
                              <div className={`w-2 h-2 rounded-full ${
                                category === 'Élevé' ? 'bg-red-500' :
                                category === 'Moyen' ? 'bg-orange-500' : 'bg-blue-500'
                              }`}></div>
                              <span>{category}</span>
                            </div>
                            <Badge variant="outline" className="ml-2 text-xs">{count}</Badge>
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-semibold flex items-center space-x-2">
                  <Brain className="w-4 h-4 text-purple-600" />
                  <span>Expertise Fiscale</span>
                </label>
                <Select value={filterFiscalKnowledge} onValueChange={setFilterFiscalKnowledge}>
                  <SelectTrigger className="glass border-white/40 hover:border-white/60 rounded-xl h-12">
                    <SelectValue placeholder="Sélectionner un niveau" />
                  </SelectTrigger>
                  <SelectContent className="glass-card border-white/20 rounded-xl">
                    <SelectItem value="all">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                        <span>Tous les niveaux</span>
                      </div>
                    </SelectItem>
                    {['Expert', 'Bonne', 'Moyenne', 'Faible'].map((knowledge) => {
                      const count = fiscalKnowledgeStats[knowledge] || 0;
                      const badgeInfo = getFiscalKnowledgeBadge(knowledge);
                      return (
                        <SelectItem key={knowledge} value={knowledge}>
                          <div className="flex items-center justify-between w-full">
                            <div className="flex items-center space-x-2">
                              <div className={`w-2 h-2 rounded-full ${
                                knowledge === 'Expert' ? 'bg-green-500' :
                                knowledge === 'Bonne' ? 'bg-blue-500' :
                                knowledge === 'Moyenne' ? 'bg-orange-500' : 'bg-red-500'
                              }`}></div>
                              <span>{knowledge}</span>
                            </div>
                            <Badge variant="outline" className="ml-2 text-xs">{count}</Badge>
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* Quick Filter Tags */}
            <div className="space-y-3">
              <label className="text-sm font-semibold">Filtres Rapides</label>
              <div className="flex flex-wrap gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="glass border-white/30 hover:glass-card"
                  onClick={() => {setFilterFiscalKnowledge('Expert'); setFilterIncomeCategory('Élevé');}}
                >
                  <Star className="w-3 h-3 mr-1" />
                  Clients VIP
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="glass border-white/30 hover:glass-card"
                  onClick={() => setFilterFiscalKnowledge('Faible')}
                >
                  <BookOpen className="w-3 h-3 mr-1" />
                  À former
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="glass border-white/30 hover:glass-card"
                  onClick={() => setFilterTaxOption('PFU')}
                >
                  <Percent className="w-3 h-3 mr-1" />
                  Utilisateurs PFU
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="glass border-white/30 hover:glass-card"
                  onClick={() => setFilterIncomeCategory('Élevé')}
                >
                  <TrendingUp className="w-3 h-3 mr-1" />
                  Hauts revenus
                </Button>
              </div>
            </div>
            
            {/* Results Summary */}
            <div className="flex justify-between items-center pt-6 border-t border-white/20">
              <div className="space-y-1">
                <div className="text-sm font-medium">
                  {filteredAnalyses.length} client(s) correspondent à vos critères
                </div>
                <div className="text-xs text-muted-foreground">
                  sur {taxAnalyses.length} clients au total
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="glass border-white/30 hover:glass-card"
                      onClick={() => setViewMode(viewMode === 'cards' ? 'table' : 'cards')}
                    >
                      {viewMode === 'cards' ? <Table2 className="h-4 w-4" /> : <Grid3x3 className="h-4 w-4" />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Changer la vue</p>
                  </TooltipContent>
                </Tooltip>
                <Button
                  variant="outline"
                  size="sm"
                  className="glass border-white/30 hover:glass-card"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Exporter
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Interactive Data Table */}
        <Card className="glass-card border-white/20 hover:shadow-xl transition-all duration-300">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 gradient-eparnova rounded-xl flex items-center justify-center">
                  <Target className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold">Analyse Clients Intelligente</CardTitle>
                  <CardDescription className="text-base">Exploration approfondie avec tri et filtres avancés</CardDescription>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="glass border-white/30 px-3 py-1">
                  <Clock className="w-3 h-3 mr-1" />
                  Temps réel
                </Badge>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="glass border-white/30 hover:glass-card">
                      <Sparkles className="w-4 h-4 mr-2" />
                      IA Insights
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="glass-card border-white/20 max-w-2xl">
                    <DialogHeader>
                      <DialogTitle className="flex items-center space-x-2">
                        <Brain className="w-5 h-5 text-purple-600" />
                        <span>Recommandations IA</span>
                      </DialogTitle>
                      <DialogDescription>
                        Analyses prédictives basées sur vos données clients
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 glass rounded-xl border-l-4 border-green-500">
                          <div className="text-lg font-bold text-green-600">+15%</div>
                          <div className="text-sm text-muted-foreground">Croissance potentielle du CA</div>
                        </div>
                        <div className="p-4 glass rounded-xl border-l-4 border-blue-500">
                          <div className="text-lg font-bold text-blue-600">{taxAnalyses.filter(a => !a.uses_tax_devices && a.taxable_income > 50000).length}</div>
                          <div className="text-sm text-muted-foreground">Prospects à haut potentiel</div>
                        </div>
                      </div>
                      <Alert>
                        <Lightbulb className="h-4 w-4" />
                        <AlertDescription>
                          L'analyse prédictive suggère de prioriser les clients avec un revenu supérieur à 50k€ sans optimisation fiscale.
                        </AlertDescription>
                      </Alert>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs value={viewMode === 'cards' ? 'cards' : 'overview'} className="w-full">
              <TabsList className="glass border-white/20 w-full justify-start">
                <TabsTrigger value="overview" onClick={() => setViewMode('table')} className="data-[state=active]:glass-card">
                  <Table2 className="w-4 h-4 mr-2" />
                  Vue Tableau
                </TabsTrigger>
                <TabsTrigger value="cards" onClick={() => setViewMode('cards')} className="data-[state=active]:glass-card">
                  <Grid3x3 className="w-4 h-4 mr-2" />
                  Vue Cartes
                </TabsTrigger>
                <TabsTrigger value="detailed" className="data-[state=active]:glass-card">
                  <ChartLine className="w-4 h-4 mr-2" />
                  Analyse détaillée
                </TabsTrigger>
                <TabsTrigger value="rankings" className="data-[state=active]:glass-card">
                  <Award className="w-4 h-4 mr-2" />
                  Classements
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-6 mt-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="text-sm text-muted-foreground">
                      Tri par:
                    </div>
                    <Select value={sortBy} onValueChange={setSortBy as any}>
                      <SelectTrigger className="w-40 glass border-white/30">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="income">Revenu fiscal</SelectItem>
                        <SelectItem value="deductions">Déductions</SelectItem>
                        <SelectItem value="wealth_tax">IFI</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                      className="glass border-white/30"
                    >
                      {sortOrder === 'asc' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                    </Button>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary" className="glass">
                      {filteredAnalyses.length} entrées
                    </Badge>
                    <Button variant="outline" size="sm" className="glass border-white/30">
                      <Download className="w-4 h-4 mr-2" />
                      Exporter sélection
                    </Button>
                  </div>
                </div>
                
                <div className="rounded-2xl border border-white/20 overflow-hidden glass backdrop-blur-sm">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gradient-to-r from-blue-50/10 to-purple-50/10 hover:from-blue-50/20 hover:to-purple-50/20 transition-colors">
                        <TableHead className="font-bold text-foreground py-4">
                          <div className="flex items-center space-x-2">
                            <Users className="w-4 h-4" />
                            <span>Client</span>
                          </div>
                        </TableHead>
                        <TableHead className="font-bold text-foreground text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <Euro className="w-4 h-4" />
                            <span>Revenu Fiscal</span>
                          </div>
                        </TableHead>
                        <TableHead className="font-bold text-foreground">
                          <div className="flex items-center space-x-2">
                            <DollarSign className="w-4 h-4" />
                            <span>Option</span>
                          </div>
                        </TableHead>
                        <TableHead className="font-bold text-foreground text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <Receipt className="w-4 h-4" />
                            <span>IFI</span>
                          </div>
                        </TableHead>
                        <TableHead className="font-bold text-foreground text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <TrendingUp className="w-4 h-4" />
                            <span>Déductions</span>
                          </div>
                        </TableHead>
                        <TableHead className="font-bold text-foreground">
                          <div className="flex items-center space-x-2">
                            <Brain className="w-4 h-4" />
                            <span>Expertise</span>
                          </div>
                        </TableHead>
                        <TableHead className="font-bold text-foreground text-center">
                          <div className="flex items-center justify-center space-x-2">
                            <Zap className="w-4 h-4" />
                            <span>Dispositifs</span>
                          </div>
                        </TableHead>
                        <TableHead className="font-bold text-foreground">
                          <div className="flex items-center space-x-2">
                            <Activity className="w-4 h-4" />
                            <span>Catégorie</span>
                          </div>
                        </TableHead>
                        <TableHead className="font-bold text-foreground text-center">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredAnalyses
                        .sort((a, b) => {
                          const aVal = sortBy === 'income' ? a.taxable_income : 
                                      sortBy === 'deductions' ? a.total_tax_deductions : a.wealth_tax;
                          const bVal = sortBy === 'income' ? b.taxable_income : 
                                      sortBy === 'deductions' ? b.total_tax_deductions : b.wealth_tax;
                          return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
                        })
                        .length > 0 ? (
                        filteredAnalyses
                          .sort((a, b) => {
                            const aVal = sortBy === 'income' ? a.taxable_income : 
                                        sortBy === 'deductions' ? a.total_tax_deductions : a.wealth_tax;
                            const bVal = sortBy === 'income' ? b.taxable_income : 
                                        sortBy === 'deductions' ? b.total_tax_deductions : b.wealth_tax;
                            return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
                          })
                          .map((analysis, index) => {
                          const taxOptionBadge = getTaxOptionBadge(analysis.tax_option);
                          const knowledgeBadge = getFiscalKnowledgeBadge(analysis.fiscal_knowledge);
                          const categoryBadge = getIncomeCategoryBadge(analysis.income_category);
                          const optimizationScore = (analysis.total_tax_deductions / analysis.taxable_income) * 100;
                          const isHighPotential = analysis.taxable_income > 50000 && !analysis.uses_tax_devices;
                          
                          return (
                            <TableRow 
                              key={analysis.user_id} 
                              className={`hover:bg-white/10 transition-all duration-300 group cursor-pointer ${
                                isHighPotential ? 'bg-yellow-50/5 border-l-4 border-l-yellow-400' : ''
                              } ${
                                index % 2 === 0 ? 'bg-white/2' : ''
                              }`}
                              onClick={() => setSelectedClient(analysis)}
                            >
                              <TableCell>
                                <div className="flex items-center space-x-4">
                                  <div className="relative">
                                    <Avatar className="h-11 w-11 ring-2 ring-transparent group-hover:ring-blue-400/50 transition-all">
                                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-sm font-bold">
                                        {getInitials(analysis.first_name, analysis.last_name)}
                                      </AvatarFallback>
                                    </Avatar>
                                    {isHighPotential && (
                                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-500 rounded-full flex items-center justify-center">
                                        <Star className="w-2 h-2 text-white fill-white" />
                                      </div>
                                    )}
                                  </div>
                                  <div>
                                    <p className="font-semibold text-foreground group-hover:text-blue-600 transition-colors">
                                      {analysis.first_name} {analysis.last_name}
                                    </p>
                                    <div className="flex items-center space-x-2 mt-1">
                                      <p className="text-xs text-muted-foreground">
                                        ID: {analysis.user_id.slice(0, 8)}
                                      </p>
                                      {optimizationScore > 10 && (
                                        <Badge variant="secondary" className="text-xs px-2 py-0 h-5">
                                          Optimisé
                                        </Badge>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="space-y-1">
                                  <div className="font-bold text-green-600 text-lg">
                                    {formatCurrency(analysis.taxable_income)}
                                  </div>
                                  <Progress 
                                    value={Math.min((analysis.taxable_income / 200000) * 100, 100)} 
                                    className="h-1" 
                                  />
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center space-x-2">
                                  <Badge variant={taxOptionBadge.variant as any} className={`${taxOptionBadge.color} px-3 py-1`}>
                                    {analysis.tax_option}
                                  </Badge>
                                  {analysis.tax_option === 'PFU' && (
                                    <Tooltip>
                                      <TooltipTrigger>
                                        <CheckCircle className="w-4 h-4 text-blue-500" />
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>Optimisation PFU active</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="space-y-1">
                                  <div className={`font-bold text-lg ${
                                    analysis.wealth_tax > 0 ? 'text-red-600' : 'text-gray-400'
                                  }`}>
                                    {formatCurrency(analysis.wealth_tax)}
                                  </div>
                                  {analysis.wealth_tax > 0 && (
                                    <Badge variant="destructive" className="text-xs">
                                      Assujetti
                                    </Badge>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="space-y-1">
                                  <div className="font-bold text-purple-600 text-lg">
                                    {formatCurrency(analysis.total_tax_deductions)}
                                  </div>
                                  <div className="flex items-center justify-end space-x-1">
                                    <div className="text-xs text-muted-foreground">
                                      {optimizationScore.toFixed(1)}%
                                    </div>
                                    <Progress 
                                      value={Math.min(optimizationScore * 5, 100)} 
                                      className="h-1 w-12" 
                                    />
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center space-x-2">
                                  <Badge variant={knowledgeBadge.variant as any} className={`${knowledgeBadge.color} px-3 py-1`}>
                                    {analysis.fiscal_knowledge}
                                  </Badge>
                                  {analysis.fiscal_knowledge === 'Expert' && (
                                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-400" />
                                  )}
                                </div>
                              </TableCell>
                              <TableCell className="text-center">
                                <div className="flex items-center justify-center">
                                  {analysis.uses_tax_devices ? (
                                    <Tooltip>
                                      <TooltipTrigger>
                                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                          <CheckCircle className="h-5 w-5 text-green-600" />
                                        </div>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>Utilise des dispositifs fiscaux</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  ) : (
                                    <Tooltip>
                                      <TooltipTrigger>
                                        <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                                          <XCircle className="h-5 w-5 text-red-400" />
                                        </div>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>Potentiel d'optimisation</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center space-x-2">
                                  <Badge variant={categoryBadge.variant as any} className={`${categoryBadge.color} px-3 py-1`}>
                                    {analysis.income_category}
                                  </Badge>
                                  {analysis.income_category === 'Élevé' && (
                                    <TrendingUp className="w-4 h-4 text-red-500" />
                                  )}
                                </div>
                              </TableCell>
                              <TableCell className="text-center">
                                <div className="flex items-center justify-center space-x-1">
                                  <Dialog>
                                    <DialogTrigger asChild>
                                      <Button 
                                        variant="ghost" 
                                        size="sm" 
                                        className="hover:bg-blue-100 hover:text-blue-600"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setSelectedClient(analysis);
                                        }}
                                      >
                                        <Eye className="w-4 h-4" />
                                      </Button>
                                    </DialogTrigger>
                                    <DialogContent className="glass-card border-white/20 max-w-2xl">
                                      <DialogHeader>
                                        <DialogTitle className="flex items-center space-x-2">
                                          <Avatar className="h-8 w-8">
                                            <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm">
                                              {getInitials(analysis.first_name, analysis.last_name)}
                                            </AvatarFallback>
                                          </Avatar>
                                          <span>{analysis.first_name} {analysis.last_name}</span>
                                        </DialogTitle>
                                        <DialogDescription>
                                          Profil fiscal détaillé et recommandations personnalisées
                                        </DialogDescription>
                                      </DialogHeader>
                                      <div className="grid grid-cols-2 gap-6 py-4">
                                        <div className="space-y-4">
                                          <div className="p-4 glass rounded-xl">
                                            <div className="text-sm text-muted-foreground mb-2">Situation fiscale</div>
                                            <div className="space-y-2">
                                              <div className="flex justify-between">
                                                <span>Revenu fiscal</span>
                                                <span className="font-bold">{formatCurrency(analysis.taxable_income)}</span>
                                              </div>
                                              <div className="flex justify-between">
                                                <span>Déductions</span>
                                                <span className="font-bold text-purple-600">{formatCurrency(analysis.total_tax_deductions)}</span>
                                              </div>
                                              <div className="flex justify-between">
                                                <span>IFI</span>
                                                <span className="font-bold text-red-600">{formatCurrency(analysis.wealth_tax)}</span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                        <div className="space-y-4">
                                          <div className="p-4 glass rounded-xl">
                                            <div className="text-sm text-muted-foreground mb-2">Recommandations</div>
                                            <div className="space-y-2">
                                              {!analysis.uses_tax_devices && analysis.taxable_income > 50000 && (
                                                <div className="p-3 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
                                                  <div className="text-sm font-medium text-yellow-800">Optimisation possible</div>
                                                  <div className="text-xs text-yellow-600">Dispositifs fiscaux recommandés</div>
                                                </div>
                                              )}
                                              {analysis.fiscal_knowledge !== 'Expert' && (
                                                <div className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                                                  <div className="text-sm font-medium text-blue-800">Formation suggérée</div>
                                                  <div className="text-xs text-blue-600">Améliorer les connaissances fiscales</div>
                                                </div>
                                              )}
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </DialogContent>
                                  </Dialog>
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="hover:bg-green-100 hover:text-green-600"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <FileText className="w-4 h-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          );
                        })
                      ) : (
                        <TableRow>
                          <TableCell colSpan={9} className="text-center py-16">
                            <div className="flex flex-col items-center space-y-4 glass p-8 rounded-2xl mx-8">
                              <div className="w-16 h-16 gradient-primary rounded-full flex items-center justify-center mb-2">
                                <Receipt className="h-8 w-8 text-white" />
                              </div>
                              <div className="space-y-2">
                                <p className="text-lg font-semibold text-foreground">Aucun résultat trouvé</p>
                                <p className="text-sm text-muted-foreground max-w-md">Aucun client ne correspond à vos critères actuels. Essayez d'ajuster vos filtres ou votre recherche.</p>
                              </div>
                              <Button 
                                variant="outline" 
                                onClick={handleClearFilters}
                                className="glass border-white/30 hover:glass-card mt-4"
                              >
                                <RefreshCw className="w-4 h-4 mr-2" />
                                Réinitialiser les filtres
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
              
              <TabsContent value="cards" className="space-y-6 mt-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="text-sm text-muted-foreground">
                    Affichage en cartes - {filteredAnalyses.length} clients
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" className="glass border-white/30">
                      <Filter className="w-4 h-4 mr-2" />
                      Filtrer la vue
                    </Button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredAnalyses
                    .sort((a, b) => {
                      const aVal = sortBy === 'income' ? a.taxable_income : 
                                  sortBy === 'deductions' ? a.total_tax_deductions : a.wealth_tax;
                      const bVal = sortBy === 'income' ? b.taxable_income : 
                                  sortBy === 'deductions' ? b.total_tax_deductions : b.wealth_tax;
                      return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
                    })
                    .map((analysis) => {
                    const taxOptionBadge = getTaxOptionBadge(analysis.tax_option);
                    const knowledgeBadge = getFiscalKnowledgeBadge(analysis.fiscal_knowledge);
                    const categoryBadge = getIncomeCategoryBadge(analysis.income_category);
                    const optimizationScore = (analysis.total_tax_deductions / analysis.taxable_income) * 100;
                    const isHighPotential = analysis.taxable_income > 50000 && !analysis.uses_tax_devices;
                    
                    return (
                      <Card 
                        key={analysis.user_id} 
                        className={`glass-card border-white/20 hover:shadow-xl hover:scale-105 transition-all duration-500 cursor-pointer group relative overflow-hidden ${
                          isHighPotential ? 'ring-2 ring-yellow-400/50' : ''
                        }`}
                        onClick={() => setSelectedClient(analysis)}
                      >
                        {isHighPotential && (
                          <div className="absolute top-4 right-4 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center z-10">
                            <Star className="w-3 h-3 text-white fill-white" />
                          </div>
                        )}
                        <div className="absolute inset-0 gradient-primary opacity-5 group-hover:opacity-10 transition-opacity"></div>
                        
                        <CardContent className="p-6 relative z-10">
                          {/* Client Header */}
                          <div className="flex items-center space-x-4 mb-6">
                            <div className="relative">
                              <Avatar className="h-14 w-14 ring-2 ring-transparent group-hover:ring-blue-400/50 transition-all">
                                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold">
                                  {getInitials(analysis.first_name, analysis.last_name)}
                                </AvatarFallback>
                              </Avatar>
                              {analysis.uses_tax_devices && (
                                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                                  <CheckCircle className="w-3 h-3 text-white" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1">
                              <h3 className="font-bold text-lg group-hover:text-blue-600 transition-colors">
                                {analysis.first_name} {analysis.last_name}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                ID: {analysis.user_id.slice(0, 8)}
                              </p>
                              <div className="flex items-center space-x-2 mt-1">
                                <Badge variant={categoryBadge.variant as any} className={`${categoryBadge.color} text-xs px-2 py-0`}>
                                  {analysis.income_category}
                                </Badge>
                                {optimizationScore > 10 && (
                                  <Badge variant="secondary" className="text-xs px-2 py-0">
                                    Optimisé
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          {/* Financial Overview */}
                          <div className="space-y-4 mb-6">
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <div className="flex items-center space-x-1">
                                  <Euro className="w-3 h-3 text-green-600" />
                                  <span className="text-xs text-muted-foreground font-medium">Revenu Fiscal</span>
                                </div>
                                <div className="text-xl font-bold text-green-600">
                                  {formatCurrency(analysis.taxable_income)}
                                </div>
                                <Progress value={Math.min((analysis.taxable_income / 200000) * 100, 100)} className="h-2" />
                              </div>
                              
                              <div className="space-y-2">
                                <div className="flex items-center space-x-1">
                                  <TrendingUp className="w-3 h-3 text-purple-600" />
                                  <span className="text-xs text-muted-foreground font-medium">Déductions</span>
                                </div>
                                <div className="text-xl font-bold text-purple-600">
                                  {formatCurrency(analysis.total_tax_deductions)}
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Progress value={Math.min(optimizationScore * 5, 100)} className="h-2 flex-1" />
                                  <span className="text-xs text-muted-foreground">{optimizationScore.toFixed(1)}%</span>
                                </div>
                              </div>
                            </div>
                            
                            {analysis.wealth_tax > 0 && (
                              <div className="p-3 glass rounded-xl border border-red-200/20">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-2">
                                    <Receipt className="w-4 h-4 text-red-600" />
                                    <span className="text-sm font-medium text-red-800">IFI</span>
                                  </div>
                                  <div className="text-lg font-bold text-red-600">
                                    {formatCurrency(analysis.wealth_tax)}
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                          
                          {/* Action Buttons */}
                          <div className="flex items-center space-x-2 pt-4 border-t border-white/10">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="flex-1 glass border-white/30 hover:glass-card"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              Détails
                            </Button>
                            
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="flex-1 glass border-white/30 hover:glass-card"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <FileText className="w-4 h-4 mr-2" />
                              Rapport
                            </Button>
                          </div>
                          
                          {/* Recommendations Footer */}
                          {(isHighPotential || analysis.fiscal_knowledge !== 'Expert') && (
                            <div className="mt-4 p-3 glass rounded-xl border border-blue-200/20">
                              <div className="flex items-center space-x-2 mb-1">
                                <Lightbulb className="w-4 h-4 text-blue-600" />
                                <span className="text-sm font-medium text-blue-800">Actions suggérées</span>
                              </div>
                              <div className="text-xs text-gray-600">
                                {isHighPotential && 'Dispositifs fiscaux • '}
                                {analysis.fiscal_knowledge !== 'Expert' && 'Formation fiscale • '}
                                Suivi personnalisé
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
                
                {filteredAnalyses.length === 0 && (
                  <div className="text-center py-16">
                    <div className="w-16 h-16 gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                      <Receipt className="h-8 w-8 text-white" />
                    </div>
                    <p className="text-lg font-semibold text-foreground mb-2">Aucun client trouvé</p>
                    <p className="text-sm text-muted-foreground mb-4">Ajustez vos filtres pour voir plus de résultats</p>
                    <Button variant="outline" onClick={handleClearFilters} className="glass border-white/30">
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Réinitialiser
                    </Button>
                  </div>
                )}
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