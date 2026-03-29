export type PaymentService = {
  name: string
  amount: number
  price: number
  currency?: string
  jap_service_id?: number
}

export async function createPayment(service: PaymentService, accessToken: string): Promise<{ pay_url: string, order_id: string }> {
  const returnUrl = `${window.location.origin}/order`

  const res = await fetch(
    `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-invoice`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
      },
      body: JSON.stringify({ ...service, return_url: returnUrl }),
    }
  )

  const data = await res.json()
  if (!res.ok) throw new Error(data.error ?? 'Ошибка создания платежа')
  return { pay_url: data.pay_url, order_id: data.order_id }
}
