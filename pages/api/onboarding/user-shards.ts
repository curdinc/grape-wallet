import { NextApiRequest, NextApiResponse } from 'next';
import { unstable_getServerSession } from 'next-auth';
import { z } from 'zod';
import { authOptions } from '../auth/[...nextauth]';

const UserShardApiSchema = z.object({
  encryptedShare: z.string(),
  regularShare: z.string(),
  walletAddress: z.string(),
});
type UserSharedApiType = z.infer<typeof UserShardApiSchema>;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(400).json({ error: 'Unsupported Method' });
  }
  let inputs: UserSharedApiType;
  try {
    inputs = UserShardApiSchema.parse(req.body);
  } catch (e) {
    return res.status(400).json({ error: 'Invalid Request' });
  }

  const session = await unstable_getServerSession(req, res, authOptions);
  if (session) {
    // Signed in
    const user = await prisma?.user.findUnique({
      where: {
        email: session.user?.email || '',
      },
    });

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }
    console.log('Session', JSON.stringify(session, null, 2));

    try {
      const result = await prisma?.userWalletShards.createMany({
        data: [
          {
            isEncrypted: true,
            shard: inputs.encryptedShare,
            walletAddress: inputs.walletAddress,
            userId: user?.id,
          },
          {
            isEncrypted: false,
            shard: inputs.regularShare,
            walletAddress: inputs.walletAddress,
            userId: user?.id,
          },
        ],
      });
      console.log('result', result);
      return res.status(200).json(result);
    } catch (e) {
      return res
        .status(500)
        .json({ error: 'Unable to secure your account at this point in time. Try again in a bit' });
    }
  }

  return res.status(401).json({ error: 'Unauthorised' });
}
