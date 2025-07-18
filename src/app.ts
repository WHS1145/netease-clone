import { PropsWithChildren, useEffect } from "react";
import { useLaunch } from "@tarojs/taro";

import "./app.scss";
import { usePlayerStore } from "./store/player";
import { MOCK_SONGS } from "./constants/songs";
import { usePlaylistStore } from "./store/playlist";
import { useUserStore } from "./store/user";
import Taro from "@tarojs/taro";

function App({ children }: PropsWithChildren<any>) {
  useLaunch(() => {
    console.log("App launched.");
  });

  const { setSong } = usePlayerStore();
  const { playlistData } = usePlaylistStore();
  const { user } = useUserStore();

  useEffect(() => {
    if (!user) Taro.navigateTo({ url: "/pages/login/index" });
  }, [user]);

  // 播放列表有数据之后，将播放列表的第一首歌设置为 currentSong
  useEffect(() => {
    if (!playlistData.length) setSong(playlistData[0]);
  }, [playlistData]);

  // children 是将要会渲染的页面
  return children;
}

export default App;
