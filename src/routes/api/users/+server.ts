import { json } from '@sveltejs/kit';
import { getUsers, createUser } from '$lib/bigquery';
import type { RequestEvent } from '@sveltejs/kit';

export async function GET() {
  try {
    const users = await getUsers();
    return json(users);
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch users' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function POST({ request }: RequestEvent) {
  try {
    const { name, groupId } = await request.json();
    
    if (!name || !groupId) {
      return new Response(JSON.stringify({ error: 'Name and group ID are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const newUser = await createUser(name, parseInt(groupId));
    return json(newUser);
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to create user' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
