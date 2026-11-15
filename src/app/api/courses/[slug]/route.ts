import { NextResponse } from "next/server";
import { z } from "zod";
import { getStore } from "@/lib/store";
import { jsonError, parseJson } from "@/lib/api-utils";
import { courseBySlug } from "@/content/courses";
import { gradeQuiz } from "@/lib/engine/courses";
import { syncMemory } from "@/lib/engine/memory";
import { stateView } from "@/lib/server/state";

export const dynamic = "force-dynamic";

const schema = z
  .object({
    slideIndex: z.number().int().min(0).max(30).optional(),
    answers: z.array(z.number().int().min(0).max(10)).max(10).optional(),
  })
  .refine(
    (value) => value.slideIndex !== undefined || value.answers !== undefined,
    "Provide a slide index or quiz answers.",
  );

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const course = courseBySlug(slug);
  if (!course) return jsonError("Course not found.", 404);

  const parsed = await parseJson(request, schema);
  if (parsed.error) return parsed.error;

  try {
    const { state, result: outcome } = await getStore().mutate((state) => {
      let progress = state.courses.find((item) => item.slug === slug);
      if (!progress) {
        progress = {
          slug,
          slideIndex: 0,
          startedAt: new Date().toISOString(),
        };
        state.courses.push(progress);
      }

      let result:
        | {
            score?: number;
            total?: number;
            passed?: boolean;
            correct?: number[];
            progress: typeof progress;
          }
        | undefined;

      if (parsed.data.slideIndex !== undefined) {
        if (parsed.data.slideIndex >= course.slides.length) {
          throw new Error("Slide index is out of range.");
        }
        progress.slideIndex = parsed.data.slideIndex;
        result = { progress };
      }

      if (parsed.data.answers) {
        if (parsed.data.answers.length !== course.quiz.length) {
          throw new Error(
            `This quiz has ${course.quiz.length} questions; received ${parsed.data.answers.length} answers.`,
          );
        }
        const grade = gradeQuiz(course, parsed.data.answers);
        progress.score = grade.score;
        progress.total = grade.total;
        progress.answers = parsed.data.answers;
        if (grade.passed) {
          progress.completedAt = new Date().toISOString();
          progress.slideIndex = course.slides.length - 1;
        } else {
          progress.completedAt = undefined;
        }
        result = {
          ...grade,
          progress,
        };
      }

      syncMemory(state);
      return { progress, result };
    });

    return NextResponse.json(
      {
        ...stateView(state),
        progress: outcome.progress,
        ...(outcome.result ?? {}),
      },
      { headers: { "Cache-Control": "no-store, max-age=0" } },
    );
  } catch (error) {
    return jsonError(
      error instanceof Error ? error.message : "Could not save progress.",
    );
  }
}
