"use client";

import { useState } from "react";
// import { useMutation, useQuery } from "convex/react";
// import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { exportCoverLetterToPDF } from "@/lib/pdf-export";
import { generateCoverLetterContent, type CoverLetterGenerationRequest } from "@/lib/openai";
import { Loader2, Download, Sparkles, Save } from "lucide-react";
import AuthGuard from "@/components/AuthGuard";

// Types for cover letter data
interface CoverLetterData {
  userId: string;
  jobTitle: string;
  companyName: string;
  jobDescription: string;
  content: string;
  template: string;
  customizations: {
    tone: string;
    length: string;
  };
}



export default function CoverLetterBuilder() {
  // TODO: Uncomment when database is properly configured
  // const createCoverLetter = useMutation(api.coverLetterManagement.createCoverLetter);
  // const generateContent = useMutation(api.generateCoverLetter.generateCoverLetterContent);
  
  // Temporary mock functions until database is configured
  const createCoverLetter = async (data: CoverLetterData) => {
    console.log("Mock createCoverLetter called with:", data);
    return { _id: "mock-cover-letter-id" };
  };
  

  
  const [currentStep, setCurrentStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    jobTitle: "",
    companyName: "",
    jobDescription: "",
    userExperience: "",
    userSkills: "",
    userEducation: "",
    userSummary: "",
    tone: "professional",
    length: "medium",
    content: "",
    template: "modern"
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleGenerateContent = async () => {
    if (!formData.jobTitle || !formData.companyName || !formData.jobDescription) {
      alert("Please fill in the job details first");
      return;
    }

    setIsGenerating(true);
    try {
      const aiRequest: CoverLetterGenerationRequest = {
        jobTitle: formData.jobTitle,
        companyName: formData.companyName,
        jobDescription: formData.jobDescription,
        userExperience: formData.userExperience,
        userSkills: formData.userSkills,
        userEducation: formData.userEducation,
        userSummary: formData.userSummary,
        tone: formData.tone as 'professional' | 'friendly' | 'enthusiastic' | 'confident',
        length: formData.length as 'short' | 'medium' | 'long'
      };

      const generatedContent = await generateCoverLetterContent(aiRequest);

      if (generatedContent) {
        setFormData(prev => ({
          ...prev,
          content: generatedContent
        }));
        setCurrentStep(3); // Move to review step
      }
    } catch (error) {
      console.error("Failed to generate content:", error);
      alert("Failed to generate content. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await createCoverLetter({
        userId: "temp-user-id", // TODO: Replace with actual user ID
        jobTitle: formData.jobTitle,
        companyName: formData.companyName,
        jobDescription: formData.jobDescription,
        content: formData.content,
        template: formData.template,
        customizations: {
          tone: formData.tone,
          length: formData.length
        }
      });
      
      alert("Cover letter saved successfully!");
    } catch (error) {
      console.error("Failed to save cover letter:", error);
      alert("Failed to save cover letter. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleExportPDF = async () => {
    try {
      const success = await exportCoverLetterToPDF(formData);
      if (success) {
        alert("PDF exported successfully!");
      } else {
        alert("PDF export failed. Please try again.");
      }
    } catch (error) {
      console.error("PDF export error:", error);
      alert("PDF export failed. Please try again.");
    }
  };

  const nextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  return (
    <AuthGuard>
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Cover Letter Builder</h1>
          <p className="text-xl text-gray-600">Create compelling cover letters with AI assistance</p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-8">
          <div className="flex space-x-4">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${
                  currentStep >= step 
                    ? "bg-blue-600 text-white" 
                    : "bg-gray-200 text-gray-600"
                }`}>
                  {step}
                </div>
                {step < 3 && (
                  <div className={`w-16 h-1 mx-2 ${
                    currentStep > step ? "bg-blue-600" : "bg-gray-200"
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step 1: Job Details */}
        {currentStep === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Step 1: Job Details</CardTitle>
              <CardDescription>Provide information about the position you&apos;re applying for</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="jobTitle">Job Title *</Label>
                  <Input
                    id="jobTitle"
                    value={formData.jobTitle}
                    onChange={(e) => handleInputChange("jobTitle", e.target.value)}
                    placeholder="e.g., Senior Software Engineer"
                  />
                </div>
                <div>
                  <Label htmlFor="companyName">Company Name *</Label>
                  <Input
                    id="companyName"
                    value={formData.companyName}
                    onChange={(e) => handleInputChange("companyName", e.target.value)}
                    placeholder="e.g., Google"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="jobDescription">Job Description *</Label>
                <Textarea
                  id="jobDescription"
                  value={formData.jobDescription}
                  onChange={(e) => handleInputChange("jobDescription", e.target.value)}
                  placeholder="Paste the job description here..."
                  rows={6}
                />
              </div>

              <div className="flex justify-end">
                <Button onClick={nextStep} disabled={!formData.jobTitle || !formData.companyName || !formData.jobDescription}>
                  Next Step
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Your Background */}
        {currentStep === 2 && (
          <Card>
            <CardHeader>
              <CardTitle>Step 2: Your Background</CardTitle>
              <CardDescription>Share your relevant experience and skills</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="userExperience">Relevant Experience</Label>
                <Textarea
                  id="userExperience"
                  value={formData.userExperience}
                  onChange={(e) => handleInputChange("userExperience", e.target.value)}
                  placeholder="Describe your relevant work experience..."
                  rows={4}
                />
              </div>

              <div>
                <Label htmlFor="userSkills">Key Skills</Label>
                <Textarea
                  id="userSkills"
                  value={formData.userSkills}
                  onChange={(e) => handleInputChange("userSkills", e.target.value)}
                  placeholder="List your relevant skills..."
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="userEducation">Education</Label>
                <Textarea
                  id="userEducation"
                  value={formData.userEducation}
                  onChange={(e) => handleInputChange("userEducation", e.target.value)}
                  placeholder="Your educational background..."
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="userSummary">Professional Summary</Label>
                <Textarea
                  id="userSummary"
                  value={formData.userSummary}
                  onChange={(e) => handleInputChange("userSummary", e.target.value)}
                  placeholder="Brief summary of your professional background..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="tone">Tone</Label>
                  <select
                    id="tone"
                    value={formData.tone}
                    onChange={(e) => handleInputChange("tone", e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="professional">Professional</option>
                    <option value="friendly">Friendly</option>
                    <option value="enthusiastic">Enthusiastic</option>
                    <option value="confident">Confident</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="length">Length</Label>
                  <select
                    id="length"
                    value={formData.length}
                    onChange={(e) => handleInputChange("length", e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="short">Short</option>
                    <option value="medium">Medium</option>
                    <option value="long">Long</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={prevStep}>
                  Previous
                </Button>
                <Button onClick={handleGenerateContent} disabled={isGenerating}>
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Generate Cover Letter
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Review & Export */}
        {currentStep === 3 && (
          <Card>
            <CardHeader>
              <CardTitle>Step 3: Review & Export</CardTitle>
              <CardDescription>Review your cover letter and export it</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label>Generated Cover Letter</Label>
                <div className="mt-2 p-4 bg-gray-50 rounded-lg border">
                  <div className="whitespace-pre-wrap text-sm text-gray-700">
                    {formData.content || "No content generated yet."}
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={prevStep}>
                  Previous
                </Button>
                <div className="flex space-x-2">
                  <Button onClick={handleSave} disabled={isSaving}>
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save
                      </>
                    )}
                  </Button>
                  <Button onClick={handleExportPDF}>
                    <Download className="mr-2 h-4 w-4" />
                    Export PDF
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
    </AuthGuard>
  );
}
