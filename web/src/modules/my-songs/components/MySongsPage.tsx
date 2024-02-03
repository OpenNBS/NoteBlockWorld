import { MySongProvider } from './client/MySongs.context';
import { MySongsTable } from './client/MySongsTable';

const MySongsPage = function () {
  return (
    <MySongProvider>
      <MySongsTable />
    </MySongProvider>
  );
};

export default MySongsPage;
