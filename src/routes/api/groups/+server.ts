/**
 * グループ関連のAPIエンドポイント
 * 
 * このファイルでは、グループ情報の取得を行うAPIを定義しています。
 * SvelteKitのAPI Routes機能を使用しており、
 * ファイル名の+server.tsは、このファイルがAPIエンドポイントであることを示しています。
 * 
 * エンドポイント一覧：
 * - GET /api/groups - グループ一覧の取得
 */

import { json } from '@sveltejs/kit';
import { getGroups } from '$lib/bigquery';

/**
 * GETリクエストハンドラー - グループ一覧の取得
 * 
 * BigQueryに保存されているすべてのグループ情報を取得します。
 * ユーザー登録時のグループ選択などで使用されます。
 * 
 * @returns {Promise<Response>} 
 * - 成功時: グループ情報の配列をJSON形式で返します
 *   - 返却データの形式:
 *     [
 *       {
 *         "id": グループID (number),
 *         "name": グループ名 (string)
 *       },
 *       ...
 *     ]
 * - エラー時: 500エラーとエラーメッセージを返します
 */
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
