import BannerTitle from '@playfast/app/shared/components/banner-title';
import ResponsiveAppBar from '@playfast/app/shared/components/responsive-appbar';
import Banner from '@playfast/assets/images/banner.png';
import React from 'react';

/* ––
 * –––– Component declaration
 * –––––––––––––––––––––––––––––––––– */
export const Header = () => {
  /* –– Render
   * –––––––––––––––––––––––––––––––––– */
  return (
    <>
      <ResponsiveAppBar></ResponsiveAppBar>
      <BannerTitle title="CREÁ TUS PROPIOS" description="RETOS" image={Banner}></BannerTitle>
    </>
  );
};
