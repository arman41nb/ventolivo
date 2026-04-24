import { NextResponse } from "next/server";
import { getRequestLogContext, logError, withRequestId } from "@/lib/logger";
import { blogPostFilterSchema } from "@/lib/validations";
import { getPublishedBlogPosts } from "@/services/blog";

export async function GET(request: Request) {
  const logContext = getRequestLogContext(request);

  try {
    const { searchParams } = new URL(request.url);
    const params = Object.fromEntries(searchParams.entries());
    const result = blogPostFilterSchema.safeParse(params);

    if (!result.success) {
      return withRequestId(
        NextResponse.json(
          { error: "Invalid query parameters", details: result.error.flatten().fieldErrors },
          { status: 400 },
        ),
        logContext.requestId,
      );
    }

    const posts = await getPublishedBlogPosts(result.data);

    return withRequestId(NextResponse.json({ posts, count: posts.length }), logContext.requestId);
  } catch (error) {
    logError("api.blog.list", error, logContext);
    return withRequestId(
      NextResponse.json({ error: "Internal server error" }, { status: 500 }),
      logContext.requestId,
    );
  }
}

