import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import type { QueryClient } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { useUserQuery } from "@/api/user/user.query";

interface MyRouterContext {
  queryClient: QueryClient;
}

const Component = () => {

  const { useGetLoggedUser } = useUserQuery();

  const { data: user } = useGetLoggedUser();

  return (
    <main className="">
      <Toaster richColors />
      <Outlet />
    </main>
  )
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: Component,
});
