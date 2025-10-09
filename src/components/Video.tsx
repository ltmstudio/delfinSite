'use client';

import React, { useEffect } from 'react';
import { initScrollAnimations } from '@/utils/animations';

const Video = () => {
  // Инициализация анимаций появления при скролле
  useEffect(() => {
    const animationObserver = initScrollAnimations();
    return () => animationObserver.disconnect();
  }, []);

  return (
    <section id="video" className="video">
      <div className="container-custom ">
        <div className="video__content">
          <div className="row">
            <div className="col-12">
              <div className="video__container animate-on-scroll" data-animation="animate-scale-in">
                <div className="video__player">
                  <div className="video__video-container">
                    <video
                      width="100%"
                      height="100%"
                      autoPlay
                      muted
                      loop
                      playsInline
                      className="video__player-element"
                    >
                      <source src="/showroom_video.mp4" type="video/mp4" />
                      Ваш браузер не поддерживает видео элемент.
                    </video>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Video;
