# Spring Boot（Tomcat）＋ React による最小ログイン・セッション共有ハンズオン

## プロジェクト構成

- `login-app/`: ログイン用Spring Bootアプリケーション
- `business-app/`: 実務用Spring Bootアプリケーション
- `login-spa/`: ログイン用React SPA（ポート3000）
- `business-spa/`: 実務用React SPA（ポート3001）
- `handson.md`: ハンズオンドキュメント

## セットアップ

### バックエンドのビルド

#### ログイン用アプリケーション

```bash
cd login-app
mvn clean package
```

生成されたWARファイル: `target/login-app.war`

#### 実務用アプリケーション

```bash
cd business-app
mvn clean package
```

生成されたWARファイル: `target/business-app.war`

### Tomcatへのデプロイ

1. WARファイルをTomcatの`webapps`ディレクトリに配置：
   - `login-app.war` → `$CATALINA_HOME/webapps/login-app.war`
   - `business-app.war` → `$CATALINA_HOME/webapps/business-app.war`

2. Tomcatを起動

3. アクセスURL：
   - ログイン用：`http://localhost:8080/login-app/api/...`
   - 実務用：`http://localhost:8080/business-app/api/...`

### フロントエンドの起動

#### ログイン用SPA

```bash
cd login-spa
npm install
npm run dev
```

ポート3000で起動

#### 実務用SPA

```bash
cd business-spa
npm install
npm run dev
```

ポート3001で起動

## 動作確認

1. ログイン用SPA（http://localhost:3000）でログイン
   - ユーザー名: `testuser`
   - パスワード: `secret`

2. 実務用SPA（http://localhost:3001）でデータ取得ボタンをクリック
   - セッションが共有されていれば、データが表示される

詳細は`handson.md`を参照してください。

