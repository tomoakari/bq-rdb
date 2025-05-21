import { json } from '@sveltejs/kit';
import { getGroups } from '$lib/bigquery';

export async function GET() {
  try {
    const groups = await getGroups();
    return json(groups);
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch groups' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
