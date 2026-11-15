import type { Course } from "@/lib/types";

export type QuizGrade = {
  score: number;
  total: number;
  passed: boolean;
  correct: number[];
};

export function gradeQuiz(course: Course, answers: number[]): QuizGrade {
  if (answers.length !== course.quiz.length) {
    throw new Error(
      `This quiz has ${course.quiz.length} questions; received ${answers.length} answers.`,
    );
  }
  if (answers.some((answer) => !Number.isInteger(answer) || answer < 0)) {
    throw new Error("Every question needs a valid answer.");
  }
  const correct = course.quiz.map((question) => question.correctIndex);
  const score = answers.reduce(
    (total, answer, index) => total + (answer === correct[index] ? 1 : 0),
    0,
  );
  return {
    score,
    total: course.quiz.length,
    passed: score >= Math.ceil((course.quiz.length * 2) / 3),
    correct,
  };
}
