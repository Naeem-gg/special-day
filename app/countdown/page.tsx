import { CountdownDisplay } from "@/components/countdown-display"


export default async function CountdownPageShell({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  // Convert searchParams to a format that can be passed to client components
  const _searchParams = await searchParams
  const params = {
    id: _searchParams.id as string | undefined,
    title: _searchParams.title as string | undefined,
    yourName: _searchParams.your as string | undefined,
    partnerName: _searchParams.partner as string | undefined,
    date: _searchParams.date as string | undefined,
    message: _searchParams.message as string | undefined,
  }

  return (
      <CountdownDisplay initialParams={params} />
   
  )
}
