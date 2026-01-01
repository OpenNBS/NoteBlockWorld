const SongCardGroup = ({
  children,
  size = 'md',
}: {
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}) => {
  // Define min column widths for each size
  const minWidths = {
    sm: '200px',
    md: '280px',
    lg: '320px',
    xl: '400px',
  };

  return (
    <div
      className='grid w-full items-center gap-4'
      style={{
        gridTemplateColumns: `repeat(auto-fit, minmax(${minWidths[size]}, 1fr))`,
      }}
    >
      {children}
    </div>
  );
};

export default SongCardGroup;
