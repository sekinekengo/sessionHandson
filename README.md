# Spring Boot（Tomcat）＋ React による最小ログイン・セッション共有ハンズオン

## プロジェクト構成

- `business-app/`: 業務用Spring Bootアプリケーション（ログイン機能と業務機能を含む）
- `login-spa/`: ログイン用React SPA（ポート3000）
- `business-spa/`: 実務用React SPA（ポート3001）
- `handson.md`: ハンズオンドキュメント

## セットアップ

### Java 21の設定

SDKMANでJava 21を使用する場合：

```bash
export JAVA_HOME=~/.sdkman/candidates/java/21.0.8-tem
export PATH=$JAVA_HOME/bin:$PATH
```

または、SDKMANで切り替え：

```bash
sdk use java 21.0.8-tem
```

### バックエンドのビルド

```bash
cd business-app
mvn clean package
```

生成されたWARファイル: `target/business-app.war`

### Tomcatへのデプロイ

プロジェクトには既にTomcat 10.1.20が含まれています。

1. WARファイルをビルド後、自動的に`tomcat/webapps/`に配置されます

2. Tomcatの起動：
   ```bash
   ./tomcat-start.sh
   ```

3. Tomcatの停止：
   ```bash
   ./tomcat-stop.sh
   ```

4. アクセスURL：
   - ログイン用：`http://localhost:8080/business-app/api/login`
   - セッション確認：`http://localhost:8080/business-app/api/session`
   - ログアウト：`http://localhost:8080/business-app/api/logout`
   - 業務用：`http://localhost:8080/business-app/api/data`

**注意**: Tomcat起動スクリプトはJava 21を使用します。Java 21がSDKMANにインストールされている必要があります。

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

