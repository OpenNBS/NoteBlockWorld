import { redirect } from 'next/navigation';

const IndexPage = async () => {
  redirect('/browse');
};

export default IndexPage;
