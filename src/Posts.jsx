import {useEffect, useState} from "react";
import { useQuery, useQueryClient } from "react-query";

import { PostDetail } from "./PostDetail";
const maxPostPage = 10;

async function fetchPosts(pageNum) {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/posts?_limit=10&_page=${pageNum}`
  );
  return response.json();
}

export function Posts() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPost, setSelectedPost] = useState(null);

  const queryClient = useQueryClient(); // client side changes, prefetching

  useEffect(() =>{
      if(currentPage < maxPostPage){         // continue to prefetch if this is not the last page, less than last page
          const nextPage = currentPage + 1;  // dependence - nextPage
          // prefetch all posts of the next page -
          queryClient.prefetchQuery(["posts", nextPage], () => fetchPosts(nextPage))
      }
          // dependence - currentPage, queryClient
  }, [currentPage, queryClient])

    // replace with useQuery
    const { data, isError, error, isLoading } = useQuery(
        ["posts", currentPage],
        () => fetchPosts(currentPage), // OBS: pay attention how we pass value, via arrow function!
        {
            staleTime: 2000, // After 2sec is old info
            keepPreviousData: true  // prev.data in cash
        }
    );

  if (isLoading) return <h3>Loading...</h3>;
  if (isError)
    return (
      <>
        <h3>Oops, something went wrong</h3>
        <p>{error.toString()}</p>
      </>
    );

  return (
    <>
      <ul>
        {data.map((post) => (
          <li
            key={post.id}
            className="post-title"
            onClick={() => setSelectedPost(post)}
          >
            {post.title}
          </li>
        ))}
      </ul>
      <div className="pages">

          <button disabled = {currentPage <= 1}
                  onClick={() => {setCurrentPage(currentPage-1)}}>
          Previous page
          </button>

          <span>Page {currentPage}</span>

          <button disabled = {currentPage >= 10}
                  onClick={() => {setCurrentPage(currentPage+1)}}>
          Next page
          </button>
      </div>
      <hr />
      {selectedPost && <PostDetail post={selectedPost} />}
    </>
  );
}
