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
              className="flex h-[52px] w-[52px] items-center justify-center rounded-b-full"
            >
              <Menu size={40} />
            </a>
            <nav className="flex flex-col gap-1">
              <Link href="">
                <House></House>
              </Link>
              <Link href="">
                <Bell></Bell>
              </Link>
              <Link href="">
                <Mail></Mail>
              </Link>
              <Link href="">
                <Bookmark></Bookmark>
              </Link>

              <Link href="">
                <UserRound></UserRound>
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
