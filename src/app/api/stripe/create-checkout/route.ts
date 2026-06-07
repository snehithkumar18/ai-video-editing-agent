import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';
import logger from '@/lib/logger';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const bodySchema = z.object({
      priceId: z.string().min(1, 'Price ID is required'),
    });

    const body = await request.json();
    const parsedBody = bodySchema.safeParse(body);

    if (!parsedBody.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid request body', details: parsedBody.error.flatten() },
        { status: 400 }
      );
    }

    const { priceId } = parsedBody.data;

    // Get user details to find or create customer
    const { data: userData } = await supabase
      .from('users')
      .select('stripe_customer_id, email, full_name')
      .eq('id', user.id)
      .single();

    let customerId = userData?.stripe_customer_id;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: userData?.email || user.email,
        name: userData?.full_name || '',
        metadata: {
          supabase_user_id: user.id
        }
      });
      customerId = customer.id;

      await supabase
        .from('users')
        .update({ stripe_customer_id: customerId })
        .eq('id', user.id);
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer: customerId,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${appUrl}/billing?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/billing?canceled=true`,
      metadata: {
        supabase_user_id: user.id
      }
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    logger.error('Stripe Checkout Error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
