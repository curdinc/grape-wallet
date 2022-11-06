import { NextApiRequest, NextApiResponse } from 'next';
import { unstable_getServerSession } from 'next-auth';
import { z } from 'zod';
import { authOptions } from '../auth/[...nextauth]';

const NewWalletApiSchema = z.object({
  walletAddress: z.string(),
});
type NewWalletApiType = z.infer<typeof NewWalletApiSchema>;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(400).json({ error: 'Unsupported Method' });
  }

  let inputs: NewWalletApiType;
  try {
    inputs = NewWalletApiSchema.parse(req.body);
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

    const result = await prisma?.userWalletDetails.create({
      data: {
        signingPublicKey: inputs.walletAddress,
        walletAddress: inputs.walletAddress,
        userId: user?.id,
      },
    });
    console.log('result', result);
    return res.status(200).json(result);
  }

  return res.status(401).json({ error: 'Unauthorised' });
}
