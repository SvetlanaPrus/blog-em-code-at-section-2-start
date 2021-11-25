import {useQuery, useMutation} from "react-query";

async function fetchComments(postId) {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/comments?postId=${postId}`
  );
  return response.json();
}

async function deletePost(postId) {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/postId/${postId}`,
    { method: "DELETE" }
  );
  return response.json();
}

async function updatePost(postId) {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/postId/${postId}`,
    { method: "PATCH", data: { title: "REACT QUERY FOREVER!!!!" } }
  );
  return response.json();
}

export function PostDetail({ post }) {
  const { data, isError, isLoading, error } = useQuery(
      ['comments', post.id],      // this is cash
      () => fetchComments(post.id)
  )

  // mutation returns function, we dont need cash.
  // this line 'deleteMutation' must be before line 35 'if(isLoading)...' -
  const deleteMutation = useMutation((postId) => deletePost(postId) );

  if(isLoading) return <h3>Loading...</h3>
    if(isError) {
        return (
            <h3>Error: {error.toString()}</h3>
        );
    }

  return (
    <>
      <h3 style={{ color: "blue" }}>{post.title}</h3>
      <button onClick={() => deleteMutation.mutate(post.id)}>
          Delete
      </button>
      <button>Update title</button>
        {deleteMutation.isError && (<p style={{color: "red"}}>Error deleting the post...</p>)}
        {deleteMutation.isLoading && (<p style={{color: "blue"}}>Deleting the post...</p>)}
        {deleteMutation.isSuccess && (<p style={{color: "green"}}>The post is deleted.</p>)}
      <p>{post.body}</p>
      <h4>Comments</h4>
      {data.map((comment) => (
        <li key={comment.id}>
          {comment.email}: {comment.body}
        </li>
      ))}
    </>
  );
}
