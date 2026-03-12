import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

**GitHubに追加するファイル一覧：**
```
リポジトリのルート
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── main.jsx　← 新規追加
    └── App.jsx　← すでにある