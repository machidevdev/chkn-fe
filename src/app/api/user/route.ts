import { prisma } from '@/lib/utils';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get('address');
  const user = await prisma.user.findUnique({
    where: {
      address: address as string,
    },
    select: {
      id: true,
      address: true,
      createdAt: true,
      credits: true,
      creditsUsed: true,
      subscriptions: {
        where: {
          expiresAt: {
            gt: new Date(),
          },
        },
        orderBy: {
          expiresAt: 'desc',
        },
        take: 1,
      },
    },
  });

  if (!user) {
    return Response.json({ error: 'User not found', success: false }, { status: 404 });
  }
  return Response.json({ user, success: true }, { status: 200 });
}
