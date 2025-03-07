import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function calculateMBTI(responses: string[]): string {
  const E = responses.filter(r => r === "E").length;
  const I = responses.filter(r => r === "I").length;
  const S = responses.filter(r => r === "S").length;
  const N = responses.filter(r => r === "N").length;
  const T = responses.filter(r => r === "T").length;
  const F = responses.filter(r => r === "F").length;
  const J = responses.filter(r => r === "J").length;
  const P = responses.filter(r => r === "P").length;

  let personality = "";
  personality += E > I ? "E" : "I";
  personality += S > N ? "S" : "N";
  personality += T > F ? "T" : "F";
  personality += J > P ? "J" : "P";

  return personality;
}

export const mbtiCareerPaths: Record<string, string[]> = {
  "ISTJ": ["Accountant", "Auditor", "Financial Analyst", "Project Manager", "Systems Analyst"],
  "ISFJ": ["Nurse", "Teacher", "HR Specialist", "Social Worker", "Administrative Assistant"],
  "INFJ": ["Counselor", "Psychologist", "Writer", "HR Development Trainer", "Professor"],
  "INTJ": ["Scientist", "Engineer", "Investment Banker", "Software Developer", "Business Analyst"],
  "ISTP": ["Mechanic", "Engineer", "Pilot", "Forensic Scientist", "Programmer"],
  "ISFP": ["Artist", "Designer", "Veterinarian", "Chef", "Physical Therapist"],
  "INFP": ["Writer", "Counselor", "HR Manager", "Graphic Designer", "Librarian"],
  "INTP": ["Software Developer", "Scientist", "Architect", "Professor", "Research Analyst"],
  "ESTP": ["Entrepreneur", "Sales Representative", "Marketing Executive", "Police Officer", "Paramedic"],
  "ESFP": ["Event Planner", "Tour Guide", "Performer", "Sales Representative", "Public Relations Specialist"],
  "ENFP": ["Journalist", "Consultant", "Advertising Creative", "Public Relations", "Entrepreneur"],
  "ENTP": ["Entrepreneur", "Lawyer", "Consultant", "Engineer", "Creative Director"],
  "ESTJ": ["Manager", "Judge", "Financial Officer", "School Principal", "Military Officer"],
  "ESFJ": ["Teacher", "Healthcare Worker", "Sales Manager", "Public Relations", "Office Manager"],
  "ENFJ": ["Teacher", "HR Manager", "Marketing Manager", "Counselor", "Sales Trainer"],
  "ENTJ": ["Executive", "Lawyer", "Management Consultant", "University Professor", "Entrepreneur"]
};