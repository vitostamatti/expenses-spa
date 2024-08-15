import { userQueryOptions } from "@/lib/api";
import { createFileRoute, Outlet } from "@tanstack/react-router";

const Login = () => {
  return (
    <div>
      You have to login
      <a href="/api/login">Login</a>
    </div>
  );
};
const Component = () => {
  const { user } = Route.useRouteContext();
  if (!user) {
    return <Login />;
  }
  return <Outlet />;
};
export const Route = createFileRoute("/_auth")({
  beforeLoad: async ({ context }) => {
    const queryClient = context.queryClient;
    try {
      const data = await queryClient.fetchQuery(userQueryOptions);
      return data;
    } catch (e) {
      console.error(e);
      return { user: null };
    }
  },
  component: Component,
});
