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

const blogPostIds = fs
  .readdirSync(path.join(process.cwd(), 'posts', 'blog'))
  .reduce(
    (acc, fileName) => {
      // Remove ".md" and date prefix to get post ID
      const postId = fileName.replace(/\.md$/, '').split('_')[1];
      acc[postId] = fileName;
      return acc;
    },
    {} as Record<string, string>,
  );

const helpPostIds = fs
  .readdirSync(path.join(process.cwd(), 'posts', 'help'))
  .reduce(
    (acc, fileName) => {
      // Remove ".md" and number prefix to get help article ID
      const helpId = fileName.replace(/\.md$/, '').split('_')[1];
      acc[helpId] = fileName;
      return acc;
    },
    {} as Record<string, string>,
  );

export function getSortedPostsData(
  postsPath: 'help' | 'blog',
  sortBy: 'id' | 'date',
) {
  const postsDirectory = path.join(process.cwd(), 'posts', postsPath);

  // Get file names under /posts
  const fileNames = fs.readdirSync(postsDirectory);

  const allPostsData = fileNames.map((fileName) => {
    // Remove ".md" and prefix from file name to get post ID
    const id = fileName.replace(/\.md$/, '').split('_')[1];
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
  postsPath: 'help' | 'blog',
  postId: string,
): PostType {
  // Look for the file in the posts directory that contains postId as suffix
  const fileName =
    postsPath === 'blog' ? blogPostIds[postId] : helpPostIds[postId];

  if (!fileName) {
    throw new Error(`No file found for post ID: ${postId}`);
  }

  const fullPath = path.join(process.cwd(), 'posts', postsPath, fileName);

  // Read markdown file as string
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
