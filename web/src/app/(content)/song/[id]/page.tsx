function SongPage({ params }: { params: { id: string } }) {
  const { id } = params;
  return <h1>Edit song {id}</h1>;
}

export default SongPage;
