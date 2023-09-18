import React from 'react'
import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Login | Admoon",
    description: "Login page",
  };
}

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children
}
