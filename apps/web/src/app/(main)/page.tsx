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
  CircleEllipsis,
  MessageCircle,
  Heart,
  Repeat2,
  Upload,
  FaceSlightlySmiling,
  Box,
  SquarePen,
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
      <div className=" mx-auto flex max-w-[1280px] justify-center ">
        <div className="flex-1"></div>
        <header className="h-screen sticky top-0 p-2  w-[100px] shrink-0 xl:w-[275px] flex flex-col justify-between ">
          <div className="flex flex-col items-center xl:items-start gap-2">
            <Link
              href=""
              className="flex size-12 items-center justify-center rounded-full transition-colors hover:bg-gray-100"
            >
              <Box className="size-8"></Box>
            </Link>
            <nav className="flex flex-col gap-1">
              <Link
                href=""
                className="flex w-fit items-center gap-5 rounded-full p-3 text-xl hover:bg-gray-100 xl:pr-6 truncate"
              >
                <House></House>
                <span className="hidden xl:inline font-bold">ホーム</span>
              </Link>
              <Link
                href=""
                className="flex w-fit items-center gap-5 rounded-full p-3 text-xl hover:bg-gray-100 xl:pr-6 truncate"
              >
                <Search />
                <span className="hidden xl:inline">話題を検索</span>
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
              <Link
                href=""
                className="flex w-fit items-center gap-5 rounded-full p-3 text-xl hover:bg-gray-100 xl:pr-6 truncate"
              >
                <CircleEllipsis />
                <span className="hidden xl:inline">もっと見る</span>
              </Link>
            </nav>

            <Button className="hidden xl:flex rounded-full text-lg w-54 font-bold p-6">
              ポストする
            </Button>
            <Button size="icon" className="xl:hidden rounded-full size-14">
              <SquarePen className="size-6"></SquarePen>
            </Button>
          </div>
          <div className="flex justify-center xl:justify-between items-start m-4">
            <div className="flex gap-2 items-center">
              <div className="h-10 w-10 bg-blue-500 rounded-full"></div>
              <div className="hidden xl:block">
                <div className="font-bold">学生エンジニア</div>
                <div className="text-gray-500">@SE_student_02</div>
              </div>
            </div>
            <button className="hidden xl:flex">
              <Ellipsis className="text-gray-500 h-5"></Ellipsis>
            </button>
          </div>
        </header>
        <main className="border-2 w-full max-w-[600px] h-screen overflow-y-scroll">
          <header className="sticky top-0 z-20 w-full border-b  h-12 backdrop-blur-md flex items-center">
            <button className="flex-1">
              <div className="relative">
                <span className="font-bold">おすすめ</span>
                <div className="absolute -bottom-3 w-full h-1 bg-sky-500 rounded-full"></div>
              </div>
            </button>
            <button className="flex-1">
              <div>
                <span className="text-gray-500">フォロー中</span>
              </div>
            </button>
          </header>
          <div className="">
            <div className="p-3 flex gap-2 border-y-1">
              <div>
                <div className="w-10 h-10 bg-blue-500 rounded-full"></div>
              </div>
              <div className="w-full">
                <div className="flex justify-between">
                  <div className="flex gap-2">
                    <div className="font-bold">コーヒーショップ</div>
                    <div className="text-gray-500">@Coffee_shop</div>
                    <div className="text-gray-500">15時間前</div>
                  </div>
                  <button>
                    <Ellipsis className="text-gray-500 h-5"></Ellipsis>
                  </button>
                </div>
                <div className="mb-2">
                  歸途、ハワイ大學に一寸用事があったので、ホノルルに立ち寄った。
                  　ホノルルは、二十五年前に訪ねたことがあるが、その後の發展が目ざましく、まるで隔世の感がある。戰爭中、軍事基地として、政府がうんと金を入れたのと、戰後は引きつづいて、觀光地として繁昌しているので、たいへんな發展ぶりである。
                  　小さい島で、しかも山が海の近くまでせまっているので、住宅地には、大いに困っている。丘陵地を段々に切って、ずっと山の上まで家が建て込んでいる。しかしどの家の庭にも、立木が多く、また家自身が、白、淡黄、褐色などの單色で、屋根も美しい色のものが多い。そういう家が、鮮かな緑の立木の間に點在しているので、風景をこわすというよりも、むしろ美しく手がはいったという感じである。
                  　ワイキキの濱なども、立派なホテルが立ち並んで、まるで昔の面影もない。アメリカの金持客を相手にしているらしい、豪華なものばかり賣っている店が、海岸通りに、ずっと並んでいる。氣持のよいのは、海岸が非常に綺麗になっている點で、海水浴場に見られ勝ちな、紙屑や果物の皮などは、全然落ちていない。
                  　
                </div>
                <div className=" flex w-full justify-between">
                  <button className="flex text-gray-500 items-center">
                    <MessageCircle className="h-4 " />
                    <span className="text-sm">400</span>
                  </button>
                  <button className="flex text-gray-500 items-center">
                    <Repeat2 className="h-5 " />
                    <span className="text-sm">400</span>
                  </button>
                  <button className="flex text-gray-500 items-center">
                    <Heart className="h-5" />
                    <span className="text-sm">400</span>
                  </button>
                  <div className="flex items-center gap-1">
                    <button className="flex text-gray-500">
                      <Bookmark className="h-5 " />
                    </button>
                    <button className="flex text-gray-500">
                      <Upload className="h-5 " />
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-3 flex gap-2 border-y-1">
              <div>
                <div className="rounded-full w-10 h-10 bg-blue-500"></div>
              </div>
              <div className="w-full">
                <div className="flex justify-between">
                  <div className="flex gap-2">
                    <div className="font-bold">コーヒーショップ</div>
                    <div className="text-gray-500">@Coffee_shop</div>
                    <div className="text-gray-500">15時間前</div>
                  </div>
                  <button>
                    <Ellipsis className="text-gray-500 h-5"></Ellipsis>
                  </button>
                </div>
                <div className="mb-2">
                  この島の周圍全部の渚は、ハワイ政廳の所屬になっているそうである。それで海岸近くに大ホテルが建っても、そのすぐ前の渚は、ホテルの占有に出來ない。誰でも何處の渚にも、はいって行くことが出來る。いわば全海岸線は公園になっているわけである。現在の大産業の一つは、觀光事業であるから、政廳の方でも、街を綺麗にすることには大いに力を入れている。道路なども非常に立派で、米本土の道路よりもむしろ良いくらいになっている。
                  　用事が早くすんだので、ハワイ大學の友人が、半日島の一部をドライヴしてくれた。ホノルルの街から西に一寸はなれたところに、因縁の深い眞珠灣がある。この灣は入口が非常に細く運河のような形になっているので、灣といっても、見たところは、まるで湖である。波は全然ない。鏡のような水面と、それにつづく低い平らな草原とは、どう見ても、北陸の海岸などによく見られる潟である。
                  　灣に接した平地は、たいてい芝生になっていて、子供たちが、さんさんたる常夏の陽光の下で、ボール遊びをしている。すべてが、あまりにも平和な景色であって、この「湖面」に大きい軍艦が浮んでいる姿は、一寸考えられないくらいである。道路から見えるところには、軍艦らしいものは、一隻も見られなかった。
                  　十二月八日の朝、この友人は、ホノルルの自宅であの爆音を聞いたさうである［＃「さうである」はママ］。「日曜日の朝だったので、僕は寢ていた」と言っていた。
                  底本：「百日物語」文藝春秋新社
                </div>
                <div className=" flex w-full justify-between">
                  <button className="flex text-gray-500 items-center">
                    <MessageCircle className="h-4 " />
                    <span className="text-sm">400</span>
                  </button>
                  <button className="flex text-gray-500 items-center">
                    <Repeat2 className="h-5 " />
                    <span className="text-sm">400</span>
                  </button>
                  <button className="flex text-gray-500 items-center">
                    <Heart className="h-5" />
                    <span className="text-sm">400</span>
                  </button>
                  <div className="flex items-center gap-1">
                    <button className="flex text-gray-500">
                      <Bookmark className="h-5 " />
                    </button>
                    <button className="flex text-gray-500">
                      <Upload className="h-5 " />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
        <aside className="sticky top-0 hidden lg:block px-6 w-[400px] shrink-0 h-screen overflow-y-scroll">
          <div className="flex flex-col gap-4">
            <div className="sticky top-0 bg-white z-50 pt-4">
              <Card className=" gap-2 border rounded-full py-2 px-4 focus-within:border-blue-200 focus-within:ring-2 focus-within:ring-blue-500/30">
                <div className="flex gap-2 items-center">
                  <Search className="text-gray-500"></Search>
                  <Input className="border-none bg-transparent px-2 shadow-none focus-visible:ring-0"></Input>
                </div>
              </Card>
            </div>
            <Card className="gap-0 pb-0">
              <CardHeader className="flex justify-between pb-2">
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
                    <p className="font-bold text-[16px]">映画化決定</p>
                  </div>
                  <button>
                    <Ellipsis></Ellipsis>
                  </button>
                </div>
              </CardContent>
              <CardContent className="hover:bg-gray-100 py-3">
                <div className="flex justify-between">
                  <div>
                    <p className="text-gray-500">トレンド</p>
                    <p className="text font-bold text-[16px]">PHPの脆弱性</p>
                  </div>
                  <button>
                    <Ellipsis></Ellipsis>
                  </button>
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
            <div className="text-gray-500 text-xs mb-4 leading-loose mb-40">
              利用規約 プライバシー cookie アクセシビリティ 広告について
              もっと見る
            </div>
          </div>
        </aside>
        <div className="flex-[2]"></div>
      </div>
    </div>
  );
}
