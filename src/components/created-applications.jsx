import { useUser } from '@clerk/clerk-react'
import React, { useEffect } from 'react'
import useFetch from '../hooks/use-fetch';
import { getApplication } from '../api/apiApplication';
import { BarLoader } from 'react-spinners';
import ApplicationCard from './application-card';

const CreatedApplications = () => {
    const { user, isLoaded } = useUser();

    const { loading: loadingApplications, data: applications = [], fn: fnApplications } = useFetch(getApplication, {
        user_id: user?.id,
    });

    useEffect(() => {
        if (isLoaded) {
            fnApplications();
        }
    }, [isLoaded]);

    if (!isLoaded || loadingApplications)
        return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />

    return (
        <div className='flex flex-col gap-2'>
            {applications.length > 0 ? (
                applications.map((application) => (
                    <ApplicationCard key={application.id} application={application} isCandidate />
                ))
            ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center relative">
                    <div className="absolute -top-10 w-72 h-72 bg-gradient-to-r from-purple-500/30 via-pink-500/20 to-blue-500/30 blur-3xl rounded-full animate-pulse"></div>

                    <div className="relative w-28 h-28 flex items-center justify-center">
                        <div className="absolute inset-0 rounded-full border-4 border-dashed border-purple-500 animate-spin-slow"></div>
                        <div className="w-20 h-20 rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 flex items-center justify-center shadow-lg shadow-purple-500/40">
                            <span className="text-4xl animate-bounce">📄</span>
                        </div>
                    </div>

                    <h2 className="mt-8 text-2xl font-bold text-gray-100 tracking-wide">
                        No Applications Found
                    </h2>

                    <p className="mt-3 text-gray-400 text-sm max-w-md">
                        You haven't submitted any applications yet. Start applying to jobs and keep track of your progress here.
                    </p>

                    <p className="mt-4 text-xs text-gray-500 italic">
                        Tip: Keep your resume updated to grab the best opportunities 🚀
                    </p>
                </div>
            )}
        </div>
    );
}

export default CreatedApplications;
