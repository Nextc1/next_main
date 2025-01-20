import React, { useState } from "react";

import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import {
  mplCore,
  createCollection,
  fetchCollectionV1,
  fetchCollection,
  ruleSet,
  create,
  transfer,
  transferV1,
  fetchAssetsByOwner,
} from "@metaplex-foundation/mpl-core";
import {
  createProgrammableNft,
  mplTokenMetadata,
  createNft,
  printSupply,
  printV1,
  fetchMasterEditionFromSeeds,
  fetchAllDigitalAssetByOwner,
  fetchAllDigitalAssetByCreator,
  fetchAllDigitalAsset,
  fetchAllEdition,
  fetchAllMasterEdition,
  unlockV1,
  delegateStandardV1,
  TokenStandard,
  delegateLockedTransferV1,
  findMetadataPda,
  fetchAllDigitalAssetWithTokenByMint,
  fetchDigitalAsset,
  updateV1,
  fetchMetadataFromSeeds,
  collectionDetails,
  fetchAllDigitalAssetWithTokenByOwner,
  fetchDigitalAssetWithAssociatedToken,
} from "@metaplex-foundation/mpl-token-metadata";
import {
  findAssociatedTokenPda,
  transferTokens,
  createTokenIfMissing,
  createMint,
  fetchToken,
} from "@metaplex-foundation/mpl-toolbox";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { walletAdapterIdentity } from "@metaplex-foundation/umi-signer-wallet-adapters";
import {
  generateSigner,
  transactionBuilder,
  percentAmount,
  createGenericFile,
  publicKey,
} from "@metaplex-foundation/umi";
import { base58 } from "@metaplex-foundation/umi/serializers";
import toast from "react-hot-toast";
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys";
import {
  getOrCreateAssociatedTokenAccount,
  createTransferInstruction,
} from "@solana/spl-token";
import {
  Keypair,
  LAMPORTS_PER_SOL,
  sendAndConfirmTransaction,
  Transaction,
} from "@solana/web3.js";

