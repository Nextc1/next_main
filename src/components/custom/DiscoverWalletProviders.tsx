import { useState } from "react";
import { useSyncProviders } from "./useSyncProviders";
import { formatAddress } from "./walletUtils";

export const DiscoverWalletProviders = () => {
  const [selectedWallet, setSelectedWallet] = useState<EIP6963ProviderDetail>();
  const [userAccount, setUserAccount] = useState<string>("");
  const providers = useSyncProviders();

  // Connect to the selected provider using eth_requestAccounts.
  const handleConnect = async (providerWithInfo: EIP6963ProviderDetail) => {
    try {
      const accounts = await providerWithInfo.provider.request({
        method: "eth_requestAccounts",
      });

      try {
        await providerWithInfo.provider // Or window.ethereum if you don't support EIP-6963.
          .request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: "0x38" }],
          });
      } catch (switchError) {
        // This error code indicates that the chain has not been added to MetaMask.
        if (switchError.code === 4902) {
          try {
            await providerWithInfo.provider // Or window.ethereum if you don't support EIP-6963.
              .request({
                method: "wallet_addEthereumChain",
                params: [
                  {
                    chainId: "0x38",
                    chainName: "Binance Smart Chain Mainnet",
                    rpcUrls: ["https://bsc-dataseed.binance.org/"] /* ... */,
                    nativeCurrency: {
                      name: "BNB",
                      symbol: "BNB",
                      decimals: 18,
                    },
                  },
                ],
              });
          } catch (addError) {
            // Handle "add" error.
            console.error(addError);
          }
        }
        // Handle other "switch" errors.
        console.error(switchError);
      }

      setSelectedWallet(providerWithInfo);
      setUserAccount(accounts?.[0]);
    } catch (error) {
      console.error(error);
    }
  };

  // Display detected providers as connect buttons.
  return (
    <>
      {/* <h2>Wallets Detected:</h2> */}
      <div>
        <>
          {userAccount ? null : (
            <>
              {providers.length > 0 ? (
                providers?.map((provider: EIP6963ProviderDetail) =>
                  provider.info.name === "MetaMask" ? (
                    <button
                      className="flex items-center justify-center w-full h-10 px-6 py-2 text-black border-2 rounded-lg bg-gamma border-gamma md:w-auto"
                      key={provider.info.uuid}
                      onClick={() => handleConnect(provider)}
                    >
                      <p>Connect Wallet</p>
                    </button>
                  ) : (
                    ""
                  )
                )
              ) : (
                <div>No Announced Wallet Providers</div>
              )}
            </>
          )}
        </>
      </div>
      {/* <h2>{userAccount ? "" : "No "}Wallet Selected</h2> */}
      {userAccount && (
        <button className="flex items-center justify-center w-full h-10 px-6 py-2 text-black border-2 rounded-lg bg-gamma border-gamma md:w-auto">
          <div className="flex items-center gap-2">
            <p>{formatAddress(userAccount)}</p>
          </div>
        </button>
      )}
    </>
  );
};
