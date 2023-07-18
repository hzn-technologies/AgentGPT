import NavBar from "../../components/NavBar";
import { useRouter } from "next/router";
import { getPostData, getSortedPostsData } from "../../lib/posts";

export default function BlogPost({ postData }) {
  const router = useRouter();

  // If the page is still loading, display a loading message or spinner
  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <NavBar />
      <article>
        <h1 className="text-white">hi</h1>
        <h1>{postData.title}</h1>
        <p>{postData.date}</p>
        <div dangerouslySetInnerHTML={{ __html: postData.content }} />
      </article>
    </div>
  );
}

export async function getStaticPaths() {
  // Fetch the list of blog post slugs or IDs dynamically
  const slugs = await getSortedPostsData();

  // Generate the paths based on the slugs
  const paths = slugs.map((slug) => ({
    params: { slug },
  }));

  return {
    paths,
    fallback: true,
  };
}

export async function getStaticProps({ params }) {
  // Fetch the blog post data based on the slug
  const postData = await getPostData(params.slug);

  return {
    props: {
      postData,
    },
  };
}
