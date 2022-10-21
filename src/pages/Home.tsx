import { AudioTrack } from "../components/AudioTrack";
import { Login } from "./Login";

export const HomePage = (): JSX.Element => {
  return (
    <>
      Home
      <Login />
      <div className="p-10">
        <AudioTrack url="audio/audio_sample.mp3" />
      </div>
    </>
  );
};
