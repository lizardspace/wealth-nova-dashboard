
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Star, Info, ArrowRight } from 'lucide-react';

const products = [
  {
    id: 'life-insurance',
    title: 'Assurance Vie',
    description: 'Solution d\'épargne flexible et avantageuse fiscalement',
    performance: '3.5%',
    risk: 'Moyen',
    liquidity: 'Moyenne',
    rating: 4,
    category: 'savings',
  },
  {
    id: 'stock-fund',
    title: 'Fonds Actions',
    description: 'Investissement dans des actions diversifiées pour plus de rendement',
    performance: '8.2%',
    risk: 'Élevé',
    liquidity: 'Élevée',
    rating: 5,
    category: 'investment',
  },
  {
    id: 'real-estate-scpi',
    title: 'SCPI de rendement',
    description: 'Investissement immobilier sans les contraintes de gestion',
    performance: '4.5%',
    risk: 'Moyen',
    liquidity: 'Faible',
    rating: 4,
    category: 'property',
  },
  {
    id: 'pea',
    title: 'PEA',
    description: 'Enveloppe fiscale avantageuse pour investir en actions européennes',
    performance: '7.8%',
    risk: 'Élevé',
    liquidity: 'Moyenne',
    rating: 4,
    category: 'investment',
  },
  {
    id: 'retirement-per',
    title: 'Plan Épargne Retraite (PER)',
    description: 'Solution dédiée à la préparation de votre retraite',
    performance: '4.0%',
    risk: 'Moyen-faible',
    liquidity: 'Très faible',
    rating: 3,
    category: 'retirement',
  },
  {
    id: 'livret-a',
    title: 'Livret A',
    description: 'Épargne sécurisée et disponible, avec un rendement garanti',
    performance: '3.0%',
    risk: 'Très faible',
    liquidity: 'Très élevée',
    rating: 3,
    category: 'savings',
  },
];

const getRiskColor = (risk: string) => {
  switch(risk) {
    case 'Très faible': return 'bg-green-100 text-green-700';
    case 'Faible': return 'bg-green-100 text-green-700';
    case 'Moyen-faible': return 'bg-blue-100 text-blue-700';
    case 'Moyen': return 'bg-blue-100 text-blue-700';
    case 'Élevé': return 'bg-amber-100 text-amber-700';
    default: return 'bg-gray-100 text-gray-700';
  }
};

const ProductCard = ({ product }: { product: typeof products[0] }) => {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle>{product.title}</CardTitle>
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                className={`w-4 h-4 ${i < product.rating ? 'text-eparnova-gold fill-eparnova-gold' : 'text-gray-300'}`} 
              />
            ))}
          </div>
        </div>
        <CardDescription>{product.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="space-y-3">
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Performance annuelle</span>
            <span className="font-medium text-green-600">{product.performance}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Niveau de risque</span>
            <span className={`px-2 py-0.5 rounded-md text-xs ${getRiskColor(product.risk)}`}>
              {product.risk}
            </span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Liquidité</span>
            <span className="font-medium">{product.liquidity}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full justify-between">
          <span>En savoir plus</span>
          <ArrowRight className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

const ProductsPage = () => {
  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-eparnova-blue">Produits Financiers</h1>
        <p className="text-muted-foreground mt-1">Découvrez notre sélection de produits pour optimiser votre patrimoine</p>
      </div>

      <div className="bg-muted/20 p-4 rounded-md flex items-start gap-3 mb-6">
        <Info className="h-5 w-5 text-eparnova-blue mt-0.5" />
        <div className="text-sm">
          <p className="font-medium">Besoin de conseils personnalisés ?</p>
          <p className="text-muted-foreground">
            Nos experts financiers peuvent vous aider à choisir les produits les plus adaptés à votre situation et objectifs.
            <a href="/appointments" className="text-eparnova-blue hover:underline ml-1">Prendre rendez-vous →</a>
          </p>
        </div>
      </div>

      <Tabs defaultValue="all">
        <TabsList className="mb-6">
          <TabsTrigger value="all">Tous</TabsTrigger>
          <TabsTrigger value="savings">Épargne</TabsTrigger>
          <TabsTrigger value="investment">Investissement</TabsTrigger>
          <TabsTrigger value="property">Immobilier</TabsTrigger>
          <TabsTrigger value="retirement">Retraite</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </TabsContent>

        <TabsContent value="savings" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.filter(p => p.category === 'savings').map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </TabsContent>

        <TabsContent value="investment" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.filter(p => p.category === 'investment').map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </TabsContent>

        <TabsContent value="property" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.filter(p => p.category === 'property').map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </TabsContent>

        <TabsContent value="retirement" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.filter(p => p.category === 'retirement').map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProductsPage;
