interface SearchPage {
  params: {
    search: string;
  };
}

const Page = ({ params }: SearchPage) => {
  const { search } = params;

  return <>search: {search}</>;
};

export default Page;
