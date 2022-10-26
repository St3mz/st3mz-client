import { Button, Input, Checkbox, Textarea } from "@material-tailwind/react";
import { Contract, ethers } from "ethers";
import { useNetwork, useSigner } from "wagmi";
import { getNetwork } from "../Config";
import st3mzContractData from "../contracts/St3mz.json";
import { Metadata, Stem, License } from "../models/Metadata";
import { launchToast, ToastType } from "../utils/util";
import { NFTStorage, File } from "nft.storage";
import { UploadAudio } from "../components/UploadAudio";
import { useState } from "react";
import { AudioTrack } from "../components/AudioTrack";
import { UploadImage } from "../components/UploadImage";
import { useNavigate } from "react-router-dom";
import { DETAIL_ROUTE } from "../navigation/Routes";

const initialMetadata: Metadata = {
  name: "",
  description: "",
  file: "",
  image: "",
  genre: "",
  bpm: 0,
  format: "",
  duration: 0,
  licenses: [],
  stems: [],
};

const initialLicenses: any[] = [
  {
    selected: false,
    type: "Basic",
    tokensRequired: 0,
  },
  {
    selected: false,
    type: "Commercial",
    tokensRequired: 0,
  },
  {
    selected: false,
    type: "Exclusive",
  },
];

export const CreatePage = (): JSX.Element => {
  const navigate = useNavigate();
  const { chain: activeChain } = useNetwork();
  const { data: signer } = useSigner();
  const [track, setTrack] = useState<File>();
  const [stems, setStems] = useState<File[]>([]);
  const [image, setImage] = useState<File>();
  const [metadata, setMetadata] = useState<Metadata>(initialMetadata);
  const [licenses, setLicenses] = useState<any[]>(initialLicenses);
  const [amount, setAmount] = useState<number>(0);
  const [price, setPrice] = useState<number>(0);

  const nftStorage = new NFTStorage({
    token: Buffer.from(
      "ZXlKaGJHY2lPaUpJVXpJMU5pSXNJblI1Y0NJNklrcFhWQ0o5LmV5SnpkV0lpT2lKa2FXUTZaWFJvY2pvd2VEazNOek5FT1RJMllXSXpOREkzTlRZeE9EWmxaRFZDTWtVNFJqa3dNVE5GTW1FeU1tUmpOMlVpTENKcGMzTWlPaUp1Wm5RdGMzUnZjbUZuWlNJc0ltbGhkQ0k2TVRZMk5qUTJORFF4TmpBeE1Td2libUZ0WlNJNkluTjBNMjE2SW4wLlEyVm1Sek5fT3RJWmRRTEltcTRKTW1oWXlpNmk5ZHhYMHZNSHZoTGk3YzQ=",
      "base64"
    ).toString(),
  });

  const create = async () => {
    if (!signer || !activeChain || !price || !amount) {
      return;
    }

    const cid = await storeIpfs();

    const st3mzContract = new Contract(
      getNetwork(activeChain.id).st3mzAddress,
      st3mzContractData.abi,
      signer
    );

    try {
      const tx = await st3mzContract.mint(
        `ipfs://${cid}`,
        amount,
        ethers.utils.parseEther(price.toString())
      );
      const events = (await tx.wait()).events;
      const id = Number(events[0].args.id);
      launchToast("NFT created successfully.");
      navigate(DETAIL_ROUTE.replace(":id", id.toString()));
    } catch (e) {
      console.log(e);
      launchToast("An error occurred creating the item.", ToastType.Error);
    }
  };

  const storeIpfs = async () => {
    if (!track || !stems.length || !image) return;

    if (licenses[0].selected && !licenses[0].tokensRequired) {
      launchToast("Please enter a name.", ToastType.Error);
      return;
    }

    const licensesMeta: License[] = licenses
      .filter((license) => license.selected)
      .map((license) => {
        return {
          type: license.type,
          tokensRequired:
            license.type === "Exclusive" ? amount : license.tokensRequired,
        };
      });

    if (!licensesMeta.length) {
      launchToast("Please select at least one license.", ToastType.Error);
      return;
    }

    if (
      licensesMeta.findIndex(
        (license) => !license.tokensRequired || license.tokensRequired > amount
      ) > -1
    ) {
      launchToast(
        "Invalid number of tokens required for license.",
        ToastType.Error
      );
      return;
    }

    launchToast("Uploading files to IPFS...", ToastType.Info);
    const filesCid = await nftStorage.storeDirectory([track, ...stems, image]);

    launchToast("Uploading metadata to IPFS...", ToastType.Info);
    const metadataCid = await nftStorage.storeBlob(
      generateMetadata(filesCid, licensesMeta)
    );
    return metadataCid;
  };

  const generateMetadata = (
    filesCid: string,
    licensesMeta: License[]
  ): File => {
    const stemsMeta: Stem[] = stems.map((stem, i) => {
      return {
        description: metadata.stems[i].description,
        file: `ipfs://${filesCid}/${stem.name}`,
      };
    });

    const _metadata = {
      ...metadata,
      file: `ipfs://${filesCid}/${track!.name}`,
      image: `ipfs://${filesCid}/${image!.name}`,
      format: track!.name.slice(track!.name.lastIndexOf(".") + 1),
      stems: stemsMeta,
      licenses: licensesMeta,
    };

    return new File([JSON.stringify(_metadata)], "metadata.json", {
      type: "application/json",
    });
  };

  return (
    <div>
      <h1 className="text-6xl font-bold pb-2 text-center">Create NFT</h1>
      <div className="flex mt-12">
        {/* Left column */}
        <div className="w-1/2 flex flex-col items-center">
          {/* Track */}
          <div className="mb-6">
            <div className="font-bold text-xl mb-2">Upload track</div>
            <UploadAudio
              onUpload={(files) => setTrack(files[0])}
              className="w-56"
            ></UploadAudio>
          </div>
          {track && (
            <div className="mb-16 w-full">
              <div className="mb-2">{track.name}</div>
              <AudioTrack
                url={URL.createObjectURL(track)}
                onDurationRead={(_duration) =>
                  setMetadata({ ...metadata, duration: _duration })
                }
              />
            </div>
          )}
          {/* Stems */}
          <div className="pb-6">
            <div className="font-bold text-xl mb-2">Upload stems</div>
            <UploadAudio
              onUpload={(files) => {
                setStems([...stems, ...files]);
                setMetadata({
                  ...metadata,
                  stems: [
                    ...metadata.stems,
                    ...Array(files.length).fill({ description: "", file: "" }),
                  ],
                });
              }}
              multiple={true}
              className="w-56"
            ></UploadAudio>
          </div>
          <div className="w-full">
            {stems.map((stem, index) => (
              <div className="mb-12" key={index}>
                <div className="mb-2">{stem.name}</div>
                <AudioTrack url={URL.createObjectURL(stem)} />
                <div className="mt-3">
                  <Input
                    variant="outlined"
                    label="Description"
                    size="lg"
                    type="text"
                    color="orange"
                    className="!text-white bg-sec-bg error"
                    onChange={(e) => {
                      const stemsMeta = JSON.parse(
                        JSON.stringify(metadata.stems)
                      );
                      stemsMeta[index].description = e.target.value;
                      setMetadata({ ...metadata, stems: stemsMeta });
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right column */}
        <div className="w-1/2 px-12">
          {/* Cover image */}
          <div className="mb-10">
            <div className="font-bold text-xl mb-2">Upload cover</div>
            <UploadImage
              onUpload={(file: File) => setImage(file)}
              className="h-56 w-56"
            />
          </div>
          {/* Name */}
          <div className="mb-5">
            <Input
              variant="outlined"
              label="Name"
              size="lg"
              type="text"
              color="orange"
              className="!text-white bg-sec-bg error"
              onChange={(e) =>
                setMetadata({ ...metadata, name: e.target.value })
              }
            />
          </div>
          {/* Description */}
          <div className="mb-5">
            <Textarea
              variant="outlined"
              label="Description"
              size="lg"
              color="orange"
              className="!text-white bg-sec-bg error"
              onChange={(e) =>
                setMetadata({ ...metadata, description: e.target.value })
              }
            />
          </div>
          {/* Genre */}
          <div className="mb-5">
            <Input
              variant="outlined"
              label="Genre"
              size="lg"
              type="text"
              color="orange"
              className="!text-white bg-sec-bg error"
              onChange={(e) =>
                setMetadata({ ...metadata, genre: e.target.value })
              }
            />
          </div>
          {/* BPM */}
          <div className="mb-5 w-48">
            <Input
              variant="outlined"
              label="BPM"
              size="lg"
              type="number"
              color="orange"
              className="!text-white bg-sec-bg error"
              onChange={(e) =>
                setMetadata({ ...metadata, bpm: Number(e.target.value) })
              }
            />
          </div>
          {/* Total supply */}
          <div className="mb-5 w-48">
            <Input
              variant="outlined"
              label="Total supply"
              size="lg"
              type="number"
              color="orange"
              className="!text-white bg-sec-bg error"
              onChange={(e) => setAmount(Number(e.target.value) || 0)}
            />
          </div>
          {/* Unit price */}
          <div className="mb-5 w-48">
            <Input
              variant="outlined"
              label="Unit price"
              size="lg"
              type="number"
              color="orange"
              className="!text-white bg-sec-bg error"
              onChange={(e) => setPrice(Number(e.target.value))}
            />
          </div>
          {/* Licenses */}
          <div className="font-bold text-xl mt-8 mb-2">Licensing</div>
          {/* Basic */}
          <div className="flex mb-2">
            <div className="flex items-center -ml-3 mr-4">
              <Checkbox
                color="orange"
                onChange={(e) => {
                  const _licenses = [...licenses];
                  _licenses[0].selected = e.target.checked;
                  setLicenses(_licenses);
                }}
              />
              <span>Basic</span>
            </div>
            <div className="w-48">
              <Input
                variant="outlined"
                label="Amount required"
                size="lg"
                type="number"
                color="orange"
                className="!text-white bg-sec-bg error"
                onChange={(e) => {
                  const _licenses = [...licenses];
                  _licenses[0].tokensRequired = e.target.value;
                  setLicenses(_licenses);
                }}
              />
            </div>
          </div>
          {/* Commercial */}
          <div className="flex mb-2">
            <div className="flex items-center -ml-3 mr-4">
              <Checkbox
                color="orange"
                onChange={(e) => {
                  const _licenses = [...licenses];
                  _licenses[1].selected = e.target.checked;
                  setLicenses(_licenses);
                }}
              />
              <span>Commercial</span>
            </div>
            <div className="w-48">
              <Input
                variant="outlined"
                label="Amount required"
                size="lg"
                type="number"
                color="orange"
                className="!text-white bg-sec-bg error"
                onChange={(e) => {
                  const _licenses = [...licenses];
                  _licenses[1].tokensRequired = e.target.value;
                  setLicenses(_licenses);
                }}
              />
            </div>
          </div>
          {/* Exclusive */}
          <div className="mb-4">
            <div className="flex items-center -ml-3">
              <Checkbox
                color="orange"
                onChange={(e) => {
                  const _licenses = [...licenses];
                  _licenses[2].selected = e.target.checked;
                  setLicenses(_licenses);
                }}
              />
              <span>Exclusive</span>
              <span className="ml-5 text-sec-text font-bold text-lg">
                All supply
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5 flex justify-center">
        <Button color="yellow" onClick={create}>
          Create NFT
        </Button>
      </div>
    </div>
  );
};
