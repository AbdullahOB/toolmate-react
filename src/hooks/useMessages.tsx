import { useUser } from '@clerk/clerk-react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const useMessages = () => {
  const { user } = useUser();
  const userEmail = user?.emailAddresses.map((email) => email.emailAddress) || [];
  const {
    data: backendMessages = [],
    refetch,
    isLoading: isFetching,
  } = useQuery({
    queryKey: [''],
    queryFn: async () => {
      if (userEmail) {
        const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/messages/${userEmail[0]}`);
        return res.data[0].messages;
      }
    },
  });
  return [backendMessages, refetch, isFetching];
};

export default useMessages;
