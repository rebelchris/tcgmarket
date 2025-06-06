export default async function Page({
  params,
}: {
  params: Promise<{ card: string }>;
}) {
  await params;
  return null;
}
