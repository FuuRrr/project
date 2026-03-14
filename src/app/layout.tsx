import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '渐变背景生成器',
  description: '使用色轮选择颜色，支持自由选择和智能推荐模式',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">{children}</body>
    </html>
  )
}
