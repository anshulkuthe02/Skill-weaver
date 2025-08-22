const mongoose = require('mongoose');
const Template = require('../models/Template');
require('dotenv').config();

// Sample template data
const templatesData = [
  {
    name: "Modern Developer Portfolio",
    slug: "modern-developer-portfolio",
    category: "developer",
    subcategory: "frontend",
    description: "A sleek, modern portfolio perfect for frontend developers and full-stack engineers",
    longDescription: "This contemporary portfolio template features a clean design with smooth animations, dark mode support, and responsive layout. Perfect for developers who want to showcase their projects with style.",
    preview: {
      thumbnail: "/templates/modern-developer/thumbnail.jpg",
      images: [
        { url: "/templates/modern-developer/preview1.jpg", alt: "Homepage preview" },
        { url: "/templates/modern-developer/preview2.jpg", alt: "Projects section" }
      ],
      demoUrl: "https://demo.skillweave.com/modern-developer"
    },
    features: [
      { name: "Responsive Design", description: "Looks great on all devices", icon: "📱" },
      { name: "Dark Mode", description: "Built-in theme switcher", icon: "🌙" },
      { name: "Smooth Animations", description: "Engaging user interactions", icon: "✨" },
      { name: "Project Gallery", description: "Showcase your work", icon: "🖼️" }
    ],
    technologies: [
      { name: "React", category: "frontend" },
      { name: "TypeScript", category: "frontend" },
      { name: "Tailwind CSS", category: "frontend" }
    ],
    difficulty: "intermediate",
    estimatedTime: { setup: 15, customization: 60 },
    structure: {
      sections: [
        {
          id: "hero",
          name: "Hero Section",
          description: "Main introduction and call-to-action",
          isRequired: true,
          fields: [
            { name: "name", type: "text", label: "Full Name", isRequired: true },
            { name: "title", type: "text", label: "Professional Title", isRequired: true },
            { name: "tagline", type: "textarea", label: "Tagline/Bio" }
          ]
        },
        {
          id: "about",
          name: "About Section",
          description: "Personal and professional background",
          isRequired: true,
          fields: [
            { name: "bio", type: "textarea", label: "About Me", isRequired: true },
            { name: "skills", type: "multiselect", label: "Skills" }
          ]
        }
      ]
    },
    design: {
      colorSchemes: [
        {
          name: "Ocean Blue",
          primary: "#3B82F6",
          secondary: "#1E40AF",
          accent: "#06B6D4",
          background: "#FFFFFF",
          text: "#1F2937"
        }
      ],
      fonts: [
        { name: "Inter", family: "Inter, sans-serif", weights: ["400", "500", "600"] }
      ],
      layout: {
        type: "single-page",
        responsive: true,
        animations: true
      }
    },
    tags: ["modern", "developer", "responsive", "dark-mode"],
    isPremium: false,
    isFeatured: true
  },
  {
    name: "Creative Designer Showcase",
    slug: "creative-designer-showcase",
    category: "creative",
    subcategory: "design",
    description: "A vibrant, visual-first portfolio for designers and creative professionals",
    longDescription: "Designed specifically for creative professionals, this template puts visual work front and center with an artistic layout, custom animations, and portfolio grid system.",
    preview: {
      thumbnail: "/templates/creative-designer/thumbnail.jpg",
      images: [
        { url: "/templates/creative-designer/preview1.jpg", alt: "Creative homepage" },
        { url: "/templates/creative-designer/preview2.jpg", alt: "Portfolio grid" }
      ],
      demoUrl: "https://demo.skillweave.com/creative-designer"
    },
    features: [
      { name: "Portfolio Grid", description: "Beautiful project showcase", icon: "🎨" },
      { name: "Custom Animations", description: "Artistic transitions", icon: "🎬" },
      { name: "Color Customization", description: "Brand color integration", icon: "🌈" },
      { name: "Image Galleries", description: "Multiple image support", icon: "📸" }
    ],
    technologies: [
      { name: "HTML5", category: "frontend" },
      { name: "CSS3", category: "frontend" },
      { name: "JavaScript", category: "frontend" }
    ],
    difficulty: "beginner",
    estimatedTime: { setup: 10, customization: 45 },
    tags: ["creative", "design", "portfolio", "visual"],
    isPremium: false,
    isFeatured: true
  },
  {
    name: "Executive Professional",
    slug: "executive-professional",
    category: "professional",
    subcategory: "business",
    description: "Elegant, corporate-style portfolio for executives and business professionals",
    longDescription: "A sophisticated template designed for C-level executives, consultants, and senior professionals. Features a clean, corporate aesthetic with focus on achievements and testimonials.",
    preview: {
      thumbnail: "/templates/executive-professional/thumbnail.jpg",
      images: [
        { url: "/templates/executive-professional/preview1.jpg", alt: "Executive homepage" },
        { url: "/templates/executive-professional/preview2.jpg", alt: "Achievements section" }
      ],
      demoUrl: "https://demo.skillweave.com/executive-professional"
    },
    features: [
      { name: "Professional Layout", description: "Corporate-grade design", icon: "💼" },
      { name: "Testimonials", description: "Client recommendations", icon: "💬" },
      { name: "Achievement Timeline", description: "Career milestones", icon: "🏆" },
      { name: "Contact Forms", description: "Professional inquiry system", icon: "📧" }
    ],
    technologies: [
      { name: "React", category: "frontend" },
      { name: "Styled Components", category: "frontend" }
    ],
    difficulty: "intermediate",
    estimatedTime: { setup: 20, customization: 90 },
    tags: ["professional", "executive", "corporate", "business"],
    isPremium: true,
    isFeatured: false
  },
  {
    name: "Startup Founder",
    slug: "startup-founder",
    category: "business",
    subcategory: "entrepreneur",
    description: "Dynamic portfolio for entrepreneurs and startup founders",
    longDescription: "Perfect for startup founders and entrepreneurs who need to showcase their ventures, team, and vision. Includes sections for company portfolio and investor information.",
    preview: {
      thumbnail: "/templates/startup-founder/thumbnail.jpg",
      images: [
        { url: "/templates/startup-founder/preview1.jpg", alt: "Founder homepage" },
        { url: "/templates/startup-founder/preview2.jpg", alt: "Ventures section" }
      ],
      demoUrl: "https://demo.skillweave.com/startup-founder"
    },
    features: [
      { name: "Venture Showcase", description: "Highlight your companies", icon: "🚀" },
      { name: "Team Profiles", description: "Showcase your team", icon: "👥" },
      { name: "Investor Relations", description: "Professional pitch deck", icon: "📊" },
      { name: "News & Updates", description: "Company announcements", icon: "📰" }
    ],
    technologies: [
      { name: "Next.js", category: "frontend" },
      { name: "TypeScript", category: "frontend" },
      { name: "Chakra UI", category: "frontend" }
    ],
    difficulty: "advanced",
    estimatedTime: { setup: 30, customization: 120 },
    tags: ["startup", "entrepreneur", "business", "founder"],
    isPremium: true,
    isFeatured: true
  },
  {
    name: "Student Portfolio",
    slug: "student-portfolio",
    category: "student",
    subcategory: "academic",
    description: "Clean, simple portfolio perfect for students and new graduates",
    longDescription: "Designed for students, recent graduates, and those starting their careers. Focuses on education, projects, and potential rather than extensive work experience.",
    preview: {
      thumbnail: "/templates/student-portfolio/thumbnail.jpg",
      images: [
        { url: "/templates/student-portfolio/preview1.jpg", alt: "Student homepage" },
        { url: "/templates/student-portfolio/preview2.jpg", alt: "Projects section" }
      ],
      demoUrl: "https://demo.skillweave.com/student-portfolio"
    },
    features: [
      { name: "Education Focus", description: "Highlight academic achievements", icon: "🎓" },
      { name: "Project Showcase", description: "Display coursework and projects", icon: "📝" },
      { name: "Skills Development", description: "Show learning progress", icon: "📈" },
      { name: "Contact Ready", description: "Ready for job applications", icon: "📞" }
    ],
    technologies: [
      { name: "HTML5", category: "frontend" },
      { name: "CSS3", category: "frontend" },
      { name: "Bootstrap", category: "frontend" }
    ],
    difficulty: "beginner",
    estimatedTime: { setup: 5, customization: 30 },
    tags: ["student", "graduate", "academic", "simple"],
    isPremium: false,
    isFeatured: false
  },
  {
    name: "Freelancer Pro",
    slug: "freelancer-pro",
    category: "freelancer",
    subcategory: "services",
    description: "Professional portfolio for freelancers and independent contractors",
    longDescription: "Comprehensive template for freelancers who need to showcase services, testimonials, pricing, and availability. Includes booking and contact functionality.",
    preview: {
      thumbnail: "/templates/freelancer-pro/thumbnail.jpg",
      images: [
        { url: "/templates/freelancer-pro/preview1.jpg", alt: "Freelancer homepage" },
        { url: "/templates/freelancer-pro/preview2.jpg", alt: "Services section" }
      ],
      demoUrl: "https://demo.skillweave.com/freelancer-pro"
    },
    features: [
      { name: "Service Packages", description: "Showcase your offerings", icon: "📦" },
      { name: "Client Testimonials", description: "Build trust with reviews", icon: "⭐" },
      { name: "Availability Calendar", description: "Show your schedule", icon: "📅" },
      { name: "Pricing Tables", description: "Clear service pricing", icon: "💰" }
    ],
    technologies: [
      { name: "Vue.js", category: "frontend" },
      { name: "Tailwind CSS", category: "frontend" },
      { name: "Node.js", category: "backend" }
    ],
    difficulty: "intermediate",
    estimatedTime: { setup: 25, customization: 75 },
    tags: ["freelancer", "services", "pricing", "booking"],
    isPremium: true,
    isFeatured: false
  }
];

async function seedTemplates() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/skillweave');
    console.log('✅ Connected to MongoDB');

    // Clear existing templates
    await Template.deleteMany({});
    console.log('🗑️ Cleared existing templates');

    // Insert new templates
    const insertedTemplates = await Template.insertMany(templatesData);
    console.log(`✅ Inserted ${insertedTemplates.length} templates`);

    // Log inserted templates
    insertedTemplates.forEach(template => {
      console.log(`   - ${template.name} (${template.category})`);
    });

    console.log('🎉 Template seeding completed successfully!');
    
  } catch (error) {
    console.error('❌ Error seeding templates:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔐 Database connection closed');
  }
}

// Run the seeding function
if (require.main === module) {
  seedTemplates();
}

module.exports = { seedTemplates, templatesData };
