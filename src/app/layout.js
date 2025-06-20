import "./globals.css";
import ApolloWrapper from "../components/ApolloWrapper";
import { AuthProvider } from "../context/AuthContext";

export const metadata = {
  title: "PhotoStock App",
  description: "GraphQL photo-sharing app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ApolloWrapper>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ApolloWrapper>
      </body>
    </html>
  );
}
