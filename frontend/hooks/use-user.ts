import { cache } from 'react';
import { userService } from '@/services/userService';

export const useUser = cache(() => userService.getUser());
