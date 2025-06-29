import React, { useState } from 'react'
import useAuthHook from '../hooks/useAuthHook'
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { completeOnboarding } from '../lib/api';
import { CameraIcon, LoaderIcon, MapPinIcon, ShipWheelIcon, ShuffleIcon } from 'lucide-react';
import { LANGUAGES } from '../constant/index.js';

const OnBoardingPage = () => {

  const { authUser } = useAuthHook();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    fullname: authUser?.fullname || "",
    bio: authUser?.bioData || "",
    nativeLanguage: authUser?.nativeLanguage || "",
    learningLanguage: authUser?.learningLanguage || "",
    location: authUser?.location || "",
    profilePic: authUser?.profilePic || "",
  })


  const { mutate: onboardingMutation, isPending,error } = useMutation({
    mutationFn: completeOnboarding,
    onSuccess: () => {
      toast.success("Profile onboarded successfully");
      queryClient.invalidateQueries({ queryKey: ['authUser'] });
    },
    onError: (error)=>{
      toast.error(error.response.data.message);
    }
  });


  const handleRandomAvatar = () => {
    const idx = Math.floor(Math.random() * 10000) + 1;
    const randomAvatar = `https://api.dicebear.com/9.x/micah/svg?seed=${idx}`;
    setFormData({...formData,profilePic:randomAvatar});
  }


  const handlesubmit = (e) => {
    e.preventDefault();
    onboardingMutation(formData);
  }


  return (
    <div className='min-h-screen bg-base-100 flex items-center justify-center p-2'>
      <div className='card border border-primary/25 bg-base-200 w-full max-w-3xl shadow-xl'>
        <div className='card-body p-6 sm:p-6'>
          <h1 className='text-2xl sm:text-3xl font-bold text-center mb-2'>Complete Your Profile</h1>
          <form onSubmit={handlesubmit} >
            {/* Profile Pic */}
            <div className='flex flex-col items-center justify-center space-y-2'>
              {/* img preview */}
              <div className='size-32 rounded-full bg-base-300 overflow-hidden'>
                {formData.profilePic ? (
                  <img
                    src={formData.profilePic}
                    alt="Profile Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <CameraIcon className="size-12 text-base-content opacity-40" />
                  </div>
                )}
              </div>
              {/* Generate Random avatar */}
              <div className='flex items-center gap-2'>
                <button
                  type='button'
                  onClick={handleRandomAvatar}
                  className='btn btn-accent'>
                  <ShuffleIcon className='size-4 mr-2' />
                  <span className='font-bold'>Generate Random Avatar</span>
                </button>
              </div>

              {/* Full name */}
              <div
                className='form-control w-full'>
                <label className='label'>
                  <span className='label-text'>Full Name</span>
                </label>
                <input
                  type="text"
                  name='fullname'
                  className={`input input-bordered w-full ${error && error.response.data.missingFields.includes("fullname")?"border-red-500":""}`}
                  value={formData.fullname}
                  onChange={(e) => setFormData({ ...formData, fullname: e.target.value })}
                  placeholder='Your User Name'
                />
              </div>

              {/* BIO */}
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">Bio</span>
                </label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className={`textarea textarea-bordered h-14 ${error && error.response.data.missingFields.includes("bio")?"border-red-500":""}`}
                  placeholder="Tell others about yourself and your language learning goals"
                />
              </div>

              {/* LANGUAGES */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                {/* NATIVE LANGUAGE */}
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text">Native Language</span>
                  </label>
                  <select
                    name="nativeLanguage"
                    value={formData.nativeLanguage}
                    onChange={(e) => setFormData({ ...formData, nativeLanguage: e.target.value })}
                    className={`select select-bordered w-full ${error && error.response.data.missingFields.includes("nativeLanguage")?"border-red-500":""} `}
                  >
                    <option value="">Select your native language</option>
                    {LANGUAGES.map((lang) => (
                      <option key={`native-${lang}`} value={lang.toLowerCase()}>{lang}</option>
                    ))

                    }
                  </select>
                </div>

                {/* LEARNING LANGUAGE */}
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text">Learning Language</span>
                  </label>
                  <select
                    name="learningLanguage"
                    value={formData.learningLanguage}
                    onChange={(e) => setFormData({ ...formData, learningLanguage: e.target.value })}
                    className={`select select-bordered w-full ${error && error.response.data.missingFields.includes("learningLanguage")?"border-red-500":""}`}
                  >
                    <option value="">Select language you're learning</option>
                    {LANGUAGES.map((lang) => (
                      <option key={`learning-${lang}`} value={lang.toLowerCase()}>{lang}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* LOCATION */}
              <div className="form-control w-full pb-2">
                <label className="label">
                  <span className="label-text">Location</span>
                </label>
                <div className="relative">
                  <MapPinIcon className="absolute top-1/2 transform -translate-y-1/2 left-3 size-5 text-base-content opacity-70" />
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className={`input input-bordered w-full pl-10 ${error && error.response.data.missingFields.includes("location")?"border-red-500":""}`}
                    placeholder="City, Country"
                  />
                </div>
              </div>

              <button className="btn btn-primary w-full" type="submit" disabled={isPending}>
                {isPending ? (
                  <>
                    <LoaderIcon className="animate-spin size-5 mr-2" />
                    <span>Loading...</span>
                  </>
                ) : (
                  <>
                  <ShipWheelIcon className="size-5 mr-2" />
                  <span className='font-bold'>Complete Onboarding</span>
                  </>
                )}
              </button>

            </div>
          </form>

        </div>

      </div>


    </div>
  )
}

export default OnBoardingPage