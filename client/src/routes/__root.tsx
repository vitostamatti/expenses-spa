import { Toaster } from "@/components/ui/sonner";
import { QueryClient } from "@tanstack/react-query";
import {
  createRootRouteWithContext,
  Link,
  Outlet,
} from "@tanstack/react-router";
// import { TanStackRouterDevtools } from "@tanstack/router-devtools";

interface RootContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<RootContext>()({
  component: Root,
});

function Root() {
  return (
    <>
      <NavBar />
      <hr />
      <div className="p-2 gap-2 max-w-2xl m-auto">
        <Outlet />
      </div>
      <Toaster />
      {/* <TanStackRouterDevtools /> */}
    </>
  );
}

function NavBar() {
  return (
    <div className=" flex justify-between p-2  max-w-2xl m-auto items-baseline">
      <Link className=" text-2xl font-bold" to="/">
        Expenses Tracker
      </Link>
      <div className="p-2 flex gap-2">
        <Link to="/about" className="[&.active]:font-bold">
          About
        </Link>
        <Link to="/expenses" className="[&.active]:font-bold">
          Expenses
        </Link>
        <Link to="/create" className="[&.active]:font-bold">
          Create
        </Link>
        <Link to="/profile" className="[&.active]:font-bold">
          Profile
        </Link>
      </div>
    </div>
  );
}
