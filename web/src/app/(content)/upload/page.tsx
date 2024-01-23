"use client";

import { faFileAudio, faFileWaveform } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ThumbnailRenderer from "@web/src/components/common/ThumbnailRenderer";
import { useState } from "react";
import { styled } from "styled-components";

const Input = styled.input.attrs({
  className:
    "block h-12 w-full rounded-lg bg-transparent border-2 border-zinc-500 disabled:border-zinc-700 disabled:cursor-not-allowed disabled:text-zinc-500 p-2",
})``;

const Select = styled.select.attrs({
  className:
    "block h-12 w-full rounded-lg bg-transparent border-2 border-zinc-500 disabled:border-zinc-700 disabled:cursor-not-allowed disabled:text-zinc-500 p-2",
})``;

const Option = styled.option.attrs({
  className: "bg-zinc-900",
})``;

const SongSelector = ({
  onFileSelect,
}: {
  onFileSelect: (file: File) => void;
}) => {
  return (
    <div
      className="flex flex-col items-center gap-6 h-fit w-[50vw] border-dashed border-4 border-zinc-700 p-8 mb-4"
      onDragOver={(e) => e.preventDefault()}
    >
      <FontAwesomeIcon icon={faFileAudio} size="5x" className="text-zinc-600" />
      <div className="text-center">
        <p className="font-semibold text-xl">Drag and drop your song</p>
        <p className="text-zinc-400">or select a file below</p>
      </div>
      <label
        htmlFor="uploadNbsFile"
        className="px-3 py-2 bg-blue-500 hover:bg-blue-400 rounded-lg text-white cursor-pointer"
      >
        Select file
      </label>
      <input
        type="file"
        name="nbsFile"
        id="uploadNbsFile"
        accept=".nbs"
        className="z-[-1] absolute opacity-0"
        onChange={(e) => {
          e.preventDefault;
          onFileSelect(e.target.files?.[0] as File);
        }}
        onDrop={(e) => {
          e.preventDefault();
          onFileSelect(e.dataTransfer.files?.[0]);
        }}
      />
    </div>
  );
};

const UploadForm = () => {
  return (
    <form
      action="http://localhost:5000/upload"
      method="POST"
      encType="multipart/form-data"
    >
      <div className="flex flex-col h-fit w-1/2 gap-6">
        {/* Title */}
        <div>
          <label htmlFor="name">Title*</label>
          <Input type="text" name="title" id="title" className="" />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description">Description</label>
          <textarea
            name="description"
            id="description"
            className="block h-48 w-full rounded-lg bg-transparent border-2 border-zinc-500 p-2"
          />
        </div>

        {/* Tags */}
        <div>
          <label htmlFor="tags">Tags</label>
          <Input type="text" name="tags" id="tags" className="block" />
          <p className="text-sm text-zinc-500">(Separate tags with a comma)</p>
        </div>

        {/* Author */}
        <div className="flex flex-row gap-8 justify-between">
          <div className="flex-1">
            <label htmlFor="artist">Author</label>
            <Input
              type="text"
              name="artist"
              id="artist"
              value="Bentroen"
              disabled={true}
              className=""
            />
          </div>
          <div className="flex-1">
            <label htmlFor="album">Original author </label>
            <Input type="text" name="album" id="album" className="block" />
            <p className="text-sm text-zinc-500">
              (Leave blank if it's an original song)
            </p>
          </div>
        </div>

        {/* Genre */}
        <div className="flex flex-row gap-8 justify-between">
          <div className="flex-1">
            <label htmlFor="category">Category</label>
            <Select name="category" id="category">
              <Option value="volvo">Gaming</Option>
              <Option value="saab">Movies & TV</Option>
              <Option value="mercedes">Anime</Option>
              <Option value="audi">Vocaloid</Option>
              <Option value="audi">Rock</Option>
              <Option value="audi">Pop</Option>
              <Option value="audi">Electronic</Option>
              <Option value="audi">Ambient</Option>
              <Option value="audi">Jazz</Option>
              <Option value="audi">Classical</Option>
            </Select>
          </div>
          <div className="flex-1">
            <label htmlFor="playlist">Playlist</label>
            <Select name="playlist" id="playlist">
              <Option value="playlist1">None</Option>
              <Option value="playlist1">Playlist 1</Option>
              <Option value="playlist2">Playlist 2</Option>
              <Option value="playlist3">Playlist 3</Option>
            </Select>
          </div>
        </div>

        {/* Thumbnail */}
        <div>
          <p>Thumbnail</p>
          <div className="flex flex-col items-center gap-6 h-80 w-full rounded-lg border-2 border-zinc-500 p-8 mb-4">
            <ThumbnailRenderer
              notes={[
                { tick: 0, layer: 0, instrument: 0, key: 45 },
                { tick: 2, layer: 2, instrument: 2, key: 47 },
                { tick: 4, layer: 4, instrument: 4, key: 49 },
              ]}
            ></ThumbnailRenderer>
          </div>
        </div>

        {/* Visibility */}
        <div className="flex flex-row gap-8 justify-between">
          <div className="flex-1">
            <label htmlFor="visibility">Visibility</label>
            <Select name="visibility" id="visibility">
              <Option value="public">Public</Option>
              <Option value="public">Unlisted</Option>
              <Option value="private">Private</Option>
            </Select>
          </div>
          <div className="flex-1">
            <label htmlFor="license">License</label>
            <Select name="license" id="license">
              <Option value="cc">No license</Option>
              <Option value="cc">Creative Commons CC BY 4.0</Option>
              <Option value="cc">Public domain</Option>
            </Select>
          </div>
        </div>

        {/* Allow download */}
        <div className="flex-1">
          <input
            type="checkbox"
            className="accent-blue scale-150 mr-3"
            name="allowDownload"
            id="allowDownload"
          />
          <label htmlFor="allowDownload">
            Allow other users to download the NBS file
          </label>
        </div>

        <div className="h-4"></div>

        {/* Upload button */}
        <button
          type="submit"
          className="w-32 ml-auto p-3 font-semibold bg-blue-500 hover:bg-blue-400 uppercase rounded-lg"
        >
          Upload
        </button>
      </div>
    </form>
  );
};

const UploadPage = () => {
  const [file, setFile] = useState<File | null>(null);

  const onUpload = async () => {
    if (!file) {
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("http://localhost:4000/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    console.log(data);
  };

  return (
    <main className="p-8 h-full w-full flex flex-col">
      <h1 className="text-3xl font-semibold">Upload song</h1>
      <div className="h-10" />
      {!file ? <SongSelector onFileSelect={setFile} /> : <UploadForm />}
    </main>
  );
};

export default UploadPage;
