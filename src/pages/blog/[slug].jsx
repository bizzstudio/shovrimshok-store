// shovrimshok-store/src/pages/blog/[slug].jsx
import Link from "next/link";
import Image from "next/image";
import dayjs from "dayjs";
import "dayjs/locale/he";
import { useRouter } from "next/router";
import { NextSeo } from "next-seo";

import Layout from "@layout/Layout";
import useAsync from "@hooks/useAsync";
import useUtilsFunction from "@hooks/useUtilsFunction";
import BlogServices from "@services/BlogServices";
import Loading from "@component/preloader/Loading";

dayjs.locale("he");

const BlogPost = () => {
  const router = useRouter();
  const { slug } = router.query;
  const { showingTranslateValue } = useUtilsFunction();

  const { data: blog, loading, error } = useAsync(
    () => (slug ? BlogServices.getPublishedBlogBySlug(slug) : Promise.resolve(null)),
    [slug]
  );

  if (loading || !slug) {
    return (
      <Layout title="טוען..." description="מאמר">
        <div className="max-w-3xl mx-auto py-20">
          <Loading loading={true} />
        </div>
      </Layout>
    );
  }

  if (error || !blog) {
    return (
      <Layout title="המאמר לא נמצא" description="המאמר לא נמצא">
        <div className="max-w-3xl mx-auto py-20 px-4 text-center">
          <h1 className="text-2xl font-serif font-semibold text-customBlue mb-4">המאמר לא נמצא</h1>
          <Link href="/blog" className="text-customRed underline">חזרה לבלוג</Link>
        </div>
      </Layout>
    );
  }

  const title = showingTranslateValue(blog.title);
  const preview = showingTranslateValue(blog.preview);
  const content = showingTranslateValue(blog.content);

  return (
    <>
      <NextSeo
        title={title || "מאמר"}
        description={preview || ""}
        openGraph={{
          title: title || "",
          description: preview || "",
          images: blog.mainImage ? [{ url: blog.mainImage }] : [],
        }}
      />
      <Layout title={title || "מאמר"} description={preview || ""}>
        <article className="bg-white">
          <div className="max-w-3xl mx-auto px-3 sm:px-6 py-10 lg:py-16">
            <Link href="/blog" className="text-sm text-customRed underline mb-6 inline-block">
              ← חזרה לבלוג
            </Link>

            {blog.category && (
              <span className="inline-block bg-customRed-superLight text-customRed-dark text-xs px-2 py-1 rounded mb-3">
                {blog.category}
              </span>
            )}

            <h1 className="text-3xl lg:text-4xl font-serif font-semibold text-customBlue leading-tight mb-4">
              {title}
            </h1>

            <div className="flex items-center gap-3 text-sm text-gray-500 mb-6">
              {blog.authorImage && (
                <Image
                  src={blog.authorImage}
                  alt={blog.author || "author"}
                  width={36}
                  height={36}
                  className="rounded-full object-cover"
                />
              )}
              {blog.author && <span>{blog.author}</span>}
              <span className="text-gray-300">·</span>
              <time dateTime={blog.publishDate}>
                {dayjs(blog.publishDate).format("DD MMMM YYYY")}
              </time>
            </div>

            {blog.mainImage && (
              <div className="relative aspect-[16/9] rounded-lg overflow-hidden mb-8 bg-gray-100">
                <Image
                  src={blog.mainImage}
                  alt={title || "blog"}
                  fill
                  sizes="(max-width: 768px) 100vw, 768px"
                  className="object-cover"
                  priority
                />
              </div>
            )}

            {/* כשהתוכן נוצר באדמין (מקור מהימן) — מותר לרנדר HTML */}
            <div
              className="prose prose-base max-w-none text-gray-800 leading-8 [&_h2]:font-serif [&_h2]:text-2xl [&_h2]:mt-8 [&_h2]:mb-3 [&_h3]:font-serif [&_h3]:text-xl [&_h3]:mt-6 [&_h3]:mb-2 [&_p]:my-3 [&_a]:text-customRed [&_a]:underline [&_img]:rounded-lg [&_img]:my-4 [&_ul]:list-disc [&_ul]:pr-6 [&_ol]:list-decimal [&_ol]:pr-6"
              dangerouslySetInnerHTML={{ __html: content || "" }}
            />

            {Array.isArray(blog.tags) && blog.tags.length > 0 && (
              <div className="mt-10 pt-6 border-t border-gray-100 flex flex-wrap gap-2">
                {blog.tags.map((tag) => (
                  <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </article>
      </Layout>
    </>
  );
};

export default BlogPost;
