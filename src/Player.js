import "./App.css";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import PauseIcon from "@mui/icons-material/Pause";
import React, { useState } from "react";
import Navbar from "./Navbar";
import { useRef } from "react";

export default function Player({
  audioElem,
  isplaying,
  setisplaying,
  currentSong,
  setCurrentSong,
  songs,
}) {
  const clickRef = useRef();

  const PlayPause = () => {
    setisplaying(!isplaying);
  };

  const skipBack = () => {
    setisplaying(!isplaying);
    const index = songs.findIndex((x) => x.name == currentSong.name);
    if (index == 0) {
      setCurrentSong(songs[songs.length - 1]);
    } else {
      setCurrentSong(songs[index - 1]);
    }
    audioElem.current.currentTime = 0;
  };

  const skiptoNext = () => {
    setisplaying(!isplaying);
    const index = songs.findIndex((x) => x.name == currentSong.name);

    if (index == songs.length - 1) {
      setCurrentSong(songs[0]);
    } else {
      setCurrentSong(songs[index + 1]);
    }
    audioElem.current.currentTime = 0;
  };

  return (
    <div class="card">
      <div class="content">
        <div>
          <h3>
            {currentSong.name}
            <br /> <span>{currentSong.anime}</span>
          </h3>
          <br />
          <ul class="sci">
            <li className="hover:drop-shadow-[0_10px_10px_rgba(0,111,255,1)] hover:scale-90 ">
              <a onClick={skipBack}>
                <SkipPreviousIcon style={{ color: "black" }} />
              </a>
            </li>
            <li className="hover:drop-shadow-[0_10px_10px_rgba(255,95,64,1)] hover:scale-90">
              {" "}
              {!isplaying ? (
                <a onClick={PlayPause}>
                  {" "}
                  <PlayCircleIcon style={{ color: "black" }} />{" "}
                </a>
              ) : (
                <a onClick={PlayPause}>
                  {" "}
                  <PauseIcon style={{ color: "black" }} />{" "}
                </a>
              )}
            </li>
            <li className="hover:drop-shadow-[0_10px_10px_rgba(77,255,77,1)] hover:scale-90">
              <a onClick={skiptoNext}>
                <SkipNextIcon style={{ color: "black" }} />
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
