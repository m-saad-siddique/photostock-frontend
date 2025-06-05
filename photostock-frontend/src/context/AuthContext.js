"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { gql, useLazyQuery, useMutation } from "@apollo/client";

const LOGIN_MUTATION = gql`
  mutation SignIn($input: SignInInput!) {
    signIn(input: $input) {
      token
      user {
        id
        email
      }
    }
  }
`;

const SIGNUP_MUTATION = gql`
  mutation SignUp($input: SignUpInput!) {
    signUp(input: $input) {
      id
      email
    }
  }
`;

const ME_QUERY = gql`
  query {
    me {
      id
      email
    }
  }
`;

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  const [signInMutation] = useMutation(LOGIN_MUTATION);
  const [signUpMutation] = useMutation(SIGNUP_MUTATION);
  const [loadUser] = useLazyQuery(ME_QUERY, {
    fetchPolicy: "network-only",
    onCompleted: (data) => setUser(data.me),
    onError: () => logout(),
  });

  // 🛡 Load token from localStorage only in the browser
  useEffect(() => {
    const storedToken = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (storedToken) {
      setToken(storedToken);
      loadUser({
        context: {
          headers: { Authorization: `Bearer ${storedToken}` },
        },
      });
    }
  }, []);

  const login = async (email, password) => {
    const res = await signInMutation({ variables: { input: { email, password } } });
    const t = res.data.signIn.token;
    setToken(t);
    localStorage.setItem("token", t);
    setUser(res.data.signIn.user);
    router.push("/dashboard");
  };

  const signup = async (email, password) => {
    await signUpMutation({ variables: { input: { email, password } } });
    await login(email, password); // auto-login
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, signup }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
