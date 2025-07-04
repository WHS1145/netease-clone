import { Search } from "@taroify/core";
import { View } from "@tarojs/components";
import { useDidShow, useLoad } from "@tarojs/taro";
import "./index.scss";
import Taro from "@tarojs/taro";
import NCMiniPlayer from "@/components/NCMiniPlayer";
import NCPlaylist from "@/components/NCPlaylist";
import { usePlaylistStore } from "@/store/playlist";
import SongListVertical from "@/components/SongLIstVertical";
import SongListHorizental from "@/components/SongLIstHorizental";
import { useState, useRef, useEffect } from "react";
import { useSearch } from "../search/useSearch";
import { useUserStore } from "@/store/user";
import { PullRefresh } from "@taroify/core";
import { usePageScroll } from "@tarojs/taro";

export default function Index() {
  useLoad(() => {
    console.log("Page loaded.");
  });
  const { user } = useUserStore();
  const [loadStart, setLoadStart] = useState(false);

  useDidShow(() => {
    if (!user) Taro.navigateTo({ url: "/pages/login/index" });
  });

  useEffect(() => {
    if (user) {
      setLoadStart(true);
    }
  }, [user]);

  const searchRef = useRef<any>(null);

  const { playlistOpen, togglePlaylist } = usePlaylistStore();

  const [showOverlay, setShowOverlay] = useState(false);

  const handleSearchClick = () => {
    setShowOverlay(true);
  };

  const handleOverlayClick = (e) => {
    e.stopPropagation();
    setShowOverlay(false);
  };

  // 阻止遮罩层下的所有触摸事件
  const handleTouchMove = (e) => {
    e.stopPropagation();
    e.preventDefault();
  };

  const { textInput, setTextInput } = useSearch();

  const handleSearch = () => {
    setShowOverlay(false);
    Taro.navigateTo({ url: `/pages/search-result/index?q=${textInput}` });
  };

  const handleCancel = (e) => {
    if (searchRef.current) {
      searchRef.current.clear();
    }
  };

  const [pullLoading, setPullLoading] = useState(false);
  const [reachTop, setReachTop] = useState(true);
  const [reload, setReload] = useState(true);

  usePageScroll(({ scrollTop }) => setReachTop(scrollTop === 0));

  return (
    <PullRefresh
      loading={pullLoading}
      reachTop={reachTop}
      onRefresh={() => {
        console.log(reload);
        setPullLoading(true);
        setReload(!reload);
        setTimeout(() => {
          setPullLoading(false);
        }, 1000);
      }}
    >
      <Search
        className="searchIndex"
        placeholder="搜索曲目"
        onClick={handleSearchClick}
        value={textInput}
        onChange={(e) => setTextInput(e.detail.value)}
        onSearch={handleSearch}
        onCancel={handleCancel}
      />

      {showOverlay ? (
        <View
          className="overlayIndex"
          onClick={handleOverlayClick}
          onTouchMove={handleTouchMove}
          catchMove
        ></View>
      ): <></>}

      <View className="recommendTitle">{"推荐曲目"}</View>

      {loadStart ? (
        <View>
          <SongListHorizental user={user} reload={reload} />
        </View>
      ): <></>}

      <View className="liberaryTitle">{"全部歌曲"}</View>

      {loadStart ? (
        <View
          style="
        width: 90%;
        margin-left: 5%;"
        >
          <SongListVertical user={user} search={""} reload={reload} />
        </View>
      ): <></>}
      {loadStart ? <NCMiniPlayer />: <></>}
      <NCPlaylist open={playlistOpen} onClose={togglePlaylist} />
    </PullRefresh>
  );
}
