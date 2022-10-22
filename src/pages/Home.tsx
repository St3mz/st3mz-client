import { useState } from "react";
import { AudioTrack } from "../components/AudioTrack";
import { UploadAudio } from "../components/UploadAudio";
import { Login } from "./Login";

export const HomePage = (): JSX.Element => {
  const [files, setFiles] = useState<File[]>([]);

  return (
    <div className="p-5">
      Home
      <Login />
      <UploadAudio
        onUpload={(newFiles) => setFiles([...files, ...newFiles])}
        className="w-56"
      ></UploadAudio>
      <div className="p-10">
        <AudioTrack url="audio/audio_sample.mp3" />
        {files.map((file, index) => (
          <AudioTrack key={index} url={URL.createObjectURL(file)} />
        ))}
      </div>
    </div>
  );
};
