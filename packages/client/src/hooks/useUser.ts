import { useMemo } from "react";

import { useMeQuery } from "../generated/graphql";

export const useUser = () => {
  const { data, refetch } = useMeQuery();
  const me = useMemo(() => data?.me, [data]);
  return { user: me, refetch };
};
