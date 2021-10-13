import { useLogoutMutation } from "../generated/graphql";
import { client } from "../graphql/client";

export const useLogout = () => {
  const [logoutMutation, { loading, error }] = useLogoutMutation();

  const logout = async () => {
    await logoutMutation();
    await client.resetStore();
  };
  return { logout, loading, error };
};
