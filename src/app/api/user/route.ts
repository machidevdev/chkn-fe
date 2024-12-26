import { prisma } from '@/lib/utils';
import { User } from '@prisma/client';

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
      subscriptions: {
        take: 1,
        orderBy: {
          createdAt: 'desc'
        }
      }
    },
  });

  if (!user) {
    return Response.json({ error: 'User not found', success: false }, { status: 404 });
  }

  return Response.json({ user, success: true }, { status: 200 });
}
