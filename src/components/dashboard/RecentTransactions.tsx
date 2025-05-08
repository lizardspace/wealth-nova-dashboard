import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ArrowDown, ArrowUp, Clock, PlusCircle, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';

const transactions = [
  {
    id: 1,
    type: 'deposit',
    description: 'Dépôt Livret A',
    amount: 1000,
    date: '28 avril 2025',
    account: 'Livret A',
  },
  {
    id: 2,
    type: 'withdrawal',
    description: 'Retrait Compte Courant',
    amount: 500,
    date: '25 avril 2025',
    account: 'Compte Courant',
  },
  {
    id: 3,
    type: 'deposit',
    description: 'Versement Assurance Vie',
    amount: 2500,
    date: '20 avril 2025',
    account: 'Assurance Vie',
  },
  {
    id: 4,
    type: 'other',
    description: 'Intérêts Livret A',
    amount: 45.75,
    date: '15 avril 2025',
    account: 'Livret A',
  },
];

const RecentTransactions = () => {
  return (
    <Card className="border-none shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <Clock className="w-5 h-5 mr-2 text-eparnova-blue" />
          Mouvements récents
        </CardTitle>
        <CardDescription>Dernières opérations sur vos comptes</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {transactions.map(transaction => (
            <div key={transaction.id} className="flex items-center justify-between py-2">
              <div className="flex items-center">
                <div
                  className={`p-2 rounded-full ${
                    transaction.type === 'deposit'
                      ? 'bg-green-100'
                      : transaction.type === 'withdrawal'
                        ? 'bg-red-100'
                        : 'bg-blue-100'
                  } mr-3`}
                >
                  {transaction.type === 'deposit' ? (
                    <ArrowDown className={`h-4 w-4 text-green-600`} />
                  ) : transaction.type === 'withdrawal' ? (
                    <ArrowUp className={`h-4 w-4 text-red-600`} />
                  ) : (
                    <PlusCircle className={`h-4 w-4 text-blue-600`} />
                  )}
                </div>
                <div>
                  <div className="font-medium text-sm">{transaction.description}</div>
                  <div className="text-xs text-muted-foreground">
                    {transaction.date} • {transaction.account}
                  </div>
                </div>
              </div>
              <div
                className={`font-medium ${
                  transaction.type === 'deposit'
                    ? 'text-green-600'
                    : transaction.type === 'withdrawal'
                      ? 'text-red-600'
                      : 'text-blue-600'
                }`}
              >
                {transaction.type === 'deposit'
                  ? '+'
                  : transaction.type === 'withdrawal'
                    ? '-'
                    : '+'}
                {transaction.amount.toLocaleString('fr-FR')} €
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" size="sm" className="w-full">
          <Wallet className="mr-2 h-4 w-4" />
          Voir toutes les transactions
        </Button>
      </CardFooter>
    </Card>
  );
};

export default RecentTransactions;
