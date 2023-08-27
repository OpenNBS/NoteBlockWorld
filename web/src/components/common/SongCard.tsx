import styled from "styled-components";

const SongCardContainer = styled.div.attrs({
  className:
    "flex flex-col gap-2 bg-zinc-800  hover:bg-zinc-700 rounded-lg hover:scale-105 cursor-pointer w-fit h-60 transition-all duration-200",
})``;

const SongCardImage = styled.div.attrs({
  className: "h-40 w-full object-cover rounded-lg",
})``;

const SongCardInfo = styled.div.attrs({
  className: "flex flex-col gap-1 px-4",
})``;

const SongCardTitle = styled.h3.attrs({
  className: "text-lg font-semibold",
})``;

const SongCard = () => {
  return (
    <SongCardContainer>
      <SongCardImage>
        <img
          src="/demo.png"
          alt="Song cover"
          className="w-full h-full object-cover rounded-lg"
        />
      </SongCardImage>
      <SongCardInfo>
        <SongCardTitle>Song title</SongCardTitle>
        <p className="text-sm">by author</p>
      </SongCardInfo>
    </SongCardContainer>
  );
};

export default SongCard;
