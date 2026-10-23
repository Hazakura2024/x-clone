import { Box } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Home() {
  return (
    <div className="h-screen flex justify-between items-center  p-10">
      <div className="max-w-90">
        <div className=" flex flex-col items-stretch gap-10">
          <div className="font-bold text-6xl">すべての話題が、ここに。</div>
          <div className="space-y-4">
            <Button className="w-full rounded-full h-12">
              <Box></Box>
              <span>電話番号で続ける</span>
            </Button>
            <Button variant="outline" className="w-full rounded-full h-12">
              <Box></Box>
              <span>Googleで続ける</span>
            </Button>
            <Button variant="outline" className="w-full rounded-full h-12">
              <Box></Box>
              <span>Appleで続ける</span>
            </Button>
            <div className="flex items-center">
              <div className="bg-gray-200 h-px flex-1"></div>
              <span className="text-gray-500">または</span>
              <div className="bg-gray-200 h-px flex-1"></div>
            </div>
            <Input
              placeholder="mock:メールアドレス"
              className="h-16 text-lg"
            ></Input>
            <Input
              placeholder="mock:パスワード"
              className="h-16 text-lg"
            ></Input>
            <Button variant="secondary" className="w-full rounded-full h-12">
              <span>続ける</span>
            </Button>
            <div className="text-center text-xs text-gray-500">
              続行することで、利用規約、プライバシーポリシーおよびcookieの使用に同意したものとみなされます。
            </div>
          </div>
        </div>
      </div>
      <div className="flex-1">
        <Box className="w-full h-full"></Box>
      </div>
    </div>
  );
}
