import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { SITE_NAME, canonicalFor, absoluteImage, metaForPath } from '../../../seo/siteMeta';

// Default title, description, canonical, Open Graph, and Twitter tags for the
// current route. Pages that know more (a Market Note, for example) render their
// own <Helmet> further down the tree, and those tags win.
const PageMeta = () => {
  const { pathname } = useLocation();
  const m = metaForPath(pathname);
  const url = canonicalFor(pathname);
  const image = absoluteImage(m.image);

  return (
    <Helmet>
      <title>{m.title}</title>
      <meta name="description" content={m.description} />
      <link rel="canonical" href={url} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:type" content={m.type || 'website'} />
      <meta property="og:title" content={m.title} />
      <meta property="og:description" content={m.description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={m.title} />
      <meta name="twitter:description" content={m.description} />
      <meta name="twitter:image" content={image} />
      {m.noindex && <meta name="robots" content="noindex" />}
    </Helmet>
  );
};

export default PageMeta;
