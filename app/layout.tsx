import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '渐变背景生成器',
  description: '一个用于生成随机渐变背景的Next.js应用',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  )
}
