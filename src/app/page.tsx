import { fetchMangaPages } from "@/lib/github";
import MangaViewer from "@/components/MangaViewer";

// ページ生成時に静的にデータを取得（GitHub Pages用）
// revalidateを設定して、一定時間ごとに更新を確認するようにすることも可能だが、
// GitHub Pagesへのデプロイ時にビルドされるため、基本はビルド時のデータになる。
export const dynamic = "force-static";

export default async function Home() {
  const pages = await fetchMangaPages();

  return (
    <main className="min-h-screen bg-cream-100 text-gray-800 font-sans">
      {pages.length > 0 ? (
        <MangaViewer pages={pages} />
      ) : (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
          <h1 className="text-4xl font-bold mb-4 text-pastel-pink">ぐだぐだ日記</h1>
          <p className="text-lg text-gray-600 mb-8">
            まだ漫画が投稿されていません。<br />
            GitHub Issuesに `manga` ラベルを付けて画像を投稿してください。
          </p>
          <div className="p-6 bg-white rounded-lg shadow-md max-w-md">
            <h2 className="text-xl font-semibold mb-2">設定状況</h2>
            <ul className="text-left text-sm space-y-2">
              <li>Owner: {process.env.NEXT_PUBLIC_GITHUB_OWNER || "未設定 (デフォルト)"}</li>
              <li>Repo: {process.env.NEXT_PUBLIC_GITHUB_REPO || "未設定 (デフォルト)"}</li>
            </ul>
          </div>
        </div>
      )}
    </main>
  );
}
