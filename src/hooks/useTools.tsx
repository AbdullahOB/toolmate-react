import { useUser } from '@clerk/clerk-react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const useTools = () => {
  const { user } = useUser();
  const userEmail = user?.emailAddresses.map((email) => email.emailAddress) || [];
  const {
    data: suggestedTools = [],
    refetch,
    isLoading: isFetching,
  } = useQuery({
    queryKey: [''],
    queryFn: async () => {
      if (userEmail) {
        const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/tools/${userEmail[0]}`);
        return res.data[0].suggestedTools;
      }
    },
  });
  console.log(suggestedTools);
  return [suggestedTools, refetch, isFetching];
};

export default useTools;
