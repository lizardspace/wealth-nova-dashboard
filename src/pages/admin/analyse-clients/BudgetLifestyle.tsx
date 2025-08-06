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
import { Progress } from "@/components/ui/progress";
import {
  TooltipProvider,
} from "@/components/ui/tooltip";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Users,
  TrendingUp,
  TrendingDown,
  Search,
  Filter,
  PieChart,
  BarChart3,
  Calculator,
  Target,
  Wallet,
  Home,
  Car,
  ShoppingCart,
  Gamepad2,
  Heart,
  GraduationCap,
  Receipt,
  MoreHorizontal,
  Shield,
  RefreshCw,
  Award,
  Activity,
  Star,
} from 'lucide-react';
import { supabase } from './../../../lib/supabase';
import { useToast } from '@/components/ui/use-toast';

interface BudgetLifestyle {
  user_id: string;
  last_name: string;
  first_name: string;
  rent: number;
  housing_charges: number;
  insurance: number;
  transport: number;
  food: number;
  leisure: number;
  education: number;
  health: number;
  miscellaneous: number;
  total_expenses: number;
  budgeted_expenses: number;
  difference: number;
  budget_coverage_percentage: number;
}

const BudgetLifestyle: React.FC = () => {
  const { toast } = useToast();
  const [budgetLifestyles, setBudgetLifestyles] = useState<BudgetLifestyle[]>([]);
  const [filteredBudgets, setFilteredBudgets] = useState<BudgetLifestyle[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterExpenseLevel, setFilterExpenseLevel] = useState('all');

  const expenseCategories = [
    { key: 'rent', label: 'Loyer', icon: Home, color: 'text-blue-600' },
    { key: 'housing_charges', label: 'Charges', icon: Receipt, color: 'text-cyan-600' },
    { key: 'insurance', label: 'Assurances', icon: Shield, color: 'text-orange-600' },
    { key: 'transport', label: 'Transport', icon: Car, color: 'text-red-600' },
    { key: 'food', label: 'Alimentation', icon: ShoppingCart, color: 'text-green-600' },
    { key: 'leisure', label: 'Loisirs', icon: Gamepad2, color: 'text-purple-600' },
    { key: 'education', label: 'Études', icon: GraduationCap, color: 'text-indigo-600' },
    { key: 'health', label: 'Santé', icon: Heart, color: 'text-pink-600' },
    { key: 'miscellaneous', label: 'Divers', icon: MoreHorizontal, color: 'text-gray-600' }
  ];

  const fetchBudgetData = async () => {
    setRefreshing(true);
    try {
      const { data, error } = await supabase
        .from('budget_lifestyle')
        .select('*')
        .order('total_expenses', { ascending: false });

      if (error) throw error;
      setBudgetLifestyles(data || []);
      setFilteredBudgets(data || []);
    } catch (error) {
      console.error('Error fetching budget lifestyle data:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les données budget",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchBudgetData();
  }, [toast]);

  // Apply filters whenever any filter changes
  useEffect(() => {
    const filtered = budgetLifestyles.filter(budget => {
      const nameMatch = `${budget.first_name} ${budget.last_name}`.toLowerCase().includes(searchTerm.toLowerCase());
      const expenseLevelMatch = filterExpenseLevel === 'all' || getExpenseCategory(budget.total_expenses).level === filterExpenseLevel;
      
      return nameMatch && expenseLevelMatch;
    });
    
    setFilteredBudgets(filtered);
  }, [searchTerm, filterExpenseLevel, budgetLifestyles]);

  const formatCurrency = (amount: number) => {
    if (amount === null || amount === undefined || isNaN(amount)) return 'N/A';
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getExpenseCategory = (totalExpenses: number) => {
    if (!totalExpenses || totalExpenses === 0) return { 
      label: 'Non renseigné', 
      variant: 'outline', 
      color: 'text-gray-600',
      level: 'none'
    };
    if (totalExpenses < 1500) return { 
      label: 'Très modeste', 
      variant: 'default', 
      color: 'text-green-600',
      level: 'very_low'
    };
    if (totalExpenses < 2500) return { 
      label: 'Modeste', 
      variant: 'secondary', 
      color: 'text-blue-600',
      level: 'low'
    };
    if (totalExpenses < 4000) return { 
      label: 'Moyen', 
      variant: 'outline', 
      color: 'text-orange-600',
      level: 'medium'
    };
    if (totalExpenses < 6000) return { 
      label: 'Confortable', 
      variant: 'default', 
      color: 'text-purple-600',
      level: 'high'
    };
    return { 
      label: 'Élevé', 
      variant: 'destructive', 
      color: 'text-red-600',
      level: 'very_high'
    };
  };

  const getCoverageLevel = (coverage: number) => {
    if (coverage >= 100) return { label: 'Excellente', variant: 'default', color: 'text-green-600' };
    if (coverage >= 80) return { label: 'Bonne', variant: 'secondary', color: 'text-blue-600' };
    if (coverage >= 60) return { label: 'Moyenne', variant: 'outline', color: 'text-orange-600' };
    if (coverage >= 40) return { label: 'Faible', variant: 'outline', color: 'text-red-600' };
    return { label: 'Insuffisante', variant: 'destructive', color: 'text-red-600' };
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  };

  // Statistics calculations
  const totalExpenses = budgetLifestyles.reduce((sum, budget) => sum + (budget.total_expenses || 0), 0);
  const totalBudgeted = budgetLifestyles.reduce((sum, budget) => sum + (budget.budgeted_expenses || 0), 0);
  const averageExpenses = budgetLifestyles.length > 0 ? totalExpenses / budgetLifestyles.length : 0;
  const averageBudget = budgetLifestyles.length > 0 ? totalBudgeted / budgetLifestyles.length : 0;
  const averageDifference = budgetLifestyles.length > 0 ? 
    budgetLifestyles.reduce((sum, budget) => sum + (budget.difference || 0), 0) / budgetLifestyles.length : 0;
  const averageCoverage = budgetLifestyles.length > 0 ? 
    budgetLifestyles.reduce((sum, budget) => sum + (budget.budget_coverage_percentage || 0), 0) / budgetLifestyles.length : 0;

  // Category averages
  const categoryAverages = expenseCategories.reduce((acc, category) => {
    const total = budgetLifestyles.reduce(
      (sum, budget) => {
        const value = budget[category.key as keyof BudgetLifestyle];
        return sum + (typeof value === 'number' ? value : 0);
      }, 0
    );
    return {
      ...acc,
      [category.key]: budgetLifestyles.length > 0 ? total / budgetLifestyles.length : 0
    };
  }, {} as Record<string, number>);

  const handleRefresh = async () => {
    await fetchBudgetData();
    toast({
      title: "✅ Données actualisées",
      description: "Les données budget ont été mises à jour avec succès",
    });
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setFilterExpenseLevel('all');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-eparnova-blue"></div>
          <span className="text-lg text-muted-foreground">Chargement des données budget...</span>
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
                  Budget et Train de Vie
                </h1>
                <p className="text-muted-foreground mt-2 text-lg">
                  Analyse détaillée des habitudes budgétaires et du train de vie
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-2">
                <Wallet className="h-10 w-10 text-eparnova-blue animate-float" />
                <Calculator className="h-8 w-8 text-eparnova-green animate-float" style={{animationDelay: '1s'}} />
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
          <div className="absolute top-4 right-4 w-24 h-24 gradient-warning rounded-full opacity-10 animate-float"></div>
          <div className="absolute bottom-4 left-4 w-20 h-20 gradient-success rounded-full opacity-10 animate-float" style={{animationDelay: '2s'}}></div>
        </div>

        {/* Enhanced Main Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="glass-card border-white/20 hover:shadow-lg transition-all duration-300 relative overflow-hidden">
            <div className="absolute inset-0 gradient-primary opacity-5"></div>
            <CardContent className="p-6 relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Clients</p>
                  <p className="text-3xl font-bold text-foreground">{budgetLifestyles.length}</p>
                  <p className="text-xs text-muted-foreground mt-1">clients analysés</p>
                </div>
                <div className="p-3 gradient-primary rounded-xl">
                  <Users className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-white/20 hover:shadow-lg transition-all duration-300 relative overflow-hidden">
            <div className="absolute inset-0 gradient-warning opacity-5"></div>
            <CardContent className="p-6 relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Dépenses Moyennes</p>
                  <p className="text-3xl font-bold text-orange-600">{formatCurrency(averageExpenses)}</p>
                  <p className="text-xs text-muted-foreground mt-1">par client</p>
                </div>
                <div className="p-3 gradient-warning rounded-xl">
                  <TrendingDown className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-white/20 hover:shadow-lg transition-all duration-300 relative overflow-hidden">
            <div className="absolute inset-0 gradient-success opacity-5"></div>
            <CardContent className="p-6 relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Budget Moyen</p>
                  <p className="text-3xl font-bold text-blue-600">{formatCurrency(averageBudget)}</p>
                  <p className="text-xs text-muted-foreground mt-1">budget planifié</p>
                </div>
                <div className="p-3 gradient-success rounded-xl">
                  <Target className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-white/20 hover:shadow-lg transition-all duration-300 relative overflow-hidden">
            <div className="absolute inset-0 gradient-gold opacity-5"></div>
            <CardContent className="p-6 relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Écart Moyen</p>
                  <p className={`text-3xl font-bold ${averageDifference >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(averageDifference)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {averageDifference >= 0 ? 'économies' : 'dépassement'}
                  </p>
                </div>
                <div className="p-3 gradient-gold rounded-xl">
                  {averageDifference >= 0 ? (
                    <TrendingUp className="h-6 w-6 text-white" />
                  ) : (
                    <TrendingDown className="h-6 w-6 text-white" />
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Coverage Overview */}
        <Card className="glass-card border-white/20">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-eparnova-blue" />
              <span>Couverture Budgétaire Moyenne</span>
            </CardTitle>
            <CardDescription>Pourcentage de couverture budget vs dépenses réelles</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">
                  Couverture moyenne: {averageCoverage.toFixed(1)}%
                </span>
                <Badge variant={averageCoverage >= 80 ? "default" : averageCoverage >= 60 ? "secondary" : "destructive"}>
                  {getCoverageLevel(averageCoverage).label}
                </Badge>
              </div>
              <Progress value={Math.min(averageCoverage, 100)} className="h-3" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>0%</span>
                <span>50%</span>
                <span>100%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Expense Categories Overview */}
        <Card className="glass-card border-white/20">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <PieChart className="h-5 w-5 text-eparnova-green" />
              <span>Répartition Moyenne des Dépenses</span>
            </CardTitle>
            <CardDescription>Analyse détaillée par catégorie de dépenses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {expenseCategories.map((category) => {
                const IconComponent = category.icon;
                const average = categoryAverages[category.key] || 0;
                const percentage = averageExpenses > 0 ? (average / averageExpenses) * 100 : 0;
                
                return (
                  <div key={category.key} className="space-y-3 p-4 glass rounded-lg border border-white/20 hover:shadow-md transition-all duration-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <IconComponent className={`h-5 w-5 ${category.color}`} />
                        <span className="font-medium text-sm">{category.label}</span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {percentage.toFixed(1)}%
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className={`text-lg font-bold ${category.color}`}>
                          {formatCurrency(average)}
                        </span>
                      </div>
                      <Progress value={Math.min(percentage, 100)} className="h-2" />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

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
                disabled={!searchTerm && filterExpenseLevel === 'all'}
              >
                Réinitialiser
              </Button>
            </div>
            <CardDescription>Affinez votre recherche avec les filtres ci-dessous</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <label className="text-sm font-medium">Niveau de Dépenses</label>
                <Select value={filterExpenseLevel} onValueChange={setFilterExpenseLevel}>
                  <SelectTrigger className="glass border-white/30 hover:border-white/50">
                    <SelectValue placeholder="Tous les niveaux" />
                  </SelectTrigger>
                  <SelectContent className="glass-card border-white/20">
                    <SelectItem value="all">Tous les niveaux</SelectItem>
                    <SelectItem value="very_low">Très modeste (&lt;1500€)</SelectItem>
                    <SelectItem value="low">Modeste (1500-2500€)</SelectItem>
                    <SelectItem value="medium">Moyen (2500-4000€)</SelectItem>
                    <SelectItem value="high">Confortable (4000-6000€)</SelectItem>
                    <SelectItem value="very_high">Élevé (&gt;6000€)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex justify-between items-center mt-6 pt-4 border-t border-white/10">
              <div className="text-sm text-muted-foreground">
                {filteredBudgets.length} client(s) trouvé(s) sur {budgetLifestyles.length} au total
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Data Tables with Tabs */}
        <Card className="glass-card border-white/20">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-eparnova-blue" />
              <span>Détails Budget par Client</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="glass border-white/20">
                <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
                <TabsTrigger value="detailed">Détail des dépenses</TabsTrigger>
                <TabsTrigger value="analysis">Analyse budgétaire</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-4 mt-6">
                <div className="rounded-lg border border-white/20 overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-white/5 hover:bg-white/10">
                        <TableHead className="font-semibold">Client</TableHead>
                        <TableHead className="font-semibold text-right">Total Dépenses</TableHead>
                        <TableHead className="font-semibold text-right">Budget Planifié</TableHead>
                        <TableHead className="font-semibold text-right">Écart</TableHead>
                        <TableHead className="font-semibold text-center">Couverture</TableHead>
                        <TableHead className="font-semibold">Profil Dépenses</TableHead>
                        <TableHead className="font-semibold">Niveau</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredBudgets.length > 0 ? (
                        filteredBudgets.map((budget) => {
                          const expenseCategory = getExpenseCategory(budget.total_expenses);
                          const coverageLevel = getCoverageLevel(budget.budget_coverage_percentage || 0);
                          
                          return (
                            <TableRow key={budget.user_id} className="hover:bg-white/5 transition-colors">
                              <TableCell>
                                <div className="flex items-center space-x-3">
                                  <Avatar className="h-9 w-9">
                                    <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm font-medium">
                                      {getInitials(budget.first_name, budget.last_name)}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <p className="font-medium text-foreground">
                                      {budget.first_name} {budget.last_name}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                      ID: {budget.user_id.slice(0, 8)}...
                                    </p>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell className="text-right font-medium text-orange-600">
                                {formatCurrency(budget.total_expenses)}
                              </TableCell>
                              <TableCell className="text-right font-medium text-blue-600">
                                {formatCurrency(budget.budgeted_expenses)}
                              </TableCell>
                              <TableCell className={`text-right font-bold ${
                                budget.difference >= 0 ? 'text-green-600' : 'text-red-600'
                              }`}>
                                {formatCurrency(budget.difference)}
                              </TableCell>
                              <TableCell className="text-center">
                                <div className="space-y-2">
                                  <Progress 
                                    value={Math.min(budget.budget_coverage_percentage || 0, 100)} 
                                    className="h-2 w-16 mx-auto" 
                                  />
                                  <span className="text-xs font-medium">
                                    {budget.budget_coverage_percentage?.toFixed(1) || '0'}%
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge variant={coverageLevel.variant as any} className={coverageLevel.color}>
                                  {coverageLevel.label}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Badge variant={expenseCategory.variant as any} className={expenseCategory.color}>
                                  {expenseCategory.label}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          );
                        })
                      ) : (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-12">
                            <div className="flex flex-col items-center space-y-2">
                              <Wallet className="h-12 w-12 text-muted-foreground opacity-50" />
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
                <div className="rounded-lg border border-white/20 overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-white/5">
                        <TableHead className="font-semibold">Client</TableHead>
                        {expenseCategories.map((category) => (
                          <TableHead key={category.key} className="font-semibold text-right">
                            {category.label}
                          </TableHead>
                        ))}
                        <TableHead className="font-semibold text-right">Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredBudgets.map((budget) => (
                        <TableRow key={budget.user_id} className="hover:bg-white/5">
                          <TableCell className="font-medium">
                            {budget.first_name} {budget.last_name}
                          </TableCell>
                          {expenseCategories.map((category) => {
                            const value = budget[category.key as keyof BudgetLifestyle];
                            return (
                              <TableCell key={category.key} className="text-right">
                                {formatCurrency(typeof value === 'number' ? value : 0)}
                              </TableCell>
                            );
                          })}
                          <TableCell className="text-right font-bold text-orange-600">
                            {formatCurrency(budget.total_expenses)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              <TabsContent value="analysis" className="space-y-6 mt-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Top Budgets */}
                  <Card className="glass border-white/10">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Award className="h-5 w-5 text-gold-500" />
                        <span>Top 5 Budgets</span>
                      </CardTitle>
                      <CardDescription>Clients avec les budgets les plus élevés</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {[...filteredBudgets]
                        .sort((a, b) => (b.budgeted_expenses || 0) - (a.budgeted_expenses || 0))
                        .slice(0, 5)
                        .map((budget, index) => (
                          <div key={budget.user_id} className="flex items-center justify-between p-3 glass rounded-lg">
                            <div className="flex items-center space-x-3">
                              <Badge variant="outline" className="w-8 h-8 rounded-full flex items-center justify-center">
                                {index + 1}
                              </Badge>
                              <div>
                                <p className="font-medium">{budget.first_name} {budget.last_name}</p>
                                <p className="text-sm text-muted-foreground">Budget planifié</p>
                              </div>
                            </div>
                            <span className="font-bold text-blue-600">
                              {formatCurrency(budget.budgeted_expenses)}
                            </span>
                          </div>
                        ))}
                    </CardContent>
                  </Card>

                  {/* Best Coverage */}
                  <Card className="glass border-white/10">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Star className="h-5 w-5 text-yellow-500" />
                        <span>Meilleures Couvertures</span>
                      </CardTitle>
                      <CardDescription>Clients avec la meilleure gestion budgétaire</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {[...filteredBudgets]
                        .sort((a, b) => (b.budget_coverage_percentage || 0) - (a.budget_coverage_percentage || 0))
                        .slice(0, 5)
                        .map((budget, index) => (
                          <div key={budget.user_id} className="flex items-center justify-between p-3 glass rounded-lg">
                            <div className="flex items-center space-x-3">
                              <Badge variant="outline" className="w-8 h-8 rounded-full flex items-center justify-center">
                                {index + 1}
                              </Badge>
                              <div>
                                <p className="font-medium">{budget.first_name} {budget.last_name}</p>
                                <p className="text-sm text-muted-foreground">Couverture budgétaire</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Progress value={budget.budget_coverage_percentage || 0} className="w-16 h-2" />
                              <span className="font-bold text-green-600">
                                {(budget.budget_coverage_percentage || 0).toFixed(1)}%
                              </span>
                            </div>
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

export default BudgetLifestyle;