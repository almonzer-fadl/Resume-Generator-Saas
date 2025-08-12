"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Crown, Star, Zap } from "lucide-react";
import Link from "next/link";

// Local subscription plans configuration
const SUBSCRIPTION_PLANS = {
  free: {
    name: 'Free',
    price: 0,
    features: [
      '2 limited basic AI generations/month',
      'Basic templates',
      'PDF export',
      'No save functionality',
      'Email support'
    ],
    limits: {
      aiGenerations: 2,
      canSave: false
    }
  },
  pro: {
    name: 'Pro',
    price: 9.99,
    features: [
      'Unlimited AI generations',
      'Save & edit resumes',
      'Premium templates',
      'Advanced AI generation',
      'Priority support',
      'Custom branding',
      'ATS optimization',
      'Multiple formats (PDF, DOCX)'
    ],
    limits: {
      aiGenerations: -1, // Unlimited
      canSave: true
    }
  },
  lifetime: {
    name: 'Lifetime',
    price: 35.99,
    features: [
      'All Pro features forever',
      'One-time payment',
      'Lifetime updates',
      'Premium support',
      'Early access to new features',
      'No recurring fees'
    ],
    limits: {
      aiGenerations: -1, // Unlimited
      canSave: true
    }
  }
};

// Helper function to format price
const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
};

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState('monthly');

  const handleUpgrade = (plan: string) => {
    if (plan === 'free') {
      // Handle downgrade to free
      return;
    }

    // For now, just show an alert - this will be configured when billing is set up
    alert(`Upgrade to ${plan} plan - billing will be configured soon!`);
  };

  const getPlanPrice = (plan: string) => {
    if (plan === 'free') return 0;
    if (plan === 'lifetime') return 35.99;
    
    const basePrice = SUBSCRIPTION_PLANS[plan as keyof typeof SUBSCRIPTION_PLANS].price;
    if (billingCycle === 'yearly') {
      return basePrice * 12 * 0.8; // 20% discount for yearly
    }
    return basePrice;
  };

  const getBillingText = (plan: string) => {
    if (plan === 'free') return '';
    if (plan === 'lifetime') return 'one-time';
    
    if (billingCycle === 'yearly') {
      return '/month, billed yearly';
    }
    return '/month';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Start free and upgrade as you grow. All plans include our core features with transparent pricing.
          </p>
        </div>

        {/* Billing Toggle - Only show for Pro plan */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg p-1 shadow-sm border">
            <div className="flex">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  billingCycle === 'monthly'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-gray-700 hover:text-gray-900'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle('yearly')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  billingCycle === 'yearly'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-gray-700 hover:text-gray-900'
                }`}
              >
                Yearly
                <span className="ml-1 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                  Save 20%
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Free Plan */}
          <Card className="relative">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2">
                <Star className="h-5 w-5 text-yellow-500" />
                Free
              </CardTitle>
              <CardDescription>Perfect for getting started</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold text-gray-900">
                  {formatPrice(0)}
                </span>
                <span className="text-gray-600">/month</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3">
                {SUBSCRIPTION_PLANS.free.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button 
                className="w-full" 
                variant="outline"
                onClick={() => handleUpgrade('free')}
              >
                Get Started Free
              </Button>
            </CardContent>
          </Card>

          {/* Pro Plan */}
          <Card className="relative border-2 border-blue-500 shadow-lg">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                Most Popular
              </span>
            </div>
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2">
                <Zap className="h-5 w-5 text-blue-500" />
                Pro
              </CardTitle>
              <CardDescription>For professionals and job seekers</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold text-gray-900">
                  {formatPrice(getPlanPrice('pro'))}
                </span>
                <span className="text-gray-600">{getBillingText('pro')}</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3">
                {SUBSCRIPTION_PLANS.pro.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700" 
                onClick={() => handleUpgrade('pro')}
              >
                Start Pro Trial
              </Button>
            </CardContent>
          </Card>

          {/* Lifetime Plan */}
          <Card className="relative">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <span className="bg-purple-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                Best Value
              </span>
            </div>
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2">
                <Crown className="h-5 w-5 text-purple-500" />
                Lifetime
              </CardTitle>
              <CardDescription>One-time payment, forever access</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold text-gray-900">
                  {formatPrice(35.99)}
                </span>
                <span className="text-gray-600">one-time</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3">
                {SUBSCRIPTION_PLANS.lifetime.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button 
                className="w-full bg-purple-600 hover:bg-purple-700" 
                onClick={() => handleUpgrade('lifetime')}
              >
                Get Lifetime Access
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-lg shadow-sm border p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Frequently Asked Questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Can I cancel my subscription anytime?
              </h3>
              <p className="text-gray-600">
                Yes, you can cancel your Pro subscription at any time. You&apos;ll continue to have access until the end of your current billing period.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Do you offer refunds?
              </h3>
              <p className="text-gray-600">
                We offer a 30-day money-back guarantee for Pro subscriptions. Lifetime purchases are non-refundable but come with our satisfaction guarantee.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                What&apos;s included in the Lifetime plan?
              </h3>
              <p className="text-gray-600">
                The Lifetime plan includes all Pro features forever with no recurring fees. You&apos;ll get lifetime updates and access to new features.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Is there a free trial?
              </h3>
              <p className="text-gray-600">
                Yes, the Pro plan comes with a 7-day free trial. No credit card required to start. The Free plan is always available.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Ready to create your professional resume?
          </h2>
          <p className="text-gray-600 mb-6">
            Join thousands of users who have landed their dream jobs with our AI-powered resume builder.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/resume">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                Get Started Free
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button size="lg" variant="outline">
                View Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
