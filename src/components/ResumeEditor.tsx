import React from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import type { ResumeData, Education, Experience, FontSettings } from '../types';
import { Plus, Trash2 } from 'lucide-react';

interface ResumeEditorProps {
  data: ResumeData;
  onChange: (data: ResumeData) => void;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const modules = {
  toolbar: [
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    ['clean']
  ],
};

const fontOptions: Array<{ label: string; value: FontSettings[keyof FontSettings]['family'] }> = [
  { label: 'Helvetica', value: 'Helvetica' },
  { label: 'Times', value: 'Times-Roman' },
  { label: 'Courier', value: 'Courier' },
];

const sizeOptions = [9, 10, 11, 12, 13, 14, 16];

export const ResumeEditor: React.FC<ResumeEditorProps> = ({ data, onChange, onImageUpload }) => {
  
  const updatePersonal = (field: string, value: string) => {
    // Avoid infinite loops by checking if value actually changed
    if (data.personalDetails[field as keyof typeof data.personalDetails] === value) return;
    
    onChange({
      ...data,
      personalDetails: { ...data.personalDetails, [field]: value }
    });
  };

  const updateEducation = (index: number, field: keyof Education, value: string) => {
    const newEdu = [...data.education];
    newEdu[index] = { ...newEdu[index], [field]: value };
    onChange({ ...data, education: newEdu });
  };

  const addEducation = () => {
    onChange({
      ...data,
      education: [...data.education, { id: Date.now().toString(), school: '', degree: '', year: '', location: '' }]
    });
  };

  const removeEducation = (index: number) => {
    onChange({
      ...data,
      education: data.education.filter((_, i) => i !== index)
    });
  };

  const updateExperience = (index: number, field: keyof Experience, value: string) => {
    const currentVal = (data.experience[index] as any)[field];
    if (currentVal === value) return;

    const newExp = [...data.experience];
    // @ts-ignore - Dynamic assignment
    (newExp[index] as any)[field] = value;
    onChange({ ...data, experience: newExp });
  };

  const addExperience = () => {
    onChange({
      ...data,
      experience: [...data.experience, { id: Date.now().toString(), company: '', role: '', date: '', location: '', description: '' }]
    });
  };

  const removeExperience = (index: number) => {
    onChange({
      ...data,
      experience: data.experience.filter((_, i) => i !== index)
    });
  };

  const updateRichText = (field: 'skills' | 'accomplishments', value: string) => {
    if (data[field] === value) return;
    onChange({ ...data, [field]: value });
  };

  const updateFontSetting = (
    section: keyof FontSettings,
    key: keyof FontSettings[keyof FontSettings],
    value: FontSettings[keyof FontSettings][keyof FontSettings[keyof FontSettings]]
  ) => {
    onChange({
      ...data,
      fontSettings: {
        ...data.fontSettings,
        [section]: {
          ...data.fontSettings[section],
          [key]: value,
        },
      },
    });
  };

  return (
    <div className="space-y-8 p-4 bg-white rounded-lg shadow overflow-y-auto h-full">
      
      {/* Font Settings */}
      <section>
        <h2 className="text-xl font-bold mb-2 text-gray-800">Font Settings</h2>
        <p className="text-sm text-gray-600 mb-3">Apply fonts and sizes per section (PDF updates live).</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(['summary', 'accomplishments', 'skills', 'experience'] as Array<keyof FontSettings>).map((section) => (
            <div key={section} className="p-3 border rounded bg-gray-50">
              <div className="text-sm font-semibold text-gray-700 mb-2 capitalize">{section}</div>
              <div className="flex gap-2">
                <select
                  className="input-field"
                  value={data.fontSettings[section].family}
                  onChange={(e) => updateFontSetting(section, 'family', e.target.value as FontSettings[keyof FontSettings]['family'])}
                >
                  {fontOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                <select
                  className="input-field"
                  value={data.fontSettings[section].size}
                  onChange={(e) => updateFontSetting(section, 'size', Number(e.target.value))}
                >
                  {sizeOptions.map((size) => (
                    <option key={size} value={size}>{size}px</option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>
      </section>

      <hr />

      {/* Personal Details */}
      <section>
        <h2 className="text-xl font-bold mb-4 text-gray-800">Personal Details</h2>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Profile Photo</label>
            <input type="file" accept="image/*" onChange={onImageUpload} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"/>
          </div>
          <input className="input-field" placeholder="Full Name" value={data.personalDetails.fullName} onChange={(e) => updatePersonal('fullName', e.target.value)} />
          <input className="input-field" placeholder="Title" value={data.personalDetails.title} onChange={(e) => updatePersonal('title', e.target.value)} />
          <input className="input-field" placeholder="Email" value={data.personalDetails.email} onChange={(e) => updatePersonal('email', e.target.value)} />
          <input className="input-field" placeholder="Phone" value={data.personalDetails.phone} onChange={(e) => updatePersonal('phone', e.target.value)} />
          <input className="input-field" placeholder="Location" value={data.personalDetails.location} onChange={(e) => updatePersonal('location', e.target.value)} />
          <input className="input-field" placeholder="Website/Link" value={data.personalDetails.website} onChange={(e) => updatePersonal('website', e.target.value)} />
          
          <label className="block text-sm font-medium text-gray-700 mt-2">Professional Summary</label>
          <ReactQuill 
            theme="snow" 
            value={data.personalDetails.summary} 
            onChange={(val) => updatePersonal('summary', val)} 
            modules={modules}
            style={{ fontFamily: data.fontSettings.summary.family, fontSize: data.fontSettings.summary.size }}
          />
        </div>
      </section>

      <hr />

      {/* Education */}
      <section>
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">Education</h2>
            <button onClick={addEducation} className="btn-secondary flex items-center gap-1"><Plus size={16}/> Add</button>
        </div>
        {data.education.map((edu, index) => (
            <div key={edu.id} className="mb-4 p-4 border rounded bg-gray-50 relative">
                <button onClick={() => removeEducation(index)} className="absolute top-2 right-2 text-red-500"><Trash2 size={16}/></button>
                <div className="grid gap-2">
                    <input className="input-field" placeholder="School" value={edu.school} onChange={(e) => updateEducation(index, 'school', e.target.value)} />
                    <input className="input-field" placeholder="Degree" value={edu.degree} onChange={(e) => updateEducation(index, 'degree', e.target.value)} />
                    <input className="input-field" placeholder="Year" value={edu.year} onChange={(e) => updateEducation(index, 'year', e.target.value)} />
                    <input className="input-field" placeholder="Location" value={edu.location} onChange={(e) => updateEducation(index, 'location', e.target.value)} />
                </div>
            </div>
        ))}
      </section>

      <hr />

      {/* Experience */}
      <section>
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">Work History</h2>
            <button onClick={addExperience} className="btn-secondary flex items-center gap-1"><Plus size={16}/> Add Job</button>
        </div>
        {data.experience.map((exp, index) => (
            <div key={exp.id} className="mb-6 p-4 border rounded bg-gray-50 relative">
                <button onClick={() => removeExperience(index)} className="absolute top-2 right-2 text-red-500"><Trash2 size={16}/></button>
                <div className="grid gap-2 mb-4">
                    <input className="input-field" placeholder="Company" value={exp.company} onChange={(e) => updateExperience(index, 'company', e.target.value)} />
                    <input className="input-field" placeholder="Role" value={exp.role} onChange={(e) => updateExperience(index, 'role', e.target.value)} />
                    <input className="input-field" placeholder="Date Range" value={exp.date} onChange={(e) => updateExperience(index, 'date', e.target.value)} />
                    <input className="input-field" placeholder="Location" value={exp.location} onChange={(e) => updateExperience(index, 'location', e.target.value)} />
                </div>
                
                <div className="pl-4 border-l-2 border-gray-300">
                    <label className="block text-xs font-bold text-gray-500 mb-2">Responsibilities / Description</label>
                    <ReactQuill 
                      theme="snow" 
                      value={exp.description} 
                      onChange={(val) => updateExperience(index, 'description', val)} 
                      modules={modules} 
                      style={{ fontFamily: data.fontSettings.experience.family, fontSize: data.fontSettings.experience.size }}
                    />
                </div>
            </div>
        ))}
      </section>

      <hr />

      {/* Accomplishments */}
      <section>
         <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">Accomplishments</h2>
        </div>
        <ReactQuill 
          theme="snow" 
          value={data.accomplishments} 
          onChange={(val) => updateRichText('accomplishments', val)} 
          modules={modules} 
          style={{ fontFamily: data.fontSettings.accomplishments.family, fontSize: data.fontSettings.accomplishments.size }}
        />
      </section>

      <hr />

      {/* Skills */}
      <section>
         <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">Skills</h2>
        </div>
        <ReactQuill 
          theme="snow" 
          value={data.skills} 
          onChange={(val) => updateRichText('skills', val)} 
          modules={modules} 
          style={{ fontFamily: data.fontSettings.skills.family, fontSize: data.fontSettings.skills.size }}
        />
      </section>

    </div>
  );
};
