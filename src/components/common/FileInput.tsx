import { Button } from "@material-tailwind/react";
import { ChangeEvent, useRef } from "react";
import { MdUpload } from "react-icons/md";

interface Props {
  onFileUpload: (file: File) => void;
  accept?: string;
}

export const FileInput = ({ onFileUpload, accept }: Props): JSX.Element => {
  const refFileInput = useRef<HTMLInputElement>(null);

  const handleUpload = (e: ChangeEvent<HTMLInputElement>): void => {
    if (!e?.target?.files?.length) return;
    onFileUpload(e.target.files[0]);
  };

  return (
    <>
      <input
        ref={refFileInput}
        type="file"
        accept={accept}
        onChange={(e) => handleUpload(e)}
        className="hidden"
      ></input>
      <Button
        color="yellow"
        variant="gradient"
        className="p-2"
        onClick={() => {
          refFileInput.current?.click();
        }}
      >
        <MdUpload className="h-5 w-5"></MdUpload>
      </Button>
    </>
  );
};
