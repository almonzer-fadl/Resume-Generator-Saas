"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, CreditCard, Settings, User } from "lucide-react";
import Link from "next/link";

// Local subscription plans configuration
const SUBSCRIPTION_PLANS = {
  free: {
    name: 'Free',
    price: 0,
    features: [
      '3 resumes per month',
      '3 cover letters per month',
      'Basic templates',
      'PDF export',
      'Email support'
    ],
    limits: {
      resumes: 3,
      coverLetters: 3,
      aiGenerations: 5
    }
  },
  pro: {
    name: 'Pro',
    price: 9.99,
    features: [
      'Unlimited resumes',
      'Unlimited cover letters',
      'All premium templates',
      'Advanced AI generation',
      'Priority support',
      'Custom branding',
      'ATS optimization',
      'Multiple formats (PDF, DOCX)'
    ],
    limits: {
      resumes: -1, // Unlimited
      coverLetters: -1, // Unlimited
      aiGenerations: -1 // Unlimited
    }
  },
  business: {
    name: 'Business',
    price: 29.99,
    features: [
      'Everything in Pro',
      'Team collaboration',
      'Bulk operations',
      'Advanced analytics',
      'White-label options',
      'API access',
      'Dedicated support'
    ],
    limits: {
      resumes: -1,
      coverLetters: -1,
      aiGenerations: -1,
      teamMembers: 10
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

export default function BillingPage() {
  // Mock subscription data until database is configured
  const subscription = {
    plan: 'free' as keyof typeof SUBSCRIPTION_PLANS,
    status: 'active',
    nextBillingDate: null,
    currentPeriodEnd: null
  };

  const handleManageBilling = () => {
    // For now, just show an alert - this will be configured when billing is set up
    alert("Billing management will be configured soon!");
  };

  const getCurrentPlan = () => {
    return SUBSCRIPTION_PLANS[subscription.plan] || SUBSCRIPTION_PLANS.free;
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'free': return 'text-gray-600';
      case 'pro': return 'text-blue-600';
      case 'business': return 'text-purple-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Billing & Subscription</h1>
          <p className="text-gray-600">Manage your subscription and billing information</p>
        </div>

        {/* Current Plan Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Current Plan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <h3 className={`text-2xl font-bold ${getPlanColor(subscription.plan)}`}>
                  {getCurrentPlan().name}
                </h3>
                <p className="text-gray-600 mt-1">
                  {subscription.plan === 'free' 
                    ? 'Free plan - no billing required'
                    : `${formatPrice(getCurrentPlan().price)}/month`
                  }
                </p>
                {subscription.nextBillingDate && (
                  <p className="text-sm text-gray-500 mt-2">
                    Next billing: {new Date(subscription.nextBillingDate).toLocaleDateString()}
                  </p>
                )}
              </div>
              <div className="text-right">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  subscription.status === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {subscription.status === 'active' ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Plan Features */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Plan Features</CardTitle>
            <CardDescription>What&apos;s included in your current plan</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {getCurrentPlan().features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Billing Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Manage Billing */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Manage Billing
              </CardTitle>
              <CardDescription>Update payment methods and view invoices</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={handleManageBilling} className="w-full">
                Manage Billing
              </Button>
            </CardContent>
          </Card>

          {/* Change Plan */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Change Plan
              </CardTitle>
              <CardDescription>Upgrade or downgrade your subscription</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/pricing">
                <Button variant="outline" className="w-full">
                  View Plans
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Usage Information */}
        {subscription.plan !== 'free' && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Usage This Month</CardTitle>
              <CardDescription>Track your current usage and limits</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">0</div>
                  <div className="text-sm text-gray-600">Resumes Created</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">0</div>
                  <div className="text-sm text-gray-600">Cover Letters</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">0</div>
                  <div className="text-sm text-gray-600">AI Generations</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Help Section */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Need Help?</CardTitle>
            <CardDescription>Get support with your subscription</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="outline" className="flex-1">
                Contact Support
              </Button>
              <Button variant="outline" className="flex-1">
                View Documentation
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
