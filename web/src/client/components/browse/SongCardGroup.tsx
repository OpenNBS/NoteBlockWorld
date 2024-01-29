const SongCardGroup = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 w-full items-center gap-4'>
      {children}
    </div>
  );
};

export default SongCardGroup;
