import { GetServerSideProps } from "next";

type queryParam = {
  token?: string;
  page?: string;
};

const ExternalLoginPage = () => {
  return <></>;
};

// server side props
export const getServerSideProps: GetServerSideProps = async (context) => {
  const { token, page } = context.query as queryParam;
  // if token is not defined, then redirect to login page
  if (!token) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  // if page is defined, then redirect to the page
  if (page) {
    return {
      redirect: {
        destination: page,
        permanent: false,
      },
    };
  }

  return {
    props: {
      token,
      page,
    },
  };
};
