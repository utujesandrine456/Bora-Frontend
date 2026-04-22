'use client';

import { useEffect } from 'react';

export default function DynamicFavicon() {
  useEffect(() => {
    const updateFavicon = () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          const user = JSON.parse(storedUser);
          if (user.photo) {
            // Find existing favicon link
            let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
            if (!link) {
              link = document.createElement('link');
              link.rel = 'icon';
              document.getElementsByTagName('head')[0].appendChild(link);
            }
            link.href = user.photo;
            
            // Also update apple touch icon
            let appleLink = document.querySelector("link[rel='apple-touch-icon']") as HTMLLinkElement;
            if (appleLink) {
              appleLink.href = user.photo;
            }
          }
        } catch (_e) {
          // ignore
        }
      }
    };

    // Update on mount
    updateFavicon();

    // Listen for custom 'user-updated' event
    window.addEventListener('user-updated', updateFavicon);
    
    return () => {
      window.removeEventListener('user-updated', updateFavicon);
    };
  }, []);

  return null; // This component doesn't render anything visible
}
