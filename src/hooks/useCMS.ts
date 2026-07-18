import { useState, useEffect } from 'react';
import { cmsService, CMSContent, defaultCMSContent } from '../services/cmsService';

export function useCMS() {
  const [cmsContent, setCmsContent] = useState<CMSContent>(defaultCMSContent);
  const [loading, setLoading] = useState(true);
  const [isPreview, setIsPreview] = useState(false);

  useEffect(() => {
    // Determine if we are in preview/draft mode
    const queryParams = new URLSearchParams(window.location.search);
    const hasPreviewParam = queryParams.get('preview') === 'true';
    const hasLocalPreview = localStorage.getItem('hds_cms_preview_mode') === 'active';
    const isPreviewActive = hasPreviewParam || hasLocalPreview;

    setIsPreview(isPreviewActive);

    async function fetchContent() {
      try {
        const content = await cmsService.getCMSContent(isPreviewActive ? 'draft' : 'published');
        setCmsContent(content);
      } catch (err) {
        console.error('Failed to load CMS content in useCMS hook:', err);
        setCmsContent(defaultCMSContent);
      } finally {
        setLoading(false);
      }
    }

    fetchContent();

    // Listen to custom event for real-time preview updates in the iframe/editor
    const handleCMSUpdate = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail) {
        setCmsContent(customEvent.detail);
      }
    };

    window.addEventListener('hds_cms_preview_update', handleCMSUpdate);
    return () => {
      window.removeEventListener('hds_cms_preview_update', handleCMSUpdate);
    };
  }, []);

  return { cmsContent, loading, isPreview };
}
