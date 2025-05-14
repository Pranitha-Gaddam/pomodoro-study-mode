import React, { useEffect, useRef, useState } from 'react';
import { MdMusicNote } from 'react-icons/md';
import { IoVolumeLow } from 'react-icons/io5';

const musicOptions = {
  Lofi: 'q0ff3e-A7DY',
  Rain: 'IUfA_J4eES0',
  Fire: 'UgHKb_7884o',
  Nature: '29XymHesxa0',
  Piano: 'sAcj8me7wGI',
};

const BackgroundMusic = () => {
  const [showMusic, setShowMusic] = useState(false);
  const [volume, setVolume] = useState(50);
  const [currentTrack, setCurrentTrack] = useState(null);
  const playerRef = useRef(null);

  // Load YT API only once
  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      document.body.appendChild(tag);
    } else {
      window.onYouTubeIframeAPIReady();
    }

    window.onYouTubeIframeAPIReady = () => {
      // Do nothing here – we'll init player when the user clicks play
    };

    return () => {
      // Clean up player on unmount
      if (playerRef.current) {
        playerRef.current.destroy();
        playerRef.current = null;
      }
    };
  }, []);

  const playTrack = (id) => {
    setCurrentTrack(id);
    if (!window.YT || !window.YT.Player) return;

    if (playerRef.current) {
      playerRef.current.loadVideoById({ videoId: id, suggestedQuality: 'small' });
    } else {
      playerRef.current = new window.YT.Player(`yt-player`, {
        height: '0',
        width: '0',
        videoId: id,
        events: {
          onReady: (event) => {
            event.target.setVolume(volume);
            event.target.playVideo();
          },
        },
      });
    }
  };

  const stopTrack = () => {
    if (playerRef.current && playerRef.current.stopVideo) {
      playerRef.current.stopVideo();
    }
    setCurrentTrack(null);
  };

  const handleVolumeChange = (e) => {
    const newVol = parseInt(e.target.value, 10);
    setVolume(newVol);
    if (playerRef.current) {
      playerRef.current.setVolume(newVol);
    }
  };

  return (
    <div className="absolute bottom-5 left-5 z-50">
      <button
        className="text-white opacity-80 hover:opacity-90 -mr-4 shadow-2xl p-3 pr-6"
        onClick={() => setShowMusic(!showMusic)}
      >
        <MdMusicNote size={30} />
      </button>

      {showMusic && (
        <div className="absolute bottom-16 left-0 bg-white glass-effect shadow-lg rounded-lg p-1 w-45 ">
          <div className="flex items-center justify-between p-2 mb-2">
            <span className="text-xs text-white"><IoVolumeLow size={22} /></span>
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={handleVolumeChange}
              className="w-24 accent-blue-400"
            />
            <span className="text-md text-white">{volume}</span>
          </div>

          <div className="flex flex-wrap gap-2 ">
            {Object.keys(musicOptions).map((type) => (
              <button
                key={type}
                onClick={() => playTrack(musicOptions[type])}
                className={`h-12 w-20 rounded-md border-2 transition ${
                  currentTrack === musicOptions[type]
                    ? 'border-blue-400 shadow-lg'
                    : 'border-gray-500 hover:border-gray-400'
                }`}
                style={{
                  backgroundImage: `url(/images/Genres/${type.toLowerCase()}.jpg)`,
                  backgroundSize: 'cover',
                }}
              >
                <div className="h-full w-full rounded-md lofi-overlay flex items-center justify-center">
                  <span className="text-white text-md">{type}</span>
                </div>
              </button>
            ))}
            <button
              onClick={stopTrack}
              className={`h-12 w-20 rounded-md border-2 transition bg-black ${
                currentTrack === null
                  ? 'border-blue-400 shadow-lg'
                  : 'border-gray-500 hover:border-gray-400'
              }`}
            >
              <div className="h-full w-full rounded-md bg-black bg-opacity-30 flex items-center justify-center">
                <span className="text-white text-md">None</span>
              </div>
            </button>
          </div>
        </div>
      )}
      {/* This hidden div is where YouTube iframe mounts */}
      <div id="yt-player" style={{ display: 'none' }}></div>
    </div>
  );
};

export default BackgroundMusic;