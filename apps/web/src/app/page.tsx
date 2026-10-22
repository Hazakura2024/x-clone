import styles from "./page.module.css";
import {
  Search,
  Menu,
  House,
  Bell,
  Mail,
  Bookmark,
  UserRound,
  X,
  Ellipsis,
} from "lucide-react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <div className=" mx-auto flex max-w-[1280px] justify-center">
        <header className="border-2 h-screen sticky top-0 px-2 w-[88px] shrink-0 xl:w-[275px]">
          <div className="flex flex-col gap-4">
            <a
              href=""
              className="flex h-[52px] w-[52px] items-center justify-center rounded-full hover:bg-gray-100 xl:pr-6"
            >
              <Menu size={40} />
            </a>
            <nav className="flex flex-col gap-1">
              <Link
                href=""
                className="flex w-fit items-center gap-5 rounded-full p-3 text-xl hover:bg-gray-100 xl:pr-6 truncate"
              >
                <House></House>
                <span className="hidden xl:inline">ホーム</span>
              </Link>
              <Link
                href=""
                className="flex w-fit items-center gap-5 rounded-full p-3 text-xl hover:bg-gray-100 xl:pr-6 truncate"
              >
                <Bell></Bell>
                <span className="hidden xl:inline">通知</span>
              </Link>
              <Link
                href=""
                className="flex w-fit items-center gap-5 rounded-full p-3 text-xl hover:bg-gray-100 xl:pr-6 truncate"
              >
                <Mail></Mail>
                <span className="hidden xl:inline">メッセージ</span>
              </Link>
              <Link
                href=""
                className="flex w-fit items-center gap-5 rounded-full p-3 text-xl hover:bg-gray-100 xl:pr-6 truncate"
              >
                <Bookmark></Bookmark>
                <span className="hidden xl:inline">ブックマーク</span>
              </Link>
              <Link
                href=""
                className="flex w-fit items-center gap-5 rounded-full p-3 text-xl hover:bg-gray-100 xl:pr-6 truncate"
              >
                <UserRound></UserRound>
                <span className="hidden xl:inline">プロフィール</span>
              </Link>
            </nav>
          </div>
        </header>
        <main className="border-gray-200 w-[600px] h-screen">
          <header className="sticky top-0 border-b  h-40">
            <div className="border-2 h-12 flex">
              <div role="tablist" className="flex">
                <button>おすすめ</button>
                <button>フォロー中</button>
              </div>
            </div>
          </header>
          <div></div>
        </main>
        <aside className="border-2 sticky top-0 hidden lg:block  px-6  w-[350px] shrink-0 h-screen overflow-y-scroll">
          <div className="flex flex-col gap-4">
            <div className="sticky top-0 bg-white z-50">
              <Card className="mt-4 gap-2 border rounded-full py-2 px-4 focus-within:border-blue-200 focus-within:ring-2 focus-within:ring-blue-500/30">
                <div className="flex gap-2 items-center">
                  <Search className="text-gray-500"></Search>
                  <Input className="border-none bg-transparent px-2 shadow-none focus-visible:ring-0 focus"></Input>
                </div>
              </Card>
            </div>
            <Card className="gap-0 pb-0">
              <CardHeader className="flex justify-between  pb-2">
                <h2 className="font-bold text-xl">本日のニュース</h2>
                <button className="p-1 -m-1 rounded-full hover:bg-gray-100 ">
                  <X className="w-6 h-6" />
                </button>
              </CardHeader>
              <CardContent className="hover:bg-gray-100 py-3">
                <h3 className="font-bold text-[16px]">狸の写真が人気に</h3>
                <div className="flex pt-2 items-center">
                  <div className="flex -space-x-2 ">
                    <div className="rounded-full w-5 h-5 bg-blue-500 ring-2 ring-white z-30"></div>
                    <div className="rounded-full w-5 h-5 bg-blue-500 ring-2 ring-white z-20"></div>
                    <div className="rounded-full w-5 h-5 bg-blue-500 ring-2 ring-white z-10"></div>
                  </div>
                  <div className="text-gray-500 ml-4 text-sm">
                    15時間 エンターテインメント 1235件のポスト
                  </div>
                </div>
              </CardContent>
              <CardContent className="hover:bg-gray-100 py-3">
                <h3 className="font-bold text-[16px]">
                  旅行に行くなら沖縄？北海道？
                </h3>
                <div className="flex pt-2 items-center">
                  <div className="flex -space-x-2 ">
                    <div className="rounded-full w-5 h-5 bg-blue-500 ring-2 ring-white z-30"></div>
                    <div className="rounded-full w-5 h-5 bg-blue-500 ring-2 ring-white z-20"></div>
                    <div className="rounded-full w-5 h-5 bg-blue-500 ring-2 ring-white z-10"></div>
                  </div>
                  <div className="text-gray-500 ml-4 text-sm">
                    7時間 エンターテインメント 5465件のポスト
                  </div>
                </div>
              </CardContent>
              <CardContent className="hover:bg-gray-100 py-3">
                <h3 className="font-bold text-[16px]">
                  火星探査機の計画が発表
                </h3>
                <div className="flex pt-2 items-center">
                  <div className="flex -space-x-2 ">
                    <div className="rounded-full w-5 h-5 bg-blue-500 ring-2 ring-white z-30"></div>
                    <div className="rounded-full w-5 h-5 bg-blue-500 ring-2 ring-white z-20"></div>
                    <div className="rounded-full w-5 h-5 bg-blue-500 ring-2 ring-white z-10"></div>
                  </div>
                  <div className="text-gray-500 ml-4 text-sm">
                    11時間 ニュース 6263件のポスト
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="gap-0 pb-0">
              <CardHeader className="font-bold text-xl pb-2">
                「いま」を見つけよう
              </CardHeader>
              <CardContent className="hover:bg-gray-100 py-3">
                <div className="flex justify-between">
                  <div>
                    <p className="text-gray-500">日本のトレンド</p>
                    <p className="text font-bold text-[16px]">映画化決定</p>
                  </div>
                  <Ellipsis></Ellipsis>
                </div>
              </CardContent>
              <CardContent className="hover:bg-gray-100 py-3">
                <div className="flex justify-between">
                  <div>
                    <p className="text-gray-500">トレンド</p>
                    <p className="text font-bold text-[16px]">PHPの脆弱性</p>
                  </div>
                  <Ellipsis></Ellipsis>
                </div>
              </CardContent>
              <CardContent className="hover:bg-gray-100 py-3">
                <div className="flex justify-between">
                  <div>
                    <p className="text-gray-500">九州のトレンド</p>
                    <p className="text font-bold text-[16px]">
                      ソフトバンクホークス
                    </p>
                  </div>
                  <button>
                    <Ellipsis></Ellipsis>
                  </button>
                </div>
              </CardContent>
              <CardFooter className="bg-white hover:bg-gray-100 border-none">
                <div className="text-blue-500 ">さらに表示</div>
              </CardFooter>
            </Card>
            <Card className="gap-0 pb-0">
              <CardHeader className="font-bold text-xl pb-2">
                おすすめのユーザー
              </CardHeader>
              <CardContent className="hover:bg-gray-100 py-3">
                <div className="flex justify-between">
                  <div className="flex gap-2 items-center">
                    <div className="bg-red-400 rounded-full h-8 w-8"></div>
                    <div>
                      <p className="font-bold">【公式】交通情報局</p>
                      <p className="text-gray-500">@traffic_center</p>
                    </div>
                  </div>
                  <Button className="rounded-full">フォロー</Button>
                </div>
              </CardContent>
              <CardContent className="hover:bg-gray-100 py-3">
                <div className="flex justify-between">
                  <div className="flex gap-2 items-center">
                    <div className="bg-green-400 rounded-full h-8 w-8"></div>
                    <div>
                      <p className="font-bold">映画速報</p>
                      <p className="text-gray-500">@m000vie_news</p>
                    </div>
                  </div>
                  <Button className="rounded-full">フォロー</Button>
                </div>
              </CardContent>
              <CardContent className="hover:bg-gray-100 py-3">
                <div className="flex justify-between">
                  <div className="flex gap-2 items-center">
                    <div className="bg-blue-400 rounded-full h-8 w-8"></div>
                    <div>
                      <p className="font-bold">天気予報</p>
                      <p className="text-gray-500">@weather_forecast</p>
                    </div>
                  </div>
                  <Button className="rounded-full">フォロー</Button>
                </div>
              </CardContent>
            </Card>
            <div className="text-gray-500 text-xs mb-4 leading-loose">
              利用規約 プライバシー cookie アクセシビリティ 広告について
              もっと見る
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
