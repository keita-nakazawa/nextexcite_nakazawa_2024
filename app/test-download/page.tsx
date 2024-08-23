import DownloadButtons from "../components/DownloadButtons";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1>File Download Demo</h1>
      <DownloadButtons />
    </main>
  );
}
