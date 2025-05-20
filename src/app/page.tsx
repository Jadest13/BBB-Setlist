/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const getSongId = (url: string) => {
  const regex =
    /(?:youtube\.com\/(?:.*v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const id = url.match(regex);
  return id?.[1] ?? "";
};

const getSongData = async (id: string) => {
  const res = await fetch(
    `https://www.googleapis.com/youtube/v3/videos?id=${id}&part=snippet,contentDetails&key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}&hl=ko`
  );
  const data = await res.json();
  const video = data.items[0];
  const title = video.snippet.title;
  const artist = video.snippet.channelTitle;
  const img = video.snippet.thumbnails.medium.url;
  const contentDuration = video.contentDetails.duration;
  const match = contentDuration.match(/PT(?:(\d+)M)?(?:(\d+)S)?/);
  const minutes = parseInt(match[1] || 0);
  const seconds = parseInt(match[2] || 0);
  const duration = minutes * 60 + seconds;

  return {
    title,
    artist,
    img,
    duration,
  };
};

const fetchAddSong = async (
  id: string,
  img: string,
  title: string,
  artist: string,
  duration: number,
  recommender: string
) => {
  const songData = {
    id,
    img,
    title,
    artist,
    duration,
    recommender,
    url: `https://youtu.be/${id}`,
  };
  const res = await fetch(`api/song/add`, {
    method: "POST",
    body: JSON.stringify(songData),
    cache: "no-cache",
  });
  const data = await res.json();
  return data;
};

const fetchGetSongList = async () => {
  const res = await fetch(`api/song/getList`);
  const data = await res.json();
  return data;
};

const RecentAddedSong = ({ songData }: { songData: any }) => {
  return (
    <div className="flex w-[30vw] gap-4 items-center">
      <img className="w-24 h-24 object-cover" src={songData.img} />
      <div>
        <p className="text-xl">{songData.title}</p>
        <p className="text-md">{songData.artist}</p>
        <p className="text-sm">
          {~~(songData.duration / 60)}:{songData.duration % 60} •{" "}
          {songData.recommender}
        </p>
      </div>
    </div>
  );
};

const RecentAddedSongList = ({ songList }: { songList: any[] }) => {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-bold">최근 추가된 곡</h1>
      <div className="hide-scrollbar flex w-full overflow-x-scroll whitespace-nowrap scroll">
        <div className="grid grid-flow-col grid-rows-4 gap-x-6 gap-y-2 mb-2">
          {songList.map((e, i) => {
            return <RecentAddedSong songData={e} key={i} />;
          })}
        </div>
      </div>
    </div>
  );
};

export default function Home() {
  const [isAddSongActive, setIsAddSongActive] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  const [songTitle, setSongTitle] = useState("");
  const [songArtist, setSongArtist] = useState("");
  const [songImgUrl, setSongImgUrl] = useState("");
  const [songDuration, setSongDuration] = useState(0);
  const [songRecommender, setSongRecommender] = useState("");
  const [songId, setSongId] = useState<string>("");
  const [songUrl, setSongUrl] = useState("");

  const [songList, setSongList] = useState([]);

  const closeModal = () => {
    setIsAddSongActive(false);
  };

  const getSongList = async () => {
    setSongList(await fetchGetSongList());
  };

  useEffect(() => {
    const tmp = async () => {
      const res = await fetch(`api/get/test`);
      console.log(res);
    };
    tmp();
    getSongList();

    const handleClick = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        closeModal();
      }
    };

    window.addEventListener("mousedown", handleClick);

    return () => {
      window.removeEventListener("mousedown", handleClick);
    };
  }, []);

  return (
    <div className="w-full min-h-screen flex flex-col bg-linear-to-r from-[#86007b33] to-[#2a7dfb33]">
      <div className="flex w-full px-8 py-4 bg-[#00000088]">
        <p>BBB</p>
        <div className="flex w-full justify-end gap-12 ">
          <p>TierMaker</p>
          <p>MyPage</p>
        </div>
      </div>
      <div className="flex flex-col h-full p-8 gap-8">
        <RecentAddedSongList songList={songList} />
        <h1 className="text-3xl font-bold">확정된 연습 곡</h1>
      </div>
      <div
        className="absolute right-0 bottom-0 m-6 bg-[#FFFFFF55] p-3 rounded-full"
        onClick={() => setIsAddSongActive(true)}
      >
        <Image
          aria-hidden
          src="/plus.svg"
          alt="Plus icon"
          width={24}
          height={24}
        />
      </div>
      {isAddSongActive && (
        <div className="fixed w-full h-full bg-[#00000088] flex items-center justify-center">
          <div ref={modalRef}>
            <div className="p-4 w-[480px] bg-[#FFFFFF] text-black rounded-xl items-center flex flex-col">
              {songId ? (
                <div className="relative w-full flex flex-col">
                  <img src={songImgUrl} className="w-full" />
                  <div className="w-full flex flex-col p-2">
                    <p className="text-xl font-semibold whitespace-nowrap overflow-hidden text-ellipsis">
                      {songTitle}
                    </p>
                    <div className="flex justify-between">
                      <p className="whitespace-nowrap overflow-hidden text-ellipsis">
                        {songArtist}
                      </p>
                      <input
                        placeholder="이름"
                        className="w-24 text-right outline-none text-sm"
                        value={songRecommender}
                        onChange={(e) => {
                          setSongRecommender(e.target.value);
                        }}
                      />
                    </div>
                  </div>
                  <p className=" absolute right-0 m-2 bg-[#6767ff] text-white px-3 py-1 rounded-full text-sm">
                    {~~(songDuration / 60)}:{songDuration % 60}
                  </p>
                </div>
              ) : (
                <img
                  className="opacity-10 w-48 h-48 m-16"
                  src={
                    "https://cdn0.iconfinder.com/data/icons/huge-business-icons/512/Music_notes.png"
                  }
                />
              )}
              <div className="flex w-full gap-2">
                <input
                  className="w-full px-2"
                  placeholder="음악 URL을 입력해주세요."
                  value={songUrl}
                  onChange={(e) => setSongUrl(e.target.value)}
                />
                <p
                  className="text-white bg-[#6e6eff] px-4 py-1 rounded-full"
                  onClick={async () => {
                    const id = getSongId(songUrl);
                    if (!id) return;
                    const { title, artist, img, duration } = await getSongData(
                      id
                    );
                    setSongTitle(title);
                    setSongArtist(artist);
                    setSongImgUrl(img);
                    setSongDuration(duration);
                    setSongId(id);
                  }}
                >
                  submit
                </p>
              </div>
              {songId && (
                <div
                  className="bg-[#6e6eff] w-full text-center p-2 text-white mt-4 rounded-lg"
                  onClick={async () => {
                    const res = await fetchAddSong(
                      songId,
                      songImgUrl,
                      songTitle,
                      songArtist,
                      songDuration,
                      songRecommender
                    );

                    if (!res.errorCode) {
                      setSongUrl("");
                      setSongId("");
                      setIsAddSongActive(false);
                      getSongList();
                    }
                  }}
                >
                  추가하기
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
