import React, { useEffect, useState } from 'react'
import FriendCard from '../components/FriendCard';
import NoFriendsFound from '../components/NoFriendsFound';
import { Search, UsersIcon } from 'lucide-react';
import { Link } from 'react-router';
import { getMyFriends } from '../lib/api';
import { useQuery } from '@tanstack/react-query';
import ExpandingSearchBar from '../components/ExpandingSearchBar';

const FriendsPage = () => {

  const { data: myFriends = [], isLoading: loadingFriends } = useQuery({
    queryKey: ['friends'],
    queryFn: getMyFriends
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState(searchTerm);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 400); // 400ms delay

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  const filteredFriends = myFriends.filter(friend =>
    friend.fullname?.toLowerCase().includes(debouncedSearch.toLowerCase())
  );

  return (
    <div className='p-4 sm:p-6 lg:p-8'>
      <div className="container mx-auto space-y-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Your Friends</h2>
          <ExpandingSearchBar
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>


        {loadingFriends ? (
          <div className='flex justify-center py-12'>
            <span className='loading loading-spinner loading-lg' />
          </div>
        ) : myFriends.length === 0 ? (
          <NoFriendsFound />
        ) : (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
            {filteredFriends.map((friend) => (
              <FriendCard key={friend._id} friend={friend} />
            ))
            }
          </div>
        )
        }
      </div>
    </div>
  )
}

export default FriendsPage