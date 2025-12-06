import React, { useState } from 'react';
import { PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';
import { initialResumeData, type ResumeData } from './types';
import { ResumeEditor } from './components/ResumeEditor';
import { ResumePDF } from './components/ResumePDF';
import { Download, Eye } from 'lucide-react';

function App() {
  const [resumeData, setResumeData] = useState<ResumeData>(initialResumeData);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(true);

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
            
            <PDFDownloadLink
                document={<ResumePDF data={resumeData} profileImage={profileImage} />}
                fileName={`Resume_${resumeData.personalDetails.fullName.replace(/\s+/g, '_')}.pdf`}
                className="btn-primary no-underline"
            >
                {({ loading }) => (
                    loading ? 'Generating PDF...' : (
                        <><Download className="mr-2 h-4 w-4" /> Download PDF</>
                    )
                )}
            </PDFDownloadLink>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex overflow-hidden">
        {/* Editor Pane - Hidden on mobile if preview is shown */}
        <div className={`w-full md:w-1/2 bg-gray-100 p-4 overflow-auto ${showPreview ? 'hidden md:block' : 'block'}`}>
          <ResumeEditor 
            data={resumeData} 
            onChange={setResumeData} 
            onImageUpload={handleImageUpload}
          />
        </div>

        {/* Preview Pane - Hidden on mobile if edit is shown */}
        <div className={`w-full md:w-1/2 bg-gray-800 p-4 ${showPreview ? 'block' : 'hidden md:block'}`}>
          <div className="h-full w-full bg-white shadow-lg rounded-lg overflow-hidden">
            <PDFViewer width="100%" height="100%" className="border-none">
              <ResumePDF data={resumeData} profileImage={profileImage} />
            </PDFViewer>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
