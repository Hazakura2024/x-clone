import styles from "./page.module.css";
import {
  Search,
  Menu,
  House,
  Bell,
  Mail,
  Bookmark,
  UserRound,
} from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <div className=" mx-auto flex max-w-[1280px] justify-center">
        <header className="border-2 h-screen sticky top-0 px-2 w-[88px] shrink-0 xl:w-[275px]">
          <div className="flex flex-col items-center gap-4">
            <a
              href=""
              className="flex h-[52px] w-[52px] items-center justify-center rounded-full hover:bg-gray-100 xl:pr-6"
            >
              <Menu size={40} />
            </a>
            <nav className="flex flex-col gap-1">
              <Link
                href=""
                className="flex w-fit items-center gap-5 rounded-full p-3 text-xl hover:bg-gray-100 xl:pr-6"
              >
                <House></House>
                <span className="hidden xl:inline">ホーム</span>
              </Link>
              <Link
                href=""
                className="flex w-fit items-center gap-5 rounded-full p-3 text-xl hover:bg-gray-100 xl:pr-6"
              >
                <Bell></Bell>
                <span className="hidden xl:inline">通知</span>
              </Link>
              <Link
                href=""
                className="flex w-fit items-center gap-5 rounded-full p-3 text-xl hover:bg-gray-100 xl:pr-6"
              >
                <Mail></Mail>
                <span className="hidden xl:inline">メッセージ</span>
              </Link>
              <Link
                href=""
                className="flex w-fit items-center gap-5 rounded-full p-3 text-xl hover:bg-gray-100 xl:pr-6"
              >
                <Bookmark></Bookmark>
                <span className="hidden xl:inline">ブックマーク</span>
              </Link>
              <Link
                href=""
                className="flex w-fit items-center gap-5 rounded-full p-3 text-xl hover:bg-gray-100 xl:pr-6"
              >
                <UserRound></UserRound>
                <span className="hidden xl:inline">プロフィール</span>
              </Link>
            </nav>
          </div>
        </header>
        <main className="border-gray-200 w-full h-screen">メイン</main>
        <aside className="border-2 sticky top-0 hidden lg:block  px-6  w-[350px] shrink-0 h-screen">
          右ナビ
        </aside>
      </div>
    </div>
  );
}
