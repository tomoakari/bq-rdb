/**
 * Google BigQueryとの連携を行うモジュール
 * 
 * このファイルでは、BigQueryとの接続設定や、
 * データベースとのやり取りを行う関数を定義しています。
 * 
 * @module bigquery
 */

import { BigQuery } from '@google-cloud/bigquery';
import { env } from '$env/dynamic/private';

/**
 * BigQueryクライアントの初期化
 * 
 * GCPのプロジェクトIDと認証情報を使用してBigQueryクライアントを作成します。
 * 環境変数から必要な設定を読み込みます：
 * - GOOGLE_CLOUD_PROJECT: GCPのプロジェクトID
 * - GOOGLE_APPLICATION_CREDENTIALS: 認証情報を含むJSONファイルのパス
 */
const bigquery = new BigQuery({
  projectId: env.GOOGLE_CLOUD_PROJECT,
  keyFilename: env.GOOGLE_APPLICATION_CREDENTIALS
});

const dataset = env.BIGQUERY_DATASET;

/**
 * ユーザー一覧を取得する関数
 * 
 * BigQueryからユーザー情報とそれに紐づくグループ情報を取得します。
 * LEFT JOINを使用してグループ情報も同時に取得しています。
 * 
 * @returns {Promise<Array>} ユーザー情報の配列
 * - id: ユーザーID
 * - name: ユーザー名
 * - group_id: 所属グループのID
 * - group_name: 所属グループの名前
 * @throws {Error} クエリ実行時にエラーが発生した場合
 */
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

/**
 * グループ一覧を取得する関数
 * 
 * BigQueryからすべてのグループ情報を取得します。
 * グループはIDの昇順でソートされます。
 * 
 * @returns {Promise<Array>} グループ情報の配列
 * - id: グループID
 * - name: グループ名
 * @throws {Error} クエリ実行時にエラーが発生した場合
 */
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

/**
 * 新規ユーザーを登録する関数
 * 
 * 以下の手順でユーザーを登録します：
 * 1. 現在の最大ユーザーIDを取得
 * 2. 新しいIDを生成（最大ID + 1）
 * 3. 新しいユーザー情報をテーブルに挿入
 * 
 * @param {string} name - 登録するユーザーの名前
 * @param {number} groupId - ユーザーが所属するグループのID
 * @returns {Promise<Object>} 作成されたユーザーの情報
 * @throws {Error} ユーザー作成時にエラーが発生した場合
 */
export async function createUser(name: string, groupId: number) {
  // 新しいユーザーIDを取得するクエリ
  // COALESCE関数を使用して、テーブルが空の場合は0を返すようにしています
  const getMaxIdQuery = `
    SELECT COALESCE(MAX(id), 0) as max_id
    FROM \`${env.GOOGLE_CLOUD_PROJECT}.${dataset}.users\`
  `;

  try {
    // 現在の最大IDを取得し、新しいIDを生成
    const [maxIdResult] = await bigquery.query({ query: getMaxIdQuery });
    const newId = maxIdResult[0].max_id + 1;

    // 新しいユーザー情報をテーブルに挿入
    // 生成したID、入力された名前、グループIDを使用
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

/**
 * リサーチ一覧を取得する関数
 * 
 * BigQueryからすべてのリサーチ情報を取得します。
 * IDの昇順でソートされます。
 * 
 * @returns {Promise<Array>} リサーチ情報の配列
 * @throws {Error} クエリ実行時にエラーが発生した場合
 */
export async function getResearch() {
  const query = `
    SELECT *
    FROM \`${env.GOOGLE_CLOUD_PROJECT}.${dataset}.research\`
    ORDER BY id
  `;

  try {
    const [rows] = await bigquery.query({ query });
    return rows;
  } catch (error) {
    console.error('Error fetching research:', error);
    throw error;
  }
}

/**
 * 新規リサーチを登録する関数
 * 
 * @param {string} value - 登録する値（name1~name9に同じ値が設定されます）
 * @returns {Promise<Object>} 作成されたリサーチの情報
 * @throws {Error} リサーチ作成時にエラーが発生した場合
 */
export async function createResearch(value: string) {
  const getMaxIdQuery = `
    SELECT COALESCE(MAX(id), 0) as max_id
    FROM \`${env.GOOGLE_CLOUD_PROJECT}.${dataset}.research\`
  `;

  try {
    const [maxIdResult] = await bigquery.query({ query: getMaxIdQuery });
    const newId = maxIdResult[0].max_id + 1;

    const insertQuery = `
      INSERT INTO \`${env.GOOGLE_CLOUD_PROJECT}.${dataset}.research\` 
      (id, name1, name2, name3, name4, name5, name6, name7, name8, name9)
      VALUES (${newId}, '${value}', '${value}', '${value}', '${value}', '${value}', '${value}', '${value}', '${value}', '${value}')
    `;

    await bigquery.query({ query: insertQuery });
    return { 
      id: newId,
      name1: value,
      name2: value,
      name3: value,
      name4: value,
      name5: value,
      name6: value,
      name7: value,
      name8: value,
      name9: value
    };
  } catch (error) {
    console.error('Error creating research:', error);
    throw error;
  }
}
