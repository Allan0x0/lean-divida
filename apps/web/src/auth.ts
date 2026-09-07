import { setToken } from "./token";
import { trpc } from "./trpc";

export function useAuth() {
  const currentUser = trpc.auth.currentUser.useQuery(undefined, {
    retry: false,
    staleTime: Infinity,
  });
  return { ...currentUser };
}

export function useLogin () {
  const utils = trpc.useUtils();
  const mutation = trpc.auth.login.useMutation({
    onSuccess: ({ token }) => {
      setToken(token);
      utils.auth.currentUser.invalidate();
    }
  });
  return { ...mutation };
}

export function useRegister () {
  const utils = trpc.useUtils();
  const mutation = trpc.auth.register.useMutation({
    onSuccess: ({ token }) => {
      setToken(token);
      utils.auth.currentUser.invalidate();
    }
  });
  return { ...mutation };
}

export function useLogout () {
  const utils = trpc.useUtils();
  return () => {
    setToken(undefined);
    utils.auth.currentUser.invalidate();
  }
}