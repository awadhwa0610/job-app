import React, { useState, useEffect, useMemo } from 'react';
import { PDFViewer, usePDF } from '@react-pdf/renderer';
import { initialResumeData, type ResumeData } from './types';
import { ResumeEditor } from './components/ResumeEditor';
import { ResumePDF } from './components/ResumePDF';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Download, Eye, FileDown } from 'lucide-react';

// Simple debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

function App() {
  const [resumeData, setResumeData] = useState<ResumeData>(initialResumeData);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(true);

  // Debounce only for the downloadable PDF generation (heavier render)
  const debouncedResumeData = useDebounce(resumeData, 500);
  const debouncedProfileImage = useDebounce(profileImage, 500);

  // Precompute documents so the viewer can update immediately without remounting
  const liveDocument = useMemo(
    () => <ResumePDF data={resumeData} profileImage={profileImage} />,
    [resumeData, profileImage]
  );
  const downloadableDocument = useMemo(
    () => <ResumePDF data={debouncedResumeData} profileImage={debouncedProfileImage} />,
    [debouncedResumeData, debouncedProfileImage]
  );

  // Use usePDF hook for download link to avoid background render crashes
  // IMPORTANT: We only update the instance when data STABILIZES (debounced)
  const [instance, updateInstance] = usePDF({ document: downloadableDocument });

  useEffect(() => {
      updateInstance(downloadableDocument);
  }, [downloadableDocument, updateInstance]);

  // Build DOC HTML (side-by-side layout similar to PDF)
  const buildDocHtml = (data: ResumeData, image: string | null) => {
    const sidebarWidth = '30%';
    const mainWidth = '70%';
    const summaryStyle = `font-family:${data.fontSettings.summary.family};font-size:${data.fontSettings.summary.size}px;line-height:1.5;`;
    const accomplishmentsStyle = `font-family:${data.fontSettings.accomplishments.family};font-size:${data.fontSettings.accomplishments.size}px;line-height:1.5;`;
    const skillsStyle = `font-family:${data.fontSettings.skills.family};font-size:${data.fontSettings.skills.size}px;line-height:1.5;`;
    const expStyle = `font-family:${data.fontSettings.experience.family};font-size:${data.fontSettings.experience.size}px;line-height:1.5;`;

    const sidebarContact = `
      <div style="margin-top:20px;margin-bottom:20px;text-align:center;font-size:11px;line-height:1.5;color:#fff;display:flex;flex-direction:column;gap:6px;">
        <div>${data.personalDetails.email}</div>
        <div>${data.personalDetails.phone}</div>
        <div>${data.personalDetails.location}</div>
        <div>${data.personalDetails.website}</div>
      </div>
    `;

    const sidebarEducation = data.education.map(edu => `
      <div style="margin-bottom:12px;color:#fff;">
        <div style="font-size:11px;font-weight:700;">${edu.degree}</div>
        <div style="font-size:11px;">${edu.school}, ${edu.location}</div>
        <div style="font-size:11px;">${edu.year}</div>
      </div>
    `).join('');

    const experienceHtml = data.experience.map(exp => `
      <div style="margin-bottom:14px;">
        <div style="font-size:10px;font-style:italic;margin-bottom:2px;">${exp.date}</div>
        <div style="font-size:11px;font-weight:700;margin-bottom:2px;">${exp.company} — ${exp.location}</div>
        <div style="font-size:10px;font-style:italic;margin-bottom:6px;">${exp.role}</div>
        <div style="${expStyle}">${exp.description}</div>
      </div>
    `).join('');

    return `
    <html>
      <head>
        <meta charset="UTF-8" />
        <style>
          * { box-sizing: border-box; }
          body { margin: 0; font-family: Helvetica, Arial, sans-serif; background: #e5e7eb; }
          .page { display: flex; width: 100%; min-height: 1123px; background: #ffffff; }
          .sidebar {
            width: ${sidebarWidth};
            background: #373737;
            color: white;
            padding: 24px 20px;
            text-align: center;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 14px;
          }
          .main {
            width: ${mainWidth};
            padding: 0;
            background: white;
            display: flex;
            flex-direction: column;
          }
          .header {
            background: #A8C6A8;
            padding: 32px 30px 40px 30px;
            margin-bottom: 20px;
          }
          .name { font-size: 32px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin: 0; }
          .section { padding: 0 24px 16px 24px; }
          .section-title { font-size: 14px; font-weight: 700; text-transform: uppercase; margin: 12px 0 10px 0; border-bottom: 1px solid #333; padding-bottom: 4px; }
          .bullet-list { padding-left: 16px; margin: 0; }
          .bullet-list li { margin-bottom: 6px; }
          .edu-title { font-size: 14px; font-weight: 700; text-transform: uppercase; border-bottom: 1px solid #fff; padding-bottom: 4px; margin: 0 0 10px 0; }
          .personal-title { font-size: 14px; font-weight: 700; text-transform: uppercase; border-bottom: 1px solid #fff; padding-bottom: 4px; margin: 16px 0 8px 0; text-align:left; width:100%; }
          .sidebar-block { width: 100%; text-align: left; }
          .divider { border: none; border-bottom: 1px solid #d1d5db; margin: 16px 0; }
        </style>
      </head>
      <body>
        <div class="page">
          <div class="sidebar">
            ${image ? `<img src="${image}" style="width:140px;height:140px;border-radius:70px;object-fit:cover;background:#ccc;margin-bottom:8px;" />` : ''}
            ${sidebarContact}
            <div class="sidebar-block">
              <div class="edu-title">Education</div>
              ${sidebarEducation}
              <div class="personal-title">Personal Details</div>
              <div style="font-size:11px;color:#fff;">Languages: English</div>
            </div>
          </div>
          <div class="main">
            <div class="header">
              <div class="name">${data.personalDetails.fullName}</div>
            </div>
            <div class="section">
              <div class="section-title">Professional Summary</div>
              <div style="${summaryStyle}">${data.personalDetails.summary}</div>
            </div>
            <div class="section">
              <div class="section-title">Accomplishments</div>
              <div style="${accomplishmentsStyle}">${data.accomplishments}</div>
            </div>
            <div class="section">
              <div class="section-title">Work History</div>
              <div>${experienceHtml}</div>
            </div>
            <div class="section">
              <div class="section-title">Skills</div>
              <div style="${skillsStyle}">${data.skills}</div>
            </div>
          </div>
        </div>
      </body>
    </html>
    `;
  };

  const handleDownloadDoc = () => {
    const html = buildDocHtml(debouncedResumeData, debouncedProfileImage);
    const blob = new Blob(['\ufeff', html], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Resume_${debouncedResumeData.personalDetails.fullName.replace(/\s+/g, '_')}.doc`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <ErrorBoundary>
      <div className="flex flex-col h-screen">
        {/* Header */}
        <header className="bg-white shadow-sm z-10 p-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Resume Builder</h1>
          <div className="flex gap-4">
              <button 
                  onClick={() => setShowPreview(!showPreview)} 
                  className="md:hidden btn-secondary"
              >
                  <Eye className="mr-2 h-4 w-4" /> {showPreview ? 'Edit' : 'Preview'}
              </button>
              
              <button
                onClick={handleDownloadDoc}
                className="btn-secondary no-underline flex items-center"
              >
                <FileDown className="mr-2 h-4 w-4" />
                Download DOC
              </button>

              <a 
                href={instance.url || '#'} 
                download={`Resume_${debouncedResumeData.personalDetails.fullName.replace(/\s+/g, '_')}.pdf`}
                className={`btn-primary no-underline flex items-center ${instance.loading ? 'opacity-50 cursor-wait' : ''}`}
              >
                 <Download className="mr-2 h-4 w-4" /> 
                 {instance.loading ? 'Generating...' : 'Download PDF'}
              </a>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 flex overflow-hidden">
          {/* Editor Pane */}
          <div className={`w-full md:w-1/2 bg-gray-100 p-4 overflow-auto ${showPreview ? 'hidden md:block' : 'block'}`}>
            <ResumeEditor 
              data={resumeData} 
              onChange={setResumeData} 
              onImageUpload={handleImageUpload}
            />
          </div>

          {/* Preview Pane */}
          <div className={`w-full md:w-1/2 bg-gray-800 p-4 ${showPreview ? 'block' : 'hidden md:block'}`}>
            <div className="h-full w-full bg-white shadow-lg rounded-lg overflow-hidden">
              <PDFViewer width="100%" height="100%" className="border-none" showToolbar={false}>
                  {liveDocument}
              </PDFViewer>
            </div>
          </div>
        </main>
      </div>
    </ErrorBoundary>
  );
}

export default App;
