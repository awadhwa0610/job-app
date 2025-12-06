import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';
import type { ResumeData } from '../types';
import { HtmlPdf } from './HtmlPdf';

// We rely on standard built-in Helvetica which supports bold/italic automatically without registration.
// If we needed a custom font (like Roboto or Open Sans), we would register it here.
// Removing the manual registration avoids potential network loading issues or format incompatibilities.

const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    fontFamily: 'Helvetica',
  },
  sidebar: {
    width: '30%',
    backgroundColor: '#373737',
    color: 'white',
    padding: 20,
    alignItems: 'center',
  },
  main: {
    width: '70%',
    padding: 0,
  },
  // Sidebar Styles
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
    objectFit: 'cover',
    backgroundColor: '#cccccc', 
  },
  sidebarSection: {
    marginBottom: 20,
    width: '100%',
    alignItems: 'center',
  },
  sidebarTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
    textTransform: 'uppercase',
    borderBottom: '1px solid white',
    paddingBottom: 4,
    width: '100%',
    textAlign: 'left',
    marginTop: 20,
  },
  sidebarText: {
    fontSize: 9,
    marginBottom: 4,
    textAlign: 'center',
    lineHeight: 1.4,
  },
  
  // Main Styles
  headerNameContainer: {
    backgroundColor: '#A8C6A8', // Sage green
    padding: 30,
    paddingBottom: 40,
    marginBottom: 20,
  },
  name: {
    fontSize: 32,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  summarySection: {
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginBottom: 10,
    borderBottom: '1px solid #333',
    paddingBottom: 4,
    marginTop: 10,
  },
  sectionContent: {
    fontSize: 10,
    lineHeight: 1.5,
    textAlign: 'justify',
  },
  
  // Experience Styles
  experienceItem: {
    marginBottom: 10,
  },
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  companyName: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  jobDate: {
    fontSize: 10,
    fontStyle: 'italic',
  },
  jobRole: {
    fontSize: 10,
    fontStyle: 'italic',
    marginBottom: 4,
  },

  // Skills Styles (Columns)
  skillsWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  skillColumn: {
    width: '48%', // Use 48% to leave a small gap
  }
});

interface ResumePDFProps {
  data: ResumeData;
  profileImage?: string | null;
}

export const ResumePDF: React.FC<ResumePDFProps> = ({ data, profileImage }) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Left Sidebar */}
        <View style={styles.sidebar}>
          {profileImage && (
            <Image src={profileImage} style={styles.profileImage} />
          )}
          
          <View style={styles.sidebarSection}>
            <Text style={styles.sidebarText}>{data.personalDetails.email}</Text>
            <Text style={styles.sidebarText}>{data.personalDetails.phone}</Text>
            <Text style={styles.sidebarText}>{data.personalDetails.location}</Text>
            <Text style={styles.sidebarText}>{data.personalDetails.website}</Text>
          </View>

          <View style={styles.sidebarSection}>
            <Text style={styles.sidebarTitle}>EDUCATION</Text>
            {data.education.map((edu) => (
              <View key={edu.id} style={{ marginBottom: 10, width: '100%' }}>
                <Text style={{ fontSize: 10, fontWeight: 'bold' }}>{edu.degree}</Text>
                <Text style={{ fontSize: 10 }}>{edu.school}, {edu.location}</Text>
                <Text style={{ fontSize: 10 }}>{edu.year}</Text>
              </View>
            ))}
          </View>

          <View style={styles.sidebarSection}>
            <Text style={styles.sidebarTitle}>PERSONAL DETAILS</Text>
            <Text style={{ fontSize: 10, width: '100%' }}>Languages: English</Text>
          </View>
        </View>

        {/* Main Content */}
        <View style={styles.main}>
          <View style={styles.headerNameContainer}>
            <Text style={styles.name}>{data.personalDetails.fullName}</Text>
          </View>

          <View style={{ paddingHorizontal: 20 }}>
            
            {/* Summary */}
            <View style={styles.summarySection}>
              <Text style={styles.sectionTitle}>PROFESSIONAL SUMMARY</Text>
              <HtmlPdf html={data.personalDetails.summary} />
            </View>

            {/* Accomplishments */}
            <View style={styles.summarySection}>
              <Text style={styles.sectionTitle}>ACCOMPLISHMENTS</Text>
              <HtmlPdf html={data.accomplishments} />
            </View>

            {/* Work History */}
            <View style={styles.summarySection}>
              <Text style={styles.sectionTitle}>WORK HISTORY</Text>
              {data.experience.map((exp) => (
                <View key={exp.id} style={styles.experienceItem}>
                  <View style={styles.jobHeader}>
                    <Text style={styles.jobDate}>{exp.date}</Text>
                  </View>
                  <Text style={[styles.companyName, { marginBottom: 2 }]}>
                    {exp.company} — {exp.location}
                  </Text>
                  <Text style={styles.jobRole}>{exp.role}</Text>
                  
                  <HtmlPdf html={exp.description} />
                </View>
              ))}
            </View>

            {/* Skills */}
            <View style={styles.summarySection}>
              <Text style={styles.sectionTitle}>SKILLS</Text>
              <HtmlPdf html={data.skills} />
            </View>

          </View>
        </View>
      </Page>
    </Document>
  );
};
