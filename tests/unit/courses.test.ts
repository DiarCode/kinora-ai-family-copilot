import { describe, expect, it } from "vitest";
import { courses, courseBySlug } from "@/content/courses";
import { assessmentBands } from "@/content/assessments";
import { gradeQuiz } from "@/lib/engine/courses";

describe("course grading", () => {
  const course = courseBySlug("emotion-coaching-in-90-seconds")!;

  it("passes with all correct answers", () => {
    const grade = gradeQuiz(course, [1, 1, 1]);
    expect(grade).toEqual({
      score: 3,
      total: 3,
      passed: true,
      correct: [1, 1, 1],
    });
  });

  it("passes with two of three correct", () => {
    const grade = gradeQuiz(course, [1, 1, 0]);
    expect(grade.score).toBe(2);
    expect(grade.passed).toBe(true);
  });

  it("fails with one correct answer", () => {
    const grade = gradeQuiz(course, [1, 0, 0]);
    expect(grade.score).toBe(1);
    expect(grade.passed).toBe(false);
  });

  it("rejects the wrong number of answers", () => {
    expect(() => gradeQuiz(course, [1, 1])).toThrow(/3 questions/);
  });

  it("rejects negative answers", () => {
    expect(() => gradeQuiz(course, [1, -1, 1])).toThrow(/valid answer/);
  });
});

describe("course content integrity", () => {
  it("has six unique courses with four slides and three quiz questions each", () => {
    expect(courses).toHaveLength(6);
    expect(new Set(courses.map((course) => course.slug)).size).toBe(6);
    for (const course of courses) {
      expect(course.slides).toHaveLength(4);
      expect(course.quiz).toHaveLength(3);
      expect(course.minutes).toBeGreaterThan(0);
      for (const question of course.quiz) {
        expect(question.options.length).toBeGreaterThanOrEqual(3);
        expect(question.correctIndex).toBeGreaterThanOrEqual(0);
        expect(question.correctIndex).toBeLessThan(question.options.length);
        expect(question.explanation.length).toBeGreaterThan(10);
      }
      expect(courseBySlug(course.slug)?.title).toBe(course.title);
    }
  });
});

describe("assessment content integrity", () => {
  it("has three age bands with the expected item counts", () => {
    expect(assessmentBands.map((band) => band.id)).toEqual([
      "early",
      "middle",
      "teen",
    ]);
    expect(assessmentBands[0].questions).toHaveLength(6);
    expect(assessmentBands[1].questions).toHaveLength(10);
    expect(assessmentBands[2].questions).toHaveLength(12);
  });

  it("covers every trait in every age band", () => {
    const traits = [
      "creativity",
      "analytical",
      "social",
      "emotional",
      "physical",
      "focus",
      "leadership",
    ];
    for (const band of assessmentBands) {
      const covered = new Set<string>();
      for (const question of band.questions) {
        for (const option of question.options) {
          for (const [trait, weight] of Object.entries(option.weights)) {
            if ((weight ?? 0) > 0) covered.add(trait);
          }
        }
      }
      for (const trait of traits) {
        expect(covered.has(trait), `${band.id} covers ${trait}`).toBe(true);
      }
    }
  });
});
