# Spring Boot（Tomcat）＋ React による最小ログイン・セッション共有ハンズオン

本ドキュメントは、Tomcat で管理される1つのSpring Bootアプリケーション内でログイン機能と業務機能を分離し、複数 SPA（React）間で同じセッション ID（JSESSIONID）を共有する最小構成をまとめたものである。

## 注意事項

- **認証方式**：本ハンズオンでは簡易的な認証のため、パスワードの平文比較を使用している。本番環境では適切なハッシュ化や認証ライブラリを使用すること。
- **データベース**：本ハンズオンではデータベースを使用しない。ユーザー情報はハードコードされた値（username: "testuser", password: "secret"）で検証する。

## 全体構成

- **バックエンド**：
  - 業務用アプリケーション（Spring Boot WAR → Tomcat にデプロイ）
    - ログイン用コントローラ（`/api/login`, `/api/session`, `/api/logout`）
    - 業務用コントローラ（`/api/data`）
  - 同一アプリケーション内のため、セッションは自動的に共有される
- **フロントエンド**：
  - ログイン用 SPA（React）
  - 実務用 SPA（React）
- **通信**：Fetch（credentials: include）
- **セッション**：Spring 標準 HttpSession（Tomcat で管理、同一アプリケーション内で共有）

## 1. プロジェクト構成

1つのSpring Bootプロジェクト（business-app）を作成し、ログイン用と業務用のコントローラを含める。

### 1-1. 業務用アプリケーション（business-app）

#### pom.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 
         https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.2.0</version>
        <relativePath/>
    </parent>
    
    <groupId>com.example</groupId>
    <artifactId>business-app</artifactId>
    <version>0.0.1-SNAPSHOT</version>
    <packaging>war</packaging>
    
    <name>business-app</name>
    <description>Business Application</description>
    
    <properties>
        <java.version>21</java.version>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    </properties>
    
    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
    </dependencies>
    
    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
        <finalName>business-app</finalName>
    </build>
</project>
```

#### メインクラス

```java
@SpringBootApplication
public class BusinessApp extends SpringBootServletInitializer {
    public static void main(String[] args) {
        SpringApplication.run(BusinessApp.class, args);
    }
}
```

#### ログイン用コントローラ

```java
@RestController
@RequestMapping("/api")
public class LoginController {
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(
        @RequestParam String username,
        @RequestParam String password,
        HttpSession session
    ) {
        boolean ok = username.equals("testuser") && password.equals("secret");
        if (ok) {
            session.setAttribute("user", username);
            return ResponseEntity.ok(Map.of("success", true));
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("success", false, "error", "Invalid username or password"));
        }
    }

    @GetMapping("/session")
    public Map<String, Object> session(HttpSession session) {
        Object user = session.getAttribute("user");
        return (user != null)
            ? Map.of("loggedIn", true, "user", user)
            : Map.of("loggedIn", false);
    }

    @PostMapping("/logout")
    public Map<String, Object> logout(HttpSession session) {
        session.invalidate();
        return Map.of("success", true);
    }
}
```

#### 業務用コントローラ

```java
@RestController
@RequestMapping("/api")
public class BusinessController {
    @GetMapping("/data")
    public ResponseEntity<Map<String, Object>> getData(HttpSession session) {
        Object user = session.getAttribute("user");
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Not logged in"));
        }
        // 実務処理
        return ResponseEntity.ok(Map.of("data", "business data", "user", user));
    }
}
```

## 2. CORS 設定

複数のSPA（例：localhost:3000, localhost:3001）からアクセスできるよう、複数のオリジンを許可する。

```java
@Configuration
public class BusinessWebConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:3000", "http://localhost:3001")
                .allowedMethods("GET", "POST")
                .allowCredentials(true);
    }
}
```

## 3. Tomcat へのデプロイ

1. アプリケーションを WAR ファイルとしてビルド：
   ```bash
   cd business-app
   mvn clean package
   ```

2. 生成された WAR ファイルを Tomcat の `webapps` ディレクトリに配置：
   - `business-app.war` → `$CATALINA_HOME/webapps/business-app.war`

3. Tomcat を起動すると、以下の URL でアクセス可能：
   - ログイン用：`http://localhost:8080/business-app/api/login`
   - セッション確認：`http://localhost:8080/business-app/api/session`
   - ログアウト：`http://localhost:8080/business-app/api/logout`
   - 業務用：`http://localhost:8080/business-app/api/data`

**注意**：同一アプリケーション内のため、セッションは自動的に共有されます。`context.xml`の設定は不要です。

## 4. React

### 4-1. ログイン用 SPA

#### ログイン

```javascript
const response = await fetch("http://localhost:8080/business-app/api/login", {
  method: "POST",
  headers: { "Content-Type": "application/x-www-form-urlencoded" },
  body: new URLSearchParams({ username, password }),
  credentials: "include"
});

const data = await response.json();
if (response.ok && data.success) {
  // ログイン成功
} else {
  // ログイン失敗（data.error にエラーメッセージが含まれる）
  console.error(data.error || "Login failed");
}
```

#### セッション確認

```javascript
const response = await fetch("http://localhost:8080/business-app/api/session", {
  method: "GET",
  credentials: "include"
});

const data = await response.json();
if (data.loggedIn) {
  // ログイン済み（data.user にユーザー名が含まれる）
} else {
  // 未ログイン状態
}
```

#### ログアウト

```javascript
const response = await fetch("http://localhost:8080/business-app/api/logout", {
  method: "POST",
  credentials: "include"
});

const data = await response.json();
if (data.success) {
  // ログアウト成功
}
```

### 4-2. 実務用 SPA

#### データ取得（セッション確認含む）

```javascript
const response = await fetch("http://localhost:8080/business-app/api/data", {
  method: "GET",
  credentials: "include"
});

const data = await response.json();
if (response.ok) {
  // ログイン済み（data.data に実務データ、data.user にユーザー名が含まれる）
} else if (response.status === 401) {
  // 未ログイン状態（data.error に "Not logged in" が含まれる）
  console.error(data.error);
}
```

## 5. 確認手順

### 5-1. セッション共有の確認（SPA間）

1. ログイン用 SPA（localhost:3000）でログイン（username: "testuser", password: "secret"）
2. 実務用 SPA（localhost:3001）から `business-app/api/data` を叩く
3. レスポンスステータスが 200 で、データが取得できればセッション共有成功

### 5-2. エラーハンドリングの確認

1. **ログイン失敗**：間違った認証情報でログインを試みる
   - レスポンスステータスが 401（UNAUTHORIZED）であること
   - レスポンスボディに `{"success": false, "error": "Invalid username or password"}` が含まれること

2. **未ログイン状態でのアクセス（セッション確認）**：ログインせずに `business-app/api/session` を叩く
   - レスポンスボディに `{"loggedIn": false}` が返されること

3. **未ログイン状態でのアクセス（業務用API）**：ログインせずに `business-app/api/data` を叩く
   - レスポンスステータスが 401（UNAUTHORIZED）であること
   - レスポンスボディに `{"error": "Not logged in"}` が含まれること

4. **ログアウト**：ログイン後にログアウト API を叩き、その後各 API を確認
   - ログアウト後、`business-app/api/session` で `{"loggedIn": false}` が返されること
   - ログアウト後、`business-app/api/data` で 401 エラーが返されること
