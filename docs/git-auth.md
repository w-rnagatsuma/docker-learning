WSL上で作成したプロジェクトをgithub管理しようとした際に、認証エラーでプッシュできない問題が発生
→ssh認証を設定することで解消したので、その手順をまとめる。

## 1. SSH鍵を作る（WSL側）
```bash
ssh-keygen -t ed25519 -C "w-rnagatsuma"
```
質問が出たら基本は：
- 保存先→Enter（`~/.ssh/id_ed25519`）
- パスフレーズ→任意（空でもOK、今回は入れた）

## 2. 公開鍵を確認
```bash
cat ~/.ssh/id_ed25519.pub
```
⚠️ `~/.ssh/id_ed25519`は秘密鍵。別物なので注意

## 3. GitHubに公開鍵を登録
GitHub > Settings > SSH and GPG keys > New SSH key<br>
Key欄に`id_ed25519.pub`の中身（１行）を貼る

## 4. SSH接続テスト
```bash
ssh -T git@github.com
```
初回だけ聞かれる：
- `Are you sure you want to continue connectings?` → `yes`

その後、パスフレーズを聞かれたら入力。

接続成功の場合：
- `Hi w-rnagatsuma! You've successfully authenticated, but GitHub does not provide shell access.`

## 5. GitのremoteをHTTPS → SSHに変更
```bash
git remote -v
git remote set-url origin <ssh-url>
git remote -v

# 例
git remote set-url origin git@github.com:w-rnagatsuma/docker-learning.git
```
`git remot -v`が`git@github.com:...`になていればOK。

## 6. push
```bash
git push -u origin main
```

## 7. パスフレーズを毎回聞かれないようにする（任意）
### そのターミナルセッション中だけ覚えさせる場合：
```bash
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519
```

### 毎回自動で`ssh-agent`を起動させる場合：

まずはシェルを確認
```bash
echo $SHELL
```
- `/bin/bash`なら`.bashrc`
- `/bin/zsh`なら`.zshrc`

`.bashrc`に追記
```bash
cat >> ~/.bashrc <<'EOF'

# ---- SSH Agent Auto Start (WSL) ----
# Start ssh-agent if not running, and set env vars.
if [ -z "$SSH_AUTH_SOCK" ] || ! ssh-add -l >/dev/null 2>&1; then
  # If agent info is cached, load it; otherwise start a new agent.
  if [ -f "$HOME/.ssh/agent_env" ]; then
    . "$HOME/.ssh/agent_env" >/dev/null 2>&1
  fi

  if [ -z "$SSH_AUTH_SOCK" ] || ! kill -0 "$SSH_AGENT_PID" >/dev/null 2>&1; then
    eval "$(ssh-agent -s)" >/dev/null
    echo "export SSH_AUTH_SOCK=$SSH_AUTH_SOCK" > "$HOME/.ssh/agent_env"
    echo "export SSH_AGENT_PID=$SSH_AGENT_PID" >> "$HOME/.ssh/agent_env"
    chmod 600 "$HOME/.ssh/agent_env"
  fi

  # Try adding default key (will prompt passphrase if needed)
  ssh-add "$HOME/.ssh/id_ed25519" >/dev/null 2>&1
fi
# -----------------------------------

EOF
```

上記を反映
```bash
exec $SHELL -l
```

### 挙動
- WSL起動時にagentが立つ
- 必要なら`ssh-add` が走る<br>
  →**パスフレーズは最初の１回だけ**（そのWSLセッション中は基本聞かれない）

### うまく動いているか確認
WSLを開きなおして：
```bash
ssh-add -l
```
- 鍵が読み込まれていれば、鍵のfingerprintが出ます
- `The agent has no identities.` ならまだ読み込まれてない（`.bashrc` の追記が効いてない等）