-- グループテーブルの作成
CREATE TABLE IF NOT EXISTS `groups` (
    id INT64,
    name STRING
);

-- ユーザーテーブルの作成
CREATE TABLE IF NOT EXISTS `users` (
    id INT64,
    name STRING,
    group_id INT64
);

-- 初期データの挿入（グループ）
INSERT INTO `groups` (id, name) VALUES
    (1, 'マーケティング部'),
    (2, '営業部'),
    (3, '開発部');
