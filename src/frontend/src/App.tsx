import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { Suspense, lazy } from "react";
import { Layout } from "./components/Layout";
import { Toaster } from "./components/ui/sonner";

const HomePage = lazy(() =>
  import("./pages/Home").then((m) => ({ default: m.HomePage })),
);
const SpinPage = lazy(() =>
  import("./pages/Spin").then((m) => ({ default: m.SpinPage })),
);
const QuizPage = lazy(() =>
  import("./pages/Quiz").then((m) => ({ default: m.QuizPage })),
);
const CheckinPage = lazy(() =>
  import("./pages/Checkin").then((m) => ({ default: m.CheckinPage })),
);
const WithdrawPage = lazy(() =>
  import("./pages/Withdraw").then((m) => ({ default: m.WithdrawPage })),
);

const rootRoute = createRootRoute({
  component: () => (
    <Layout>
      <Suspense fallback={<PageLoader />}>
        <Outlet />
      </Suspense>
      <Toaster position="top-center" richColors />
    </Layout>
  ),
});

function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-primary/20 coin-glow animate-spin flex items-center justify-center text-2xl">
          🪙
        </div>
        <p className="text-muted-foreground text-sm">Loading...</p>
      </div>
    </div>
  );
}

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});
const spinRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/spin",
  component: SpinPage,
});
const quizRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/quiz",
  component: QuizPage,
});
const checkinRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/checkin",
  component: CheckinPage,
});
const withdrawRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/withdraw",
  component: WithdrawPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  spinRoute,
  quizRoute,
  checkinRoute,
  withdrawRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
