
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Mail, Phone, MapPin, Clock, ArrowRight } from 'lucide-react';

const ContactPage = () => {
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message envoyé",
      description: "Nous avons bien reçu votre message. Un conseiller vous répondra dans les plus brefs délais.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-eparnova-blue">Contact</h1>
        <p className="text-muted-foreground mt-1">Besoin d'aide ou d'informations ? Contactez-nous</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Nous contacter</CardTitle>
            <CardDescription>Envoyez-nous un message et nous vous répondrons dans les plus brefs délais</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Prénom</Label>
                  <Input id="firstName" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Nom</Label>
                  <Input id="lastName" required />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" required />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="subject">Sujet</Label>
                <Input id="subject" required />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea id="message" rows={5} required />
              </div>
              
              <Button type="submit" className="w-full">Envoyer le message</Button>
            </form>
          </CardContent>
        </Card>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Coordonnées</CardTitle>
              <CardDescription>Différentes façons de nous joindre</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-eparnova-blue mt-0.5" />
                <div>
                  <div className="font-medium">Téléphone</div>
                  <div className="text-muted-foreground">01 23 45 67 89</div>
                  <div className="text-xs text-muted-foreground mt-1">Du lundi au vendredi, 9h-18h</div>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-eparnova-blue mt-0.5" />
                <div>
                  <div className="font-medium">Email</div>
                  <div className="text-muted-foreground">contact@eparnova.fr</div>
                  <div className="text-xs text-muted-foreground mt-1">Réponse sous 24h</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Nos agences</CardTitle>
              <CardDescription>Venez nous rencontrer</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <h3 className="font-medium">EPARNOVA Paris</h3>
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-eparnova-blue mt-0.5" />
                  <div>
                    <div className="text-muted-foreground">25 rue de la Paix, 75002 Paris</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-eparnova-blue mt-0.5" />
                  <div>
                    <div className="text-muted-foreground">Lun-Ven: 9h-18h</div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <h3 className="font-medium">EPARNOVA Lyon</h3>
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-eparnova-blue mt-0.5" />
                  <div>
                    <div className="text-muted-foreground">15 rue de la République, 69002 Lyon</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-eparnova-blue mt-0.5" />
                  <div>
                    <div className="text-muted-foreground">Lun-Ven: 9h-18h</div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                <span>Prendre rendez-vous en agence</span>
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
