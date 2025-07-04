import { useMutation, useQueryClient } from '@tanstack/react-query';
import React from 'react'
import { signup } from '../lib/api.js';

const useSignupHook = () => {
    const queryClient = useQueryClient();
    const {
        mutate: signupMutation,
        isPending,
        error,
    } = useMutation({
        mutationFn: signup,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["authUser"] });
        },
    });
    return {signupMutation,isPending,error};
}

export default useSignupHook