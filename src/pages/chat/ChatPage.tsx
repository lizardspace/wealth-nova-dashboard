
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Star, Send } from 'lucide-react';

const ChatPage = () => {
  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-eparnova-blue">Assistant IA</h1>
        <p className="text-muted-foreground mt-1">Obtenez des réponses instantanées à vos questions financières</p>
      </div>

      <div className="bg-gradient-to-br from-eparnova-gold/20 to-amber-100 p-6 rounded-md flex items-center gap-4 mb-6">
        <div className="bg-white rounded-full p-2 shadow-sm">
          <Star className="h-6 w-6 text-eparnova-gold" />
        </div>
        <div>
          <h2 className="text-lg font-medium mb-1">Fonctionnalité Premium</h2>
          <p className="text-sm text-muted-foreground">
            L'assistant IA est une fonctionnalité réservée aux membres Premium. Passez à l'abonnement Premium pour discuter avec notre assistant financier IA.
          </p>
        </div>
        <button className="ml-auto bg-eparnova-gold hover:bg-eparnova-gold/90 text-black font-medium py-2 px-4 rounded">
          Passer à Premium
        </button>
      </div>

      <Card className="opacity-60 pointer-events-none">
        <CardHeader>
          <CardTitle className="text-lg">Chat avec l'assistant EPARNOVA</CardTitle>
          <CardDescription>Posez vos questions sur la gestion de patrimoine</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-96 border rounded-md flex flex-col">
            <div className="flex-grow p-4 space-y-4 overflow-y-auto">
              <div className="flex gap-3">
                <div className="h-8 w-8 rounded-full bg-eparnova-blue flex items-center justify-center text-white text-sm font-bold">
                  E
                </div>
                <div className="bg-muted/30 rounded-lg p-3 max-w-[80%]">
                  <p className="text-sm">Bonjour ! Je suis l'assistant IA d'EPARNOVA. Comment puis-je vous aider aujourd'hui ?</p>
                </div>
              </div>
              
              <div className="flex gap-3 flex-row-reverse">
                <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm font-bold">
                  S
                </div>
                <div className="bg-eparnova-blue/10 rounded-lg p-3 max-w-[80%]">
                  <p className="text-sm">Quelles sont les meilleures options d'investissement pour se constituer une retraite complémentaire ?</p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <div className="h-8 w-8 rounded-full bg-eparnova-blue flex items-center justify-center text-white text-sm font-bold">
                  E
                </div>
                <div className="bg-muted/30 rounded-lg p-3 max-w-[80%]">
                  <p className="text-sm">Pour préparer votre retraite, plusieurs options s'offrent à vous :</p>
                  <ul className="mt-2 text-sm list-disc pl-5">
                    <li>Le Plan Épargne Retraite (PER) avec ses avantages fiscaux</li>
                    <li>L'assurance-vie, solution flexible sur le long terme</li>
                    <li>L'investissement immobilier pour générer des revenus complémentaires</li>
                    <li>Les ETF et fonds indiciels à faibles frais pour une exposition aux marchés</li>
                  </ul>
                  <p className="mt-2 text-sm">Voulez-vous que je vous détaille l'une de ces options en particulier ?</p>
                </div>
              </div>
            </div>
            
            <div className="p-3 border-t flex gap-2">
              <Input className="flex-grow" placeholder="Posez votre question..." />
              <Button className="bg-eparnova-blue hover:bg-eparnova-blue-light">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="mt-4">
            <h3 className="text-sm font-medium mb-2">Questions suggérées :</h3>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm">Comment diversifier mon portefeuille ?</Button>
              <Button variant="outline" size="sm">Optimiser ma fiscalité ?</Button>
              <Button variant="outline" size="sm">Quel PER choisir ?</Button>
              <Button variant="outline" size="sm">Stratégies d'investissement immobilier ?</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChatPage;
