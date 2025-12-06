export interface Education {
  id: string;
  school: string;
  degree: string;
  year: string;
  location: string;
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  date: string;
  location: string;
  description: string; // Changed from string[] to HTML string
}

export interface PersonalDetails {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  title: string;
  summary: string; // Plain text or HTML? Let's assume plain text for summary in sidebar for now, or simple string. Actually user wants bold/italics everywhere.
  // Wait, summary in the PDF is in the main content, not sidebar.
  // Sidebar has contact info.
}

export interface ResumeData {
  personalDetails: PersonalDetails;
  education: Education[];
  experience: Experience[];
  skills: string; // Changed from string[] to HTML string
  accomplishments: string; // Changed from string[] to HTML string
}

export const initialResumeData: ResumeData = {
  personalDetails: {
    fullName: "ANKUSH WADHWA",
    title: "SENIOR PRODUCT MANAGER",
    email: "ankushwadhwa13@gmail.com",
    phone: "+1 647-809-3124",
    location: "Toronto Canada",
    website: "https://github.com/awadhwa0610/",
    summary: "Senior Product Manager with 15+ years of experience driving product strategy and e-commerce growth in high-volume, customer-centric environments. Expert in bridging the gap between business goals and technical execution to deliver luxury-quality user experiences. Proven track record of optimizing the post-purchase journey, increasing online sales revenue by 55%, and leading cross-functional Agile squads to launch high-impact features like digital wallets and real-time payments. Adept at using data analytics to inform roadmap decisions and scale products across international markets."
  },
  education: [
    {
      id: "1",
      school: "North Dakota State University",
      degree: "Bachelor of Science, Computer Science",
      year: "May 2010",
      location: "Fargo, USA"
    }
  ],
  experience: [
    {
      id: "1",
      company: "Ontario Lottery & Gaming Corp (OLG)",
      role: "Senior Product Owner (Digital Experience & Payment)",
      date: "November 2019 - Current",
      location: "Toronto, Canada",
      description: "<ul><li>Product Roadmap & Strategy: Define and maintain the product roadmap for the Digital Payments Portfolio, aligning features with business objectives and customer feedback to drive adoption.</li><li>User Experience Collaboration: Work closely with UX/UI designers to craft intuitive, user-friendly experiences for deposits and withdrawals, ensuring a friction-free journey that delights customers.</li><li>Data-Driven Optimization: Leverage analytics to identify drop-off points in the payment funnel, implementing optimizations that resulted in a 15% reduction in payment failures.</li><li>Agile Development: Lead cross-functional Agile squads through sprint planning and retrospectives, ensuring rapid iteration and timely delivery of high-value features.</li><li>Stakeholder Communication: Craft compelling narratives around product decisions and progress, ensuring executive stakeholders are aligned with the product vision and commercial outcomes.</li></ul>"
    }
  ],
  skills: "<ul><li>Product Strategy: Roadmap Development, Vision Setting, OKR Alignment, Market Research.</li><li>Data-Driven Decision Making: KPI Definition, A/B Testing, Funnel Analysis, Conversion Rate Optimization (CRO).</li><li>Technical: API Integrations, Payment Gateways, JIRA, Confluence, Figma.</li><li>E-Commerce & UX: Customer Journey Mapping, Checkout Optimization, Post-Purchase Experience, Mobile-First Design.</li><li>Agile Leadership: Sprint Planning, Backlog Prioritization, User Story Creation, Cross-Functional Team Leadership.</li></ul>",
  accomplishments: "<ul><li>HealthTech Founder (CuratedHim): Launched a niche Direct-to-Consumer (D2C) fitness & wellness platform driven by personal passion. Architected a secure subscription-based payment model for health products, successfully navigating complex regulatory compliance while building a community-focused brand.</li><li>E-Commerce Revenue Growth (Ujala): Led the product redesign of a B2B booking platform, optimizing the search-to-book flow and driving a 55% increase in online sales revenue.</li><li>Customer Journey Optimization (OLG): Spearheaded the launch of Apple Pay & Interac, streamlining the checkout process and boosting digital transaction volume by 30%.</li><li>Global Platform Scale (Smile): Managed an $8 Million portfolio of digital platforms for international markets, ensuring scalability and seamless API integrations for global enterprise clients.</li><li>Post-Purchase Experience (OLG): Directed the roadmap for Real-Time Disbursements, reducing customer withdrawal times from 3 days to minutes.</li></ul>"
};
