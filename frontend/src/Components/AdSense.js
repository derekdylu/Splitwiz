import React, { useEffect } from 'react';

const AdSense = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = "//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div>
      <ins className="adsbygoogle"
           style={{ display: 'block' }}
           data-ad-client="ca-pub-9248017741391316"
           data-ad-slot="f08c47fec0942fa0"
           data-ad-format="auto" />
    </div>
  );
};

export default AdSense;
