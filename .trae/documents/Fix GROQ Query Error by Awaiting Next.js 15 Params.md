I will fix the GROQ query parse error by updating how `params` are accessed in the dynamic route pages. In newer Next.js versions (15+), `params` is a Promise that must be awaited before accessing properties like `slug`.

Here is the plan:
1.  **Update `app/projects/[slug]/page.tsx`**:
    *   Change the component signature to accept `params` as a `Promise`.
    *   Await `params` to extract the `slug`.
2.  **Update `app/articles/[slug]/page.tsx`**:
    *   Similarly, await `params` before using `slug` to fetch the article.

This will ensure that the `slug` is correctly passed to the GROQ queries, resolving the "param $slug referenced, but not provided" error.