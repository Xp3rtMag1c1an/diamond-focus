
import { toast } from 'sonner';

export const useBreak = () => {
  // Request a break (Relief Pitcher feature)
  const requestBreak = () => {
    toast.success("Take a 5-minute break. Your Relief Pitcher is warming up!", {
      duration: 7000
    });
    
    // In a real implementation, this would schedule a notification
    setTimeout(() => {
      toast.info("Break time is over. Back to the game!", {
        duration: 7000
      });
    }, 5000); // Shortened for demo purposes (5 seconds instead of 5 minutes)
  };
  
  return { requestBreak };
};
