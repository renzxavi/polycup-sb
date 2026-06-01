export const POST = async ({ request }) => {
  try {
    const { recipeName, price, recipeId, bookingDate } = await request.json();

    const accessToken = import.meta.env.MERCADOPAGO_ACCESS_TOKEN;

    const mpRes = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        items: [{
          id:          recipeId || 'polycup-session',
          title:       `PolyCup: ${recipeName}`,
          description: `1:1 private coffee class — ${bookingDate}`,
          quantity:    1,
          currency_id: 'UYU',
          unit_price:  parseFloat(price) || 5,
        }],
        back_urls: {
          success: 'http://localhost:4321/dashboard',
          failure: 'http://localhost:4321/payment?status=failure',
          pending: 'http://localhost:4321/payment?status=pending',
        },
        external_reference: recipeId || '',
      }),
    });

    if (!mpRes.ok) {
      const err = await mpRes.text();
      console.error('MP error:', err);
      return new Response(JSON.stringify({ error: 'Mercado Pago error', detail: err }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const mpData = await mpRes.json();

    console.log('MP preference created:', mpData.id);
    console.log('initPoint:', mpData.init_point);

    return new Response(JSON.stringify({
      preferenceId: mpData.id,
      initPoint:    mpData.init_point,
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (err) {
    console.error('create-payment error:', err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};