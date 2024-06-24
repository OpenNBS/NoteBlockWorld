const DocumentLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='md:py-[8rem]'>
      <div className='p-8 mx-auto max-w-screen-lg md:rounded-3xl bg-zinc-950/50 backdrop-blur-[10px]'>
        {children}
      </div>
    </div>
  );
};

export default DocumentLayout;
