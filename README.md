## 開発環境
- **Windows**
    - ブラウザ（`http://localhost:5173` などを開く）
    - Docker Desktop（コンテナ実行エンジン）
    - VSCode（WSL拡張でUbuntu側のフォルダを開く）
- **WSL2/Ubuntu-24.04（Linux）**
    - 実際の作業場所（コードは`~/work` 配下）
    - Git / ssh / Node（Volta）などの開発ツール
    - `docker compose` コマンドを叩いて開発環境を起動
- **Docker（Docker Desktop 経由）**
    - frontend / backend のコンテナを起動
    - compose でまとめて管理

## Ubuntu起動
```bash
wsl -d Ubuntu-24.04
```
上記は基本最初だけ、以降は**スタートメニューから起動**

## コンテナ起動
```bash
docker compose up --build
```
もしくはDocker Desktop でUIから起動