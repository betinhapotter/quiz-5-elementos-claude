import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET() {
  try {
    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#FFF9F5',
            backgroundImage: 'radial-gradient(circle at 25px 25px, #F3E5D8 2%, transparent 0%), radial-gradient(circle at 75px 75px, #F3E5D8 2%, transparent 0%)',
            backgroundSize: '100px 100px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '20px',
            }}
          >
            {/* Emojis dos 5 elementos */}
            <div
              style={{
                display: 'flex',
                gap: '15px',
                fontSize: '80px',
              }}
            >
              <span>🌍</span>
              <span>💧</span>
              <span>🌬️</span>
              <span>🔥</span>
              <span>✨</span>
            </div>
          </div>

          <div
            style={{
              marginTop: '40px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              padding: '0 80px',
            }}
          >
            <h1
              style={{
                fontSize: '60px',
                fontWeight: 'bold',
                color: '#2D1B4E',
                marginBottom: '20px',
                lineHeight: 1.2,
              }}
            >
              Quiz dos 5 Elementos
            </h1>
            <p
              style={{
                fontSize: '32px',
                color: '#6B4E71',
                margin: 0,
                lineHeight: 1.4,
              }}
            >
              Descubra qual elemento está desalinhado no seu relacionamento
            </p>
          </div>

          <div
            style={{
              position: 'absolute',
              bottom: '40px',
              fontSize: '24px',
              color: '#9D7E9E',
              fontWeight: '600',
            }}
          >
            por Jaya Roberta
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: any) {
    console.log(`${e.message}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
