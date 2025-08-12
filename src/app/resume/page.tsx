"use client";

import { useState } from "react";
// import { useMutation } from "convex/react";
// import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { exportResumeToPDF } from "@/lib/pdf-export";
import { generateResumeContent, type ResumeGenerationRequest } from "@/lib/openai";
import { FileText, ArrowLeft, Download } from "lucide-react";
import Link from "next/link";
import AuthGuard from "@/components/AuthGuard";

export default function ResumeBuilderPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  
  // Form state
  const [formData, setFormData] = useState({
    title: "",
    personalInfo: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      location: "",
      linkedin: "",
      website: "",
    },
    summary: "",
    experience: [
      {
        id: "1",
        company: "",
        position: "",
        startDate: "",
        endDate: "",
        current: false,
        description: [""],
      },
    ],
    education: [
      {
        id: "1",
        institution: "",
        degree: "",
        field: "",
        startDate: "",
        endDate: "",
        current: false,
        gpa: "",
      },
    ],
    skills: [""],
    template: "modern",
  });

  // TODO: Uncomment when database is properly configured
  // const createResume = useMutation(api.resumeManagement.createResume);
  
  // Temporary mock function until database is configured
  const createResume = async (data: unknown) => {
    console.log("Mock createResume called with:", data);
    return { _id: "mock-resume-id" };
  };

  const handleInputChange = (section: string, field: string, value: string | boolean, index?: number) => {
    setFormData(prev => {
      if (index !== undefined) {
        if (section === "experience" || section === "education") {
          const newArray = [...prev[section]];
          newArray[index] = { ...newArray[index], [field]: value };
          return { ...prev, [section]: newArray };
        } else if (section === "skills") {
          const newSkills = [...prev.skills];
          if (typeof value === "string") {
            newSkills[index] = value;
            return { ...prev, skills: newSkills };
          }
        }
      } else if (section === "personalInfo") {
        return {
          ...prev,
          personalInfo: { ...prev.personalInfo, [field]: value }
        };
      } else {
        return { ...prev, [section]: value };
      }
      return prev;
    });
  };

  // Special handler for array fields like description
  const handleArrayFieldChange = (section: "experience", field: string, value: string, index: number, arrayIndex: number) => {
    setFormData(prev => {
      if (section === "experience") {
        const newArray = [...prev.experience];
        if (newArray[index] && field === "description") {
          const newFieldArray = [...newArray[index].description];
          newFieldArray[arrayIndex] = value;
          newArray[index] = { ...newArray[index], description: newFieldArray };
          return { ...prev, experience: newArray };
        }
      }
      return prev;
    });
  };

  const addExperience = () => {
    setFormData(prev => ({
      ...prev,
      experience: [
        ...prev.experience,
        {
          id: Date.now().toString(),
          company: "",
          position: "",
          startDate: "",
          endDate: "",
          current: false,
          description: [""],
        },
      ],
    }));
  };

  const addEducation = () => {
    setFormData(prev => ({
      ...prev,
      education: [
        ...prev.education,
        {
          id: Date.now().toString(),
          institution: "",
          degree: "",
          field: "",
          startDate: "",
          endDate: "",
          current: false,
          gpa: "",
        },
      ],
    }));
  };

  const addSkill = () => {
    setFormData(prev => ({
      ...prev,
      skills: [...prev.skills, ""],
    }));
  };

  const removeExperience = (index: number) => {
    setFormData(prev => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index),
    }));
  };

  const removeEducation = (index: number) => {
    setFormData(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index),
    }));
  };

  const removeSkill = (index: number) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index),
    }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Save resume
      await createResume({
        userId: "temp-user-id", // This will need to be properly set up
        ...formData,
      });
      
      // Redirect to dashboard
      window.location.href = "/dashboard";
    } catch (error) {
      console.error("Error saving resume:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportPDF = async () => {
    try {
      // Prepare resume data for PDF export
      const resumeData = {
        personalInfo: {
          fullName: `${formData.personalInfo.firstName} ${formData.personalInfo.lastName}`,
          title: formData.title,
          email: formData.personalInfo.email,
          phone: formData.personalInfo.phone,
          location: formData.personalInfo.location
        },
        summary: formData.summary,
        experience: formData.experience.map(exp => ({
          title: exp.position,
          company: exp.company,
          startDate: exp.startDate,
          endDate: exp.current ? "Present" : exp.endDate,
          responsibilities: exp.description
        })),
        education: formData.education.map(edu => ({
          degree: edu.degree,
          institution: edu.institution,
          graduationYear: edu.endDate
        })),
        skills: formData.skills
      };

      const success = await exportResumeToPDF(resumeData);
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

  const handleGenerateContent = async () => {
    if (!formData.personalInfo.firstName || !formData.personalInfo.lastName || !formData.title) {
      alert("Please fill in your basic information first");
      return;
    }

    setIsGenerating(true);
    try {
      const aiRequest: ResumeGenerationRequest = {
        jobTitle: formData.title,
        jobDescription: formData.summary || "General professional role",
        userExperience: formData.experience.map(exp => 
          `${exp.position} at ${exp.company}: ${exp.description.join(', ')}`
        ).join('; '),
        userSkills: formData.skills.join(', '),
        userEducation: formData.education.map(edu => 
          `${edu.degree} in ${edu.field} from ${edu.institution}`
        ).join('; '),
        userSummary: formData.summary || "",
        tone: "professional" as const
      };

      const generatedContent = await generateResumeContent(aiRequest);
      
      if (generatedContent) {
        setFormData(prev => ({
          ...prev,
          summary: generatedContent
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

  const renderStep1 = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>Start with your basic resume details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="title">Resume Title</Label>
            <Input
              id="title"
              placeholder="e.g., Software Engineer Resume"
              value={formData.title}
              onChange={(e) => handleInputChange("title", "", e.target.value)}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={formData.personalInfo.firstName}
                onChange={(e) => handleInputChange("personalInfo", "firstName", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={formData.personalInfo.lastName}
                onChange={(e) => handleInputChange("personalInfo", "lastName", e.target.value)}
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.personalInfo.email}
              onChange={(e) => handleInputChange("personalInfo", "email", e.target.value)}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={formData.personalInfo.phone}
                onChange={(e) => handleInputChange("personalInfo", "phone", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="City, State"
                value={formData.personalInfo.location}
                onChange={(e) => handleInputChange("personalInfo", "location", e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-between">
        <div></div>
        <Button onClick={() => setCurrentStep(2)}>
          Next Step
        </Button>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Professional Summary</CardTitle>
          <CardDescription>Write a compelling summary of your professional background</CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="e.g., Experienced software engineer with 5+ years developing scalable web applications..."
            value={formData.summary}
            onChange={(e) => handleInputChange("summary", "", e.target.value)}
            rows={4}
          />
          <Button onClick={handleGenerateContent} disabled={isGenerating}>
            {isGenerating ? "Generating..." : "Generate Summary"}
          </Button>
        </CardContent>
      </Card>
      
      <div className="flex justify-between">
        <Button variant="outline" onClick={() => setCurrentStep(1)}>
          Previous
        </Button>
        <Button onClick={() => setCurrentStep(3)}>
          Next Step
        </Button>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Work Experience</CardTitle>
          <CardDescription>Add your relevant work experience</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {formData.experience.map((exp, index) => (
            <div key={exp.id} className="border rounded-lg p-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Company</Label>
                  <Input
                    value={exp.company}
                    onChange={(e) => handleInputChange("experience", "company", e.target.value, index)}
                    placeholder="Company Name"
                  />
                </div>
                <div>
                  <Label>Position</Label>
                  <Input
                    value={exp.position}
                    onChange={(e) => handleInputChange("experience", "position", e.target.value, index)}
                    placeholder="Job Title"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>Start Date</Label>
                  <Input
                    type="month"
                    value={exp.startDate}
                    onChange={(e) => handleInputChange("experience", "startDate", e.target.value, index)}
                  />
                </div>
                <div>
                  <Label>End Date</Label>
                  <Input
                    type="month"
                    value={exp.endDate}
                    onChange={(e) => handleInputChange("experience", "endDate", e.target.value, index)}
                    disabled={exp.current}
                  />
                </div>
                <div className="flex items-center space-x-2 pt-6">
                  <input
                    type="checkbox"
                    id={`current-${index}`}
                    checked={exp.current}
                    onChange={(e) => handleInputChange("experience", "current", e.target.checked, index)}
                  />
                  <Label htmlFor={`current-${index}`}>Current Position</Label>
                </div>
              </div>
              
              <div>
                <Label>Description</Label>
                <Textarea
                  value={exp.description[0]}
                  onChange={(e) => handleArrayFieldChange("experience", "description", e.target.value, index, 0)}
                  placeholder="Describe your responsibilities and achievements..."
                  rows={3}
                />
              </div>
              
              {formData.experience.length > 1 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removeExperience(index)}
                  className="text-red-600 hover:text-red-700"
                >
                  Remove Experience
                </Button>
              )}
            </div>
          ))}
          
          <Button variant="outline" onClick={addExperience}>
            + Add Experience
          </Button>
        </CardContent>
      </Card>
      
      <div className="flex justify-between">
        <Button variant="outline" onClick={() => setCurrentStep(2)}>
          Previous
        </Button>
        <Button onClick={() => setCurrentStep(4)}>
          Next Step
        </Button>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Education</CardTitle>
          <CardDescription>Add your educational background</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {formData.education.map((edu, index) => (
            <div key={edu.id} className="border rounded-lg p-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Institution</Label>
                  <Input
                    value={edu.institution}
                    onChange={(e) => handleInputChange("education", "institution", e.target.value, index)}
                    placeholder="University Name"
                  />
                </div>
                <div>
                  <Label>Degree</Label>
                  <Input
                    value={edu.degree}
                    onChange={(e) => handleInputChange("education", "degree", e.target.value, index)}
                    placeholder="e.g., Bachelor's"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>Field of Study</Label>
                  <Input
                    value={edu.field}
                    onChange={(e) => handleInputChange("education", "field", e.target.value, index)}
                    placeholder="e.g., Computer Science"
                  />
                </div>
                <div>
                  <Label>Start Date</Label>
                  <Input
                    type="month"
                    value={edu.startDate}
                    onChange={(e) => handleInputChange("education", "startDate", e.target.value, index)}
                  />
                </div>
                <div>
                  <Label>End Date</Label>
                  <Input
                    type="month"
                    value={edu.endDate}
                    onChange={(e) => handleInputChange("education", "endDate", e.target.value, index)}
                    disabled={edu.current}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`edu-current-${index}`}
                    checked={edu.current}
                    onChange={(e) => handleInputChange("education", "current", e.target.checked, index)}
                  />
                  <Label htmlFor={`edu-current-${index}`}>Currently Studying</Label>
                </div>
                <div>
                  <Label>GPA (Optional)</Label>
                  <Input
                    value={edu.gpa}
                    onChange={(e) => handleInputChange("education", "gpa", e.target.value, index)}
                    placeholder="e.g., 3.8"
                  />
                </div>
              </div>
              
              {formData.education.length > 1 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removeEducation(index)}
                  className="text-red-600 hover:text-red-700"
                >
                  Remove Education
                </Button>
              )}
            </div>
          ))}
          
          <Button variant="outline" onClick={addEducation}>
            + Add Education
          </Button>
        </CardContent>
      </Card>
      
      <div className="flex justify-between">
        <Button variant="outline" onClick={() => setCurrentStep(3)}>
          Previous
        </Button>
        <Button onClick={() => setCurrentStep(5)}>
          Next Step
        </Button>
      </div>
    </div>
  );

  const renderStep5 = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Skills</CardTitle>
          <CardDescription>List your key skills and competencies</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {formData.skills.map((skill, index) => (
            <div key={index} className="flex space-x-2">
              <Input
                value={skill}
                onChange={(e) => handleInputChange("skills", "", e.target.value, index)}
                placeholder="e.g., JavaScript, React, Node.js"
              />
              {formData.skills.length > 1 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removeSkill(index)}
                  className="text-red-600 hover:text-red-700"
                >
                  Remove
                </Button>
              )}
            </div>
          ))}
          
          <Button variant="outline" onClick={addSkill}>
            + Add Skill
          </Button>
        </CardContent>
      </Card>
      
      <div className="flex justify-between">
        <Button variant="outline" onClick={() => setCurrentStep(4)}>
          Previous
        </Button>
        <Button onClick={() => setCurrentStep(6)}>
          Next Step
        </Button>
      </div>
    </div>
  );

  const renderStep6 = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Template Selection</CardTitle>
          <CardDescription>Choose a professional template for your resume</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { id: "modern", name: "Modern", description: "Clean and contemporary design", color: "blue" },
              { id: "classic", name: "Classic", description: "Traditional and professional", color: "gray" },
              { id: "minimal", name: "Minimal", description: "Simple and elegant layout", color: "green" }
            ].map((template) => (
              <div
                key={template.id}
                className={`border-2 rounded-lg p-6 cursor-pointer transition-all hover:shadow-lg ${
                  formData.template === template.id
                    ? `border-${template.color}-500 bg-${template.color}-50`
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => handleInputChange("template", "", template.id)}
              >
                <div className="text-center space-y-3">
                  {/* Template Preview */}
                  <div className={`w-20 h-24 mx-auto rounded border-2 ${
                    template.id === "modern" ? "bg-gradient-to-br from-blue-100 to-blue-200" :
                    template.id === "classic" ? "bg-gradient-to-br from-gray-100 to-gray-200" :
                    "bg-gradient-to-br from-green-100 to-green-200"
                  }`}>
                    <div className="p-2 space-y-1">
                      <div className="h-2 bg-white rounded"></div>
                      <div className="h-1 bg-white rounded w-3/4"></div>
                      <div className="h-1 bg-white rounded w-1/2"></div>
                    </div>
                  </div>
                  <div>
                    <span className="font-semibold text-lg capitalize">{template.name}</span>
                    <p className="text-sm text-gray-600 mt-1">{template.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-between">
        <Button variant="outline" onClick={() => setCurrentStep(5)}>
          Previous
        </Button>
        <div className="flex space-x-2">
          <Button onClick={handleExportPDF} variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export PDF
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Resume"}
          </Button>
        </div>
      </div>
    </div>
  );

  const steps = [
    { title: "Basic Info", component: renderStep1 },
    { title: "Summary", component: renderStep2 },
    { title: "Experience", component: renderStep3 },
    { title: "Education", component: renderStep4 },
    { title: "Skills", component: renderStep5 },
    { title: "Template", component: renderStep6 },
  ];

  return (
    <AuthGuard>
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div className="flex items-center space-x-2">
                <FileText className="h-8 w-8 text-blue-600" />
                <span className="text-xl font-bold text-gray-900">Resume Builder</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`flex items-center ${
                  index < steps.length - 1 ? "flex-1" : ""
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    index + 1 <= currentStep
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {index + 1}
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`flex-1 h-1 mx-2 ${
                      index + 1 < currentStep ? "bg-blue-600" : "bg-gray-200"
                    }`}
                  ></div>
                )}
              </div>
            ))}
          </div>
          <div className="text-center">
            <h2 className="text-lg font-medium text-gray-900">
              Step {currentStep}: {steps[currentStep - 1].title}
            </h2>
          </div>
        </div>

        {/* Step Content */}
        {steps[currentStep - 1].component()}
      </div>
    </div>
    </AuthGuard>
  );
}
