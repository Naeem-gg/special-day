import PreviewLandingClient from "./PreviewLandingClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Preview Your Invitation | DNvites",
  description: "Try any of our beautiful wedding invitation templates for free. See how your details look instantly.",
};

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

export default async function PreviewLandingPage(props: {
  searchParams: SearchParams
}) {
  const searchParams = await props.searchParams;
  
  const initialParams = {
    brideName: searchParams.brideName as string | undefined,
    groomName: searchParams.groomName as string | undefined,
    dateStr: searchParams.dateStr as string | undefined,
    template: searchParams.template as string | undefined,
  };

  const error = searchParams.error as string | undefined;

  return (
    <PreviewLandingClient 
      initialParams={initialParams} 
      error={error} 
    />
  );
}
