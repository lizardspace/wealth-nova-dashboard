
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { PiggyBank, BarChart3, ArrowRight } from 'lucide-react';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { 
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

type AssetItem = {
  name: string;
  value: number;
  color: string;
  details?: Array<{name: string; value: number; description?: string}>;
};

type AssetDistributionProps = {
  data?: Array<AssetItem>;
};

const defaultData: AssetItem[] = [
  { 
    name: 'Immobilier', 
    value: 60, 
    color: '#0A2463',
    details: [
      {name: 'Résidence principale', value: 40, description: 'Appartement 3 pièces à Paris'},
      {name: 'Investissement locatif', value: 15, description: 'Studio à Lyon'},
      {name: 'SCPI', value: 5, description: 'SCPI Primovie'}
    ]
  },
  { 
    name: 'Actions', 
    value: 15, 
    color: '#247BA0',
    details: [
      {name: 'ETF Monde', value: 7, description: 'MSCI World'},
      {name: 'Actions européennes', value: 5, description: 'Portefeuille diversifié'},
      {name: 'Actions US', value: 3, description: 'Principalement technologie'}
    ]
  },
  { 
    name: 'Obligations', 
    value: 10, 
    color: '#2E933C',
    details: [
      {name: 'Fonds en euros', value: 7, description: 'Via assurance-vie'},
      {name: 'Obligations d\'entreprises', value: 3, description: 'Investment grade'}
    ]
  },
  { 
    name: 'Liquidités', 
    value: 10, 
    color: '#E6AF2E',
    details: [
      {name: 'Livret A', value: 5, description: 'Épargne de précaution'},
      {name: 'LDDS', value: 3, description: 'Épargne réglementée'},
      {name: 'Compte courant', value: 2, description: 'Trésorerie courante'}
    ]
  },
  { 
    name: 'Autres', 
    value: 5, 
    color: '#F9D56E',
    details: [
      {name: 'Or', value: 2, description: 'Valeur refuge'},
      {name: 'Cryptomonnaies', value: 1, description: 'Bitcoin et Ethereum'},
      {name: 'Collections', value: 2, description: 'Art et objets de valeur'}
    ]
  },
];

const AssetDistributionChart = ({ data = defaultData }: AssetDistributionProps) => {
  const [selectedAsset, setSelectedAsset] = useState<AssetItem | null>(null);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [sheetOpen, setSheetOpen] = useState<boolean>(false);
  const [showDetailedAnalysis, setShowDetailedAnalysis] = useState<boolean>(false);
  
  const handleClick = (entry: any) => {
    const asset = data.find(item => item.name === entry.name);
    if (asset) {
      setSelectedAsset(asset);
      // Use dialog on mobile, sheet on desktop
      if (window.innerWidth < 640) {
        setDialogOpen(true);
      } else {
        setSheetOpen(true);
      }
    }
  };

  const getRecommendation = (assetName: string) => {
    switch(assetName) {
      case 'Immobilier':
        return "Votre allocation immobilière est élevée (60%). Envisagez de diversifier vers d'autres classes d'actifs pour réduire votre concentration.";
      case 'Actions':
        return "Avec 15% en actions, vous pourriez augmenter cette exposition pour améliorer votre potentiel de rendement à long terme.";
      case 'Obligations':
        return "Votre allocation en obligations (10%) est adaptée comme stabilisateur de portefeuille.";
      case 'Liquidités':
        return "Votre niveau de liquidités (10%) est adéquat pour une réserve de sécurité.";
      default:
        return "Cette classe d'actifs représente une faible part de votre patrimoine.";
    }
  };
  
  return (
    <>
      <Card className="border-none shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <PiggyBank className="w-5 h-5 mr-2 text-eparnova-blue" />
            Répartition des Actifs
          </CardTitle>
          <CardDescription>
            Vue d'ensemble de votre portefeuille
            <span className="block text-xs text-eparnova-blue mt-1 font-medium animate-pulse">
              Cliquez sur un segment pour voir les détails
            </span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={75}
                  paddingAngle={2}
                  dataKey="value"
                  label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                  onClick={handleClick}
                  className="cursor-pointer hover-scale"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} className="hover:opacity-80 transition-opacity" />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value}%`} />
                <Legend layout="vertical" align="right" verticalAlign="middle" onClick={handleClick} className="cursor-pointer" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      {/* Dialog for mobile view */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{backgroundColor: selectedAsset?.color}}
              ></div>
              Détails - {selectedAsset?.name}
            </DialogTitle>
            <DialogDescription>
              {selectedAsset?.value}% de votre patrimoine total
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            {selectedAsset?.details?.map((detail, index) => (
              <div key={index} className="bg-muted/20 p-3 rounded-md hover:bg-muted/30 transition-colors animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium">{detail.name}</span>
                  <span className="text-sm text-muted-foreground">{detail.value}%</span>
                </div>
                {detail.description && (
                  <p className="text-xs text-muted-foreground">{detail.description}</p>
                )}
              </div>
            ))}

            <div className="mt-2 pt-2 border-t">
              <h4 className="font-medium text-sm mb-2">Recommandation IA</h4>
              <p className="text-xs text-muted-foreground">
                {selectedAsset && getRecommendation(selectedAsset.name)}
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Fermer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Sheet for desktop view */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="w-[400px] sm:w-[540px]">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <div 
                className="w-4 h-4 rounded-full" 
                style={{backgroundColor: selectedAsset?.color}}
              ></div>
              Analyse détaillée - {selectedAsset?.name}
            </SheetTitle>
            <SheetDescription>
              {selectedAsset?.value}% de votre patrimoine total ({selectedAsset?.name})
            </SheetDescription>
          </SheetHeader>

          <div className="mt-6 space-y-6">
            <div className="space-y-3">
              <h3 className="text-lg font-medium">Composition</h3>
              {selectedAsset?.details?.map((detail, index) => (
                <div key={index} className="bg-muted/20 p-3 rounded-md hover:bg-muted/30 transition-colors animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium">{detail.name}</span>
                    <span className="text-sm text-muted-foreground">{detail.value}%</span>
                  </div>
                  {detail.description && (
                    <p className="text-xs text-muted-foreground">{detail.description}</p>
                  )}
                </div>
              ))}
            </div>

            <div className="p-4 border rounded-md">
              <h3 className="text-base font-medium flex items-center gap-2 mb-3">
                <BarChart3 className="h-4 w-4 text-eparnova-blue" />
                Analyse et recommandations
              </h3>
              <p className="text-sm mb-4">
                {selectedAsset && getRecommendation(selectedAsset.name)}
              </p>
              
              {!showDetailedAnalysis ? (
                <Button 
                  variant="outline" 
                  size="sm"
                  className="w-full justify-between"
                  onClick={() => setShowDetailedAnalysis(true)}
                >
                  <span>Voir l'analyse complète</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              ) : (
                <div className="space-y-3 animate-fade-in">
                  <h4 className="font-medium text-sm">Points d'attention</h4>
                  <ul className="text-xs space-y-2">
                    <li className="flex gap-2">
                      <div className="h-4 w-4 rounded-full bg-amber-400 mt-0.5"></div>
                      <span>Votre exposition à cette classe d'actifs {selectedAsset?.value && selectedAsset.value > 30 ? "est élevée" : "pourrait être optimisée"}</span>
                    </li>
                    <li className="flex gap-2">
                      <div className="h-4 w-4 rounded-full bg-green-400 mt-0.5"></div>
                      <span>Performance historique: {selectedAsset?.name === "Actions" ? "Bonne" : selectedAsset?.name === "Immobilier" ? "Excellente" : "Stable"}</span>
                    </li>
                    <li className="flex gap-2">
                      <div className="h-4 w-4 rounded-full bg-blue-400 mt-0.5"></div>
                      <span>Diversification: {selectedAsset?.details && selectedAsset.details.length > 2 ? "Bonne" : "À améliorer"}</span>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default AssetDistributionChart;
