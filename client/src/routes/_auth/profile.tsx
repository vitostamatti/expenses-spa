import { userQueryOptions } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const Route = createFileRoute("/_auth/profile")({
  component: Profile,
});

function Profile() {
  const { isPending, error, data } = useQuery(userQueryOptions);
  if (isPending) return "Loading...";

  if (error) return "An error has occurred: " + error.message;

  return (
    <div className="p-2">
      <Avatar>
        <AvatarImage src={data.user.picture ?? undefined} />
        <AvatarFallback>{data.user.given_name[0]}</AvatarFallback>
      </Avatar>
      <a href="/api/logout">Logout</a>
    </div>
  );
}
