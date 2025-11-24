import { Octokit } from "octokit";

export interface MangaPage {
  id: string;
  url: string;
  issueId: number;
  pageIndex: number;
  title?: string;
}

const octokit = new Octokit();

// 環境変数からリポジトリ情報を取得（設定されていない場合はデモ用またはエラー）
const OWNER = process.env.NEXT_PUBLIC_GITHUB_OWNER || "miko3510i";
const REPO = process.env.NEXT_PUBLIC_GITHUB_REPO || "gudamanga";

export async function fetchMangaPages(): Promise<MangaPage[]> {
  try {
    // issueを取得（ラベル 'manga' が付いているものを古い順に）
    const { data: issues } = await octokit.rest.issues.listForRepo({
      owner: OWNER,
      repo: REPO,
      state: "open",
      labels: "manga",
      sort: "created",
      direction: "asc",
      per_page: 100, // 必要に応じてページネーション実装
    });

    const pages: MangaPage[] = [];

    for (const issue of issues) {
      if (!issue.body) continue;

      // Markdownから画像URLを抽出する正規表現
      // ![alt](url) 形式 または <img src="url"> 形式に対応
      const imageRegex = /!\[.*?\]\((.*?)\)|<img.*?src=["'](.*?)["']/g;
      let match;
      let pageIndex = 0;

      while ((match = imageRegex.exec(issue.body)) !== null) {
        const url = match[1] || match[2];
        if (url) {
          pages.push({
            id: `issue-${issue.number}-page-${pageIndex}`,
            url: url,
            issueId: issue.number,
            pageIndex: pageIndex,
            title: issue.title,
          });
          pageIndex++;
        }
      }
    }

    return pages;
  } catch (error) {
    console.error("Failed to fetch manga pages:", error);
    // モックデータを返す（開発用・API制限時用）
    return [
      {
        id: "mock-1",
        url: "https://placehold.co/600x800/FFD1DC/white?text=Page+1",
        issueId: 0,
        pageIndex: 0,
        title: "Demo Page 1",
      },
      {
        id: "mock-2",
        url: "https://placehold.co/600x800/AEC6CF/white?text=Page+2",
        issueId: 0,
        pageIndex: 1,
        title: "Demo Page 2",
      },
      {
        id: "mock-3",
        url: "https://placehold.co/600x800/77DD77/white?text=Page+3",
        issueId: 0,
        pageIndex: 2,
        title: "Demo Page 3",
      },
    ];
  }
}
