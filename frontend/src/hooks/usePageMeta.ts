import { useEffect } from 'react';

interface PageMetaProps {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
}

export const usePageMeta = ({
  title,
  description,
  keywords,
  image,
  url,
  type = 'website',
}: PageMetaProps) => {
  useEffect(() => {
    // Titre
    document.title = `${title} | Cuisine du cinéma`;

    // Meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', description);
    }

    // Meta keywords
    if (keywords) {
      let metaKeywords = document.querySelector('meta[name="keywords"]');
      if (!metaKeywords) {
        metaKeywords = document.createElement('meta');
        metaKeywords.setAttribute('name', 'keywords');
        document.head.appendChild(metaKeywords);
      }
      metaKeywords.setAttribute('content', keywords);
    }

    // Open Graph
    const updateOGTag = (property: string, content: string) => {
      let tag = document.querySelector(`meta[property="${property}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('property', property);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    };

    updateOGTag('og:title', `${title} | Cuisine du cinéma`);
    updateOGTag('og:description', description);
    updateOGTag('og:type', type);
    updateOGTag('og:url', url || window.location.href);

    if (image) {
      updateOGTag('og:image', image);
      updateOGTag('og:image:alt', title);
    }

    // Twitter Card
    const updateTwitterTag = (name: string, content: string) => {
      let tag = document.querySelector(`meta[name="${name}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('name', name);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    };

    updateTwitterTag('twitter:card', 'summary_large_image');
    updateTwitterTag('twitter:title', `${title} | Cuisine du cinéma`);
    updateTwitterTag('twitter:description', description);

    if (image) {
      updateTwitterTag('twitter:image', image);
    }

    return () => {
      // Cleanup: restaurer les valeurs par défaut
      document.title = 'Recettes inspirées de films | Cuisine du cinéma';
    };
  }, [title, description, keywords, image, url, type]);
};
