import React, { useEffect, useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router'
import useAuthHook from '../hooks/useAuthHook';
import { useQuery } from '@tanstack/react-query';
import { getStreamToken } from '../lib/api';

import {
  Channel,
  ChannelHeader,
  Chat,
  MessageInput,
  MessageList,
  Thread,
  Window,
  ChannelList,
} from "stream-chat-react";
import { StreamChat } from "stream-chat";
import toast from 'react-hot-toast';
import ChatLoading from '../components/ChatLoading';
import { MessageCircle } from 'lucide-react';
import CallButton from '../components/CallButton';


const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;



const CustomChannelPreview = (props) => {
  const { channel, setActiveChannel, activeChannel, authUser, selectedChannel } = props;
  const navigate = useNavigate();
  setActiveChannel(selectedChannel);
  // Find the other user's ID and user object in a 1:1 chat
  const memberIds = Object.keys(channel.state.members);
  const otherUserId = memberIds.find(id => id !== authUser._id);
  const otherUser = otherUserId
    ? channel.state.members[otherUserId]?.user
    : null;
  
  const unreadCount = channel.countUnread();

  const handleClick = () => {
    if (otherUserId) {
      navigate(`/chat/${otherUserId}`);
    }
  };

  const isActive = activeChannel && activeChannel.cid === channel.cid;

  return (
    <div
  className={`flex items-center p-2 cursor-pointer ${isActive ? 'bg-neutral' : ''} hover:bg-neutral/40`}
  onClick={handleClick}
>
  <img
    src={otherUser?.image || "/default-avatar.png"}
    alt={otherUser?.name || "User"}
    className="size-16 sm:size-10 rounded-full mr-2"
  />
  <div className='w-full relative'>
    <div className="font-bold flex items-center gap-2 text-lg sm:text-base">
      {otherUser?.name || otherUserId}
    </div>
    <div className={`font-medium ${unreadCount ? 'text-base-content' : 'text-base-content/70'} text-base sm:text-xs`}>
      {props.latestMessagePreview || 'Nothing yet...'}
    </div>
    <div className='absolute top-1/2 -translate-y-1/2 right-0'>
      {unreadCount > 0 && (
        <span className="inline-flex items-center justify-center rounded-full bg-primary text-primary-content text-xs w-10 h-5">
          {unreadCount}
        </span>
      )}
    </div>
  </div>
</div>

  );
};


const ChatPage = () => {
  const { id: targetId } = useParams();

  const [chatClient, setChatClient] = useState(null);
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);

  const { authUser } = useAuthHook();

  const { data: tokendata } = useQuery({
    queryKey: ['streamToken'],
    queryFn: getStreamToken,
    enabled: !!authUser // only run when authuser is available
  });

  const sort = { last_message_at: -1 };
  const filters = {
    type: 'messaging',
    members: { $in: [authUser._id] },
  };
  const options = {
    limit: 10,
  };

  const [loadingChannel, setloadingChannel] = useState(false);

  const handleVideoCall = () => {
    if (channel) {
      const callUrl = `${window.location.origin}/call/${channel.id}`;

      channel.sendMessage({
        text: `Join the call here: ${callUrl}`
      });

    }
  }

  useEffect(() => {
    const initChat = async () => {
      if (!tokendata?.token || !authUser) return;
      setChannel(null);
      try {
        console.log("Initializing Stream Chat");
        const client = StreamChat.getInstance(STREAM_API_KEY);
        await client.connectUser({
          id: authUser._id,
          name: authUser.fullname,
          image: authUser.profilePic
        }, tokendata.token);

        setChatClient(client);

        if (targetId !== "inbox") {
          setloadingChannel(true);
          const channelId = [authUser._id, targetId].sort().join("-");
          const currChannel = client.channel("messaging", channelId, {
            members: [authUser._id, targetId],
          });
          await currChannel.watch();
          setChannel(currChannel);
          setloadingChannel(false);
        }
        else {
          setChannel(null);
        }

      } catch (error) {
        console.log("Error initializing the Chat: ", error);
        toast.error("Couldn't connect to Chat. Try again");
      }
      finally {
        setLoading(false);
      }
    }

    initChat();
  }, [tokendata, authUser, targetId]);

  if (loading || !chatClient) return <ChatLoading />

  return (
    <div className="h-[calc(100vh-64px)] bg-base-200">
      <Chat client={chatClient}>
        <div className="flex h-full">
          <div className={`${(channel || loadingChannel) ? 'hidden sm:block' : 'block'}  w-full sm:w-1/3 sm:max-w-xs border-r border-base-content/40`}>
            <ChannelList filters={filters} sort={sort} options={options}
              Preview={(previewProps) => (
                <CustomChannelPreview {...previewProps} authUser={authUser} selectedChannel={channel} />
              )}
            />
          </div>
          <div className="flex-1">
            {
              loadingChannel && (
                <div className="h-[calc(100vh-64px)] bg-base-100 flex flex-col items-center justify-center p-4">
                  <div className='flex justify-center py-12'>
                    <span className='loading loading-spinner loading-lg' />
                  </div>
                </div>
              )
            }
            {targetId !== "inbox" && channel && (
              <Channel channel={channel}>
                <div className='w-full relative'>
                  <CallButton handleVideoCall={handleVideoCall} />
                  <Window>
                    <ChannelHeader />
                    <MessageList />
                    <MessageInput focus />
                  </Window>
                </div>
                <Thread />
              </Channel>
            )}
            {targetId === "inbox" && (
              <div className="hidden sm:flex flex-col gap-4 bg-base-100 items-center justify-center h-full text-lg text-base-content">
                <MessageCircle className='size-10' />
                Select a conversation to start chatting!
              </div>
            )}
          </div>
        </div>
      </Chat>
    </div>
  );


}

export default ChatPage