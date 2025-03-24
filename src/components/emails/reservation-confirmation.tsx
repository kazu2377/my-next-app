import {
    Body,
    Button,
    Container,
    Heading,
    Hr,
    Html,
    Section,
    Text
} from '@react-email/components'

interface ReservationConfirmationProps {
  name: string
  date: string
  time: string
  email: string
  phone: string
  notes?: string | null
}

export function ReservationConfirmation({
  name,
  date,
  time,
  email,
  phone,
  notes
}: ReservationConfirmationProps) {
  // 日付をフォーマット
  const formattedDate = new Date(date).toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  return (
    <Html>
      <Body style={{ fontFamily: 'sans-serif', margin: '0 auto', padding: '20px 0', backgroundColor: '#f9fafb' }}>
        <Container style={{ maxWidth: '600px', margin: '0 auto', backgroundColor: '#ffffff', borderRadius: '8px', padding: '20px', boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)' }}>
          <Heading as="h1" style={{ textAlign: 'center', color: '#4F46E5' }}>
            予約確認
          </Heading>
          
          <Section style={{ marginBottom: '20px' }}>
            <Text style={{ fontSize: '16px', color: '#374151' }}>
              {name}様、ご予約ありがとうございます。
            </Text>
            <Text style={{ fontSize: '16px', color: '#374151' }}>
              以下の内容で予約を承りました。
            </Text>
          </Section>
          
          <Hr style={{ borderColor: '#E5E7EB', margin: '20px 0' }} />
          
          <Section style={{ backgroundColor: '#F3F4F6', padding: '15px', borderRadius: '6px', marginBottom: '20px' }}>
            <Text style={{ fontSize: '16px', fontWeight: 'bold', color: '#111827', marginBottom: '10px' }}>予約内容</Text>
            
            <Text style={{ fontSize: '14px', color: '#374151', margin: '5px 0' }}>
              <strong>お名前:</strong> {name}
            </Text>
            <Text style={{ fontSize: '14px', color: '#374151', margin: '5px 0' }}>
              <strong>日付:</strong> {formattedDate}
            </Text>
            <Text style={{ fontSize: '14px', color: '#374151', margin: '5px 0' }}>
              <strong>時間:</strong> {time}
            </Text>
            <Text style={{ fontSize: '14px', color: '#374151', margin: '5px 0' }}>
              <strong>メールアドレス:</strong> {email}
            </Text>
            <Text style={{ fontSize: '14px', color: '#374151', margin: '5px 0' }}>
              <strong>電話番号:</strong> {phone}
            </Text>
            {notes && (
              <Text style={{ fontSize: '14px', color: '#374151', margin: '5px 0' }}>
                <strong>備考:</strong> {notes}
              </Text>
            )}
          </Section>
          
          <Hr style={{ borderColor: '#E5E7EB', margin: '20px 0' }} />
          
          <Section style={{ marginBottom: '20px', textAlign: 'center' }}>
            <Text style={{ fontSize: '14px', color: '#374151', marginBottom: '15px' }}>
              予約内容の変更やキャンセルが必要な場合は、お電話またはメールにてお問い合わせください。
            </Text>
            
            <Button 
              href={`mailto:contact@example.com?subject=予約(${date} ${time})について`}
              style={{ 
                backgroundColor: '#4F46E5', 
                color: '#ffffff', 
                padding: '10px 18px', 
                textDecoration: 'none',
                borderRadius: '4px',
                fontWeight: 'bold'
              }}
            >
              お問い合わせ
            </Button>
          </Section>
          
          <Hr style={{ borderColor: '#E5E7EB', margin: '20px 0' }} />
          
          <Section style={{ textAlign: 'center' }}>
            <Text style={{ fontSize: '12px', color: '#6B7280' }}>
              ご不明な点がございましたら、お気軽にお問い合わせください。
            </Text>
            <Text style={{ fontSize: '12px', color: '#6B7280' }}>
              © 2024 予約システム All rights reserved.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
} 