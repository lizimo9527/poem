@echo off
echo.
echo ========================================
echo    Vue 3 项目快速启动脚本
echo ========================================
echo.

echo 正在检查 Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ 错误: 未找到 Node.js，请先安装 Node.js
    echo 下载地址: https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js 已安装
node --version

echo.
echo 正在检查项目依赖...
if not exist "node_modules" (
    echo 📦 正在安装依赖包...
    call npm install
    if errorlevel 1 (
        echo ❌ 依赖安装失败，请检查网络连接
        pause
        exit /b 1
    )
) else (
    echo ✅ 依赖已安装
)

echo.
echo 🚀 正在启动开发服务器...
echo 启动后请访问: http://localhost:5173
echo 按 Ctrl+C 可停止服务器
echo.

call npm run dev

pause