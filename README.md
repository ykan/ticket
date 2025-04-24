# 环境要求

- node ^22
- pnpm ^8

# 开发脚本

```bash
~ pnpm dev    # 启动开发环境
~ pnpm commit # 提交代码
~ pnpm format # 格式化代码
~ pnpm lint   # 检查代码
```

## 拉取环境变量

```bash
~ pnpm i -g vercel
~ vercel login
~ vercel link
~ vercel env pull
```

## 同步数据库类型

```bash
~ brew install supabase/tap/supabase # pnpm 安装的有问题
~ supabase login
~ supabase gen types typescript --project-id "$PROJECT_ID" --schema public > lib/supabase.types.ts
```

# 常用资源

- [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts)
  - [Geist](https://vercel.com/font)
- 全栈方案：[Next.js Documentation](https://nextjs.org/docs)
- 部署：[Vercel](https://vercel.com/)
- 用户&权限：[Clerk](https://dashboard.clerk.com/)
- 数据库：[Supabase](https://supabase.com/)
