import { useEffect, useState } from 'react';
import { PlanCard } from '@/components/plans/PlanCard';
import { useToast } from '@/hooks/use-toast';
import { Sparkles, TrendingUp, Shield } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export interface PlanFromAPI {
  id: string;
  name: string;
  description: string;
  tokenLimit: number;
  priceINR: number;
  priceUSD: number;
  currencyVisibility: 'INR' | 'USD' | 'BOTH';
  features: string[];
  recommended: boolean;
}

export function PlansSection() {
  const [plans, setPlans] = useState<PlanFromAPI[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchPlans() {
      try {
        const res = await fetch(`${API_BASE}/api/users/plans`);
        if (res.ok) {
          const data = await res.json();
          setPlans(data.plans || []);
        }
      } catch (error) {
        console.error('Failed to fetch plans:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchPlans();
  }, []);

  const handleSelectPlan = (planId: string) => {
    toast({
      title: 'Plan selected',
      description: `You selected the ${planId} plan. Payment integration coming soon!`,
    });
  };

  if (loading) {
    return (
      <section className="py-20 px-4 bg-gradient-to-b from-background to-muted/20">
        <div className="container max-w-6xl mx-auto text-center">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-64 mx-auto"></div>
            <div className="h-4 bg-muted rounded w-96 mx-auto"></div>
            <div className="grid md:grid-cols-3 gap-8 mt-12">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-96 bg-muted rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (plans.length === 0) return null;

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-background to-muted/20">
      <div className="container max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            Simple, Transparent Pricing
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Choose Your Plan
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Start free and scale as you grow. All plans include access to our powerful AI humanization engine.
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {plans.map((plan) => (
            <PlanCard key={plan.id} plan={plan} onSelectPlan={handleSelectPlan} />
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="grid md:grid-cols-3 gap-6 mt-16 pt-12 border-t">
          <div className="flex flex-col items-center text-center p-6">
            <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center mb-3">
              <Shield className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold mb-2">Secure & Private</h3>
            <p className="text-sm text-muted-foreground">
              Your data is encrypted and never shared with third parties
            </p>
          </div>

          <div className="flex flex-col items-center text-center p-6">
            <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center mb-3">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold mb-2">Scale Anytime</h3>
            <p className="text-sm text-muted-foreground">
              Upgrade or downgrade your plan at any time with no penalties
            </p>
          </div>

          <div className="flex flex-col items-center text-center p-6">
            <div className="w-12 h-12 rounded-full bg-pink-500/10 flex items-center justify-center mb-3">
              <Sparkles className="w-6 h-6 text-pink-600" />
            </div>
            <h3 className="font-semibold mb-2">Premium Support</h3>
            <p className="text-sm text-muted-foreground">
              Get help when you need it with our dedicated support team
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
