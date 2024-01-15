import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { Categories, Question, QuestionsState } from "./types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

function shuffleArray(array: string[]) {
	return [...array].sort(() => Math.random() - 0.5)
}

export async function fetchQuizQuestions(amount: number, difficulty: 'easy' | 'medium' | 'hard', category: string): Promise<QuestionsState[]> {
	const endpoint = `https://opentdb.com/api.php?amount=${amount}&difficulty=${difficulty}&type=multiple&category=${category}`;
	const data = await (await fetch(endpoint)).json();
	return data.results.map((question: Question) => ({
		...question,
		answers: shuffleArray([...question.incorrect_answers, question.correct_answer])
	}))
}

export const fetchCategories = async () => {
  const res = await fetch("https://opentdb.com/api_category.php");
  const { trivia_categories } = await res.json();
  const categories: Categories[] = trivia_categories;

  return categories;
};