import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import { getDictionary } from "@/i18n";
import { isValidLocale, type Locale } from "@/i18n/config";
import { getAdminSession, getAdminSessionRecoveryPath } from "@/services/admin-auth";
import { getAdminNavItems } from "@/services/admin";
import { getAllBlogPosts } from "@/services/blog";
import { deleteBlogPostAction } from "./actions";

type BlogFilterKey = "all" | "published" | "draft" | "missing-seo";
type BlogSortKey = "recent" | "updated" | "title";

function estimateReadingTime(content: string): number {
  const words = content
    .replace(/<[^>]*>/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(words / 180));
}

export default async function AdminBlogPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{
    status?: string;
    q?: string;
    filter?: BlogFilterKey;
    sort?: BlogSortKey;
  }>;
}) {
  const { locale: rawLocale } = await params;

  if (!isValidLocale(rawLocale)) {
    notFound();
  }

  const locale = rawLocale as Locale;
  const [dictionary, session, posts, { status, q, filter, sort }] = await Promise.all([
    getDictionary(locale),
    getAdminSession(),
    getAllBlogPosts(),
    searchParams,
  ]);

  if (!session) {
    redirect(
      getAdminSessionRecoveryPath({
        locale,
        next: `/${locale}/admin/blog`,
      }),
    );
  }

  const searchTerm = (q ?? "").trim().toLowerCase();
  const activeFilter: BlogFilterKey =
    filter === "published" || filter === "draft" || filter === "missing-seo" ? filter : "all";
  const activeSort: BlogSortKey = sort === "updated" || sort === "title" ? sort : "recent";
  const filteredPosts = posts.filter((post) => {
    const matchesQuery =
      !searchTerm ||
      `${post.title} ${post.slug} ${post.summary} ${post.tags.join(" ")}`
        .toLowerCase()
        .includes(searchTerm);

    if (!matchesQuery) {
      return false;
    }

    if (activeFilter === "published") {
      return post.status === "published";
    }

    if (activeFilter === "draft") {
      return post.status === "draft";
    }

    if (activeFilter === "missing-seo") {
      return !(post.seoTitle?.trim() && post.seoDescription?.trim());
    }

    return true;
  });
  const orderedPosts = [...filteredPosts].sort((left, right) => {
    if (activeSort === "title") {
      return left.title.localeCompare(right.title, locale);
    }

    if (activeSort === "updated") {
      return right.updatedAt.getTime() - left.updatedAt.getTime();
    }

    const leftDate = left.publishedAt ?? left.createdAt;
    const rightDate = right.publishedAt ?? right.createdAt;
    return rightDate.getTime() - leftDate.getTime();
  });
  const publishedCount = posts.filter((post) => post.status === "published").length;
  const draftCount = posts.filter((post) => post.status === "draft").length;
  const missingSeoCount = posts.filter(
    (post) => !(post.seoTitle?.trim() && post.seoDescription?.trim()),
  ).length;

  function getFilterHref(nextFilter: BlogFilterKey) {
    const nextParams = new URLSearchParams();

    if (q?.trim()) {
      nextParams.set("q", q.trim());
    }

    if (activeSort !== "recent") {
      nextParams.set("sort", activeSort);
    }

    if (nextFilter !== "all") {
      nextParams.set("filter", nextFilter);
    }

    const query = nextParams.toString();
    return query ? `/${locale}/admin/blog?${query}` : `/${locale}/admin/blog`;
  }

  function getSortHref(nextSort: BlogSortKey) {
    const nextParams = new URLSearchParams();

    if (q?.trim()) {
      nextParams.set("q", q.trim());
    }

    if (activeFilter !== "all") {
      nextParams.set("filter", activeFilter);
    }

    if (nextSort !== "recent") {
      nextParams.set("sort", nextSort);
    }

    const query = nextParams.toString();
    return query ? `/${locale}/admin/blog?${query}` : `/${locale}/admin/blog`;
  }

  return (
    <AdminShell
      locale={locale}
      dictionary={dictionary}
      title="Blog Manager"
      description="Create, publish, and optimize articles with editorial control, SEO metadata, and index-friendly slugs."
      sessionSummary={{
        username: session.user.username,
        expiresLabel: `${dictionary.admin.dashboard.sessionExpires}: ${session.expiresAt.toLocaleString(locale)}`,
      }}
      navItems={getAdminNavItems(locale, "blog", dictionary.admin.navigation)}
      primaryAction={{
        href: `/${locale}/admin/blog/new`,
        label: "New post",
      }}
      secondaryAction={{
        href: `/${locale}/admin`,
        label: dictionary.admin.inventory.backToDashboard,
      }}
    >
      <section className="rounded-[34px] border border-brown/10 bg-[linear-gradient(135deg,rgba(255,252,247,0.84),rgba(239,228,215,0.92)_56%,rgba(255,255,255,0.88)_100%)] p-7 shadow-[0_24px_54px_rgba(107,79,58,0.1)] md:p-8">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_280px]">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-brown/10 bg-white/70 px-3 py-2 text-[11px] uppercase tracking-[0.22em] text-brown/82">
              Editorial / SEO
            </p>
            <h2 className="mt-5 font-serif text-4xl leading-[0.94] text-dark md:text-5xl">
              {orderedPosts.length} visible posts
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-text/78">
              Filter by publication status, missing SEO metadata, or free-text query to keep
              content quality and discoverability high.
            </p>

            <form className="mt-6">
              <input
                name="q"
                defaultValue={q ?? ""}
                placeholder="Search by title, slug, summary, or tag"
                className="w-full rounded-[20px] border border-brown/15 bg-white/80 px-5 py-4 text-sm outline-none transition-colors focus:border-brown"
              />
            </form>

            <div className="mt-5 flex flex-wrap gap-3">
              {status ? (
                <p className="inline-flex rounded-full border border-olive/15 bg-olive/10 px-4 py-2 text-sm text-olive">
                  {dictionary.admin.lastActionLabel}:{" "}
                  {dictionary.admin.status[status as keyof typeof dictionary.admin.status] ?? status}
                </p>
              ) : null}
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              {[
                { key: "all" as const, label: "All", count: posts.length },
                { key: "published" as const, label: "Published", count: publishedCount },
                { key: "draft" as const, label: "Draft", count: draftCount },
                { key: "missing-seo" as const, label: "Missing SEO", count: missingSeoCount },
              ].map((item) => (
                <Link
                  key={item.key}
                  href={getFilterHref(item.key)}
                  className={`rounded-full border px-4 py-2 text-xs uppercase tracking-[0.16em] transition-colors ${
                    activeFilter === item.key
                      ? "border-transparent bg-brown text-white"
                      : "border-brown/15 bg-white/78 text-brown hover:bg-white"
                  }`}
                >
                  {item.label} / {item.count}
                </Link>
              ))}
            </div>
          </div>

          <div className="grid gap-4">
            <article className="rounded-[26px] border border-white/55 bg-white/78 p-5 shadow-[0_16px_34px_rgba(107,79,58,0.08)]">
              <p className="text-[11px] uppercase tracking-[0.22em] text-muted">Published</p>
              <p className="mt-4 font-serif text-4xl text-dark">{publishedCount.toString().padStart(2, "0")}</p>
            </article>
            <article className="rounded-[26px] border border-brown/10 bg-[linear-gradient(135deg,rgba(223,229,212,0.72),rgba(255,255,255,0.94))] p-5 shadow-[0_16px_34px_rgba(107,79,58,0.08)]">
              <p className="text-[11px] uppercase tracking-[0.22em] text-muted">Draft</p>
              <p className="mt-4 font-serif text-4xl text-dark">{draftCount.toString().padStart(2, "0")}</p>
            </article>
            <article className="rounded-[26px] border border-brown/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.85),rgba(241,235,228,0.95))] p-5 shadow-[0_16px_34px_rgba(107,79,58,0.08)]">
              <p className="text-[11px] uppercase tracking-[0.22em] text-muted">Needs SEO</p>
              <p className="mt-4 font-serif text-4xl text-dark">{missingSeoCount.toString().padStart(2, "0")}</p>
            </article>
          </div>
        </div>
      </section>

      <section className="rounded-[34px] border border-white/55 bg-white/86 p-6 shadow-[0_24px_50px_rgba(107,79,58,0.1)] md:p-8">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <p className="text-[12px] uppercase tracking-[0.24em] text-muted">Blog posts</p>
            <h2 className="mt-2 font-serif text-3xl text-dark">Content inventory</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              { key: "recent" as const, label: "Recent" },
              { key: "updated" as const, label: "Updated" },
              { key: "title" as const, label: "Title" },
            ].map((item) => (
              <Link
                key={item.key}
                href={getSortHref(item.key)}
                className={`rounded-full border px-4 py-2 text-xs uppercase tracking-[0.16em] transition-colors ${
                  activeSort === item.key
                    ? "border-transparent bg-brown text-white"
                    : "border-brown/15 bg-white/78 text-brown hover:bg-white"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        {orderedPosts.length === 0 ? (
          <div className="rounded-[28px] border border-dashed border-brown/20 bg-[linear-gradient(180deg,rgba(255,252,247,0.76),rgba(239,228,215,0.58))] p-8 text-center">
            <p className="text-[11px] uppercase tracking-[0.2em] text-muted">No posts matched</p>
            <h3 className="mt-3 font-serif text-3xl text-dark">Try a broader filter</h3>
            <p className="mt-3 text-sm leading-7 text-text/72">
              You can clear the current search, change status filter, or create a new article.
            </p>
          </div>
        ) : null}

        <div className="flex flex-col gap-5">
          {orderedPosts.map((post) => (
            <article
              key={post.id}
              className="rounded-[30px] border border-brown/10 bg-[linear-gradient(135deg,rgba(255,252,247,0.76),rgba(239,228,215,0.78))] p-6 shadow-[0_16px_30px_rgba(107,79,58,0.05)]"
            >
              <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="font-serif text-3xl text-dark">{post.title}</h3>
                    <span
                      className={`rounded-full px-3 py-1 text-[11px] uppercase tracking-[0.16em] ${
                        post.status === "published"
                          ? "bg-olive/12 text-olive"
                          : "bg-amber-50 text-amber-800"
                      }`}
                    >
                      {post.status}
                    </span>
                    {!post.seoTitle || !post.seoDescription ? (
                      <span className="rounded-full bg-red-50 px-3 py-1 text-[11px] uppercase tracking-[0.16em] text-red-800">
                        Missing SEO fields
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-2 text-sm text-text/75">/{locale}/blog/{post.slug}</p>
                  <p className="mt-3 max-w-3xl text-sm leading-7 text-text/70">{post.summary}</p>
                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <span className="rounded-full border border-brown/10 bg-white/70 px-3 py-2 text-xs uppercase tracking-[0.16em] text-brown/72">
                      {estimateReadingTime(post.content)} min read
                    </span>
                    <span className="rounded-full border border-brown/10 bg-white/70 px-3 py-2 text-xs uppercase tracking-[0.16em] text-brown/60">
                      {post.tags.length ? post.tags.join(" / ") : "No tags"}
                    </span>
                    <span className="rounded-full border border-brown/10 bg-white/70 px-3 py-2 text-xs uppercase tracking-[0.16em] text-brown/60">
                      Updated {post.updatedAt.toLocaleDateString(locale)}
                    </span>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <Link
                    href={`/${locale}/admin/blog/${post.id}`}
                    className="rounded-full bg-[linear-gradient(135deg,#7c8c5e_0%,#6b4f3a_100%)] px-4 py-2 text-xs uppercase tracking-[0.16em] text-white transition-transform hover:-translate-y-0.5"
                  >
                    Edit
                  </Link>
                  <form action={deleteBlogPostAction}>
                    <input type="hidden" name="locale" value={locale} />
                    <input type="hidden" name="id" value={post.id} />
                    <button
                      type="submit"
                      className="rounded-full border border-red-600/30 bg-white/65 px-4 py-2 text-xs uppercase tracking-[0.16em] text-red-700 transition-colors hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </form>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </AdminShell>
  );
}
