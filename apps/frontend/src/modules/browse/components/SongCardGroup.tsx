const SongCardGroup = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='grid grid-auto-fit-md w-full items-center gap-4'>
      {children}
    </div>
  );
};

export default SongCardGroup;
