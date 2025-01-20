// AuthMiddleware.tsx

import React, { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";/**
 * Props for AuthMiddleware component.
 * @property {ReactNode} children - The child components to be rendered if the user is authenticated.
 */
interface AuthMiddlewareProps {
  children: ReactNode;
}

/**
 * AuthMiddleware is a higher-order component (HOC) that checks if a user is authenticated.
 * It renders the children components if the user is authenticated, otherwise it redirects to the home page.
 *
 * @param {AuthMiddlewareProps} props - The props object containing child components.
 * @returns {JSX.Element} - The children components if authenticated, otherwise a redirect to the home page.
 */
const AuthMiddleware: React.FC<AuthMiddlewareProps> = ({ children }) => {
  const { connection } = useConnection();
  const { publicKey } = useWallet();

  if (connection && publicKey) {
    return <>{children}</>;
  }

  // If not authenticated, redirect to the home page
  console.warn("Wallet not connected or connection unavailable");
  return <Navigate to="/" replace />;
};

export default AuthMiddleware;
