
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Award } from 'lucide-react';

type WealthScoreProps = {
  score: number;
};

const WealthScore = ({ score }: WealthScoreProps) => {
  const getScoreColor = (value: number) => {
    if (value < 40) return 'text-red-500';
    if (value < 70) return 'text-eparnova-gold';
    return 'text-green-500';
  };

  const getScoreText = (value: number) => {
    if (value < 40) return 'À améliorer';
    if (value < 70) return 'Bon';
    return 'Excellent';
  };

  return (
    <Card className="border-none shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <Award className="w-5 h-5 mr-2 text-eparnova-blue" />
          Wealth Score
        </CardTitle>
        <CardDescription>
          Évaluation globale de votre patrimoine
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-2">
          <div>
            <span className={`text-3xl font-bold ${getScoreColor(score)}`}>
              {score}
            </span>
            <span className="text-muted-foreground text-sm ml-1">/100</span>
          </div>
          <span className={`font-medium text-sm ${getScoreColor(score)}`}>
            {getScoreText(score)}
          </span>
        </div>

        <Progress 
          value={score} 
          className="h-2 bg-muted"
          style={{
            '--progress-background': score < 40 ? '#ef4444' : score < 70 ? '#E6AF2E' : '#22c55e'
          } as any} 
        />

        <div className="mt-4 space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Diversification</span>
            <span className="font-medium">Bonne</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Liquidité</span>
            <span className="font-medium">Excellente</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Rendement</span>
            <span className="font-medium">À optimiser</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Protection</span>
            <span className="font-medium">Moyenne</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WealthScore;
