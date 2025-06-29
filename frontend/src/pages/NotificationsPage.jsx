import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import React, { useState } from 'react'
import { acceptFriendRequest, getFriendrequests } from '../lib/api';
import { BellIcon, ClockIcon, MessageSquareIcon, UserCheckIcon } from 'lucide-react';
import NoNotifications from '../components/NoNotifications';

const NotificationsPage = () => {

  const queryClient = useQueryClient();

  const { data: FriendRequests, isLoading } = useQuery({
    queryKey: ['friendRequests'],
    queryFn: getFriendrequests
  })

  const { mutate: acceptReqMutation, isPending } = useMutation({
    mutationFn: acceptFriendRequest,
    onMutate: (senderId)=>{
      setPendingUserId(senderId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['friendRequests'] }),
        queryClient.invalidateQueries({ queryKey: ['friends'] })
    },
    onError: ()=>{
      setPendingUserId(null);
    }
  });

  const IncomingRequests = FriendRequests?.incomingRequests || [];
  const AcceptedRequests = FriendRequests?.acceptedRequests || [];

  IncomingRequests.sort( (a,b)=> new Date(b.createdAt) - new Date(a.createdAt));
  AcceptedRequests.sort( (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

function timeAgo(updatedAt) {
  const now = new Date();
  const updated = new Date(updatedAt);
  const diffMs = now - updated;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffSec < 60) return `${diffSec} seconds ago`;
  if (diffMin < 60) return `${diffMin} minutes ago`;
  if (diffHr < 24) return `${diffHr} hours ago`;
  return `${diffDay} days ago`;
}

  const [pendingUserId, setPendingUserId] = useState(null);
  return (
    <div className='p-4 sm:p-6 lg:p-8'>
      <div className='container mx-auto max-w-5xl space-y-8'>
        <h1 className='text-xl sm:text-2xl font-bold tracking-tight mb-6'>Notifications</h1>
        {
          isLoading ? (
            <div className='flex justify-center py-12'>
              <span className='loading loading-spinner loading-lg' />
            </div>
          ) : (
            <>
              {
                IncomingRequests.length > 0 && (
                  <section className='space-y-4'>
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                      <UserCheckIcon className="h-5 w-5 text-primary" />
                      Friend Requests
                      <span className="badge badge-primary ml-2">{IncomingRequests.length}</span>
                    </h2>

                    <div className="space-y-3">
                      {
                        IncomingRequests.map((request) => (
                          <div
                            key={request._id}
                            className='card bg-base-200 shadow-sm hover:shadow-md transition-shadow'
                          >
                            <div className='card-body p-4'>
                              <div className=' flex items-center justify-between'>
                                <div className="flex items-center gap-3">
                                  <div className="avatar w-14 h-14 rounded-full bg-base-300">
                                    <img src={request.sender.profilePic} alt={request.sender.fullname} />
                                  </div>
                                  <div>
                                    <h3 className="font-semibold">{request.sender.fullname}</h3>
                                    <div className="flex flex-wrap gap-1.5 mt-1">
                                      <span className="badge badge-secondary badge-sm">
                                        Native: {request.sender.nativeLanguage}
                                      </span>
                                      <span className="badge badge-outline badge-sm">
                                        Learning: {request.sender.learningLanguage}
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                <button className='btn btn-sm btn-primary'
                                  onClick={()=>acceptReqMutation(request._id)}
                                  disabled={pendingUserId === request._id}
                                >
                                  Accept
                                </button>

                              </div>
                            </div>

                          </div>
                        ))
                      }
                    </div>

                  </section>
                )
              }

              {/* Accepted req notifications */}
               {AcceptedRequests.length > 0 && (
              <section className="space-y-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <BellIcon className="h-5 w-5 text-success" />
                  New Connections
                </h2>

                <div className="space-y-3">
                  {AcceptedRequests.map((notification) => (
                    <div key={notification._id} className="card bg-base-200 shadow-sm">
                      <div className="card-body p-4">
                        <div className="flex items-start gap-3">
                          <div className="avatar mt-1 size-10 rounded-full">
                            <img
                              src={notification.receiver.profilePic}
                              alt={notification.receiver.fullname}
                            />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm my-1">
                              {notification.receiver.fullname} accepted your friend request
                            </p>
                            <p className="text-xs flex items-center opacity-70">
                              <ClockIcon className="h-3 w-3 mr-1" />
                              {
                                timeAgo(notification.updatedAt)
                              }
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {
              IncomingRequests.length === 0 && AcceptedRequests.length === 0 && (
                <NoNotifications/>
              )
            }

            </>
          )
        }
      </div>
    </div>
  )
}

export default NotificationsPage