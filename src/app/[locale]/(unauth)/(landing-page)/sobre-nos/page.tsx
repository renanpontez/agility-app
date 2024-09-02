import React from 'react';

import Hero from '@/components/Hero';

export async function generateMetadata() {
  return {
    title: 'Sobre Nós - Agility Creative',

  };
}

const AboutUsPage: React.FC = () => {
  return (
    <>

      <Hero
        mediaType="video"
        mediaSrc="https://cdn2.hubspot.net/hubfs/6436815/home-video.mp4"
        style="custom-height"
        videoProps={{ autoPlay: true, loop: true, muted: true, poster: 'https://media.cleanshot.cloud/media/31388/419LxoWlUd6cNz0SXcYoiiMVSKjZR3BffGTVWHjK.jpeg?Expires=1725224290&Signature=WJQfDTU7kg7R6Y78mGl-ylDgJRjReocUGaMd~D9~xQpdHjcj4q8ztAz4oSLwhZeCy6Ki6IzFawTP1WQcpHKPkiD1u~lrBviIPNkffT6wz0tRKPJ0rMh3Pv-Jse53h4Nwf3zW5VdlsVewRx6RxKYyPyLT8NE3XyxWX6t5gdxLsx4m0MUM0Qc30kz1m-HY9SAl5klw96GTPodqrcFRMbleZ8TPRjmgB95OTsIRqBIn2tkWMIc0uTs5be-nCf3JM0sjoT7pBAy59zr6L2G-9MQxEcyzIh~yvIJ0GBFrNIKmQt1NTslbGE5GMMJmLJIB9OFC8vYzstpZuW7Qinakph4UiQ__&Key-Pair-Id=K269JMAT9ZF4GZ' }}
        className="h-[80vh]"
      />

      <h1>Sobre nós</h1>
      <a href="/">voltar</a>
    </>
  );
};

export default AboutUsPage;
