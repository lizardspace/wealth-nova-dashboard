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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import {
  Users,
  Heart,
  DollarSign,
  TrendingUp,
  Link,
  Download,
  Search,
  Filter,
  Eye,
  CheckCircle,
  Clock,
  AlertCircle,
  ArrowLeft,
  Home,
  Mail,
  Phone,
  MapPin,
  Calendar,
  PieChart,
  BarChart3,
} from 'lucide-react';
import { supabase } from './../../../lib/supabase';
import { useToast } from '@/components/ui/use-toast';

interface FamilySummary {
  family_id: string;
  user1_id: string;
  user1_last_name: string;
  user1_first_name: string;
  user2_id: string;
  user2_last_name: string;
  user2_first_name: string;
  relation: string;
  linked: boolean;
  family_total_assets: number;
  family_net_worth: number;
  accepted_invitations: number;
  pending_invitations: number;
  link_status: string;
  wealth_category: string;
}

const FamilySummary: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [familySummaries, setFamilySummaries] = useState<FamilySummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRelation, setFilterRelation] = useState('all');
  const [filterLinked, setFilterLinked] = useState('all');
  const [filterWealth, setFilterWealth] = useState('all');
  const [selectedFamily, setSelectedFamily] = useState<FamilySummary | null>(null);

  useEffect(() => {
    const fetchFamilySummaries = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error } = await supabase
          .from('family_summary')
          .select('*');

        if (error) throw error;
        setFamilySummaries(data || []);
      } catch (err) {
        console.error('Error fetching family summaries:', err);
        setError('Failed to fetch family summary data');
        toast({
          title: "Erreur",
          description: "Impossible de charger les données familiales",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchFamilySummaries();
  }, [toast]);

  const formatCurrency = (amount: number) => {
    if (amount === null || amount === undefined || isNaN(amount)) return 'N/A';
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getRelationBadgeVariant = (relation: string) => {
    if (!relation) return 'secondary';
    switch (relation.toLowerCase()) {
      case 'conjoint':
      case 'époux':
      case 'épouse':
        return 'destructive';
      case 'enfant':
      case 'fils':
      case 'fille':
        return 'default';
      case 'parent':
      case 'père':
      case 'mère':
        return 'secondary';
      case 'frère':
      case 'sœur':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  const getWealthBadgeVariant = (category: string) => {
    if (!category) return 'secondary';
    switch (category.toLowerCase()) {
      case 'patrimoine modeste':
        return 'outline';
      case 'patrimoine moyen':
        return 'default';
      case 'patrimoine important':
        return 'secondary';
      case 'patrimoine très élevé':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  };

  const filteredFamilies = familySummaries.filter(family => {
    const nameMatch = 
      `${family.user1_first_name} ${family.user1_last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${family.user2_first_name} ${family.user2_last_name}`.toLowerCase().includes(searchTerm.toLowerCase());
    const relationMatch = filterRelation === 'all' || family.relation === filterRelation;
    const linkedMatch = filterLinked === 'all' || 
      (filterLinked === 'true' && family.linked) ||
      (filterLinked === 'false' && !family.linked);
    const wealthMatch = filterWealth === 'all' || family.wealth_category === filterWealth;
    
    return nameMatch && relationMatch && linkedMatch && wealthMatch;
  });

  // Statistics calculations
  const totalFamilyAssets = familySummaries.reduce((sum, family) => {
    const assets = family.family_total_assets;
    return sum + (assets && !isNaN(assets) ? assets : 0);
  }, 0);
  const totalFamilyNetWorth = familySummaries.reduce((sum, family) => {
    const netWorth = family.family_net_worth;
    return sum + (netWorth && !isNaN(netWorth) ? netWorth : 0);
  }, 0);
  const averageFamilyAssets = familySummaries.length > 0 ? totalFamilyAssets / familySummaries.length : 0;
  const averageFamilyNetWorth = familySummaries.length > 0 ? totalFamilyNetWorth / familySummaries.length : 0;
  const linkedFamilies = familySummaries.filter(family => family.linked).length;

  // Get unique relations and wealth categories for filters
  const relationStats = [...new Set(familySummaries.map(f => f.relation).filter(Boolean))];
  const wealthCategoryStats = [...new Set(familySummaries.map(f => f.wealth_category).filter(Boolean))];

  const exportToCSV = () => {
    const csvData = filteredFamilies.map(family => ({
      'ID Famille': family.family_id,
      'Membre 1': `${family.user1_first_name} ${family.user1_last_name}`,
      'Membre 2': `${family.user2_first_name} ${family.user2_last_name}`,
      'Relation': family.relation,
      'Statut': family.linked ? 'Liée' : 'Non liée',
      'Patrimoine Total': family.family_total_assets,
      'Patrimoine Net': family.family_net_worth,
      'Catégorie Patrimoine': family.wealth_category,
      'Invitations Acceptées': family.accepted_invitations,
      'Invitations En Attente': family.pending_invitations
    }));

    const csv = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `familles-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8 animate-fade-in p-6">
      {/* Enhanced Header with glassmorphism */}
      <div className="glass-card p-8 rounded-2xl relative overflow-hidden border-white/20">
        <div className="absolute inset-0 gradient-primary opacity-5"></div>
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-eparnova-blue via-eparnova-green to-eparnova-gold bg-clip-text text-transparent">
                Synthèse des Familles
              </h1>
              <p className="text-muted-foreground mt-2 text-lg">
                Analyse complète des liens familiaux et du patrimoine
              </p>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-2">
            <Users className="h-10 w-10 text-eparnova-blue animate-float" />
            <Heart className="h-8 w-8 text-eparnova-green animate-float" style={{animationDelay: '1s'}} />
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute top-4 right-4 w-24 h-24 gradient-success rounded-full opacity-10 animate-float"></div>
        <div className="absolute bottom-4 left-4 w-20 h-20 gradient-warning rounded-full opacity-10 animate-float" style={{animationDelay: '2s'}}></div>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive" className="animate-slide-in">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Enhanced Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="glass-card border-white/20 hover:shadow-lg transition-all duration-300 relative overflow-hidden">
          <div className="absolute inset-0 gradient-primary opacity-5"></div>
          <CardContent className="p-6 relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Familles</p>
                <p className="text-3xl font-bold text-foreground">{familySummaries.length}</p>
                <p className="text-xs text-muted-foreground mt-1">familles référencées</p>
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
                <p className="text-sm font-medium text-muted-foreground">Familles Liées</p>
                <p className="text-3xl font-bold text-green-600">{linkedFamilies}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {((linkedFamilies / (familySummaries.length || 1)) * 100).toFixed(1)}% du total
                </p>
              </div>
              <div className="p-3 gradient-success rounded-xl">
                <Link className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-white/20 hover:shadow-lg transition-all duration-300 relative overflow-hidden">
          <div className="absolute inset-0 gradient-warning opacity-5"></div>
          <CardContent className="p-6 relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Patrimoine Moyen</p>
                <p className="text-2xl font-bold text-blue-600">{formatCurrency(averageFamilyAssets)}</p>
                <p className="text-xs text-muted-foreground mt-1">par famille</p>
              </div>
              <div className="p-3 gradient-warning rounded-xl">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-white/20 hover:shadow-lg transition-all duration-300 relative overflow-hidden">
          <div className="absolute inset-0 gradient-gold opacity-5"></div>
          <CardContent className="p-6 relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Patrimoine Net</p>
                <p className="text-2xl font-bold text-emerald-600">{formatCurrency(averageFamilyNetWorth)}</p>
                <p className="text-xs text-muted-foreground mt-1">moyenne nette</p>
              </div>
              <div className="p-3 gradient-gold rounded-xl">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Filters */}
      <Card className="glass-card border-white/20">
        <CardHeader className="pb-4">
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-eparnova-blue" />
            <CardTitle className="text-lg">Filtres et Recherche</CardTitle>
          </div>
          <CardDescription>Affinez votre recherche avec les filtres ci-dessous</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Rechercher une famille</label>
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
              <label className="text-sm font-medium">Type de Relation</label>
              <Select value={filterRelation} onValueChange={setFilterRelation}>
                <SelectTrigger className="glass border-white/30 hover:border-white/50">
                  <SelectValue placeholder="Toutes les relations" />
                </SelectTrigger>
                <SelectContent className="glass-card border-white/20">
                  <SelectItem value="all">Toutes</SelectItem>
                  {relationStats.map(relation => (
                    <SelectItem key={relation} value={relation}>{relation}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Statut de Liaison</label>
              <Select value={filterLinked} onValueChange={setFilterLinked}>
                <SelectTrigger className="glass border-white/30 hover:border-white/50">
                  <SelectValue placeholder="Tous les statuts" />
                </SelectTrigger>
                <SelectContent className="glass-card border-white/20">
                  <SelectItem value="all">Tous</SelectItem>
                  <SelectItem value="true">Liées</SelectItem>
                  <SelectItem value="false">Non liées</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Catégorie Patrimoine</label>
              <Select value={filterWealth} onValueChange={setFilterWealth}>
                <SelectTrigger className="glass border-white/30 hover:border-white/50">
                  <SelectValue placeholder="Toutes les catégories" />
                </SelectTrigger>
                <SelectContent className="glass-card border-white/20">
                  <SelectItem value="all">Toutes</SelectItem>
                  {wealthCategoryStats.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex justify-between items-center mt-6 pt-4 border-t border-white/10">
            <div className="text-sm text-muted-foreground">
              {filteredFamilies.length} famille(s) trouvée(s) sur {familySummaries.length} au total
            </div>
            <Button 
              onClick={exportToCSV}
              variant="outline"
              className="glass border-white/30 hover:glass-card"
              disabled={filteredFamilies.length === 0}
            >
              <Download className="h-4 w-4 mr-2" />
              Exporter CSV
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Table */}
      <Card className="glass-card border-white/20">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5 text-eparnova-blue" />
            <span>Liste des Familles</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-eparnova-blue"></div>
              <span className="ml-3 text-muted-foreground">Chargement des données...</span>
            </div>
          ) : (
            <div className="rounded-lg border border-white/20 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-white/5 hover:bg-white/10">
                    <TableHead className="font-semibold">Membres de la Famille</TableHead>
                    <TableHead className="font-semibold">Relation</TableHead>
                    <TableHead className="font-semibold">Statut</TableHead>
                    <TableHead className="font-semibold text-right">Patrimoine Total</TableHead>
                    <TableHead className="font-semibold text-right">Patrimoine Net</TableHead>
                    <TableHead className="font-semibold">Catégorie</TableHead>
                    <TableHead className="font-semibold text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredFamilies.map((family) => (
                    <TableRow key={family.family_id} className="hover:bg-white/5 transition-colors">
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="flex -space-x-2">
                            <Avatar className="h-9 w-9 border-2 border-white/20">
                              <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm font-medium">
                                {getInitials(family.user1_first_name, family.user1_last_name)}
                              </AvatarFallback>
                            </Avatar>
                            <Avatar className="h-9 w-9 border-2 border-white/20">
                              <AvatarFallback className="bg-gradient-to-r from-green-500 to-teal-500 text-white text-sm font-medium">
                                {getInitials(family.user2_first_name, family.user2_last_name)}
                              </AvatarFallback>
                            </Avatar>
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{family.user1_first_name} {family.user1_last_name}</p>
                            <p className="text-sm text-muted-foreground">{family.user2_first_name} {family.user2_last_name}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getRelationBadgeVariant(family.relation) as any} className="flex items-center space-x-1">
                          <Heart className="h-3 w-3" />
                          <span>{family.relation || 'Non défini'}</span>
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Badge variant={family.linked ? "default" : "outline"} className="flex items-center space-x-1">
                            {family.linked ? <CheckCircle className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                            <span>{family.linked ? 'Liée' : 'Non liée'}</span>
                          </Badge>
                          {family.pending_invitations > 0 && (
                            <Badge variant="destructive" className="text-xs">
                              {family.pending_invitations} en attente
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-medium text-blue-600">
                        {formatCurrency(family.family_total_assets)}
                      </TableCell>
                      <TableCell className={`text-right font-medium ${
                        family.family_net_worth >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {formatCurrency(family.family_net_worth)}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getWealthBadgeVariant(family.wealth_category) as any}>
                          {family.wealth_category || 'Non défini'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="glass hover:glass-card"
                              onClick={() => setSelectedFamily(family)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="glass-card border-white/20 max-w-2xl">
                            <DialogHeader>
                              <DialogTitle className="flex items-center space-x-2">
                                <Users className="h-5 w-5 text-eparnova-blue" />
                                <span>Détails de la Famille</span>
                              </DialogTitle>
                              <DialogDescription>
                                Informations détaillées sur cette famille
                              </DialogDescription>
                            </DialogHeader>
                            
                            {selectedFamily && (
                              <div className="space-y-6 py-4">
                                {/* Family Members Section */}
                                <div className="space-y-4">
                                  <h3 className="text-lg font-semibold flex items-center space-x-2">
                                    <Users className="h-5 w-5 text-eparnova-blue" />
                                    <span>Membres de la Famille</span>
                                  </h3>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Card className="glass border-white/10">
                                      <CardContent className="p-4">
                                        <div className="flex items-center space-x-3">
                                          <Avatar className="h-12 w-12">
                                            <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                                              {getInitials(selectedFamily.user1_first_name, selectedFamily.user1_last_name)}
                                            </AvatarFallback>
                                          </Avatar>
                                          <div>
                                            <p className="font-semibold">{selectedFamily.user1_first_name} {selectedFamily.user1_last_name}</p>
                                            <p className="text-sm text-muted-foreground">ID: {selectedFamily.user1_id.slice(0, 8)}...</p>
                                          </div>
                                        </div>
                                      </CardContent>
                                    </Card>
                                    <Card className="glass border-white/10">
                                      <CardContent className="p-4">
                                        <div className="flex items-center space-x-3">
                                          <Avatar className="h-12 w-12">
                                            <AvatarFallback className="bg-gradient-to-r from-green-500 to-teal-500 text-white">
                                              {getInitials(selectedFamily.user2_first_name, selectedFamily.user2_last_name)}
                                            </AvatarFallback>
                                          </Avatar>
                                          <div>
                                            <p className="font-semibold">{selectedFamily.user2_first_name} {selectedFamily.user2_last_name}</p>
                                            <p className="text-sm text-muted-foreground">ID: {selectedFamily.user2_id.slice(0, 8)}...</p>
                                          </div>
                                        </div>
                                      </CardContent>
                                    </Card>
                                  </div>
                                </div>

                                <Separator className="bg-white/10" />

                                {/* Relationship & Status Section */}
                                <div className="space-y-4">
                                  <h3 className="text-lg font-semibold flex items-center space-x-2">
                                    <Heart className="h-5 w-5 text-eparnova-green" />
                                    <span>Relation & Statut</span>
                                  </h3>
                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="text-center">
                                      <p className="text-sm text-muted-foreground mb-2">Relation</p>
                                      <Badge variant={getRelationBadgeVariant(selectedFamily.relation) as any} className="text-sm px-3 py-1">
                                        {selectedFamily.relation || 'Non défini'}
                                      </Badge>
                                    </div>
                                    <div className="text-center">
                                      <p className="text-sm text-muted-foreground mb-2">Statut de Liaison</p>
                                      <Badge variant={selectedFamily.linked ? "default" : "outline"} className="text-sm px-3 py-1">
                                        {selectedFamily.linked ? 'Liée' : 'Non liée'}
                                      </Badge>
                                    </div>
                                    <div className="text-center">
                                      <p className="text-sm text-muted-foreground mb-2">Invitations</p>
                                      <div className="flex justify-center space-x-1">
                                        <Badge variant="default" className="text-xs">
                                          ✓ {selectedFamily.accepted_invitations}
                                        </Badge>
                                        {selectedFamily.pending_invitations > 0 && (
                                          <Badge variant="destructive" className="text-xs">
                                            ⏳ {selectedFamily.pending_invitations}
                                          </Badge>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                <Separator className="bg-white/10" />

                                {/* Financial Section */}
                                <div className="space-y-4">
                                  <h3 className="text-lg font-semibold flex items-center space-x-2">
                                    <DollarSign className="h-5 w-5 text-eparnova-gold" />
                                    <span>Informations Financières</span>
                                  </h3>
                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <Card className="glass border-white/10">
                                      <CardContent className="p-4 text-center">
                                        <p className="text-sm text-muted-foreground mb-2">Patrimoine Total</p>
                                        <p className="text-xl font-bold text-blue-600">{formatCurrency(selectedFamily.family_total_assets)}</p>
                                      </CardContent>
                                    </Card>
                                    <Card className="glass border-white/10">
                                      <CardContent className="p-4 text-center">
                                        <p className="text-sm text-muted-foreground mb-2">Patrimoine Net</p>
                                        <p className={`text-xl font-bold ${
                                          selectedFamily.family_net_worth >= 0 ? 'text-green-600' : 'text-red-600'
                                        }`}>
                                          {formatCurrency(selectedFamily.family_net_worth)}
                                        </p>
                                      </CardContent>
                                    </Card>
                                    <Card className="glass border-white/10">
                                      <CardContent className="p-4 text-center">
                                        <p className="text-sm text-muted-foreground mb-2">Catégorie</p>
                                        <Badge variant={getWealthBadgeVariant(selectedFamily.wealth_category) as any} className="text-sm">
                                          {selectedFamily.wealth_category || 'Non défini'}
                                        </Badge>
                                      </CardContent>
                                    </Card>
                                  </div>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              {filteredFamilies.length === 0 && !loading && (
                <div className="text-center py-12">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <p className="text-muted-foreground">Aucune famille trouvée</p>
                  <p className="text-sm text-muted-foreground mt-1">Essayez de modifier vos critères de recherche</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default FamilySummary;