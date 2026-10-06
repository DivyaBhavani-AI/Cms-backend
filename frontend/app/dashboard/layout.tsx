import Link from 'next/link'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <aside className="w-48 border-r p-4">
        <nav className="flex flex-col gap-2">
          <Link href="/dashboard/about">About</Link>
          <Link href="/dashboard/skills">Skills</Link>
          <Link href="/dashboard/projects">Projects</Link>
          <Link href="/dashboard/blogs">Blogs</Link>
          <Link href="/dashboard/experience">Experience</Link>
          <Link href="/dashboard/service">Service</Link>
          <Link href="/dashboard/testimonials">Testimonials</Link>
          <Link href="/dashboard/contact">Contact Message</Link>
        </nav>
      </aside>
      <main className="flex-1 p-6">{children}</main>
    </div>
  )
}