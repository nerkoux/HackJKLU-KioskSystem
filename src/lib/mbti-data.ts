import { mbtiCareerPaths } from './utils';

// Define the MBTI personality info interface
interface MBTIPersonalityInfo {
  title: string;
  description: string;
  strengths: string[];
  careers: string[];
}

// MBTI personality type descriptions and information
const mbtiData: Record<string, MBTIPersonalityInfo> = {
  "ISTJ": {
    title: "The Inspector",
    description: "Practical, detail-oriented, and reliable. ISTJs are responsible organizers who value tradition and security.",
    strengths: [
      "Organized and detail-oriented",
      "Reliable and responsible",
      "Practical and logical",
      "Committed to traditions and stability",
      "Excellent at managing resources"
    ],
    careers: mbtiCareerPaths["ISTJ"] || ["Accountant", "Auditor", "Financial Analyst", "Project Manager", "Systems Analyst"]
  },
  "ISFJ": {
    title: "The Protector",
    description: "Caring, loyal, and traditional. ISFJs are dedicated to meeting obligations and serving the needs of others.",
    strengths: [
      "Supportive and reliable",
      "Patient and detail-oriented",
      "Observant of others' needs",
      "Excellent memory for details",
      "Loyal and committed"
    ],
    careers: mbtiCareerPaths["ISFJ"] || ["Nurse", "Teacher", "HR Specialist", "Social Worker", "Administrative Assistant"]
  },
  "INFJ": {
    title: "The Counselor",
    description: "Insightful, creative, and principled. INFJs are driven by their values and seek meaning in relationships and ideas.",
    strengths: [
      "Insightful about others",
      "Creative and visionary",
      "Principled and value-driven",
      "Committed to personal growth",
      "Excellent written communication"
    ],
    careers: mbtiCareerPaths["INFJ"] || ["Counselor", "Psychologist", "Writer", "HR Development Trainer", "Professor"]
  },
  "INTJ": {
    title: "The Architect",
    description: "Strategic, innovative, and independent. INTJs are driven by their own original ideas and are natural leaders.",
    strengths: [
      "Strategic thinking",
      "Independent and decisive",
      "Rational and logical",
      "High standards and determination",
      "Open to new ideas and approaches"
    ],
    careers: mbtiCareerPaths["INTJ"] || ["Scientist", "Engineer", "Investment Banker", "Software Developer", "Business Analyst"]
  },
  "ISTP": {
    title: "The Craftsman",
    description: "Practical, logical, and adaptable. ISTPs are observant troubleshooters who excel in technical fields.",
    strengths: [
      "Adaptable and resourceful",
      "Observant of details",
      "Logical and practical",
      "Independent problem-solver",
      "Good at understanding how things work"
    ],
    careers: mbtiCareerPaths["ISTP"] || ["Mechanic", "Engineer", "Pilot", "Forensic Scientist", "Programmer"]
  },
  "ISFP": {
    title: "The Artist",
    description: "Gentle, sensitive, and spontaneous. ISFPs live in the moment and seek to create beauty and harmony.",
    strengths: [
      "Artistic and creative",
      "Sensitive to others' feelings",
      "Adaptable and flexible",
      "Loyal to values and people",
      "Appreciative of beauty and aesthetics"
    ],
    careers: mbtiCareerPaths["ISFP"] || ["Artist", "Designer", "Veterinarian", "Chef", "Physical Therapist"]
  },
  "INFP": {
    title: "The Mediator",
    description: "Idealistic, compassionate, and creative. INFPs are guided by their core values and seek to help others.",
    strengths: [
      "Empathetic and compassionate",
      "Creative and imaginative",
      "Open-minded and flexible",
      "Passionate about causes",
      "Deep sense of idealism"
    ],
    careers: mbtiCareerPaths["INFP"] || ["Writer", "Counselor", "HR Manager", "Graphic Designer", "Librarian"]
  },
  "INTP": {
    title: "The Thinker",
    description: "Innovative, logical, and curious. INTPs are abstract thinkers who excel at finding solutions to complex problems.",
    strengths: [
      "Analytical and logical",
      "Original and creative thinking",
      "Open to new ideas",
      "Objective and rational",
      "Independent problem-solver"
    ],
    careers: mbtiCareerPaths["INTP"] || ["Software Developer", "Scientist", "Architect", "Professor", "Research Analyst"]
  },
  "ESTP": {
    title: "The Entrepreneur",
    description: "Energetic, action-oriented, and pragmatic. ESTPs are risk-takers who live in the moment and enjoy material comforts.",
    strengths: [
      "Energetic and action-oriented",
      "Adaptable and resourceful",
      "Observant of surroundings",
      "Practical problem-solver",
      "Persuasive and sociable"
    ],
    careers: mbtiCareerPaths["ESTP"] || ["Entrepreneur", "Sales Representative", "Marketing Executive", "Police Officer", "Paramedic"]
  },
  "ESFP": {
    title: "The Performer",
    description: "Spontaneous, enthusiastic, and friendly. ESFPs live in the moment and enjoy bringing others together.",
    strengths: [
      "Enthusiastic and spontaneous",
      "Excellent people skills",
      "Practical and observant",
      "Adaptable and resourceful",
      "Creative problem-solver"
    ],
    careers: mbtiCareerPaths["ESFP"] || ["Event Planner", "Tour Guide", "Performer", "Sales Representative", "Public Relations Specialist"]
  },
  "ENFP": {
    title: "The Champion",
    description: "Enthusiastic, creative, and sociable. ENFPs are people-centered innovators, motivated by possibilities and potential.",
    strengths: [
      "Enthusiastic and imaginative",
      "Excellent people skills",
      "Creative and innovative",
      "Strong communication abilities",
      "Perceptive about others"
    ],
    careers: mbtiCareerPaths["ENFP"] || ["Journalist", "Consultant", "Advertising Creative", "Public Relations", "Entrepreneur"]
  },
  "ENTP": {
    title: "The Debater",
    description: "Quick, ingenious, and outspoken. ENTPs are idea-oriented individuals who enjoy debates and challenging conventions.",
    strengths: [
      "Innovative and creative",
      "Adaptable and resourceful",
      "Excellent analytical skills",
      "Quick thinking and strategic",
      "Enthusiastic about new ideas"
    ],
    careers: mbtiCareerPaths["ENTP"] || ["Entrepreneur", "Lawyer", "Consultant", "Engineer", "Creative Director"]
  },
  "ESTJ": {
    title: "The Director",
    description: "Practical, direct, and organized. ESTJs value tradition, structure, and clear standards of behavior.",
    strengths: [
      "Organized and efficient",
      "Dedicated and reliable",
      "Strong leadership skills",
      "Practical and realistic",
      "Direct and honest communicator"
    ],
    careers: mbtiCareerPaths["ESTJ"] || ["Manager", "Judge", "Financial Officer", "School Principal", "Military Officer"]
  },
  "ESFJ": {
    title: "The Caregiver",
    description: "Warm, conscientious, and cooperative. ESFJs are sociable and caring, focused on maintaining harmony.",
    strengths: [
      "Warm and supportive",
      "Reliable and conscientious",
      "Strong practical skills",
      "Sensitive to others' needs",
      "Good at connecting people"
    ],
    careers: mbtiCareerPaths["ESFJ"] || ["Teacher", "Healthcare Worker", "Sales Manager", "Public Relations", "Office Manager"]
  },
  "ENFJ": {
    title: "The Giver",
    description: "Charismatic, empathetic, and responsible. ENFJs are natural leaders who inspire and motivate others.",
    strengths: [
      "Charismatic and inspiring",
      "Empathetic and supportive",
      "Natural leadership abilities",
      "Excellent communication skills",
      "Organized and decisive"
    ],
    careers: mbtiCareerPaths["ENFJ"] || ["Teacher", "HR Manager", "Marketing Manager", "Counselor", "Sales Trainer"]
  },
  "ENTJ": {
    title: "The Commander",
    description: "Strategic, logical, and efficient. ENTJs are natural leaders who value knowledge and competence.",
    strengths: [
      "Strategic and logical thinking",
      "Efficient and organized",
      "Strong leadership abilities",
      "Confident and decisive",
      "Driven to achieve goals"
    ],
    careers: mbtiCareerPaths["ENTJ"] || ["Executive", "Lawyer", "Management Consultant", "University Professor", "Entrepreneur"]
  }
};

// Function to get personality info based on MBTI type
export function getMBTIPersonalityInfo(mbtiType: string): MBTIPersonalityInfo {
  // Default fallback in case the type doesn't exist
  const defaultInfo: MBTIPersonalityInfo = {
    title: "Personality Profile",
    description: "Your unique combination of traits makes you adaptable to various situations and career paths.",
    strengths: ["Adaptability", "Problem-solving", "Communication", "Critical thinking", "Creativity"],
    careers: ["Project Manager", "Analyst", "Consultant", "Educator", "Entrepreneur"]
  };

  // Return the data for the specified MBTI type, or the default if not found
  return mbtiData[mbtiType.toUpperCase()] || defaultInfo;
}

// Export the interface for use in other files
export type { MBTIPersonalityInfo };