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

-- リサーチテーブルの作成
CREATE TABLE IF NOT EXISTS `research` (
    id INT64,
    name1 STRING,
    name2 STRING,
    name3 STRING,
    name4 STRING,
    name5 STRING,
    name6 STRING,
    name7 STRING,
    name8 STRING,
    name9 STRING
);
