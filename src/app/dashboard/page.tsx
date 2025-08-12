"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, FileText, Mail, Settings, Crown, Download } from "lucide-react";
import Link from "next/link";

// Temporary interfaces until database is properly configured
interface Resume {
  _id: string;
  title: string;
  template: string;
  experience: string[];
  skills: string[];
  updatedAt: string;
}

interface CoverLetter {
  _id: string;
  title: string;
  template: string;
  jobTitle: string;
  companyName: string;
  createdAt: string;
}

export default function DashboardPage() {
  // Temporary mock data until database is configured
  const userData: { subscriptionTier: string } = { subscriptionTier: "free" };
  const resumes: Resume[] = [];
  const coverLetters: CoverLetter[] = [];

  const subscriptionTier = userData?.subscriptionTier || "free";
  const isPro = subscriptionTier === "pro";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <FileText className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">Resuletter</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/settings">
                <Button variant="ghost" size="sm">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Button>
              </Link>
              <div className="flex items-center space-x-2">
                {isPro ? (
                  <Crown className="h-4 w-4 text-yellow-500" />
                ) : null}
                <span className="text-sm font-medium">
                  {isPro ? "Pro Plan" : "Free Plan"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome to Resuletter!
          </h1>
          <p className="text-gray-600">
            Manage your resumes, cover letters, and subscription.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Link href="/resume">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="text-center">
                <div className="mx-auto w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Plus className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle>Create New Resume</CardTitle>
                <CardDescription>
                  Build a professional resume with AI-powered content
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/cover-letter">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="text-center">
                <div className="mx-auto w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Mail className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle>Create Cover Letter</CardTitle>
                <CardDescription>
                  Generate a personalized cover letter for your job application
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          {!isPro && (
            <Link href="/pricing">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 border-yellow-200">
                <CardHeader className="text-center">
                  <div className="mx-auto w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                    <Crown className="h-6 w-6 text-yellow-600" />
                  </div>
                  <CardTitle>Upgrade to Pro</CardTitle>
                  <CardDescription>
                    Get unlimited downloads and premium templates
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          )}
        </div>

        {/* Resumes Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Your Resumes</h2>
            <Link href="/resume">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Resume
              </Button>
            </Link>
          </div>

          {resumes && resumes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resumes.map((resume) => (
                <Card key={resume._id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      {resume.title}
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        {resume.template}
                      </span>
                    </CardTitle>
                    <CardDescription>
                      Last updated: {new Date(resume.updatedAt).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="text-sm text-gray-600">
                        <strong>Experience:</strong> {resume.experience.length} positions
                      </div>
                      <div className="text-sm text-gray-600">
                        <strong>Skills:</strong> {resume.skills.length} skills
                      </div>
                      <div className="flex space-x-2">
                        <Link href={`/resume/${resume._id}`}>
                          <Button variant="outline" size="sm" className="w-full">
                            Edit
                          </Button>
                        </Link>
                        <Button variant="outline" size="sm" className="w-full">
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No resumes yet</h3>
                <p className="text-gray-600 mb-4">
                  Create your first professional resume to get started.
                </p>
                <Link href="/resume">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Resume
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Cover Letters Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Your Cover Letters</h2>
            <Link href="/cover-letter">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Cover Letter
              </Button>
            </Link>
          </div>

          {coverLetters && coverLetters.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {coverLetters.map((coverLetter) => (
                <Card key={coverLetter._id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      {coverLetter.title}
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                        {coverLetter.template}
                      </span>
                    </CardTitle>
                    <CardDescription>
                      {coverLetter.jobTitle} at {coverLetter.companyName}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="text-sm text-gray-600">
                        <strong>Template:</strong> {coverLetter.template}
                      </div>
                      <div className="text-sm text-gray-600">
                        <strong>Created:</strong> {new Date(coverLetter.createdAt).toLocaleDateString()}
                      </div>
                      <div className="flex space-x-2">
                        <Link href={`/cover-letter/${coverLetter._id}`}>
                          <Button variant="outline" size="sm" className="w-full">
                            Edit
                          </Button>
                        </Link>
                        <Button variant="outline" size="sm" className="w-full">
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No cover letters yet</h3>
                <p className="text-gray-600 mb-4">
                  Create your first personalized cover letter to complement your resume.
                </p>
                <Link href="/cover-letter">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Cover Letter
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Subscription Status */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Subscription Status</h2>
          <Card className={isPro ? "border-2 border-yellow-200" : ""}>
            <CardHeader>
              <CardTitle className="flex items-center">
                {isPro ? (
                  <Crown className="h-5 w-5 text-yellow-500 mr-2" />
                ) : null}
                {isPro ? "Pro Plan" : "Free Plan"}
              </CardTitle>
              <CardDescription>
                {isPro 
                  ? "You have access to all premium features and unlimited downloads."
                  : "Upgrade to Pro for unlimited downloads, premium templates, and priority support."
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Downloads this month:</span>
                  <span className="text-sm font-medium">
                    {isPro ? "Unlimited" : "5 remaining"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Templates available:</span>
                  <span className="text-sm font-medium">
                    {isPro ? "All templates" : "3 basic templates"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Support:</span>
                  <span className="text-sm font-medium">
                    {isPro ? "Priority support" : "Community support"}
                  </span>
                </div>
                {!isPro && (
                  <div className="pt-4">
                    <Link href="/pricing">
                      <Button className="w-full">
                        <Crown className="h-4 w-4 mr-2" />
                        Upgrade to Pro
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
