/**
 * ユーザー関連のAPIエンドポイント
 * 
 * このファイルでは、ユーザー情報の取得や新規ユーザーの作成を行うAPIを定義しています。
 * SvelteKitのAPI Routes機能を使用しており、
 * ファイル名の+server.tsは、このファイルがAPIエンドポイントであることを示しています。
 * 
 * エンドポイント一覧：
 * - GET /api/users - ユーザー一覧の取得
 * - POST /api/users - 新規ユーザーの作成
 */

import { json } from '@sveltejs/kit';
import { getUsers, createUser } from '$lib/bigquery';
import type { RequestEvent } from '@sveltejs/kit';

/**
 * GETリクエストハンドラー - ユーザー一覧の取得
 * 
 * BigQueryに保存されているすべてのユーザー情報を取得します。
 * 
 * @returns {Promise<Response>} 
 * - 成功時: ユーザー情報の配列をJSON形式で返します
 * - エラー時: 500エラーとエラーメッセージを返します
 */
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

/**
 * POSTリクエストハンドラー - 新規ユーザーの作成
 * 
 * リクエストボディから名前とグループIDを受け取り、新しいユーザーを作成します。
 * 
 * @param {RequestEvent} パラメータ
 * - request: リクエスト情報を含むオブジェクト
 *   - リクエストボディの形式:
 *     {
 *       "name": "ユーザー名",
 *       "groupId": "グループID"
 *     }
 * 
 * @returns {Promise<Response>}
 * - 成功時: 作成されたユーザー情報をJSON形式で返します
 * - バリデーションエラー時: 400エラーとエラーメッセージを返します
 * - その他のエラー時: 500エラーとエラーメッセージを返します
 */
export async function POST({ request }: RequestEvent) {
  try {
    const { name, groupId } = await request.json();
    
    // 必須パラメータのバリデーション
    // 名前とグループIDが両方とも提供されていることを確認
    if (!name || !groupId) {
      return new Response(JSON.stringify({ error: 'Name and group ID are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // グループIDを数値型に変換して新規ユーザーを作成
    const newUser = await createUser(name, parseInt(groupId));
    return json(newUser);
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to create user' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
