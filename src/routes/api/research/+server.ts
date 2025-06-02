/**
 * リサーチ関連のAPIエンドポイント
 * 
 * このファイルでは、リサーチ情報の取得や新規リサーチの作成を行うAPIを定義しています。
 * 
 * エンドポイント一覧：
 * - GET /api/research - リサーチ一覧の取得
 * - POST /api/research - 新規リサーチの作成
 */

import { json } from '@sveltejs/kit';
import { getResearch, createResearch } from '$lib/bigquery';
import type { RequestEvent } from '@sveltejs/kit';

/**
 * GETリクエストハンドラー - リサーチ一覧の取得
 * 
 * BigQueryに保存されているすべてのリサーチ情報を取得します。
 * 
 * @returns {Promise<Response>} 
 * - 成功時: リサーチ情報の配列をJSON形式で返します
 * - エラー時: 500エラーとエラーメッセージを返します
 */
export async function GET() {
  try {
    const research = await getResearch();
    return json(research);
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch research data' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

/**
 * POSTリクエストハンドラー - 新規リサーチの作成
 * 
 * リクエストボディから値を受け取り、新しいリサーチを作成します。
 * 
 * @param {RequestEvent} パラメータ
 * - request: リクエスト情報を含むオブジェクト
 *   - リクエストボディの形式:
 *     {
 *       "value": "入力値"
 *     }
 * 
 * @returns {Promise<Response>}
 * - 成功時: 作成されたリサーチ情報をJSON形式で返します
 * - バリデーションエラー時: 400エラーとエラーメッセージを返します
 * - その他のエラー時: 500エラーとエラーメッセージを返します
 */
export async function POST({ request }: RequestEvent) {
  try {
    const { value } = await request.json();
    
    // 必須パラメータのバリデーション
    if (!value) {
      return new Response(JSON.stringify({ error: 'Value is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const newResearch = await createResearch(value);
    return json(newResearch);
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to create research' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
