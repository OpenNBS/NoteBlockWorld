import { SearchPageComponent } from '@web/src/modules/search/components/SearchPageComponent';

interface SearchPageProps {
  searchParams: {
    query?: string;
    page?: string;
    limit?: string;
    category?: string;
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  console.log(searchParams);

  return <SearchPageComponent />;
}
