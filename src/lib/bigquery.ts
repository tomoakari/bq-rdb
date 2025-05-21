import { BigQuery } from '@google-cloud/bigquery';
import { env } from '$env/dynamic/private';

// BigQueryクライアントの初期化
const bigquery = new BigQuery({
  projectId: env.GOOGLE_CLOUD_PROJECT,
  keyFilename: env.GOOGLE_APPLICATION_CREDENTIALS
});

const dataset = env.BIGQUERY_DATASET;

// ユーザー一覧を取得する関数
export async function getUsers() {
  const query = `
    SELECT 
      u.id,
      u.name,
      u.group_id,
      g.name as group_name
    FROM \`${env.GOOGLE_CLOUD_PROJECT}.${dataset}.users\` u
    LEFT JOIN \`${env.GOOGLE_CLOUD_PROJECT}.${dataset}.groups\` g ON u.group_id = g.id
    ORDER BY u.id
  `;

  try {
    const [rows] = await bigquery.query({ query });
    return rows;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
}

// グループ一覧を取得する関数
export async function getGroups() {
  const query = `
    SELECT *
    FROM \`${env.GOOGLE_CLOUD_PROJECT}.${dataset}.groups\`
    ORDER BY id
  `;

  try {
    const [rows] = await bigquery.query({ query });
    return rows;
  } catch (error) {
    console.error('Error fetching groups:', error);
    throw error;
  }
}

// 新規ユーザーを登録する関数
export async function createUser(name: string, groupId: number) {
  // 新しいIDを取得するクエリ
  const getMaxIdQuery = `
    SELECT COALESCE(MAX(id), 0) as max_id
    FROM \`${env.GOOGLE_CLOUD_PROJECT}.${dataset}.users\`
  `;

  try {
    // 新しいIDを取得
    const [maxIdResult] = await bigquery.query({ query: getMaxIdQuery });
    const newId = maxIdResult[0].max_id + 1;

    // ユーザーを挿入
    const insertQuery = `
      INSERT INTO \`${env.GOOGLE_CLOUD_PROJECT}.${dataset}.users\` (id, name, group_id)
      VALUES (${newId}, '${name}', ${groupId})
    `;

    await bigquery.query({ query: insertQuery });
    return { id: newId, name, group_id: groupId };
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}
