import { useCatalog } from './hooks/useCatalog';
import { BundleProvider } from './store/BundleProvider';
import { Builder } from './components/builder/Builder';
import { ReviewPanel } from './components/review/ReviewPanel';

export default function App() {
  const { data: catalog, isLoading, isError, refetch } = useCatalog();

  if (isLoading) {
    return (
      <div className="grid min-h-screen place-items-center text-gray-600">
        <p className="animate-pulse text-sm">Loading your builder…</p>
      </div>
    );
  }

  if (isError || !catalog) {
    return (
      <div className="grid min-h-screen place-items-center px-6 text-center">
        <div>
          <p className="text-lg font-semibold text-obsidian">Couldn&rsquo;t load the catalog.</p>
          <p className="mt-1 text-sm text-gray-600">Make sure the API server is running (npm run dev:server).</p>
          <button
            type="button"
            onClick={() => refetch()}
            className="mt-4 rounded-lg bg-wyze-purple px-4 py-2 text-sm font-semibold text-white"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <BundleProvider catalog={catalog}>
      <div className="mx-auto max-w-[1213px] px-0 py-6 sm:px-6 sm:py-10 lg:px-0 xl:max-w-[1197px]">
        <div className="grid grid-cols-1 gap-0 md:gap-6 lg:gap-[34px] xl:grid-cols-[768px_399px] xl:gap-[30px]">
          <main className="min-w-0 md:mx-auto md:w-full md:max-w-[900px] wide:max-w-none">
            <Builder />
          </main>
          <div className="md:mx-auto md:w-full md:max-w-[900px] wide:max-w-none xl:sticky xl:top-6 xl:self-start">
            <ReviewPanel />
          </div>
        </div>
      </div>
    </BundleProvider>
  );
}