function Dummy(props) {
  const [collectionName, setCollectionName] = useState("");
  const [collectionUri, setCollectionUri] = useState("");
  const [collectionAddress, setCollectionAddress] = useState("");
  const [assetName, setAssetName] = useState("");
  const [assetUri, setAssetUri] = useState("");
  const [assetCollectionAddress, setAssetCollectionAddress] = useState("");
  const [assetAuthorityPublicKey, setAssetAuthorityPublicKey] = useState("");
  const [assetAuthoritySecret, setAssetAuthoritySecret] = useState("");
  const [toSendAssetAddress, setToSendAssetAddress] = useState("");
  const [receiverAddress, setReceiverAddress] = useState("");
  const [toSendCollectionAddress, setToSendCollectionAddress] = useState("");
  const [toSendMultipleAssets, setToSendMultipleAssets] = useState([]);
  const [fetchAssetsByOwnerAddr, setFetchAssetsByOwnerAddr] = useState("");
  const [delegateData, setDelegateData] = useState({
    assetAddr: "",
    delegate: "",
  });
  const [fetchDigitalAssetMint, setFetchDigitalAssetMint] = useState("");
  const [masterEditionMint, setMasterEditionMint] = useState("");
  const [printEditionMint, setPrintEditionMint] = useState("");

  const wallet = useWallet();
  const { connection } = useConnection();
  const umi = createUmi(connection)
    .use(walletAdapterIdentity(wallet))
    // this is for minting programmable NFTs
    .use(mplTokenMetadata())
    // this is for minting core NFTs
    // .use(mplCore());
    .use(
      irysUploader({
        // mainnet address: "https://node1.irys.xyz"
        // devnet address: "https://devnet.irys.xyz"
        address: "https://devnet.irys.xyz",
      })
    );

  const performUpdateMetadata = async () => {
    console.log("Updating metadata...");
    const mint = "EMFtdRSnPVZeLT2ebMBWjBLLiG5xmYFHdMomha1pVDMm";
    const initialMetadata = await fetchMetadataFromSeeds(umi, { mint });
    console.log("Initial Metadata: ", initialMetadata);
    const updateAuthority = umi.identity;
    console.log("Update Authority: ", updateAuthority);
    const response = await updateV1(umi, {
      mint,
      authorizationRules: "eBJLFYPxJmMGKuFwpDWkzxZeUrad92kZRC5BJLpzyT9",
      data: {
        ...initialMetadata,
        name: "Updated Asset",
        uri: "https://arweave.net/updated343",
      },
      primarySaleHappened: true,
      isMutable: true,
    }).sendAndConfirm(umi);
    console.log("Update Metadata Response: ", response);
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0]; // Get the uploaded file
    if (!file) return;

    try {
      // Convert file to a format Umi can handle
      const reader = new FileReader();

      reader.onload = async () => {
        const arrayBuffer = reader.result; // File as ArrayBuffer

        // Create the umi-compatible file with content type
        const umiImageFile = createGenericFile(
          new Uint8Array(arrayBuffer),
          file.name,
          {
            tags: [{ name: "Content-Type", value: file.type }],
          }
        );

        // Upload the image to Arweave via Umi
        const uploadedUris = await umi.uploader.upload([umiImageFile]);
        // setImageUri(uploadedUris[0]); // Store the URI in state

        console.log("Image uploaded successfully:", uploadedUris);
      };

      reader.readAsArrayBuffer(file); // Read the file as ArrayBuffer
    } catch (err) {
      console.error("Error uploading file:", err);
    }
  };

  const handleJsonUpload = async (event) => {
    const file = event.target.files[0]; // Get the uploaded file
    if (!file) return;

    try {
      // Convert file to a format Umi can handle
      const reader = new FileReader();

      reader.onload = async () => {
        const arrayBuffer = reader.result; // File as ArrayBuffer

        // Create the umi-compatible file with content type
        const umiJsonFile = createGenericFile(
          new Uint8Array(arrayBuffer),
          file.name,
          {
            tags: [{ name: "Content-Type", value: "application/json" }],
          }
        );

        // Upload the image to Arweave via Umi
        const uploadedUris = await umi.uploader.upload([umiJsonFile]);
        // setImageUri(uploadedUris[0]); // Store the URI in state

        console.log("JSON uploaded successfully:", uploadedUris);
      };

      reader.readAsArrayBuffer(file); // Read the file as ArrayBuffer
    } catch (err) {
      console.error("Error uploading file:", err);
    }
  };

  const createCoreCollection = async () => {
    try {
      console.log("Creating test collection...");
      const collectionUpdateAuthority = generateSigner(umi);
      console.log("Collection Update Authority: ", collectionUpdateAuthority);
      const collectionAddress = generateSigner(umi);
      console.log("Collection Address: ", collectionAddress);
      console.log("Collection Name: ", collectionName);
      console.log("Collection URI: ", collectionUri);
      const response = await createCollection(umi, {
        name: collectionName,
        uri: collectionUri,
        collection: collectionAddress,
        //   updateAuthority: collectionUpdateAuthority.publicKey, // optional, defaults to payer
        plugins: [
          {
            type: "MasterEdition",
            maxSupply: 100,
            name: collectionName,
            uri: collectionUri,
          },
          {
            type: "Royalties",
            basisPoints: 500,
            creators: [{ address: umi.identity.publicKey, percentage: 100 }],
            ruleSet: ruleSet("None"),
          },
        ],
      }).sendAndConfirm(umi);
      console.log("Create Collection Response: ", response);
      console.log(
        "Decoded Signature: ",
        base58.deserialize(response.signature)[0]
      );
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  const createPNFTCollection = async () => {
    try {
      console.log("Creating test collection...");
      const collectionUpdateAuthority = generateSigner(umi);
      console.log("Collection Update Authority: ", collectionUpdateAuthority);
      const collectionAddress = generateSigner(umi);
      console.log("Collection Address: ", collectionAddress);
      console.log("Collection Name: ", collectionName);
      console.log("Collection URI: ", collectionUri);
      const response = await createNft(umi, {
        mint: collectionAddress,
        name: collectionName,
        uri: collectionUri,
        sellerFeeBasisPoints: percentAmount(5), // 5.5%
        // isCollection: true,
        printSupply: printSupply("Limited", [5]),
        token: {},
      }).sendAndConfirm(umi);
      console.log("Create Collection Response: ", response);
      console.log(
        "Decoded Signature: ",
        base58.deserialize(response.signature)[0]
      );
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  const getCollection = async () => {
    console.log("Getting collection...");
    const collection = await fetchCollectionV1(umi, collectionAddress);
    // const collDetails = await collectionDetails( collectionAddress);
    console.log("Collection: ", collection);
  };

  const createCoreNft = async () => {
    console.log("Creating asset...");
    const assetAddress = generateSigner(umi);
    console.log("Asset Address: ", assetAddress);
    console.log("Asset Collection Address: ", assetCollectionAddress);
    console.log("Asset Authority Public Key: ", assetAuthorityPublicKey);
    const collFetch = await fetchCollection(umi, assetCollectionAddress);
    console.log("Collection Fetch: ", collFetch);

    // ================================================
    // Metaplex Core NFTs
    // ================================================

    // // uncomment this incase you want some other wallet to have authority
    // convert assetAuthoritySecret to Uint8Array(64)
    // const secret = new Uint8Array(
    //   Object.values(JSON.parse(assetAuthoritySecret))
    // );
    // console.log("Secret: ", secret);

    // this is to mint metaplex core NFTs
    const response = await create(umi, {
      name: assetName,
      uri: assetUri,
      asset: assetAddress,
      collection: collFetch,
      // uncomment this incase you want some other wallet to have authority
      // but by default, the wallet used to create the collection will have authority
      //   authority: assetAuthorityPublicKey,
      //   authority: {
      //     publicKey: assetAuthorityPublicKey,
      //     secret: secret,
      //   },
    }).sendAndConfirm(umi);
    console.log("Create Asset Response: ", response);
    console.log(
      "Decoded Signature: ",
      base58.deserialize(response.signature)[0]
    );
  };

  const getMetadataForPNFTCollection = async (collectionAddress) => {
    console.log("Getting metadata for collection...");
    const metadata = findMetadataPda(umi, {
      mint: collectionAddress,
    });
    console.log("Metadata: ", metadata);
  };

  const createPNFTMasterEdition = async () => {
    console.log("Creating asset...");
    // const assetAddress = generateSigner(umi);
    // console.log("Asset Address: ", assetAddress);
    console.log("Asset Collection Address: ", assetCollectionAddress);
    console.log("Asset Authority Public Key: ", assetAuthorityPublicKey);
    // const collMetadata = await fetchMetadataFromSeeds(umi, {
    //   mint: "BPmEGEvWpr8BfEAnJjYep6CN6of6aTfD4Dq1HLGEFJGE",
    // });
    const collDetails = collectionDetails(
      "V2",
      "BPmEGEvWpr8BfEAnJjYep6CN6of6aTfD4Dq1HLGEFJGE"
    );
    console.log("Collection Fetch: ", collDetails);

    // ================================================
    // Metaplex Programmable NFTs
    // ================================================

    const nftSigner = generateSigner(umi);
    console.log("NFT Signer: ", nftSigner);

    const response = await createProgrammableNft(umi, {
      tokenOwner: umi.identity.publicKey,
      mint: nftSigner,
      sellerFeeBasisPoints: percentAmount(5),
      name: "wwwre",
      uri: "#",
      ruleSet: "eBJLFYPxJmMGKuFwpDWkzxZeUrad92kZRC5BJLpzyT9",
      isMutable: true,
      symbol: "WRE",
      printSupply: printSupply("Limited", [10]),
      authority: umi.identity,
      updateAuthority: umi.identity,

      // isCollection: true,
      // collection: collDetails
    }).sendAndConfirm(umi);
    console.log("Create Asset Response: ", response);
    console.log(
      "Decoded Signature: ",
      base58.deserialize(response.signature)[0]
    );
  };

  const sendMultipleAssets = async () => {
    console.log("Sending asset...");
    console.log("Asset Address: ", toSendMultipleAssets);
    console.log("Recipient Address: ", receiverAddress);
    const collection = await fetchCollectionV1(umi, toSendCollectionAddress);
    console.log("Collection: ", collection);

    let builder = transactionBuilder();

    console.log("Builder Setup: ", builder);

    // for (const address in toSendMultipleAssets) {
    //   const transferBuilder = transfer(umi, {
    //     asset: address,
    //     newOwner: receiverAddress,
    //     collection: collection,
    //   });
    //   builder = builder.add(transferBuilder);
    // }

    for (const address of toSendMultipleAssets) {
      const transferBuilder = transferV1(umi, {
        asset: address,
        newOwner: receiverAddress,
        collection: collection,
      });
      builder = builder.add(transferBuilder);
    }

    console.log("Builder with multiple assets: ", builder);

    // Optionally check transaction size
    // const isSmallEnough = builder.fitsInOneTransaction(umi);
    // if (!isSmallEnough) {
    //   console.error("Transaction too large.");
    //   toast.error("Transaction too large.");
    //   return;
    // }

    // console.log("Builder Ready: ", builder, isSmallEnough);

    const response = await builder.sendAndConfirm(umi);

    // const response = await transfer(umi, {
    //   asset: toSendAssetAddress,
    //   newOwner: receiverAddress,
    //   collection: collection,
    // }).sendAndConfirm(umi);
    console.log("Send Asset Response: ", response);
  };

  const fetchCoreAssets = async () => {
    console.log("Fetching assets...");
    console.log("Owner Address: ", fetchAssetsByOwnerAddr);
    const assetsByOwner = await fetchAssetsByOwner(
      umi,
      fetchAssetsByOwnerAddr,
      {
        skipDerivePlugins: false,
      }
    );
    console.log("Assets by Owner: ", assetsByOwner);
  };

  const fetchPNFTAssets = async () => {
    console.log("Fetching assets...");
    console.log("Owner Address: ", fetchAssetsByOwnerAddr);
    // const assetsByOwner = await fetchDigitalAssetWithAssociatedToken(
    //   umi,
    //   "371UVEERyWX8RnXuDFAPLrAvbz2t1yBuiUndYJetKJVj",
    //   fetchAssetsByOwnerAddr
    // );
    const assetsByOwner = await fetchAllDigitalAssetByOwner(
      umi,
      fetchAssetsByOwnerAddr
    );
    const allMasterEditions = await fetchAllMasterEdition(umi, [
      "764HZXNsRV69fRmeigE6Q8ZkCerFoBNw7iqVp62MZvLF",
    ]);
    // const allEditions = await fetchAllEdition(umi, ["BZAHeAqtSs3JHR9vnT6VXyF347NkgbeuvVpz4g2sm9WR"]);
    // console.log("Assets by Owner: ", assetsByOwner);
    // console.log("All Editions: ", allEditions);
    console.log("All Master Editions: ", allMasterEditions);
  };

  const showWalletObject = async () => {
    console.log("Wallet Object: ", wallet);
    console.log("Public Key: ", wallet.publicKey?.toString());
    console.log("UMI Public Key: ", umi.identity.publicKey.toString());
    console.log("Connection: ", connection);
    const accountInfo = await connection.getAccountInfo(wallet.publicKey);
    console.log("Account Info: ", accountInfo);
    let bal = accountInfo?.lamports * Math.pow(10, -9);
    console.log("Balance: ", bal);
  };

  const printPNFTEdition = async () => {
    console.log("Printing PNFT edition...");
    // (Optional) Fetch the master edition account to mint the next edition number.
    const masterEdition = await fetchMasterEditionFromSeeds(umi, {
      mint: printEditionMint,
    });

    const editionMint = generateSigner(umi);

    console.log("Master Edition: ", masterEdition);
    console.log("Edition Mint: ", editionMint);

    const response = await printV1(umi, {
      // masterTokenAccountOwner: umi.identity.publicKey,
      masterTokenAccountOwner: "J6GT31oStsR1pns4t6P7fs3ARFNo9DCoYjANuNJVDyvN",
      masterEditionMint: printEditionMint,
      editionMint,
      editionTokenAccountOwner: "DiaUrAaTkuftHRkEJePworE2uT9ZhcFi1WqkAx53UxHv",
      editionNumber: masterEdition.supply + 1n,
      tokenStandard: TokenStandard.ProgrammableNonFungible,
    }).sendAndConfirm(umi);

    console.log("Print PNFT Edition Response: ", response);
  };

  const fetchMasterEditionData = async () => {
    console.log("Fetching master edition data...");

    const masterEdition = await fetchMasterEditionFromSeeds(umi, {
      mint: masterEditionMint,
    });

    console.log("Master Edition: ", masterEdition);
  };

  const unlockPNFT = async () => {
    console.log("Unlocking PNFT...");
    const response = await unlockV1(umi, {
      mint,
      // authority,
      tokenStandard: TokenStandard.NonFungible,
    }).sendAndConfirm(umi);
    console.log("Unlock PNFT Response: ", response);
  };

  const approveDelegate = async (assetAddr, delegate) => {
    console.log("Approving Delegate...");
    console.log("Asset Address: ", assetAddr);
    console.log("Delegate Address: ", delegate);
    console.log("UMI Public Key: ", umi.identity.publicKey);
    const response = await delegateLockedTransferV1(umi, {
      mint: assetAddr,
      // tokenOwner: "DiaUrAaTkuftHRkEJePworE2uT9ZhcFi1WqkAx53UxHv",
      // tokenOwner: umi.identity.publicKey,
      // authority: umi.identity,
      delegate: delegate,
      tokenStandard: TokenStandard.ProgrammableNonFungible,
    }).sendAndConfirm(umi);
    console.log("Approve Delegate Response: ", response);
  };

  const fetchDigitalAssetData = async (mintAddress) => {
    console.log("Fetching digital asset...");
    console.log("Mint Address: ", mintAddress);
    const assetA = await fetchAllDigitalAssetWithTokenByMint(umi, mintAddress);
    const assetB = await fetchDigitalAsset(umi, mintAddress);
    // const assetC = await fetchAllDigitalAsset(umi, mintAddress);
    console.log("Digital AssetA: ", assetA);
    console.log("Digital AssetB: ", assetB);
    // console.log("Digital AssetC: ", assetC);
  };

  // const transferUSDC = async () => {
  //   const SPL_TOKEN_2022_PROGRAM_ID: PublicKey = publicKey(
  //     "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb"
  //   );

  //   const token = findAssociatedTokenPda(umi, {
  //     mint: "ATDdKNMSCeyiv1oooyPMq6GfMkvAwn5HwhFFsKgASCzN",
  //     owner: umi.identity.publicKey,
  //     tokenProgramId: SPL_TOKEN_2022_PROGRAM_ID,
  //   });

  //   console.log("Token: ", token);

  //   // await mintV1(umi, {
  //   //   mint: mint.publicKey,
  //   //   token,
  //   //   authority,
  //   //   amount: 1,
  //   //   tokenOwner,
  //   //   splTokenProgram: SPL_TOKEN_2022_PROGRAM_ID,
  //   //   tokenStandard: TokenStandard.NonFungible,
  //   // }).sendAndConfirm(umi);
  //   const tResponse = await transferV1(umi, {
  //     asset: token,
  //     newOwner: "J6GT31oStsR1pns4t6P7fs3ARFNo9DCoYjANuNJVDyvN",
  //     amount: 10,
  //   }).sendAndConfirm(umi);

  //   transfer

  //   console.log("Transfer Response: ", tResponse);
  // };

  const receiveUSDC = async () => {
    // const account = "ATDdKNMSCeyiv1oooyPMq6GfMkvAwn5HwhFFsKgASCzN";
    // const mint = "Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr";
    // const mintAuthority = "Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr";
    // const tokenProgram = "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA";
    // const toAddress = "Ez1Y8ygX8TRwCbDEnu3r24hrjuDvxxy6qc15EKQgPvD5";

    // https://explorer.solana.com/tx/4R5uH55YBHdb5H9t7mUMDmBFye9fMEeNBG1HSk8SwMyxwmuL72xbk4hE94XKen2TemYRr2N8t1ckXstJgNXJLRrC?cluster=devnet
    // const account = "ATDdKNMSCeyiv1oooyPMq6GfMkvAwn5HwhFFsKgASCzN";
    // const mint = "Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr";
    // const mintAuthority = "Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr";
    // const tokenProgram = "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA";

    // https://explorer.solana.com/tx/aZMqzbnDJTtSWXrZNuj35xdD7gkoYSQNMyJvMoW4XkjmHQFgakv1HymJBa2vPhup4dhgdt5qvArQFqturD2DcBh?cluster=devnet
    const tokenProgram = "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA";
    const account = "5cCcrvi3Qx8XQeQE8wkDmjCE9ZTaL3KN4vX3yF5DCCG4";
    const mint = "Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr";

    // this code basically predicts the PDA for the sender and receiver
    const fromPDA = findAssociatedTokenPda(umi, {
      owner: umi.identity.publicKey,
      mint: mint,
    });

    console.log("From Token Account: ", fromPDA);

    const toPDA = findAssociatedTokenPda(umi, {
      owner: toAddress,
      mint: mint,
    });

    console.log("To Token Account: ", toPDA);

    const tokenAccountResponse = await transactionBuilder()
      // this is creating PDA for the sender, which is someone else. usually this will be someone who is holder of the USDC in mainnet, so we can say they already have the PDA. But this is for testing, so we are creating it
      .add(
        createTokenIfMissing(umi, {
          mint,
          owner: umi.identity.publicKey,
          tokenProgram: tokenProgram,
        })
      )
      // this is creating PDA for the receiver, which is we. So, we don't need to create it becuase we already have it
      // but this is for testing, so we are creating it
      .add(
        createTokenIfMissing(umi, {
          mint,
          owner: toAddress,
          tokenProgram: tokenProgram,
        })
      )
      .add(
        transferTokens(umi, {
          source: fromPDA,
          destination: toPDA,
          // authority: ownerOrDelegate,
          amount: 30000000,
        })
      )
      .sendAndConfirm(umi);

    console.log("To Token Account: ", tokenAccountResponse);
  };

  const checkUSDCBalance = async () => {
    // https://explorer.solana.com/tx/4R5uH55YBHdb5H9t7mUMDmBFye9fMEeNBG1HSk8SwMyxwmuL72xbk4hE94XKen2TemYRr2N8t1ckXstJgNXJLRrC?cluster=devnet
    // const account = "ATDdKNMSCeyiv1oooyPMq6GfMkvAwn5HwhFFsKgASCzN";
    // const mint = "Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr";
    // const mintAuthority = "Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr";
    // const tokenProgram = "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA";

    // https://explorer.solana.com/tx/aZMqzbnDJTtSWXrZNuj35xdD7gkoYSQNMyJvMoW4XkjmHQFgakv1HymJBa2vPhup4dhgdt5qvArQFqturD2DcBh?cluster=devnet
    const tokenProgram = "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA";
    const account = "5cCcrvi3Qx8XQeQE8wkDmjCE9ZTaL3KN4vX3yF5DCCG4";
    const mint = "Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr";

    // this code basically predicts the PDA for the sender and receiver
    const fromPDA = findAssociatedTokenPda(umi, {
      owner: umi.identity.publicKey,
      mint: mint,
    });

    const tokenAccountResponse = await fetchToken(umi, fromPDA);

    console.log("To Token Account: ", parseInt(tokenAccountResponse.amount) / 1000000);
  };

  return (
    <div className="flex flex-col items-start justify-start my-20 text-2xl px-28 gap-y-4">
      This is dummy page
      <button className="btn" onClick={showWalletObject}>
        Show Wallet Object
      </button>
      {/* create collection */}
      <div className="flex flex-row items-center gap-x-4">
        <button className="btn btn-primary" onClick={createCoreCollection}>
          Create Core NFT Coll.
        </button>
        <button className="btn btn-primary" onClick={createPNFTCollection}>
          Create PNFT Coll.
        </button>
        <input
          type="text"
          placeholder="Master Collection Name"
          className="input input-bordered"
          value={collectionName}
          onChange={(e) => setCollectionName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Master Collection URI"
          className="input input-bordered"
          value={collectionUri}
          onChange={(e) => setCollectionUri(e.target.value)}
        />
      </div>
      {/* get collection */}
      <div className="flex flex-row items-center gap-x-4">
        <button className="btn btn-primary" onClick={getCollection}>
          Get ME Coll. Details
        </button>
        <input
          type="text"
          placeholder="collectionAddress.publicKey"
          className="input input-bordered"
          value={collectionAddress}
          onChange={(e) => setCollectionAddress(e.target.value)}
        />
      </div>
      {/* get collection metadata for PNFT colelction */}
      <div className="flex flex-row items-center gap-x-4">
        <button
          className="btn btn-primary"
          onClick={() => getMetadataForPNFTCollection(collectionAddress)}
        >
          Get Metadata for PNFT Coll.
        </button>
        <input
          type="text"
          placeholder="collectionAddress.publicKey"
          className="input input-bordered"
          value={collectionAddress}
          onChange={(e) => setCollectionAddress(e.target.value)}
        />
      </div>
      {/* create asset in a collection */}
      <div className="flex flex-row items-center gap-x-4">
        <button className="btn btn-primary" onClick={createCoreNft}>
          Create Core NFT
        </button>
        <button className="btn btn-primary" onClick={createPNFTMasterEdition}>
          Create PNFT
        </button>
        <div className="grid grid-cols-3 gap-x-3 gap-y-3">
          <input
            type="text"
            placeholder="M.Coll Address"
            className="input input-bordered"
            value={assetCollectionAddress}
            onChange={(e) => setAssetCollectionAddress(e.target.value)}
          />
          <input
            type="text"
            placeholder="Asset Name"
            className="input input-bordered"
            value={assetName}
            onChange={(e) => setAssetName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Asset URI"
            className="input input-bordered"
            value={assetUri}
            onChange={(e) => setAssetUri(e.target.value)}
          />
          {/* get authority public key and secret */}
          {/* <input
            type="text"
            placeholder="authority.publicKey"
            className="input input-bordered"
            value={assetAuthorityPublicKey}
            onChange={(e) => setAssetAuthorityPublicKey(e.target.value)}
          />
          <input
            type="text"
            placeholder="authority.secret"
            className="input input-bordered"
            value={assetAuthoritySecret}
            onChange={(e) => setAssetAuthoritySecret(e.target.value)}
          /> */}
        </div>
      </div>
      {/* send asset to someone */}
      <div className="flex flex-row items-center gap-x-4">
        <button className="btn btn-primary" onClick={sendMultipleAssets}>
          Send Asset(NFT)
        </button>
        {/* <input
          type="text"
          placeholder="Asset Address"
          className="input input-bordered"
          value={toSendAssetAddress}
          onChange={(e) => setToSendAssetAddress(e.target.value)}
        /> */}
        <input
          type="text"
          placeholder="M.Coll Address"
          className="input input-bordered"
          value={toSendCollectionAddress}
          onChange={(e) => setToSendCollectionAddress(e.target.value)}
        />
        <input
          type="text"
          placeholder="Receiver Address"
          className="input input-bordered"
          value={receiverAddress}
          onChange={(e) => setReceiverAddress(e.target.value)}
        />
        <input
          type="text"
          placeholder="Multiple Assets"
          className="input input-bordered"
          value={toSendMultipleAssets}
          onChange={(e) => {
            // delimit the input by comma, remove white spaces and convert to array
            const assets = e.target.value.split(",");
            setToSendMultipleAssets(assets);
          }}
        />
      </div>
      {/* fetch assets by owner */}
      <div className="flex flex-row items-center gap-x-4">
        <button className="btn btn-primary" onClick={fetchPNFTAssets}>
          Fetch Assets(Balance)
        </button>
        <input
          type="text"
          placeholder="Owner Address"
          className="input input-bordered"
          value={fetchAssetsByOwnerAddr}
          onChange={(e) => setFetchAssetsByOwnerAddr(e.target.value)}
        />
      </div>
      {/* fetch digital asset token with mint */}
      <div className="flex flex-row items-center gap-x-4">
        <button
          className="btn btn-primary"
          onClick={() => fetchDigitalAssetData(fetchDigitalAssetMint)}
        >
          Fetch Digital Asset
        </button>
        <input
          type="text"
          placeholder="Provide Mint Address "
          className="input input-bordered"
          value={fetchDigitalAssetMint}
          onChange={(e) => setFetchDigitalAssetMint(e.target.value)}
        />
      </div>
      {/* approve delegate */}
      <div className="flex flex-row items-center gap-x-4">
        <button
          className="btn btn-primary"
          onClick={() =>
            approveDelegate(delegateData.assetAddr, delegateData.delegate)
          }
        >
          Approve Delegate
        </button>
        <input
          type="text"
          placeholder="Asset Address"
          className="input input-bordered"
          value={delegateData.assetAddr}
          onChange={(e) =>
            setDelegateData({ ...delegateData, assetAddr: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Delegate Address"
          className="input input-bordered"
          value={delegateData.delegate}
          onChange={(e) =>
            setDelegateData({ ...delegateData, delegate: e.target.value })
          }
        />
      </div>
      {/* get master edition data */}
      <div className="flex flex-row items-center gap-x-4">
        <button className="btn btn-primary" onClick={fetchMasterEditionData}>
          Fetch Master Edition Data
        </button>
        <input
          type="text"
          placeholder="Master Edition Addr."
          className="input input-bordered"
          value={masterEditionMint}
          onChange={(e) => setMasterEditionMint(e.target.value)}
        />
      </div>
      {/* print edition */}
      <div className="flex flex-row items-center gap-x-4">
        <button className="btn btn-primary" onClick={printPNFTEdition}>
          Print PNFT Edition
        </button>
        <input
          type="text"
          placeholder="Master Edition Mint Addr."
          className="input input-bordered"
          value={printEditionMint}
          onChange={(e) => setPrintEditionMint(e.target.value)}
        />
      </div>
      {/* upload image file and print the URL */}
      <div className="flex flex-row items-center gap-x-4">
        <p className="text-lg">Upload Image File</p>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="file-input"
          placeholder="Upload Image"
        />
      </div>
      {/* upload JSON file and print the URL */}
      <div className="flex flex-row items-center gap-x-4">
        <p className="text-lg">Upload JSON File</p>
        <input
          type="file"
          accept="application/json"
          onChange={handleJsonUpload}
          className="file-input"
          placeholder="Upload JSON"
        />
      </div>
      {/* update token metadata */}
      <div className="flex flex-row items-center gap-x-4">
        <button className="btn btn-primary" onClick={performUpdateMetadata}>
          Update Metadata
        </button>
      </div>
      {/* receive USDC */}
      <div className="flex flex-row items-center gap-x-4">
        <button className="btn btn-primary" onClick={receiveUSDC}>
          Receive USDC
        </button>
      </div>
      {/* check USDC balance */}
      <div className="flex flex-row items-center gap-x-4">
        <button className="btn btn-primary" onClick={checkUSDCBalance}>
          Check USDC Balance
        </button>
      </div>
    </div>
  );
}

export default Dummy;
