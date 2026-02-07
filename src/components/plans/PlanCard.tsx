import { type PlanFromAPI } from '@/components/plans/PlansSection';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Sparkles, Zap, Crown } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface PlanCardProps {
  plan: PlanFromAPI;
  onSelectPlan: (planId: string) => void;
}

function formatPrice(priceINR: number, priceUSD: number): string {
  if (priceINR === 0 && priceUSD === 0) return 'Free';
  return `₹${priceINR.toLocaleString()}`;
}

function formatTokens(tokens: number): string {
  if (tokens >= 1000000) return `${(tokens / 1000000).toFixed(1)}M`;
  if (tokens >= 1000) return `${(tokens / 1000).toFixed(0)}K`;
  return tokens.toString();
}

export function PlanCard({ plan, onSelectPlan }: PlanCardProps) {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();

  const isPaid = plan.priceINR > 0 || plan.priceUSD > 0;

  const handleSelectPlan = () => {
    if (!isAuthenticated && isPaid) {
      toast({
        title: 'Login required',
        description: 'Please login to purchase a plan.',
        variant: 'destructive',
      });
      return;
    }
    onSelectPlan(plan.id);
  };

  const getIcon = () => {
    if (!isPaid) return <Sparkles className="w-5 h-5" />;
    if (plan.name.toLowerCase().includes('pro')) return <Zap className="w-5 h-5" />;
    return <Crown className="w-5 h-5" />;
  };

  const getGradient = () => {
    if (!isPaid) return 'from-slate-500 to-slate-600';
    if (plan.name.toLowerCase().includes('pro')) return 'from-blue-500 to-purple-600';
    return 'from-purple-500 to-pink-600';
  };

  return (
    <Card className={`relative ${plan.recommended ? 'border-2 border-primary shadow-lg scale-105' : ''}`}>
      {plan.recommended && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 px-4">
            Most Popular
          </Badge>
        </div>
      )}

      <CardHeader>
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getGradient()} flex items-center justify-center mb-3`}>
          <div className="text-white">
            {getIcon()}
          </div>
        </div>
        <CardTitle className="text-2xl">{plan.name}</CardTitle>
        <CardDescription>{plan.description}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Price */}
        <div>
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-bold">{formatPrice(plan.priceINR, plan.priceUSD)}</span>
            {isPaid && (
              <span className="text-muted-foreground">/month</span>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {formatTokens(plan.tokenLimit)} tokens
          </p>
        </div>

        {/* Features */}
        <ul className="space-y-2">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-start gap-2">
              <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <span className="text-sm">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>

      <CardFooter>
        <Button
          onClick={handleSelectPlan}
          className={`w-full ${
            plan.recommended
              ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
              : ''
          }`}
          variant={plan.recommended ? 'default' : 'outline'}
          size="lg"
        >
          {!isPaid ? 'Get Started' : 'Upgrade Now'}
        </Button>
      </CardFooter>
    </Card>
  );
}
