import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react'
import { getMyFriends, getoutgoingrequests, getRecommendedUsers, sendFriendRequest } from '../lib/api';
import { Link } from 'react-router';
import { CheckCircleIcon, MapPinIcon, UserPlusIcon, UsersIcon } from 'lucide-react';
import FriendCard, { getLanguageFlag } from '../components/FriendCard';
import NoFriendsFound from '../components/NoFriendsFound';
import { capitialize } from '../lib/utils';
import toast from 'react-hot-toast';

const HomePage = () => {

  const queryClient = useQueryClient();
  const [outgoingRequestIds,setoutgoingRequestIds] = useState(new Set())

  const {data:myFriends=[], isLoading:loadingFriends} = useQuery({
    queryKey:['friends'],
    queryFn: getMyFriends
  });

  const top3recent = myFriends.slice(-3).reverse();


  const {data:recommendedUsers=[],isLoading:loadingRecommendedUsers} = useQuery({
    queryKey:['recommendedUsers'],
    queryFn: getRecommendedUsers
  });

  const {data:OutgoingFriendRequests} = useQuery({
    queryKey:['OutgoingRequests'],
    queryFn:getoutgoingrequests
  });

  const [pendingUserId, setPendingUserId] = useState(null);


  const {mutate:sendRequestMutation,isPending:sendReqPending} = useMutation({
    mutationFn:sendFriendRequest,
    onMutate: (receiverID)=>{
      setPendingUserId(receiverID);
    },
    onSuccess: ()=> {
      queryClient.invalidateQueries({queryKey:['OutgoingRequests']});
    },
    onError: (error)=>{ 
      setPendingUserId(null);
      toast.error(error.response.data.message);
     },
  });

  useEffect( ()=>{
    const outgoingIds = new Set();
    if(OutgoingFriendRequests && OutgoingFriendRequests.length > 0){
      OutgoingFriendRequests.forEach((req)=>{
        outgoingIds.add(req.receiver._id)
      })
      setoutgoingRequestIds(outgoingIds)
    }
    else{   
    setoutgoingRequestIds(new Set()); // Clear the set if no outgoing requests
    }
  },[OutgoingFriendRequests])


return (
  <div className='p-4 sm:p-6 lg:p-8'>
    <div className="container mx-auto space-y-10">
        <div className="flex flex-col sm:flex-row items-start  justify-between gap-4">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Recent Connections</h2>
          <Link to="/notifications" className="btn btn-outline btn-sm">
            <UsersIcon className="mr-2 size-4" />
            Friend Requests
          </Link>
        </div>

        {loadingFriends? (
          <div className='flex justify-center py-12'>
            <span className='loading loading-spinner loading-lg'/>
          </div>
        ): top3recent.length === 0 ? (
          <NoFriendsFound/>
        ):(
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
            { top3recent.map((friend)=>(
                <FriendCard key={friend._id} friend={friend} />
              ))
            }
          </div>
        )
      }

      <section>
          <div className="mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-1xl sm:text-2xl font-bold tracking-tight">Meet New Learners</h2>
                <p className="opacity-70">
                  Discover perfect language exchange partners based on your profile
                </p>
              </div>
            </div>
          </div>

          {loadingRecommendedUsers ? (
            <div className="flex justify-center py-12">
              <span className="loading loading-spinner loading-lg" />
            </div>
          ) : recommendedUsers.length === 0 ? (
            <div className="card bg-base-200 p-6 text-center">
              <h3 className="font-semibold text-lg mb-2">No recommendations available</h3>
              <p className="text-base-content opacity-70">
                Check back later for new language partners!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recommendedUsers.map((user) => {
                const hasRequestBeenSent = outgoingRequestIds.has(user._id);

                return (
                  <div
                    key={user._id}
                    className="card bg-base-200 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="card-body p-5 space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="avatar size-16 rounded-full">
                          <img src={user.profilePic} alt={user.fullname} />
                        </div>

                        <div>
                          <h3 className="font-semibold text-lg">{user.fullname}</h3>
                          {user.location && (
                            <div className="flex items-center text-xs opacity-70 mt-1">
                              <MapPinIcon className="size-3 mr-1" />
                              {user.location}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Languages with flags */}
                      <div className="flex flex-wrap gap-1.5">
                        <span className="badge badge-secondary">
                          {getLanguageFlag(user.nativeLanguage)}
                          Native: {capitialize(user.nativeLanguage)}
                        </span>
                        <span className="badge badge-outline">
                          {getLanguageFlag(user.learningLanguage)}
                          Learning: {capitialize(user.learningLanguage)}
                        </span>
                      </div>

                      {user.bioData && <p className="text-sm opacity-70">{user.bioData}</p>}

                      {/* Action button */}
                      <button
                        className={`btn w-full mt-2 ${
                          hasRequestBeenSent ? "btn-disabled" : "btn-primary"
                        } `}
                        onClick={() => sendRequestMutation(user._id)}
                        disabled={hasRequestBeenSent || ( pendingUserId === user._id )}
                      >
                        {hasRequestBeenSent ? (
                          <>
                            <CheckCircleIcon className="size-4 mr-2" />
                            Request Sent
                          </>
                        ) : (
                          <>
                            <UserPlusIcon className="size-4 mr-2" />
                            Send Friend Request
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

    </div>
  </div>
)
}

export default HomePage;