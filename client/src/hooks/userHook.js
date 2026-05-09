import { useMutation,useQuery } from "@tanstack/react-query";

import { createUser } from "../services/userService";
import { signIn, signOut,getCurrentUser } from "../services/authService";

export const useCreateUser = () => {
  return useMutation({
    mutationFn: createUser,
  });
};

// sign in user
export const useSignIn = () => {
  return useMutation({
    mutationFn: signIn,
  });
};

// sign out user
export const useSignOut = () => {
  return useMutation({
    mutationFn: signOut,
  });
}

// get current user
export const useCurrentUser = () => {
  return useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser,
  });
}