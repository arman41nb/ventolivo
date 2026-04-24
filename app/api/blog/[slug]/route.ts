import { NextResponse } from "next/server";
import { getRequestLogContext, logError, withRequestId } from "@/lib/logger";
import { blogPostQuerySchema } from "@/lib/validations";
import { getPublishedBlogPostBySlug } from "@/services/blog";

export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const logContext = getRequestLogContext(request);

  try {
    const { slug } = await params;
    const result = blogPostQuerySchema.safeParse({ slug });

    if (!result.success) {
      return withRequestId(
        NextResponse.json(
          { error: "Invalid slug format", details: result.error.flatten().fieldErrors },
          { status: 400 },
        ),
        logContext.requestId,
      );
    }

    const post = await getPublishedBlogPostBySlug(result.data.slug);

    if (!post) {
      return withRequestId(
        NextResponse.json({ error: "Blog post not found" }, { status: 404 }),
        logContext.requestId,
      );
    }

    return withRequestId(NextResponse.json({ post }), logContext.requestId);
  } catch (error) {
    logError("api.blog.detail", error, logContext);
    return withRequestId(
      NextResponse.json({ error: "Internal server error" }, { status: 500 }),
      logContext.requestId,
    );
  }
}

