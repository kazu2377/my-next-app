import { ReservationConfirmation } from '@/components/emails/reservation-confirmation'
import { ReservationType } from '@/lib/supabase'
import { Resend } from 'resend'

// APIキーを環境変数から取得
const resendApiKey = process.env.RESEND_API_KEY

// Resendクライアントを初期化
const resend = resendApiKey ? new Resend(resendApiKey) : null

interface SendReservationConfirmationParams {
  reservation: Omit<ReservationType, 'id' | 'created_at'>
}

export interface EmailResponse {
  success: boolean
  error?: string | unknown
}

/**
 * 予約確認メールを送信する関数
 */
export async function sendReservationConfirmation({ 
  reservation 
}: SendReservationConfirmationParams): Promise<EmailResponse> {
  // APIキーが設定されていない場合はエラーを返す
  if (!resend) {
    console.error('Resend API キーが設定されていません')
    return { 
      success: false, 
      error: 'メール送信サービスが正しく設定されていません'
    }
  }

  const { name, email, phone, date, time, notes } = reservation

  if (!email) {
    return { 
      success: false, 
      error: 'メールアドレスが指定されていません'
    }
  }

  try {
    const { error } = await resend.emails.send({
      from: `予約システム <${process.env.RESEND_FROM_EMAIL || 'reservations@example.com'}>`,
      to: email,
      subject: `【予約確認】${date} ${time}のご予約`,
      react: ReservationConfirmation({ 
        name, 
        date, 
        time, 
        email,
        phone,
        notes
      })
    })

    if (error) {
      console.error('メール送信エラー:', error)
      return { success: false, error }
    }

    return { success: true }
  } catch (error) {
    console.error('メール送信エラー:', error)
    return { success: false, error }
  }
} 