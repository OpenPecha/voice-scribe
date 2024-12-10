import { prisma } from "~/db.server";
import { json, ActionFunction, redirect } from "@remix-run/node";
import { useFetcher } from "@remix-run/react";
import { Role } from "@prisma/client"; 

// Action function to handle role change for users
export let action: ActionFunction = async ({ request }) => {
  const formData = new URLSearchParams(await request.text());
  const userId = formData.get("userId");
  const newRole = formData.get("role");

  console.log(`userId: ${userId}, newRole: ${newRole}`);

  if (
    userId &&
    newRole &&
    Object.values(Role).includes(newRole as Role)
  ) {
    await prisma.user.update({
      where: { id: userId },
      data: { role: newRole as Role },
    });
  }

  return redirect("/route/admin/users");
};

interface User {
  id: string; 
  username: string;
  email: string;
  role: string;
}

interface UsersPageProps {
  users: User[];
}

export default function UsersPage({ users }: UsersPageProps) {
  const fetcher = useFetcher();

  return (
    <div>
      <h1>Users</h1>
      <table className="table-auto w-full">
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                <fetcher.Form method="post" action="/routes/admin/users">
                  <input type="hidden" name="userId" value={user.id} />
                  <select
                    name="role"
                    defaultValue={user.role}
                    className="bg-white border border-gray-300 rounded p-1"
                  >
                    <option value={Role.USER}>User</option>
                    <option value={Role.ADMIN}>Admin</option>
                    <option value={Role.ANNOTATOR}>Annotator</option>
                    <option value={Role.REVIEWER}>Reviewer</option>
                  </select>
                  <button type="submit" className="ml-2 bg-blue-500 text-white p-1 rounded">
                    Change Role
                  </button>
                </fetcher.Form>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
