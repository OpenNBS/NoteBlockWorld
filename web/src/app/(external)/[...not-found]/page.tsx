import { notFound } from 'next/navigation';

// TODO: this is only necessary because of a bug in Next.js regarding route layouts and custom not found pages.
// See: https://github.com/vercel/next.js/discussions/50034

export default function NotFound() {
  notFound();
}