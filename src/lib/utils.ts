import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Calculates the MBTI personality type based on the user's responses
 * @param responses Array of responses where each value is one of: E, I, S, N, T, F, J, P
 * @returns The four-letter MBTI personality type (e.g., "INTJ", "ESFP")
 */
export function calculateMBTI(responses: string[]): string {
  // Count occurrences of each dimension
  const counts = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  
  // Increment counts based on responses
  responses.forEach(response => {
    if (response in counts) {
      counts[response as keyof typeof counts]++;
    }
  });
  
  // Determine each dimension based on which has more responses
  const e_i = counts.E > counts.I ? 'E' : 'I';
  const s_n = counts.S > counts.N ? 'S' : 'N';
  const t_f = counts.T > counts.F ? 'T' : 'F';
  const j_p = counts.J > counts.P ? 'J' : 'P';
  
  // Combine the four dimensions to form the MBTI type
  return `${e_i}${s_n}${t_f}${j_p}`;
}

/**
 * Career path recommendations for each MBTI personality type
 */
export const mbtiCareerPaths: Record<string, string[]> = {
  "ISTJ": [
    "Accountant", 
    "Auditor", 
    "Financial Analyst", 
    "Project Manager", 
    "Systems Analyst", 
    "Database Administrator", 
    "Quality Assurance Specialist"
  ],
  "ISFJ": [
    "Nurse", 
    "Teacher", 
    "HR Specialist", 
    "Social Worker", 
    "Administrative Assistant", 
    "Dental Hygienist", 
    "Librarian"
  ],
  "INFJ": [
    "Counselor", 
    "Psychologist", 
    "Writer", 
    "HR Development Trainer", 
    "Professor", 
    "Non-profit Director", 
    "Environmental Scientist"
  ],
  "INTJ": [
    "Scientist", 
    "Engineer", 
    "Investment Banker", 
    "Software Developer", 
    "Business Analyst", 
    "Economist", 
    "Research Physician"
  ],
  "ISTP": [
    "Mechanic", 
    "Engineer", 
    "Pilot", 
    "Forensic Scientist", 
    "Programmer", 
    "Electrician", 
    "Technical Support Specialist"
  ],
  "ISFP": [
    "Artist", 
    "Designer", 
    "Veterinarian", 
    "Chef", 
    "Physical Therapist", 
    "Fashion Designer", 
    "Landscape Architect"
  ],
  "INFP": [
    "Writer", 
    "Counselor", 
    "HR Manager", 
    "Graphic Designer", 
    "Librarian", 
    "Social Worker", 
    "Environmental Advocate"
  ],
  "INTP": [
    "Software Developer", 
    "Scientist", 
    "Architect", 
    "Professor", 
    "Research Analyst", 
    "Mathematician", 
    "Systems Analyst"
  ],
  "ESTP": [
    "Entrepreneur", 
    "Sales Representative", 
    "Marketing Executive", 
    "Police Officer", 
    "Paramedic", 
    "Sports Coach", 
    "Construction Manager"
  ],
  "ESFP": [
    "Event Planner", 
    "Tour Guide", 
    "Performer", 
    "Sales Representative", 
    "Public Relations Specialist", 
    "Flight Attendant", 
    "Recreation Director"
  ],
  "ENFP": [
    "Journalist", 
    "Consultant", 
    "Advertising Creative", 
    "Public Relations", 
    "Entrepreneur", 
    "Actor", 
    "Marketing Manager"
  ],
  "ENTP": [
    "Entrepreneur", 
    "Lawyer", 
    "Consultant", 
    "Engineer", 
    "Creative Director", 
    "Venture Capitalist", 
    "Software Developer"
  ],
  "ESTJ": [
    "Manager", 
    "Judge", 
    "Financial Officer", 
    "School Principal", 
    "Military Officer", 
    "Insurance Agent", 
    "Pharmacist"
  ],
  "ESFJ": [
    "Teacher", 
    "Healthcare Worker", 
    "Sales Manager", 
    "Public Relations", 
    "Office Manager", 
    "Nurse", 
    "Social Worker"
  ],
  "ENFJ": [
    "Teacher", 
    "HR Manager", 
    "Marketing Manager", 
    "Counselor", 
    "Sales Trainer", 
    "Non-profit Director", 
    "Corporate Coach"
  ],
  "ENTJ": [
    "Executive", 
    "Lawyer", 
    "Management Consultant", 
    "University Professor", 
    "Entrepreneur", 
    "Business Administrator", 
    "Political Strategist"
  ]
};
