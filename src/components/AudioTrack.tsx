import { useEffect, useRef, useState } from "react";
import { MdPauseCircle, MdPlayCircle, MdStopCircle } from "react-icons/md";
import WaveSurfer from "wavesurfer.js";

export const AudioTrack = ({ url }: { url: string }): JSX.Element => {
  const waveformRef = useRef<HTMLDivElement>(null);
  const [wavesurfer, setWavesurfer] = useState<WaveSurfer>();
  const [isPlaying, setIsPlaying] = useState<boolean>();

  useEffect(() => {
    if (waveformRef.current && !wavesurfer) {
      const wavesurferInstance = WaveSurfer.create({
        container: waveformRef.current,
        cursorColor: "#ffffff00",
        backgroundColor: "#00000024",
        progressColor: "#e88605",
        waveColor: "#c7ad1c",
        height: 70,
        responsive: true,
      });
      wavesurferInstance.load(url);
      setWavesurfer(wavesurferInstance);
      wavesurferInstance.on("finish", () => {
        wavesurferInstance.setCursorColor("#ffffff00");
        setIsPlaying(false);
      });
      wavesurferInstance.on("seek", () => {
        wavesurferInstance.setCursorColor("#ffffff");
      });
    }
  }, []);

  const play = () => {
    if (!wavesurfer) return;
    wavesurfer.playPause();
    setIsPlaying(true);
    wavesurfer.setCursorColor("#ffffff");
  };

  const pause = () => {
    if (!wavesurfer) return;
    wavesurfer.playPause();
    setIsPlaying(false);
  };

  const stop = () => {
    if (!wavesurfer) return;
    wavesurfer.stop();
    setIsPlaying(false);
    wavesurfer.setCursorColor("#ffffff00");
  };

  return (
    <div className="flex items-center">
      <div className="mr-2">
        {!isPlaying && (
          <MdPlayCircle
            className="h-8 w-8 text-primary cursor-pointer"
            onClick={play}
          />
        )}
        {isPlaying && (
          <MdPauseCircle
            className="h-8 w-8 text-primary cursor-pointer"
            onClick={pause}
          />
        )}
        <MdStopCircle
          className="h-8 w-8 text-primary cursor-pointer"
          onClick={stop}
        />
      </div>
      <div ref={waveformRef} className="rounded-lg overflow-hidden w-1/2"></div>
    </div>
  );
};