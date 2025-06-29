import React from 'react'

import { useQueryClient,useMutation } from '@tanstack/react-query';

import {signin} from '../lib/api.js';

const useLoginHook = () => {
    const queryClient = useQueryClient();
    const {
      mutate: signInMutation,
      isPending,
      error,
    } = useMutation({
      mutationFn: signin,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["authUser"] });
      },
    });

    return {error,isPending,signInMutation};
}

export default useLoginHook