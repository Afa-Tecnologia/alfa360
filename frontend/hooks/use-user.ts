"use client";

// hooks/useUserLoader.ts
import { useEffect } from 'react';
import { userService } from '@/services/userService';
import { useUserDataStore } from '@/stores/use-data-store';

export function useUserLoader() {
  const { user, setUser } = useUserDataStore();

  useEffect(() => {
    if (!user) {
      userService.getUser().then(setUser).catch(console.error);
    }
  }, [user, setUser]);
}


// import { cache } from 'react';
// import { userService } from '@/services/userService';

// export const useUser = cache(() => userService.getUser());


// hooks/useUserLoader.ts
// "use client";

// import { useEffect, useState } from 'react';
// import { userService } from '@/services/userService';
// import { useUserDataStore } from '@/stores/use-data-store';

// export function useUserLoader() {
//   const { user, setUser } = useUserDataStore();
//   const [isLoading, setIsLoading] = useState(!user);

//   useEffect(() => {
//     const load = async () => {
//       try {
//         if (!user) {
//           const userData = await userService.getUser();
//           setUser(userData);
//         }
//       } catch (error) {
//         console.error('Erro ao carregar usuário:', error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     load();
//   }, [user, setUser]);

//   return { isLoading, user };
// }
