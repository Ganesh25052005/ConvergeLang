import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import useAuthHook from '../hooks/useAuthHook';
import { useQuery } from '@tanstack/react-query';
import { getStreamToken } from '../lib/api';



import {
  StreamVideo,
  StreamVideoClient,
  StreamCall,
  CallControls,
  SpeakerLayout,
  StreamTheme,
  CallingState,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";

import "@stream-io/video-react-sdk/dist/css/styles.css";
import toast from "react-hot-toast";
import LoadingPage from '../components/LoadingPage';


const CallPage = () => {

  const { id: callId } = useParams();
  const [client, setClient] = useState(null);
  const [call, setCall] = useState(null);
  const [connecting, setConnecting] = useState(true);

  const { authUser, isLoading } = useAuthHook();
  const { data: tokendata } = useQuery({
    queryKey: ['streamToken'],
    queryFn: getStreamToken,
    enabled: !!authUser,
  })

  const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

  useEffect(() => {

    const initCall = async () => {
      if (!tokendata || !authUser) return;

      try {
        console.log("Starting Video Call");

        const user = {
          id: authUser._id,
          name: authUser.fullname,
          image: authUser.profilePic
        }

        const videoClient = new StreamVideoClient({
          apiKey: STREAM_API_KEY,
          user,
          token: tokendata.token
        })

        const callInstance = videoClient.call("default", callId);
        await callInstance.join({ create: true });

        console.log("Joined Call Successfully");
        setClient(videoClient);
        setCall(callInstance);

      } catch (error) {
        console.error("Error joining call:", error);
        toast.error("Could not join the call. Please try again.");
      } finally {
        setConnecting(false);
      }
    };

    initCall();

  }, [tokendata,authUser,callId]);

  if(isLoading || connecting ) return <LoadingPage/>;

  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <div className="relative">
        {client && call ? (
          <StreamVideo client={client}>
            <StreamCall call={call}>
              <CallContent />
            </StreamCall>
          </StreamVideo>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p>Could not initialize call. Please refresh or try again later.</p>
          </div>
        )}
      </div>
    </div>
  )
};

const CallContent = () => {
  const { useCallCallingState } = useCallStateHooks();
  const callingState = useCallCallingState();

  const navigate = useNavigate();

  if (callingState === CallingState.LEFT) return navigate("/");

  return (
    <StreamTheme>
      <SpeakerLayout />
      <CallControls />
    </StreamTheme>
  );
};



export default CallPage