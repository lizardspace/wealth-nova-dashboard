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
  CreditCard,
  Users,
  Percent,
  Euro,
  TrendingUp,
  TrendingDown,
  Search,
  Filter,
  AlertCircle,
  ArrowLeft,
  DollarSign,
  PieChart,
  BarChart3,
  Calculator,
  Target,
  Wallet,
  ShieldCheck,
  Clock,
  CheckCircle,
  XCircle,
  Award,
  Zap,
} from 'lucide-react';
import { supabase } from './../../../lib/supabase';
import { useToast } from '@/components/ui/use-toast';

interface CreditAnalysis {
  user_id: string;
  last_name: string;
  first_name: string;
  credit_count: number;
  total_initial_amount: number;
  total_remaining_capital: number;
  total_monthly_payment: number;
  total_insurance: number;
  average_rate: number;
  credit_situation: string;
  monthly_payment_category: string;
}

const CreditAnalysis: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [creditAnalyses, setCreditAnalyses] = useState<CreditAnalysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterHasCredit, setFilterHasCredit] = useState<string>('all');

  useEffect(() => {
    const fetchCreditAnalyses = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('credit_analysis')
          .select('*')
          .order('total_remaining_capital', { ascending: false });

        if (error) throw error;
        setCreditAnalyses(data || []);
      } catch (error) {
        console.error('Error fetching credit analyses:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les analyses de crédit",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCreditAnalyses();
  }, [toast]);

  const formatCurrency = (amount: number) => {
    if (amount === null || amount === undefined) return '0 €';
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatPercentage = (rate: number) => {
    if (rate === null || rate === undefined) return 'N/A';
    return `${rate.toFixed(2)}%`;
  };

  const getCreditSituationBadge = (situation: string) => {
    switch (situation) {
      case 'Aucun crédit':
        return { variant: 'default', icon: CheckCircle };
      case 'Un crédit':
        return { variant: 'secondary', icon: CreditCard };
      case 'Plusieurs crédits':
        return { variant: 'destructive', icon: AlertCircle };
      default:
        return { variant: 'outline', icon: XCircle };
    }
  };

  const getMonthlyPaymentCategoryBadge = (category: string) => {
    switch (category) {
      case 'Aucune mensualité':
        return { variant: 'default', color: 'text-green-600' };
      case 'Faible charge':
        return { variant: 'secondary', color: 'text-blue-600' };
      case 'Charge modérée':
        return { variant: 'outline', color: 'text-orange-600' };
      case 'Forte charge':
        return { variant: 'destructive', color: 'text-red-600' };
      default:
        return { variant: 'outline', color: 'text-gray-600' };
    }
  };

  const getDebtLevel = (remainingCapital: number) => {
    if (remainingCapital === 0) return { label: 'Aucune dette', variant: 'default', color: 'text-green-600' };
    if (remainingCapital < 50000) return { label: 'Faible dette', variant: 'secondary', color: 'text-blue-600' };
    if (remainingCapital < 200000) return { label: 'Dette modérée', variant: 'outline', color: 'text-orange-600' };
    return { label: 'Forte dette', variant: 'destructive', color: 'text-red-600' };
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  };

  // Filter analyses
  const filteredAnalyses = creditAnalyses.filter(analysis => {
    const nameMatch = `${analysis.first_name} ${analysis.last_name}`.toLowerCase().includes(searchTerm.toLowerCase());
    const creditMatch = filterHasCredit === 'all' || 
      (filterHasCredit === 'true' && analysis.credit_count > 0) ||
      (filterHasCredit === 'false' && analysis.credit_count === 0);
    
    return nameMatch && creditMatch;
  });

  // Statistics calculations
  const totalInitialAmount = creditAnalyses.reduce((sum, analysis) => sum + (analysis.total_initial_amount || 0), 0);
  const totalRemainingCapital = creditAnalyses.reduce((sum, analysis) => sum + (analysis.total_remaining_capital || 0), 0);
  const totalMonthlyPayments = creditAnalyses.reduce((sum, analysis) => sum + (analysis.total_monthly_payment || 0), 0);
  const totalInsurance = creditAnalyses.reduce((sum, analysis) => sum + (analysis.total_insurance || 0), 0);

  const averageInitialAmount = creditAnalyses.length > 0 ? totalInitialAmount / creditAnalyses.length : 0;
  const averageRemainingCapital = creditAnalyses.length > 0 ? totalRemainingCapital / creditAnalyses.length : 0;
  const averageMonthlyPayment = creditAnalyses.length > 0 ? totalMonthlyPayments / creditAnalyses.length : 0;
  const averageRate = creditAnalyses.filter(a => a.average_rate > 0).length > 0 ? 
    creditAnalyses.filter(a => a.average_rate > 0).reduce((sum, a) => sum + a.average_rate, 0) / 
    creditAnalyses.filter(a => a.average_rate > 0).length : 0;

  const usersWithCredit = creditAnalyses.filter(analysis => analysis.credit_count > 0).length;
  const totalRepaymentProgress = totalInitialAmount > 0 ? ((totalInitialAmount - totalRemainingCapital) / totalInitialAmount) * 100 : 0;

  // Distribution statistics
  const creditSituationStats = creditAnalyses.reduce((acc, analysis) => {
    const situation = analysis.credit_situation || 'Non défini';
    acc[situation] = (acc[situation] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const monthlyPaymentCategoryStats = creditAnalyses.reduce((acc, analysis) => {
    const category = analysis.monthly_payment_category || 'Non défini';
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const handleClearFilters = () => {
    setSearchTerm('');
    setFilterHasCredit('all');
  };

  return (
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
                Analyse des Crédits Clients
              </h1>
              <p className="text-muted-foreground mt-2 text-lg">
                Analyse détaillée des engagements de crédit et capacité de remboursement
              </p>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-2">
            <CreditCard className="h-10 w-10 text-eparnova-blue animate-float" />
            <Calculator className="h-8 w-8 text-eparnova-green animate-float" style={{animationDelay: '1s'}} />
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute top-4 right-4 w-24 h-24 gradient-warning rounded-full opacity-10 animate-float"></div>
        <div className="absolute bottom-4 left-4 w-20 h-20 gradient-success rounded-full opacity-10 animate-float" style={{animationDelay: '2s'}}></div>
      </div>

      {/* Enhanced Statistics Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Clients */}
        <Card className="glass-card border-white/20 hover:shadow-lg transition-all duration-300 relative overflow-hidden">
          <div className="absolute inset-0 gradient-primary opacity-5"></div>
          <CardContent className="p-6 relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Clients</p>
                <p className="text-3xl font-bold text-foreground">{creditAnalyses.length}</p>
                <p className="text-xs text-muted-foreground mt-1">clients analysés</p>
              </div>
              <div className="p-3 gradient-primary rounded-xl">
                <Users className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Clients with Credit */}
        <Card className="glass-card border-white/20 hover:shadow-lg transition-all duration-300 relative overflow-hidden">
          <div className="absolute inset-0 gradient-warning opacity-5"></div>
          <CardContent className="p-6 relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Clients avec Crédit</p>
                <p className="text-3xl font-bold text-orange-600">{usersWithCredit}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {creditAnalyses.length > 0 ? ((usersWithCredit / creditAnalyses.length) * 100).toFixed(1) : 0}% du total
                </p>
              </div>
              <div className="p-3 gradient-warning rounded-xl">
                <CreditCard className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Average Rate */}
        <Card className="glass-card border-white/20 hover:shadow-lg transition-all duration-300 relative overflow-hidden">
          <div className="absolute inset-0 gradient-success opacity-5"></div>
          <CardContent className="p-6 relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Taux Moyen</p>
                <p className="text-3xl font-bold text-blue-600">{formatPercentage(averageRate)}</p>
                <p className="text-xs text-muted-foreground mt-1">taux d'intérêt moyen</p>
              </div>
              <div className="p-3 gradient-success rounded-xl">
                <Percent className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Total Remaining Capital */}
        <Card className="glass-card border-white/20 hover:shadow-lg transition-all duration-300 relative overflow-hidden">
          <div className="absolute inset-0 gradient-gold opacity-5"></div>
          <CardContent className="p-6 relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Capital Restant</p>
                <p className="text-2xl font-bold text-red-600">{formatCurrency(totalRemainingCapital)}</p>
                <p className="text-xs text-muted-foreground mt-1">à rembourser</p>
              </div>
              <div className="p-3 gradient-gold rounded-xl">
                <Euro className="h-6 w-6 text-white" />
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
              Capital Initial Total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-blue-600">{formatCurrency(totalInitialAmount)}</p>
            <p className="text-sm text-muted-foreground mt-1">Moyenne: {formatCurrency(averageInitialAmount)}</p>
          </CardContent>
        </Card>

        <Card className="glass-card border-white/20 hover:shadow-lg transition-all duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
              <Clock className="h-4 w-4 mr-2 text-orange-500" />
              Mensualités Totales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-orange-600">{formatCurrency(totalMonthlyPayments)}</p>
            <p className="text-sm text-muted-foreground mt-1">Moyenne: {formatCurrency(averageMonthlyPayment)}</p>
          </CardContent>
        </Card>

        <Card className="glass-card border-white/20 hover:shadow-lg transition-all duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
              <ShieldCheck className="h-4 w-4 mr-2 text-teal-500" />
              Assurances Totales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-teal-600">{formatCurrency(totalInsurance)}</p>
            <p className="text-sm text-muted-foreground mt-1">
              Moyenne: {formatCurrency(creditAnalyses.length > 0 ? totalInsurance / creditAnalyses.length : 0)}
            </p>
          </CardContent>
        </Card>

        <Card className="glass-card border-white/20 hover:shadow-lg transition-all duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
              <TrendingUp className="h-4 w-4 mr-2 text-green-500" />
              Progression Remboursement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className={`text-2xl font-bold ${totalRepaymentProgress > 50 ? 'text-green-600' : 'text-orange-600'}`}>
              {totalRepaymentProgress.toFixed(1)}%
            </p>
            <Progress value={totalRepaymentProgress} className="mt-2 h-2" />
          </CardContent>
        </Card>
      </div>

      {/* Distribution Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-card border-white/20">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <PieChart className="h-5 w-5 text-eparnova-blue" />
              <span>Situations de Crédit</span>
            </CardTitle>
            <CardDescription>Répartition des situations par type de crédit</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(creditSituationStats).map(([situation, count]) => {
              const badgeInfo = getCreditSituationBadge(situation);
              const IconComponent = badgeInfo.icon;
              const percentage = creditAnalyses.length > 0 ? (count / creditAnalyses.length) * 100 : 0;
              
              return (
                <div key={situation} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <IconComponent className="h-4 w-4" />
                      <Badge variant={badgeInfo.variant as any}>
                        {situation}
                      </Badge>
                    </div>
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
              <BarChart3 className="h-5 w-5 text-eparnova-green" />
              <span>Charges de Remboursement</span>
            </CardTitle>
            <CardDescription>Répartition par niveau de charge mensuelle</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(monthlyPaymentCategoryStats).map(([category, count]) => {
              const badgeInfo = getMonthlyPaymentCategoryBadge(category);
              const percentage = creditAnalyses.length > 0 ? (count / creditAnalyses.length) * 100 : 0;
              
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
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-eparnova-blue" />
            <CardTitle className="text-lg">Filtres et Recherche</CardTitle>
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
              <label className="text-sm font-medium">Statut Crédit</label>
              <Select value={filterHasCredit} onValueChange={setFilterHasCredit}>
                <SelectTrigger className="glass border-white/30 hover:border-white/50">
                  <SelectValue placeholder="Tous les clients" />
                </SelectTrigger>
                <SelectContent className="glass-card border-white/20">
                  <SelectItem value="all">Tous les clients</SelectItem>
                  <SelectItem value="true">Avec crédit(s)</SelectItem>
                  <SelectItem value="false">Sans crédit</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex justify-between items-center mt-6 pt-4 border-t border-white/10">
            <div className="text-sm text-muted-foreground">
              {filteredAnalyses.length} client(s) trouvé(s) sur {creditAnalyses.length} au total
            </div>
            <Button 
              onClick={handleClearFilters}
              variant="outline"
              className="glass border-white/30 hover:glass-card"
            >
              Réinitialiser les filtres
            </Button>
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
                    <TableHead className="font-semibold text-center">Nb Crédits</TableHead>
                    <TableHead className="font-semibold text-right">Montant Initial</TableHead>
                    <TableHead className="font-semibold text-right">Capital Restant</TableHead>
                    <TableHead className="font-semibold text-right">Mensualité</TableHead>
                    <TableHead className="font-semibold text-right">Assurance</TableHead>
                    <TableHead className="font-semibold text-center">Taux Moyen</TableHead>
                    <TableHead className="font-semibold">Niveau Dette</TableHead>
                    <TableHead className="font-semibold">Charge</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAnalyses.length > 0 ? (
                    filteredAnalyses.map((analysis) => {
                      const debtLevel = getDebtLevel(analysis.total_remaining_capital);
                      const paymentCategory = getMonthlyPaymentCategoryBadge(analysis.monthly_payment_category);
                      
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
                              variant={analysis.credit_count > 0 ? "default" : "outline"}
                              className="font-medium"
                            >
                              {analysis.credit_count}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right font-medium text-blue-600">
                            {formatCurrency(analysis.total_initial_amount)}
                          </TableCell>
                          <TableCell className={`text-right font-bold ${
                            analysis.total_remaining_capital > 0 ? 'text-red-600' : 'text-green-600'
                          }`}>
                            {formatCurrency(analysis.total_remaining_capital)}
                          </TableCell>
                          <TableCell className="text-right font-medium text-orange-600">
                            {formatCurrency(analysis.total_monthly_payment)}
                          </TableCell>
                          <TableCell className="text-right font-medium text-teal-600">
                            {formatCurrency(analysis.total_insurance)}
                          </TableCell>
                          <TableCell className="text-center">
                            {analysis.average_rate ? (
                              <Badge variant="outline" className="font-medium">
                                {formatPercentage(analysis.average_rate)}
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="text-muted-foreground">
                                N/A
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge variant={debtLevel.variant as any} className={debtLevel.color}>
                              {debtLevel.label}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={paymentCategory.variant as any} className={paymentCategory.color}>
                              {analysis.monthly_payment_category}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-12">
                        <div className="flex flex-col items-center space-y-2">
                          <CreditCard className="h-12 w-12 text-muted-foreground opacity-50" />
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
  );
};

export default CreditAnalysis;