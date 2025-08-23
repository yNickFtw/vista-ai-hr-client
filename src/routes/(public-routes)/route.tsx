import { Header } from "@/components/Header";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/(public-routes)")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <div className="w-full px-4">
        <Header />
      </div>
      <Outlet />
    </>
  );
}
