import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logout } from "../lib/api";


const useLogoutHook = () => {
  const queryClient = useQueryClient();
  const {mutate:logoutMutation} =useMutation({
    mutationFn:logout,
    onSuccess: ()=>{ queryClient.invalidateQueries({queryKey:['authUser']})}
  });
  return {logoutMutation};
}

export default useLogoutHook