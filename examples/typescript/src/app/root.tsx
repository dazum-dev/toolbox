import type { FC, JSX, PropsWithChildren } from 'react'

export const Layout: FC = ({ children }: PropsWithChildren): JSX.Element => {
  return (
    <html lang='en'>
      <head>
        <meta charSet='utf-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />

        {/* <Meta />
        <Scripts />
        <Links /> */}
      </head>
      <body>{children}</body>
    </html>
  )
}

export default function App() {
  return <h1>Welcome to Toolbox v0.1</h1>
}
