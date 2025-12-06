import React, { useState, useEffect } from 'react';
import { PDFViewer, usePDF } from '@react-pdf/renderer';
import { initialResumeData, type ResumeData } from './types';
import { ResumeEditor } from './components/ResumeEditor';
import { ResumePDF } from './components/ResumePDF';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Download, Eye } from 'lucide-react';

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

  // Force re-render of PDFViewer when live data changes
  const [pdfKey, setPdfKey] = useState(0);

  useEffect(() => {
    setPdfKey(prev => prev + 1);
  }, [resumeData, profileImage]);

  // Use usePDF hook for download link to avoid background render crashes
  // IMPORTANT: We only update the instance when data STABILIZES (debounced)
  const [instance, updateInstance] = usePDF({ document: <ResumePDF data={debouncedResumeData} profileImage={debouncedProfileImage} /> });

  useEffect(() => {
      updateInstance(<ResumePDF data={debouncedResumeData} profileImage={debouncedProfileImage} />);
  }, [debouncedResumeData, debouncedProfileImage, updateInstance]);

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
              <PDFViewer key={pdfKey} width="100%" height="100%" className="border-none" showToolbar={false}>
                  <ResumePDF data={resumeData} profileImage={profileImage} />
                </PDFViewer>
            </div>
          </div>
        </main>
      </div>
    </ErrorBoundary>
  );
}

export default App;
