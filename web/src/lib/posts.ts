import fs from 'fs';
import path from 'path';

import matter from 'gray-matter';

export type PostType = {
  id: string;
  title: string;
  shortTitle?: string;
  date: Date;
  image: string;
  content: string;
  author?: string;
  authorImage?: string;
};

export function getSortedPostsData(
  postsPath: 'help' | 'blog' | 'about',
  sortBy: 'id' | 'date',
) {
  const postsDirectory = path.join(process.cwd(), 'posts', postsPath);

  // Get file names under /posts
  const fileNames = fs.readdirSync(postsDirectory);

  const allPostsData = fileNames.map((fileName) => {
    // Remove ".md" from file name to get post ID
    const id = fileName.replace(/\.md$/, '');
    return getPostData(postsPath, id);
  });

  // Sort posts
  let sortFunction;

  if (sortBy === 'date') {
    sortFunction = (a: PostType, b: PostType) => {
      if (a.date < b.date) {
        return 1;
      } else {
        return -1;
      }
    };
  } else {
    sortFunction = (a: PostType, b: PostType) => {
      if (a.id > b.id) {
        return 1;
      } else {
        return -1;
      }
    };
  }

  return allPostsData.sort((a, b) => sortFunction(a, b));
}

export function getPostData(
  postsPath: 'help' | 'blog' | 'about',
  postId: string,
) {
  // Read markdown file as string
  const fullPath = path.join(process.cwd(), 'posts', postsPath, `${postId}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');

  // Use gray-matter to parse the post metadata section
  const matterResult = matter(fileContents);

  // Combine the data with the id
  return {
    id: postId,
    ...(matterResult.data as Omit<PostType, 'id'>),
    content: matterResult.content,
  };
}
