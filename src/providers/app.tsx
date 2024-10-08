import * as React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
import { HelmetProvider } from 'react-helmet-async';
// import { ReactQueryDevtools } from 'react-query/devtools';
// import { QueryClientProvider } from 'react-query';
const ErrorFallback = () => {
  return (
    <div
      className="text-red-500 w-screen h-screen flex flex-col justify-center items-center"
      role="alert"
    >
      <h2 className="text-lg font-semibold">Ooops, something went wrong :( </h2>
      <button className="mt-4" onClick={() => window.location.assign(window.location.origin)}>
        Refresh
      </button>
    </div>
  );
};

type AppProviderProps = {
  children: React.ReactNode;
};

export const AppProvider = ({ children }: AppProviderProps) => {
  return (
    <React.Suspense
      fallback={
        <div className="flex items-center justify-center w-screen h-screen">
          {/* <Spinner size="xl" /> */}
          <h1>Loading</h1>
        </div>
      }
    >
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <HelmetProvider>
          {/* <QueryClientProvider client={queryClient}> */}
            {/* {process.env.NODE_ENV !== 'test' && <ReactQueryDevtools />} */}
            {/* <AuthProvider> */}
              <Router>{children}</Router>
            {/* </AuthProvider> */}
          {/* </QueryClientProvider> */}
        </HelmetProvider>
      </ErrorBoundary>
    </React.Suspense>
  );
};