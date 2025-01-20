import React from "react";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import {
  mplCandyMachine,
  create,
  fetchCandyMachine,
  fetchCandyGuard,
  mintLimitGuardManifest,
  addConfigLines,
  mintV2,
  getMerkleProof,
  getMerkleRoot,
} from "@metaplex-foundation/mpl-candy-machine";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { walletAdapterIdentity } from "@metaplex-foundation/umi-signer-wallet-adapters";
import {
  mplTokenMetadata,
  TokenStandard,
  createNft,
} from "@metaplex-foundation/mpl-token-metadata";
import { route } from "@metaplex-foundation/mpl-candy-machine";
import { setComputeUnitLimit } from "@metaplex-foundation/mpl-toolbox";
import {
  generateSigner,
  transactionBuilder,
  percentAmount,
  createGenericFile,
  publicKey,
  some,
  none,
  sol,
  dateTime,
} from "@metaplex-foundation/umi";
import { base58 } from "@metaplex-foundation/umi/serializers";

function CandyMachine(props) {
  const wallet = useWallet();
  const { connection } = useConnection();
  const umi = createUmi(connection)
    .use(walletAdapterIdentity(wallet))
    // this is for minting programmable NFTs
    .use(mplTokenMetadata())
    .use(mplCandyMachine());

  const allowList: (string | Uint8Array)[] = [];

  const createCandyMachine = async () => {
    const collectionAddress = "HRPTVnbwb6g6biHovgUiyqWVM1BgzCvWDbk2CBSzch15";
    const candyMachineAddress = generateSigner(umi);
    console.log("Candy Machine Address: ", candyMachineAddress);
    // const collectionAddress = "G1NytaBE2VaraWUMLv9rYpv6H9cwh9n4zDPNcLPgDFDG";
    const myCustomAuthority = generateSigner(umi);
    console.log("UMI: ", umi.identity.publicKey);
    console.log("Candy Machine Authority: ", myCustomAuthority);
    const candyMachineSettings = {
      // authority: myCustomAuthority,
      candyMachine: candyMachineAddress,
      tokenStandard: TokenStandard.ProgrammableNonFungible,
      sellerFeeBasisPoints: percentAmount(5, 1), // 5%
      symbol: "EXtCM1",
      maxEditionSupply: 5,
      isMutable: true,
      creators: [
        {
          address: umi.identity.publicKey,
          percentageShare: 100,
          verified: true,
        },
      ],
      collectionMint: collectionAddress,
      collectionUpdateAuthority: umi.identity.publicKey,
      itemsAvailable: 5, // or 1000
      hiddenSettings: none(),
      configLineSettings: some({
        // prefixName: "exPNFTtv2prop1P1",
        prefixName: "testCollp #",
        nameLength: 0,
        prefixUri: "https://arweave.net/",
        uriLength: 43,
        // isSequential is false, then tokens will be minted in random order
        isSequential: true,
      }),
      guards: {
        // id is just a unique identifier and limit is the maximum number of mints per address
        mintLimit: some({ id: 1, limit: 2 }),
        botTax: some({ lamports: sol(0.01), lastInstruction: true }),
        solPayment: some({
          lamports: sol(1.5),
          destination: umi.identity.publicKey,
        }),
        // allowList: some({ merkleRoot: getMerkleRoot(allowList) }),
        // startDate: some({ date: dateTime("2023-04-04T16:00:00Z") }),
      },
    };
    console.log("Creating Candy Machine....", candyMachineSettings);
    const candyMachine = await (
      await create(umi, candyMachineSettings)
    ).sendAndConfirm(umi);
    console.log("candyMachine", candyMachine);
  };

  const trial = async () => {
    // Create the Collection NFT.
    console.log("Creating Collection NFT....");
    const collectionMint = generateSigner(umi);
    console.log("Collection Mint: ", collectionMint);
    const response = await createNft(umi, {
      mint: collectionMint,
      authority: umi.identity,
      name: "My Collection NFT",
      uri: "https://example.com/path/to/some/json/metadata.json",
      sellerFeeBasisPoints: percentAmount(9.99, 2), // 9.99%
      isCollection: true,
    }).sendAndConfirm(umi);

    console.log("Collection NFT created at", response);

    // Create the Candy Machine.
    const candyMachine = generateSigner(umi);
    console.log("Candy Machine: ", candyMachine);
    const CMresponse = await (
      await create(umi, {
        candyMachine,
        collectionMint: collectionMint.publicKey,
        collectionUpdateAuthority: umi.identity,
        tokenStandard: TokenStandard.NonFungible,
        sellerFeeBasisPoints: percentAmount(9.99, 2), // 9.99%
        itemsAvailable: 5000,
        creators: [
          {
            address: umi.identity.publicKey,
            verified: true,
            percentageShare: 100,
          },
        ],
        configLineSettings: some({
          prefixName: "",
          nameLength: 32,
          prefixUri: "",
          uriLength: 200,
          isSequential: false,
        }),
      })
    ).sendAndConfirm(umi);

    console.log("Candy Machine created at", CMresponse);
  };

  const fetchCandyMachineData = async () => {
    const candyMachineAddress = "TegjfPQs5b2Ae33CUZkfg9os3qxXW77TvdvVnPy7Mep";
    console.log("fetching candy machine data");
    const candyMachine = await fetchCandyMachine(umi, candyMachineAddress);
    // const candyGuard = await fetchCandyGuard(umi, candyMachine.mintAuthority);
    console.log("candyMachine", candyMachine);
    // console.log("candyGuard", candyGuard);
  };

  const fetchCMGuard = async () => {
    console.log("fetching candy machine guard");
    const candyMachineAddress = "EWGgCrrDH3Eodo544N1Mr9eqf56phSnX7fPrCFThvnEe";
    const candyMachine = await fetchCandyMachine(umi, candyMachineAddress);
    const candyGuard = await fetchCandyGuard(umi, candyMachine.mintAuthority);
    console.log("candyGuard", candyGuard);
  };

  const insertNewItems = async () => {
    console.log("Inserting new items");
    const candyMachineAddress = "EWGgCrrDH3Eodo544N1Mr9eqf56phSnX7fPrCFThvnEe";
    const candyMachine = await fetchCandyMachine(umi, candyMachineAddress);
    console.log("candyMachine", candyMachine);
    const response = await addConfigLines(umi, {
      candyMachine: candyMachine.publicKey,
      index: candyMachine.itemsLoaded,
      configLines: [
        { name: "1", uri: "1.json" },
        { name: "2", uri: "2.json" },
        { name: "3", uri: "3.json" },
        { name: "4", uri: "4.json" },
        { name: "5", uri: "5.json" },
      ],
    }).sendAndConfirm(umi);
    console.log("response", response);
  };

  const mintFromCandyMachine = async () => {
    console.log("Minting from candy machine");
    const candyMachineAddress = "2JDNrGrTHtuAgfRzMLAZvFjCeHrNy9GvyVwVwvVvDfeZ";
    console.log("candyMachine", candyMachineAddress);
    console.log("NFT Mint Owner: ", umi.identity.publicKey);
    const nftMintAddr = generateSigner(umi);
    const response = await transactionBuilder()
      .add(setComputeUnitLimit(umi, { units: 800_000 }))
      .add(
        mintV2(umi, {
          candyMachine: "B5p82iETkTPpfXfxGvksb6ErU2v14iCNrQq1n3VhSr2w",
          nftMint: nftMintAddr,
          collectionMint: "9pLVbheb8doSFE9x79vp5qmKd1rD9YbYnLWjZHX3TaeH",
          collectionUpdateAuthority:
            "4r8sprvJ4gcrT7GjvniZ7yviLvN7veZLMXXn3g8Ezvaw",
          mintArgs: {
            mintLimit: some({ id: 1 }),
            solPayment: some({
              destination: "PanbgtcTiZ2PveV96t2FHSffiLHXXjMuhvoabUUKKm8",
            }),
          },
          candyGuard: "7bq17cXZCqb5cLKZWowHizkFNg1AUvoFfjVmiZ9v9mQC",
          tokenStandard: TokenStandard.ProgrammableNonFungible,
        })
      )
      .sendAndConfirm(umi);
    console.log("Minted NFT at", response);
    console.log("Signature: ", base58.deserialize(response.signature)[0]);
  };

  const addAddrToAllowList = async () => {
    console.log("Adding address to allow list");
    const response = await route(umi, {
      candyMachine: "TegjfPQs5b2Ae33CUZkfg9os3qxXW77TvdvVnPy7Mep",
      guard: "allowList",
      routeArgs: {
        path: "proof",
        merkleRoot: getMerkleRoot(allowList),
        merkleProof: getMerkleProof(allowList, publicKey(umi.identity)),
      },
    }).sendAndConfirm(umi);
    console.log("Address added to allow list at", response);
  };

  return (
    <div className="flex flex-col items-start justify-center px-48 mt-20">
      This is Candy Machine
      <button className="mt-16 btn btn-primary" onClick={createCandyMachine}>
        Create Candy Machine
      </button>
      <button className="mt-16 btn btn-primary" onClick={trial}>
        Trial CM
      </button>
      <button className="mt-16 btn btn-primary" onClick={fetchCandyMachineData}>
        Fetch Candy Machine Data
      </button>
      <button className="mt-16 btn btn-primary" onClick={insertNewItems}>
        Insert New Items
      </button>
      <button className="mt-16 btn btn-primary" onClick={mintFromCandyMachine}>
        Mint from Candy Machine
      </button>
      <button className="mt-16 btn btn-primary" onClick={addAddrToAllowList}>
        Add Address to Allow List
      </button>
      <button className="mt-16 btn btn-primary" onClick={fetchCMGuard}>
        Fetch Candy Machine Guard
      </button>
    </div>
  );
}

export default CandyMachine;
