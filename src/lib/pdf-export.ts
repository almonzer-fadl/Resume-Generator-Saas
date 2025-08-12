import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// Types for resume and cover letter data
interface PersonalInfo {
  fullName?: string;
  title?: string;
  email?: string;
  phone?: string;
  location?: string;
}

interface Experience {
  title: string;
  company: string;
  startDate: string;
  endDate?: string;
  responsibilities?: string[];
}

interface Education {
  degree: string;
  institution: string;
  graduationYear: string;
}

interface ResumeData {
  personalInfo?: PersonalInfo;
  summary?: string;
  experience?: Experience[];
  education?: Education[];
  skills?: string[];
}

interface CoverLetterData {
  companyName?: string;
  jobTitle?: string;
  content?: string;
  personalInfo?: PersonalInfo;
}

// HTML to PDF export function
export async function exportToPDF(htmlElement: HTMLElement, filename: string = 'document.pdf'): Promise<boolean> {
  try {
    const canvas = await html2canvas(htmlElement, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff'
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    const imgWidth = 210; // A4 width in mm
    const pageHeight = 295; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;

    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(filename);
    return true;
  } catch (error) {
    console.error('PDF export failed:', error);
    return false;
  }
}

// Generate filename based on document type and name
export function generateFilename(type: string, name: string): string {
  const timestamp = new Date().toISOString().split('T')[0];
  const sanitizedName = name.replace(/[^a-zA-Z0-9]/g, '_');
  return `${type}_${sanitizedName}_${timestamp}.pdf`;
}

// Resume-specific PDF export
export async function exportResumeToPDF(resumeData: ResumeData): Promise<boolean> {
  const filename = generateFilename('Resume', resumeData.personalInfo?.fullName || 'Resume');
  
  // Create a temporary HTML element for the resume
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = generateResumeHTML(resumeData);
  tempDiv.style.position = 'absolute';
  tempDiv.style.left = '-9999px';
  tempDiv.style.top = '-9999px';
  document.body.appendChild(tempDiv);

  const success = await exportToPDF(tempDiv, filename);
  document.body.removeChild(tempDiv);
  
  return success;
}

// Cover letter-specific PDF export
export async function exportCoverLetterToPDF(coverLetterData: CoverLetterData): Promise<boolean> {
  const filename = generateFilename('CoverLetter', coverLetterData.jobTitle || 'CoverLetter');
  
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = generateCoverLetterHTML(coverLetterData);
  tempDiv.style.position = 'absolute';
  tempDiv.style.left = '-9999px';
  tempDiv.style.top = '-9999px';
  document.body.appendChild(tempDiv);

  const success = await exportToPDF(tempDiv, filename);
  document.body.removeChild(tempDiv);
  
  return success;
}

// Generate HTML for resume
function generateResumeHTML(resumeData: ResumeData): string {
  const { personalInfo, summary, experience, education, skills } = resumeData;
  
  return `
    <div class="resume-container" style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; background: white;">
      <div class="header" style="text-align: center; border-bottom: 3px solid #2563eb; padding-bottom: 20px; margin-bottom: 30px;">
        <h1 style="color: #1e40af; margin: 0; font-size: 32px;">${personalInfo?.fullName || 'Your Name'}</h1>
        <p style="color: #64748b; margin: 5px 0; font-size: 16px;">${personalInfo?.title || 'Professional Title'}</p>
        <div style="color: #64748b; font-size: 14px;">
          <p style="margin: 2px 0;">${personalInfo?.email || 'email@example.com'}</p>
          <p style="margin: 2px 0;">${personalInfo?.phone || 'Phone Number'}</p>
          <p style="margin: 2px 0;">${personalInfo?.location || 'City, State'}</p>
        </div>
      </div>

      <div class="summary" style="margin-bottom: 30px;">
        <h2 style="color: #1e40af; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px;">Professional Summary</h2>
        <p style="line-height: 1.6; color: #374151;">${summary || 'Professional summary goes here...'}</p>
      </div>

      <div class="experience" style="margin-bottom: 30px;">
        <h2 style="color: #1e40af; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px;">Work Experience</h2>
        ${(experience || []).map(exp => `
          <div style="margin-bottom: 20px;">
            <h3 style="color: #374151; margin: 0; font-size: 18px;">${exp.title}</h3>
            <p style="color: #64748b; margin: 5px 0; font-style: italic;">${exp.company} | ${exp.startDate} - ${exp.endDate || 'Present'}</p>
            <ul style="margin: 10px 0; padding-left: 20px;">
              ${(exp.responsibilities || []).map(resp => `<li style="margin: 5px 0; line-height: 1.5; color: #374151;">${resp}</li>`).join('')}
            </ul>
          </div>
        `).join('')}
      </div>

      <div class="education" style="margin-bottom: 30px;">
        <h2 style="color: #1e40af; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px;">Education</h2>
        ${(education || []).map(edu => `
          <div style="margin-bottom: 15px;">
            <h3 style="color: #374151; margin: 0; font-size: 16px;">${edu.degree}</h3>
            <p style="color: #64748b; margin: 5px 0;">${edu.institution} | ${edu.graduationYear}</p>
          </div>
        `).join('')}
      </div>

      <div class="skills">
        <h2 style="color: #1e40af; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px;">Skills</h2>
        <p style="line-height: 1.6; color: #374151;">${(skills || []).join(', ')}</p>
      </div>
    </div>
  `;
}

// Generate HTML for cover letter
function generateCoverLetterHTML(coverLetterData: CoverLetterData): string {
  const { companyName, content, personalInfo } = coverLetterData;
  
  return `
    <div class="cover-letter-container" style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; background: white;">
      <div class="header" style="margin-bottom: 30px;">
        <h1 style="color: #1e40af; margin: 0; font-size: 28px;">${personalInfo?.fullName || 'Your Name'}</h1>
        <p style="color: #64748b; margin: 5px 0;">${personalInfo?.email || 'email@example.com'}</p>
        <p style="color: #64748b; margin: 5px 0;">${personalInfo?.phone || 'Phone Number'}</p>
        <p style="color: #64748b; margin: 5px 0;">${personalInfo?.location || 'City, State'}</p>
      </div>

      <div class="date" style="margin-bottom: 30px;">
        <p style="color: #374151;">${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>

      <div class="recipient" style="margin-bottom: 30px;">
        <p style="color: #374151; margin: 5px 0;">Hiring Manager</p>
        <p style="color: #374151; margin: 5px 0;">${companyName || 'Company Name'}</p>
      </div>

      <div class="content" style="line-height: 1.8; color: #374151; margin-bottom: 30px;">
        ${content || 'Your cover letter content goes here...'}
      </div>

      <div class="closing" style="margin-top: 40px;">
        <p style="color: #374151; margin: 5px 0;">Sincerely,</p>
        <p style="color: #374151; margin: 20px 0;">${personalInfo?.fullName || 'Your Name'}</p>
      </div>
    </div>
  `;
}
