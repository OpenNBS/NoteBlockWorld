const SongCardGroup = ({ children }: { children: React.ReactNode }) => {
  // Ensure at least 4 items in the grid to prevent single cards from taking up full width
  const childrenArray = Array.isArray(children) ? children : [children];
  const itemsToDisplay = Math.max(childrenArray.length, 4);
  const paddedSongs = [
    ...childrenArray,
    ...Array.from({ length: itemsToDisplay - childrenArray.length }, (_, i) => (
      <div key={`placeholder-${i}`} aria-hidden='true' />
    )),
  ];

  return (
    <div className='grid grid-auto-fit-md w-full items-center gap-4'>
      {paddedSongs}
    </div>
  );
};

export default SongCardGroup;
