// shovrimshok-store/src/pages/blog/index.jsx
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import dayjs from "dayjs";
import "dayjs/locale/he";

import Layout from "@layout/Layout";
import useAsync from "@hooks/useAsync";
import useUtilsFunction from "@hooks/useUtilsFunction";
import BlogServices from "@services/BlogServices";
import Loading from "@component/preloader/Loading";

dayjs.locale("he");

const PAGE_SIZE = 9;

const BlogIndex = () => {
  const { showingTranslateValue } = useUtilsFunction();
  const [page, setPage] = useState(1);
  const [activeCategory, setActiveCategory] = useState("");

  const { data, loading, error } = useAsync(
    () => BlogServices.getPublishedBlogs({ page, limit: PAGE_SIZE, category: activeCategory || undefined }),
    [page, activeCategory]
  );
  const { data: categories } = useAsync(() => BlogServices.getBlogCategories());

  const blogs = data?.blogs || [];
  const totalPages = data?.totalPages || 1;

  return (
    <Layout title="הבלוג" description="מאמרים, חדשות וטיפים">
      <div className="bg-white">
        <div className="max-w-screen-2xl mx-auto px-3 sm:px-10 py-10 lg:py-16">
          <header className="text-center mb-8 lg:mb-12">
            <h1 className="text-3xl lg:text-4xl font-serif font-semibold text-customBlue mb-3">
              הבלוג
            </h1>
            <p className="text-gray-500 max-w-2xl mx-auto">
              מאמרים, חדשות וטיפים — מתעדכן באופן שוטף
            </p>
          </header>

          {/* category filter */}
          {categories && categories.filter(Boolean).length > 0 && (
            <div className="flex flex-wrap gap-2 justify-center mb-8">
              <button
                onClick={() => { setActiveCategory(""); setPage(1); }}
                className={`px-4 py-2 text-sm rounded-full transition-all ${activeCategory === "" ? "bg-customRed text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
              >
                הכל
              </button>
              {categories.filter(Boolean).map((cat) => (
                <button
                  key={cat}
                  onClick={() => { setActiveCategory(cat); setPage(1); }}
                  className={`px-4 py-2 text-sm rounded-full transition-all ${activeCategory === cat ? "bg-customRed text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}

          {loading ? (
            <Loading loading={loading} />
          ) : error ? (
            <p className="text-center text-red-400 py-20">אירעה שגיאה בטעינת הבלוג.</p>
          ) : blogs.length === 0 ? (
            <p className="text-center text-gray-500 py-20">לא נמצאו מאמרים.</p>
          ) : (
            <>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {blogs.map((blog) => {
                  const title = showingTranslateValue(blog.title);
                  const preview = showingTranslateValue(blog.preview);
                  return (
                    <Link
                      key={blog._id}
                      href={`/blog/${blog.slug}`}
                      className="group block bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all overflow-hidden"
                    >
                      <div className="relative aspect-[16/9] bg-gray-100 overflow-hidden">
                        {blog.mainImage ? (
                          <Image
                            src={blog.mainImage}
                            alt={title || "blog"}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="object-cover transition-transform group-hover:scale-[1.03]"
                          />
                        ) : null}
                      </div>
                      <div className="p-5">
                        {blog.category && (
                          <span className="inline-block bg-customRed-superLight text-customRed-dark text-xs px-2 py-1 rounded mb-2">
                            {blog.category}
                          </span>
                        )}
                        <h2 className="text-lg font-serif font-semibold text-customBlue mb-2 line-clamp-2 group-hover:text-customRed transition-colors">
                          {title}
                        </h2>
                        {preview && (
                          <p className="text-sm text-gray-600 leading-6 line-clamp-3 mb-3">
                            {preview}
                          </p>
                        )}
                        <div className="flex items-center justify-between text-xs text-gray-400">
                          <time dateTime={blog.publishDate}>
                            {dayjs(blog.publishDate).format("DD MMMM YYYY")}
                          </time>
                          {blog.author && <span>{blog.author}</span>}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>

              {/* pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-10">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-4 py-2 text-sm rounded-md border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    הקודם
                  </button>
                  <span className="text-sm text-gray-500 px-3">
                    עמוד {page} מתוך {totalPages}
                  </span>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="px-4 py-2 text-sm rounded-md border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    הבא
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default BlogIndex;
